import path from 'path'
import { app } from 'electron'
import { ensureDir, pathExists, ensureFile, outputJson } from 'fs-extra'
import logger from './logger'
import Sudoer from './mac-sudo'
import defaultConfig from '../shared/config'
import { isWin, isMac } from '../shared/env'

// 应用配置存储目录
export const appConfigDir = app.getPath('userData')
// 应用配置存储路径
export const appConfigPath = path.join(appConfigDir, 'gui-config.json')
// 日志路径
export const logPath = path.join(appConfigDir, 'logs/shadowsocksr-client.log')
// ssr运行日志路径
export const ssrLogPath = path.join(appConfigDir, 'logs/shadowsocksr.log')
// 默认的ssr下载目录
export const defaultSSRDownloadDir = path.join(appConfigDir, 'shadowsocksr')
// pac文件下载目录
export const pacPath = path.join(appConfigDir, 'pac.txt')
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

// 在mac上执行sudo命令
async function sudoMacCommand (command) {
  const sudoer = new Sudoer({ name: 'ShadowsocksR客户端' })
  try {
    const result = await sudoer.exec(command)
    result.on('close', () => {
      if (process.env.NODE_ENV === 'development') {
        result.output.stdout && console.log(result.output.stdout.toString())
        result.output.stderr && console.error(result.output.stderr.toString())
      } else {
        result.output.stdout && logger.log(result.output.stdout.toString())
        result.output.stderr && logger.error(result.output.stderr.toString())
      }
    })
    return result
  } catch (e) {
    app.quit()
  }
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
  await ensureFile(ssrLogPath)

  // 初始化确保文件存在
  if (isMac && !await pathExists(macToolPath)) {
    const helperPath = process.env.NODE_ENV === 'development'
      ? path.join(__dirname, '../lib/proxy_conf_helper')
      : path.join(exePath, '../../../Contents/proxy_conf_helper')
    sudoMacCommand(`cp ${helperPath} "${macToolPath}" && chown root:admin "${macToolPath}" && chmod a+rx "${macToolPath}" && chmod +s "${macToolPath}"`)
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Config file\'s path: %s\nLog file\'s path: %s\nSSR log file \'s path: %s', appConfigPath, logPath, ssrLogPath)
  } else {
    logger.info('file ensured')
  }
}

export default init()
