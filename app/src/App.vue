<template>
  <div class="flex" style="width:100%">
    <config-list ref="list" :configs="configs" @add="onAdd" @remove="onRemove" @select="onSelect"></config-list>
    <option-field class="flex-1" ref="option" @config-change="onConfigChange"></option-field>
    <qr-code :link="currentLink" ref="qrcode" @cancel="onCancel" @ok="save"></qr-code>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import Config from './Config'
import ConfigList from './components/ConfigList'
import OptionField from './components/OptionField'
import QrCode from './components/QRCode'
export default {
  data () {
    return {
      configs: [],
      currentConfig: undefined,
      currentLink: ''
    }
  },
  components: {
    ConfigList,
    OptionField,
    QrCode
  },
  watch: {
    configs: {
      deep: true,
      handler (val) {
        ipcRenderer.send('update-configs', val)
      }
    }
  },
  methods: {
    onConfigChange (...args) {
      this.currentConfig = args[0]
      this.currentLink = args[1]
    },
    onAdd () {
      const newConfig = new Config()
      this.onSelect(newConfig)
      this.configs.push(newConfig)
    },
    onSelect (config) {
      this.$refs.option.setConfig(config)
    },
    onRemove (...args) {
      this.configs.splice(this.configs.indexOf(args[0]), 1)
    },
    onCancel () {
      this.$refs.option.reset()
      this.$refs.option.setConfig(this.$refs.list.getSelected())
    },
    save (config) {
      const selected = this.$refs.list.getSelected()
      if (this.currentConfig && this.currentConfig.isValid()) {
        Object.assign(selected, this.currentConfig)
      } else {
        global.alert('服务器配置信息不完整')
      }
    }
  },
  created () {
    ipcRenderer.on('init-configs', (e, configs) => {
      this.configs = configs
    }).on('exec-error', (e, arg) => {
      global.alert(JSON.stringify(arg, null, 2), 'exec error')
    })
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
  outline none
  &:active
    background #ccc
</style>
