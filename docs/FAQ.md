# FAQ

<details>
  <summary>为什么我打开了应用但是没有代理成功？</summary>
  <p>首先，确定服务器配置中有可用的服务器并选中了其中的一项。其次，确认“启用系统代理”菜单已选中。再次，尝试勾选“系统代理设置”-“全局设置”，然后查看浏览器是否已被代理。最后，点击“帮助”-“查看日志”查看<code>shadowsocksr-python</code>是否正常运行，日志中有没有报错，如有报错请先排错（比如端口占用）。</p>
</details>

<details>
  <summary>为什么我的Linux在安装了SSR客户端后打开没有看到小飞机图标？</summary>
  <p>尝试安装<code>libappindicator1</code>应用程序指示器。</p>
</details>

<details>
  <summary>为什么我点击扫描二维码后没有反应，SSR配置也没加入进去？</summary>
  <p>请确保整个屏幕中有且仅有一个正确可识别的SS(R)二维码。</p>
</details>

<details>
  <summary>为什么我点击“查看日志”、“打开配置文件”显示的内容非常混乱？</summary>
  <p>这2个操作会直接使用系统默认的应用分别打开<code>.log</code>和<code>.json</code>文件，所以这种情况应该是对应扩展名的系统默认应用对该文件显示有问题，请尝试直接修改这2种后缀名对应的默认程序。</p>
</details>

<details>
  <summary>为什么我点击切换系统代理模式却没有效果？</summary>
  <p>我们暂时只支持<code>Gnome</code>桌面的Linux系统，其它桌面环境的如果你有解决方案请发issue。Windows和Mac应该正常。</p>
</details>

<details>
  <summary>错误日志option -O not recognized</summary>
  <p>该错误的原因是因为<code>shadowsocksr-python</code>版本过低而不支持<code>-O</code>参数导致，请升级<code>shadowsocksr-python</code>版本。其它相类似的错误采用同样的处理方案。</p>
</details>

<details>
  <summary>错误日志Exception: libsodium not found</summary>
  <p>该错误是因为当前系统缺少libsodium库导致，Mac下使用<code>brew install libsodium</code>安装，Ubuntu可参考<a>https://gist.github.com/jonathanpmartins/2510f38abee1e65c6d92</a>安装，其它系统请自行搜索。</p>
</details>

<details>
  <summary>加密方法、协议、混淆中没有我想设置的选项怎么办？</summary>
  <p>请右击任务栏图标-配置-选项设置...，然后切换到SSR设置选项卡中自行添加。</p>
</details>

<details>
  <summary>我的linux系统提示有新版本升级，但是我点击通知并没有跳转到下载页面？</summary>
  <p>1，建议使用AppImage包。 2，参考<a href="https://github.com/electron/electron/issues/9919">https://github.com/electron/electron/issues/9919</a>&nbsp;以及&nbsp;<a href="https://github.com/electron/electron/issues/8474">https://github.com/electron/electron/issues/8474</a></p>
</details>
