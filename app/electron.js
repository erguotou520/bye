'use strict'

const { app, BrowserWindow, ipcMain, net, shell } = require('electron')
const AutoLaunch = require('auto-launch')
const { crashReporter } = require('electron')
const path = require('path')
const fsExtra = require('fs-extra')
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

fsExtra.ensureDirSync(appConfigPath)

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

function createWindow () {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 420,
    width: 880,
    resizable: false,
    minimizable: false,
    maximizable: false,
    show: false
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
    // e.preventDefault()
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
  client.stop()
  if (mainWindow) {
    mainWindow.destroy()
  }
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
  storedConfig = storage.getConfig()
  // setup client if inited
  if (storedConfig.pyPath) {
    client.setup(storedConfig.pyPath)
    // if enable then start
    if (storedConfig.enable && storedConfig.configs[storedConfig.selected]) {
      client.run(storedConfig.enable, storedConfig.configs[storedConfig.selected])
    }
  }
  // create main window
  createWindow()
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
    if (!enable) {
      client.stop()
    }
  }).on('change-auto-launch', (isAutoLaunch) => {
    storedConfig.autoLaunch = isAutoLaunch
    storage.saveConfig()
    if (isAutoLaunch) {
      AutoLauncher.enable()
    } else {
      AutoLauncher.disable()
    }
  }).on('qr-scan', () => {
    mainWindow.webContents.send('take-screencapture')
  }).on('change-selected', (index) => {
    storedConfig.selected = index
    storage.saveConfig()
    if (index > -1) {
      client.run(storedConfig.enable, storedConfig.configs[index])
    }
  }).on('exit', quitHandler).on('open', showWindow).on('open-devtool', () => {
    mainWindow.webContents.openDevTools()
  }).on('open-log', () => {
    if (!shell.openItem(storage.getLogPath())) {
      console.error('Error to open log file.')
    }
  })

  // when loaded, init configs
  mainWindow.webContents.once('did-finish-load', () => {
    // has stored configs, then hide
    if (storedConfig.configs.length > 0) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
    // init gui configs
    mainWindow.webContents.send('init-config', storedConfig)
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
    client.stop()
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// ipc channels
ipcMain.on('resize', (e, width, height) => {
  mainWindow.setSize(width, height)
  mainWindow.center()
}).on('set-py-path', (e, path) => {
  e.returnValue = client.setup(path)
}).on('update-config', (e, field, value) => {
  // save config
  storedConfig[field] = value
  if (field === 'configs') {
    if (value.length) {
      if (storedConfig.selected < 0) {
        storedConfig.selected = value.length - 1
      }
      client.run(storedConfig.enable, value[storedConfig.selected])
    } else {
      storedConfig.selected = -1
      storedConfig.enable = false
      client.stop()
    }
  }
  // refresh tray menu list
  tray.refreshConfigs(value, storedConfig.selected)
  storage.saveConfig()
}).on('re-init', e => {
  e.sender.send('init-config', storedConfig)
}).on('scaned-config', (e, newConfig) => {
  storedConfig.configs.push(newConfig)
  storage.saveConfig()
  tray.refreshConfigs(storedConfig.configs, storedConfig.selected)
}).on('open-window', () => {
  mainWindow.show()
}).on('hide-window', () => {
  mainWindow.hide()
})
