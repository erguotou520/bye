import { ipcMain } from 'electron'
import { readJsonSync } from 'fs-extra'
import downloadGitRepo from 'download-git-repo'
import * as events from '../shared/events'
import { appConfigPath, defaultSSRDownloadDir } from './bootstrap'
import { updateAppConfig } from './data'
import { hideWindow } from './window'
import { importConfigFromClipboard } from './tray-handler'
import defaultConfig, { mergeConfig } from '../shared/config'
import logger from './logger'

const pkg = require('../../package.json')
/**
 * ipc-main事件
 */
ipcMain.on(events.EVENT_APP_ERROR_RENDER, e => {
  // 渲染进程报错
  logger.error(e)
}).on(events.EVENT_APP_HIDE_WINDOW, () => {
  // 隐藏窗口
  hideWindow()
}).on(events.EVENT_APP_WEB_INIT, e => {
  // 页面初始化
  let stored
  try {
    stored = readJsonSync(appConfigPath)
    mergeConfig(stored)
  } catch (e) {
    stored = defaultConfig
  }
  e.returnValue = {
    config: stored,
    meta: {
      version: pkg.version,
      defaultSSRDownloadDir
    }
  }
}).on(events.EVENT_RX_SYNC_RENDERER, (e, data) => {
  // 同步数据
  if (process.env.NODE_ENV === 'development') {
    console.log('received sync data: ', data)
  }
  updateAppConfig(data)
}).on(events.EVENT_SSR_DOWNLOAD_RENDERER, e => {
  // 下载ssr
  if (process.env.NODE_ENV === 'development') {
    console.log('start download ssr')
  } else {
    logger.debug('start download ssr')
  }
  // 自动下载ssr项目
  downloadGitRepo('shadowsocksr-backup/shadowsocksr#dev', defaultSSRDownloadDir, err => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ssr download', err ? 'error' : 'success')
    } else {
      logger.debug(`ssr download ${err ? 'error' : 'success'}`)
    }
    e.sender.send(events.EVENT_SSR_DOWNLOAD_MAIN, err)
  })
}).on(events.EVENT_CONFIG_COPY_CLIPBOARD, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('import config from clipboard')
  }
  // 从剪切板导入
  importConfigFromClipboard()
})
