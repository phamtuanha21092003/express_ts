import { NextFunction, Request, Response } from 'express'
import { matchedData, validationResult } from 'express-validator'
import { accessTokenKey, refreshTokenKey } from '@configs'
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '@models/User'

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
            accessTokenKey,
            {
                expiresIn: 30 * 60 * 1000,
            }
        )

        const payloadRefreshToken = { id: account.id }
        const refreshToken = jsonwebtoken.sign(
            payloadRefreshToken,
            refreshTokenKey,
            {
                expiresIn: 2 * 30 * 24 * 60 * 60 * 1000,
            }
        )

        return res.status(200).json({
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
    jsonwebtoken.verify(token, refreshTokenKey, (err, decoded) => {
        if (err) return res.status(401).json({ message: err })
        const accessToken = jsonwebtoken.sign({ decoded }, accessTokenKey, {
            expiresIn: 30 * 60 * 1000,
        })

        const refreshToken = jsonwebtoken.sign({ decoded }, refreshTokenKey, {
            expiresIn: 2 * 30 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: 'verify successfully',
            access_token: accessToken,
            refresh_token: refreshToken,
        })
    })
}

const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['authorization']) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    const [, token] = req.headers['authorization'].split(' ')

    jsonwebtoken.verify(token, accessTokenKey, (err, decoded: JwtPayload) => {
        if (err) return res.status(401).json({ message: err.message })

        const { id } = decoded

        if (!id)
            return res.status(401).json({
                message: 'Unauthorized',
            })

        res.locals.id = id
    })

    next()
}

export const authService = {
    signUp,
    signIn,
    verifyRefreshToken,
    verifyAccessToken,
}
