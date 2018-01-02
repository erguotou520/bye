import Vue from 'vue'
import defaultConfig from '../shared/config'
import { merge } from '../shared/utils'

export default new Vue({
  data () {
    return {
      appConfig: defaultConfig
    }
  },
  methods: {
    updateConfig (targetConfig) {
      merge(this.appConfig, targetConfig)
      console.log('config updated: ', targetConfig)
    }
  }
})
