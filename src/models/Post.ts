import prisma from 'prisma'

const selectAllPublicId = (id: string, postId: number) => {
    return prisma.userPost.findFirst({
        where: { id: postId, user_id: id },
        select: {
            images: { select: { public_id: true } },
        },
    })
}

const deletePost = (id: string, postId: number) => {
    return prisma.userPost.delete({
        where: { id: postId, user_id: id },
    })
}

export const PostModel = { selectAllPublicId, deletePost }
