import { Router } from 'express'
import { deserialize } from 'v8'
import {
  CreateUserHandler,
  GetCurrentUser,
} from '../controllers/user.controller'
import { validate } from '../middlewares/validateResource'
import { createUserSchema } from '../schema/user.schema'

const userRoutes = Router()
userRoutes.post('/user', validate(createUserSchema), CreateUserHandler)
userRoutes.get('/user/me', deserialize, GetCurrentUser)
export { userRoutes }
