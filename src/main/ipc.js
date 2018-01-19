import { ipcMain } from 'electron'
import { readJsonSync } from 'fs-extra'
import downloadGitRepo from 'download-git-repo'
import * as events from '../shared/events'
import { appConfigPath, defaultSSRDownloadDir } from './bootstrap'
import { updateAppConfig } from './data'
import { hideWindow } from './window'
import defaultConfig, { mergeConfig } from '../shared/config'
import logger from './logger'

const pkg = require('../../package.json')
/**
 * ipc-main事件
 */
ipcMain.on(events.EVENT_APP_ERROR_RENDER, e => {
  logger.error(e)
}).on(events.EVENT_APP_HIDE_WINDOW, () => {
  hideWindow()
}).on(events.EVENT_APP_WEB_INIT, e => {
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
  console.log('received sync data: ', data)
  updateAppConfig(data)
}).on(events.EVENT_SSR_DOWNLOAD_RENDERER, e => {
  console.log('start download ssr')
  // 自动下载ssr项目
  downloadGitRepo('shadowsocksr-backup/shadowsocksr#dev', defaultSSRDownloadDir, err => {
    console.log('ssr download', err ? 'error' : 'success')
    e.sender.send(events.EVENT_SSR_DOWNLOAD_MAIN, err)
  })
})
