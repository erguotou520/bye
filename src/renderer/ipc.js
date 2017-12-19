import { ipcRenderer } from 'electron'
import data from './data'
import * as events from '../shared/events'

/**
 * ipc-render事件
 */
ipcRenderer.on(events.EVENT_APP_UPDATE_VERSION, () => {

}).on(events.EVENT_APP_ERROR_MAIN, () => {

}).on(events.EVENT_RX_SYNC_MAIN, (e, appConfig) => {
  console.log('received sync data: %o', appConfig)
  data.updateConfig(appConfig)
})

/**
 * 与main进程同步配置项
 * @param {Object} appConfig 用于更新的应用配置
 */
export function syncConfig (appConfig) {
  console.log('start sync data: %o', appConfig)
  ipcRenderer.send(events.EVENT_RX_SYNC_RENDERER, appConfig)
}

/**
 * 主动获取初始化数据
 */
function getInitConfig () {
  console.log('get init config data')
  const appConfig = ipcRenderer.sendSync(events.EVENT_APP_WEB_INIT)
  console.log(appConfig)
  data.updateConfig(appConfig)
}
getInitConfig()
