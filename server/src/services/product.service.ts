import {
  ProductDocument,
  ProductInput,
  ProductModel,
} from '../models/product.model'
import { FilterQuery, UpdateQuery, QueryOptions } from 'mongoose'

export const CreateProduct = async (input: ProductInput) => {
  return await ProductModel.create(input)
}
export const FindProduct = async (
  query: FilterQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) => {
  const product = await ProductModel.findOne(query, {}, options)
  if (!product) throw { message: 'Product not found', status: 404 }
  return product
}
export const UpdateProduct = async (
  { user, productId }: FilterQuery<ProductDocument>,
  update: UpdateQuery<ProductDocument>,
  options: QueryOptions = { lean: true }
) => {
  const product = await FindProduct({ productId })
  if (product.user !== user) throw { message: 'Unauthorized', status: 401 }
  await product.update(update, options)
}
export const DeleteProduct = async ({
  user,
  productId,
}: FilterQuery<ProductDocument>) => {
  const product = await FindProduct({ productId })
  if (product.user !== user) throw { message: 'Unauthorized', status: 401 }
  await product.delete()
}
