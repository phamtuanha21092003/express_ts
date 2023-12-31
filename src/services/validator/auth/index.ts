import { UserModel } from '@models/User'
import { body } from 'express-validator'

const signUp = [
    body('email')
        .isEmail()
        .withMessage('Email is invalid')
        .custom(async (email) => {
            const isExistAccount = await UserModel.selectUser({ email: email })

            if (isExistAccount) {
                throw new Error('Email is already taken')
            }
        }),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars long'),
    body('username').exists().withMessage('Username is required'),
]

const signIn = [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 chars long'),
]

const verifyRefreshToken = [
    body('refresh').exists().withMessage('Refresh token is required'),
]

export const validator = { signUp, signIn, verifyRefreshToken }
