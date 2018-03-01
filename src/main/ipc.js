import { app, ipcMain } from 'electron'
import { readJsonSync } from 'fs-extra'
import downloadGitRepo from 'download-git-repo'
import * as events from '../shared/events'
import { appConfigPath, defaultSSRDownloadDir } from './bootstrap'
import { updateAppConfig } from './data'
import { hideWindow } from './window'
import { importConfigFromClipboard } from './tray-handler'
import defaultConfig, { mergeConfig } from '../shared/config'
import { showNotification } from './notification'
import { sendData } from './window'
import { toggleMenu } from './menu'
import logger from './logger'

/**
 * ipc-main事件
 */
ipcMain.on(events.EVENT_APP_ERROR_RENDERER, e => {
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
      version: app.getVersion(),
      defaultSSRDownloadDir
    }
  }
}).on(events.EVENT_RX_SYNC_RENDERER, (e, data) => {
  // 同步数据
  if (process.env.NODE_ENV === 'development') {
    console.log('received sync data: ', data)
  }
  updateAppConfig(data, true)
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
}).on(events.EVENT_APP_NOTIFY_RENDERER, (e, body, title) => {
  // 显示来自renderer进程的通知
  showNotification(body, title)
}).on(events.EVENT_APP_TOGGLE_MENU, () => {
  // 切换menu显示
  toggleMenu()
})

/**
 * 将main进程的错误在renderer进程显示出来
 * @param {String|Object} err 错误内容
 */
export function showMainError (err) {
  sendData(events.EVENT_APP_ERROR_MAIN, err)
}
