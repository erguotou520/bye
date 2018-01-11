const defaultConfig = {
  // 配置集合
  configs: [],
  // 选中的配置
  index: 0,
  // 是否启用
  enable: false,
  // 开机自启
  autoLaunch: false,
  // 是否局域网共享
  shareOverlan: false,
  // 本地socks端口
  localPort: 1080,
  // 本地ssr目录
  ssrPath: '',
  // pac端口号
  pacPort: 1240,
  // 系统代理启用模式 0 不启用 1 PAC 2 全局
  sysProxyMode: 0
}

export default defaultConfig
