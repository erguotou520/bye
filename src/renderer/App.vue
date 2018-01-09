<template>
  <div id="app">
    <transition name="page-view">
      <component :is="activeView" @finished="onStepFinished"></component>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Feature from './views/Feature'
import Setup from './views/Setup'
import Options from './views/Options'
import ManagePanel from './views/ManagePanel'
import { syncConfig } from './ipc'
import { STORE_KEY_FEATURE } from './constants'

const views = ['Feature', 'Setup', 'ManagePanel']
const ls = window.localStorage
export default {
  data () {
    // 功能页面是否已展示过
    const featureReaded = !!ls.getItem(STORE_KEY_FEATURE)
    return {
      activeIndex: this.$store.state.appConfig.ssrPath ? 2 : (featureReaded ? 1 : 0)
    }
  },
  computed: {
    ...mapState(['appConfig', 'appMetaConfig']),
    activeView () {
      return views[this.activeIndex]
    }
  },
  methods: {
    onStepFinished (data) {
      if (this.activeIndex === 0) {
        ls.setItem(STORE_KEY_FEATURE, 'read')
      } else if (this.activeIndex === 1) {
        syncConfig(data)
      }
      this.activeIndex++
    }
  },
  components: {
    Feature,
    Setup,
    Options,
    ManagePanel
  }
}
</script>
<style lang="stylus">
@import '~erguotou-iview/dist/styles/iview.css'
@import './assets/styles'
@import './assets/base.styl'
</style>
