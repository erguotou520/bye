/**
 * 自动设置系统代理
 * linux目前仅支持gnome桌面的系统
 */
import { app } from 'electron'
import path from 'path'
import { existsSync } from 'fs'
import { execSync } from 'child_process'
// import Sudoer from 'electron-sudo'
// import { exec } from 'sudo-prompt'
import Sudoer from './mac-sudo'
import { currentConfig, appConfig$ } from './data'
import logger from './logger'
import { isWin, isMac, isLinux } from '../shared/env'

const userDir = app.getPath('userData')
const exePath = app.getPath('exe')
// windows sysproxy.exe文件的路径
let winToolPath
if (isWin) {
  if (process.env.NODE_ENV === 'development') {
    winToolPath = path.resolve(__dirname, '../lib/sysproxy.exe')
  } else {
    winToolPath = path.join(exePath, '../sysproxy.exe')
  }
}
logger.debug('winToolPath: ' + winToolPath)
// mac 获取network_service的shell脚本
// const macServiceShellPath = path.resolve(__dirname, '../lib/mac_service.sh')
const macToolPath = path.resolve(userDir, 'proxy_conf_helper')

/**
 * 运行命令
 * @param {String} command 待运行的命令
 */
function runCommand (command) {
  execSync(command)
}

/**
 * 在mac上运行sudo 命令
 * @param {String} command 需要在mac上运行的命令
 */
// function sudoMacCommand (command) {
//   return new Promise((resolve, reject) => {
//     exec(command, {
//       name: 'ssrclient'
//       // icns: path.join(__dirname, '../../build/icons/icon.icns')
//     }, (error, stdout, stderr) => {
//       if (error || stderr) {
//         if (process.env.NODE_ENV === 'development') {
//           console.log('error: %s, stderr: %s', error, stderr)
//         } else {
//           logger.debug(`error: ${error}, stderr: ${stderr}`)
//         }
//         app.quit()
//       } else {
//         resolve()
//       }
//     })
//   })
// }
async function sudoMacCommand (command) {
  const sudoer = new Sudoer({ name: 'ShadowsocksR客户端' })
  try {
    const result = await sudoer.exec(command)
    result.on('close', () => {
      if (process.env.NODE_ENV === 'development') {
        result.output.stdout && console.log(result.output.stdout.toString())
        result.output.stderr && console.error(result.output.stderr.toString())
      } else {
        result.output.stdout && logger.log(result.output.stdout.toString())
        result.output.stderr && logger.error(result.output.stderr.toString())
      }
    })
    return result
  } catch (e) {
    app.quit()
  }
}

/**
 * 设置代理为空
 */
export function setProxyToNone () {
  let command
  if (isWin) {
    command = `${winToolPath} pac ""`
  } else if (isMac) {
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
  } else if (isMac) {
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
  } else if (isMac) {
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
    setProxyToPac(`http://127.0.0.1:${currentConfig.pacPort}/pac`)
  } else if (mode === 2) {
    setProxyToGlobal('127.0.0.1', currentConfig.localPort)
  }
}

// 初始化确保文件存在
if (isMac && !existsSync(macToolPath)) {
  const localPath = process.env.NODE_ENV === 'development'
    ? path.join(__dirname, '../lib/proxy_conf_helper')
    : path.join(exePath, '../../../Contents/proxy_conf_helper')
  sudoMacCommand(`cp ${localPath} "${macToolPath}" && chown root:admin "${macToolPath}" && chmod a+rx "${macToolPath}" && chmod +s "${macToolPath}"`)
}

// 监听配置变化
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  if (appConfig.sysProxyMode === 1 && (changed.length === 0 || changed.indexOf('pacPort') > -1)) {
    // 初始化或者pacPort变更时
    setProxyToPac(`http://127.0.0.1:${appConfig.pacPort}/pac`)
  } else if (appConfig.sysProxyMode === 2 && (changed.length === 0 || changed.indexOf('localPort') > -1)) {
    // 初始化或者localPort变更时
    setProxyToGlobal('127.0.0.1', currentConfig.localPort)
  }
})
