import { ipcRenderer } from 'electron'
import store from './store'
import { showNotification, showHtmlNotification } from './notification'
import scanQrcode from './qrcode/scan-screenshot'
import * as events from '../shared/events'
import { loadConfigsFromString } from '../shared/ssr'

/**
 * ipc-render事件
 */
ipcRenderer.on(events.EVENT_APP_NOTIFY_MAIN, (e, { title, body }) => {
  // 显示main进程的通知
  showHtmlNotification(body, title)
}).on(events.EVENT_APP_SCAN_DESKTOP, () => {
  // 扫描二维码
  scanQrcode((e, result) => {
    if (e) {
      showNotification('未找到相关二维码', '扫码失败')
    } else {
      const configs = loadConfigsFromString(result)
      if (configs.length) {
        store.dispatch('addConfigs', configs)
        showNotification(`已成功添加${configs.length}条记录`)
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
      showNotification(`服务器订阅更新成功，共更新了${updatedCount}个节点`)
    } else {
      showNotification(`服务器订阅更新完成，没有新节点`)
    }
  }).catch(() => {
    showNotification('服务器订阅更新失败')
  })
}).on(events.EVENT_RX_SYNC_MAIN, (e, appConfig) => {
  // 同步数据
  console.log('received sync data: %o', appConfig)
  store.commit('updateConfig', [appConfig])
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
export function getInitConfig () {
  console.log('get init config data')
  const res = ipcRenderer.sendSync(events.EVENT_APP_WEB_INIT)
  store.dispatch('initConfig', res)
}

/**
 * 切换menu显示
 */
export function toggleMenu () {
  ipcRenderer.send(events.EVENT_APP_TOGGLE_MENU)
}

/**
 * 隐藏窗口
 */
export function hideWindow () {
  ipcRenderer.send(events.EVENT_APP_HIDE_WINDOW)
}

/**
 * 打开本地文件/目录
 */
export function openDialog (options) {
  return ipcRenderer.sendSync(events.EVENT_APP_OPEN_DIALOG, options)
}
