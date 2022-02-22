import { Request, Response } from 'express'
import {
  CreateSession,
  FindSessions,
  DeleteSession,
} from '../services/session.service'
import { log } from '../utils/logger'

export const CreateUserSessionHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const { accessToken, refreshToken } = await CreateSession({
      email,
      password,
      userAgent: req.get('user-agent'),
    })

    res.cookie('accessToken', accessToken, {
      maxAge: 900000,
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: false,
    })
    
    res.cookie('refreshToken', refreshToken, {
      maxAge: 86400000,
      httpOnly: true,
      domain: 'localhost',
      path: '/',
      sameSite: 'strict',
      secure: false,
    })

    return res.status(201).json({ accessToken, refreshToken })
  } catch (e) {
    log.error(e)
    return res.status(401).json({ message: e.message })
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
