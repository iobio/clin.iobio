
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


import Util                 from './globals/Util.js'
import GlobalApp            from './globals/GlobalApp.js'


Vue.use(VueRouter);

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
    beforeEnter: (to, from, next) => {
      var idx = to.hash.indexOf("#access_token");
      if (idx == 0) {
        let queryParams = Qs.parse(to.hash.substring(1));
        let { access_token, expires_in, token_type, ...otherQueryParams } = queryParams;
        localStorage.setItem('hub-iobio-tkn', token_type + ' ' + access_token);
        next('/' + Qs.stringify(otherQueryParams, { addQueryPrefix: true, arrayFormat: 'brackets' }));
      } else {
        next();
      }
    },
    props: (route) => ({
        //paramIdProject:        route.query.idProject,

        paramDebug:            route.query.debug,

        paramAnalysisId:            route.query.analysis_id,
        paramProjectId:             route.query.project_id,
        paramSampleId:              route.query.sample_id,
        paramTokenType:             route.query.token_type,
        paramToken:                 route.query.access_token,
        paramSource:                route.query.source,

        paramIobioSource:           route.query.iobio_source,
        paramGeneBatchSize:         route.query.gene_batch_size,

        paramTheme:                 route.query.theme
    })
  },
   {
    name: 'home-hub',
    path: '/access_token*',
    redirect: '/'
  }

]

const router = new VueRouter({
  'mode':  'history',
  'routes': routes
})



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

export const bus = new Vue();

window.vm = new Vue({
  el: '#app',
  created: function() {

  },
  render: h => h(App),
  router
})
