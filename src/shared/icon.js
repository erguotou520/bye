import { join } from 'path'
import { nativeImage } from 'electron'

function getImage (name, highlight = false) {
  return nativeImage.createFromPath(join(__static, `${name}${highlight ? 'Highlight' : ''}.png`))
}

export let disabledTray
export let enabledTray
export let pacTray
export let globalTray
export let enabledHighlightTray
export let pacHighlightTray
export let globalHighlightTray

export function init () {
  disabledTray = getImage('disabled', false)
  enabledTray = getImage('enabled')
  pacTray = getImage('pac')
  globalTray = getImage('global')
  enabledHighlightTray = getImage('enabled', true, true)
  pacHighlightTray = getImage('pac', true, true)
  globalHighlightTray = getImage('global', true, true)
}
