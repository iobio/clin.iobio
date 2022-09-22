import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/pages/ClinHome.vue'

Vue.use(VueRouter)


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
        paramDebug:                 route.query.debug,

        paramAnalysisId:            route.query.analysis_id,
        paramProjectId:             route.query.project_id,
        paramSampleId:              route.query.sample_id,
        paramTokenType:             route.query.token_type,
        paramToken:                 route.query.access_token,
        paramSource:                route.query.source,
        paramGeneSetId:             route.query.gene_set_id,
        paramGenes:                 route.query.genes,

        paramIobioSource:           route.query.iobio_source,
        paramGeneBatchSize:         route.query.gene_batch_size,
        paramClientApplicationId:   route.query.client_application_id,

        paramBuild:                 route.query.build,

        paramTheme:                 route.query.theme,
        paramVariantSetId:          route.query.variant_set_id,
        paramExperimentId:          route.query.experiment_id,

        paramAffectedSibs:     route.query.affectedSibs,
        paramUnaffectedSibs:   route.query.unaffectedSibs,
        paramRelationships:    [route.query.rel0, route.query.rel1, route.query.rel2],
        paramSexes:            [route.query.sex0, route.query.sex1, route.query.sex2],
        paramSamples:          [route.query.sample0, route.query.sample1, route.query.sample2],
        paramNames:            [route.query.name0, route.query.name1, route.query.name2],
        paramBams:             [route.query.bam0, route.query.bam1, route.query.bam2],
        paramBais:             [route.query.bai0, route.query.bai1, route.query.bai2],
        paramVcfs:             [route.query.vcf0, route.query.vcf1, route.query.vcf2],
        paramTbis:             [route.query.tbi0, route.query.tbi1, route.query.tbi2],
        paramAffectedStatuses: [route.query.affectedStatus0, route.query.affectedStatus1, route.query.affectedStatus2],
        

    })
  },
   {
    name: 'home-hub',
    path: '/access_token*',
    redirect: '/'
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
