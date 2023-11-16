import { uploadMiddleware } from '@middlewares/multer'
import { UserModel } from '@models/User'
import { userService } from '@services/user'
import { validator } from '@services/validator/user'
import express from 'express'

export const userController = express.Router()

userController.patch(
    '/upload_avatar',
    uploadMiddleware.single('avatar'),
    userService.uploadAvatar
)

userController.patch('/destroy_avatar', userService.destroyAvatar)

userController.post(
    '/add_follow',
    validator.requireTargetIdBody,
    userService.addFollow
)

userController.delete(
    '/remove_follow',
    validator.requireTargetIdBody,
    userService.removeFollow
)

userController.post('/all', async (req, res) => {
    const user = await UserModel.allUser()

    res.json({
        user: user,
    })
})
