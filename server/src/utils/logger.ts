import logger from 'pino'
import dayjs from 'dayjs'

export const log = logger({
  base: {
    pid: false,
  },
  transport: {
    target: 'pino-pretty',
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
})
