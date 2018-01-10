import { app, shell, net, clipboard, dialog } from 'electron'
import { readJson, writeJSON } from 'fs-extra'
import { showWindow, destroyWindow, sendData } from './window'
import { stop as stopCommand } from './client'
import { destroyTray } from './tray'
import { updateAppConfig, currentConfig } from './data'
import bootstrapPromise, { logPath, appConfigPath } from './bootstrap'
import * as events from '../shared/events'
import { loadConfigsFromString } from '../shared/ssr'
import pkg from '../../package.json'

// 切换启用状态
export function toggleEnable () {
  updateAppConfig({ enable: !currentConfig.enable })
}

// 切换开机自启动
export function toggleAutoLaunch () {
  updateAppConfig({ autoLaunch: !currentConfig.autoLaunch })
}

// 更改选中的ssr配置
export function switchConfig (index) {
  updateAppConfig({ index })
}

// 二维码扫描
export function scanQRCode () {
  sendData(events.EVENT_APP_SCAN_DESKTOP)
}

// 打开选项设置页面
export function openOptionsWindow () {
  sendData(events.EVENT_APP_SHOW_WINDOW, 'options')
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
    properties: ['openDirectory']
  }, pathes => {
    if (pathes.length === 1) {
      writeJSON(currentConfig)
    }
  })
}

// 从粘贴板批量导入
export function importConfigFromClipboard () {
  const parsed = loadConfigsFromString(clipboard.readText())
  if (parsed.length) {
    updateAppConfig({ configs: [...currentConfig.configs, ...parsed] })
  }
}

// 打开配置文件
export async function openConfigFile () {
  await bootstrapPromise
  shell.showItemInFolder(appConfigPath)
}

// 检查更新
export function checkUpdate () {
  net.request('https://raw.githubusercontent.com/erguotou520/electron-ssr/master/app/package.json').on('response', (response) => {
    response.on('data', (chunk) => {
      const remotePkg = JSON.parse(chunk.toString())
      const currentVersion = pkg.version
      if (remotePkg.version > currentVersion) {
        sendData(events.EVENT_APP_UPDATE_VERSION, currentVersion, remotePkg.version)
      }
    })
  }).end()
}

// 打开日志文件
export async function openLog () {
  await bootstrapPromise
  shell.openItem(logPath)
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
  stopCommand()
  destroyWindow()
  destroyTray()
  app.quit()
}
