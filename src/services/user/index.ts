import { NextFunction, Request, Response } from 'express'
import { uploadImage, destroyImage } from '@services/image'
import { UserModel } from '@models/User'
import { matchedData, validationResult } from 'express-validator'
import { redis } from '@utils/redis'

const uploadAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = res.locals.id

        await redis.del(userId)

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

    const publicIdContainer = await UserModel.selectPublicIdAvatar(userId)

    const publicId = publicIdContainer?.avatar?.public_id

    if (!publicId) {
        return res.status(400).json({ status: 'not found' })
    }
    try {
        const { result } = await destroyImage(publicId)
        if (result === 'ok') {
            const destroy = await UserModel.deleteAvatar(userId)

            return res.status(200).json({ status: destroy })
        }

        return res.status(400).json({ status: 'not found' })
    } catch (err) {
        next(err)
    }
}

const addFollow = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { target_id: targetId } = matchedData(req)
    const { id: currentId } = res.locals

    try {
        UserModel.addFollow(currentId, targetId)
        await redis.del(currentId)

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
        await redis.del(currentId)
        UserModel.removeFollow(currentId, targetId)

        return res.status(200).json({ status: 'removed successfully' })
    } catch (err) {
        next(err)
    }
}

const generalFriend = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = res.locals['id']

        const generalFriend = await UserModel.mutualFriendsCount(id)

        res.status(200).json({ general: generalFriend })
    } catch (err) {
        next(err)
    }
}

const profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = res.locals['id']
        const isExist = await redis.exists(id)

        if (!isExist) {
            const profile = await UserModel.selectProfile(id)

            await redis.set(id, JSON.stringify(profile))

            return res.status(200).json({ data: profile })
        }

        const data = JSON.parse(await redis.get(id))

        res.status(200).json({ data: data })
    } catch (err) {
        next(err)
    }
}

const addPostUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const id = res.locals.id

        const { content } = matchedData(req)

        const images: { url: string; public_id: string }[] = await Promise.all(
            Object.keys(req.files).map(async (key) => {
                const b64 = Buffer.from(req.files[key].buffer).toString(
                    'base64'
                )
                let dataURI =
                    'data:' + req.files[key].mimetype + ';base64,' + b64
                const { public_id: publicId, secure_url: url } =
                    await uploadImage(dataURI)

                return { url: url, public_id: publicId }
            })
        )

        await UserModel.addPost(id, {
            content: content,
            images: images,
        })

        res.json({ status: 'successfully' })
    } catch (err) {
        next(err)
    }
}

const getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals['id']

        const { posts } = await UserModel.selectPost(userId)

        res.status(200).json({ data: posts })
    } catch (err) {
        next(err)
    }
}

export const userService = {
    uploadAvatar,
    destroyAvatar,
    addFollow,
    removeFollow,
    generalFriend,
    profile,
    addPostUser,
    getPost,
}
