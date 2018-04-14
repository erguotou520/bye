import { app, globalShortcut } from 'electron'
import logger from './logger'
import { showWindow } from './window'
import { appConfig$ } from './data'

const registerShortcut = () => {
  const openWindow = globalShortcut.register('CommandOrControl+Shift+W', showWindow)
  if (!openWindow) {
    if (process.env.NODE_ENV === 'development') {
      console.log('main window shortcut regist failed')
    } else {
      logger.warn('main window shortcut regist failed')
    }
  }
}

const unregisterShortcut = () => {
  globalShortcut.unregister('CommandOrControl+Shift+W')
}

const switchRegister = (shortcutEnable) => {
  if (shortcutEnable) {
    registerShortcut()
  } else {
    unregisterShortcut()
  }
}

app.on('ready', () => {
  // 监听配置
  appConfig$.subscribe(data => {
    const [appConfig, changed, oldConfig] = data
    if (changed.length === 0 && appConfig.shortcutEnable) {
      // 第一次打开
      registerShortcut()
    } else if (changed.length !== 0 && appConfig.shortcutEnable !== oldConfig.shortcutEnable) {
      // 配置改变
      switchRegister(appConfig.shortcutEnable)
    }
  })
})

