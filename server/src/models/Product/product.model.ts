import mongoose from 'mongoose'
import { customAlphabet } from 'nanoid'
import { ProductDocument } from './ProductModelInterfaces'

const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456780', 10)

const ProductSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => `product_${nanoId()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export const ProductModel = mongoose.model<ProductDocument>(
  'Product',
  ProductSchema
)
