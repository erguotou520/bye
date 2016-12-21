const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const exec = require('child_process').exec
const treeKill = require('tree-kill')
const storage = require('./storage')
const EOL = require('os').EOL

let sourcePath
let localPyPath
let child

function now () {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}

module.exports.setup = function (storePath, config) {
  sourcePath = path.join(storePath, 'shadowsocksr_python')
  localPyPath = path.join(sourcePath, 'shadowsocks/local.py')
  console.log(localPyPath)
  if (fs.existsSync(sourcePath) && fs.existsSync(localPyPath)) {
    console.log('exist, not need to copy')
  } else {
    fsExtra.ensureDirSync(sourcePath)
    fsExtra.copySync(path.join(__dirname, 'shadowsocks'), sourcePath + '/shadowsocks')
  }
  if (config && config.enable && config.selected > -1 && config.configs.length && config.configs[config.selected]) {
    module.exports.run(config.enable, config.configs[config.selected])
  }
}

module.exports.kill = function () {
  if (child && child.pid) {
    treeKill(child.pid)
    child = null
  }
}

module.exports.run = function (enable, config) {
  // kill preview
  module.exports.kill()
  if (enable) {
    const params = []
    params.push(`-s ${config.host}`)
    params.push(`-p ${config.port}`)
    params.push(`-b ${config.localAddr}`)
    params.push(`-l ${config.localPort}`)
    params.push(`-k ${config.password}`)
    params.push(`-m ${config.method}`)
    config.obfs && params.push(`-o ${config.obfs}`)
    const command = `python '${localPyPath}' ${params.join(' ')}`
    console.log(command)
    child = exec(command)
    child.stdout.on('data', data => {
      storage.saveLogs(`${now()} stdout:${EOL}${data}`)
    })
    child.stderr.on('data', data => {
      storage.saveLogs(`${now()} stdout:${EOL}${data}`)
    })
    child.on('close', code => {
      console.log(`child process exist with code ${code}`)
    })
  }
}
