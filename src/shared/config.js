const defaultConfig = {
  // 配置集合
  configs: [],
  // 选中的配置
  index: 0,
  // 是否启用
  enable: true,
  // 开机自启
  autoLaunch: false,
  // 是否局域网共享
  shareOverLan: false,
  // 本地socks端口
  localPort: 1080,
  // 本地ssr目录
  ssrPath: '',
  // pac端口号
  pacPort: 2333,
  // 系统代理启用模式 0 不启用 1 PAC 2 全局
  sysProxyMode: 1,
  // 订阅列表
  serverSubscribes: [],
  // 是否开启http proxy
  httpProxyEnable: true,
  // 默认快捷键
  shortcut: {
    toggleWindow: {
      key: 'CommandOrControl+Shift+W',
      enable: false
    },
    toggleMenu: {
      key: 'CommandOrControl+Shift+B',
      enable: true
    }
  },
  // http proxy端口
  httpProxyPort: 12333,
  // 是否自动更新订阅服务器
  autoUpdateSubscribes: true,
  // 订阅服务器自动更新周期，单位：小时
  subscribeUpdateInterval: 24
}

export default defaultConfig

// 合并默认配置，做好配置升级
export function mergeConfig (appConfig) {
  Object.keys(defaultConfig).forEach(key => {
    if (appConfig[key] === undefined || typeof appConfig[key] !== typeof defaultConfig[key]) {
      appConfig[key] = defaultConfig[key]
    } else if (typeof appConfig[key] === 'object') {
      for (const index in appConfig[key]) {
        if (appConfig[key][index] === undefined) {
          appConfig[key][index] = defaultConfig[key][index]
        }
      }
    }
  })
}
