import proxyServer from 'simple-web-proxy'
import httpShutdown from 'http-shutdown'
import { appConfig$ } from './data'
import logger from './logger'

let server

httpShutdown.extend()

/**
 * 开启HTTP代理服务
 * @param {Object} appConfig 应用配置
 */
export function startHttpProxyServer (appConfig) {
  if (appConfig.httpProxyEnable) {
    server = proxyServer({
      listenHost: appConfig.shareOverLan ? '0.0.0.0' : '127.0.0.1',
      listenPort: appConfig.httpProxyPort
    }).withShutdown()
      .on('listening', () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('http proxy server listen at: %s:%s', appConfig.shareOverLan ? '0.0.0.0' : '127.0.0.1', appConfig.httpProxyPort)
        } else {
          logger.debug(`http proxy server listen at: ${appConfig.shareOverLan ? '0.0.0.0' : '127.0.0.1'}:${appConfig.httpProxyPort}`)
        }
      })
      .once('error', err => {
        if (err.code === 'EADDRINUSE') {
          // 端口已经被使用
          if (process.env.NODE_ENV === 'development') {
            console.log(`http代理端口${appConfig.httpProxyPort}已被占用`)
          } else {
            logger.warn(`http代理端口${appConfig.httpProxyPort}已被占用`)
          }
        }
        server.shutdown()
      })
  }
}

/**
 * 关闭HTTP代理服务
 */
export async function stopHttpProxyServer () {
  if (server) {
    return new Promise((resolve, reject) => {
      server.shutdown(err => {
        if (err) {
          if (process.env.NODE_ENV === 'development') {
            console.log(err)
          } else {
            logger.warn(`close http proxy server error: ${err}`)
          }
          reject()
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('http proxy server closed.')
          } else {
            logger.debug('http proxy server closed.')
          }
          resolve()
        }
      })
    })
  }
  return Promise.resolve()
}

// 监听配置变化
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  // 初始化
  if (changed.length === 0) {
    startHttpProxyServer(appConfig)
  } else {
    // 数据变更
    if (['shareOverLan', 'httpProxyEnable', 'httpProxyPort'].some(key => changed.indexOf(key) > -1)) {
      stopHttpProxyServer().then(() => {
        startHttpProxyServer(appConfig)
      })
    }
  }
})
