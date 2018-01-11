/**
 * 工具类
 */
import { net } from 'electron'

/**
 * 发起网络请求
 * @param {String} url 请求的路径
 */
export function request (url) {
  return new Promise((resolve, reject) => {
    net.request(url)
      .on('response', response => {
        const body = []
        response.on('data', chunk => {
          body.push(chunk.toString())
        })
        response.on('end', () => {
          const stringRes = body.join('')
          if (response.headers['content-type'] === 'application/json') {
            resolve(JSON.parse(stringRes))
          } else {
            resolve(stringRes)
          }
        })
      })
      .on('error', reject)
      .end()
  })
}
