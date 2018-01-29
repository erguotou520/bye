import { app, Menu } from 'electron'
import { isMac } from '../shared/env'

/**
 * 渲染菜单
 */
export default function renderMenu () {
  // mac需要加上默认的一些菜单，否则没法复制粘贴
  if (isMac) {
    const template = [{
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' }
      ] }, {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    }]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  }
}
