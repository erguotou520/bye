const { Menu, Tray, nativeImage } = require('electron')
const EventEmitter = require('events').EventEmitter
const path = require('path')
const os = require('os')

let tray = null
let menus = null
const event = new EventEmitter()
const osTrayIcon = os.platform() === 'darwin' ? 'tray_mac.png' : 'tray_win.png'
let image = nativeImage.createFromPath(path.join(__dirname, './trayicons/' + osTrayIcon))

function toggleEnable (e) {
  event.emit('change-enable', e.checked)
}

function toggleAutoLaunch (e) {
  event.emit('change-auto-launch', e.checked)
}

// generate submenu of configs
function generateConfigSubmenus (configs, selectedIndex) {
  const submenus = configs.map((config, index) => {
    return {
      label: `${config.remark}(${config.host}:${config.port})`,
      type: 'checkbox',
      checked: index === selectedIndex,
      click (e) {
        // if checked, return, do nothing
        if (e.checked) return
        e.menu.items.forEach(submenu => {
          submenu.checked = false
        })
        e.checked = true
        event.emit('change-selected', e.menu.items.indexOf(e))
      }
    }
  })
  submenus.push({
    label: '编辑服务器',
    click () {
      event.emit('open')
    }
  })
  return submenus
}

module.exports = {
  // init
  setup (config) {
    tray = new Tray(image)
    tray.setToolTip('ShadowsocksR client')
    menus = [
      { label: '启用系统代理', type: 'checkbox', checked: config.enable, click: toggleEnable },
      { label: '服务器', submenu: generateConfigSubmenus(config.configs, config.selected) },
      { label: '开机自启', type: 'checkbox', checked: config.autoLaunch, click: toggleAutoLaunch },
      { label: '查看日志', click: () => { event.emit('open-log') } },
      { label: '打开控制台', click: () => { event.emit('open-devtool') } },
      { label: '退出', click: () => { event.emit('exit') } }
    ]
    tray.setContextMenu(Menu.buildFromTemplate(menus))
    tray.on('open', () => {
      event.emit('open')
    })
    return event
  },
  // refresh the configs submenu
  refreshConfigs (configs, selectedIndex) {
    menus[1].submenu = generateConfigSubmenus(configs, selectedIndex)
    tray.setContextMenu(Menu.buildFromTemplate(menus))
  },
  // get menu config
  getMenuConfig () {
    const selected = menus[1].submenu.filter(config => config.checked)
    return {
      enable: menus[0].checked,
      autoLaunch: menus[2].checked,
      selected: selected.length ? menus[1].submenu.indexOf(selected[0]) : -1
    }
  },
  destroy () {
    tray.destroy()
  }
}
