<style lang="sass">

@import ../../assets/sass/variables


.dialog.dialog--active
  button
    padding: 0px
    height: 30px !important

header.theme--dark.v-sheet
  padding-top: 5px
  background-color: $nav-color !important
  font-weight: 300 !important

  .v-toolbar__content
    margin-top: 2px
    align-items: flex-end
    padding-right: 15px
    padding-bottom: 10px

    .percent-label
      font-size: 12px

    .analysis-save-button
      background-color: $button-color !important

    #workflow-progress
      display: flex
      padding-bottom: 10px
      margin-left: 50px

      .v-progress-linear__background.primary
        background-color: $workflow-progress-color !important
        border-color: $workflow-progress-color !important
        opacity: 0.4
      .v-progress-linear__determinate.primary
        background-color: $workflow-progress-color !important
        border-color: $workflow-progress-color !important
        opacity: .8 !important

      span
        margin-left: 8px

    .v-toolbar__title
      color: $nav-title-color
      font-family: $iobio-font

    .v-btn
      color: $nav-text-color
      text-transform: none
      font-size: 13px !important

    .v-toolbar__items
      width: 60%

    .v-btn
      margin: 0px
      min-width: 78px
      margin-left: 10px

      .v-btn__content
        padding: 0 0px
        font-family: $iobio-font


    #report-button, #save-button
      height: 30px
      margin-left: 20px
      margin-bottom: 4px
      background-color: $workflow-active-color
      border-radius: 4px

      .v-btn__content
        color: white

        i.material-icons
          color: white !important
          font-size: 17px !important
          padding-right: 2px


    i.material-icons
      margin-right: 2px
      color:  $nav-text-color !important

    .v-toolbar__title
      font-size: 18px
      margin-right: 5px
      margin-left: 5px
      padding-bottom: 6px
      min-width: 130px





</style>

<template>
  <div>
    <v-toolbar fixed   height="45"   dark  >

      <v-btn text @click="onTitleClicked" class="mr-5">
        <calypso-icon></calypso-icon>
        <span style="font-size:18px; margin-top:-4px;margin-left:5px">Calypso</span>
        <span style="font-size:18px; margin-top:-4px;margin-left:20px">clin.iobio</span>
      </v-btn>


      <v-popover
        v-model="showCaseMenu"
      >
        <v-btn v-if="caseSummary && caseSummary.name" text>
          <span>{{ caseSummary.name }}</span>
        </v-btn>
        <template slot="popover">
          <div style="color:#6a6a6a; background:white; width: 230px; text-align: left; margin-right: 5px; font-family: Poppins, sans-serif; font-weight: normal; font-size: 14px; padding-right:15px">
            {{caseSummary.description}}
          </div>
          <div style="height: 20px"></div>
          <v-btn text light small color="primary" style="color:rgb(69, 104, 142); margin-left: 50px" v-close-popover >
            Close
          </v-btn>        
        </template>
      </v-popover>
      
      <span class="ml-4" style="padding-bottom:7.5px; color: #b7dafa; font-weight: bold; font-size: 15px"> 
        <i> {{getBuildName}} </i>
      </span>


      <span id="workflow-progress">
        <v-progress-linear class="primary--text" :value="percentComplete" style="margin-bottom:0px;width:120px;margin-top:4px" height="8" >
        </v-progress-linear>
        <span class="percent-label">{{ percentComplete }}% complete</span>
      </span>

      <v-spacer></v-spacer>

      <v-menu
      v-if="false"
      offset-y
      :close-on-content-click="false"
      :nudge-width="350"
      v-model="showNotesMenu"
      >
        <!-- <v-btn  text slot="activator">
          Notes
        </v-btn> -->
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            Notes
          </v-btn>
        </template>

        <v-card>
        </v-card>
      </v-menu>

      <v-menu
      offset-y v-if="false"
      :close-on-content-click="false"
      :nudge-width="350"
      v-model="showInstructionsMenu"
      >
        <!-- <v-btn  text slot="activator">
          Instructions
        </v-btn> -->
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            Instructions
          </v-btn>
        </template>

        <v-card>
        </v-card>
      </v-menu>

      <v-btn light tile id="report-button" @click="createAnalysisPDF">
        <v-icon>assignment</v-icon>
        Report
      </v-btn>
      
      <v-btn color="primary" id="save-button" @click="saveAnalysis" v-if="customData">
        <v-icon>save</v-icon>
        Save Analysis
      </v-btn>

      <save-button
      v-if="launchedFromMosaic"
        :showing-save-modal="true"
        :showSaveModal="showSaveModal"
        :analysis="analysis"
        @save-modal="toggleSaveModal"
      />
      
      <MoreMenu landingPage="false" />


    </v-toolbar>



  </div>
</template>

<script>

import { bus }     from '../../main';
import CalypsoIcon from '../partials/icons/calypso-icon.vue'
import SaveButton  from '../partials/SaveButton.vue'
import PedigreeGraph from '../viz/PedigreeGraph'
import MoreMenu    from '../partials/MoreMenu.vue'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'navigation',
  components: {
    SaveButton,
    PedigreeGraph,
    MoreMenu,
    CalypsoIcon
  },
  props: {
    caseSummary: null,
    analysis: null,
    launchedFromMosaic: null,
    customData: null,
    showSaveModal: null
  },
  data () {
    let self = this;
    return {
      title: 'clin.iobio',
      clipped: false,
      showCaseMenu: false,
      showPhenotypesMenu: false,
      showGenesMenu: false,
      showVariantsMenu: false,
      showNotesMenu: false,
      showInstructionsMenu: false,

    }
  },
  watch: {
  },
  methods: {
    onTitleClicked(){
      bus.$emit("show-landing-page")
    },
    round(value, places) {
      return +(Math.round(value + "e+" + places)  + "e-" + places);
    },
    createAnalysisPDF(){
      bus.$emit("getAnalysisObject");
    },
    saveAnalysis(){
      bus.$emit("save-analysis-object")
    },

    toggleSaveModal(bool) {
      this.$emit("show-save-analysis", bool)
    },

    useDemoData(){
      this.pedigreeData ={"0":{"id":3261,"metrics":{"second_mates":"16534422","test2_77850c8c":"15","proper_pairs":"99.1149","failed_qc":"0","strand_bias":"1.00551","ts_tv_ratio":"2.05896","variant_count":"88110","pedigree":"Pedigree","var_other_count":"4124","duplicate_rate":"0.00348412","affected_status":"Unaffected","file_location":"s3","both_mates_mapped":"32943377","var_snp_count":"77618","singletons":"55024","var_indel_count":"8672","first_mates":"16503521","total_reads":"33037943","mapped_reads":"32998401","read_coverage_iqr":"15","paired_end_reads":"33037943","median_read_coverage":"51"},"distributions":{"chrom_coverage":"null","mut_spec":{"A":[0,12636,4063,1854],"G":[13569,0,3808,2863],"C":[2901,3961,0,13330],"T":[1833,4091,12709,0]},"af_hist":{"usingLogScaleAF":false,"afHistBins":{"6":17695,"8":206,"12":9919,"16":203,"18":10661,"25":11775,"31":8610,"33":156,"37":7772,"41":104,"43":6914}},"coverage_hist":{"quartiles":[59,51,44],"whiskers":[74,29]},"length_hist":{"quartiles":[101,101,101],"whiskers":[101,101]},"frag_hist":{"quartiles":[363,319,277],"whiskers":[449,191]},"mapq_hist":{"quartiles":[60,60,60],"whiskers":[60,60]},"coverage_hist_no_outliers":{"29":0.004871,"30":0.005242,"31":0.005779,"32":0.006489,"33":0.007382,"34":0.008438,"35":0.009793,"36":0.011365,"37":0.013201,"38":0.015237,"39":0.017403,"40":0.019552,"41":0.021913,"42":0.024191,"43":0.026483,"44":0.028585,"45":0.030652,"46":0.032406,"47":0.033824,"48":0.035041,"49":0.035973,"50":0.036446,"51":0.036685,"52":0.036585,"53":0.036086,"54":0.035348,"55":0.034207,"56":0.032812,"57":0.031296,"58":0.029653,"59":0.027818,"60":0.02603,"61":0.02397,"62":0.02191,"63":0.019862,"64":0.017845,"65":0.016009,"66":0.014165,"67":0.012458,"68":0.010852,"69":0.009428,"70":0.008084,"71":0.006864,"72":0.00579,"73":0.004839,"74":0.003993}},"uid":"0ced8131-34f","name":"NA12877.exome","description":null,"ancestry":{"background":604,"data":[-0.1026610208789221,-1.4242045534784185,"EUR"]},"created_at":"2019-07-18T15:12:05.413Z","updated_at":"2019-07-18T15:12:05.413Z","kindred_id":50,"sample_id":3261,"paternal_id":3263,"maternal_id":3264,"sex":1,"affection_status":1,"client_name":"11002","pedigree":{"kindred_id":"b537452d-9852-4605-8fd5-c90635d2824c","sample_id":3261,"paternal_id":3263,"maternal_id":3264,"sex":1,"affection_status":1},"vcf_sample_name":"NA12877","files":{"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12877.exome.bam","tbi":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12877.vcf.gz.tbi","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12877.vcf.gz","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12877.exome.bam.bai"}},"1":{"id":3262,"metrics":{"duplicate_rate":"0.00414535","ts_tv_ratio":"2.14514","first_mates":"16282871","total_reads":"32568521","var_indel_count":"8816","var_other_count":"4006","singletons":"87747","file_location":"s3","strand_bias":"1.0064","mapped_reads":"32505279","second_mates":"16285650","pedigree":"Pedigree","median_read_coverage":"50","read_coverage_iqr":"13","variant_count":"86759","failed_qc":"0","proper_pairs":"98.8382","var_snp_count":"76210","paired_end_reads":"32568521","both_mates_mapped":"32417532","affected_status":"Affected"},"distributions":{"chrom_coverage":"null","mut_spec":{"A":[0,12505,3647,1839],"G":[13474,0,3814,2815],"C":[2882,3847,0,13423],"T":[1858,3529,12577,0]},"af_hist":{"usingLogScaleAF":false,"afHistBins":{"6":2095,"8":124,"12":16045,"16":165,"18":13794,"25":14207,"31":10273,"33":177,"37":8805,"41":93,"43":6914}},"coverage_hist":{"quartiles":[57,50,44],"whiskers":[70,31]},"length_hist":{"quartiles":[101,101,101],"whiskers":[101,101]},"frag_hist":{"quartiles":[366,321,277],"whiskers":[455,188]},"mapq_hist":{"quartiles":[60,60,60],"whiskers":[60,60]},"coverage_hist_no_outliers":{"31":0.004288,"32":0.005304,"33":0.00659,"34":0.008097,"35":0.009874,"36":0.01195,"37":0.014323,"38":0.01694,"39":0.019677,"40":0.022559,"41":0.025512,"42":0.028514,"43":0.031331,"44":0.034076,"45":0.036573,"46":0.038604,"47":0.040373,"48":0.04158,"49":0.042213,"50":0.042424,"51":0.042139,"52":0.041356,"53":0.040086,"54":0.038539,"55":0.036649,"56":0.03441,"57":0.032007,"58":0.029539,"59":0.026872,"60":0.024301,"61":0.021637,"62":0.019012,"63":0.01666,"64":0.014452,"65":0.012375,"66":0.01055,"67":0.008907,"68":0.007446,"69":0.006186,"70":0.005052}},"uid":"72de2cd5-97f","name":"NA12878.exome","description":null,"ancestry":{"background":604,"data":[-0.31801863225785604,-1.4812542726924995,"EUR"]},"created_at":"2019-07-18T15:12:05.413Z","updated_at":"2019-07-18T15:12:05.413Z","kindred_id":50,"sample_id":3262,"paternal_id":3263,"maternal_id":3264,"sex":2,"affection_status":2,"client_name":"11002","pedigree":{"kindred_id":"b537452d-9852-4605-8fd5-c90635d2824c","sample_id":3262,"paternal_id":3263,"maternal_id":3264,"sex":2,"affection_status":2},"vcf_sample_name":"NA12878","files":{"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam.bai","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12878.vcf.gz","tbi":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12878.vcf.gz.tbi"}},"2":{"id":3263,"metrics":{"duplicate_rate":"0.0093774","var_indel_count":"8622","total_reads":"32234312","var_snp_count":"76039","affected_status":"Unaffected","file_location":"s3","proper_pairs":"98.3934","second_mates":"16115247","median_read_coverage":"50","mapped_reads":"32190556","singletons":"61628","pedigree":"Pedigree","both_mates_mapped":"32128928","read_coverage_iqr":"13","ts_tv_ratio":"2.10934","var_other_count":"3940","strand_bias":"1.01811","failed_qc":"0","paired_end_reads":"32234312","variant_count":"86331","first_mates":"16119065"},"distributions":{"chrom_coverage":"null","mut_spec":{"A":[0,12474,3724,1847],"G":[13422,0,3799,2800],"C":[2843,3873,0,13209],"T":[1890,3679,12479,0]},"af_hist":{"usingLogScaleAF":false,"afHistBins":{"6":9626,"8":130,"12":13106,"16":168,"18":11621,"25":12332,"31":9381,"33":168,"37":8728,"41":97,"43":6914}},"coverage_hist":{"quartiles":[57,50,44],"whiskers":[70,31]},"length_hist":{"quartiles":[101,101,101],"whiskers":[101,101]},"frag_hist":{"quartiles":[342,301,263],"whiskers":[421,184]},"mapq_hist":{"quartiles":[60,60,60],"whiskers":[60,60]},"coverage_hist_no_outliers":{"31":0.005022,"32":0.005582,"33":0.006415,"34":0.007484,"35":0.008803,"36":0.010433,"37":0.012406,"38":0.014685,"39":0.017289,"40":0.020048,"41":0.022943,"42":0.025974,"43":0.028879,"44":0.031759,"45":0.034374,"46":0.036817,"47":0.038707,"48":0.040279,"49":0.041342,"50":0.041919,"51":0.041877,"52":0.041344,"53":0.040415,"54":0.038906,"55":0.037139,"56":0.03486,"57":0.032435,"58":0.029845,"59":0.027178,"60":0.024483,"61":0.021751,"62":0.019178,"63":0.01678,"64":0.014483,"65":0.012322,"66":0.010429,"67":0.008729,"68":0.00727,"69":0.006002,"70":0.004924}},"uid":"a215eeec-fbd","name":"NA12891.exome","description":null,"ancestry":{"background":604,"data":[-0.31890483438439093,-1.4071403255097141,"EUR"]},"created_at":"2019-07-18T15:12:05.413Z","updated_at":"2019-07-18T15:12:05.413Z","kindred_id":50,"sample_id":3263,"paternal_id":null,"maternal_id":null,"sex":1,"affection_status":1,"client_name":"11002","pedigree":{"kindred_id":"b537452d-9852-4605-8fd5-c90635d2824c","sample_id":3263,"paternal_id":null,"maternal_id":null,"sex":1,"affection_status":1},"vcf_sample_name":"NA12891","files":{"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam","tbi":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12891.vcf.gz.tbi","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12891.vcf.gz","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam.bai"}},"3":{"id":3264,"metrics":{"file_location":"s3","median_read_coverage":"54","affected_status":"Unaffected","var_snp_count":"76289","first_mates":"17447820","var_indel_count":"8644","read_coverage_iqr":"14","mapped_reads":"34860088","second_mates":"17456304","failed_qc":"0","total_reads":"34904124","ts_tv_ratio":"2.15153","proper_pairs":"98.8257","pedigree":"Pedigree","var_other_count":"3973","variant_count":"86702","singletons":"60944","strand_bias":"1.00962","duplicate_rate":"0.00513074","paired_end_reads":"34904124","both_mates_mapped":"34799144"},"distributions":{"chrom_coverage":"null","mut_spec":{"A":[0,12463,3559,1856],"G":[13629,0,3840,2873],"C":[2887,3861,0,13485],"T":[1896,3435,12505,0]},"af_hist":{"usingLogScaleAF":false,"afHistBins":{"6":9273,"8":167,"12":13729,"16":160,"18":11622,"25":12305,"31":9407,"33":177,"37":8747,"41":93,"43":6914}},"coverage_hist":{"quartiles":[61,54,47],"whiskers":[75,33]},"length_hist":{"quartiles":[101,101,101],"whiskers":[101,101]},"frag_hist":{"quartiles":[346,304,266],"whiskers":[426,186]},"mapq_hist":{"quartiles":[60,60,60],"whiskers":[60,60]},"coverage_hist_no_outliers":{"33":0.003492,"34":0.004287,"35":0.005242,"36":0.006456,"37":0.007819,"38":0.009511,"39":0.011355,"40":0.013482,"41":0.015836,"42":0.018351,"43":0.020962,"44":0.023706,"45":0.026578,"46":0.029313,"47":0.031882,"48":0.034269,"49":0.036385,"50":0.038211,"51":0.039557,"52":0.040429,"53":0.040868,"54":0.040863,"55":0.040346,"56":0.039526,"57":0.038203,"58":0.03667,"59":0.034774,"60":0.032686,"61":0.030352,"62":0.028027,"63":0.025475,"64":0.023028,"65":0.020662,"66":0.018333,"67":0.016085,"68":0.014101,"69":0.012246,"70":0.010549,"71":0.009019,"72":0.007637,"73":0.006424,"74":0.005359,"75":0.00444}},"uid":"f414795e-ced","name":"NA12892.exome","description":null,"ancestry":{"background":604,"data":[-0.2512083937845698,-1.4816045103941913,"EUR"]},"created_at":"2019-07-18T15:12:05.413Z","updated_at":"2019-07-18T15:12:05.413Z","kindred_id":50,"sample_id":3264,"paternal_id":null,"maternal_id":null,"sex":2,"affection_status":1,"client_name":"11002","pedigree":{"kindred_id":"b537452d-9852-4605-8fd5-c90635d2824c","sample_id":3264,"paternal_id":null,"maternal_id":null,"sex":2,"affection_status":1},"vcf_sample_name":"NA12892","files":{"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam.bai","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12892.vcf.gz","tbi":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12892.vcf.gz.tbi"}}};

    },


  },
  created: function() {
  },
  mounted: function() {
  },
  computed:  {
    ...mapGetters(['getPedigreeData', 'getPedigree', 'getVariantsCount', 'getCustomCoverage', 'getReviewCaseBadge', 'getVariantsByInterpretation', 'getModelInfos', 'getGeneSet', 'getCaseSummary', 'getBuildName', 'getAnalysisProgressStatus', 'getLaunchedFromMosaicFlag', 'getSelectedGenesForVariantsReview', 'getGenesTop', 'getSourceForGenes', 'getGlobalgenePhenotypeHits']),

    percentComplete: function() {
      let self = this;
      let taskCount = 0;
      let completeTaskCount = 0;
      self.analysis.payload.steps.forEach(function(step) {
        step.tasks.forEach(function(task) {
          taskCount++;
          if (task.complete) {
            completeTaskCount++;
          }
        })
      })
      return self.round(completeTaskCount / taskCount, 2) * 100;
    }
  }
}

</script>
