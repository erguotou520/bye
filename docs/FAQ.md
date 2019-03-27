# FAQ

<details>
  <summary>我该下哪个后缀的文件？</summary>
  [请参考](../README.md#下载)
</details>

<details>
  <summary>为什么应用无法启动？</summary>
  <p>请先检查任务栏是否有小飞机图标！其次这种问题常见于Linux系统，建议下载系统对应的安装包使用。如果你出现了该问题，请发issue并说明清楚你的环境并附上日志。</p>
</details>

<details>
  <summary>为什么应用打开后白屏？</summary>
  <p>请先下载安装最新版，已经很少遇到这类问题了，如果有，请描述清楚你的环境，并附上日志 。</p>
</details>

<details>
  <summary>为什么我打开了应用但是没有代理成功？不能FQ？</summary>
  <p>首先，确定服务器配置中有可用的服务器并选中了其中的一项。其次，确认“启用系统代理”菜单已选中。再次，尝试勾选“系统代理设置”-“全局设置”，然后查看浏览器是否已被代理。最后，点击“帮助”-“查看日志”查看<code>ssr-libev</code>是否正常运行，日志中有没有报错，如有报错请先排错（比如端口占用）。</p>
  <p>不是说浏览器打不开google就表示代理不成功！你的浏览器可能用了其它代理模式，所以请将浏览器的代理模式设为"使用系统代理"后再试。如何判断代理到底有没有成功？首先勾选上应用的http代理，然后点击任务栏菜单的<code>复制http代理设置</code>，然后在终端（Windows请使用Git base一类的支持Linux命令操作的终端）粘贴，粘贴后使用<code>curl https://google.com</code>命令查看运行结果，如果成功返回内容则表示代理成功，否则视为失败。</p>
</details>

<details>
  <summary>Linux系统下载后不会安装运行？</summary>
  <p>请先学习Linux系统的基础知识，我们这里不教。</p>
</details>

<details>
  <summary>是否支持32位系统？</summary>
  <p>支持的，但只是windows支持，其它系统不支持32位。</p>
</details>

<details>
  <summary>为什么我的Linux在安装了SSR客户端后打开没有看到小飞机图标？</summary>
  <p>尝试安装<code>libappindicator1</code>应用程序指示器。如果不行，请使用快捷键切换主界面和操作菜单，[详情请看](../README.md#快捷键)</p>
</details>

<details>
  <summary>为什么我点击扫描二维码后没有反应，SSR配置也没加入进去？</summary>
  <p>请确保整个屏幕中有且仅有一个正确可识别的SS(R)二维码。也有可能是ss url schema规则更新，如果是这种情况请发issue。</p>
</details>

<details>
  <summary>为什么我点击“查看日志”、“打开配置文件”显示的内容非常混乱？</summary>
  <p>这2个操作会直接使用系统默认的应用分别打开<code>.log</code>和<code>.json</code>文件，所以这种情况应该是对应扩展名的系统默认应用对该文件显示有问题，请尝试直接修改这2种后缀名对应的默认程序。</p>
</details>

<details>
  <summary>为什么我点击切换系统代理模式却没有效果？</summary>
  [见已知bug](../README.md#已知Bug)
</details>

<details>	
  <summary>错误日志Exception: libsodium not found</summary>	
  <p>该错误是因为当前系统缺少libsodium库导致，Mac下使用<code>brew install libsodium</code>安装，Ubuntu可参考<a href="https://gist.github.com/jonathanpmartins/2510f38abee1e65c6d92">https://gist.github.com/jonathanpmartins/2510f38abee1e65c6d92</a>安装，Windows前往<a href="https://download.libsodium.org/libsodium/releases/">https://download.libsodium.org/libsodium/releases/</a>下载<code>libsodium-{version}-msvc.zip</code>文件并解压，复制解压目录中的<code>libsodium.dll</code>至<code>C:\windows\system32</code>目录（注意dll文件是64的还是32的）,其它系统请自行搜索。</p>	
</details>

<details>
  <summary>加密方法、协议、混淆中没有我想设置的选项怎么办？</summary>
  <p>请右击任务栏图标-配置-选项设置...，然后切换到SSR设置选项卡中自行添加，前提是当前使用的ssr要支持这些新增选项。</p>
</details>

<details>
  <summary>我的linux系统提示有新版本升级，但是我点击通知并没有跳转到下载页面？</summary>
  <p>1，建议使用AppImage包。 2，参考<a href="https://github.com/electron/electron/issues/9919">https://github.com/electron/electron/issues/9919</a>&nbsp;以及&nbsp;<a href="https://github.com/electron/electron/issues/8474">https://github.com/electron/electron/issues/8474</a></p>
</details>
