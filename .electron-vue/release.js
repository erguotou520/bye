const builder = require('electron-builder')
const os = require('os')
const path = require('path')

const platform = os.platform()
const Platform = builder.Platform
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const END = '\x1b[0m'

let targets
const extraFiles = []

function release (dir) {
  switch (platform) {
    case 'darwin':
      targets = Platform.MAC.createTarget()
      extraFiles.push({ from: 'src/lib/proxy_conf_helper', to: './' })
      extraFiles.push({ from: 'node_modules/electron-sudo/dist/bin/applet.app', 'to': './applet.app' })
      break
    case 'win32':
      targets = Platform.WINDOWS.createTarget()
      extraFiles.push({ from: 'src/lib/sysproxy.exe', to: './' })
      break
    case 'linux':
      targets = Platform.LINUX.createTarget()
  }
  return builder.build({
    targets: targets,
    x64: true,
    ia32: true,
    dir: dir,
    config: {
      // electronVersion
      // afterPack
      productName: 'ShadowsocksR客户端',
      appId: 'me.erguotou.ssr',
      compression: 'maximum',
      directories: {
        output: 'build'
      },
      files: [
        'dist/electron/**/*',
        '!dist/electron/imgs/ionicons--fonts.svg',
        '!dist/electron/fonts/ionicons--fonts.eot',
        '!dist/electron/fonts/ionicons--fonts.ttf'
      ],
      extraFiles: extraFiles,
      dmg: {
        contents: [
          {
            x: 410,
            y: 150,
            type: 'link',
            path: '/Applications'
          },
          {
            x: 130,
            y: 150,
            type: 'file'
          }
        ]
      },
      mac: {
        icon: 'build/icons/icon.icns',
        category: 'public.app-category.developer-tools',
        target: [
          'dmg'
        ],
        extendInfo: {
          LSUIElement: 'YES'
        }
      },
      win: {
        icon: 'build/icons/icon.ico',
        target: [
          'nsis'
        ]
      },
      nsis: {
        license: 'LICENSE'
      },
      linux: {
        icon: 'build/icons',
        category: 'Development',
        target: [
          'deb',
          'rpm',
          'tar.gz',
          'pacman'
        ]
      },
      publish: {
        provider: 'github'
      }
    },
    publish: 'onTagOrDraft'
  }).then(() => {
    console.log(`${BLUE}Done${END}`)
  }).catch(error => {
    console.error(`${YELLOW}Build error: ${error}${END}`)
  })
}

module.exports = release
