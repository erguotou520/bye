'use strict'

const { app, BrowserWindow, nativeImage } = require('electron')
const path = require('path')
const tray = require('./tray')

let mainWindow
let config = {}
let trayEvent
let appIcon = null

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 420,
    width: 800,
    resizable: false,
    minimizable: false,
    maximizable: false
  })

  mainWindow.setMenu(null)

  mainWindow.loadURL(config.url)

  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    let installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => mainWindow.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  console.log('mainWindow opened')
}

function showWindow() {
  mainWindow.show()
}

function closeHandle() {
  mainWindow.destroy()
  tray.destroy()
  app.quit()
}

app.on('ready', () => {
  createWindow()
  trayEvent = tray.setup()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
