const router = require('express').Router()
const { optionalAuth } = require('../middleware/auth')
const { verifyPayment } = require('../controllers/paymentController')

router.post('/verify', optionalAuth, verifyPayment)

module.exports = router
