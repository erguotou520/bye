import { app } from 'electron'
import AutoLaunch from 'auto-launch'
import './bootstrap'
import { appConfig$ } from './data'
import './tray'
import './ipc'
// import { stop as stopCommand } from './client'
import { createWindow, getWindow } from './window'
import logger from './logger'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  logger.debug('Event:window-all-closed')
  if (process.platform !== 'darwin') {
    // stopCommand()
    app.quit()
  }
})

app.on('activate', () => {
  if (getWindow() === null) {
    createWindow()
  }
})

// 开机自启动配置
const AutoLauncher = new AutoLaunch({
  name: 'ShadowsocksR Client',
  isHidden: true,
  mac: {
    useLaunchAgent: true
  }
})

appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  if (!changed.length || (changed.length && changed.indexOf('autoLaunch') > -1)) {
    // 初始化或者选项变更时
    console.log('auto launch: ', appConfig.autoLaunch)
    if (appConfig.autoLaunch) {
      AutoLauncher.enable()
    } else {
      AutoLauncher.disable()
    }
  }
})
