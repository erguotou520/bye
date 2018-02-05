import { Notification } from 'electron'
import { sendData } from './window'
import { EVENT_APP_NOTIFY_NOTIFICATION } from '../shared/events'

const isDesktopNotificationSupported = Notification.isSupported()

export function showNotification (body, title = '通知', onClick) {
  if (isDesktopNotificationSupported) {
    const notification = new Notification({
      title, body, silent: false
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
