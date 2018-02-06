import { autoUpdater } from 'electron-updater'
import { showNotification } from './notification'

let forceUpdate = false

// 自定义检测更新事件
autoUpdater
  .on('error', err => {
    showNotification(err ? (err.stack || err) : 'unknown', '检查更新失败')
  })
  .on('update-available', UpdateInfo => {
    showNotification(`检测到最新版本${UpdateInfo.version}，系统将自动下载并更新`)
    autoUpdater.downloadUpdate()
  })
  .on('update-not-available', () => {
    forceUpdate && showNotification('当前已是最新版，无需更新')
  })
  .on('update-downloaded', () => {
    showNotification('应用已完成更新，下次启动将加载最新版本')
  })

// 检查更新
export function checkUpdate (force = false) {
  forceUpdate = force
  autoUpdater.checkForUpdates()
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
