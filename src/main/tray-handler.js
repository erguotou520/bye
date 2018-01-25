import { app, shell, clipboard, dialog } from 'electron'
import { readJson, writeJSON } from 'fs-extra'
import { autoUpdater } from 'electron-updater'
import bootstrapPromise, { logPath, appConfigPath } from './bootstrap'
import { showWindow, sendData } from './window'
export { openDevtool } from './window'
export { updateSubscribes } from './subscribe'
import { updateAppConfig, currentConfig } from './data'
import { downloadPac } from './pac'
import { startProxy } from './proxy'
import * as events from '../shared/events'
import { loadConfigsFromString } from '../shared/ssr'
// import { request } from '../shared/utils'
// import pkg from '../../package.json'

// 切换启用状态
export function toggleEnable () {
  updateAppConfig({ enable: !currentConfig.enable })
}

// 切换代理方式
export function toggleProxy (mode) {
  startProxy(mode)
  updateAppConfig({ sysProxyMode: mode })
}

// 更改选中的ssr配置
export function switchConfig (index) {
  updateAppConfig({ index })
}

// 更新pac
export function updatePac () {
  downloadPac(true).then(() => {
    sendData(events.EVENT_APP_NOTIFY_NOTIFICATION, { title: 'PAC更新', body: 'PAC文件更新成功' })
  }).catch(() => {
    sendData(events.EVENT_APP_NOTIFY_NOTIFICATION, { title: 'PAC更新', body: 'PAC文件更新失败' })
  })
}

// 二维码扫描
export function scanQRCode () {
  sendData(events.EVENT_APP_SCAN_DESKTOP)
}

// 打开选项设置页面
export function openOptionsWindow () {
  sendData(events.EVENT_APP_SHOW_PAGE, 'Options')
}

// 导入配置文件
export function importConfigFromFile () {
  dialog.showOpenDialog({
    title: '选择gui-config.json',
    properties: ['openFile'],
    filters: [{ name: 'Json', extensions: ['json'] }]
  }, pathes => {
    if (pathes.length === 1) {
      readJson(pathes[0]).then(fileConfig => {
        updateAppConfig(fileConfig)
      }).catch(() => {})
    }
  })
}

// 导出配置文件
export function exportConfigToFile () {
  dialog.showOpenDialog({
    title: '选择导出的目录',
    properties: ['openDirectory', 'createDirectory']
  }, pathes => {
    if (pathes.length === 1) {
      writeJSON(currentConfig)
    }
  })
}

// 从剪贴板批量导入
export function importConfigFromClipboard () {
  const parsed = loadConfigsFromString(clipboard.readText())
  if (parsed.length) {
    updateAppConfig({ configs: [...currentConfig.configs, ...parsed] })
  }
  sendData(events.EVENT_APP_NOTIFY_NOTIFICATION, {
    title: '导入通知',
    body: parsed.length ? `已导入${parsed.length}条数据` : '从剪贴板中导入失败'
  })
}

// 打开配置文件
export async function openConfigFile () {
  await bootstrapPromise
  shell.openItem(appConfigPath)
}

// 检查更新
export function checkUpdate () {
  autoUpdater.checkForUpdatesAndNotify()
  // request('https://raw.githubusercontent.com/erguotou520/electron-ssr/master/app/package.json').then(data => {
  //   const remotePkg = JSON.parse(data)
  //   const currentVersion = pkg.version
  //   const isOutdated = remotePkg.version > currentVersion
  //   sendData(events.EVENT_APP_NOTIFY_NOTIFICATION, {
  //     title: '更新通知',
  //     body: isOutdated ? `最新版本为 v${remotePkg.version}，点击前往下载。` : '当前已是最新版',
  //     url: isOutdated ? 'https://github.com/erguotou520/electron-ssr/releases' : ''
  //   })
  // })
}

// 打开日志文件
export async function openLog () {
  await bootstrapPromise
  shell.openItem(logPath)
}

// 打开选项设置页面
export function showOptions () {
  showWindow()
  sendData(events.EVENT_APP_SHOW_PAGE, { page: 'Options' })
}

// 打开订阅管理页面
export function showSubscribes () {
  showWindow()
  sendData(events.EVENT_APP_SHOW_PAGE, { page: 'Options', tab: 'subscribes' })
}

// 打开服务器编辑窗口
export function showManagePanel () {
  showWindow()
  sendData(events.EVENT_APP_SHOW_PAGE, { page: 'ManagePanel' })
}

// 复制http代理命令行代码
export function copyHttpProxyCode () {
  clipboard.writeText(`export http_proxy="http:127.0.0.1:${currentConfig.httpProxyPort}"
export https_proxy="http:127.0.0.1:${currentConfig.httpProxyPort}"
`)
}

// 打开窗口
export function showMainWindow () {
  showWindow()
}

// 打开指定的url
export function openURL (url) {
  return shell.openExternal(url)
}

// 退出
export function exitApp () {
  app.quit()
}
