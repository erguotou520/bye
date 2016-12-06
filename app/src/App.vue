<template>
  <div class="flex" style="width:100%">
    <config-list :configs="configs"></config-list>
    <option-field class="flex-1" @config-change="onConfigChange"></option-field>
    <qr-code :link="currentLink"></qr-code>
  </div>
</template>
<script>
import ConfigList from './components/ConfigList'
import OptionField from './components/OptionField'
import QrCode from './components/QRCode'
import { getConfigs } from './storage'
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
      console.log(this.currentLink)
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
  height 2rem
  line-height @height
  background #e1e1e1
  border 1px solid #aaa
</style>
