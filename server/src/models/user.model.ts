import bcrypt from 'bcrypt'
import config from 'config'
import mongoose from 'mongoose'

export interface UserInput {
  email?: string
  name?: string
  password?: string
}

export interface UserDocument extends UserInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function (next) {
  let user = this as UserDocument

  if (!user.isModified('password')) return next()

  const salt = await bcrypt.genSalt(config.get('saltWorkFactor'))

  const hash = await bcrypt.hash(user.password, salt)

  user.password = hash

  return next()
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument

  return await bcrypt
    .compare(candidatePassword, user.password)
    .catch(() => false)
}

export const UserModel = mongoose.model<UserDocument>('User', UserSchema)
