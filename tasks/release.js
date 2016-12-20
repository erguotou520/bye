'use strict'

const exec = require('child_process').exec
const packager = require('electron-packager')
const path = require('path')
const fs = require('fs')

if (process.env.PLATFORM_TARGET === 'clean') {
  require('del').sync(['builds/*', '!.gitkeep'])
  console.log('\x1b[33m`builds` directory cleaned.\n\x1b[0m')
} else pack()

/**
 * Build webpack in production
 */
function pack () {
  console.log('\x1b[33mBuilding webpack in production mode...\n\x1b[0m')
  let pack = exec('npm run pack')

  pack.stdout.on('data', data => console.log(data))
  pack.stderr.on('data', data => console.error(data))
  pack.on('exit', code => mainDeps())
}

/**
 * copy all node_modules expect .bin vue*
 */
function mainDeps () {
  console.log('\x1b[33mDetermining main process modules...\n\x1b[0m')
  const deps = []
  fs.readdirSync(path.join(__dirname, '../app/node_modules')).forEach(path => {
    if (!/^\.bin$|^vue/.test(path)) {
      deps.push(path)
    }
  })
  build(deps.join('|'))
}

/**
 * Recursively remove all empty directories
 */
function removeEmptyDirectories (buildPath, e, p, a, cb) {
  require('delete-empty').sync(path.join(buildPath), { force: true })
  cb()
}

/**
 * Use electron-packager to build electron app
 */
function build (mainModules) {
  let options = require('../config').building

  for (let i = 0; i < options.ignore.length; i++) {
    if (options.ignore[i].toString() === '/\\bnode_modules\\b/') {
      options.ignore[i] = new RegExp(`\\bnode_modules\\/(?!${mainModules}).*\\b`)
    }
  }

  options.afterCopy = [ removeEmptyDirectories ]

  console.log('\x1b[34mBuilding electron app(s)...\n\x1b[0m')
  packager(options, (err, appPaths) => {
    if (err) {
      console.error('\x1b[31mError from `electron-packager` when building app...\x1b[0m')
      console.error(err)
    } else {
      console.log('Build(s) successful!')
      console.log(appPaths)
      console.log('\n\x1b[34mDONE\n\x1b[0m')
    }
  })
}
