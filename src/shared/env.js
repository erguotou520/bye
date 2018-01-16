
import os from 'os'

export const platform = os.platform()
export const isWin = platform === 'win32'
export const isMac = platform === 'darwin'
export const isLinux = platform === 'linux'
