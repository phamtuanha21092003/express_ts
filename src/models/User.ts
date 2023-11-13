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

const selectById = (id: string) => {
    return prisma.user.findFirst({ where: { id: id } })
}

const updateAvatar = (
    avatar: { publicId: string; url: string },
    id: string
) => {
    return prisma.user.update({
        where: { id: id },
        data: {
            avatar: {
                upsert: {
                    create: { public_id: avatar.publicId, url: avatar.url },
                    update: { public_id: avatar.publicId, url: avatar.url },
                },
            },
        },
        include: {
            avatar: true,
        },
    })
}

const getPublicIdAvatar = async (id: string) => {
    return prisma.user.findFirstOrThrow({
        select: {
            avatar: { select: { public_id: true } },
        },
        where: { id: id },
    })
}

const destroyAvatar = (id: string) => {
    return prisma.user.update({
        where: { id: id },
        data: {
            avatar: { delete: true },
        },
    })
}

export const UserModel = {
    create,
    selectUser,
    selectById,
    updateAvatar,
    getPublicIdAvatar,
    destroyAvatar,
}
