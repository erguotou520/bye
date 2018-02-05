import { join } from 'path'
import { nativeImage } from 'electron'
import { isMac } from './env'

function getImage (name, highlight = false) {
  return nativeImage.createFromPath(join(__static, `${name}${isMac ? (highlight ? 'Highlight' : 'Template') : ''}.png`))
}

export let disabledTray
export let enabledTray
export let pacTray
export let globalTray
export let enabledHighlightTray
export let pacHighlightTray
export let globalHighlightTray

export function init () {
  disabledTray = getImage('disabled')
  enabledTray = getImage('enabled')
  pacTray = getImage('pac')
  globalTray = getImage('global')
  enabledHighlightTray = getImage('enabled', true)
  pacHighlightTray = getImage('pac', true)
  globalHighlightTray = getImage('global', true)
}
