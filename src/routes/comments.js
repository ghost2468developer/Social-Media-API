import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { addComment, getComments } from '../controllers/commentController.js'

const router = express.Router()

router.post('/:postId', authMiddleware, addComment)

router.get('/:postId', getComments)

export default router