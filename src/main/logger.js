import { app } from 'electron'
import log from 'electron-log'
import { join } from 'path'
import { ensureDirSync } from 'fs-extra'

const userPath = app.getPath('userData')
const logFolder = join(userPath, 'logs')
ensureDirSync(logFolder)

export const logPath = join(logFolder, 'shadowsocksr-client.log')

log.transports.file.file = logPath
log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s}:{ms} [{level}] {text}'
log.transports.file.maxSize = 5 * 1024 * 1024
log.transports.file.level = 'info'
log.transports.console.format = '{y}-{m}-{d} {h}:{i}:{s}:{ms} [{level}] {text}'
log.transports.console.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug'

export default log
