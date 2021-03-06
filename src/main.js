// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './assets/scss/app.scss'
import Vue from 'vue'
import App from './App'
import axios from 'axios'

axios.defaults.baseURL = 'http://new.whoer.net'
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
