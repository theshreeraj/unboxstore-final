const PDFDocument = require('pdfkit')
const asyncHandler = require('../middleware/asyncHandler')
const ApiError = require('../utils/ApiError')
const Invoice = require('../models/Invoice')

// GET /api/invoices (admin)
const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find().populate('order', 'orderNumber items total').sort({ createdAt: -1 })
  res.json({ success: true, invoices })
})

// GET /api/invoices/:id
const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate('order')
  if (!invoice) throw new ApiError(404, 'Invoice not found')
  res.json({ success: true, invoice })
})

// GET /api/invoices/:id/pdf
const downloadInvoicePdf = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate('order')
  if (!invoice) throw new ApiError(404, 'Invoice not found')

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=${invoice.invoiceNumber}.pdf`)

  const doc = new PDFDocument({ margin: 50 })
  doc.pipe(res)

  doc.fontSize(20).text('ATELIER', { continued: true }).fontSize(10).text('  Tax Invoice', { align: 'right' })
  doc.moveDown()
  doc.fontSize(10).fillColor('#666').text(`Invoice: ${invoice.invoiceNumber}`)
  doc.text(`Date: ${invoice.createdAt.toDateString()}`)
  doc.text(`Order: ${invoice.order?.orderNumber || '-'}`)
  doc.text(`Billed to: ${invoice.customer} (${invoice.email})`)
  doc.moveDown()

  doc.fillColor('#000').fontSize(11).text('Items', { underline: true })
  doc.moveDown(0.5)
  ;(invoice.order?.items || []).forEach((item) => {
    doc.fontSize(10).text(`${item.name}  (${item.color}/${item.size})  x${item.quantity}`, { continued: true })
    doc.text(`₹${item.price * item.quantity}`, { align: 'right' })
  })

  doc.moveDown()
  doc.fontSize(12).text(`Total: ₹${invoice.amount}`, { align: 'right' })
  doc.fontSize(10).fillColor('#666').text(`Status: ${invoice.status}`, { align: 'right' })

  doc.end()
})

module.exports = { getInvoices, getInvoice, downloadInvoicePdf }
