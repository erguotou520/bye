const { Menu, Tray, nativeImage } = require('electron')
const EventEmitter = require('events').EventEmitter
const path = require('path')
const os = require('os')

let tray = null
let menu = null
const event = new EventEmitter()
const osTrayIcon = os.platform() === 'darwin' ? 'tray_mac.png' : 'tray_win.png'
let image = nativeImage.createFromPath(path.join(__dirname, './src/assets/images/' + osTrayIcon))

function power (e) {
  // e.checked = !e.checked
}

module.exports = {
  trayMenu: menu,
  setup () {
    tray = new Tray(image)
    tray.setToolTip('ShadowsocksR client')
    menu = [
      { label: '启用系统代理', type: 'checkbox', checked: false, click: power },
      { label: '服务器', submenu: [] },
      { label: '开机自启', type: 'checkbox', checked: false },
      { label: '退出', click: () => { event.emit('exit') } }
    ]
    tray.setContextMenu(Menu.buildFromTemplate(menu))
    tray.on('click', () => {
      event.emit('click')
    })
    return event
  },
  refreshConfigs (configs) {
    menu[1].submenu = configs.map(config => {
      return {
        label: `${config.remark}(${config.host}:${config.port})`,
        type: 'radio',
        checked: false,
        click (e) {
          // event.emit()
        }
      }
    })
    tray.setContextMenu(Menu.buildFromTemplate(menu))
  }
}
