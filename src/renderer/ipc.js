import { ipcRenderer, shell } from 'electron'
import store from './store'
import * as events from '../shared/events'

/**
 * ipc-render事件
 */
ipcRenderer.on(events.EVENT_APP_UPDATE_VERSION, (e, oldVersion, newVersion) => {
  new Notification('New version avaliable.', {
    body: `New version v${newVersion}, click to download`
  }).onclick = () => {
    shell.openExternal('https://github.com/erguotou520/electron-ssr/releases')
  }
}).on(events.EVENT_APP_ERROR_MAIN, () => {

}).on(events.EVENT_RX_SYNC_MAIN, (e, appConfig) => {
  console.log('received sync data: %o', appConfig)
  store.updateConfig(appConfig)
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
  const res = ipcRenderer.sendSync(events.EVENT_APP_WEB_INIT)
  store.commit('updateConfig', res.config)
  store.commit('updateMeta', res.meta)
}

// 启动应用时获取初始化数据
getInitConfig()
