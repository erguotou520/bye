/**
 * pac文件下载更新等
 */
import http from 'http'
import { parse } from 'url'
import { readFile, writeFile, pathExists } from 'fs-extra'
import { request } from './tools'
import bootstrapPromise, { pacPath } from './bootstrap'
import dataPromise, { currentConfig } from './data'

let pacContent

/**
 * 下载pac文件
 */
export async function downloadPac (force = false) {
  await bootstrapPromise
  const pacExisted = await pathExists(pacPath)
  if (force || !pacExisted) {
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
export async function serverPac () {
  await dataPromise
  http.createServer((req, res) => {
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
  }).listen(currentConfig.pacPort || 1240, currentConfig.shareOverLan ? '0.0.0.0' : 'localhost')
  console.log('pac server listen at: %s:%s', currentConfig.shareOverLan ? '0.0.0.0' : 'localhost', currentConfig.pacPort || 1240)
}
