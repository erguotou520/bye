import Vue from 'vue'
import './components'
import './ipc'
import store from './store'
import App from './App'
import { getInitConfig } from './ipc'

Vue.config.productionTip = false

// 启动应用时获取初始化数据
getInitConfig()

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
