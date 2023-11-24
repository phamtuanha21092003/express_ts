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

userController.get('/general_friend', userService.generalFriend)

userController.get('/all', async (req, res) => {
    const user = await UserModel.selectAllUser()

    res.json({
        user: user,
    })
})

userController.post(
    '/upload_post',
    uploadMiddleware.array('post_image', 4),
    validator.addPostUser,
    userService.addPostUser
)

userController.get('/get_post', userService.getPost)

userController.delete('/remove_post', userService.removePost)

userController.get('/profile', userService.profile)
