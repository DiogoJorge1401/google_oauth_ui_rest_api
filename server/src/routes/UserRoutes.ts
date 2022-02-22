import { Router } from 'express'
import { createUserHandler } from '../controllers/user.controller'
import { validate } from '../middlewares/validateResource'
import { createUserSchema } from '../schema/user.schema'

const userRoutes = Router()
userRoutes.post('/user', validate(createUserSchema), createUserHandler)
export { userRoutes }
