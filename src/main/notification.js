import { Notification } from 'electron'
import { sendData } from './window'
import { EVENT_APP_NOTIFY_MAIN } from '../shared/events'
import { isWin } from '../shared/env'
import { notificationIcon } from '../shared/icon'

const isDesktopNotificationSupported = Notification.isSupported()

export function showNotification (body, title = '通知', onClick) {
  if (isDesktopNotificationSupported) {
    const notification = new Notification({
      title, body, silent: false, icon: isWin ? notificationIcon : undefined
    })
    if (onClick) {
      notification.once('click', onClick)
    }
    notification.show()
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.log('不支持原生通知，将使用HTML5通知')
    }
    sendData(EVENT_APP_NOTIFY_MAIN, { title, body })
  }
}
