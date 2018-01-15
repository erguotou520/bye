import Vue from 'vue'
import Vuex from 'vuex'
import defaultConfig from '../../shared/config'
import { merge, clone } from '../../shared/utils'
import Config from '../../shared/ssr'
import { syncConfig } from '../ipc'
import { STORE_KEY_FEATURE } from '../constants'
Vue.use(Vuex)

// 当前编辑的配置项
const editingConfig = new Config()
// 备份当前选中的配置项
const editingConfigBak = new Config()
// ssr config 有效key
const configKeys = Object.keys(editingConfig)
// 页面
const views = ['Feature', 'Setup', 'ManagePanel', 'Options']
// 编辑组的名称
let groupTitleBak = ''
// 功能页面是否已展示过
const featureReaded = !!window.localStorage.getItem(STORE_KEY_FEATURE)

export default new Vuex.Store({
  state: {
    appConfig: defaultConfig,
    meta: {
      defaultSSRDownloadDir: ''
    },
    view: {
      page: featureReaded ? views[1] : views[0],
      tab: 'common'
    },
    editingConfig,
    editingGroup: { show: false, title: '' },
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
      merge(editingConfigBak, ssrConfig)
    },
    // 重置状态
    resetState (state) {
      merge(state.editingConfig, editingConfigBak)
      merge(state.view, { page: views.indexOf(state.view.page) >= 2 ? views[2] : state.view.page, tab: 'common' })
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
    }
  },
  actions: {
    initConfig ({ commit }, { config, meta }) {
      commit('updateConfig', config)
      commit('updateMeta', meta)
      const initialSelected = config.configs[config.index]
      if (initialSelected) {
        commit('setCurrentConfig', initialSelected)
      }
      if (config.ssrPath) {
        commit('updateView', { page: views[2] })
      }
    },
    updateConfig ({ commit }, targetConfig) {
      commit('updateConfig', targetConfig)
      syncConfig(targetConfig)
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
    }
  }
})
