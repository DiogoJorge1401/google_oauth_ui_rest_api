import axios from 'axios'
import config from 'config'
import { omit } from 'lodash'
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import qs from 'qs'
import {  UserModel } from '../../models/User/user.model'
import { UserDocument, UserInput } from '../../models/UserModelInterfaces'
import { log } from '../../utils/Logger'
import { GetGoogleUserProps, GoogleUserResult } from './UserServiceInterfaces'

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

export const GetGoogleOAuthTokens = async (code: string) => {
  const url = 'https://oauth2.googleapis.com/token'

  const values = {
    code,
    client_id: config.get('googleClientId'),
    client_secret: config.get('googleClientSecret'),
    redirect_uri: config.get('googleOauthRedirectUri'),
    grant_type: 'authorization_code',
  }

  try {
    const res = await axios.post(url, qs.stringify(values), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return res.data
  } catch (error: any) {
    log.error(error, 'Failed to fetch Google Oauth Tokens')
    throw new Error(error.message)
  }
}

export const GetGoogleUser = async ({
  id_token,
  access_token,
}: GetGoogleUserProps): Promise<GoogleUserResult> => {
  try {
    const res = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    )

    return res.data
  } catch (err) {
    log.error(err, 'Error fetching Google user')
    throw new Error(err.message)
  }
}

export const UpdateUser = async (
  query: FilterQuery<UserDocument>,
  update: UpdateQuery<UserDocument>,
  options: QueryOptions = {}
) => {
  return await UserModel.findOneAndUpdate(query, update, options)
}
