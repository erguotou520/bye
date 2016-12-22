var expect = require('chai').expect
var Config = require('../../app/src/Config')

var strWithRemark = 'ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUSZyZW1hcmtzPTVyV0w2Sy1WNUxpdDVwYUg'
var strNoRemark = 'ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUQ'

describe('Config', function () {
  it('qrcode-schema-with-remark', function () {
    var config = new Config({
      host: '127.0.0.1',
      port: '1234',
      password: 'aaabbb',
      method: 'aes-128-cfb',
      protocol: 'auth_aes128_md5',
      obfs: 'tls1.2_ticket_auth',
      obfsparam: 'breakwa11.moe',
      remark: '测试中文'
    })
    expect(config.getSSRLink()).to.equal(strWithRemark)
  })

  it('qrcode-schema-without-remark', function () {
    var config = new Config({
      host: '127.0.0.1',
      port: '1234',
      password: 'aaabbb',
      method: 'aes-128-cfb',
      protocol: 'auth_aes128_md5',
      obfs: 'tls1.2_ticket_auth',
      obfsparam: 'breakwa11.moe'
    })
    expect(config.getSSRLink()).to.equal(strNoRemark)
  })

  it('qrcode-schema-decode-with-remark', function () {
    var config = new Config()
    config.setSSRLink(strWithRemark)
    expect(config.host).to.equal('127.0.0.1')
    expect(config.port).to.equal('1234')
    expect(config.password).to.equal('aaabbb')
    expect(config.method).to.equal('aes-128-cfb')
    expect(config.protocol).to.equal('auth_aes128_md5')
    expect(config.obfs).to.equal('tls1.2_ticket_auth')
    expect(config.obfsparam).to.equal('breakwa11.moe')
    expect(config.remark).to.equal('测试中文')
  })

  it('qrcode-schema-decode-without-remark', function () {
    var config = new Config()
    config.setSSRLink(strNoRemark)
    expect(config.host).to.equal('127.0.0.1')
    expect(config.port).to.equal('1234')
    expect(config.password).to.equal('aaabbb')
    expect(config.method).to.equal('aes-128-cfb')
    expect(config.protocol).to.equal('auth_aes128_md5')
    expect(config.obfs).to.equal('tls1.2_ticket_auth')
    expect(config.obfsparam).to.equal('breakwa11.moe')
  })
})
