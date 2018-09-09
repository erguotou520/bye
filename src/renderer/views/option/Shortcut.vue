<template>
  <div class="options-container px-2 pb-2 scroll-y">
    <i-form ref="form" class="mt-1" :model="form" :label-width="0">
      <i-form-item>
        <i-row type="flex" :gutter="24">
          <i-col :span="5">
            <i-checkbox v-model="form.globalShortcuts.toggleWindow.enable"
              @on-change="update('globalShortcuts', 'toggleWindow')">
              切换窗口显隐
            </i-checkbox>
          </i-col>
          <i-col :span="8">
            <i-input v-model="form.globalShortcuts.toggleWindow.key"
              readonly :disabled="!form.globalShortcuts.toggleWindow.enable"
              @on-keydown="e=>keydown(e,'globalShortcuts', 'toggleWindow')"
              @on-keyup="e=>keyup(e,'globalShortcuts', 'toggleWindow')"/>
          </i-col>
        </i-row>
      </i-form-item>
      <i-form-item class="flex-1">
        <i-row type="flex" :gutter="24">
          <i-col :span="5">
            <i-checkbox v-model="form.windowShortcuts.toggleMenu.enable"
              @on-change="update('windowShortcuts', 'toggleMenu')">
              切换窗口菜单显隐
            </i-checkbox>
          </i-col>
          <i-col :span="8">
            <i-input v-model="form.windowShortcuts.toggleMenu.key"
              readonly :disabled="!form.windowShortcuts.toggleMenu.enable"
              @on-keydown="e=>keydown(e,'windowShortcuts', 'toggleMenu')"
              @on-keyup="e=>keyup(e,'windowShortcuts', 'toggleMenu')"/>
          </i-col>
        </i-row>
      </i-form-item>
    </i-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { debounce } from '../../../shared/utils'
export default {
  data () {
    const appConfig = this.$store.state.appConfig
    return {
      form: {
        globalShortcuts: appConfig.globalShortcuts,
        windowShortcuts: appConfig.windowShortcuts
      },
      funcKeys: new Set(),
      actionKey: ''
    }
  },
  methods: {
    ...mapActions(['updateConfig']),
    update: debounce(function (parent, field) {
      this.updateConfig({ [parent]: { [field]: this.form[parent][field] }})
    }, 1000),
    keydown: function (e) {
      e.preventDefault()
      if (e.metaKey) {
        this.funcKeys.add('Command')
      }
      if (e.ctrlKey) {
        this.funcKeys.add('Ctrl')
      }
      if (e.shiftKey) {
        this.funcKeys.add('Shift')
      }
      if (e.altKey) {
        this.funcKeys.add('Alt')
      }
      // 不包括上述组合键
      if ([16, 17, 18, 19, 91, 93].indexOf(e.keyCode) < 0) {
        this.actionKey = e.key.toUpperCase()
      }
    },
    keyup: function (e, parent, field) {
      if (this.funcKeys.size || this.actionKey) {
        const keys = Array.from(this.funcKeys)
        if (this.actionKey) {
          keys.push(this.actionKey)
        }
        this.form[parent][field].key = keys.join('+')
        this.funcKeys.clear()
        this.actionKey = ''
        this.update(parent, field)
      }
    }
  }
}
</script>
