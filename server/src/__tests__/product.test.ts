import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import supertest from 'supertest'
import { app } from '../app'
import { CreateProduct } from '../services/Product/product.service'
import { signJwt } from '../utils/Jwt.utils'

const makeProductDTO = () => {
  const userId = new mongoose.Types.ObjectId().toString()

  return {
    user: userId,
    title: 'product_title_test',
    description:
      'In et sint proident qui laboris est enim esse occaecat ullamco. Est minim aliqua adipisicing adipisicing nulla non ea nostrud do ea eiusmod incididunt.',
    price: 1000,
    image: 'image_product_test.jpg',
  }
}

const makeUserDataTokenDTO = () => {
  const userId = new mongoose.Types.ObjectId().toString()
  return {
    _id: userId,
    email: 'jhondoe@mail.com',
    name: 'Jhon Doe',
  }
}

describe('product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()

    await mongoose.connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  describe('get product route', () => {
    describe('given the product does not exist', () => {
      it('should return a 404', async () => {
        const productId = 'product-123'

        await supertest(app).get(`/api/product/${productId}`).expect(404)
      })
    })
    describe('given the product does exist', () => {
      it('should return a 200 status and the product', async () => {
        const product = await CreateProduct(makeProductDTO())

        const { productId } = product

        const { body, statusCode } = await supertest(app).get(
          `/api/product/${productId}`
        )

        expect(body.productId).toBe(productId)
        expect(statusCode).toBe(200)
      })
    })
  })

  describe('create product route', () => {
    describe('given the user is not logged in', () => {
      it('should retur a 401', async () => {
        const { statusCode } = await supertest(app).post('/api/product')

        expect(statusCode).toBe(401)
      })
    })
    describe('given the user is logged in', () => {
      it('should retur a 201 and created product', async () => {
        const jwt = signJwt(makeUserDataTokenDTO())

        const { body, statusCode } = await supertest(app)
          .post('/api/product')
          .set('Authorization', `Bearer ${jwt}`)
          .send(makeProductDTO())

        expect(statusCode).toBe(201)
        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          description:
            'In et sint proident qui laboris est enim esse occaecat ullamco. Est minim aliqua adipisicing adipisicing nulla non ea nostrud do ea eiusmod incididunt.',
          image: 'image_product_test.jpg',
          price: 1000,
          productId: expect.any(String),
          title: 'product_title_test',
          updatedAt: expect.any(String),
          user: expect.any(String),
        })
      })
    })
  })
})
