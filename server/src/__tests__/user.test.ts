import mongoose from 'mongoose'
import supertest from 'supertest'
import { app } from '../app'
import * as UserService from '../services/User/user.service'
import * as UserSession from '../services/Session/session.service'

const userId = new mongoose.Types.ObjectId().toString()

const userPayload = {
  _id: userId,
  email: 'jhondoe@mail.com',
  name: 'Jhon Doe',
}
const userInputRegistration = {
  email: 'jhondoe@mail.com',
  name: 'Jhon Doe',
  password: 'Password123',
  passwordConfirmation: 'Password123',
}
const userInputSession = {
  email: 'jhondoe@mail.com',
  password: 'Password123',
}

describe('user', () => {
  describe('user registration', () => {
    describe('given the username and password are valid', () => {
      it('should return the user payload', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'CreateUser')
          // @ts-ignore
          .mockReturnValueOnce(userPayload)

        const { body, statusCode } = await supertest(app)
          .post('/api/user')
          .send(userInputRegistration)

        expect(statusCode).toBe(201)
        expect(body).toEqual(userPayload)
        expect(createUserServiceMock).toHaveBeenCalledWith(
          userInputRegistration
        )
      })
    })
    describe('given the passwords do not match', () => {
      it('should return 400', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'CreateUser')
          // @ts-ignore
          .mockReturnValueOnce(userPayload)
        const { body, statusCode } = await supertest(app)
          .post('/api/user')
          .send({ ...userInputRegistration, passwordConfirmation: '123' })

        expect(statusCode).toBe(400)
        expect(createUserServiceMock).not.toHaveBeenCalledWith()
      })
    })
    describe('given the user service throws', () => {
      it('should return 409 error', async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, 'CreateUser')
          .mockRejectedValueOnce({ status: 409, message: 'User alredy exist' })
        const { statusCode } = await supertest(app)
          .post('/api/user')
          .send(userInputRegistration)

        expect(statusCode).toBe(409)

        expect(createUserServiceMock).toHaveBeenCalledWith(
          userInputRegistration
        )
      })
    })
  })
  describe('create user session', () => {
    describe('given then username and password are valid', () => {
      it('should return a signed accessToken & refresh token', async () => {
        jest
          .spyOn(UserService, 'ValidatePassword')
          // @ts-ignore
          .mockReturnValueOnce(userPayload)

        jest
          .spyOn(UserSession, 'CreateSession')
          // @ts-ignore
          .mockResolvedValueOnce({
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
          })

        const { body, statusCode } = await supertest(app)
          .post('/api/session')
          .send({
            get: () => 'a user agente',
            body: userInputSession,
          })

        expect(statusCode).toBe(201)
        expect(body).toEqual({
          accessToken: 'accessToken',
          refreshToken: 'refreshToken',
        })
      })
    })
  })
})
