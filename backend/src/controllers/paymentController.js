const crypto = require('crypto')
const asyncHandler = require('../middleware/asyncHandler')
const ApiError = require('../utils/ApiError')
const Order = require('../models/Order')
const { createInvoice, decrementStockAndCount, fulfillShipment } = require('./orderController')

async function markOrderPaid(order) {
  if (order.paymentStatus === 'Paid') return // idempotent — webhook + client verify can race
  order.paymentStatus = 'Paid'
  await order.save()
  await decrementStockAndCount(order.items)
  await createInvoice(order)
  fulfillShipment(order) // fire and forget
}

// POST /api/payments/verify — called by the client right after Razorpay checkout succeeds
const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, 'Missing payment verification fields')
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, 'Payment signature verification failed')
  }

  const order = await Order.findById(orderId)
  if (!order) throw new ApiError(404, 'Order not found')
  if (order.razorpay.orderId !== razorpay_order_id) throw new ApiError(400, 'Order mismatch')

  order.razorpay.paymentId = razorpay_payment_id
  order.razorpay.signature = razorpay_signature
  await markOrderPaid(order)

  res.json({ success: true, order })
})

// POST /api/payments/webhook — server-to-server safety net, configured in the Razorpay dashboard
const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature']
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
    .update(req.body) // raw Buffer — see server.js route mounting
    .digest('hex')

  if (signature !== expected) return res.status(400).json({ success: false, message: 'Invalid webhook signature' })

  const payload = JSON.parse(req.body.toString('utf8'))

  if (payload.event === 'payment.captured') {
    const razorpayOrderId = payload.payload.payment.entity.order_id
    const order = await Order.findOne({ 'razorpay.orderId': razorpayOrderId })
    if (order) {
      order.razorpay.paymentId = payload.payload.payment.entity.id
      await markOrderPaid(order)
    }
  }

  res.json({ received: true })
})

module.exports = { verifyPayment, razorpayWebhook }
