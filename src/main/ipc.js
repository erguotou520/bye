import { ipcMain } from 'electron'
import { Observable } from 'rxjs/Observable'
import * as events from '../shared/events'
import { readJsonSync } from 'fs-extra'
import { appConfigPath } from './bootstrap'

/**
 * ipc-main事件
 */
ipcMain.on(events.EVENT_APP_ERROR_RENDER, () => {
  //
}).on(events.EVENT_APP_HIDE_WINDOW, () => {

}).on(events.EVENT_APP_SHOW_WINDOW, () => {

}).on(events.EVENT_APP_WEB_INIT, e => {
  e.returnValue = readJsonSync(appConfigPath)
})

export const ipc$ = Observable.create(observe => {
  ipcMain.on(events.EVENT_RX_SYNC_RENDERER, (e, data) => {
    console.log('received sync data: ', data)
    observe.next(data)
  })
})
