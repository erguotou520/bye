var expect = require('chai').expect
var Config = require('../../../src/shared/ssr').default

var strWithRemark = 'ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUSZyZW1hcmtzPTVyV0w2Sy1WNUxpdDVwYUg'
var strNoRemark = 'ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUQ'
var ssStr = 'ss://YmYtY2ZiOnRlc3RAMTkyLjE2OC4xMDAuMTo4ODg4'

function clone (obj) {
  var r = {}
  for (var key in obj) {
    r[key] = obj[key]
  }
  return r
}

describe('Config', function () {
  it('ssr-qrcode', function () {
    var base = {
      server: '127.0.0.1',
      server_port: 1234,
      password: 'aaabbb',
      method: 'aes-128-cfb',
      protocol: 'auth_aes128_md5',
      protocolparam: '',
      obfs: 'tls1.2_ticket_auth',
      obfsparam: 'breakwa11.moe'
    }
    var withRemark = clone(base)
    withRemark.remarks = '测试中文'
    expect(new Config(base).getSSRLink()).to.equal(strNoRemark)
    expect(new Config(withRemark).getSSRLink()).to.equal(strWithRemark)
  })

  it('ssr-decode', function () {
    var base = new Config()
    base.setSSRLink(strNoRemark)
    expect(base.server).to.equal('127.0.0.1')
    expect(base.server_port).to.equal(1234)
    expect(base.password).to.equal('aaabbb')
    expect(base.method).to.equal('aes-128-cfb')
    expect(base.protocol).to.equal('auth_aes128_md5')
    expect(base.protocolparam).to.equal('')
    expect(base.obfs).to.equal('tls1.2_ticket_auth')
    expect(base.obfsparam).to.equal('breakwa11.moe')

    var withRemark = new Config()
    withRemark.setSSRLink(strWithRemark)
    expect(withRemark.server).to.equal('127.0.0.1')
    expect(withRemark.server_port).to.equal(1234)
    expect(withRemark.password).to.equal('aaabbb')
    expect(withRemark.method).to.equal('aes-128-cfb')
    expect(withRemark.protocol).to.equal('auth_aes128_md5')
    expect(base.protocolparam).to.equal('')
    expect(withRemark.obfs).to.equal('tls1.2_ticket_auth')
    expect(withRemark.obfsparam).to.equal('breakwa11.moe')
    expect(withRemark.remarks).to.equal('测试中文')
  })

  it('ss-qrcode', function () {
    var base = {
      server: '192.168.100.1',
      server_port: '8888',
      password: 'test',
      method: 'bf-cfb'
    }
    var withRemark = clone(base)
    withRemark.remarks = 'example-server'
    expect(new Config(base).getSSLink()).to.equal(ssStr)
    expect(new Config(withRemark).getSSLink()).to.equal(ssStr + '#example-server')
  })

  it('ss-decode', function () {
    var base = new Config()
    base.setSSLink(ssStr)
    expect(base.server).to.equal('192.168.100.1')
    expect(base.server_port).to.equal(8888)
    expect(base.password).to.equal('test')
    expect(base.method).to.equal('bf-cfb')
    expect(base.protocol).to.equal('origin')
    expect(base.obfs).to.equal('plain')
    expect(base.obfsparam).to.equal('')

    var withRemark = new Config()
    withRemark.setSSLink(ssStr + '#example-server')
    expect(base.server).to.equal('192.168.100.1')
    expect(base.server_port).to.equal(8888)
    expect(base.password).to.equal('test')
    expect(base.method).to.equal('bf-cfb')
    expect(base.protocol).to.equal('origin')
    expect(base.obfs).to.equal('plain')
    expect(base.obfsparam).to.equal('')
    expect(withRemark.remarks).to.equal('example-server')
  })
})
