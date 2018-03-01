import { app, globalShortcut } from 'electron'
import logger from './logger'
import { showWindow } from './window'

app.on('ready', () => {
  // 打开页面
  const openWindow = globalShortcut.register('CommandOrControl+Shift+W', () => {
    showWindow()
  })
  if (!openWindow) {
    if (process.env.NODE_ENV === 'development') {
      console.log('main window shortcut regist failed')
    } else {
      logger.warn('main window shortcut regist failed')
    }
  }
})
