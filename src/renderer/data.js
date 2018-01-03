import Vue from 'vue'
import defaultConfig from '../shared/config'
import { merge } from '../shared/utils'

export default new Vue({
  data () {
    return {
      appConfig: defaultConfig,
      meta: {
        defaultSSRDownloadDir: ''
      }
    }
  },
  computed: {
    // 分组后的ssr节点
    groupedNodes () {
      if (this.appConfig && this.appConfig.configs && this.appConfig.configs.length) {
        const groups = { '未分组': [] }
        this.appConfig.configs.forEach(config => {
          if (config.group) {
            if (groups[config.group]) {
              groups[config.group].push(config)
            } else {
              groups[config.group] = [config]
            }
          } else {
            groups['未分组'].push(config)
          }
        })
        return Object.keys(groups).map(groupName => {
          return {
            name: groupName,
            children: groups[groupName]
          }
        })
      } else {
        return []
      }
    }
  },
  methods: {
    updateConfig (targetConfig) {
      merge(this.appConfig, targetConfig)
      console.log('config updated: ', targetConfig)
    },
    updateMeta (targetMeta) {
      merge(this.meta, targetMeta)
      console.log('meta updated: ', targetMeta)
    }
  }
})
