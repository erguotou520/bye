import { app, globalShortcut } from 'electron'
import logger from './logger'
import { toggleWindow, showWindow, sendData } from './window'
import { appConfig$ } from './data'
import { showNotification } from './notification'
import events from '../shared/events'

const func = {
  toggleWindow
}

/**
 * 注册快捷键
 * @param {String} name 要注册的快捷键的事件
 * @param {String} key 要注册的快捷键的按键
 */
function registerShortcut (name, key) {
  if (process.env.NODE_ENV === 'development') {
    console.info(`Register shortcut: ${name}, ${key}`)
  } else {
    logger.info(`Register shortcut: ${name}, ${key}`)
  }
  const ret = globalShortcut.register(key, func[name])
  if (!ret) {
    return false
  }
  return globalShortcut.isRegistered(key)
}

/**
 * 取消注册快捷键
 * @param {String} key 要取消注册的快捷键的按键
 */
function unregisterShortcut (key) {
  globalShortcut.unregister(key)
}

/**
 * 取消所有全局快捷键的注册
 */
export function clearShortcuts () {
  globalShortcut.unregisterAll()
}

function switchRegister (shortcutEnable, oldKey, newKey) {
  unregisterShortcut(oldKey)
  if (shortcutEnable) {
    registerShortcut(newKey)
  }
}

app.on('ready', () => {
  // 监听配置
  appConfig$.subscribe(data => {
    const [appConfig, changed, oldConfig] = data
    if (changed.length) {

    } else {
      // 注册，并返回注册失败的
      const failed = Object.keys(appConfig.globalShortcuts).filter(funcName => {
        if (appConfig.globalShortcuts[funcName].enable) {
          return registerShortcut(funcName, appConfig.globalShortcuts[funcName].key)
        }
        return true
      })
      if (failed.length) {
        showNotification(`检测到${failed.length}个全局快捷键注册失败，请在快捷键页面重新设置`, '错误', () => {
          showWindow()
          sendData(events.EVENT_APP_SHOW_PAGE, { page: 'Options', tab: 'shortcuts' })
        })
      }
    }
    if (changed.length === 0) {
      // 第一次打开
      for (const shortcutName in appConfig.globalShortcuts) {
        // 这个快捷键是不是启用了
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

