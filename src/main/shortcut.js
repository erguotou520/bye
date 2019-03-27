import { app, globalShortcut } from 'electron'
import logger from './logger'
import { switchSystemProxy } from './proxy'
import { toggleWindow, showWindow, sendData } from './window'
import { appConfig$ } from './data'
import { showNotification } from './notification'
import { EVENT_APP_SHOW_PAGE } from '../shared/events'

const func = {
  toggleWindow,
  switchSystemProxy
}

/**
 * 注册快捷键
 * @param {String} name 要注册的快捷键的事件
 * @param {String} key 要注册的快捷键的按键
 */
function registerShortcut (name, key) {
  if (!key) return false
  logger.info(`Register shortcut: ${name}, ${key}`)
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
  if (key) {
    globalShortcut.unregister(key)
    logger.info(`Unregister shortcut: ${key}`)
  }
}

/**
 * 取消所有全局快捷键的注册
 */
export function clearShortcuts () {
  globalShortcut.unregisterAll()
}

/**
 * 变更快捷键绑定
 * @param {Boolean} shortcutEnable 是否启用快捷键
 * @param {String} oldKey 旧的快捷键
 * @param {String} newKey 新的快捷键
 */
function switchRegister (funcName, shortcutEnable, oldKey, newKey) {
  unregisterShortcut(oldKey)
  if (shortcutEnable) {
    registerShortcut(funcName, newKey)
  }
}

app.on('ready', () => {
  // 监听配置
  appConfig$.subscribe(data => {
    const [appConfig, changed, oldConfig] = data
    if (!changed.length) {
      // 注册，并返回注册失败的
      const failed = Object.keys(appConfig.globalShortcuts).filter(funcName => {
        if (appConfig.globalShortcuts[funcName].enable) {
          return !registerShortcut(funcName, appConfig.globalShortcuts[funcName].key)
        }
        return false
      })
      if (failed.length) {
        showNotification(`检测到${failed.length}个全局快捷键注册失败，请在快捷键页面重新设置`, '错误', () => {
          showWindow()
          sendData(EVENT_APP_SHOW_PAGE, { page: 'Options', tab: 'shortcuts' })
        })
      }
    } else {
      if (changed.indexOf('globalShortcuts') > -1) {
        // 配置改变
        Object.keys(appConfig.globalShortcuts).forEach(funcName => {
          const oldShortcut = oldConfig.globalShortcuts[funcName]
          const newShortcut = appConfig.globalShortcuts[funcName]
          // 配置项变更时才更新快捷键
          if (oldShortcut.key !== newShortcut.key || oldShortcut.enable !== newShortcut.enable) {
            switchRegister(funcName, newShortcut.enable, oldShortcut.key, newShortcut.key)
          }
        })
      }
    }
  })
})

