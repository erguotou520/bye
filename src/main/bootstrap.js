import path from 'path'
import { app } from 'electron'
import { ensureDir, pathExists, ensureFile, outputJson } from 'fs-extra'
// import logger from './logger'
import defaultConfig from '../shared/config'

// 应用配置存储目录
export const appConfigDir = app.getPath('userData')
// 应用配置存储路径
export const appConfigPath = path.join(appConfigDir, 'shadowsocksr.json')
// 日志路径
export const logPath = path.join(appConfigDir, 'logs/shadowsocksr-client.log')
// 默认的ssr下载目录
export const defaultSSRDownloadDir = path.join(appConfigDir, 'shadowsocksr')

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
  console.log('Config file\'s path: %s\nLog file\'s path: %s', appConfigPath, logPath)
  // logger.debug('Config file\'s path: %s', appConfigPath)
}

export default init()
