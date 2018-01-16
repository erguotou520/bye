<template>
  <app-view name="setup" class="px-2">
    <i-alert class="my-2" type="info" show-icon>
      <i-icon slot="icon" type="ios-lightbulb-outline" size="32"></i-icon>
      <div slot="desc">
        <p class="mb-1" style="word-break: break-all;"><b>自动模式</b>&nbsp;该模式下系统将自动下载ShadowsocksR项目至
          <span class="text-primary px-2px selectable">{{$store.state.meta.defaultSSRDownloadDir}}</span>
          并完成初始化</p>
        <p><b>本地模式</b>&nbsp;该模式下请选择本地ShadowsocksR项目下的shadowsocks目录。</p>
        <p>如果本地没有该项目可前往<external-link href="https://github.com/shadowsocksr-backup/shadowsocksr/tree/dev"></external-link>下载。</p>
        <b>请确保所选的目录下有<span class="text-primary px-2px selectable">local.py</span>文件</b>
      </div>
    </i-alert>
    <div class="flex flex-1 w-100">
      <div class="pos-r flex-1 h-100 flex flex-column flex-ai-center flex-jc-center">
        <h1>自动模式</h1>
        <i-form class="mt-2">
          <i-form-item class="text-center">
            <i-button v-if="!autoClicked" type="primary" @click="autoStart">点击开始</i-button>
            <i-progress v-else-if="!autoError" :percent="autoPercent" status="active" hide-info style="width:320px"></i-progress>
            <template v-else>
              <i-alert type="error" show-icon style="margin-bottom:0">
                {{autoError}}
              </i-alert>
              <i-button class="mt-2" type="primary" @click="restart">重试</i-button>
            </template>
          </i-form-item>
        </i-form>
      </div>
      <div class="pos-r flex-1 h-100 flex flex-column flex-ai-center flex-jc-center border-1px-l pl-2">
        <h1>本地模式</h1>
        <i-form ref="form" class="mt-2" :model="form" :rules="rules" inline>
          <i-form-item prop="ssrPath">
            <i-input v-model="form.ssrPath" readonly placeholder="请选择shadowsocks目录" style="width:200px"/>
          </i-form-item>
          <i-form-item>
            <i-button type="primary" @click="selectPath">选择ssr目录</i-button>
          </i-form-item>
        </i-form>
      </div>
    </div>
  </app-view>
</template>
<script>
import { ipcRenderer } from 'electron'
import { remote } from 'electron'
import { mapState } from 'vuex'
import { syncConfig } from '../ipc'
import { isSSRPathAvaliable } from '../../shared/utils'
import * as events from '../../shared/events'

const { dialog } = remote.require('electron')
export default {
  data () {
    return {
      view: '',
      // 自动模式是否已点击开始
      autoClicked: false,
      // 自动模式百分比
      autoPercent: 0,
      // 自动模式下载出错
      autoError: '',
      form: {
        ssrPath: ''
      },
      rules: {
        ssrPath: [
          { required: true, message: '请选择shadowsocks目录' },
          { validator: (rule, value, callback) => {
            if (isSSRPathAvaliable(value)) {
              callback()
            } else {
              callback('该目录不正确，请重新选择')
            }
          } }
        ]
      }
    }
  },
  computed: {
    ...mapState(['meta'])
  },
  methods: {
    // 返回当前主页面
    back () {
      this.view = ''
    },
    // 重试
    restart () {
      this.autoPercent = 0
      this.autoStart()
    },
    // 自动模式
    autoStart () {
      this.autoError = ''
      this.autoClicked = true
      const self = this

      function callback (e, err) {
        console.log('download ssr result', e, err)
        ipcRenderer.removeListener(events.EVENT_SSR_DOWNLOAD_MAIN, callback)
        if (err) {
          self.autoError = err.message
        } else {
          self.autoPercent = 100
          self.$nextTick(() => {
            self.setup(self.meta.defaultSSRDownloadDir)
          })
        }
        clearInterval(interval)
      }

      ipcRenderer.send(events.EVENT_SSR_DOWNLOAD_RENDERER)
      ipcRenderer.on(events.EVENT_SSR_DOWNLOAD_MAIN, callback)
      const interval = setInterval(() => {
        // 模拟进度
        this.autoPercent += (Math.random() * ((100 - this.autoPercent) / 5))
      }, 1000)
    },
    // 选择目录
    selectPath () {
      const path = dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      if (path.length) {
        this.form.ssrPath = path[0]
        this.$refs.form.validate(valid => {
          if (valid) {
            this.setup()
          }
        })
      }
    },
    // 完成初始化
    setup (ssrPath) {
      syncConfig({ ssrPath: ssrPath || this.form.ssrPath })
      this.$emit('finished')
    }
  }
}
</script>
<style lang="stylus">
@import '../assets/styles/variable'
.view-setup
  .px-2px
    padding-left 2px
    padding-right @padding-left
  .ivu-progress-inner
    background-color lighten($color-light-primary, 60%)
</style>
