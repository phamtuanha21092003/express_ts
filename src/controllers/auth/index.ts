import express, { Response, Request } from 'express'
import { validator } from '@services/validator/auth'
import { authService } from '@services/auth'

export const authController = express.Router()

authController.post('/sign_up', validator.signUp, authService.signUp)
authController.post('/sign_in', validator.signIn, authService.signIn)

// authController.get('/hello', query('username').notEmpty().trim())

// const signUpController = async (req: Request, res: Response) => {
//   const errors = validationResult(req)

//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() })
//   }

//   const { username, email, password } = req.body
//   await res.json({ email: email })
// }

// const helloController = (req: Request, res: Response) => {
//   const result = validationResult(req)

//   console.log(req.query.username)
//   if (result.isEmpty()) {
//     return res.send(`Hello World! ${req.query.username}`)
//   }

//   res.status(400).json({ error: result.array() })
// }

// export default { signUpController, helloController }
