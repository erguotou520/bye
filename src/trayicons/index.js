import path from 'path'
import { nativeImage } from 'electron'
import { isMac } from '../shared/env'

const osTrayIcon = isMac ? 'tray_mac.png' : 'tray_win.png'
export default nativeImage.createFromPath(path.join(__dirname, osTrayIcon))
