/**
 * 自动设置系统代理
 * linux目前仅支持gnome桌面的系统
 */
import { execSync } from 'child_process'
import { pathExistsSync } from 'fs-extra'
import { winToolPath, macToolPath } from './bootstrap'
import { currentConfig, appConfig$, updateAppConfig } from './data'
import logger from './logger'
import { isWin, isMac, isLinux, isOldMacVersion } from '../shared/env'

// linux的gsettings命令是否可用
let isGsettingsAvaliable = false
try {
  isGsettingsAvaliable = /gsettings$/.test(execSync('which gsettings').toString().trim())
} catch (e) {}
let isProxyChanged = false

/**
 * 运行命令
 * @param {String} command 待运行的命令
 */
function runCommand (command) {
  if (command) {
    isProxyChanged = true
    try {
      execSync(command)
    } catch (error) {
      logger.error(error)
    }
  }
}

/**
 * 设置代理为空, force表示强制设置，否则根据isProxyChanged字段判断是否需要设置为空
 */
export function setProxyToNone (force = true) {
  if (force || isProxyChanged) {
    let command
    if (isWin && pathExistsSync(winToolPath)) {
      command = `${winToolPath} pac ""`
    } else if (isMac && pathExistsSync(macToolPath) && !isOldMacVersion) {
      command = `"${macToolPath}" -m off`
    } else if (isLinux && isGsettingsAvaliable) {
      command = `gsettings set org.gnome.system.proxy mode 'none'`
    }
    runCommand(command)
  }
}

/**
 * 设置代理为全局
 */
export function setProxyToGlobal (host, port) {
  let command
  if (isWin && pathExistsSync(winToolPath)) {
    command = `${winToolPath} global ${host}:${port}`
  } else if (isMac && pathExistsSync(macToolPath) && !isOldMacVersion) {
    command = `"${macToolPath}" -m global -p ${port}`
  } else if (isLinux && isGsettingsAvaliable) {
    command = `gsettings set org.gnome.system.proxy mode 'manual' && gsettings set org.gnome.system.proxy.socks host '${host}' && gsettings set org.gnome.system.proxy.socks port ${port}`
  }
  runCommand(command)
}

/**
 * 设置代理为PAC代理
 */
export function setProxyToPac (pacUrl) {
  let command
  if (isWin && pathExistsSync(winToolPath)) {
    command = `${winToolPath} pac ${pacUrl}`
  } else if (isMac && pathExistsSync(macToolPath) && !isOldMacVersion) {
    command = `"${macToolPath}" -m auto -u ${pacUrl}`
  } else if (isLinux && isGsettingsAvaliable) {
    command = `gsettings set org.gnome.system.proxy mode 'auto' && gsettings set org.gnome.system.proxy autoconfig-url ${pacUrl}`
  }
  runCommand(command)
}

function setProxyByMode (mode) {
  if (mode === 0) {
    setProxyToNone()
  } else if (mode === 1) {
    setProxyToPac(`http://127.0.0.1:${currentConfig.pacPort}/proxy.pac`)
  } else if (mode === 2) {
    setProxyToGlobal('127.0.0.1', currentConfig.localPort)
  }
}

/**
 * 切换系统代理
 */
export function switchSystemProxy () {
  const nextMode = (currentConfig.sysProxyMode + 1) % 3
  updateAppConfig({ sysProxyMode: nextMode })
  setProxyByMode(nextMode)
}

// 启用代理
export function startProxy (mode) {
  if (mode === undefined) {
    mode = currentConfig.sysProxyMode
  }
  setProxyByMode(mode)
}

// 监听配置变化
appConfig$.subscribe(data => {
  const [appConfig, changed, , isProxyStarted] = data
  // 必须得有节点选中
  if (isProxyStarted) {
    if (!changed.length) {
      startProxy(appConfig.sysProxyMode)
    } else {
      if (appConfig.sysProxyMode === 1 && changed.indexOf('pacPort') > -1) {
        // pacPort变更时
        startProxy(1)
      } else if (appConfig.sysProxyMode === 2 && changed.indexOf('localPort') > -1) {
        // localPort变更时
        startProxy(2)
      }
    }
  } else if (changed.length) {
    setProxyToNone()
  }
})
