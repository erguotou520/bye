/**
 * pac文件下载更新等
 */
import http from 'http'
import { parse } from 'url'
import { readFile, writeFile, pathExists } from 'fs-extra'
import logger from './logger'
import { request } from '../shared/utils'
import bootstrapPromise, { pacPath } from './bootstrap'
import dataPromise, { currentConfig, appConfig$ } from './data'

let pacContent
let pacServer

/**
 * 下载pac文件
 */
export async function downloadPac (force = false) {
  await bootstrapPromise
  const pacExisted = await pathExists(pacPath)
  if (force || !pacExisted) {
    logger.debug('start download pac')
    const pac = await request('https://softs.fun/Other/pac.txt')
    pacContent = pac
    return await writeFile(pacPath, pac)
  }
}

function readPac () {
  return new Promise(resolve => {
    if (!pacContent) {
      resolve(readFile(pacPath))
    } else {
      resolve(pacContent)
    }
  })
}

/**
 * pac server
 */
export async function serverPac (pacPort) {
  await dataPromise
  const host = currentConfig.shareOverLan ? '0.0.0.0' : 'localhost'
  const port = pacPort !== undefined ? pacPort : currentConfig.pacPort || 1240
  pacServer = http.createServer((req, res) => {
    if (parse(req.url).pathname === '/pac') {
      downloadPac().then(() => {
        res.writeHead(200, { 'Content-Type': 'application/x-ns-proxy-autoconfig', 'Server': 'SSR client' })
        readPac().then(text => {
          res.write(text)
          res.end()
        })
      })
    } else {
      res.writeHead(200)
      res.end()
    }
  }).listen(port, host)
  pacServer
    .on('listening', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('pac server listen at: %s:%s', host, port)
      } else {
        logger.debug(`pac server listen at: ${host}:${port}`)
      }
    })
    .once('error', err => {
      if (err.code === 'EADDRINUSE') {
        // 端口已经被使用
        if (process.env.NODE_ENV === 'development') {
          console.log(`pac端口${port}已被占用`)
        } else {
          logger.warn(`pac端口${port}已被占用`)
        }
      }
      pacServer.close()
    })
}

/**
 * 关闭pac服务
 */
export async function stopPacServer () {
  if (pacServer) {
    return new Promise((resolve, reject) => {
      pacServer.once('close', () => {
        console.log('pac server closed.')
        resolve()
      }).once('error', reject)
    })
  }
  return Promise.resolve()
}

// 监听配置变化
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  // 初始化
  if (changed.length === 0) {
    serverPac()
  } else {
    if (changed.indexOf('pacPort') > -1) {
      stopPacServer().then(() => {
        serverPac(appConfig.pacPort)
      })
    }
  }
})
