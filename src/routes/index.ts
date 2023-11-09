import express from 'express'
import { authController } from '@controllers/auth'
import { profileController } from '@controllers/profile'
import { authService } from '@services/auth'

export const router = express.Router()

router.use('/auth', authController)
router.use('/profile', authService.verifyAccessToken, profileController)
