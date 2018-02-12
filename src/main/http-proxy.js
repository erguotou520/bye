import proxyServer from 'simple-web-proxy'
import httpShutdown from 'http-shutdown'
import { dialog } from 'electron'
import { appConfig$ } from './data'
import { isHostPortValid } from './port'
import logger from './logger'

let server

httpShutdown.extend()

/**
 * 开启HTTP代理服务
 * @param {Object} appConfig 应用配置
 */
export function startHttpProxyServer (appConfig, isProxyStarted) {
  if (isProxyStarted && appConfig.httpProxyEnable) {
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
      dialog.showMessageBox({
        type: 'warning',
        title: '警告',
        message: `http代理端口 ${appConfig.httpProxyPort} 被占用`
      })
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
  const [appConfig, changed, , isProxyStarted, isOldProxyStarted] = data
  // 初始化
  if (changed.length === 0) {
    startHttpProxyServer(appConfig, isProxyStarted)
  } else {
    // 数据变更
    if (['shareOverLan', 'httpProxyEnable', 'httpProxyPort'].some(key => changed.indexOf(key) > -1) || isProxyStarted !== isOldProxyStarted) {
      stopHttpProxyServer().then(() => {
        startHttpProxyServer(appConfig, isProxyStarted)
      })
    }
  }
})
