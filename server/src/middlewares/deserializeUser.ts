import { NextFunction, Request, Response } from 'express'
import { get } from 'lodash'
import { ReIssueAccessToken } from '../services/Session/session.service'
import { CreateCookie } from '../utils/Cookie'
import { verifyJwt } from '../utils/Jwt.utils'

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    get(req, 'cookies.accessToken') ||
    get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')

  const refreshToken =
    get(req, 'cookies.refreshToken') || get(req, 'headers.x-refresh-token')

  if (!accessToken) return res.status(401).send()

  const { decoded, expired } = await verifyJwt(accessToken)

  if (decoded) {
    res.locals.user = decoded
    return next()
  }

  if (!refreshToken) return res.status(401).send()

  if (expired) {
    try {
      const newAccessToken = await ReIssueAccessToken(refreshToken)

      if (!newAccessToken) return res.status(401).send()

      res.setHeader('x-access-token', newAccessToken)

      CreateCookie(res, 'accessToken', newAccessToken, {
        maxAge: 900000,
        sameSite: 'strict',
      })

      const { decoded } = await verifyJwt(newAccessToken)

      res.locals.user = decoded
      return next()
    } catch (err) {
      return res.status(400).json({ message: err.message })
    }
  }
}
