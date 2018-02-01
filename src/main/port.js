import { createServer } from 'net'

/**
 * 判断要监听的host和port是否可用
 * @param {String} host 要监听的地址
 * @param {Number|String} port 要监听的端口
 */
export function isHostPortValid (host, port) {
  return new Promise((resolve, reject) => {
    const tester = createServer().listen(port, host).once('error', reject)
      .once('listening', () => {
        let closed = false
        tester.close(() => {
          closed = true
          resolve()
        })
        setTimeout(() => {
          if (!closed) {
            reject()
          }
        }, 5000)
      })
  })
}

/**
 * 判断端口是否可使用
 * @param {Number|String} port 要判断的端口
 */
export function isPortValid (port) {
  return Promise.all([isHostPortValid('0.0.0.0', port), isHostPortValid('127.0.0.1', port)])
}
