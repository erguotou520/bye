import { tmpdir } from 'os'
// import { watchFile, unwatchFile, unlink, createReadStream, createWriteStream} from 'fs'
import { normalize, join, dirname } from 'path'
import { createHash } from 'crypto'

import { readFile, exec, mkdir } from '~/lib/utils'

const { platform, env } = process

class Sudoer {
  constructor (options) {
    this.platform = platform
    this.options = options
    this.cp = null
    this.tmpdir = tmpdir()
  }

  hash (buffer) {
    const hash = createHash('sha256')
    hash.update('electron-sudo')
    hash.update(this.options.name || '')
    hash.update(buffer || new Buffer(0))
    return hash.digest('hex').slice(-32)
  }

  joinEnv (options) {
    const { env } = options
    const spreaded = []
    if (env && typeof env === 'object') {
      for (const key in env) {
        spreaded.push(key.concat('=', env[key]))
      }
    }
    return spreaded
  }

  escapeDoubleQuotes (string) {
    return string.replace(/"/g, '\\"')
  }

  encloseDoubleQuotes (string) {
    return string.replace(/(.+)/g, '"$1"')
  }

  kill (pid) {
    if (!pid) {
      return
    } else {
      return
    }
  }
}

class SudoerUnix extends Sudoer {
  constructor (options = {}) {
    super(options)
    if (!this.options.name) { this.options.name = 'Electron' }
  }

  async copy (source, target) {
    return new Promise(async (resolve, reject) => {
      source = this.escapeDoubleQuotes(normalize(source))
      target = this.escapeDoubleQuotes(normalize(target))
      try {
        const result = await exec(`/bin/cp -R -p "${source}" "${target}"`)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }

  async remove (target) {
    const self = this
    return new Promise(async (resolve, reject) => {
      if (!target.startsWith(self.tmpdir)) {
        throw new Error(`Try to remove suspicious target: ${target}.`)
      }
      target = this.escapeDoubleQuotes(normalize(target))
      try {
        const result = await exec(`rm -rf "${target}"`)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }

  async reset () {
    await exec('/usr/bin/sudo -k')
  }
}

class SudoerDarwin extends SudoerUnix {
  constructor (options = {}) {
    super(options)
    if (options.icns && typeof options.icns !== 'string') {
      throw new Error('options.icns must be a string if provided.')
    } else if (options.icns && options.icns.trim().length === 0) {
      throw new Error('options.icns must be a non-empty string if provided.')
    }
    this.up = false
  }

  isValidName (name) {
    return /^[a-z0-9 ]+$/i.test(name) && name.trim().length > 0 && name.length < 70
  }

  joinEnv (options) {
    const { env } = options
    const spreaded = []
    if (env && typeof env === 'object') {
      for (const key in env) {
        spreaded.push(key.concat('=', env[key]))
      }
    }
    return spreaded
  }

  async exec (command, options = {}) {
    return new Promise(async (resolve, reject) => {
      const self = this
      const env = self.joinEnv(options)
      const sudoCommand = ['/usr/bin/sudo -n', env.join(' '), '-s', command].join(' ')
      let result
      await self.reset()
      try {
        result = await exec(sudoCommand, options)
        resolve(result)
      } catch (err) {
        try {
          // Prompt password
          await self.prompt()
          // Try once more
          result = await exec(sudoCommand, options)
          resolve(result)
        } catch (err) {
          reject(err)
        }
      }
    })
  }

  async prompt () {
    const self = this
    return new Promise(async (resolve, reject) => {
      if (!self.tmpdir) {
        return reject(
          new Error('Requires os.tmpdir() to be defined.')
        )
      }
      if (!env.USER) {
        return reject(
          new Error('Requires env[\'USER\'] to be defined.')
        )
      }
      // Keep prompt in single instance
      self.up = true
      // Read ICNS-icon and hash it
      const icon = await self.readIcns()
      const hash = self.hash(icon)
      // Copy applet to temporary directory
      const source = join(`${dirname(__filename)}/bin`, 'applet.app')
      const target = join(self.tmpdir, hash, `${self.options.name}.app`)
      try {
        await mkdir(dirname(target))
      } catch (err) {
        if (err.code !== 'EEXIST') { return reject(err) }
      }
      try {
        // Copy application to temporary directory
        await self.copy(source, target)
        // Create application icon from source
        await self.icon(target)
        // Create property list for application
        await self.propertyList(target)
        // Open UI dialog with password prompt
        await self.open(target)
        // Remove applet from temporary directory
        await self.remove(target)
      } catch (err) {
        return reject(err)
      }
      return resolve(hash)
    })
  }

  async icon (target) {
    const self = this
    return new Promise(async (resolve, reject) => {
      if (!this.options.icns) { return resolve() }
      const result = await self.copy(
        this.options.icns,
        join(target, 'Contents', 'Resources', 'applet.icns')
      )
      return resolve(result)
    })
  }

  async open (target) {
    const self = this
    return new Promise(async (resolve, reject) => {
      target = self.escapeDoubleQuotes(normalize(target))
      try {
        const result = await exec(`open -n -W "${target}"`)
        return resolve(result)
      } catch (err) {
        return reject(err)
      }
    })
  }

  async readIcns (icnsPath) {
    return new Promise(async (resolve, reject) => {
      // ICNS is supported only on Mac.
      if (!icnsPath || platform !== 'darwin') {
        return resolve(new Buffer(0))
      }
      try {
        const data = await readFile(icnsPath)
        return resolve(data)
      } catch (err) {
        return reject(err)
      }
    })
  }

  async propertyList (target) {
    const self = this
    return new Promise(async (resolve, reject) => {
      const path = self.escapeDoubleQuotes(join(target, 'Contents', 'Info.plist'))
      const key = self.escapeDoubleQuotes('CFBundleName')
      const value = `${self.options.name} Password Prompt`
      if (/'/.test(value)) {
        return reject(new Error('Value should not contain single quotes.'))
      }
      const result = await exec(`defaults write "${path}" "${key}" '${value}'`)
      return resolve(result)
    })
  }
}

export { SudoerDarwin }
