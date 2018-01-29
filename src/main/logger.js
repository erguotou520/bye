import fs from 'fs'
import tracer from 'tracer'
import bootstrapPromise, { logPath } from './bootstrap'

const logger = tracer.console({
  transport (data) {
    if (data) {
      bootstrapPromise.then(() => {
        fs.createWriteStream(logPath, {
          flags: 'a+'
        }).write(data.output + '\n', 'utf8')
      })
    }
  }
})
export default logger
