import { join } from 'path'
import { nativeImage } from 'electron'
import { isMac } from './env'

function getImage (name, template = true, highlight = false) {
  return nativeImage.createFromPath(join(__static, `${name}${(isMac && template) ? (highlight ? 'Highlight' : 'Template') : ''}.png`))
}

export let notificationIcon
export let disabledTray
export let enabledTray
export let pacTray
export let globalTray
export let enabledHighlightTray
export let pacHighlightTray
export let globalHighlightTray

export function init () {
  notificationIcon = getImage('notification', false, false)
  disabledTray = getImage('disabled', false)
  enabledTray = getImage('enabled')
  pacTray = getImage('pac')
  globalTray = getImage('global')
  enabledHighlightTray = getImage('enabled', true, true)
  pacHighlightTray = getImage('pac', true, true)
  globalHighlightTray = getImage('global', true, true)
}
