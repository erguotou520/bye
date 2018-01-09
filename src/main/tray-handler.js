import { app, shell, net } from 'electron'
import { showWindow, destroyWindow, sendData } from './window'
import { stop as stopCommand } from './ssr'
import { destroyTray } from './tray'
import bootstrapPromise, { logPath } from './bootstrap'
import { EVENT_APP_UPDATE_VERSION } from '../shared/events'
import pkg from '../../package.json'

// 切换启用状态
export function toggleEnable () {
  //
}

// 切换开机自启动
export function toggleAutoLaunch () {
  //
}

// 更改选中的ssr配置
export function switchConfig () {
  //
}

// 二维码扫描
export function scanQRCode () {
  //
}

// 打开选项设置页面
export function openOptionsWindow () {
  //
}

// 导入配置文件
export function importConfigFromFile () {
  //
}

// 导出配置文件
export function exportConfigToFile () {
  //
}

// 从粘贴板批量导入
export function importConfigFromClipboard () {
  //
}

// 打开配置文件
export function openConfigFile () {
  //
}

// 检查更新
export function checkUpdate () {
  // https://raw.githubusercontent.com/erguotou520/electron-ssr/master/app/package.json
  net.request('https://raw.githubusercontent.com/erguotou520/electron-ssr/redesign/package.json').on('response', (response) => {
    response.on('data', (chunk) => {
      const remotePkg = JSON.parse(chunk.toString())
      const currentVersion = pkg.version
      if (remotePkg.version > currentVersion) {
        sendData(EVENT_APP_UPDATE_VERSION, currentVersion, remotePkg.version)
      }
    })
  }).end()
}

// 打开日志文件
export function openLog () {
  bootstrapPromise.then(() => {
    shell.openItem(logPath)
  })
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
