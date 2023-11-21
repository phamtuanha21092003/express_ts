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

const selectProfile = (id: string) => {
    return prisma.user.findFirst({
        where: { id: id },
        select: {
            id: true,
            name: true,
            avatar: { select: { url: true } },
            following: {
                select: {
                    id: true,
                    name: true,
                    avatar: { select: { url: true } },
                },
            },
            followed_by: {
                select: {
                    id: true,
                    name: true,
                    avatar: { select: { url: true } },
                },
            },
        },
    })
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

const selectPublicIdAvatar = async (id: string) => {
    return prisma.user.findFirstOrThrow({
        select: {
            avatar: { select: { public_id: true } },
        },
        where: { id: id },
    })
}

const deleteAvatar = (id: string) => {
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

const selectFollowing = (id: string): any =>
    prisma.user
        .findFirst({
            where: { id: id },
            select: { following: { select: { id: true } } },
        })
        .then((user) => user?.following.map((following) => following.id) || [])

const mutualFriendsCount = async (id: string) => {
    const following = await selectFollowing(id)

    return await prisma.user.findMany({
        select: {
            _count: {
                select: { following: { where: { id: { in: following } } } },
            },
            avatar: { select: { url: true } },
            name: true,
            email: true,
        },
        where: { AND: [{ id: { notIn: following } }, { id: { not: id } }] },
    })
}

const selectAllUser = () => {
    return prisma.user.findMany({
        include: {
            avatar: true,
            followed_by: { include: { avatar: true } },
            following: { include: { avatar: true } },
            posts: { include: { images: true } },
        },
    })
}

const updateLastSignIn = async (id: string) => {
    await prisma.user.update({
        where: { id: id },
        data: { last_sign_in: new Date() },
    })
}

const signOut = async (id: string) => {
    await prisma.user.update({
        where: { id: id },
        data: {
            last_sign_in: undefined,
        },
    })
}

const addPost = async (
    id: string,
    {
        content,
        images,
    }: { content: string; images: { url: string; public_id: string }[] }
) => {
    return prisma.user.update({
        where: { id: id },
        data: {
            posts: {
                create: {
                    content: content,
                    images: { createMany: { data: images } },
                },
            },
        },
    })
}

export const UserModel = {
    create,
    selectUser,
    selectById,
    selectProfile,
    updateAvatar,
    selectPublicIdAvatar,
    deleteAvatar,
    addFollow,
    removeFollow,
    selectFollowing,
    mutualFriendsCount,
    updateLastSignIn,
    signOut,
    addPost,
    selectAllUser,
}
