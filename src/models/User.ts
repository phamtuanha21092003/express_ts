import prisma from 'prisma'

const create = (user: { name: string; email: string; password: string }) => {
  return prisma.user.create({
    data: { name: user.name, email: user.email, password: user.password },
  })
}

const selectUser = (user: { email: string; password?: string }) => {
  return user.password
    ? prisma.user.findFirst({
        where: { email: user.email, password: user.password },
      })
    : prisma.user.findFirst({
        where: { email: user.email },
      })
}

export const UserModel = { create, selectUser }
