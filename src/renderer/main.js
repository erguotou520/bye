import Vue from 'vue'
import './components'
import './ipc'
import data from './data'

import App from './App'

Vue.prototype.$store = data
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(App)
}).$mount('#app')
