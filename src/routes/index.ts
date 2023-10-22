import express from 'express'
import { authController } from '@controllers/auth'

export const router = express.Router()

router.use('/auth', authController)
