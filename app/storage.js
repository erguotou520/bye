const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')

const defaultConfig = { configs: [], selected: -1, autoLaunch: false, enable: false }
let currentConfig
let dataPath
let logPath
let configPath = ''

module.exports.setup = function (appConfigPath) {
  try {
    dataPath = appConfigPath
    configPath = path.join(appConfigPath, 'shadowsocksr.json')
    logPath = path.join(dataPath, 'logs/shadowsocksr-client.log')
    console.log('Config file\'s path: ' + configPath)
    // configs
    fsExtra.ensureFileSync(configPath)
    // logs
    fsExtra.ensureDirSync(path.join(dataPath, 'logs'))
  } catch (e) {
    console.error('Error occured:\n' + JSON.stringify(e, null, 2))
  }
}

module.exports.getConfigs = function () {
  const content = fs.readFileSync(configPath, 'utf8')
  if (content) {
    currentConfig = JSON.parse(content)
  } else {
    currentConfig = defaultConfig
  }
  return currentConfig
}

module.exports.saveConfig = function () {
  fsExtra.writeJSONSync(configPath, currentConfig)
}

module.exports.saveLogs = function (data) {
  fs.appendFileSync(logPath, data, { flag: 'a+' })
}

module.exports.getLogPath = function () {
  return logPath
}
