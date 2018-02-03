import { remote } from 'electron'
import { join } from 'path'
import { supportDesktopNotification } from '../shared/env'
import { notificationIcon } from '../shared/icon'
import { isWin } from '../shared/env'

const HtmlNotification = window.Notification
const { Notification } = remote.require('electron')

/**
 * 显示HTML5通知
 * @param {String} body 要显示的内容
 * @param {String} title 标题
 */
export function showHtmlNotification (body, title = '通知') {
  new HtmlNotification(title, {
    icon: join(__static, isWin ? 'notification.ico' : 'notification.png'),
    body: body
  })
}

/**
 * 显示原生通知，降级使用HTML5
 * @param {String} body 要显示的内容
 * @param {String} title 标题
 */
export function showNotification (body, title = '通知') {
  if (supportDesktopNotification) {
    new Notification({
      title, body, silent: false, icon: notificationIcon
    }).show()
  } else {
    showHtmlNotification(body, title)
  }
}
