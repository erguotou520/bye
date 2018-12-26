<template>
  <app-view name="feature">
    <h1>Electron SSR客户端</h1>
    <i-row type="flex" :gutter="24" class="mt-64">
      <i-col class="col flex flex-column flex-ai-center flex-jc-center">
        <icon-cross/>
        <b class="font-18 my-1">跨平台</b>
        <p>支持Windows、MacOs、Linux系统</p>
      </i-col>
      <i-col class="col flex flex-column flex-ai-center flex-jc-center">
        <icon-functions/>
        <b class="font-18 my-1">功能齐全</b>
        <p>支持多种实用功能</p>
      </i-col>
      <i-col class="col flex flex-column flex-ai-center flex-jc-center">
        <icon-open/>
        <b class="font-18 my-1">开源</b>
        <p>ssr和electron-ssr源代码均开放</p>
      </i-col>
    </i-row>
    <div class="flex flex-ai-center mt-64">
      <i-checkbox v-model="autoDownload" @on-change="updateAutoDownload">自动下载SSR</i-checkbox>
      <i-tooltip placement="top" content="勾选上后将自动下载python ssr" style="margin-top:2px">
        <i-icon color="#495060" type="help-circled"></i-icon>
      </i-tooltip>
    </div>
    <i-button type="primary" class="w-6r mt-1" @click="done">知道了</i-button>
  </app-view>
</template>
<script>
import IconCross from '../assets/icon_cross_platform.svg'
import IconFunctions from '../assets/icon_functions.svg'
import IconOpen from '../assets/icon_open_source.svg'
import { STORE_KEY_FEATURE, STORE_KEY_AUTO_DOWNLOAD } from '../constants'
export default {
  data () {
    return {
      autoDownload: true
    }
  },
  components: {
    IconCross, IconFunctions, IconOpen
  },
  methods: {
    updateAutoDownload (v) {
      localStorage.setItem(STORE_KEY_AUTO_DOWNLOAD, v ? '1' : '0')
    },
    done () {
      localStorage.setItem(STORE_KEY_FEATURE, 'read')
      this.$emit('finished')
    }
  },
  created () {
    this.updateAutoDownload(true)
  }
}
</script>
<style lang="stylus">
@import '../assets/styles/variable.styl'
.view-feature
  .mt-64
    margin-top 64px
  .col
    width 240px
  svg
    width 40px
    height 40px
    > path
      fill $color-primary
</style>
