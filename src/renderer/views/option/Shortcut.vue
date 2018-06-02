<template>
  <div class="options-container px-2 pb-2 scroll-y">
    <i-form ref="form" class="mt-1" :model="form" :label-width="120">
      <i-form-item class="flex-1">
        <i-checkbox v-model="form.shortcut.toggleWindow.enable" @on-change="update('shortcut')">
          打开程序设置
        </i-checkbox>
        <i-input v-model="form.shortcut.toggleWindow.key" @on-keydown="keydown" @on-keyup="keyup"/>
      </i-form-item>
    </i-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { debounce } from '../../../shared/utils'
// window.addEventListener('keydown', console.log, true)
export default {
  data () {
    const appConfig = this.$store.state.appConfig
    return {
      form: {
        shortcut: appConfig.shortcut
      },
      keyCache: [],
      keyDown: {}
    }
  },
  watch: {
  },
  methods: {
    ...mapActions(['updateConfig']),
    update: debounce(function (field) {
      this.updateConfig({ [field]: this.form[field] })
    }, 1000),
    keydown: function (e) {
      if (e.code.includes('Key')) {
        this.keyDown[e.code.replace('Key', '')] = true
        this.keyCache = []
        if (e.metaKey) {
          this.keyCache.push('Command')
        }
        if (e.ctrlKey) {
          this.keyCache.push('Control')
        }
        if (e.shiftKey) {
          this.keyCache.push('Shift')
        }
        if (e.altKey) {
          this.keyCache.push('Alt')
        }
        for (const key in this.keyDown) {
          if (this.keyDown.hasOwnProperty(key)) {
            if (this.keyDown[key]) {
              this.keyCache.push(key)
            }
          }
        }
        this.shortcut.toggleWindow.key = this.keyCache.join(' + ')
        this.form.shortcut.toggleWindow.key = this.keyCache.join('+')
        this.update('shortcut')
      }
    },
    keyup: function (e) {
      if (e.code.includes('Key')) {
        this.keyDown[e.code.replace('Key', '')] = false
      }
    }
  }
}
</script>
