import express from 'express'
import { authController } from '@controllers/auth'
import { userController } from '@controllers/users'
import { authService } from '@services/auth'

export const router = express.Router()

router.use('/auth', authController)
router.use('/user', authService.verifyAccessToken, userController)
