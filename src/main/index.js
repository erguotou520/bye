import { app } from 'electron'
import AutoLaunch from 'auto-launch'
import './bootstrap'
import { appConfig$ } from './data'
import { destroyTray } from './tray'
import './ipc'
import { stopPacServer } from './pac'
import { stop as stopCommand } from './client'
import { createWindow, getWindow, destroyWindow } from './window'
import logger from './logger'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

app.on('ready', () => {
  createWindow()
  // pac服务
  // serverPac()
})

app.on('window-all-closed', () => {
  // logger.debug('Event:window-all-closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  console.log('will-quit')
  stopCommand()
  destroyWindow()
  destroyTray()
  stopPacServer()
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
    AutoLauncher.isEnabled().then(enabled => {
      // 状态不相同时
      if (appConfig.autoLaunch !== enabled) {
        return AutoLauncher[appConfig.autoLaunch ? 'enable' : 'disable']().catch(() => {
          logger.error(`${appConfig.autoLaunch ? '执行' : '取消'}开机自启动失败`)
        })
      }
    }).catch(() => {
      logger.error('获取开机自启状态失败')
    })
  }
})

// 未捕获的rejections
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
