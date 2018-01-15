import { Menu, Tray } from 'electron'
import { appConfig$ } from './data'
import * as handler from './tray-handler'
import { startProxy } from './proxy'
import trayIcon from '../trayicons'
import { isMac, isWin, isLinux, groupConfigs } from '../shared/utils'

let tray
let menus

/**
 * 生成服务器子菜单
 * @param {*Array<Object>} configs ssr配置集合
 * @param {*Number} selectedIndex 选中的ssr配置的索引
 */
function generateConfigSubmenus (configs, selectedIndex) {
  const groups = groupConfigs(configs)
  const submenus = Object.keys(groups).map(key => {
    const configs = groups[key]
    return {
      label: `${configs.some(config => config.checked) ? '● ' : ''}${key}`,
      submenu: configs.map(config => {
        return {
          label: `${config.remarks}(${config.server}:${config.server_port})`,
          type: 'checkbox',
          checked: config.checked,
          click (e) {
            // set others to false
            e.menu.items.forEach(submenu => {
              submenu.checked = false
            })
            e.checked = true
            handler.switchConfig(e.menu.items.indexOf(e))
          }
        }
      })
    }
  })
  submenus.push({ label: '订阅管理', click: handler.showSubscribes })
  submenus.push({ label: '编辑服务器', click: handler.showMainWindow })
  return submenus
}

function toggleProxy (e, mode) {
  e.menu.items.forEach(item => { item.checked = false })
  e.checked = true
  startProxy(mode)
}

/**
 * 渲染托盘图标和托盘菜单
 */
export default function renderTray (appConfig) {
  // 生成tray
  tray = new Tray(trayIcon)
  tray.setToolTip('ShadowsocksR客户端')
  menus = [
    { label: '启用系统代理        ', type: 'checkbox', checked: appConfig.enable, click: handler.toggleEnable },
    { label: '系统代理模式', submenu: [
      { label: '不启用代理', type: 'checkbox', checked: appConfig.sysProxyMode === 0, click: e => toggleProxy(e, 0) },
      { label: 'PAC代理', type: 'checkbox', checked: appConfig.sysProxyMode === 1, click: e => toggleProxy(e, 1) },
      { label: '全局代理', type: 'checkbox', checked: appConfig.sysProxyMode === 2, click: e => toggleProxy(e, 2) }
    ] },
    { label: 'PAC', submenu: [
      { label: '更新PAC', click: handler.updatePac }
    ] },
    { label: '服务器', submenu: generateConfigSubmenus(appConfig.configs, appConfig.index) },
    { label: '开机自启', type: 'checkbox', checked: appConfig.autoLaunch, click: handler.toggleAutoLaunch },
    { label: '二维码扫描', click: handler.scanQRCode },
    { label: '配置', submenu: [
      { label: '选项设置...', click: handler.showOptions },
      { label: '导入gui-config.json文件', click: handler.importConfigFromFile },
      { label: '导出gui-confi.gjson文件', click: handler.exportConfigToFile },
      { label: '从粘贴板批量导入ssr://地址', click: handler.importConfigFromClipboard },
      { label: '打开配置文件', click: handler.openConfigFile }
    ] },
    { label: '帮助', submenu: [
      { label: '检查更新', click: handler.checkUpdate },
      { label: '查看日志', click: handler.openLog },
      { label: '项目主页', click: () => { handler.openURL('https://github.com/erguotou520/electron-ssr') } },
      { label: 'Bug反馈', click: () => { handler.openURL('https://github.com/erguotou520/electron-ssr/issues') } },
      { label: '捐赠', click: () => { handler.openURL('https://github.com/erguotou520/donate') } }
    ] },
    { label: '退出', click: handler.exitApp }
  ]
  const contextMenu = Menu.buildFromTemplate(menus)
  tray.setContextMenu(contextMenu)
  tray.on((isMac || isWin) ? 'double-click' : 'click', handler.showMainWindow)
  // try fix linux dismiss bug
  if (isLinux) {
    process.env.XDG_CURRENT_DESKTOP = 'Unity'
  }
}

/**
 * 销毁托盘
 */
export function destroyTray () {
  if (tray) {
    tray.destroy()
  }
}

// 监听数据变更
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  // 初始化数据用于渲染菜单
  if (changed.length === 0) {
    renderTray(appConfig)
  } else if (['configs', 'index'].some(key => changed.indexOf(key) > -1)) {
    // configs或index字段修改时刷新服务器列表
    menus[3].submenu = generateConfigSubmenus(appConfig.configs, appConfig.index)
    tray.setContextMenu(Menu.buildFromTemplate(menus))
  }
})
