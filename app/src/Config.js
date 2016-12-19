const Base64 = require('urlsafe-base64')

function encode (str) {
  return Base64.encode(Buffer.from(str, 'utf-8'))
}

function decode (str) {
  return Base64.decode(str).toString('utf-8')
}

global.encode = encode
global.decode = decode

module.exports = class Config {
  constructor (config) {
    this.host = '127.0.0.1'
    this.port = '8388'
    this.password = '0'
    this.method = 'aes-256-cfb'
    this.protocol = 'origin'
    this.obfs = 'plain'
    this.obfsparam = ''
    this.remark = ''
    // this.udpport = false
    // this.uot = false
    Object.assign(this, config)
  }

  isValid () {
    return !!(this.host && this.port && this.password && this.method && this.protocol && this.obfs)
  }

  getSSRLink () {
    const required = [this.host, this.port, this.protocol, this.method, this.obfs, encode(this.password)]
    const others = []
    this.obfsparam && others.push(`obfsparam=${encode(this.obfsparam)}`)
    this.remark && others.push(`remarks=${encode(this.remark)}`)
    this.udpport && others.push(`udpport=${this.udpport}`)
    this.uot && others.push(`uot=${this.uot}`)
    const link = 'ssr://' + encode(required.join(':') + '/?' + others.join('&'))
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
        let otherSplit = {}
        others.split('&').forEach(item => {
          const _params = item.split('=')
          otherSplit[_params[0]] = _params[1]
        })
        this.host = requiredSplit[0]
        this.port = requiredSplit[1]
        this.protocol = requiredSplit[2]
        this.method = requiredSplit[3]
        this.obfs = requiredSplit[4]
        this.password = decode(requiredSplit[5])
        this.obfsparam = decode(otherSplit.obfsparam)
        this.remark = decode(otherSplit.remarks)
        // this.udpport = otherSplit.udpport
        // this.uot = otherSplit.uot
      } catch (e) {
        console.error(e)
      }
    }
  }
}
