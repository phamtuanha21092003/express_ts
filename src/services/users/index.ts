import { Request, Response } from 'express'
import { UserModel } from '@models/User'

const createUser = async (req: Request, res: Response) => {
  const { name } = req.body

  const user = await UserModel.create({ name: name })

  if (!user) {
    return res.status(500).json({ status: 'create error' })
  }

  return res.status(201).json({ status: 'create successfully', user: user })
}

export const userService = { createUser }
