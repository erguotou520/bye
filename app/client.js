const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec
const treeKill = require('tree-kill')
const storage = require('./storage')
const os = require('os')
const EOL = os.EOL

let localPyPath
let child

function now () {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}

function execCmd (command) {
  child = exec(command)
  child.stdout.on('data', data => {
    storage.saveLogs(`${now()} stdout:${EOL}${data}`)
  })
  child.stderr.on('data', data => {
    storage.saveLogs(`${now()} stderr:${EOL}${data}`)
  })
  child.on('close', code => {
    console.log(`child process exist with code ${code}`)
  })
  return child
}

module.exports.setup = function (storePath, config) {
  localPyPath = path.join(storePath, 'local.py')
  console.log(localPyPath)
  return fs.existsSync(localPyPath)
}

module.exports.stop = function () {
  if (child && child.pid) {
    console.log('kill python client')
    treeKill(child.pid)
    child = null
  }
}

module.exports.run = function (enable, config) {
  // stop preview
  module.exports.stop()
  if (enable) {
    const params = []
    params.push(`-s ${config.host}`)
    params.push(`-p ${config.port}`)
    params.push(`-b ${config.localAddr}`)
    params.push(`-l ${config.localPort}`)
    params.push(`-k ${config.password}`)
    params.push(`-m ${config.method}`)
    params.push(`-O ${config.protocol}`)
    config.obfs && params.push(`-o ${config.obfs}`)
    const command = `python ${localPyPath} ${params.join(' ')}`
    console.log(command)
    child = execCmd(command)
  }
}
