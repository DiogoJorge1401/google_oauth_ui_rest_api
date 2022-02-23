import { Request, Response } from 'express'
import { CreateUserInput } from '../../schema/user.schema'
import { CreateUser } from '../../services/User/user.service'

export const CreateUserHandler = async (
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) => {
  try {
    const user = await CreateUser(req.body)
    return res.status(201).json(user)
  } catch (error) {
    return res.status(error.status).json({ message: error.message })
  }
}

export const GetCurrentUser = async (req: Request, res: Response) => {
  return res.json(res.locals.user)
}
