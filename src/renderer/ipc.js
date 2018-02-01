import path from 'path'
import { ipcRenderer, shell } from 'electron'
import store from './store'
import scanQrcode from './qrcode/scan-screenshot'
import generateTrayImage from './tray'
import * as events from '../shared/events'
import { loadConfigsFromString } from '../shared/ssr'

export function showNotification (title, body) {
  new Notification(title, {
    icon: path.join(__static, 'tray_win@3x.png'),
    body: body
  })
}

/**
 * ipc-render事件
 */
ipcRenderer.on(events.EVENT_APP_NOTIFY_NOTIFICATION, (e, { title, body, url }) => {
  // 显示main进程的通知
  const notify = showNotification(title, body)
  if (url) {
    notify.onclick = () => {
      shell.openExternal(url)
    }
  }
}).on(events.EVENT_APP_SCAN_DESKTOP, () => {
  // 扫描二维码
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
}).on(events.EVENT_APP_SHOW_PAGE, (e, targetView) => {
  // 显示具体某页面
  console.log('received view update: ', targetView.page, targetView.tab)
  store.commit('updateView', { ...targetView, fromMain: true })
}).on(events.EVENT_APP_ERROR_MAIN, (e, err) => {
  // 弹框显示main进程报错内容
  alert(err)
}).on(events.EVENT_SUBSCRIBE_UPDATE_MAIN, (e) => {
  // 更新订阅服务器
  store.dispatch('updateSubscribes').then(updatedCount => {
    if (updatedCount > 0) {
      showNotification('订阅更新通知', `服务器订阅更新成功，共更新了${updatedCount}个节点`)
    }
  }).catch(() => {
    showNotification('订阅更新通知', '服务器订阅更新失败')
  })
}).on(events.EVENT_RX_SYNC_MAIN, (e, appConfig) => {
  // 同步数据
  console.log('received sync data: %o', appConfig)
  store.commit('updateConfig', appConfig)
}).on(events.EVENT_TRAY_GENERATE_MAIN, (e, mode) => {
  // 生成tray image
  generateTrayImage().then(data => {
    ipcRenderer.send(events.EVENT_TRAY_GENERATE_RENDERER, data)
  })
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
