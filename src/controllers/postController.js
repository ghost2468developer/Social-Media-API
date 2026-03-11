import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const createPost = async (req, res) => {
  const { content } = req.body
  try {
    const post = await prisma.post.create({
      data: {
        content,
        authorId: req.user.id,
      },
      include: { author: true }
    })
    res.json(post)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        comments: true,
        likes: true
      }
    })

    const formatted = posts.map(post => ({
      id: post.id,
      content: post.content,
      author: post.author.username,
      createdAt: post.createdAt,
      likesCount: post.likes.length,
      commentsCount: post.comments.length
    }))

    res.json(formatted)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const likePost = async (req, res) => {
  const { postId } = req.params
  try {
    const like = await prisma.like.create({
      data: {
        postId: Number(postId),
        userId: req.user.id
      }
    })
    res.json({ message: 'Post liked!', like })
  } catch (err) {
    res.status(400).json({ message: 'You may have already liked this post.' })
  }
}

export const unlikePost = async (req, res) => {
  const { postId } = req.params
  try {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId: Number(postId)
        }
      }
    })
    res.json({ message: 'Post unliked!' })
  } catch (err) {
    res.status(400).json({ message: 'You haven’t liked this post yet.' })
  }
}