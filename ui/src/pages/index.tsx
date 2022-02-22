import { GetServerSideProps, NextPage } from 'next'
import useSWR from 'swr'
import { fetcher } from '../utils/fetcher'

interface User {
  _id: string
  email: string
  name: string
  session: string
  iat: number
  exp: number
}

const Home: NextPage<{ fallbackData: User }> = ({ fallbackData }) => {
  const { data } = useSWR<User>(
    `
    ${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/user/me
  `,
    fetcher,
    { fallbackData }
  )

  if (data) {
    return (
      <div>
        <h1>Welcome! {data.name}</h1>
      </div>
    )
  }

  return (
    <div>
      <h2>
        Please Login <a href="/auth/login">Login</a>
      </h2>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data = await fetcher<User>(
      `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/user/me`,
      context.req.headers
    )

    return {
      props: { fallbackData: data },
    }
  } catch (err) {
    return {
      props: {},
    }
  }
}

export default Home
