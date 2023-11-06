import { Request, Response } from 'express'
import prisma from 'prisma'

const uploadImage = async (req: Request, res: Response) => {
  if (!req?.files?.profile) {
    return res.status(400).json({ error: 'profile image is required' })
  }

  const { id } = res.locals

  console.log(req.files.profile)

  // const image = await prisma.image.create({data})

  res.status(200).json({ status: 'ok' })
}

export const profileService = { uploadImage }
