import { Base64 } from 'js-base64'

export default class Config {
  constructor (config) {
    this.host = '127.0.0.1'
    this.port = '8388'
    this.password = '0'
    this.method = 'aes-256-cfb'
    this.protocol = 'origin'
    this.obfs = 'plain'
    this.obfsparam = ''
    this.remark = ''
    this.udpport = false
    this.uot = false
    Object.assign(this, config)
  }

  getSSRLink () {
    const required = [this.host, this.port, this.protocol, this.method, this.obfs, Base64.encode(this.password)]
    const others = [`obfsparam=${Base64.encode(this.obfsparam)}`, `remarks=${Base64.encode(this.remark)}`, `udpport=${this.udpport}`, `uot=${this.uot}`]
    const link = 'ssr://' + Base64.encode(required.join(':') + '/?' + others.join('&'))
    return link
  }

  setSSRLink (link) {
    if (link) {
      try {
        const body = link.substring(6)
        const decoded = Base64.decode(body)
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
        this.password = Base64.decode(requiredSplit[5])
        this.obfsparam = Base64.decode(otherSplit.obfsparam)
        this.remark = Base64.decode(otherSplit.remarks)
        this.udpport = otherSplit.udpport
        this.uot = otherSplit.uot
      } catch (e) {
        console.error(e)
      }
    }
  }
}
