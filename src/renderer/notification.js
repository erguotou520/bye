import { remote } from 'electron'
import { notificationIcon } from '../shared/icon'

const HtmlNotification = window.Notification
const { Notification } = remote.require('electron')
const isDesktopNotificationSupported = Notification.isSupported()

/**
 * 显示HTML5通知
 * @param {String} body 要显示的内容
 * @param {String} title 标题
 */
export function showHtmlNotification (body, title = '通知') {
  new HtmlNotification(title, {
    body: body
  })
}

/**
 * 显示原生通知，降级使用HTML5
 * @param {String} body 要显示的内容
 * @param {String} title 标题
 */
export function showNotification (body, title = '通知') {
  if (isDesktopNotificationSupported) {
    new Notification({
      title, body, silent: false, icon: notificationIcon
    }).show()
  } else {
    showHtmlNotification(body, title)
  }
}
