<template>
  <div class="app-option-field">
    <fieldset>
      <legend>服务器(截图注意打码)</legend>
      <form-item label="* 服务器 IP">
        <input type="text" v-model="form.host">
      </form-item>
      <form-item label="* 服务器端口">
        <input type="number" v-model="form.port">
      </form-item>
      <form-item label="本机代理IP">
        <input type="text" v-model="form.localAddr">
      </form-item>
      <form-item label="本机代理端口">
        <input type="number" v-model="form.localPort">
      </form-item>
      <form-item>
        <span slot="label">
          <input type="checkbox" v-model="showPassword">* 密码
        </span>
        <input v-if="showPassword" type="text" v-model="form.password">
        <input v-else type="password" v-model="form.password">
      </form-item>
      <form-item label="* 加密">
        <select v-model="form.method">
          <option v-for="method in methods" :value="method">{{method}}</option>
        </select>
      </form-item>
      <form-item label="* 协议">
        <select v-model="form.protocol">
          <option v-for="protocol in protocols" :value="protocol">{{protocol}}</option>
        </select>
      </form-item>
      <form-item label="* 混淆">
        <select v-model="form.obfs" @change="form.obfsparam=''">
          <option v-for="obfs in obfses" :value="obfs">{{obfs}}</option>
        </select>
      </form-item>
      <form-item label="混淆参数">
        <input type="text" v-model="form.obfsparam" :disabled="form.obfs!=='http_simple'">
      </form-item>
      <form-item label="备注">
        <input type="text" v-model="form.remark">
      </form-item>
      <form-item>
        <span slot="label">
          <input type="checkbox" v-model="isSSRLink">SSR链接
        </span>
        <input v-show="isSSRLink" type="text" v-model="ssrLink">
        <input v-show="!isSSRLink" type="text" v-model="ssLink">
      </form-item>
      <!-- <form-item label="高级选项">
        <span>以下选项不是所有服务端都支持</span>
      </form-item>
      <form-item label="TCP over UDP">
        <span><input type="checkbox" v-model="form.udpport" :true-value="1" :false-value="0">不打勾使用原生 TCP</span>
      </form-item>
      <form-item label="UDP over TCP">
        <span><input type="checkbox" v-model="form.uot" :true-value="1" :false-value="0">不打勾使用原生 UDP</span>
      </form-item> -->
    </fieldset>
  </div>
</template>
<script>
import Config from '../Config'
import FormItem from './FormItem'
import { clone } from '../util'
export default {
  data () {
    return {
      form: new Config(),
      bak: undefined,
      showPassword: false,
      isSSRLink: true,
      methods: ['aes-128-cfb', 'aes-192-cfb', 'aes-256-cfb', 'aes-128-cfb8', 'aes-192-cfb8', 'aes-256-cfb8',
        'aes-128-ctr', 'aes-192-ctr', 'aes-256-ctr', 'camellia-128-cfb', 'camellia-192-cfb', 'camellia-256-cfb',
         'bf-cfb', 'rc4', 'rc4-md5', 'rc4-md5-6', 'salsa20', 'chacha20', 'chacha20-ietf'
      ],
      protocols: ['origin', 'verify_deflate', 'verify_sha1', 'auth_sha1_v2',
        'auth_sha1_v4', 'auth_aes128_md5', 'auth_aes128_sha1'
      ],
      obfses: ['plain', 'http_simple', 'http_post', 'ramdom_head', 'tls1.2_ticket_auth']
    }
  },
  computed: {
    ssrLink: {
      get () {
        const link = this.form.getSSRLink()
        this.$emit('config-change', this.form, link)
        return link
      },
      set (val) {
        this.form.setSSRLink(val)
      }
    },
    ssLink: {
      get () {
        const link = this.form.getSSLink()
        this.$emit('config-change', this.form, link)
        return link
      },
      set (val) {
        this.form.setSSLink(val)
      }
    }
  },
  components: {
    FormItem
  },
  methods: {
    reset () {
      Object.assign(this.form, this.bak)
    },
    setConfig (config) {
      Object.assign(this.form, config)
    }
  },
  created () {
    this.bak = clone(this.form)
  }
}
</script>
<style lang="stylus">
.app-option-field
  fieldset
    padding .5rem
    text-align left
    border 1px solid #aaa
</style>
