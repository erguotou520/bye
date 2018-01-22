<template>
  <i-form class="panel-form" ref="form" :model="editingConfig" :rules="rules" :label-width="88">
    <i-form-item label="服务器地址" prop="server">
      <i-input type="text" :value="editingConfig.server" @input="v=>onInput('server', v)"/>
    </i-form-item>
    <i-form-item label="服务器端口" prop="server_port">
      <i-input-number :value="editingConfig.server_port" @input="v=>onInput('server_port', v)" :min="0" :max="65535"/>
    </i-form-item>
    <i-form-item prop="password">
      <span slot="label">
        <i-checkbox v-model="passwordVisiable" style="margin-right:0">密码</i-checkbox>
      </span>
      <i-input :type="passwordVisiable ? 'text' : 'password'" :value="editingConfig.password" @input="v=>onInput('password', v)"/>
    </i-form-item>
    <i-form-item label="加密方式" prop="method">
      <i-select :value="editingConfig.method" @input="v=>onInput('method', v)">
        <i-option v-for="method in methods" :key="method" :value="method">{{method}}</i-option>
      </i-select>
    </i-form-item>
    <i-form-item label="协议" prop="protocol">
      <i-select :value="editingConfig.protocol" @input="v=>onInput('protocol', v)">
        <i-option v-for="protocol in protocols" :key="protocol" :value="protocol">{{protocol}}</i-option>
      </i-select>
    </i-form-item>
    <i-form-item label="协议参数">
      <i-input :value="editingConfig.protocolparam" @input="v=>onInput('protocolparam', v)"/>
    </i-form-item>
    <i-form-item label="混淆" prop="obfs">
      <i-select :value="editingConfig.obfs" @input="v=>onInput('obfs', v)" @on-change="onObfsChange">
        <i-option v-for="obfs in obfses" :key="obfs" :value="obfs">{{obfs}}</i-option>
      </i-select>
    </i-form-item>
    <i-form-item label="混淆参数">
      <i-input :disabled="editingConfig.obfs==='plain'" :value="editingConfig.obfsparam" @input="v=>onInput('obfsparam', v)"/>
    </i-form-item>
    <i-form-item label="备注">
      <i-input :value="editingConfig.remarks" @input="v=>onInput('remarks', v)"/>
    </i-form-item>
    <i-form-item label="分组">
      <i-auto-complete :data="filteredGroups" clearable placeholder="未分组" placement="top"
        :value="editingConfig.group" @input="v=>onInput('group', v)"/>
    </i-form-item>
  </i-form>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      rules: {
        server: { required: true },
        server_port: { required: true },
        password: { required: true },
        method: { required: true },
        protocol: { required: true },
        obfs: { required: true }
      },
      passwordVisiable: false,
      groupText: ''
    }
  },
  computed: {
    ...mapState(['appConfig', 'editingConfig', 'methods', 'protocols', 'obfses']),
    groups () {
      if (this.appConfig && this.appConfig.configs && this.appConfig.configs.length) {
        const groups = []
        this.appConfig.configs.forEach(config => {
          if (config.group) {
            if (groups.indexOf(config.group) < 0) {
              groups.push(config.group)
            }
          }
        })
        return groups
      } else {
        return []
      }
    },
    filteredGroups () {
      if (!this.editingConfig.group) {
        return this.groups
      }
      return this.groups.filter(item => item.indexOf(this.editingConfig.group) > -1)
    }
  },
  methods: {
    onInput (field, v) {
      this.$store.commit('updateEditing', { [field]: v })
    },
    onObfsChange (v) {
      this.onInput('obfs', v)
      if (v === 'plain') {
        this.onInput('obfsparam', '')
      }
    }
  }
}
</script>
<style lang="stylus">
.panel-form
  .ivu-form-item
    margin-bottom 4px
  .ivu-input-number
    width 100%
  .ivu-select-dropdown
    max-height 140px
</style>
