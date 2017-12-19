<template>
  <div id="app" class="flex flex-column flex-jc-center flex-ai-center">
    <transition name="slide-left">
      <component :is="activeView" @finished="onStepFinished"></component>
    </transition>
  </div>
</template>
<script>
import Setup from './views/Setup'
import Options from './views/Options'
import ManagePanel from './views/ManagePanel'
import { syncConfig } from './ipc'
export default {
  data () {
    console.log('2', this.$store.appConfig)
    return {
      activeView: this.$store.appConfig.ssrPath ? 'ManagePanel' : 'Setup'
    }
  },
  methods: {
    onStepFinished (data) {
      if (this.activeView === 'Setup') {
        syncConfig(data)
        this.activeView = 'ManagePanel'
      }
    }
  },
  components: {
    Setup,
    Options,
    ManagePanel
  }
}
</script>
<style lang="stylus">
@import '~iview/dist/styles/iview.css'
@import './assets/styles'
@import './assets/base.styl'
</style>
