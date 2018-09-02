import { isWin } from './env'
import { dialog as _dialog, remote } from 'electron'

const dialog = _dialog || remote.dialog

function choose (title, filters, isFile = true, isSave = false, defaultPath) {
  const path = dialog[isSave ? 'showSaveDialog' : 'showOpenDialog']({
    title,
    defaultPath,
    properties: [isFile ? 'openFile' : 'openDirectory'],
    filters
  })
  if (isSave) {
    if (path) {
      return path
    } else {
      return null
    }
  } else if (path && path.length) {
    let _path = path[0]
    if (isWin) {
      _path = _path.replace(/\\/g, '\\\\')
    }
    return _path
  }
  return null
}

export function chooseFile (title, filters, defaultPath) {
  return choose(title, filters, true, false, defaultPath)
}
export function chooseSavePath (title, filters, defaultPath) {
  return choose(title, filters, true, true, defaultPath)
}
