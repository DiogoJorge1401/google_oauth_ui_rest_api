import mongoose from 'mongoose';
import { UserDocument } from '../User/UserModelInterfaces';

export interface SessionInput {
  user?: UserDocument['_id']
  valid?: boolean
  userAgent?: string
}

export interface SessionDocument extends SessionInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
}
