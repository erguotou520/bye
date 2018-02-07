import { ipcRenderer } from 'electron'
import { EVENT_APP_NOTIFY_RENDERER } from '../shared/events'

/**
 * 显示HTML5通知
 * @param {String} body 要显示的内容
 * @param {String} title 标题
 */
export function showHtmlNotification (body, title = '通知') {
  console.log('using html5 notification')
  new Notification(title, {
    body: body
  })
}

/**
 * 显示原生通知，降级使用HTML5
 * @param {String} body 要显示的内容
 * @param {String} title 标题
 */
export function showNotification (body, title = '通知') {
  ipcRenderer.send(EVENT_APP_NOTIFY_RENDERER, body, title)
}
