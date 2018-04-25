import jQuery               from 'jquery'
global.jQuery = jQuery
global.$ = jQuery


import Vue                  from 'vue'
import VueRouter            from 'vue-router'

import App                  from './App.vue'
import Home                 from './components/pages/Home.vue'


import bootstrap            from 'bootstrap/dist/css/bootstrap.css'

import Vuetify              from 'vuetify'
import                           'vuetify/dist/vuetify.css'
import                           '../assets/css/siteVuetify.css'
Vue.use(Vuetify)


import VTooltip from 'v-tooltip'
import                           '../assets/css/v-tooltip.css'
Vue.use(VTooltip)



Vue.use(VueRouter);

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
    props: (route) => ({
        paramIdProject:        route.query.idProject,
        paramDebug:            route.query.debug
    })
  }
]

const router = new VueRouter({
  //'mode':  'history',
  'routes': routes
})





window.vm = new Vue({
  el: '#app',
  created: function() {

  },
  render: h => h(App),
  router
})
