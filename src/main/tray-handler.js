import { app, shell, clipboard } from 'electron'
import { readJson, writeJson } from 'fs-extra'
import { join } from 'path'
import bootstrapPromise, { appConfigPath } from './bootstrap'
import { logPath } from './logger'
import { showWindow, sendData } from './window'
export { openDevtool } from './window'
export { updateSubscribes } from './subscribe'
import { updateAppConfig, currentConfig } from './data'
import { downloadPac } from './pac'
import { startProxy } from './proxy'
import { showNotification } from './notification'
import * as events from '../shared/events'
import { loadConfigsFromString } from '../shared/ssr'
import { chooseFile, chooseSavePath } from '../shared/dialog'

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
    showNotification('PAC文件更新成功')
  }).catch(() => {
    showNotification('PAC文件更新失败')
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
  const _path = chooseFile('选择gui-config.json', [{ name: 'Json', extensions: ['json'] }])
  if (_path) {
    readJson(_path).then(fileConfig => {
      updateAppConfig(fileConfig, false, true)
    }).catch(() => {})
  }
}

// 导出配置文件
export function exportConfigToFile () {
  const _path = chooseSavePath('选择导出的目录')
  if (_path) {
    writeJson(join(_path, 'gui-config.json'), currentConfig, { spaces: '\t' })
  }
}

// 从剪贴板批量导入
export function importConfigFromClipboard () {
  const parsed = loadConfigsFromString(clipboard.readText().trim())
  if (parsed.length) {
    updateAppConfig({ configs: [...currentConfig.configs, ...parsed] })
  }
  showNotification(parsed.length ? `已导入${parsed.length}条数据` : '从剪贴板中导入失败')
}

// 打开配置文件
export async function openConfigFile () {
  await bootstrapPromise
  shell.openItem(appConfigPath)
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
  clipboard.writeText(`export http_proxy="http://127.0.0.1:${currentConfig.httpProxyPort}"
export https_proxy="http://127.0.0.1:${currentConfig.httpProxyPort}"
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
