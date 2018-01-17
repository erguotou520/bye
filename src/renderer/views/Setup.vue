<template>
  <app-view name="setup" class="px-2">
    <i-spin v-if="!autoError"/>
    <div v-else class="flex flex-column flex-ai-center">
      <i-alert type="error" show-icon>
        {{autoError}}
      </i-alert>
      <i-button type="primary" @click="restart">重试</i-button>
      <br/>OR</br/>
      <i-form ref="form" class="mt-2" :model="form" :rules="rules" inline>
        <i-form-item prop="ssrPath">
          <i-input v-model="form.ssrPath" readonly placeholder="所选目录下需有local.py文件" style="width:200px"/>
        </i-form-item>
        <i-form-item>
          <i-button type="primary" @click="selectPath">选择ssr目录</i-button>
        </i-form-item>
      </i-form>
    </div>
  </app-view>
</template>
<script>
import { ipcRenderer } from 'electron'
import { remote } from 'electron'
import { mapState } from 'vuex'
import { syncConfig } from '../ipc'
import { isSSRPathAvaliable } from '../../shared/utils'
// import { STORE_KEY_AUTO_DOWNLOAD } from '../constants'
import { EVENT_SSR_DOWNLOAD_RENDERER, EVENT_SSR_DOWNLOAD_MAIN } from '../../shared/events'

const { dialog } = remote.require('electron')
export default {
  data () {
    return {
      // localStorage.getItem(STORE_KEY_AUTO_DOWNLOAD) === '1'
      autoDownload: false,
      // view: '',
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
    restart () {
      this.autoError = ''
      this.autoStart()
    },
    // 自动模式
    autoStart () {
      this.autoError = ''
      const self = this

      function callback (e, err) {
        console.log('download ssr result', e, err)
        ipcRenderer.removeListener(EVENT_SSR_DOWNLOAD_MAIN, callback)
        if (err) {
          self.autoError = err.message
        } else {
          self.$nextTick(() => {
            self.setup(self.meta.defaultSSRDownloadDir)
          })
        }
      }

      ipcRenderer.send(EVENT_SSR_DOWNLOAD_RENDERER)
      ipcRenderer.on(EVENT_SSR_DOWNLOAD_MAIN, callback)
    },
    // 选择目录
    selectPath () {
      const path = dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      if (path && path.length) {
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
  },
  created () {
    if (this.autoDownload) {
      this.autoStart()
    }
  }
}
</script>
<style lang="stylus">
@import '../assets/styles/variable'
.view-setup
  .ivu-spin-dot
    width 48px
    height @width
//   .loader
//     width: 30px;
//     height: 30px;
//     position: relative;
//     margin: 0 auto;
//     svg
//       animation: rotate 2s linear infinite;
//       height: 100%;
//       -webkit-transform-origin: center center;
//       transform-origin: center center;
//       width: 100%;
//       position: absolute;
//       top: 0;
//       bottom: 0;
//       left: 0;
//       right: 0;
//       margin: auto;
//       circle
//         stroke-dasharray: 1,200;
//         stroke-dashoffset: 0;
//         -webkit-animation: dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;
//         animation: dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;
//         stroke-linecap: round;
//   @keyframes rotate {
//     to {
//       -webkit-transform: rotate(1turn);
//       transform: rotate(1turn)
//     }
//   }
//   @keyframes dash {
//     0% {
//       stroke-dasharray: 1,200;
//       stroke-dashoffset: 0
//     }
//
//     50% {
//       stroke-dasharray: 89,200;
//       stroke-dashoffset: -35
//     }
//
//     to {
//       stroke-dasharray: 89,200;
//       stroke-dashoffset: -124
//     }
//   }
//   @keyframes color {
//     0%,to {
//       stroke: #d62d20
//     }
//
//     40% {
//       stroke: #0057e7
//     }
//
//     66% {
//       stroke: #008744
//     }
//
//     80%,90% {
//       stroke: #ffa700
//     }
//   }
</style>
