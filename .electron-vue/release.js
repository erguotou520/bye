const builder = require('electron-builder')
const os = require('os')
const path = require('path')

const platform = os.platform()
const Platform = builder.Platform
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const END = '\x1b[0m'

let targets

function release () {
  switch (platform) {
    case 'darwin':
      targets = Platform.MAC.createTarget()
      break
    case 'win32':
      targets = Platform.WINDOWS.createTarget()
      break
    case 'linux':
      targets = Platform.LINUX.createTarget()
  }
  builder.build({
    targets: targets,
    appMetadata: {
      homepage: 'https://github.com/erguotou520/electron-ssr'
    },
    config: {
      "productName": "ShadowsocksR客户端",
      "appId": "me.erguotou.ssr",
      "compression": "maximum",
      "directories": {
        "output": "build"
      },
      "files": [
        "dist/electron/**/*",
        "!dist/electron/imgs/ionicons--fonts.svg",
        "!dist/electron/fonts/ionicons--fonts.eot",
        "!dist/electron/fonts/ionicons--fonts.ttf"
      ],
      "extraFiles": [
        { from: "src/lib", to: "./", filter: "**/*" }
      ],
      "dmg": {
        "contents": [
          {
            "x": 410,
            "y": 150,
            "type": "link",
            "path": "/Applications"
          },
          {
            "x": 130,
            "y": 150,
            "type": "file"
          }
        ]
      },
      "mac": {
        "icon": "build/icons/icon.icns",
        "category": "public.app-category.developer-tools",
        "target": [
          "dmg"
        ],
        "extendInfo": {
          "LSUIElement": "YES"
        }
      },
      "win": {
        "icon": "build/icons/icon.ico",
        "target": [
          {
            "target": "nsis",
            "arch": [
              "x64",
              "ia32"
            ]
          }
        ]
      },
      "nsis": {
        "license": "LICENSE"
      },
      "linux": {
        "icon": "build/icons",
        "category": "Development",
        "target": [
          "deb",
          "rpm",
          "tar.gz",
          "pacman"
        ]
      },
      "publish":
        {
          "provider": "github"
        }
    }
  }).then(() => {
    console.log(`${BLUE}Done${END}`)
  }).catch(error => {
    console.error(`${YELLOW}Build error: ${error}${END}`)
  })
}

module.exports = release
release()
