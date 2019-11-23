import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import jQuery               from 'jquery'
global.jQuery = jQuery
global.$ = jQuery


Vue.config.productionTip = false

export const bus = new Vue();

import 'material-design-icons-iconfont/dist/material-design-icons.css'

import 'iobio-phenotype-extractor-vue/dist/iobio.css'


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
