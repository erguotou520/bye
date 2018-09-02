import { app, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { exePath } from './bootstrap'
import logger from './logger'
import { getWindow } from './window'
import { showNotification } from './notification'
import { isLinux } from '../shared/env'
import { request } from '../shared/utils'

let forceUpdate = false
autoUpdater.logger = logger
autoUpdater.autoDownload = false

// 自定义检测更新事件
autoUpdater
  .on('error', err => {
    showNotification(err ? (err.stack || err) : 'unknown', '检查更新失败')
  })
  .on('update-available', UpdateInfo => {
    showNotification(`检测到最新版本${UpdateInfo.version}，系统将自动下载并更新`)
    autoUpdater.downloadUpdate()
  })
  .on('download-progress', ({ percent }) => {
    const mainWindow = getWindow()
    if (mainWindow) {
      mainWindow.setProgressBar(percent >= 100 ? -1 : percent / 100)
    }
  })
  .on('update-not-available', () => {
    forceUpdate && showNotification('当前已是最新版，无需更新')
  })
  .on('update-downloaded', () => {
    showNotification('应用已完成更新，下次启动将加载最新版本')
  })

// 版本升级check
export function versionCheck (oldVersion, newVersion) {
  const oldArr = oldVersion.split('-')
  const newArr = newVersion.split('-')
  // 0.11.1 -> 1101
  // 0.9.2 -> 902
  // 1.1.2 -> 10102
  const oldVersionCount = (+oldArr[0]) * 10000 + (+oldArr[1]) * 100 + (+oldArr[2])
  const newVersionCount = (+newArr[0]) * 10000 + (+newArr[1]) * 100 + (+newArr[2])
  // old vs new
  // 0.1.0 vs 0.1.1
  if (newVersionCount > oldVersionCount) {
    return true
  } else if (newVersionCount < oldVersionCount) {
    // 0.1.1 vs 0.1.0
    return false
  } else if (!oldArr[1] && newArr[1]) {
    // 0.2.0 vs 0.2.0-beta-1
    return false
  } else if (!newArr[1] && oldArr[1]) {
    // 0.2.0-beta-1 vs 0.2.0
    return true
  } else {
    // 0.2.0-beta-1 vs 0.2.0-beta-2
    return `${newArr[1]}${newArr[2] ? newArr[2] : ''}` > `${oldArr[1]}${oldArr[2] ? oldArr[2] : ''}`
  }
}

// 检查更新
export function checkUpdate (force = false) {
  if (isLinux && !/\.AppImage&/.test(exePath)) {
    request('https://raw.githubusercontent.com/erguotou520/electron-ssr/master/package.json').then(data => {
      const remotePkg = JSON.parse(data)
      const currentVersion = app.getVersion()
      const isOutdated = versionCheck(currentVersion, remotePkg.version)
      if (isOutdated) {
        showNotification(`最新版本为 v${remotePkg.version}，点击前往下载。`, '通知', () => {
          shell.openExternal('https://github.com/erguotou520/electron-ssr/releases')
        })
      } else if (force) {
        showNotification('当前已是最新版，无需更新')
      }
    })
  } else {
    forceUpdate = force
    autoUpdater.checkForUpdates()
  }
}
