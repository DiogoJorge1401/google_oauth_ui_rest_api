import { Router } from 'express'
import {
  CreateUserSessionHandler,
  DeleteSessionHandler,
  ReadUserSessionsHandler,
} from '../controllers/session.controller'
import { deserializeUser, validate } from '../middlewares'
import { createUserSessionSchema } from '../schema/userSession.schema'

const sessionRoutes = Router()

sessionRoutes.post(
  '/session',
  validate(createUserSessionSchema),
  CreateUserSessionHandler
)

sessionRoutes.get('/session', deserializeUser, ReadUserSessionsHandler)
sessionRoutes.delete('/session', deserializeUser, DeleteSessionHandler)

export { sessionRoutes }
