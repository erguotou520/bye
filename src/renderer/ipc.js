import {
  EVENT_APP_UPDATE_VERSION,
  EVENT_APP_ERROR_MAIN,
  EVENT_RX_SYNC_MAIN
} from '@/shared/events'

/**
 * ipc-render事件
 */
export default (ipcRender) => {
  ipcRender.on(EVENT_APP_UPDATE_VERSION, () => {

  }).on(EVENT_APP_ERROR_MAIN, () => {

  }).on(EVENT_RX_SYNC_MAIN, () => {

  })
}
