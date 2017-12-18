import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import treeKill from 'tree-kill'
import { appConfig$ } from './data'
import logger from './logger'

let child
// 当前运行的ssr配置
// let currentConfig

/**
 * 运行shell命令并写入到日志中
 * @param {*String} command 待执行的shell命令
 */
export function runCommand (command) {
  if (command) {
    child = exec(command)
    child.stdout.on('data', logger.log)
    child.stderr.on('data', logger.error)
    child.on('close', logger.log)
  }
}

/**
 * 运行ssr
 * @param {*Object} config ssr配置
 * @param {*String} ssrPath local.py的路径
 * @param {*[Number|String]} localPort 本地共享端口
 */
export function run (config, ssrPath, localPort = 1080) {
  // currentConfig = config
  // 先结束之前的
  stop()
  // 参数
  const params = []
  params.push(`-s ${config.host}`)
  params.push(`-p ${config.port}`)
  params.push(`-k ${config.password}`)
  params.push(`-m ${config.method}`)
  config.obfs && params.push(`-o ${config.obfs}`)
  params.push(`-O ${config.protocol}`)
  params.push(`-l ${localPort}`)
  // FIXME
  const command = `python ${ssrPath} ${params.join(' ')}`
  logger.debug('run command: %s', command)
  child = runCommand(command)
}

/**
 * 结束command的后台运行
 */
export function stop () {
  if (child && child.pid) {
    logger.log('Kill python client')
    treeKill(child.pid)
    child = null
  }
}

/**
 * 判断选择的local.py的路径是否正确
 * @param {*String} path local.py所在的目录
 */
export function isSSRPathAvaliable (folderPath) {
  const localPyPath = path.join(folderPath, 'local.py')
  console.log(localPyPath)
  return fs.existsSync(localPyPath)
}

/**
 * 根据配置运行python命令
 * @param {Object} appConfig 应用配置
 */
function runWithConfig (appConfig) {
  if (appConfig.ssrPath && appConfig.enable && appConfig.configs && appConfig.configs[appConfig.index]) {
    run(appConfig.configs[appConfig.index], appConfig.ssrPath, appConfig.localPort)
  }
}

// 监听配置变化
appConfig$.subscribe(data => {
  const [appConfig, changed] = data
  // 初始化
  if (changed.length === 0) {
    runWithConfig(appConfig)
  } else {
    if (changed.indexOf('enable') > -1) {
      if (appConfig.enable) {
        runWithConfig(appConfig)
      } else {
        stop()
      }
    } else if (appConfig.enable) {
      if (['ssrPath', 'index', 'localPort', 'configs'].some(key => changed.indexOf(key) > -1)) {
        // TODO: 优化 只有选中的配置发生改变时才重新运行
        runWithConfig(appConfig)
      }
    }
  }
})
