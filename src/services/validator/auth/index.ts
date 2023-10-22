import { body } from 'express-validator'
import prisma from 'prisma'

const signUp = [
  body('email')
    .isEmail()
    .withMessage('Email is invalid')
    .custom(async (email) => {
      const isExistAccount = await prisma.account.findFirst({
        where: { email: email },
      })

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
  body('username').exists().withMessage('Username is required'),
]

export const validator = { signUp, signIn }
