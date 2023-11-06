import express from 'express'
import { userService } from '@services/users'

export const userController = express.Router()

userController.post('/create', userService.createUser)
