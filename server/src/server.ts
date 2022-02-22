import config from 'config'
import { log } from './utils/logger'
import { app } from './app'
import { connect } from './utils/connect'
const port = config.get('port')

connect()

app.listen(port, () => {
  log.info(`App is running at http://localhost:${port}`)
})
