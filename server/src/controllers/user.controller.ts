import { Request, Response } from 'express'
import { CreateUserInput } from '../schema/user.schema'
import { CreateUser } from '../services/user.service'
import { log } from '../utils/logger'

export const createUserHandler = async (
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
