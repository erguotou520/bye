import Vue from 'vue'
import Vuex from 'vuex'
import defaultConfig from '../../shared/config'
import { merge } from '../../shared/utils'
import Config from '../../shared/ssr'
import { syncConfig } from '../ipc'
Vue.use(Vuex)

const currentConfig = new Config()
const editingConfig = new Config()
export default new Vuex.Store({
  state: {
    appConfig: defaultConfig,
    meta: {
      defaultSSRDownloadDir: ''
    },
    currentConfig,
    editingConfig,
    editingGroup: '',
    methods: ['aes-128-cfb', 'aes-192-cfb', 'aes-256-cfb', 'aes-128-cfb8', 'aes-192-cfb8', 'aes-256-cfb8',
      'aes-128-ctr', 'aes-192-ctr', 'aes-256-ctr', 'camellia-128-cfb', 'camellia-192-cfb', 'camellia-256-cfb',
      'bf-cfb', 'rc4', 'rc4-md5', 'rc4-md5-6', 'salsa20', 'chacha20', 'chacha20-ietf'
    ],
    protocols: ['origin', 'verify_deflate', 'verify_sha1', 'auth_sha1_v2',
      'auth_sha1_v4', 'auth_aes128_md5', 'auth_aes128_sha1'
    ],
    obfses: ['plain', 'http_simple', 'http_post', 'ramdom_head', 'tls1.2_ticket_auth']
  },
  mutations: {
    // 更新应用配置
    updateConfig (state, targetConfig) {
      merge(state.appConfig, targetConfig)
      console.log('config updated: ', targetConfig)
    },
    // 更新应用元数据
    updateMeta (state, targetMeta) {
      merge(state.meta, targetMeta)
      console.log('meta updated: ', targetMeta)
    },
    // 设置选中的配置
    setCurrentConfig (state, ssrConfig) {
      merge(state.currentConfig, ssrConfig)
      merge(state.editingConfig, ssrConfig)
    },
    // 更新当前编辑的组
    updateEditingGroup (state, newGroupName) {
      state.editingGroup = newGroupName
    },
    // 更新编辑项
    updateEditing (state, config) {
      merge(state.editingConfig, config)
    }
  },
  actions: {
    updateConfig ({ commit }, targetConfig) {
      commit('updateConfig', targetConfig)
      syncConfig(targetConfig)
    },
    addConfigs ({ state, dispatch }, configs) {
      if (configs.length) {
        dispatch('updateConfig', { configs: [...state.appConfig.configs, ...configs] })
      }
    }
  }
})
