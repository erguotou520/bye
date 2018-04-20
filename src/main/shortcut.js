import { app, globalShortcut } from 'electron'
import logger from './logger'
import { showWindow } from './window'
import { appConfig$ } from './data'
import { toggleMenu } from './menu'

const func = {
  toggleWindow: showWindow,
  toggleMenu: toggleMenu
}

const registerShortcut = (name, key) => {
  const openWindow = globalShortcut.register(key, func[name])
  if (!openWindow) {
    if (process.env.NODE_ENV === 'development') {
      console.log('main window shortcut regist failed')
    } else {
      logger.warn('main window shortcut regist failed')
    }
  }
}

const unregisterShortcut = (key) => {
  globalShortcut.unregister(key)
}

const switchRegister = (shortcutEnable, oldKey, newKey) => {
  unregisterShortcut(oldKey)
  if (shortcutEnable) {
    registerShortcut(newKey)
  }
}

app.on('ready', () => {
  // 监听配置
  appConfig$.subscribe(data => {
    const [appConfig, changed, oldConfig] = data
    if (changed.length === 0) {
      // 第一次打开
      for (const shortcutName in appConfig.shortcut) {
        // 这个快捷键是不是打开了
        if (appConfig.shortcut[shortcutName].enable) {
          registerShortcut(shortcutName, appConfig.shortcut[shortcutName].key)
        }
      }
    } else if (changed.length !== 0 && appConfig.shortcutEnable !== oldConfig.shortcutEnable) {
      // 配置改变
      switchRegister(appConfig.shortcutEnable, oldConfig.shortcut, appConfig.shortcut)
    } else if (changed.length !== 0 && appConfig.shortcut !== oldConfig.shortcut) {
      switchRegister(appConfig.shortcutEnable, oldConfig.shortcut, appConfig.shortcut)
    }
  })
})

