<template>
  <div id="app">
    <transition name="page-view">
      <component :is="activeView" @back="onBack" @finished="onStepFinished"></component>
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

const views = ['Feature', 'Setup', 'ManagePanel', 'Options']
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
    ...mapState(['appConfig', 'appMetaConfig', 'view']),
    activeView () {
      return views[this.activeIndex]
    }
  },
  watch: {
    view: {
      deep: true,
      handler (v) {
        if (v.fromMain) {
          const targetIndex = views.indexOf(v.page)
          if (targetIndex > -1) {
            this.activeIndex = targetIndex
          }
        }
      }
    }
  },
  methods: {
    onBack () {
      this.activeIndex--
    },
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
.w-6r
  width 6rem
</style>
