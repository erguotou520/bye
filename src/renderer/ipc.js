import path from 'path'
import { ipcRenderer, shell } from 'electron'
import store from './store'
import scanQrcode from './qrcode/scan-screenshot'
import * as events from '../shared/events'
import { loadConfigsFromString } from '../shared/ssr'

function showNotification (title, body) {
  new Notification(title, {
    icon: path.join(__dirname, '../trayicons/tray_win@3x.png'),
    body: body
  })
}

/**
 * ipc-render事件
 */
ipcRenderer.on(events.EVENT_APP_NOTIFY_NOTIFICATION, (e, { title, body, url }) => {
  const notify = showNotification(title, body)
  if (url) {
    notify.onclick = () => {
      shell.openExternal(url)
    }
  }
}).on(events.EVENT_APP_SCAN_DESKTOP, () => {
  scanQrcode((e, result) => {
    if (e) {
      showNotification('扫码失败', '未找到相关二维码')
    } else {
      const configs = loadConfigsFromString(result)
      if (configs.length) {
        store.dispatch('addConfigs', configs)
      }
    }
  })
}).on(events.EVENT_APP_ERROR_MAIN, () => {

}).on(events.EVENT_RX_SYNC_MAIN, (e, appConfig) => {
  console.log('received sync data: %o', appConfig)
  store.commit('updateConfig', appConfig)
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
  store.dispatch('initConfig', res)
}

/**
 * 隐藏窗口
 */
export function hideWindow () {
  ipcRenderer.send(events.EVENT_APP_HIDE_WINDOW)
}

// 启动应用时获取初始化数据
getInitConfig()
