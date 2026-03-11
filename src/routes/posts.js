import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { createPost, getPosts, likePost, unlikePost } from '../controllers/postController.js'

const router = express.Router()

router.post('/', authMiddleware, createPost)

router.get('/', getPosts)

router.post('/:postId/like', authMiddleware, likePost)

router.post('/:postId/unlike', authMiddleware, unlikePost)

export default router