import config from 'config'
import { SessionDocument, SessionModel } from '../models/session.model'
import { signJwt, verifyJwt } from '../utils/jwt.utils'
import { FindUser, ValidatePassword } from './user.service'
import { FilterQuery, UpdateQuery } from 'mongoose'
import { get } from 'lodash'

interface CreateSessionProps {
  userAgent: string
  email: string
  password: string
}
export const CreateSession = async ({
  password,
  userAgent,
  email,
}: CreateSessionProps) => {
  try {
    const user = await ValidatePassword({ password, email })

    if (!user) throw new Error('Invalid email or password')

    const { _id, name } = user

    const session = await SessionModel.create({ user: _id, userAgent }),
      payload = { name, email, _id, session: session._id }

    const accessToken = signJwt(payload, {
      expiresIn: config.get('accessTokenTtl'),
    })

    const refreshToken = signJwt(payload, {
      expiresIn: config.get('refreshTokenTtl'),
    })

    return { accessToken, refreshToken }
  } catch (err) {
    throw new Error(err)
  }
}
export const FindSessions = async (query: FilterQuery<SessionDocument>) => {
  return SessionModel.find(query).lean()
}
export const DeleteSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => {
  return SessionModel.updateOne(query, update)
}

export const ReIssueAccessToken = async (refreshToken: string) => {
  const { decoded } = await verifyJwt(refreshToken)

  if (!decoded || !get(decoded, 'session')) return false

  const session = await SessionModel.findById(get(decoded, 'session'))

  if (!session || !session.valid) return false

  const user = await FindUser({ _id: session.user })

  if (!user) return false

  const { name, email, _id } = user

  const payload = { name, email, _id, session: session._id }

  const accessToken = signJwt(payload, {
    expiresIn: config.get('accessTokenTtl'),
  })

  return accessToken
}
