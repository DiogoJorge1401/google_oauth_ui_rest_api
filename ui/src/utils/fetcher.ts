import axios from 'axios'

export const fetcher = async <T>(url: string, headers = {}): Promise<T> =>
  (
    await axios.get<T>(url, {
      headers,
      withCredentials: true,
    })
  ).data
