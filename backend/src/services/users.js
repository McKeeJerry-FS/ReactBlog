import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../db/models/user.js'

export async function createUser({ username, password }) {
  const normalizedUsername = String(username || '').trim()

  if (!normalizedUsername || !password) {
    throw new Error('Username and password are required')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({
    username: normalizedUsername,
    password: hashedPassword,
  })
  return await user.save()
}

export async function loginUser({ username, password }) {
  const normalizedUsername = String(username || '').trim()

  if (!normalizedUsername || !password) {
    throw new Error('Username and password are required')
  }

  const user = await User.findOne({ username: normalizedUsername })
  if (!user) {
    throw new Error('User not found')
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new Error('Incorrect password')
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not configured')
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
  return { token }
}

export async function getUserInfoById(userId) {
  try {
    const user = await User.findById(userId)
    if (!user) return { username: userId }
    return { username: user.username }
  } catch (error) {
    return { username: userId }
  }
}
