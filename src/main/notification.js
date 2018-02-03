import { Notification } from 'electron'
import { sendData } from './window'
import { supportDesktopNotification } from '../shared/env'
import { notificationIcon } from '../shared/icon'
import { EVENT_APP_NOTIFY_NOTIFICATION } from '../shared/events'

let notificationArr = []
let timeout

export function showNotification (body, title = '通知', onClick) {
  if (supportDesktopNotification) {
    const notification = new Notification({
      title, body, silent: false, icon: notificationIcon
    })
    if (onClick) {
      notification.once('click', onClick)
    }
    notification.show()
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.log('不支持原生通知，将使用HTML5通知')
    }
    sendData(EVENT_APP_NOTIFY_NOTIFICATION, { title, body })
  }
}

export function showNotificationInOne (body) {
  notificationArr.push(body)
  if (!timeout) {
    timeout = setTimeout(() => {
      showNotification(notificationArr.join('\n'))
      clearTimeout(timeout)
      notificationArr = []
    }, 1000)
  }
}
