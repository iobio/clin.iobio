import jQuery               from 'jquery'
global.jQuery = jQuery
global.$ = jQuery


import Vue                  from 'vue'
import VueRouter            from 'vue-router'

import App                  from './App.vue'
import Home                 from './components/pages/ClinHome.vue'



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
        //paramIdProject:        route.query.idProject,

        paramDebug:            route.query.debug,

        paramProjectId:             route.query.project_uuid,
        paramSampleId:              route.query.sample_uuid,
        paramTokenType:             route.query.token_type,
        paramToken:                 route.query.access_token,
        paramSource:                route.query.source
    })
  },
  {
    name: 'home-hub',
    path: '/access_token*',
    beforeEnter: (to, from, next) => {
            // remove initial slash from path and parse
      let queryParams = Qs.parse(to.path.substring(1));
      let { access_token, expires_in, token_type, ...otherQueryParams } = queryParams;
      localStorage.setItem('hub-iobio-tkn', token_type + ' ' + access_token);
      next('/' + Qs.stringify(otherQueryParams, { addQueryPrefix: true, arrayFormat: 'brackets' }));
    },
    component: Home,
    props: (route) => ({


        paramDebug:                 route.query.debug,

        paramProjectId:             route.query.project_uuid,

        paramSampleId:              route.query.sample_uuid,
        paramTokenType:             route.query.token_type,
        paramToken:                 route.query.access_token,
        paramSource:                route.query.source
    })
  }
]

const router = new VueRouter({
  'mode':  'history',
  'routes': routes
})





window.vm = new Vue({
  el: '#app',
  created: function() {

  },
  render: h => h(App),
  router
})
