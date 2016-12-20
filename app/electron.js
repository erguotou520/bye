'use strict'

const { app, BrowserWindow, ipcMain, net } = require('electron')
const AutoLaunch = require('auto-launch')
const { crashReporter } = require('electron')
const path = require('path')
const tray = require('./tray.js')
const client = require('./client.js')
const storage = require('./storage.js')

const AutoLauncher = new AutoLaunch({
    name: 'ShadowsocksR Client',
    isHidden: true,
    mac: {
      useLaunchAgent: true
    }
})

let mainWindow
let config = {}
let trayEvent
let appIcon = null
let storedConfig
let appConfigPath = app.getPath('userData')

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

function createWindow (configsLength) {
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

  // hide to tray when window closed
  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  console.log('mainWindow opened')
}

function showWindow() {
  mainWindow.show()
}

function quitHandler() {
  console.log('quit')
  client.kill()
  mainWindow.destroy()
  tray.destroy()
  app.quit()
}

function execHandler (args) {
  mainWindow.webContents.send('exec-error', args)
}

app.on('ready', () => {
  // crash report
  crashReporter.start({
    productName: 'ShadowsocksR Client',
    companyName: 'erguotou520',
    submitURL: 'https://ssr-crash-server.herokuapp.com/',
    autoSubmit: true
  })
  // init storage
  storage.setup(appConfigPath)
  // get configs
  storedConfig = storage.getConfigs()
  // create main window
  createWindow(storedConfig.configs.length)
  // init tray
  trayEvent = tray.setup(storedConfig)
  // tray event
  trayEvent.on('change-enable', (enable) => {
    storedConfig.enable = enable
    storage.saveConfig()
    const selectedConfigIndex = tray.getMenuConfig().selected
    if (selectedConfigIndex > -1) {
      // exec python command
      client.run(enable, storedConfig.configs[selectedConfigIndex])
    }
  }).on('change-auto-launch', (isAutoLaunch) => {
    storedConfig.autoLaunch = isAutoLaunch
    storage.saveConfig()
    if (isAutoLaunch) {
      AutoLauncher.enable()
    } else {
      AutoLauncher.disable()
    }
  }).on('change-selected', (index) => {
    storedConfig.selected = index
    storage.saveConfig()
    if (index > -1) {
      client.run(storedConfig.enable, storedConfig.configs[index])
    }
  }).on('exit', quitHandler).on('click', showWindow)

  // when loaded, init configs
  mainWindow.webContents.once('did-finish-load', () => {
    // has stored configs, then hide
    if (storedConfig.configs.length > 0) {
      mainWindow.hide()
    }
    // download ShadowsocksR python sources
    client.setup(appConfigPath, storedConfig, execHandler)
    // init gui configs
    mainWindow.webContents.send('init-configs', storedConfig.configs)
    // version check
    net.request('https://raw.githubusercontent.com/erguotou520/electron-ssr/master/app/package.json').on('response', (response) => {
      response.on('data', (chunk) => {
        const remotePkg = JSON.parse(chunk.toString())
        const currentVersion = require('./package.json').version
        if (remotePkg.version > currentVersion) {
          mainWindow.webContents.send('new-version', currentVersion, remotePkg.version)
        }
      })
    }).end()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    client.kill()
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
  if (configs.length && storedConfig.selected < 0) {
    storedConfig.selected = configs.length - 1
    client.run(storedConfig.enable, configs[configs.length - 1])
  }
  // save configs
  storedConfig.configs = configs
  storage.saveConfig()
  tray.refreshConfigs(configs, storedConfig.selected)
})
