import { omit } from 'lodash'
import { UserDocument, UserInput, UserModel } from '../models/user.model'
import { FilterQuery } from 'mongoose'

export const CreateUser = async (input: UserInput) => {
  try {
    const user = await UserModel.create(input)
    return omit(user.toJSON(), 'password')
  } catch (error) {
    throw { status: 409, message: 'User alredy exist' }
  }
}

export const ValidatePassword = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  const user = await UserModel.findOne({ email })

  if (!user) return false

  const isValid = await user.comparePassword(password)

  if (!isValid) return false

  return omit(user, 'password')
}

export const FindUser = async (query: FilterQuery<UserDocument>) => {
  return await UserModel.findOne(query).lean()
}
