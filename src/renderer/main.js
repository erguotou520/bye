import Vue from 'vue'
import './components'
import './ipc'
import store from './store'
import App from './App'

const isProduction = process.env.NODE_ENV !== 'development'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

if (isProduction) {
  var Raven = require('raven-js')
  Raven.config('https://35792a16213c4c6b89710f3e3dfa7806@sentry.io/258151').install()

  window.addEventListener('unhandledrejection', function (event) {
    Raven.captureException(event.reason)
  })
}
