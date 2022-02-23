import mongoose from 'mongoose';
import { UserDocument } from '../User/UserModelInterfaces';

export interface ProductInput {
  user?: UserDocument['_id']
  title?: string
  productId?: string
  description?: string
  price?: number
  image?: string
}

export interface ProductDocument extends ProductInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
}
