import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express'
import cors from 'cors'
import 'dotenv/config'
import { router } from '@routes'

const app = express()

const allowedOrigins = ['http://localhost:3000']
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200,
}

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
  console.log('running')
  res.json({ message: 'ok' })
})

app.use(router)

app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log(err)

    res.status(500).json({ error: err })
  }
)

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})