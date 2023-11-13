import express, {
    Request,
    Response,
    NextFunction,
    ErrorRequestHandler,
} from 'express'
import cors from 'cors'
import 'dotenv/config'
import { router } from '@routes'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { join } from 'node:path'

const app = express()
const server = createServer(app)
// const io = new Server(server)

const allowedOrigins = ['http://localhost:3000']
const options: cors.CorsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
}

app.use(cors(options))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '/index.html'))
})

app.use(
    (
        err: ErrorRequestHandler,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        console.log('error', err)
        res.status(500).json({ error: err })
    }
)

// io.on('connection', (socket) => {
//     console.log('a user connected')

//     socket.on('disconnect', (socket) => {
//         console.log('disconnection')
//     })

//     socket.on('ha-chat', (data) => {
//         console.log(data, typeof data)
//     })
// })

const port = process.env.PORT || 8080
server.listen(port, () => {
    console.log(`App is listening on port ${port}!`)
})
