<template>
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
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import EditTag from '../../components/EditTag'
import { STORE_KEY_SSR_TIP } from '../../constants'
const ls = window.localStorage
export default {
  data () {
    return {
      showTip: !ls.getItem(STORE_KEY_SSR_TIP),
      method: '',
      protocol: '',
      obfs: ''
    }
  },
  computed: {
    ...mapState(['methods', 'protocols', 'obfses'])
  },
  components: {
    EditTag
  },
  methods: {
    ...mapMutations(['updateView', 'updateMethods', 'updateProtocols', 'updateObfses']),
    closeTip () {
      ls.setItem(STORE_KEY_SSR_TIP, true)
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
    }
  }
}
</script>
