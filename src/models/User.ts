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

const addFollow = async (idCurrent: string, idTarge: string) => {
    await prisma.user.update({
        where: { id: idCurrent },
        data: { following: { connect: { id: idTarge } } },
    })

    await prisma.user.update({
        where: { id: idTarge },
        data: { followed_by: { connect: { id: idCurrent } } },
    })
}

const removeFollow = async (idCurrent: string, idTarge: string) => {
    await prisma.user.update({
        where: { id: idCurrent },
        data: { following: { disconnect: { id: idTarge } } },
    })

    await prisma.user.update({
        where: { id: idTarge },
        data: { followed_by: { disconnect: { id: idCurrent } } },
    })
}

const allUser = () => {
    return prisma.user.findMany({
        include: {
            avatar: true,
            followed_by: { include: { avatar: true } },
            following: { include: { avatar: true } },
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
    addFollow,
    removeFollow,
    allUser,
}
