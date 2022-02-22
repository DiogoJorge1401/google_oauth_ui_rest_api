import { Router } from 'express'
import {
  CreateProductHandler,
  DeleteProducteHandler,
  ReadProductHandler,
  UpdateProductHandler,
} from '../controllers/product.controller'
import { deserializeUser, validate } from '../middlewares'
import {
  CreateProductSchema,
  DeleteProductSchema,
  GetProductSchema,
  UpdateProductSchema,
} from '../schema/product.schema'

const productRoutes = Router()

productRoutes.get(
  '/product/:productId',
  validate(GetProductSchema),
  ReadProductHandler
)

productRoutes.use(deserializeUser)

productRoutes.post(
  '/product',
  validate(CreateProductSchema),
  CreateProductHandler
)
productRoutes.put(
  '/product/:productId',
  validate(UpdateProductSchema),
  UpdateProductHandler
)
productRoutes.delete(
  '/product/:productId',
  validate(DeleteProductSchema),
  DeleteProducteHandler
)

export { productRoutes }
