<template>
  <div class="flex" style="width:100%">
    <!-- 配置列表 -->
    <div class="app-config-list flex flex-column">
      <div class="list-wrapper flex-1">
        <ul>
          <li v-for="(c,i) in configs" @click="selectedIndex=i" :class="{selected:selectedIndex===i}">
            {{c.remark||c.host}}（{{c.host}}:{{c.port}}）
          </li>
        </ul>
      </div>
      <div class="buttons flex">
        <button type="button" class="flex-1" @click="onAdd">添加</button>
        <button type="button" class="flex-1" @click="onRemove">删除</button>
      </div>
    </div>

    <!-- 当前配置 -->
    <div class="app-option-field">
      <fieldset>
        <legend>服务器(截图注意打码)</legend>
        <form-item label="* 服务器 IP">
          <input type="text" v-model="tempConfig.host">
        </form-item>
        <form-item label="* 服务器端口">
          <input type="number" v-model="tempConfig.port">
        </form-item>
        <form-item label="本机代理IP">
          <input type="text" v-model="tempConfig.localAddr">
        </form-item>
        <form-item label="本机代理端口">
          <input type="number" v-model="tempConfig.localPort">
        </form-item>
        <form-item>
          <span slot="label">
            <input type="checkbox" v-model="showPassword">* 密码
          </span>
          <input v-if="showPassword" type="text" v-model="tempConfig.password">
          <input v-else type="password" v-model="tempConfig.password">
        </form-item>
        <form-item label="* 加密">
          <select v-model="tempConfig.method">
            <option v-for="method in config.methods" :value="method">{{method}}</option>
          </select>
        </form-item>
        <form-item label="* 协议" warning>
          <select v-model="tempConfig.protocol">
            <option v-for="protocol in config.protocols" :value="protocol">{{protocol}}</option>
          </select>
        </form-item>
        <form-item label="* 混淆" warning>
          <select v-model="tempConfig.obfs" @change="tempConfig.obfsparam=''">
            <option v-for="obfs in config.obfses" :value="obfs">{{obfs}}</option>
          </select>
        </form-item>
        <form-item label="混淆参数" warning>
          <input type="text" v-model="tempConfig.obfsparam">
        </form-item>
        <form-item label="备注">
          <input type="text" v-model="tempConfig.remark">
        </form-item>
        <form-item>
          <span slot="label">
            <input type="checkbox" v-model="isSSR">SSR链接
          </span>
          <input type="text" v-model="link">
        </form-item>
      </fieldset>
    </div>

    <!-- 二维码 -->
    <div class="app-qrcode flex flex-column flex-main-center flex-cross-center">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" :view-box.camel="`0 0 ${svg.size} ${svg.size}`">
        <path :d="svg.path"></path>
      </svg>
      <div class="buttons flex">
        <button type="button" class="flex-1" @click="onCancel">取消</button>
        <button type="button" class="flex-1" @click="onSave">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
import qr from 'qr-image'
import Config from './Config'
import FormItem from './components/FormItem'
export default {
  props: {
    config: Object
  },
  data () {
    return {
      configs: this.config.configs,
      selectedIndex: -1,
      isSSR: true,
      tempConfig: new Config(),
      showPassword: false,
      svg: {
        size: 0,
        path: ''
      }
    }
  },
  computed: {
    selectedConfig () {
      return this.configs[this.selectedIndex]
    },
    link: {
      get () {
        if (this.tempConfig) {
          const link = this.isSSR ? this.tempConfig.getSSRLink() : this.tempConfig.getSSLink()
          if (link) {
            const svgObj = qr.svgObject(link)
            Object.assign(this.svg, svgObj)
          }
          return link
        } else {
          return ''
        }
      },
      set (v) {
        if (this.isSSR) {
          this.tempConfig.setSSRLink(v)
        } else {
          this.tempConfig.setSSLink(v)
        }
      }
    }
  },
  watch: {
    'selectedConfig' (v) {
      Object.assign(this.tempConfig, v || new Config({
        host: '',
        port: '',
        password: '',
        method: '',
        protocol: '',
        obfs: '',
        localAddr: '',
        localPort: ''
      }))
    }
  },
  components: {
    FormItem
  },
  methods: {
    onAdd () {
      const copy = this.configs.slice()
      copy.push(new Config())
      this.updateConfigs(copy)
      this.selectedIndex = copy.length - 1
    },
    onSelect (index) {
      this.selectedIndex = index
    },
    onRemove () {
      const copy = this.configs.slice()
      const targetIndex = this.selectedIndex === this.configs.length - 1 ? this.configs.length - 2 : this.selectedIndex
      copy.splice(this.selectedIndex, 1)
      this.updateConfigs(copy)
      this.selectedIndex = targetIndex
    },
    onCancel () {
      Object.assign(this.tempConfig, this.selectedConfig)
      this.$emit('hide-window')
    },
    onSave () {
      if (!this.selectedConfig) {
        return window.alert('请先选择或创建一个配置')
      }
      if (this.tempConfig.isValid()) {
        const copy = this.configs.slice()
        Object.assign(copy[this.selectedIndex], this.tempConfig)
        this.updateConfigs(copy)
        this.$emit('hide-window')
      } else {
        window.alert('服务器配置信息不完整')
      }
    },
    updateConfigs (newConfigs) {
      this.$emit('update-config', { field: 'configs', value: newConfigs })
      this.configs = newConfigs
    }
  },
  created () {
    if (this.configs.length) {
      this.selectedIndex = 0
    }
  }
}
</script>

<style lang="stylus">
.app-config-list
  width 20rem
  padding 1rem
  overflow hidden
  .list-wrapper
    margin-bottom 4px
    padding 1px
    max-height 290px
    border 1px solid #888
    background #fff
    overflow auto
    > ul
      margin 0
      padding 0
      list-style none
      > li
        display block
        padding 2px 1px
        text-align left
        cursor default
        -webkit-user-select none
        &.selected
          background rgb(51, 153, 255)
          color #fff
  > .buttons
    button
      margin 2px
.app-option-field
  fieldset
    padding .5rem
    text-align left
    border 1px solid #aaa
.app-qrcode
  width 17.5rem
  padding 1rem
  svg
    width 240px
    height @width
    margin-bottom 1rem
  .buttons
    width 100%
  button
    margin 4px
</style>
