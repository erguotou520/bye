# electron-ss
使用`electron`和`vue`开发的跨平台`shadowsocksr`客户端

## 功能
- 跨平台功能支持
- 支持python版`shadowsocksr`的所有功能
- 当有可更新版本时给出通知

## 环境要求
- 只需要系统已安装 [python](https://www.python.org/downloads/) 可正常执行`shadowsocksr`的python版即可

## 页面截图
![](./assets/images/ssr-client.jpg)

## 下载
请前往 [release](https://github.com/erguotou520/electron-ssr/releases) 下载

## 更新历史
- 0.1.0
  * 支持从托盘中打开日志文件
  * unix系统使用`-d`模式运行，windows系统使用非`-d`模式运行
  * 支持 `ssr://` 和 `ss://` 链接直接的互换
  * 支持扫描屏幕二维码（但需要确保屏幕上只能有一个二维码，即使是本软件的默认二维码也不能出现在屏幕中）
  * 支持在工具初始化时新增和删除加密协议以及混淆协议，初始化完成后请直接修改配置文件（修改后需重启生效）
  * 初始化时要求选择python版 `shadowsocksr` 的目录地址

## 配置文件和日志的目录
* windows: `C:\Users\{your username}\AppData\Local\Programs\electron-ssr`
* linux: `~/.config/electron-ssr`
* mac: `~/Library/Application Support/electron-ssr`

## 开发和构建命令

``` bash
# 安装依赖
npm install

# 启动一个支持热重载的服务 localhost:9080
npm run dev

# 检查 `app/src` 目录下所有 JS/Vue 代码
npm run lint

# 应用打包
npm run pack

# 应用构建
npm run build

# 删除构建的目录
npm run build:clean

# 单元测试
npm run test:unit
```

## ShadowsocksR 参考文档
- [Python client setup (Mult language)](https://github.com/breakwa11/shadowsocks-rss/wiki/Python-client-setup-(Mult-language))
- [SSR QRcode scheme](https://github.com/breakwa11/shadowsocks-rss/wiki/SSR-QRcode-scheme)
