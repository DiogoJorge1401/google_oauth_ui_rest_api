import { CookieOptions, Response } from 'express'
import { AddTokensToCookieProps } from './CookieInterfaces'
import { signJwt } from './Jwt.utils'

export const CreateCookie = (
  res: Response,
  tokenName: string,
  tokenValue: string,
  options: CookieOptions
) => {
  res.cookie(tokenName, tokenValue, {
    maxAge: options.maxAge,
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: options.sameSite,
    secure: false,
  })
}

export const GenerateTokenToCookie = ({
  user: { _id, email, name },
  session,
  expiresIn,
}: AddTokensToCookieProps) => {
  return signJwt(
    { _id, email, name, session },
    {
      expiresIn,
    }
  )
}
