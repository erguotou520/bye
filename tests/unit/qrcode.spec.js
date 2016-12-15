var expect = require('chai').expect
var Config = require('../../app/src/Config')

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
    expect(config.getSSRLink()).to.equal('ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUSZyZW1hcmtzPTVyV0w2Sy1WNUxpdDVwYUg')
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
    expect(config.getSSRLink()).to.equal('ssr://MTI3LjAuMC4xOjEyMzQ6YXV0aF9hZXMxMjhfbWQ1OmFlcy0xMjgtY2ZiOnRsczEuMl90aWNrZXRfYXV0aDpZV0ZoWW1KaS8_b2Jmc3BhcmFtPVluSmxZV3QzWVRFeExtMXZaUQ')
  })
})
