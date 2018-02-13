import fs from 'fs'
import tracer from 'tracer'
import bootstrapPromise, { logPath } from './bootstrap'

// 日志文件最大10M
const LOG_MAX_SIZE = 1024 * 1024 * 10

// 需要等待日志清除操作
let promise

function transport (data) {
  if (data) {
    bootstrapPromise.then(() => {
      return promise
    }).then(() => {
      fs.createWriteStream(logPath, {
        flags: 'a+'
      }).write(data.output.endsWith('\n') ? data.output : data.output + '\n', 'utf8')
    }).catch(() => {})
  }
}

export default tracer.console({
  dateformat: 'yyyy-mm-dd HH:MM:ss',
  transport
})

/**
 * 清除日志文件，防止溢出
 */
export function clearLog () {
  try {
    promise = new Promise((resolve, reject) => {
      // 如果日志文件超出限额
      const size = fs.statSync(logPath).size
      if (size >= LOG_MAX_SIZE) {
        // 最多保留16*1024字符的日志
        const readStream = fs.createReadStream(logPath, { start: size - 16 * 1024 - 1, end: size - 1 })
        const data = []
        readStream.on('data', chunk => {
          data.push(chunk.toString())
        }).on('end', () => {
          // 分割日志
          const saved = data.join('').split('\n').slice(1)
          // 保存日志
          fs.createWriteStream(logPath, {
            flags: 'w'
          }).write(saved.join('\n'), 'utf-8', resolve)
        })
      } else {
        resolve()
      }
    })
  } catch (e) { promise = Promise.reject(e) }
  return promise
}
