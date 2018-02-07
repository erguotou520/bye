import { net } from 'electron'
import { tmpdir } from 'os'
import { join } from 'path'
import { createWriteStream, unlink } from 'fs'
import sudo from 'sudo-prompt'
import { readyPromise } from './bootstrap'
import { showNotification } from './notification'
import { isWin, isPythonInstalled } from '../shared/env'

const PYTHON_FILE = `python-2.7.14${process.arch === 'x64' ? '.amd64' : ''}.msi`
const PYTHON_DOWNLOAD_URL = `https://www.python.org/ftp/python/2.7.14/${PYTHON_FILE}`

export let pythonPromise

// windows自动安装python
export async function init () {
  if (isWin && !isPythonInstalled) {
    pythonPromise = new Promise((resolve, reject) => {
      readyPromise.then(() => {
        return download()
      }).then(msiPath => {
        return install(msiPath)
      }).then(() => {
        showNotification('已自动下载并安装所需python环境')
        resolve()
      }).catch(e => {
        showNotification('python安装出错，请自行下载安装python' + e)
        reject()
      })
    })
  } else {
    pythonPromise = Promise.resolve()
  }
}

// 下载python
export async function download () {
  const tempFile = join(tmpdir(), PYTHON_FILE)
  const writeStream = createWriteStream(tempFile)
  if (process.env.NODE_ENV === 'development') {
    console.log('start to download python to ', tempFile)
  }
  return new Promise((resolve, reject) => {
    net.request(PYTHON_DOWNLOAD_URL)
      .on('response', response => {
        response.pipe(writeStream)
        writeStream.once('finish', () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('python download finished')
          }
          writeStream.close(() => {
            resolve(tempFile)
          })
        })
      })
      .on('error', err => {
        unlink(tempFile)
        reject(err)
      })
      .end()
  })
}

// 安装python
export async function install (msiPath) {
  return new Promise((resolve, reject) => {
    sudo.exec(`msiexec /i ${msiPath} /passive /forcerestart ADDLOCAL=ALL /qn`, { name: 'ShadowsocksR Client' }, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr)
      } else {
        resolve()
      }
    })
  })
}
