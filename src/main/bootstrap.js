import path from 'path'
import { app } from 'electron'
import { ensureDir, pathExists, ensureFile, outputJson } from 'fs-extra'
// import logger from './logger'
import defaultConfig from '../shared/config'

// 应用配置存储目录
export const appConfigDir = app.getPath('userData')
// 应用配置存储路径
export const appConfigPath = path.join(appConfigDir, 'gui-config.json')
// 日志路径
export const logPath = path.join(appConfigDir, 'logs/shadowsocksr-client.log')
// ssr运行日志路径
export const ssrLogPath = path.join(appConfigDir, 'logs/shadowsocksr.log')
// 默认的ssr下载目录
export const defaultSSRDownloadDir = path.join(appConfigDir, 'shadowsocksr/shadowsocks')
// pac文件下载目录
export const pacPath = path.join(appConfigDir, 'pac.txt')

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
  console.log('Config file\'s path: %s\nLog file\'s path: %s\nSSR log file \'s path: %s', appConfigPath, logPath, ssrLogPath)
  // logger.debug('Config file\'s path: %s', appConfigPath)
}

export default init()
