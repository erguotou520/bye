const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
let configPath = ''

module.exports.setup = function (appPath) {
  try {
    configPath = path.join(appPath, '../shadowsocksr.json')
    console.log('Config file\'s path: ' + configPath)
    fsExtra.ensureFileSync(configPath)
  } catch (e) {
    console.error('Error occured:\n' + JSON.stringify(e, null, 2))
  }
}

module.exports.getConfigs = function () {
  const content = fs.readFileSync(configPath, 'utf8')
  if (content) {
    return JSON.parse(content)
  }
  return { configs: [], selected: -1 }
}

module.exports.saveConfigs = function (configs) {
  const _configs = module.exports.getConfigs()
  _configs.configs = configs
  fsExtra.writeJSONSync(configPath, _configs)
}

module.exports.changeSelected = function (index) {
  const _configs = module.exports.getConfigs()
  _configs.selected = index
  fsExtra.writeJSONSync(configPath, _configs)
}
