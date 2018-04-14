<template>
  <div class="options-container px-2 pb-2 scroll-y">
    <i-form ref="form" class="mt-1" :model="form" :label-width="120">
      <i-form-item class="flex-1" label="开启快捷键">
        <i-checkbox v-model="form.shortcutEnable" @on-change="update('shortcutEnable')"/>
      </i-form-item>
      <i-form-item class="flex-1" label="自定义快捷键">
        <i-input v-model="shortcut" @on-keydown="keydown" @on-keyup="keyup"/>
        <!--  @on-change="update('shortcut')" -->
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
        shortcutEnable: appConfig.shortcutEnable,
        shortcut: appConfig.shortcut
      },
      shortcut: appConfig.shortcut,
      keyCache: [],
      keyDown: {}
    }
  },
  watch: {
  },
  methods: {
    ...mapActions(['updateConfig']),
    update: debounce(function (field) {
      if (this.form[field] !== this.$store.state.appConfig[field]) {
        this.updateConfig({ [field]: this.form[field] })
      }
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
        this.shortcut = this.keyCache.join(' + ')
        this.form.shortcut = this.keyCache.join('+')
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
