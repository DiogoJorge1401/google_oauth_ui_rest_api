import { Request, Response } from 'express'
import {
  CreateProductInput,
  DeleteProductInput,
  GetProductInput,
  UpdateProductInput,
} from '../../schema/product.schema'
import {
  CreateProduct,
  DeleteProduct,
  UpdateProduct,
  FindProduct,
} from '../../services/Product/product.service'

export const CreateProductHandler = async (
  req: Request<{}, {}, CreateProductInput['body']>,
  res: Response
) => {
  const userId = res.locals.user._id,
    body = req.body
  const product = await CreateProduct({ ...body, user: userId })
  return res.status(201).json(product)
}

export const ReadProductHandler = async (
  req: Request<GetProductInput['params'], {}, {}>,
  res: Response
) => {
  const productId = req.params.productId
  try {
    const product = await FindProduct({ productId })
    return res.json(product)
  } catch (err) {
    return res.status(err.status).json({ message: err.message })
  }
}

export const UpdateProductHandler = async (
  req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
  res: Response
) => {
  const productId = req.params.productId,
    userId = res.locals.user._id,
    update = req.body
  try {
    await UpdateProduct({ productId, user: userId }, update)
    return res.status(201).send()
  } catch (err) {
    return res.status(err.status).json({ message: err.message })
  }
}

export const DeleteProducteHandler = async (
  req: Request<DeleteProductInput['params'], {}, {}>,
  res: Response
) => {
  const productId = req.params.productId,
    userId = res.locals.user._id
  try {
    await DeleteProduct({ productId, user: userId })
    return res.send()
  } catch (err) {
    return res.status(err.status).json({ message: err.message })
  }
}
