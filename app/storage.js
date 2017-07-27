const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')

const defaultConfig = { configs: [], selected: -1, autoLaunch: false, enable: false, pyPath: '',
  methods: ['aes-128-cfb', 'aes-192-cfb', 'aes-256-cfb', 'aes-128-cfb8', 'aes-192-cfb8', 'aes-256-cfb8',
    'aes-128-ctr', 'aes-192-ctr', 'aes-256-ctr', 'camellia-128-cfb', 'camellia-192-cfb', 'camellia-256-cfb',
    'bf-cfb', 'rc4', 'rc4-md5', 'rc4-md5-6', 'salsa20', 'chacha20', 'chacha20-ietf'
  ],
  protocols: ['origin', 'verify_deflate', 'verify_sha1', 'auth_sha1_v2',
    'auth_sha1_v4', 'auth_aes128_md5', 'auth_aes128_sha1'
  ],
  obfses: ['plain', 'http_simple', 'http_post', 'ramdom_head', 'tls1.2_ticket_auth']
}
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
    fsExtra.ensureFileSync(logPath)
  } catch (e) {
    console.error('Error occured:\n' + JSON.stringify(e, null, 2))
  }
}

module.exports.getConfig = function () {
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

module.exports.getConfigPath = function () {
  return configPath
}
