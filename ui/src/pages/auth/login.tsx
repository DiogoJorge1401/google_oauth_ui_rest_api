import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string, TypeOf } from 'zod'

const createSessionSchema = object({
  password: string().nonempty({
    message: 'Password is required',
  }),
  email: string()
    .nonempty({ message: 'Email is required' })
    .email('Not a valid email'),
})

type CreateSessionInput = TypeOf<typeof createSessionSchema>

const LoginPage = () => {
  const [registerMessage, setRegisterMessage] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  })

  const onSubmit = async (values: CreateSessionInput) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/session`,
        values,
        { withCredentials: true }
      )
      router.push('/')
    } catch (error: any) {
      setRegisterMessage('Invalid email or password')
      setStatus('error')
    }
  }

  return (
    <>
      <p className={`text-center ${status}`}>{registerMessage}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register('email')} />
          <p className="error">{errors.email?.message}</p>
        </div>

        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register('password')} />
          <p className="error">{errors.password?.message}</p>
        </div>
        <button type="submit">LOGIN</button>
      </form>
    </>
  )
}

export default LoginPage
