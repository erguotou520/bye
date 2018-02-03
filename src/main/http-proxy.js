import proxyServer from 'simple-web-proxy'
import httpShutdown from 'http-shutdown'
import { appConfig$ } from './data'
import { isHostPortValid } from './port'
import { showNotificationInOne } from './notification'
import logger from './logger'

let server

httpShutdown.extend()

/**
 * 开启HTTP代理服务
 * @param {Object} appConfig 应用配置
 */
export function startHttpProxyServer (appConfig) {
  if (appConfig.httpProxyEnable && appConfig.configs && appConfig.configs[appConfig.index]) {
    const host = appConfig.shareOverLan ? '0.0.0.0' : '127.0.0.1'
    isHostPortValid(host, appConfig.httpProxyPort).then(() => {
      server = proxyServer({
        listenHost: host,
        listenPort: appConfig.httpProxyPort
      }).withShutdown()
        .on('listening', () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('http proxy server listen at: %s:%s', host, appConfig.httpProxyPort)
          } else {
            logger.debug(`http proxy server listen at: ${host}:${appConfig.httpProxyPort}`)
          }
        })
        .once('error', err => {
          if (process.env.NODE_ENV === 'development') {
            console.log('http proxy server error: ', err)
          } else {
            logger.debug(`http proxy server error: ${err}`)
          }
          server.shutdown()
        })
    }).catch(() => {
      showNotificationInOne(`http代理端口${appConfig.httpProxyPort}被占用`, '警告')
    })
  }
}

/**
 * 关闭HTTP代理服务
 */
export async function stopHttpProxyServer () {
  if (server && server.listening) {
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
