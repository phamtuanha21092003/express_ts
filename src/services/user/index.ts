import { NextFunction, Request, Response } from 'express'
import { uploadImage, destroyImage } from '@services/image'
import { UserModel } from '@models/User'

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
    const id = res.locals.id

    const publicIdContainer = await UserModel.getPublicIdAvatar(id)

    const publicId = publicIdContainer?.avatar?.public_id

    if (!publicId) {
        return res.status(404).json({ status: 'not found' })
    }

    const { result } = await destroyImage(publicId)

    if (result === 'ok') {
        const destroy = await UserModel.destroyAvatar(id)

        return res.status(200).json({ status: destroy })
    }

    return res.status(404).json({ status: 'not found' })
}

export const userService = {
    uploadAvatar,
    destroyAvatar,
}
