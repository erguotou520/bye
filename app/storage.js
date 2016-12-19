const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')

const defaultConfig = { configs: [], selected: -1, autoLaunch: false, enable: false }
let currentConfig
let configPath = ''

module.exports.setup = function (storePath) {
  try {
    configPath = path.join(storePath, 'shadowsocksr.json')
    console.log('Config file\'s path: ' + configPath)
    fsExtra.ensureFileSync(configPath)
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
