import { NextFunction, Request, Response } from 'express'
import { get } from 'lodash'
import { ReIssueAccessToken } from '../services/session.service'
import { verifyJwt } from '../utils/jwt.utils'

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  )

  const refreshToken = get(req, 'headers.x-refresh-token')

  if (!accessToken) return res.status(401).send()

  const { decoded, expired, valid } = await verifyJwt(accessToken)

  if (decoded) {
    res.locals.user = decoded
    return next()
  }

  if (!refreshToken) return res.status(401).send()

  if (expired) {
    const newAccessToken = await ReIssueAccessToken(refreshToken)

    if (!newAccessToken) return res.status(401).send()

    res.setHeader('x-access-token', newAccessToken)

    const { decoded } = await verifyJwt(newAccessToken)

    res.locals.user = decoded
    return next()
  }
}
