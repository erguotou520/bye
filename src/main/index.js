import { app } from 'electron'
import './bootstrap'
import './data'
import './tray'
// import { stop as stopCommand } from './ssr'
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

