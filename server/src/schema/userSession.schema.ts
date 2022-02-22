import { object, string } from 'zod'

export const createUserSessionSchema = object({
  body: object({
    password: string({
      required_error: 'Password is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),
  }),
})