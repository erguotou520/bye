<template>
  <app-view name="options" class="bg-white">
    <i-tabs class="flex-1" :value="view.tab" @on-click="name => updateView({ tab: name })">
      <i-tab-pane label="通用设置" name="common">
        123
      </i-tab-pane>
      <i-tab-pane label="SSR设置" name="ssr">
        <div class="options-container px-2 pb-2 scroll-y">
          <i-alert type="info" closable>双击可修改，修改后回车可保存，esc可取消修改。</i-alert>
          <fieldset class="px-1 py-1">
            <legend class="ml-1">SSR加密方法</legend>
            <edit-tag v-for="method in methods" :key="method" :name="methods"
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
import { mapState, mapMutations } from 'vuex'
import { hideWindow } from '../ipc'
import EditTag from '../components/EditTag'
export default {
  data () {
    return {
      method: '',
      protocol: '',
      obfs: ''
    }
  },
  components: {
    EditTag
  },
  computed: {
    ...mapState(['view', 'methods', 'protocols', 'obfses'])
  },
  methods: {
    ...mapMutations(['resetState', 'updateView', 'updateMethods', 'updateProtocols', 'updateObfses']),
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
