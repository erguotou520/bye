<template>
  <div style="max-height:420px;overflow:auto;">
    <div class="form-control">
      <label>请选择shadowsocksr/shadowsocks的目录，如本地没有该目录，请前往<a href @click.prevent="toDownload">https://github.com/shadowsocksr/shadowsocksr</a>下载。请确保该目录下有local.py</label>
      <div class="flex flex-row" style="margin-left:6px">
        <input class="py-path" :value="selectedPath" readonly>
        <span class="select" @click="selectPath">...</span>
      </div>
    </div>
    <div class="form-control">
      <label>加密方法（点击+号后输入内容后回车可添加新方法，下同）</label>
      <tags :value="config.methods" @input="v=>updateConfig('methods',v)"></tags>
    </div>
    <div class="form-control">
      <label>协议</label>
      <tags :value="config.protocols" @input="v=>updateConfig('protocols',v)"></tags>
    </div>
    <div class="form-control">
      <label>混淆协议</label>
      <tags :value="config.obfses" @input="v=>updateConfig('obfses',v)"></tags>
    </div>
    <div class="form-control" style="text-align:center">
      <button @click="save" :disabled="!config.pyPath">保存</button>
    </div>
  </div>
</template>
<script>
import Tags from './components/Tags.vue'
const { shell, remote, ipcRenderer } = require('electron')
const { dialog } = remote.require('electron')
export default {
  props: {
    config: Object
  },
  data () {
    return {
      selectedPath: ''
    }
  },
  components: {
    Tags
  },
  methods: {
    selectPath () {
      const path = dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      if (path.length) {
        if (ipcRenderer.sendSync('set-py-path', path[0])) {
          this.selectedPath = path[0]
          this.updateConfig('pyPath', path[0])
        } else {
          window.alert('shadowsocksr的目录不正确，请重新选择')
        }
      }
    },
    updateConfig (field, value) {
      this.$emit('update-config', { field, value })
    },
    save () {
      if (this.config.pyPath) {
        this.$emit('complete-init')
      }
    },
    toDownload () {
      shell.openExternal('https://github.com/shadowsocksr/shadowsocksr', false)
    }
  }
}
</script>
<style lang="stylus" scoped>
.py-path
.select
  height 24px
  padding 0 6px
  line-height @height
  border none
  border-radius 2px
.py-path
  width 240px
  background-color #c8c8c8
.select
  width 28px
  margin-left 6px
  font-size 16px
  background-color #41b883
  color #fff
  cursor pointer
.form-control
  margin-bottom 12px
  padding 0 12px
  text-align left
  > label
    display block
    margin-bottom 4px
    padding-left 6px
  > input
    width 100%
button
  width 240px
  height 36px
  line-height @height
  text-align center
  background-color #b84176
  color #fff
  border none
  border-radius 2px
  cursor pointer
  &:hover
    background-color #c25183
  &:active
    background-color #a53a6a
</style>
