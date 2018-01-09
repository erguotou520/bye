import path from 'path'
import os from 'os'
import { Menu, Tray, nativeImage } from 'electron'
import { appConfig$ } from './data'
import * as handler from './tray-handler'

let tray
let menus

/**
 * 生成服务器子菜单
 * @param {*Array<Object>} configs ssr配置集合
 * @param {*Number} selectedIndex 选中的ssr配置的索引
 */
function generateConfigSubmenus (configs, selectedIndex) {
  const submenus = configs.map((config, index) => {
    return {
      label: `${config.remark}(${config.host}:${config.port})`,
      type: 'checkbox',
      checked: index === selectedIndex,
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
  submenus.push({
    label: '编辑服务器',
    click: handler.showMainWindow()
  })
  return submenus
}

/**
 * 渲染托盘图标和托盘菜单
 */
export default function renderTray (appConfig) {
  // 选择任务栏图标
  const osTrayIcon = os.platform() === 'darwin' ? 'tray_mac.png' : 'tray_win.png'
  const image = nativeImage.createFromPath(path.join(__dirname, './trayicons/' + osTrayIcon))
  // 生成tray
  tray = new Tray(image)
  tray.setToolTip('ShadowsocksR客户端')
  menus = [
    { label: '启用系统代理', type: 'checkbox', checked: appConfig.enable, click: handler.toggleEnable },
    { label: '服务器', submenu: generateConfigSubmenus(appConfig.configs, appConfig.index) },
    { label: '开机自启', type: 'checkbox', checked: appConfig.autoLaunch, click: handler.toggleAutoLaunch },
    { label: '二维码扫描', click: handler.scanQRCode },
    { label: '配置', submenu: [
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
    menus[1].submenu = generateConfigSubmenus(appConfig.configs, appConfig.index)
    tray.setContextMenu(Menu.buildFromTemplate(menus))
  }
})
