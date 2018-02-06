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
  let files = [
    'dist/electron/**/*',
    '!dist/electron/imgs/ionicons--fonts.svg',
    '!dist/electron/fonts/ionicons--fonts.eot',
    '!dist/electron/fonts/ionicons--fonts.ttf',
    '!dist/electron/static/plane.svg',
    '!node_modules/**/*.@{md|MD|markdown}',
    '!node_modules/*/sample{s}',
    '!node_modules/*/LICENSE?{.txt}',
    '!node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme,test,__tests__,tests,powered-test,example,examples,*.d.ts}',
    '!node_modules/.bin',
    '!**/*.{o,hprof,orig,pyc,pyo,rbc}',
    '**/._*',
    '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,__pycache__,thumbs.db,.gitignore,.gitattributes,.editorconfig,.flowconfig,.yarn-metadata.json,.idea,appveyor.yml,.travis.yml,circle.yml,npm-debug.log,.nyc_output,yarn.lock,.yarn-integrity}',
    '!node_modules/vue*/**/*'
  ]
  const macImages = [
    '!dist/electron/static/enabled@(Template|Highlight)?(@2x).png',
    '!dist/electron/static/pac@(Template|Highlight)?(@2x).png',
    '!dist/electron/static/global@(Template|Highlight)?(@2x).png',
  ]
  const winImages = [
    '!dist/electron/static/enabled?(@2x).png',
    '!dist/electron/static/pac?(@2x).png',
    '!dist/electron/static/global?(@2x).png',
  ]
  switch (platform) {
    case 'darwin':
      targets = Platform.MAC.createTarget()
      extraFiles.push({ from: 'src/lib/proxy_conf_helper', to: './' })
      files = files.concat(winImages)
      break
    case 'win32':
      targets = Platform.WINDOWS.createTarget()
      extraFiles.push({ from: 'src/lib/sysproxy.exe', to: './' })
      files = files.concat(macImages)
      break
    case 'linux':
      targets = Platform.LINUX.createTarget()
      files = files.concat(macImages)
  }
  const baseOptions = {
    targets: targets,
    dir: dir
  }
  const baseConfig = {
    // electronVersion
    // afterPack
    productName: 'ShadowsocksR客户端',
    appId: 'me.erguotou.ssr',
    compression: 'maximum',
    directories: {
      output: 'build'
    },
    files,
    extraFiles: extraFiles,
    publish: {
      provider: 'github'
    }
  }
  const options = Object.assign({}, baseConfig)
  const promise = [
    builder.build(Object.assign({}, baseOptions, {
      config: Object.assign({}, baseConfig, {
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
            'zip',
            'dmg'
          ],
          extendInfo: {
            LSUIElement: 'YES'
          }
        },
        win: {
          icon: 'build/icons/icon.ico',
          target: [
            {
              target: 'nsis',
              arch: [
                'x64'
              ]
            }
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
        }
      })
    }))
  ]
  if (platform === 'win32') {
    promise.push(builder.build(Object.assign({}, baseOptions, {
      config: Object.assign({}, baseConfig, {
        win: {
          icon: 'build/icons/icon.ico',
          target: [
            {
              target: 'nsis',
              arch: [
                'ia32'
              ]
            }
          ]
        }
      })
    })))
  }
  return Promise.all(promise).then(() => {
    console.log(`${BLUE}Done${END}`)
  }).catch(error => {
    console.error(`${YELLOW}Build error: ${error}${END}`)
  })
}

module.exports = release

release(true)
