
import os from 'os'
import { Notification } from 'electron'
import { execSync } from 'child_process'

export const platform = os.platform()

export const isWin = platform === 'win32'
export const isMac = platform === 'darwin'
export const isLinux = platform === 'linux'

// 是否支持桌面通知
export const supportDesktopNotification = Notification.isSupported()

// mac版本号
export let macVersion
// mac版本是否低于10.11
export let isOldMacVersion = false
if (isMac) {
  try {
    const result = execSync('sw_vers').toString()
    macVersion = result.match(/ProductVersion:[ \t]*([\d.]*)/)[1]
    const matchedVersion = [10, 11, 0]
    const splited = macVersion.split('.')
    for (let i = 0; i < splited.length; i++) {
      if (splited[i] > matchedVersion[i]) {
        isOldMacVersion = false
        break
      } else if (splited[i] < matchedVersion[i]) {
        isOldMacVersion = true
        break
      } else if (i === 2 && splited[i] === matchedVersion[i]) {
        isOldMacVersion = true
      }
    }
  } catch (error) {
    // do nothing
  }
}
