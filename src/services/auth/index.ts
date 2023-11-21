import { NextFunction, Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@configs'
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '@models/User'
import { Forbidden, Unauthorized } from '@utils/error'

const signUp = async (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, username } = matchedData(req)

    const account = await UserModel.create({
        name: username,
        email: email,
        password: password,
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

    const account = await UserModel.selectUser({
        email: email,
        password: password,
    })

    if (account) {
        const payloadAccessToken = { id: account.id }
        const accessToken = jsonwebtoken.sign(
            payloadAccessToken,
            ACCESS_TOKEN_KEY,
            {
                expiresIn: '3h',
            }
        )

        const payloadRefreshToken = { id: account.id }
        const refreshToken = jsonwebtoken.sign(
            payloadRefreshToken,
            REFRESH_TOKEN_KEY,
            {
                expiresIn: '0.5y',
            }
        )

        return res.status(200).json({
            user_id: account.id,
            message: 'logged in successfully',
            access_token: accessToken,
            refresh_token: refreshToken,
        })
    }
    res.status(400).json({ message: 'email, password are invalid' })
}

const verifyRefreshToken = (req: Request, res: Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }

    const { refresh: token } = matchedData(req)
    jsonwebtoken.verify(
        token,
        REFRESH_TOKEN_KEY,
        async (err, decoded: JwtPayload) => {
            if (err) throw new Unauthorized('Token is not authorized')

            const { id } = decoded

            const user = await UserModel.selectById(id)

            if (!user) {
                return res.status(403).json({ status: 'token is invalid' })
            }

            UserModel.updateLastSignIn(id)

            const accessToken = jsonwebtoken.sign(
                { decoded },
                ACCESS_TOKEN_KEY,
                {
                    expiresIn: 30 * 60 * 1000,
                }
            )

            const refreshToken = jsonwebtoken.sign(
                { decoded },
                REFRESH_TOKEN_KEY,
                {
                    expiresIn: 2 * 30 * 24 * 60 * 60 * 1000,
                }
            )

            return res.status(200).json({
                message: 'verify successfully',
                access_token: accessToken,
                refresh_token: refreshToken,
            })
        }
    )
}

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['authorization']) {
        throw new Unauthorized('Unauthorized')
    }

    const [, token] = req.headers['authorization'].split(' ')

    jsonwebtoken.verify(
        token,
        ACCESS_TOKEN_KEY,
        async (err, decoded: JwtPayload) => {
            if (err) return next(new Unauthorized('Unauthorized'))

            const { id } = decoded
            res.locals.id = id

            const user = await UserModel.selectById(id)

            if (!user) throw new Forbidden('User not found')
        }
    )

    next()
}

export const authService = {
    signUp,
    signIn,
    verifyRefreshToken,
    verifyAccessToken,
}
