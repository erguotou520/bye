import { BrowserWindow } from 'electron'
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

/**
 * 创建主视图
 */
export function createWindow () {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 900,
    center: true,
    resizable: false
  })
  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  // hide to tray when window closed
  mainWindow.on('close', (e) => {
    // e.preventDefault()
    mainWindow.hide()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * 返回主视图
 */
export function getWindow () {
  return mainWindow
}

/**
 * 显示主视图
 */
export function showWindow () {
  if (mainWindow) {
    mainWindow.show()
  }
}

/**
 * 隐藏主视图
 */
export function hideWindow () {
  if (mainWindow) {
    mainWindow.hide()
  }
}

/**
 * 销毁主视图
 */
export function destroyWindow () {
  if (mainWindow) {
    mainWindow.destroy()
  }
}

/**
 * 想主窗口发送消息
 */
export function sendData (channel, args) {
  if (mainWindow) {
    mainWindow.webContents.once('did-finish-load', () => {
      console.log('send data to renderer', args)
      mainWindow.webContents.send(channel, args)
    })
  } else {
    console.log('not ready')
  }
}
