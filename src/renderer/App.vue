<template>
  <div id="app">
    <transition name="page-view">
      <component :is="view.page" @back="onBack" @finished="onStepFinished"></component>
    </transition>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Feature from './views/Feature'
import Setup from './views/Setup'
import Options from './views/Options'
import ManagePanel from './views/ManagePanel'
export default {
  computed: {
    ...mapState(['appConfig', 'appMetaConfig', 'view'])
  },
  methods: {
    ...mapMutations(['prevView', 'nextView']),
    onBack () {
      this.prevView()
    },
    onStepFinished (data) {
      this.nextView()
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
