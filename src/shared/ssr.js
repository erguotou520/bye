import Base64 from 'urlsafe-base64'
import { generateID, isNumber, isObject } from './utils'

function encode (str) {
  return Base64.encode(Buffer.from(str, 'utf-8'))
}

function decode (str) {
  return Base64.decode(str).toString('utf-8')
}

function merge (ssr, target) {
  if (isObject(target)) {
    Object.keys(target).forEach(key => {
      if (ssr[key] !== undefined) {
        ssr[key] = isNumber(ssr[key]) ? +target[key] : target[key]
      }
    })
  }
}

export default class Config {
  constructor (config) {
    this.server = '127.0.0.1'
    this.server_port = 8388
    this.password = '0'
    this.method = 'aes-256-cfb'
    this.protocol = 'origin'
    this.protocolparam = ''
    this.obfs = 'plain'
    this.obfsparam = ''
    this.remarks = ''
    this.group = ''
    merge(this, config)
    this.id = generateID()
    this.enable = true
    Object.defineProperty(this, 'remarks_base64', {
      enumerable: true,
      get () {
        return this.remarks ? encode(this.remarks) : ''
      },
      set () {}
    })
  }

  isValid () {
    return !!(this.server && this.server_port && this.password && this.method && this.protocol && this.obfs)
  }

  getSSRLink () {
    const required = [this.server, this.server_port, this.protocol, this.method, this.obfs, encode(this.password)]
    const others = []
    this.obfsparam && others.push(`obfsparam=${encode(this.obfsparam)}`)
    this.protocolparam && others.push(`protoparam=${encode(this.protocolparam)}`)
    this.remarks && others.push(`remarks=${encode(this.remarks)}`)
    this.group && others.push(`group=${encode(this.group)}`)
    const link = `ssr://${encode(required.join(':') + '/?' + others.join('&'))}`
    return link
  }

  setSSRLink (link) {
    if (link) {
      try {
        const body = link.substring(6)
        const decoded = decode(body)
        const _split = decoded.split('/?')
        const required = _split[0]
        const others = _split[1]
        const requiredSplit = required.split(':')
        const otherSplit = {}
        others.split('&').forEach(item => {
          const _params = item.split('=')
          otherSplit[_params[0]] = _params[1]
        })
        this.server = requiredSplit[0]
        this.server_port = +requiredSplit[1]
        this.protocol = requiredSplit[2]
        this.method = requiredSplit[3]
        this.obfs = requiredSplit[4]
        this.password = decode(requiredSplit[5])
        if (otherSplit.obfsparam) {
          this.obfsparam = decode(otherSplit.obfsparam)
        }
        if (otherSplit.protoparam) {
          this.protocolparam = decode(otherSplit.protoparam)
        }
        if (otherSplit.remarks) {
          this.remarks = decode(otherSplit.remarks)
        }
        if (otherSplit.group) {
          this.group = decode(otherSplit.group)
        }
      } catch (e) {
        console.error(e)
      }
    }
    return this
  }

  getSSLink () {
    const link = `${this.method}:${this.password}@${this.server}:${this.server_port}`
    const encoded = encode(link)
    return `ss://${encoded}${this.remarks ? '#' + this.remarks : ''}`
  }

  setSSLink (link) {
    if (link) {
      try {
        let body = link.substring(5)
        const remarks = body.split('#')
        if (remarks[1]) {
          this.remarks = remarks[1]
        }
        body = remarks[0]
        const decoded = decode(body)
        const split1 = decoded.split('@')
        const split2 = split1[0].split(':')
        const split3 = split1[1].split(':')
        this.method = split2[0]
        this.password = split2[1]
        this.server = split3[0]
        this.server_port = +split3[1]
        this.protocol = 'origin'
        this.obfs = 'plain'
        this.obfsparam = ''
      } catch (e) {
        console.error(e)
      }
    }
    return this
  }
}

// 根据字符串导入配置，字符串使用\n或空格间隔
export function loadConfigsFromString (strings) {
  if (strings) {
    const arr = strings.split(/[\n ]/)
    const avaliable = []
    arr.forEach(str => {
      if (/^ssr:\/\//.test(str)) {
        avaliable.push(new Config().setSSRLink(str))
      } else if (/^ss:\/\//.test(str)) {
        avaliable.push(new Config().setSSLink(str))
      }
    })
    if (avaliable.length) {
      return avaliable
    }
  }
  return []
}
