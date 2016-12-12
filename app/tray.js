const { Menu, Tray, nativeImage } = require('electron')
const EventEmitter = require('events').EventEmitter
const path = require('path')
const { getConfigs } = require('./src/storage')

let tray = null
let menu = null
const event = new EventEmitter()
let image = nativeImage.createFromPath(path.join(__dirname, './src/assets/images/tray.png'))

function power (e) {
  e.checked = !e.checked
}

module.exports = {
  trayMenu: menu,
  setup () {
    tray = new Tray(image)
    tray.setToolTip('ShadowsocksR client')
    menu = Menu.buildFromTemplate([
      { label: '启用系统代理', type: 'checkbox', checked: false, click: power },
      { label: '服务器', submenu: [] },
      { label: '开机自启', type: 'checkbox', checked: false },
      { label: '退出', click: () => { event.emit('exit') } }
    ])
    this.refreshConfig()
    tray.setContextMenu(menu)
    tray.on('click', event.emit('click'))
    return event
  },
  refreshConfig (config) {
    const configs = getConfigs()
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
  }
}
