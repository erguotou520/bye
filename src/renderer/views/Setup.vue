<template>
  <!-- <app-view name="setup">
    <h1 class="mb-4">请选择ssr的关联方式</h1>
    <div class="flex">
      <setup-card v-if="view!=='local'" @clicked="view='auto'" @back="view=''">
        <span>自动下载ssr</span>
        <template slot="detail">
          <template v-if="!autoClicked">
            <i-alert type="info" show-icon>
              <i-icon slot="icon" type="ios-lightbulb-outline" size="32"></i-icon>
              <div slot="desc">
                <p>系统将会自动下载ShadowsocksR项目至指定位置并完成初始化</p>
              </div>
            </i-alert>
            <i-button class="mt-2" type="primary" @click="autoStart">点击开始</i-button>
          </template>
          <i-circle v-else :persent="autoPercent">
            <span v-if="autoPercent<100" class="font-24">{{autoPercent}}%</span>
            <span v-else type="ios-checkmark-empty" size="60" style="color:#5cb85c"></span>
          </i-circle>
        </template>
      </setup-card>
      <setup-card v-if="view!=='auto'" @clicked="view='local'" @back="view=''">
        <span>手动选择本地ssr</span>
        <template slot="detail">
          <i-alert type="info" show-icon>
            <i-icon slot="icon" type="ios-lightbulb-outline" size="32"></i-icon>
            <div slot="desc">
              <p>请选择本地ShadowsocksR项目下的shadowsocks目录。</p>
              <p class="mb-1">如果本地没有该项目可前往<external-link href="https://github.com/shadowsocksr-backup/shadowsocksr/tree/dev"></external-link>下载。</p>
              <b>请确保所选的目录下有<code class="blue">local.py</code>文件</b>
            </div>
          </i-alert>
          <i-form ref="form" class="mt-2" :model="form" :rules="rules" inline>
            <i-form-item prop="ssrPath">
              <i-input v-model="form.ssrPath" readonly placeholder="请选择shadowsocks目录" style="width:360px"/>
            </i-form-item>
            <i-form-item>
              <i-button type="primary" @click="selectPath">选择ssr目录</i-button>
            </i-form-item>
          </i-form>
        </template>
      </setup-card>
    </div>
  </app-view> -->
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
              <i-button class="mt-2" type="primary" @click="autoStart">重试</i-button>
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
  methods: {
    // 返回当前主页面
    back () {
      this.view = ''
    },
    // 自动模式
    autoStart () {
      this.autoError = ''
      this.autoClicked = true
      const self = this

      function callback (e, err) {
        console.log('download ssr result', err)
        ipcRenderer.removeListener(events.EVENT_SSR_DOWNLOAD_MAIN, callback)
        if (err) {
          self.autoError = err.message
        } else {
          self.autoPercent = 100
          self.$nextTick(() => {
            self.setup()
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
        this.$nextTick(() => {
          this.setup()
        })
      }
    },
    // 完成初始化
    setup () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('finished', { ssrPath: this.form.ssrPath })
        }
      })
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
  // > div
  //   &::before
  //     content ''
  //     position absolute
  //     left 0
  //     top 0
  //     width 100%
  //     height 100%
  //     background-color rgba(0, 0, 0, .3)
  //     z-index 2
  //     transition all .3s
  //   &:hover
  //     &::before
  //       background-color transparent
  //       z-index -1
</style>
