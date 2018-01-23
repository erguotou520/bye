import fs from 'fs'
import child from 'child_process'

function promisify (fn) {
  return function () {
    return new Promise((resolve, reject) => {
      fn(...arguments, function () {
        if (arguments[0] instanceof Error) {
          reject(arguments[0])
        } else {
          resolve(...Array.prototype.slice.call(arguments, 1))
        }
      })
    })
  }
}

async function exec (cmd, options = {}) {
  return new Promise((resolve, reject) => {
    child.exec(cmd, options, (err, stdout, stderr) => {
      if (err) { return reject(err) }
      return resolve({ stdout, stderr })
    })
  })
}

const readFile = promisify(fs.readFile)
const mkdir = promisify(fs.mkdir)

export { exec, readFile, mkdir }
