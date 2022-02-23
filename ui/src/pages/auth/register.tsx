import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string, TypeOf } from 'zod'

const createUserSchema = object({
  name: string()
    .nonempty({ message: 'Name is required' })
    .min(4, 'Name too short - should be 4 chars minimum'),
  password: string()
    .nonempty({ message: 'Password is required' })
    .min(6, 'Password too short - should be 6 chars minimum'),
  passwordConfirmation: string().nonempty({
    message: 'Password Confirmation is required',
  }),
  email: string()
    .nonempty({
      message: 'Email is required',
    })
    .email('Not a valid email'),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
})

type CreateUserInput = TypeOf<typeof createUserSchema>

const RegisterPage = () => {
  const [registerMessage, setRegisterMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({ resolver: zodResolver(createUserSchema) })

  const onSubmit = async (values: CreateUserInput) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/user`,
        values
      )
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/session`,
        { email: values.email, password: values.password },
        { withCredentials: true }
      )
      router.push('/')
    } catch (error: any) {
      setRegisterMessage('Account alredy exist')
      setStatus('error')
    }
  }

  return (
    <>
      <p className={`text-center ${status}`}>{registerMessage}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="jhondoe@mail.com"
            id="email"
            {...register('email')}
          />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            placeholder="Jhon Doe"
            id="name"
            {...register('name')}
          />
          <p className="error">{errors.name?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="******"
            id="password"
            {...register('password')}
          />
          <p className="error">{errors.password?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="passwordConfirmation">Password Confirmation</label>
          <input
            type="password"
            id="passwordConfirmation"
            placeholder="******"
            {...register('passwordConfirmation')}
          />
          <p className="error">{errors.passwordConfirmation?.message}</p>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </>
  )
}

export default RegisterPage
