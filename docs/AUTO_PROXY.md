# Windows
`windows`使用[shadowsocks-windows](https://github.com/shadowsocks/shadowsocks-windows)中提供的`sysproxy.exe`来切换代理
```bash
# pac代理
sysproxy.exe pac http://127.0.0.1:7777/pac

# 全局代理
sysproxy.exe global 127.0.0.1:1080

# 关闭代理
sysproxy.exe pac ""
```

# Mac
```bash
# pac代理
sudo networksetup -setautoproxyurl Wi-Fi http://127.0.0.1:7777/pac
# 关闭pac代理
sudo networksetup -setautoproxystate Wi-Fi off

# web代理
sudo networksetup -setwebproxy Wi-Fi 127.0.0.1 1080 off
# 关闭web代理
sudo networksetup -setwebproxystate Wi-Fi off

# socks代理
sudo networksetup -setsocksfirewallproxy Wi-Fi 127.0.0.1 1080 off
# 关闭socks代理
sudo networksetup -setsocksfirewallproxystate Wi-Fi off

# 列出所有网络连接及对应硬件
sudo networksetup -listallhardwareports
# 查看当前连接是否活跃
ifconfig en0
# 鉴于每次执行networksetup都需要sudo权限（不带sudo）会不停的弹出密码询问框，所以改用ShadowsocksX-NG的编译文件proxy_conf_helper
# 安装参考https://github.com/shadowsocks/ShadowsocksX-NG/blob/develop/ShadowsocksX-NG/install_helper.sh
# pac代理
proxy_conf_helper -m auto -u http://127.0.0.1:7777/pac
# socks代理
proxy_conf_helper -m global -p 1080
# 关闭代理
proxy_conf_helper -m off
```

# Linux
- gnome桌面系统使用`gsettings`
  ```bash
  # 加sudo适用于整个系统范围 不加只作用于当前用户

  # socks代理
  gsettings set org.gnome.system.proxy mode 'manual'
  gsettings set org.gnome.system.proxy.socks host '127.0.0.1'
  gsettings set org.gnome.system.proxy.socks port 1080

  # web代理
  gsettings set org.gnome.system.proxy mode 'manual'
  gsettings set org.gnome.system.proxy.http host '127.0.0.1'
  gsettings set org.gnome.system.proxy.http port 1080

  # pac
  gsettings set org.gnome.system.proxy mode 'auto'
  gsettings set org.gnome.system.proxy autoconfig-url http://my.proxy.com/autoproxy.pac

  # 清空
  gsettings set org.gnome.system.proxy mode 'none'
  ```

# pac文件更新地址
[https://softs.fun/Other/pac.txt](https://softs.fun/Other/pac.txt)
