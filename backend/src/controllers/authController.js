const asyncHandler = require('../middleware/asyncHandler')
const ApiError = require('../utils/ApiError')
const User = require('../models/User')
const { sendTokenResponse } = require('../utils/generateToken')

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body
  if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required')

  const exists = await User.findOne({ email: email.toLowerCase() })
  if (exists) throw new ApiError(409, 'An account with this email already exists')

  const user = await User.create({ name, email, password, phone })
  sendTokenResponse(user, 201, res)
})

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new ApiError(400, 'Email and password are required')

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }
  if (user.status === 'Suspended') throw new ApiError(403, 'Account suspended')

  sendTokenResponse(user, 200, res)
})

// POST /api/auth/admin-login — same credentials check, but requires staff/admin role
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) throw new ApiError(400, 'Email and password are required')

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }
  if (!['admin', 'staff'].includes(user.role)) throw new ApiError(403, 'Not an admin account')

  sendTokenResponse(user, 200, res)
})

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token')
  res.json({ success: true, message: 'Logged out' })
})

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user })
})

module.exports = { register, login, adminLogin, logout, getMe }
