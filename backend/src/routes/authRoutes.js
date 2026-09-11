const router = require('express').Router()
const { protect } = require('../middleware/auth')
const { register, login, adminLogin, logout, getMe } = require('../controllers/authController')

router.post('/register', register)
router.post('/login', login)
router.post('/admin-login', adminLogin)
router.post('/logout', logout)
router.get('/me', protect, getMe)

module.exports = router
