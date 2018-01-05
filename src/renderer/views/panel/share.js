import Vue from 'vue'
import SSR from '../../../shared/ssr'
import { merge } from '../../../shared/utils'
export default new Vue({
  data: {
    // 当前选中的配置
    currentConfig: new SSR()
  },
  methods: {
    setCurrent (ssrConfig) {
      merge(this.currentConfig, ssrConfig)
    }
  }
})
