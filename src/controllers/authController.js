import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const register = async (req, res) => {
  const { username, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword }
    })
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    res.json({ token, user: { id: user.id, username, email } })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(400).json({ message: 'User not found' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
  res.json({ token, user: { id: user.id, username: user.username, email } })
}