const prisma = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })

exports.register = async (req, res, next) => {
  try {
    const { email, name, password } = req.body
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Email, name and password are required' })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ message: 'Email already in use' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { email, name, passwordHash } })
    const token = signToken(user.id)
    const { passwordHash: _, ...userData } = user
    res.status(201).json({ token, user: userData })
  } catch (err) { next(err) }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = signToken(user.id)
    const { passwordHash: _, ...userData } = user
    res.json({ token, user: userData })
  } catch (err) { next(err) }
}

exports.logout = (_req, res) => res.json({ message: 'Logged out' })

exports.me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } })
    if (!user) return res.status(404).json({ message: 'User not found' })
    const { passwordHash: _, ...userData } = user
    res.json(userData)
  } catch (err) { next(err) }
}

exports.updateMe = async (req, res, next) => {
  try {
    const { name, avatar, currency, timezone } = req.body
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: { name, avatar, currency, timezone }
    })
    const { passwordHash: _, ...userData } = user
    res.json(userData)
  } catch (err) { next(err) }
}
