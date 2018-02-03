import { join } from 'path'
import { nativeImage } from 'electron'
import { isWin } from './env'

function getImage (name, template = true, highlight = false) {
  return nativeImage.createFromPath(join(__static, isWin ? `${name}.ico`
    : `${name}${template ? (highlight ? 'Highlight' : 'Template') : ''}.png`))
}

export const notificationIcon = getImage('notification', false)

export const disabledTray = getImage('disabled', false)

export const enabledTray = getImage('enabled')

export const pacTray = getImage('pac')

export const globalTray = getImage('global')

export const enabledHighlightTray = getImage('enabled', true, true)

export const pacHighlightTray = getImage('pac', true, true)

export const globalHighlightTray = getImage('global', true, true)
