import Mousetrap from 'mousetrap'
import { toggleMenu } from './ipc'

const func = {
  toggleMenu
}

export function init (appConfig) {
  Object.keys(appConfig.windowShortcuts).forEach(funcName => {
    if (appConfig.windowShortcuts[funcName].enable) {
      Mousetrap.bind(appConfig.windowShortcuts[funcName].key, func[funcName])
    }
  })
}
