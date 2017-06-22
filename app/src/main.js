import Vue from 'vue'
import Electron from 'vue-electron'
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue'

Vue.use(Electron)
Vue.config.debug = true

Raven.config('https://038cef9bc38b46cf9518937bddd1605c@sentry.io/182272')
  .addPlugin(RavenVue, Vue)
  .install()

import App from './App'

/* eslint-disable no-new */
new Vue({
  ...App
}).$mount('#app')
