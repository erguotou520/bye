<template>
  <app-view name="options" class="bg-white">
    <i-tabs class="flex-1 w-100" :value="view.tab" @on-click="name => updateView({ tab: name })">
      <i-tab-pane label="通用设置" name="common">
        <div class="options-container px-2 pb-2 scroll-y">
          <i-form ref="form" class="mt-2" :model="form" :rules="rules" :label-width="120">
            <i-form-item prop="ssrPath" label="SSR python目录">
              <i-input v-model="form.ssrPath" readonly placeholder="请选择shadowsocks目录" style="width:200px"/>
              <i-button type="primary" @click="selectPath">选择ssr目录</i-button>
            </i-form-item>
            <i-form-item label="开机自启动">
              <i-checkbox v-model="form.autoLaunch"/>
            </i-form-item>
            <i-form-item label="局域网共享">
              <i-checkbox v-model="form.shareOverlan"/>
            </i-form-item>
            <i-form-item label="本地监听端口">
              <i-input-number v-model="form.localPort" :min="0" :max="65535" />
            </i-form-item>
            <i-form-item label="pac端口">
              <i-input-number v-model="form.pacPort" :min="0" :max="65535" />
            </i-form-item>
          </i-form>
        </div>
      </i-tab-pane>
      <i-tab-pane label="SSR设置" name="ssr">
        <div class="options-container px-2 pb-2 scroll-y">
          <i-alert v-if="showTip" type="info" closable @on-close="closeTip">双击可修改，修改后回车可保存，esc可取消修改。</i-alert>
          <fieldset class="px-1 py-1">
            <legend class="ml-1">SSR加密方法</legend>
            <edit-tag v-for="method in methods" :key="method" :name="method"
              @on-close="removeMethod" @on-update="v => updateMethod(method, v)"></edit-tag>
            <i-input v-model="method" class="create-input" placeholder="输入后回车可新增" size="small" @keyup.enter.native="addMethod" icon="plus"/>
          </fieldset>
          <fieldset class="mt-2 px-1 py-1">
            <legend class="ml-1">SSR协议</legend>
            <edit-tag v-for="protocol in protocols" :key="protocol" :name="protocol"
              @on-close="removeProtocol" @on-update="v => updateProtocol(protocol, v)"></edit-tag>
            <i-input v-model="protocol" class="create-input" placeholder="输入后回车可新增" size="small" @keyup.enter.native="addProtocol" icon="plus"/>
          </fieldset>
          <fieldset class="mt-2 px-1 py-1">
            <legend class="ml-1">SSR混淆</legend>
            <edit-tag v-for="obfs in obfses" :key="obfs" :name="obfs"
              @on-close="removeObfs" @on-update="v => updateObfs(obfs, v)"></edit-tag>
            <i-input v-model="obfs" class="create-input" placeholder="输入后回车可新增" size="small" @keyup.enter.native="addObfs" icon="plus"/>
          </fieldset>
        </div>
      </i-tab-pane>
      <i-tab-pane label="订阅管理" name="subscribes">
        345
      </i-tab-pane>
    </i-tabs>
    <div class="w-100 flex flex-jc-end px-2 py-1 border-1px-t">
      <i-button class="w-6r mr-2" @click="$emit('back')">返回</i-button>
      <i-button class="w-6r" type="primary" @click="done">完成</i-button>
    </div>
  </app-view>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { remote } from 'electron'
import { hideWindow } from '../ipc'
import { STORE_KEY_SSR_TIP } from '../constants'
import EditTag from '../components/EditTag'
import { isSSRPathAvaliable } from '../../shared/utils'

const { dialog } = remote.require('electron')
const ls = window.localStorage
export default {
  data () {
    const appConfig = this.$store.state.appConfig
    return {
      form: {
        ssrPath: appConfig.ssrPath,
        autoLaunch: appConfig.autoLaunch,
        shareOverlan: appConfig.shareOverlan,
        localPort: appConfig.localPort,
        pacPort: appConfig.pacPort
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
      },
      showTip: !ls.getItem(STORE_KEY_SSR_TIP),
      method: '',
      protocol: '',
      obfs: ''
    }
  },
  components: {
    EditTag
  },
  computed: {
    ...mapState(['appConfig', 'view', 'methods', 'protocols', 'obfses'])
  },
  watch: {
    'appConfig.ssrPath' (v) {
      this.ssrPath = v
    },
    'appConfig.autoLaunch' (v) {
      this.autoLaunch = v
    },
    'appConfig.shareOverlan' (v) {
      this.shareOverlan = v
    },
    'appConfig.localPort' (v) {
      this.localPort = v
    },
    'appConfig.pacPort' (v) {
      this.pacPort = v
    }
  },
  methods: {
    ...mapMutations(['resetState', 'updateView', 'updateMethods', 'updateProtocols', 'updateObfses']),
    ...mapActions(['updateConfig']),
    closeTip () {
      ls.setItem(STORE_KEY_SSR_TIP, true)
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
            this.updateConfig({ ssrPath: this.form.ssrPath })
          }
        })
      }
    },

    addMethod () {
      if (this.method) {
        const clone = this.methods.slice()
        clone.push(this.method)
        this.updateMethods(clone)
        this.method = ''
      }
    },
    addProtocol () {
      if (this.protocol) {
        const clone = this.protocols.slice()
        clone.push(this.protocol)
        this.updateProtocols(clone)
        this.protocol = ''
      }
    },
    addObfs () {
      if (this.obfs) {
        const clone = this.obfses.slice()
        clone.push(this.obfs)
        this.updateObfses(clone)
        this.obfs = ''
      }
    },
    updateMethod (method, newVal) {
      const clone = this.methods.slice()
      const index = clone.indexOf(method)
      clone.splice(index, 1)
      clone.splice(index, 0, newVal)
      this.updateMethods(clone)
    },
    updateProtocol (protocol, newVal) {
      const clone = this.protocols.slice()
      const index = clone.indexOf(protocol)
      clone.splice(index, 1)
      clone.splice(index, 0, newVal)
      this.updateProtocols(clone)
    },
    updateObfs (obfs, newVal) {
      const clone = this.obfses.slice()
      const index = clone.indexOf(obfs)
      clone.splice(index, 1)
      clone.splice(index, 0, newVal)
      this.updateObfses(clone)
    },
    removeMethod (name) {
      const clone = this.methods.slice()
      clone.splice(clone.indexOf(name), 1)
      this.updateMethods(clone)
    },
    removeProtocol (name) {
      const clone = this.protocols.slice()
      clone.splice(clone.indexOf(name), 1)
      this.updateProtocols(clone)
    },
    removeObfs (name) {
      const clone = this.obfses.slice()
      clone.splice(clone.indexOf(name), 1)
      this.updateObfses(clone)
    },
    done () {
      this.resetState()
      hideWindow()
    }
  }
}
</script>
<style lang="stylus">
.view-options
  .create-input
    width 8.75rem
  .options-container
    height calc(100vh - 102px)
</style>
