// 由`ipc-main`发出 版本升级
export const EVENT_APP_UPDATE_VERSION = 'app.update.version'

// 由`ipc-main`发出 `main`进程报错
export const EVENT_APP_ERROR_MAIN = 'app.error.main'

// 由`ipc-main`发出 扫描屏幕二维码
export const EVENT_APP_SCAN_DESKTOP = 'app.scan.desktop'

// 由`ipc-renderer`发出 `renderer`进程报错
export const EVENT_APP_ERROR_RENDER = 'app.error.renderer'

// 由`ipc-renderer`发出 隐藏窗口
export const EVENT_APP_HIDE_WINDOW = 'app.hide.window'

//  由`ipc-renderer`发出 打开窗口
export const EVENT_APP_SHOW_WINDOW = 'app.show.window'

// 由`ipc-renderer`发出 用于获取系统初始化数据
export const EVENT_APP_WEB_INIT = 'app.init.web'

// 由`ipc-renderer`发出 自动下载ssr项目并设置目录
export const EVENT_SSR_DOWNLOAD_RENDERER = 'ssr.download.render'

// 由`ipc-main`发出 自动下载ssr的进度
export const EVENT_SSR_DOWNLOAD_MAIN = 'ssr.download.main'

// 由`ipc-main`发出 同步`rx`数据
export const EVENT_RX_SYNC_MAIN = 'rx.sync.main'

// 由`ipc-renderer`发出 同步`rx`数据
export const EVENT_RX_SYNC_RENDERER = 'rx.sync.renderer'
