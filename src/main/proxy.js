/**
 * 自动设置系统代理
 * linux目前仅支持gnome桌面的系统
 */
import { execSync } from 'child_process'
import { winToolPath, macToolPath } from './bootstrap'
import { currentConfig, appConfig$ } from './data'
import { isWin, isMac, isLinux, isOldMacVersion } from '../shared/env'

// mac 获取network_service的shell脚本
// const macServiceShellPath = path.resolve(__dirname, '../lib/mac_service.sh')

/**
 * 运行命令
 * @param {String} command 待运行的命令
 */
function runCommand (command) {
  if (command) {
    execSync(command)
  }
}

/**
 * 设置代理为空
 */
export function setProxyToNone () {
  let command
  if (isWin) {
    command = `${winToolPath} pac ""`
  } else if (isMac && !isOldMacVersion) {
    command = `"${macToolPath}" -m off`
  } else if (isLinux) {
    command = `gsettings set org.gnome.system.proxy mode 'none'`
  }
  runCommand(command)
}

/**
 * 设置代理为全局
 */
export function setProxyToGlobal (host, port) {
  let command
  if (isWin) {
    command = `${winToolPath} global ${host}:${port}`
  } else if (isMac && !isOldMacVersion) {
    command = `"${macToolPath}" -m global -p ${port}`
  } else if (isLinux) {
    command = `gsettings set org.gnome.system.proxy mode 'manual' && gsettings set org.gnome.system.proxy.socks host '${host}' && gsettings set org.gnome.system.proxy.socks port ${port}`
  }
  runCommand(command)
}

/**
 * 设置代理为全局
 */
export function setProxyToPac (pacUrl) {
  let command
  if (isWin) {
    command = `${winToolPath} pac ${pacUrl}`
  } else if (isMac && !isOldMacVersion) {
    command = `"${macToolPath}" -m auto -u ${pacUrl}`
  } else if (isLinux) {
    command = `gsettings set org.gnome.system.proxy mode 'auto' && gsettings set org.gnome.system.proxy autoconfig-url ${pacUrl}`
  }
  runCommand(command)
}

// 启用代理
export function startProxy (mode) {
  if (mode === undefined) {
    mode = currentConfig.sysProxyMode
  }
  if (mode === 0) {
    setProxyToNone()
  } else if (mode === 1) {
    setProxyToPac(`http://127.0.0.1:${currentConfig.pacPort}/proxy.pac`)
  } else if (mode === 2) {
    setProxyToGlobal('127.0.0.1', currentConfig.localPort)
  }
}

// 监听配置变化
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  if (appConfig.sysProxyMode === 1 && (changed.length === 0 || changed.indexOf('pacPort') > -1)) {
    // 初始化或者pacPort变更时
    setProxyToPac(`http://127.0.0.1:${appConfig.pacPort}/proxy.pac`)
  } else if (appConfig.sysProxyMode === 2 && (changed.length === 0 || changed.indexOf('localPort') > -1)) {
    // 初始化或者localPort变更时
    setProxyToGlobal('127.0.0.1', currentConfig.localPort)
  }
})
