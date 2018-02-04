import path from 'path'
import { app } from 'electron'
import { ensureDir, pathExists, ensureFile, outputJson } from 'fs-extra'
import logger from './logger'
import sudo from 'sudo-prompt'
import defaultConfig from '../shared/config'
import { isWin, isMac, isLinux, isOldMacVersion } from '../shared/env'
import { init as initIcon } from '../shared/icon'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// 应用配置存储目录
export const appConfigDir = app.getPath('userData')
// 应用配置存储路径
export const appConfigPath = path.join(appConfigDir, 'gui-config.json')
// 日志路径
export const logPath = path.join(appConfigDir, 'logs/shadowsocksr-client.log')
// 默认的ssr下载目录
export const defaultSSRDownloadDir = path.join(appConfigDir, 'shadowsocksr')
// pac文件下载目录
export const pacPath = path.join(appConfigDir, 'pac.txt')
// 记录上次订阅更新时间的文件
export const subscribeUpdateFile = path.join(appConfigDir, '.subscribe.update.last')
// 当前可执行程序的路径
const exePath = app.getPath('exe')
// windows sysproxy.exe文件的路径
let _winToolPath
if (isWin) {
  if (process.env.NODE_ENV === 'development') {
    _winToolPath = path.resolve(__dirname, '../lib/sysproxy.exe')
  } else {
    _winToolPath = path.join(exePath, '../sysproxy.exe')
  }
}
export const winToolPath = _winToolPath
// mac proxy_conf_helper工具目录
export const macToolPath = path.resolve(appConfigDir, 'proxy_conf_helper')

// try fix linux dismiss bug
if (isLinux) {
  process.env.XDG_CURRENT_DESKTOP = 'Unity'
}

// 在mac上执行sudo命令
async function sudoMacCommand (command) {
  return new Promise((resolve, reject) => {
    sudo.exec(command, { name: 'ShadowsocksR Client' }, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}

/**
 * 确保文件存在，目录正常
 */
async function init () {
  await ensureDir(appConfigDir)
  // 判断配置文件是否存在，不存在用默认数据写入
  const configFileExists = await pathExists(appConfigPath)
  if (!configFileExists) {
    await outputJson(appConfigPath, defaultConfig, { spaces: '\t' })
  }
  await ensureDir(path.join(appConfigDir, 'logs'))
  await ensureFile(logPath)

  // 初始化确保文件存在, 10.11版本以下不支持该功能
  if (isMac && !isOldMacVersion && !await pathExists(macToolPath)) {
    const helperPath = process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../lib/proxy_conf_helper')
      : path.join(exePath, '../../../Contents/proxy_conf_helper')
    await sudoMacCommand(`cp ${helperPath} "${macToolPath}" && chown root:admin "${macToolPath}" && chmod a+rx "${macToolPath}" && chmod +s "${macToolPath}"`)
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Config file\'s path: %s\nLog file\'s path: %s', appConfigPath, logPath)
  } else {
    logger.info('file ensured')
  }
  initIcon()
  return new Promise((resolve, reject) => {
    if (app.isReady()) {
      resolve()
    } else {
      app.once('ready', resolve)
    }
  })
}

export default init()
