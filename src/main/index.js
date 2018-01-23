import { app } from 'electron'
import AutoLaunch from 'auto-launch'
import './bootstrap'
import { isQuiting, appConfig$, addConfigs } from './data'
import renderTray, { destroyTray } from './tray'
import './ipc'
import { stopPacServer } from './pac'
import { stop as stopCommand } from './client'
import { createWindow, showWindow, getWindow, destroyWindow } from './window'
import logger from './logger'
import { loadConfigsFromString } from '../shared/ssr'
import { isMac, isWin } from '../shared/env'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const isSecondInstance = app.makeSingleInstance((argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  const _window = getWindow()
  if (_window) {
    if (_window.isMinimized()) {
      _window.restore()
    }
    _window.focus()
  }
  // 如果是通过链接打开的应用，则添加记录
  if (argv[1]) {
    const configs = loadConfigsFromString(argv[1])
    if (configs.length) {
      addConfigs(configs)
    }
  }
})

if (isSecondInstance) {
  app.quit()
}

app.on('ready', () => {
  createWindow()
  if (isWin || isMac) {
    app.setAsDefaultProtocolClient('ssr')
    app.setAsDefaultProtocolClient('ss')
  }
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
      if (!appConfig.configs.length || !appConfig.ssrPath) {
        showWindow()
      }
      renderTray(appConfig)
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

if (process.env.NODE_ENV !== 'development') {
  var Raven = require('raven')
  Raven.config('https://35792a16213c4c6b89710f3e3dfa7806@sentry.io/258151', {
    captureUnhandledRejections: true
  }).install()
}
