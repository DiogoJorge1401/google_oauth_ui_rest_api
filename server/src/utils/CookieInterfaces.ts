export interface AddTokensToCookieProps {
  user: {
    name?: string
    email?: string
    _id: any
  }
  session: string
  expiresIn: string
}