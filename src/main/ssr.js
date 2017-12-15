import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
import treeKill from 'tree-kill'
import logger from './logger'

let child

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
 * @param {*String} pythonPath local.py的路径
 * @param {*[Number|String]} localPort 本地共享端口
 */
export function run (config, pythonPath, localPort = 1080) {
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
  const command = `python ${pythonPath} ${params.join(' ')}`
  logger.debug('run command: %s', command)
  child = runCommand(command)
}

/**
 * 结束command的后台运行
 */
export function stopCommand () {
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
