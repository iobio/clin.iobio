import Vue                  from 'vue'
import App                  from './App.vue'
import router               from './router'
import store                from './store'
import bootstrap            from 'bootstrap/dist/css/bootstrap.css'

import vuetify              from './plugins/vuetify';

import jQuery               from 'jquery'
global.jQuery = jQuery
global.$ = jQuery


import VTooltip from 'v-tooltip'
import './assets/css/v-tooltip.css'
Vue.use(VTooltip)


import Util from '../src/globals/Util';
import GlobalApp from '../src/globals/GlobalApp';

Vue.config.productionTip = false

export const bus = new Vue();

import 'material-design-icons-iconfont/dist/material-design-icons.css'

import 'iobio-phenotype-extractor-vue/dist/iobio.css'

// define a globals mixin object
Vue.mixin({
  data: function() {
    return {
      utility: new Util(),
      globalApp: new GlobalApp()
    };
  },
  created: function(){
    this.utility.globalApp = this.globalApp;
    this.globalApp.utility = this.utility;

  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
