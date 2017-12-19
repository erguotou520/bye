import Vue from 'vue'
import VueRx from 'vue-rx'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription' // Disposable if using RxJS4
import { Subject } from 'rxjs/Subject' // required for domStreams option
import './components'
import './ipc'
import data from './data'

import App from './App'

Vue.use(VueRx, {
  Observable,
  Subscription,
  Subject
})

Vue.prototype.$store = data
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  render: h => h(App)
}).$mount('#app')
