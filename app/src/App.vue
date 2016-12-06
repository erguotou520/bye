<template>
  <div class="flex" style="width:100%">
    <config-list ref="list" :configs="configs" @add="$refs.option&&$refs.option.cancel"
      @remove="configs.splice(configs.indexOf(arguments[0]),1)"></config-list>
    <option-field class="flex-1" ref="option" @config-change="onConfigChange"
      @save="save"></option-field>
    <qr-code :link="currentLink" ref="qrcode" @cancel="$refs.option&&$refs.option.cancel()"
      @ok="$refs.option&&$refs.option.save()"></qr-code>
  </div>
</template>
<script>
import ConfigList from './components/ConfigList'
import OptionField from './components/OptionField'
import QrCode from './components/QRCode'
import { getConfigs, saveConfigs } from './storage'
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
  methods: {
    onConfigChange (...args) {
      this.currentConfig = args[0]
      this.currentLink = args[1]
    },
    save (config) {
      const selected = this.$refs.list.getSelected()
      // update selected
      if (selected) {
        Object.assign(selected, config)
      } else {
        if (this.configs.some(conf => conf.host === config.host && conf.port === config.port)) {
          alert('该条记录已存在')
        } else {
          // create new one
          this.configs.push(config)
        }
      }
      saveConfigs(this.configs)
    }
  },
  created () {
    try {
      this.configs = getConfigs() || []
    } catch (e) {
      console.error(e)
    }
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
</style>
