import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const addComment = async (req, res) => {
  const { postId } = req.params
  const { text } = req.body

  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        postId: Number(postId),
        authorId: req.user.id
      },
      include: { author: true }
    })
    res.json(comment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const getComments = async (req, res) => {
  const { postId } = req.params

  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      orderBy: { createdAt: 'asc' },
      include: { author: true }
    })

    const formatted = comments.map(c => ({
      id: c.id,
      text: c.text,
      author: c.author.username,
      createdAt: c.createdAt
    }))

    res.json(formatted)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}