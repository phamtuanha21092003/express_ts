import prisma from 'prisma'

const create = (user: { name: string }) => {
  return prisma.user.create({
    data: { name: user.name },
  })
}

export const UserModel = { create }
