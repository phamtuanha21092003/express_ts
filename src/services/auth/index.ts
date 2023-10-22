import { Request, Response } from 'express'
import prisma from 'prisma'
import { matchedData, validationResult } from 'express-validator'
import { accessTokenKey, refreshTokenKey } from '@configs'
import jsonwebtoken from 'jsonwebtoken'

const signUp = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password, username } = matchedData(req)

  const account = await prisma.account.create({
    data: { email: email, password: password, username: username },
  })

  if (account) {
    return res.status(201).json({ message: 'Created successfully' })
  }

  return res.status(503).json({ message: 'Service Unavailable' })
}

const signIn = async (req: Request, res: Response) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = matchedData(req)

  const account = await prisma.account.findFirst({
    where: { email: email, password: password },
  })

  if (account) {
    const payloadAccessToken = {}
    const accessToken = jsonwebtoken.sign(payloadAccessToken, accessTokenKey, {
      expiresIn: 15 * 60 * 1000,
    })

    const payloadRefreshToken = {}
    const refreshToken = jsonwebtoken.sign(
      payloadRefreshToken,
      refreshTokenKey,
      {
        expiresIn: 2 * 30 * 24 * 60 * 60 * 1000,
      }
    )

    return res
      .status(200)
      .json({
        message: 'logged in successfully',
        access_token: accessToken,
        refresh_token: refreshToken,
      })
  }
  res.status(400).json({ message: 'email, password are invalid' })
}

export const authService = { signUp, signIn }
