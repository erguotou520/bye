# 应用交互中的事件通讯
整理并规范`ipc`通讯中的所有事件，事件命名遵循`object.event.target`规则，即什么对象，发生了什么事件，事件作用于谁。

## 事件列表
- 系统应用
  * `app.notify.notification` 由`ipc-main`发出 显示应用通知
  * `app.error.main` 由`ipc-main`发出 `main`进程报错
  * `app.scan.desktop` 由`ipc-main`发出 扫描桌面二维码
  * `app.show.page` 由`ipc-main`发出 展示某个页面，某个tab
  * `app.init.web` 由`ipc-render`发出 页面初始化获取数据
  * `app.error.renderer` 由`ipc-render`发出 `render`进程报错
  * `app.hide.window` 由`ipc-render`发出 隐藏窗口
  * `app.show.window` 由`ipc-render`发出 打开窗口
- RxJs
  * `rx.sync.main` 由`ipc-main`发出 同步`rx`数据
  * `rx.sync.render` 由`ipc-render`发出 同步`rx`数据
- SSR
  * `ssr.download.render` 由`ipc-render`发出 自动下载ssr
  * `ssr.download.main` 由`ipc-main`发出 自动下载ssr的进度
- 订阅
  * `subscribe.update.main` 由`ipc-main`发出 更新订阅服务器
