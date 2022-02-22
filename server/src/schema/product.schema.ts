import { number, object, string, TypeOf } from 'zod'

const payload = {
  body: object({
    title: string({
      required_error: 'title is required',
    }),
    description: string({
      required_error: 'description is required',
    }).min(120, 'Description should be at least 120 chars long'),
    price: number({
      required_error: 'price is required',
    }),
    image: string({
      required_error: 'image is required',
    }),
  }),
}

const params = {
  params: object({
    productId: string({
      required_error: 'productId is required',
    }),
  }),
}

export const CreateProductSchema = object({
  ...payload,
})
export const UpdateProductSchema = object({
  ...payload,
  ...params,
})
export const DeleteProductSchema = object({
  ...params,
})
export const GetProductSchema = object({
  ...params,
})

export type CreateProductInput = TypeOf<typeof CreateProductSchema>
export type UpdateProductInput = TypeOf<typeof UpdateProductSchema>
export type GetProductInput = TypeOf<typeof GetProductSchema>
export type DeleteProductInput = TypeOf<typeof DeleteProductSchema>
