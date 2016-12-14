'use strict'

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const tray = require('./tray')
const storage = require('./storage')

let mainWindow
let config = {}
let trayEvent
let appIcon = null
let storedConfigs

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
  // init storage
  storage.setup(app.getAppPath())
  // init tray
  trayEvent = tray.setup()
  // get configs
  storedConfigs = storage.getConfigs()
  // when loaded, init configs
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('init-configs', storedConfigs.configs)
  })
  // refresh tray hosts
  tray.refreshConfigs(storedConfigs.configs)
})

app.on('close', (e) => {
  mainWindow.hide()
  e.preventDefault()
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

// ipc channels
ipcMain.on('update-configs', (e, configs) => {
  // save configs
  storage.saveConfigs(configs)
  tray.refreshConfigs(configs)
})
