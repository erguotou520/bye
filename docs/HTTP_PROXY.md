# 内置HTTP代理服务

`ss(r)`为我们提供的代理是`socks5`代理，但有些应用并不支持`socks`代理，只支持http代理，这时就是该功能派上用场的时候了。

首先在`菜单`-`配置`-`选项设置`中勾选`http代理`，并确保`http代理端口`的端口值为一个有效可用的数值，然后我们就可以在使用http代理的地方填上我们的代理地址。

以命令行为例，复制下面这段代码即可设置命令行代理

```bash
export http_proxy="http://127.0.0.1:http代理端口"
export https_proxy="http://127.0.0.1:http代理端口"
```

上述代码我们在菜单中提供了一个快捷的菜单`复制http代理设置`。

另外，偷偷的告诉你，如果你在`选项设置`中勾选了`局域网共享`，那么局域网内的小伙伴可以直接使用你共享的代理哦

```bash
export http_proxy="http://your.ip:http代理端口"
export https_proxy="http://your.ip:http代理端口"
```
