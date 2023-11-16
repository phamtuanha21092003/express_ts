import { NextFunction, Request, Response } from 'express'
import { uploadImage, destroyImage } from '@services/image'
import { UserModel } from '@models/User'
import { matchedData, validationResult } from 'express-validator'

const uploadAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.id

        const b64 = Buffer.from(req.file.buffer).toString('base64')
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64
        const { public_id: publicId, secure_url: url } = await uploadImage(
            dataURI
        )

        const user = await UserModel.updateAvatar(
            { publicId: publicId, url: url },
            userId
        )

        return res.json({ data: user })
    } catch (err) {
        next(err)
    }
}

const destroyAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = res.locals.id

    const publicIdContainer = await UserModel.getPublicIdAvatar(userId)

    const publicId = publicIdContainer?.avatar?.public_id

    if (!publicId) {
        return res.status(400).json({ status: 'not found' })
    }
    try {
        const { result } = await destroyImage(publicId)
        if (result === 'ok') {
            const destroy = await UserModel.destroyAvatar(userId)

            return res.status(200).json({ status: destroy })
        }

        return res.status(400).json({ status: 'not found' })
    } catch (err) {
        next(err)
    }
}

const addFollow = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { target_id: targetId } = matchedData(req)
    const { id: currentId } = res.locals

    try {
        UserModel.addFollow(currentId, targetId)

        return res.status(201).json({ status: 'added successfully' })
    } catch (err) {
        next(err)
    }
}

const removeFollow = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { target_id: targetId } = matchedData(req)
    const { id: currentId } = res.locals

    try {
        UserModel.removeFollow(currentId, targetId)

        return res.status(200).json({ status: 'removed successfully' })
    } catch (err) {
        next(err)
    }
}

export const userService = {
    uploadAvatar,
    destroyAvatar,
    addFollow,
    removeFollow,
}
