import path from 'path'
import os from 'os'
import { nativeImage } from 'electron'

const osTrayIcon = os.platform() === 'darwin' ? 'tray_mac.png' : 'tray_win.png'
export default nativeImage.createFromPath(path.join(__dirname, osTrayIcon))
