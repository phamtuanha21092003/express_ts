import { UserModel } from '@models/User'
import { body } from 'express-validator'

const requireTargetIdBody = [
    body('target_id')
        .exists()
        .withMessage('target id is required')
        .custom(async (target_id) => {
            const user = await UserModel.selectById(target_id)

            if (!user) throw new Error('User is not exist')
        }),
]

export const validator = { requireTargetIdBody }
