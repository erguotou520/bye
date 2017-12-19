<template>
  <div class="flex-1 flex flex-column flex-ai-center flex-jc-center" style="width:520px">
    <i-alert type="info" show-icon>
      选择ShadowsocksR目录
      <i-icon slot="icon" type="ios-lightbulb-outline" size="32"></i-icon>
      <div slot="desc">
        <p class="mb-1">请选择本地ShadowsocksR项目下的shadowsocks目录。如果本地没有该项目可前往<external-link href="https://github.com/shadowsocksr-backup/shadowsocksr/tree/dev"></external-link>下载。</p>
        <b>请确保所选的目录下有<code class="blue">local.py</code>文件</b>
      </div>
    </i-alert>
    <i-form ref="form" class="mt-2" :model="form" :rules="rules" inline>
      <i-form-item prop="ssrPath">
        <i-input v-model="form.ssrPath" readonly placeholder="请选择shadowsocks目录" style="width:360px"/>
      </i-form-item>
      <i-form-item>
        <i-button type="primary" @click="selectPath">...</i-button>
      </i-form-item>
    </i-form>
  </div>
</template>
<script>
import { remote } from 'electron'
import { isSSRPathAvaliable } from '../../shared/utils'
const { dialog } = remote.require('electron')
export default {
  data () {
    return {
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
