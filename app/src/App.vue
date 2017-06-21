<template>
  <component :is="currentView" :config="config"
    @update-config="updateConfig"
    @complete-init="onCompleteInit"
    @hide-window="onHideWindow"></component>
</template>
<script>
import { shell, ipcRenderer } from 'electron'
import Homepage from './Homepage.vue'
import Initialzation from './Initialzation.vue'
import fullscreenScreenshot from './scan-qrcode'
import Config from './Config'
export default {
  data () {
    return {
      currentView: '',
      config: null,
      inited: false
    }
  },
  components: {
    Homepage, Initialzation
  },
  methods: {
    onCompleteInit () {
      this.currentView = 'homepage'
      ipcRenderer.send('resize', 880, 420)
    },
    updateConfig ({ field, value }) {
      ipcRenderer.send('update-config', field, value)
      if (this.config) {
        this.config[field] = value
      }
    },
    onHideWindow () {
      ipcRenderer.send('hide-window')
    }
  },
  created () {
    ipcRenderer.on('init-config', (e, config) => {
      this.inited = true
      this.config = config
      if (!config.pyPath) {
        // not initialized
        this.currentView = 'initialzation'
        ipcRenderer.send('resize', 640, 480)
      } else {
        this.currentView = 'homepage'
      }
    }).on('take-screencapture', (e) => {
      fullscreenScreenshot((err, data) => {
        if (!err) {
          if (/^ssr?:\/\//.test(data)) {
            const newConfig = new Config()
            if (/^ss:\/\//.test(data)) {
              newConfig.setSSLink(data)
            } else {
              newConfig.setSSRLink(data)
            }
            ipcRenderer.send('scaned-config', newConfig)
            if (this.config && this.config.configs) {
              this.config.configs.push(newConfig)
              new Notification('扫码成功', {
                body: `已成功添加新配置`
              }).onclick = () => {
                ipcRenderer.send('open-window')
              }
            }
          } else {
            new Notification('扫码失败', {
              body: `不能识别的二维码`
            })
          }
        } else {
          new Notification('扫码失败', {
            body: `未找到相关二维码`
          })
        }
      })
    }).on('new-version', (e, oldVersion, newVersion) => {
      new Notification('New version avaliable.', {
        body: `New version v${newVersion}, click to download`
      }).onclick = () => {
        shell.openExternal('https://github.com/erguotou520/electron-ssr/releases')
      }
    }).on('exec-error', (e, arg) => {
      global.alert(JSON.stringify(arg, null, 2), 'exec error')
    })
    setTimeout(() => {
      if (!this.inited) {
        ipcRenderer.send('re-init')
      }
    }, 2000)
  }
}
</script>
<style lang="stylus">
@import "./assets/flex"
*
  box-sizing border-box
html
body
  height 100%
body
  display flex
  align-items center
  justify-content center
  text-align center
  margin 0
  padding 0
  font-family "Helvetica Neue", Helvetica, Tahoma, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "微软雅黑", "WenQuanYi Micro Hei", Arial, sans-serif
  font-size 12px
  background-color #f0f0f0
  overflow hidden

input[type=checkbox]
  margin 0
  margin-right .5rem
button
  padding 0
  height 2rem
  line-height @height
  background #e1e1e1
  border 1px solid #aaa
  font-family "Helvetica Neue", Helvetica, Tahoma, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "微软雅黑", "WenQuanYi Micro Hei", Arial, sans-serif
  outline none
  &:active
    background #ccc
</style>
