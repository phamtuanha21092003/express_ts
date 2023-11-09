import express, { Response, Request } from 'express'
import { validator } from '@services/validator/auth'
import { authService } from '@services/auth'
import { joiService } from '@services/validator/joi'

export const authController = express.Router()

authController.post('/sign_up', validator.signUp, authService.signUp)
authController.post('/sign_in', validator.signIn, authService.signIn)
authController.get('/joi', joiService.serviceJoiTest)
authController.post(
  '/verify_refresh_token',
  validator.verifyRefreshToken,
  authService.verifyRefreshToken
)
authController.post('/verify_access_token', authService.verifyAccessToken)
