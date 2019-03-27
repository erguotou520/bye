<template>
  <div class="options-container px-2 pb-2 scroll-y">
    <i-form ref="form" class="mt-1" :model="form" :rules="rules" :label-width="120">
      <i-form-item prop="ssrPath" label="ssr python目录">
        <i-input v-model="form.ssrPath" placeholder="请选择shadowsocks目录" @on-change="changeSSRPath" style="width:200px"/>
        <i-button type="primary" @click="selectPath">选择ssr目录</i-button>
      </i-form-item>
      <div class="flex">
        <i-form-item class="flex-1" label="开机自启动">
          <i-checkbox v-model="form.autoLaunch" @on-change="update('autoLaunch')"/>
        </i-form-item>
        <i-form-item class="flex-1" label="局域网共享">
          <i-checkbox v-model="form.shareOverLan" @on-change="update('shareOverLan')"/>
        </i-form-item>
        <i-form-item class="flex-1" label="http代理">
          <i-checkbox v-model="form.httpProxyEnable" @on-change="update('httpProxyEnable')"/>
        </i-form-item>
      </div>
      <div class="flex">
        <i-form-item class="flex-1" label="pac端口">
          <i-input-number v-model="form.pacPort" :min="0" :max="65535" @on-change="update('pacPort')"/>
        </i-form-item>
        <i-form-item class="flex-1" label="本地监听端口">
          <i-input-number v-model="form.localPort" :min="0" :max="65535" @on-change="update('localPort')"/>
        </i-form-item>
        <i-form-item class="flex-1" label="http代理端口">
          <i-input-number v-model="form.httpProxyPort" :min="0" :max="65535" @on-change="update('httpProxyPort')"/>
        </i-form-item>
      </div>
    </i-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { isSSRPathAvaliable, debounce } from '../../../shared/utils'
import { openDialog } from '../../ipc'
export default {
  data () {
    const appConfig = this.$store.state.appConfig
    return {
      form: {
        ssrPath: appConfig.ssrPath,
        autoLaunch: appConfig.autoLaunch,
        shareOverLan: appConfig.shareOverLan,
        localPort: appConfig.localPort,
        pacPort: appConfig.pacPort,
        httpProxyEnable: appConfig.httpProxyEnable,
        httpProxyPort: appConfig.httpProxyPort
      },
      rules: {
        ssrPath: [
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
  watch: {
    'appConfig.ssrPath' (v) {
      this.ssrPath = v
    },
    'appConfig.autoLaunch' (v) {
      this.autoLaunch = v
    },
    'appConfig.shareOverLan' (v) {
      this.shareOverLan = v
    },
    'appConfig.localPort' (v) {
      this.localPort = v
    },
    'appConfig.pacPort' (v) {
      this.pacPort = v
    }
  },
  methods: {
    ...mapActions(['updateConfig']),
    changeSSRPath () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.updateConfig({ ssrPath: this.form.ssrPath })
        }
      })
    },
    // 选择目录
    selectPath () {
      const path = openDialog({
        properties: ['openDirectory']
      })
      if (path && path.length) {
        this.form.ssrPath = path[0]
        this.$refs.form.validate(valid => {
          if (valid) {
            this.updateConfig({ ssrPath: this.form.ssrPath })
          }
        })
      }
    },
    update: debounce(function (field) {
      if (this.form[field] !== this.$store.state.appConfig[field]) {
        this.updateConfig({ [field]: this.form[field] })
      }
    }, 1000)
  }
}
</script>
