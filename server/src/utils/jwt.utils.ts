import jwt from 'jsonwebtoken'
import config from 'config'

const accessTokenPrivateKey = config.get<string>('accessTokenPrivateKey')
const accessTokenPublicKey = config.get<string>('accessTokenPublicKey')

export const signJwt = (object: Object, options?: jwt.SignOptions) => {
  return jwt.sign(object, accessTokenPrivateKey, {
    ...(options && options),
    algorithm: 'RS256',
  })
}
export const verifyJwt = async (token: string) => {
  try {
    const decoded = jwt.verify(token, accessTokenPublicKey)
    return {
      valid: true,
      expired: false,
      decoded,
    }
  } catch (error) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    }
  }
}
