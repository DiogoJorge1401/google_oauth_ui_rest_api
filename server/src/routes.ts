import { Router } from 'express'
import { productRoutes, sessionRoutes, userRoutes } from './routes/index'

const routes = Router()

routes.use(userRoutes)
routes.use(sessionRoutes)
routes.use(productRoutes)

export { routes }
