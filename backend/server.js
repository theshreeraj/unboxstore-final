require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const connectDB = require('./src/config/db')
const routes = require('./src/routes')
const { notFound, errorHandler } = require('./src/middleware/errorHandler')
const { razorpayWebhook } = require('./src/controllers/paymentController')

const app = express()

app.use(
  cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean),
    credentials: true,
  })
)


app.use(cookieParser())
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// Razorpay needs the raw request body to verify the webhook signature, so this
// route is mounted before the global JSON body parser.
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), razorpayWebhook)

app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Atelier API is running' }))
app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })

module.exports = app
