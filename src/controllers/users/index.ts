import { uploadMiddleware } from '@middlewares/multer'
import { userService } from '@services/user'
import express from 'express'

export const userController = express.Router()

userController.patch(
    '/upload_avatar',
    uploadMiddleware.single('avatar'),
    userService.uploadAvatar
)

userController.patch('/destroy_avatar', userService.destroyAvatar)
