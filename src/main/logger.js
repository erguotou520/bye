import fs from 'fs'
import tracer from 'tracer'

const logger = tracer.console({
  transport (data) {
    fs.createWriteStream('./stream.log', {
      flags: 'a+'
    }).write(data.output + '\n')
  }
})

export default logger