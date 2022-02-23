import config from 'config'
import { Request, Response } from 'express'
import {
  CreateSession,
  CreateSessionIfUserExist,
  DeleteSession,
  FindSessions,
} from '../../services/Session/session.service'
import {
  GetGoogleOAuthTokens,
  GetGoogleUser,
  UpdateUser,
} from '../../services/User/user.service'
import { CreateCookie, GenerateTokenToCookie } from '../../utils/Cookie'
import { log } from '../../utils/Logger'

export const CreateUserSessionHandler = async (req: Request, res: Response) => {
  try {
    const { user, session } = await CreateSessionIfUserExist(
      req.body,
      req.get('user-agent')
    )

    const accessToken = GenerateTokenToCookie({
      user,
      session: session._id,
      expiresIn: config.get('accessTokenTtl'),
    })

    const refreshToken = GenerateTokenToCookie({
      user,
      session: session._id,
      expiresIn: config.get('refreshTokenTtl'),
    })

    CreateCookie(res, 'accessToken', accessToken, {
      maxAge: 900000,
      sameSite: 'lax',
    })
    CreateCookie(res, 'refreshToken', refreshToken, {
      maxAge: 86400000,
      sameSite: 'lax',
    })

    return res.status(201).json({ accessToken, refreshToken })
  } catch (e) {
    log.error(e)
    return res.status(e.status).json({ message: e.message })
  }
}

export const ReadUserSessionsHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id

  const sessions = await FindSessions({
    user: userId,
    valid: true,
  })

  return res.json(sessions)
}

export const DeleteSessionHandler = async (req: Request, res: Response) => {
  const sessionId = res.locals.user.session

  await DeleteSession({ _id: sessionId }, { valid: false })

  return res.send({
    accessToken: null,
    refreshToken: null,
  })
}

export const GoogleOAuthHandler = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string

    const { id_token, access_token } = await GetGoogleOAuthTokens(code)

    const googleUser = await GetGoogleUser({ access_token, id_token })

    if (!googleUser.verified_email)
      return res.status(403).json({ message: 'Google account is not verified' })

    const user = await UpdateUser(
      { email: googleUser.email },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true,
      }
    )

    const session = await CreateSession({
      userAgent: req.get('user-agent') || '',
      userId: user._id,
    })

    const accessToken = GenerateTokenToCookie({
      user,
      session: session._id,
      expiresIn: config.get('accessTokenTtl'),
    })

    const refreshToken = GenerateTokenToCookie({
      user,
      session: session._id,
      expiresIn: config.get('refreshTokenTtl'),
    })

    CreateCookie(res, 'accessToken', accessToken, {
      maxAge: 900000,
      sameSite: 'lax',
    })
    CreateCookie(res, 'refreshToken', refreshToken, {
      maxAge: 86400000,
      sameSite: 'lax',
    })

    return res.redirect(config.get('origin'))
  } catch (error) {
    return res.redirect(`${config.get('origin')}/oath/error`)
  }
}
