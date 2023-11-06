import express from 'express'
import { authController } from '@controllers/auth'
import { profileController } from '@controllers/profile'
import { authService } from '@services/auth'
import { userController } from '@controllers/users'

export const router = express.Router()

router.use('/auth', authController)
router.use('/profile', authService.verifyAccessToken, profileController)
router.use('/users', userController)
