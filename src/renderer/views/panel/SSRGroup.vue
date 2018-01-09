<template>
  <i-form class="panel-group" ref="form" :model="form" :rules="rules" :label-width="80" inline>
    <i-form-item label="分组重命名" prop="server">
      <i-input type="text" v-model="form.group"/>
    </i-form-item>
    <span>
      <i-button :disabled="form.group === editingGroup"
        @click="form.group = editingGroup">重置</i-button>
      <i-button class="ml-1" type="primary" @click="rename">保存</i-button>
    </span>
  </i-form>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      rules: {
        group: { required: true, message: '请输入分组名' }
      },
      form: {
        group: ''
      }
    }
  },
  computed: {
    ...mapState(['editingGroup', 'appConfig'])
  },
  watch: {
    'editingGroup' (v) {
      this.form.group = v
    }
  },
  methods: {
    ...mapMutations(['updateConfig']),
    rename () {
      if (this.form.group !== this.editingGroup) {
        const clone = this.appConfig.configs.slice()
        clone.forEach(config => {
          if (config.group === this.editingGroup) {
            config.group = this.form.group
          }
        })
        this.updateConfig({ configs: clone })
      }
    }
  }
}
</script>
