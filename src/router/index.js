import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/pages/ClinHome.vue";

Vue.use(VueRouter);

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
    beforeEnter: (to, from, next) => {
      var idx = to.hash.indexOf("#access_token");
      if (idx == 0) {
        let queryParams = Qs.parse(to.hash.substring(1));
        let {
          access_token,
          expires_in,
          token_type,
          ...otherQueryParams
        } = queryParams;
        localStorage.setItem("hub-iobio-tkn", token_type + " " + access_token);
        next(
          "/" +
            Qs.stringify(otherQueryParams, {
              addQueryPrefix: true,
              arrayFormat: "brackets"
            })
        );
      } else {
        next();
      }
    },
    props: route => ({
      //paramIdProject:        route.query.idProject,
      paramDebug: route.query.debug,

      paramAnalysisId: route.query.analysis_id,
      paramProjectId: route.query.project_id,
      paramSampleId: route.query.sample_id,
      paramTokenType: route.query.token_type,
      paramToken: route.query.access_token,
      paramSource: route.query.source,

      paramIobioSource: route.query.iobio_source,
      paramGeneBatchSize: route.query.gene_batch_size,
      paramClientApplicationId: route.query.client_application_id,

      paramBuild: route.query.build,

      paramTheme: route.query.theme
    })
  },
  {
    name: "home-hub",
    path: "/access_token*",
    redirect: "/"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
