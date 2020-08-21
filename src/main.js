import Vue                  from 'vue'
import App                  from './App.vue'
import router               from './router'
import store                from './store'
// import bootstrap            from 'bootstrap/dist/css/bootstrap.css'

import vuetify              from './plugins/vuetify';

import jQuery               from 'jquery'
global.jQuery = jQuery
global.$ = jQuery

import VueAnalytics from 'vue-analytics';


import VTooltip from 'v-tooltip'
import './assets/css/v-tooltip.css'
Vue.use(VTooltip)


import Util from '../src/globals/Util';
import GlobalApp from '../src/globals/GlobalApp';

Vue.config.productionTip = false

export const bus = new Vue();

import 'material-design-icons-iconfont/dist/material-design-icons.css'

import 'iobio-phenotype-extractor-vue/dist/iobio.css'

// define gobal filters 
Vue.filter('to-firstCharacterUppercase', function(value){
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter('to-formatLabel', function(value){
  if (!value) return '';
  var count = parseInt(value)
  
  if(isNaN(count)){
    return "";
  }
  
  return nFormatter(count, 1)
});

function nFormatter(num, digits) {
    var si = [
        {value: 1, symbol: ""},
        {value: 1E3, symbol: "K"},
        {value: 1E6, symbol: "M"},
        {value: 1E9, symbol: "B"},
        {value: 1E12, symbol: "T"}
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

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


// Google analytics
Vue.use(VueAnalytics, {
  id: 'UA-47481907-13',
  router
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
