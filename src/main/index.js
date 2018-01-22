import { app } from 'electron'
import AutoLaunch from 'auto-launch'
import './bootstrap'
import { isQuiting, appConfig$ } from './data'
import { destroyTray } from './tray'
import './ipc'
import { stopPacServer } from './pac'
import { stop as stopCommand } from './client'
import { createWindow, showWindow, getWindow, destroyWindow } from './window'
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
  const ssrSchemaRegisted = app.setAsDefaultProtocolClient('ssr')
  const ssSchemaRegisted = app.setAsDefaultProtocolClient('ss')
  if (process.env.NODE_ENV === 'development') {
    console.log(`ssrSchemaRegisted`, ssrSchemaRegisted, `ssSchemaRegisted`, ssSchemaRegisted)
  } else {
    logger.debug(`ssrSchemaRegisted: ${ssrSchemaRegisted} ssSchemaRegisted: ${ssSchemaRegisted}`)
  }
})

app.on('window-all-closed', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('window-all-closed')
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 由main进程发起的退出
app.on('before-quit', () => { isQuiting(true) })

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
  if (!changed.length) {
    // 初始化时没有配置则打开页面，有配置则不显示主页面
    if (!appConfig.configs.length) {
      showWindow()
    }
  }
  if (!changed.length || changed.indexOf('autoLaunch') > -1) {
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

if (process.env.NODE_ENV !== 'development') {
  var Raven = require('raven')
  Raven.config('https://35792a16213c4c6b89710f3e3dfa7806@sentry.io/258151', {
    captureUnhandledRejections: true
  }).install()
}
