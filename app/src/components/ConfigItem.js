export default class ConfigItem {
  constructor (option) {
    this.server = option.server
    this.port = option.port
    this.password = option.password
    this.method = option.method
    this.protocol = option.protocol
    this.mix = option.mix
    this.mixArgs = option.mixArgs
    this.remark = option.remark
    this.tcp_over_udp = option.tcp_over_udp
    this.udp_over_tcp = option.udp_over_tcp
  }
}
