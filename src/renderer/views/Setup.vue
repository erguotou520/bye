<template>
  <app-view name="setup">
    <template v-if="!view">
      <h1 class="mb-4">请选择ssr的关联方式</h1>
      <div class="flex">
        <div class="card flex flex-jc-center flex-ai-center font-18" @click="view='auto'">
          自动下载ssr
        </div>
        <div class="card flex flex-jc-center flex-ai-center font-18" @click="view='local'">
          手动选择本地ssr
        </div>
      </div>
    </template>
    <header v-else class="fix-header px-2 flex flex-ai-center">
      <i-icon class="back-icon" type="android-arrow-back" size="24" @click.native="back"></i-icon>
    </header>
    <template v-if="view==='local'">
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
  </app-view>
</template>
<script>
import { remote } from 'electron'
import { isSSRPathAvaliable } from '../../shared/utils'
const { dialog } = remote.require('electron')
export default {
  data () {
    return {
      view: '',
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
<style lang="stylus" scoped>
@import '../assets/styles/variable'
.fix-header
  position fixed
  left 0
  top 0
  width 100%
  height 2.75rem
  .back-icon
    color $color-sub-title
    cursor pointer
    transition color .3s
    &:hover
      color $color-content
.card
  width 16rem
  height @width
  background-color rgba($color-light-primary, .1)
  border 1px solid rgba($color-light-primary, .2)
  border-radius 4px
  cursor pointer
  transition all .3s
  &:hover
    background-color rgba($color-primary, .5)
    border-color rgba($color-primary, .75)
    color #fff
  & + .card
    margin-left 4rem
</style>
