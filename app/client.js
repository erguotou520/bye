const downloader = require('github-download')
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec
const treeKill = require('tree-kill')

let sourcePath
let localPyPath
let child
let handler

module.exports.setup = function (storePath, config, execHandler) {
  sourcePath = path.join(storePath, 'shadowsocksr_python')
  localPyPath = path.join(sourcePath, 'shadowsocks/local.py')
  if (fs.existsSync(sourcePath)) {
    console.log('exist, not need to download')
  } else {
    downloader({ user: 'breakwa11', repo: 'shadowsocks' }, sourcePath).on('end', () => {
      console.log('download complete')
    })
  }
  handler = execHandler
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
      console.log(`stdout: ${data}`)
    })
    child.stderr.on('data', data => {
      console.log(`stderror: ${data}`)
      // handler(data)
    })
    child.on('close', code => {
      console.log(`child process exist with code ${code}`)
    })
  }
}
