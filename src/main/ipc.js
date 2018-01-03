import { ipcMain } from 'electron'
import { Observable } from 'rxjs/Observable'
import * as events from '../shared/events'
import { readJsonSync } from 'fs-extra'
import { appConfigPath, defaultSSRDownloadDir } from './bootstrap'
import downloadGitRepo from 'download-git-repo'
// import logger from './logger'

/**
 * ipc-main事件
 */
ipcMain.on(events.EVENT_APP_ERROR_RENDER, () => {
  //
}).on(events.EVENT_APP_HIDE_WINDOW, () => {

}).on(events.EVENT_APP_SHOW_WINDOW, () => {

}).on(events.EVENT_APP_WEB_INIT, e => {
  e.returnValue = {
    config: readJsonSync(appConfigPath),
    meta: {
      defaultSSRDownloadDir
    }
  }
}).on(events.EVENT_SSR_DOWNLOAD_RENDERER, e => {
  console.log('start download ssr')
  // 自动下载ssr项目
  downloadGitRepo('shadowsocksr-backup/shadowsocksr#dev', defaultSSRDownloadDir, err => {
    console.log('ssr download', err ? 'error' : 'success')
    e.sender.send(events.EVENT_SSR_DOWNLOAD_MAIN, err)
  })
})

export const ipc$ = Observable.create(observe => {
  ipcMain.on(events.EVENT_RX_SYNC_RENDERER, (e, data) => {
    console.log('received sync data: ', data)
    observe.next(data)
  })
})
