import express, { Request, Response } from 'express'
import { routes } from './routes'
import cors from 'cors'
import config from 'config'
import cookieParser from 'cookie-parser'

const app = express()


app.use(cors({ origin: config.get('origin'), credentials: true }))

app.use(cookieParser())

app.use(express.json())

app.get('/healthcheck', (req: Request, res: Response) => {
  res.sendStatus(200)
})

app.use('/api', routes)

export { app }
