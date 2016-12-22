'use strict'

const exec = require('child_process').exec
const builder = require('electron-builder')
const path = require('path')
const Platform = builder.Platform
const config = require('../config')

const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const END = '\x1b[0m'

if (process.env.PLATFORM_TARGET === 'clean') {
  require('del').sync(['builds/*', '!.gitkeep'])
  console.log(`${YELLOW}\`builds\` directory cleaned.\n${END}`)
} else pack()

/**
 * Build webpack in production
 */
function pack () {
  console.log(`${YELLOW}Building webpack in production mode...\n${END}`)
  let pack = exec('npm run pack')

  pack.stdout.on('data', data => console.log(data))
  pack.stderr.on('data', data => console.error(data))
  pack.on('exit', code => build())
}

/**
 * Use electron-packager to build electron app
 */
function build () {
  let targets
  switch (process.env.PLATFORM_TARGET) {
    case 'darwin':
      targets = Platform.MAC.createTarget()
      break
    case 'win32':
      targets = Platform.WINDOWS.createTarget()
      break
    case 'linux':
      targets = Platform.LINUX.createTarget()
  }
  console.log('\x1b[34mBuilding electron app(s)...\n\x1b[0m')
  builder.build({
    targets: targets,
    devMetadata: {
      build: {
        appId: 'me.erguotou',
        arch: 'all',
        files: [
          '**/*',
          '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme,test,__tests__,tests,powered-test,example,examples,*.d.ts}',
          '!**/node_modules/.bin',
          '!**/*.{o,hprof,orig,pyc,pyo,rbc}',
          '**/._*',
          '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,__pycache__,thumbs.db,.gitignore,.gitattributes,.editorconfig,.flowconfig,.yarn-metadata.json,.idea,appveyor.yml,.travis.yml,circle.yml,npm-debug.log,.nyc_output,yarn.lock,.yarn-integrity}',
          '!node_modules/vue*/**/*'
        ],
        directories: {
          app: 'app',
          output: 'builds'
        },
        compression: 'maximum',
        productName: config.name,
        win: {
          target: ['nsis', 'zip']
        },
        nsis: {
          license: path.join(__dirname, '../LICENSE')
        },
        mac: {
          category: 'public.app-category.developer-tools',
          target: ['dmg', 'zip']
        }
      }
    }
  })
  .then(() => {
    console.log(`${BLUE}Done${END}`)
  })
  .catch(error => {
    console.error(`${YELLOW}Build error: ${error}${END}`)
  })
}
