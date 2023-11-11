import { Response, Request } from 'express'
import Joi from 'joi'

const serviceJoiTest = (req: Request, res: Response) => {
    const schema = Joi.object().keys({
        name: Joi.string().required().label('name is required'),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(8)
            .required()
            .label('password least 8 characters'),
    })

    const { name, email, password } = req.query

    const { value, error } = schema.validate({ name, email, password })

    if (error) {
        return res.status(400).json({ error: error })
    }
}

export const joiService = { serviceJoiTest }
