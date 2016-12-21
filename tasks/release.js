'use strict'

const builder = require('electron-builder')
// const Platform = builder.Platform

const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const END = '\x1b[0m'

builder.build({
  arch: 'all'
})
.then(() => {
  console.log(`${BLUE}Done${END}`)
})
.catch(error => {
  console.error(`${YELLOW}Build error: ${error}${END}`)
})
