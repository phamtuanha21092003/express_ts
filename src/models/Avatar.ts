import prisma from 'prisma'

const destroy = (userId: number) => {
    return prisma.avatar.findFirst({
        select: { public_id: true },
        where: { user_id: userId },
    })
}
