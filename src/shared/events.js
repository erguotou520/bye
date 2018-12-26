// 由`ipc-main`发出 使用HTML5降级通知
export const EVENT_APP_NOTIFY_MAIN = 'app.notify.main'

// 由`ipc-renderer`发出 显示通知
export const EVENT_APP_NOTIFY_RENDERER = 'app.notify.renderer'

// 由`ipc-main`发出 `main`进程报错
export const EVENT_APP_ERROR_MAIN = 'app.error.main'

// 由`ipc-main`发出 扫描屏幕二维码
export const EVENT_APP_SCAN_DESKTOP = 'app.scan.desktop'

// 由`ipc-renderer`发出 隐藏窗口
export const EVENT_APP_HIDE_WINDOW = 'app.hide.window'

// 由`ipc-main`发出 打开并跳转到指定的页面
export const EVENT_APP_SHOW_PAGE = 'app.show.page'

// 由`ipc-renderer`发出 用于获取系统初始化数据
export const EVENT_APP_WEB_INIT = 'app.init.web'

// 由`ipc-main`发出 切换menu显示
export const EVENT_APP_TOGGLE_MENU = 'app.toggle.menu'

// 由`ipc-renderer`发出 用于选择本地文件/目录
export const EVENT_APP_OPEN_DIALOG = 'app.open.dialog'

// 由`ipc-renderer`发出 自动下载ssr项目并设置目录
export const EVENT_SSR_DOWNLOAD_RENDERER = 'ssr.download.renderer'

// 由`ipc-main`发出 自动下载ssr的进度
export const EVENT_SSR_DOWNLOAD_MAIN = 'ssr.download.main'

// 由`ipc-main`发出 更新订阅服务器
export const EVENT_SUBSCRIBE_UPDATE_MAIN = 'subscribe.update.main'

// 由`ipc-renderer`发出 从剪切板添加配置
export const EVENT_CONFIG_COPY_CLIPBOARD = 'config.copy.board'

// 由`ipc-main`发出 同步`rx`数据
export const EVENT_RX_SYNC_MAIN = 'rx.sync.main'

// 由`ipc-renderer`发出 同步`rx`数据
export const EVENT_RX_SYNC_RENDERER = 'rx.sync.renderer'
