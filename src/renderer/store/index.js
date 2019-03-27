import Vue from 'vue'
import Vuex from 'vuex'
import defaultConfig from '../../shared/config'
import { merge, clone, request, isSubscribeContentValid, getUpdatedKeys, isConfigEqual, somePromise } from '../../shared/utils'
import Config from '../../shared/ssr'
import { syncConfig } from '../ipc'
import { STORE_KEY_FEATURE, STORE_KEY_SSR_METHODS, STORE_KEY_SSR_PROTOCOLS, STORE_KEY_SSR_OBFSES } from '../constants'
Vue.use(Vuex)

// 当前编辑的配置项
const editingConfig = new Config()
// ssr config 有效key
const configKeys = Object.keys(editingConfig)
// 页面
const views = ['Feature', 'Setup', 'ManagePanel', 'Options']
// 编辑组的名称
let groupTitleBak = ''
// 功能页面是否已展示过
const ls = window.localStorage
const featureReaded = !!ls.getItem(STORE_KEY_FEATURE)

// 初始化读取存储，如果没有存储则保持
const storedMethods = ls.getItem(STORE_KEY_SSR_METHODS)
const storedProtocols = ls.getItem(STORE_KEY_SSR_PROTOCOLS)
const storedObfses = ls.getItem(STORE_KEY_SSR_OBFSES)

let methods
let protocols
let obfses
// ssr methods
if (storedMethods) {
  methods = JSON.parse(storedMethods)
} else {
  methods = ['none', 'aes-128-cfb', 'aes-192-cfb', 'aes-256-cfb', 'aes-128-cfb8', 'aes-192-cfb8', 'aes-256-cfb8',
    'aes-128-ctr', 'aes-192-ctr', 'aes-256-ctr', 'camellia-128-cfb', 'camellia-192-cfb', 'camellia-256-cfb',
    'bf-cfb', 'rc4', 'rc4-md5', 'rc4-md5-6', 'salsa20', 'chacha20', 'chacha20-ietf'
  ]
  ls.setItem(STORE_KEY_SSR_METHODS, JSON.stringify(methods))
}
// ssr protocols
if (storedProtocols) {
  protocols = JSON.parse(storedProtocols)
} else {
  protocols = ['origin', 'verify_deflate', 'auth_sha1_v4', 'auth_aes128_md5',
    'auth_aes128_sha1', 'auth_chain_a', 'auth_chain_b'
  ]
  ls.setItem(STORE_KEY_SSR_PROTOCOLS, JSON.stringify(protocols))
}
// ssr obfses
if (storedObfses) {
  obfses = JSON.parse(storedObfses)
} else {
  obfses = ['plain', 'http_simple', 'http_post', 'ramdom_head', 'tls1.2_ticket_auth', 'tls1.2_ticket_fastauth']
  ls.setItem(STORE_KEY_SSR_OBFSES, JSON.stringify(obfses))
}

export default new Vuex.Store({
  state: {
    appConfig: defaultConfig,
    meta: {
      version: '',
      defaultSSRDownloadDir: ''
    },
    view: {
      page: featureReaded ? views[1] : views[0],
      tab: 'common',
      // 是否激活当前页面的主要操作
      active: false
    },
    editingConfig,
    // 备份当前选中的配置项
    editingConfigBak: new Config(),
    editingGroup: { show: false, title: '', updated: false },
    methods,
    protocols,
    obfses
  },
  mutations: {
    // 更新应用配置
    updateConfig (state, [targetConfig, sync = false]) {
      const changed = getUpdatedKeys(state.appConfig, targetConfig)
      if (changed.length) {
        const extractConfig = {}
        changed.forEach(key => { extractConfig[key] = targetConfig[key] })
        merge(state.appConfig, extractConfig)
        console.log('config updated: ', extractConfig)
        if (sync) {
          syncConfig(extractConfig)
        }
      }
    },
    // 更新应用元数据
    updateMeta (state, targetMeta) {
      merge(state.meta, targetMeta)
      console.log('meta updated: ', targetMeta)
    },
    // 更改页面视图
    updateView (state, targetView) {
      merge(state.view, targetView)
    },
    // 返回上一个页面
    prevView (state) {
      state.view.page = views[views.indexOf(state.view.page) - 1]
    },
    // 下一个页面
    nextView (state) {
      state.view.page = views[views.indexOf(state.view.page) + 1]
    },
    // 设置选中的配置
    setCurrentConfig (state, ssrConfig) {
      merge(state.editingConfig, ssrConfig)
      merge(state.editingConfigBak, ssrConfig)
    },
    // 更新编辑项备份
    updateEditingBak (state) {
      merge(state.editingConfigBak, state.editingConfig)
    },
    // 重置状态
    resetState (state) {
      merge(state.editingConfig, state.editingConfigBak)
      merge(state.view, { page: views.indexOf(state.view.page) >= 2 ? views[2] : state.view.page, tab: 'common', active: false })
      state.editingGroup.title = groupTitleBak
    },
    // 更新当前编辑的组
    updateEditingGroup (state, newGroup) {
      merge(state.editingGroup, newGroup)
      groupTitleBak = newGroup.title
    },
    // 更新编辑项
    updateEditing (state, config) {
      merge(state.editingConfig, config)
    },
    updateMethods (state, methods) {
      state.methods = methods
      ls.setItem(STORE_KEY_SSR_METHODS, JSON.stringify(methods))
    },
    updateProtocols (state, protocols) {
      state.protocols = protocols
      ls.setItem(STORE_KEY_SSR_PROTOCOLS, JSON.stringify(protocols))
    },
    updateObfses (state, obfses) {
      state.obfses = obfses
      ls.setItem(STORE_KEY_SSR_OBFSES, JSON.stringify(obfses))
    }
  },
  actions: {
    initConfig ({ commit }, { config, meta }) {
      commit('updateConfig', [config])
      commit('updateMeta', meta)
      if (meta.version) {
        document.title = `${document.title} v${meta.version}`
      }
      const initialSelected = config.configs[config.index]
      if (initialSelected) {
        commit('setCurrentConfig', initialSelected)
      }
      if (config.ssrPath) {
        commit('updateView', { page: views[2] })
      }
    },
    updateConfig ({ getters, commit }, targetConfig) {
      let index
      if (targetConfig.configs && getters.selectedConfig) {
        index = targetConfig.configs.findIndex(config => config.id === getters.selectedConfig.id)
      }
      const correctConfig = (index !== undefined && index > -1) ? { ...targetConfig, index } : targetConfig
      commit('updateConfig', [correctConfig, true])
    },
    updateConfigs ({ dispatch }, _configs) {
      const configs = _configs.map(config => {
        const _clone = clone(config)
        Object.keys(_clone).forEach(key => {
          if (configKeys.indexOf(key) < 0) {
            // 删除无用的key
            delete _clone[key]
          }
        })
        return _clone
      })
      dispatch('updateConfig', { configs })
    },
    addConfigs ({ state, dispatch }, configs) {
      if (configs.length) {
        dispatch('updateConfig', { configs: [...state.appConfig.configs, ...configs] })
      }
    },
    // 更新所有订阅服务器
    updateSubscribes ({ state, dispatch }, updateSubscribes) {
      // 要更新的订阅服务器
      updateSubscribes = updateSubscribes || state.appConfig.serverSubscribes
      // 累计更新节点数
      let updatedCount = 0
      return Promise.all(updateSubscribes.map(subscribe => {
        return somePromise([request(subscribe.URL, true), fetch(subscribe.URL).then(res => res.text())]).then(res => {
          const [groupCount, groupConfigs] = isSubscribeContentValid(res)
          if (groupCount > 0) {
            for (const groupName in groupConfigs) {
              const configs = groupConfigs[groupName]
              const group = configs[0].group
              // 更新的组下面原来的配置
              const groupedConfigs = []
              // 不在更新组里面的配置
              const notInGroupConfigs = []
              state.appConfig.configs.forEach(config => {
                if (config.group === group) {
                  groupedConfigs.push(config)
                } else {
                  notInGroupConfigs.push(config)
                }
              })
              // 原组中没有发生变更的节点
              const oldNotChangedConfigs = groupedConfigs.filter(config => {
                const i = configs.findIndex(_config => isConfigEqual(config, _config))
                if (i > -1) {
                  // 未发生实际更新的节点删除
                  configs.splice(i, 1)
                  return true
                }
                return false
              })
              if (configs.length) {
                dispatch('updateConfigs', oldNotChangedConfigs.concat(configs).concat(notInGroupConfigs))
                updatedCount += configs.length
              } else {
                console.log('订阅节点并未发生变更')
              }
            }
          }
        })
      })).then(() => {
        return updatedCount
      })
    }
  },
  getters: {
    selectedConfig: state => state.appConfig.configs[state.appConfig.index],
    isEditingConfigUpdated: state => !isConfigEqual(state.editingConfigBak, state.editingConfig)
  }
})
