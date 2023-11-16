import prisma from 'prisma'

const destroy = (userId: string) => {
    return prisma.avatar.findFirst({
        select: { public_id: true },
        where: { user_id: userId },
    })
}
