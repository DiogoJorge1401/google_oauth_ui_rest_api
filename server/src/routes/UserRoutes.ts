import { Router } from 'express'
import {
  CreateUserHandler,
  GetCurrentUser,
} from '../controllers/User/user.controller'
import { deserializeUser } from '../middlewares'
import { validate } from '../middlewares/validateResource'
import { createUserSchema } from '../schema/user.schema'

const userRoutes = Router()

userRoutes.post('/user', validate(createUserSchema), CreateUserHandler)

userRoutes.get('/user/me', deserializeUser, GetCurrentUser)

export { userRoutes }
