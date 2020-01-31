<style lang="sass"  >

@import ../../assets/sass/variables

#review-case-panel
  padding: 10px 20px 5px 30px
  /*overflow-y: auto*/
  height: -webkit-fill-available
  height: -moz-available
  background-color:  white

  svg
    #minText
      font-weight: 600 !important
    #minLine
      stroke-dasharray: 3 1 !important
      stroke-width: 2px !important
    #medianLine
      stroke-width: 2px !important
      stroke: #404040 !important
      stroke-dasharray: 8 2 !important
    .g-main
      rect
        fill: #3388c2ba !important
        stroke: #265073



    .g-main
      .scores
        rect
          fill: #3388c2ba !important
          stroke: none !important


  .avatar.big
    border: #d5d5d5 solid thin
    background-color: white
    color: $text-color
    margin-right: 7px


  .sample
    line-height: 15px
    font-size: 13px
    .rel
      display: inline-block
      width: 70px
    .name
      display: inline-block
      width: 100px

  .review-section
    margin-bottom: 25px

    .subsection
      margin-right: 50px

  .pedigree-graph
    margin-left: -5px !important
    margin-top:  5px !important


  .card-title
    font-size: 18px
    color:   $app-header-color
    margin-bottom: 5px
    display: inline-block

  .card-heading
    display: inline-block
    font-size: 16px
    color:  $app-header-color
    margin-bottom: 10px

  .card-subheading
    display: inline-block
    font-size: 14px
    color:  $app-header-color
    margin-bottom: 10px


  .card
    min-height: 70px !important

  i.material-icons
    font-size: 35px !important
  i.mdi-alert-circle
    font-size: 35px !important

</style>

<template>

  <div id="review-case-panel" >

        <div class="review-section">

          <div style="display:flex;flex-direction:row;justify-content:flex-start">
            <!--<div  class="subsection"  >-->
              <!--<span class="card-subheading">{{ caseSummary.name }} </span>-->
              <!--<div style="display:flex">-->
                <!--<div style="margin-left:15px">-->
                  <!--<div  class="sample" v-for="modelInfo in modelInfos" :key="modelInfo.sample">-->
                    <!--<span class="rel">{{ modelInfo.relationship }}</span>-->
                    <!--<span class="name">{{ modelInfo.sample }}</span>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</div>-->
            <!--</div>-->

              <div style="width:80%">
                <span class="heading">Case Summary </span>
                <div class="reviewCase">
                {{ caseSummary.description }}
                </div>

                <!--<br>-->
                <!--<div class="heading">-->
                  <!--Sample Quality-->
                <!--</div>-->
              </div>

            <div v-if="false" class="subsection">
              <div class="card-subheading">Condition / Phenotype Search Terms</div>
              <div v-for="(phenotype, index) in phenotypeList" class="phenotype-search-term">
                {{phenotype}}
              </div>
            </div>
          </div>
      </div>


    <div v-if="isSorted">
      <div style=" width: 100%; display: inline-flex; flex-direction: row; justify-content: space-around; padding-bottom: 10px">
        <div class="heading" style="margin-right: 130px">Sample</div> <div class="heading" style="margin-right: 130px">Read Coverage</div><div class="heading">Variant Types</div>
      </div>
      <div v-for="(d, i) in sampleIdsAndRelationships" >
        <div style=" width: 100%; display: inline-flex; flex-direction: row; justify-content: space-around;">
            <div style="text-align: center; width: 150px" class="capitalize">
              {{sampleIdsAndRelationships[i]}}
              <PedigreeGraph :data="allPedigreeDataArrays[i]" :id="sampleUuids[i]" :width="100" :height="75" :pedigree="pedigree"></PedigreeGraph>
            </div>

          <div style="display: inline-flex;">
            <BarChart :data="coverageDataArray[i]" :width="400" :height="150" :x-domain="xDomain" :y-domain="yDomain" :median-coverage="medianCoverages[i]" :minCutoff="minCutoff" :onHover="onHover"></BarChart>

            <div style="padding-top: 20px" v-show="goodCoverage(i)">
            <v-tooltip top class="valign">
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" top color="green"
                        @mouseover="onHover = true" @mouseleave="onHover = false" @click="">check_circle</v-icon>
              </template>
              <span>Median coverage is above expected {{isExomeText}} coverage threshold of {{minCutoff}}X</span>

            </v-tooltip>
              <div v-if="badCoverage" style=" display: inline-flex; width: 120px; line-height: 16px; font-size: 12px; padding-left: 5px;"></div>
            </div>
            <div style="padding-top: 20px" v-show="!goodCoverage(i)">
                  <v-icon v-on="on"     @mouseover="onHover = true; " @mouseleave="onHover = false" @click=""
                          top color="#B33A3A">mdi-alert-circle</v-icon>


              <div v-if="badCoverage" style=" display: inline-flex; width: 120px; line-height: 14px; font-size: 13px; padding-left: 5px;">Median coverage is below expected {{isExomeText}} coverage threshold of {{minCutoff}}X</div>

            </div>

          </div>
          <!--<BoxPlot :width="250" :height="150" :data="exomeMedianCoverageData"></BoxPlot>-->
          <QualitativeBarChart :data="varCountsArray[i].counts" :width="300" :height="150" style="padding-top: 20px"></QualitativeBarChart>

        </div>
     </div>
    </div>
    <div style="height:20px"></div>
  </div>
</template>


<script>
import PedigreeGraph from './PedigreeGraph.vue';
import BoxPlot from './BoxPlot'
import AppIcon       from '../partials/AppIcon.vue';
import QualitativeBarChart from './QualitativeBarChart.vue'
import BarChart from './BarChart.vue'

import analysisData  from '../../data/analysis.json'

export default {
  name: 'review-case',
  components: {
    QualitativeBarChart,
    BarChart,
    PedigreeGraph,
    AppIcon,
    BoxPlot
  },
  props: {
    workflow:    null,
    analysis:    null,
    caseSummary: null,
    modelInfos:  null,
    pedigree:    null,
    sampleId:    null,
    allVarCounts: null,
    coverageHistos: null,
    launchedFromMosaic: null
  },
  data() {
    return {
      uuid: 10,
      sampleIds: null,
      sampleUuids: null,
      sampleIdsAndRelationships: null,
      pedigreeDataArray: null,
      allPedigreeDataArrays: null,
      coverageDataArray: null,
      xDomain: null,
      yDomain: null,
      sampleIdRelationshipMap: null,
      sortedIndices: null,
      varCountsArray: null,
      isSorted: false,
      demoData: null,
      onHover: false,
      on: null,

      exomeMedianCoverageData: {
        min: 15,
        q1: 30,
        q2: 45,
        q3: 60,
        max: 75,
      },

      badCoverage: false,

      isExome: false,
      isExomeText: null,
      minCutoff: null,
      medianCoverages: null,
      reviewCaseBadges: null,
      badCoverageCount: null,

    }

  },

  mounted: function(){
    this.varCountsArray = this.allVarCounts;

    if(this.launchedFromMosaic) {
      this.formatVarCountsArray();
      this.convertPropsToData();
      this.buildPage();
    }
    else{
      this.overridePropsWithDemoData();
      this.buildPage();
    }
  },

  methods: {

    populateBadCoverageCount(){
      this.badCoverageCount = 0;
      for(let i = 0; i < this.medianCoverages.length; i++){
        if(this.medianCoverages[i] < this.minCutoff) {
          this.badCoverage = true;
          this.badCoverageCount += 1;
          }

        }
    },

    populateReviewCaseBadges(){

      let famName = "Family";

      if(this.sampleIds.length === 1){
        famName = "individual"
      }

      if(this.sampleIds.length === 2){
        famName = "duo"
      }
      else if(this.sample)
      if(this.sampleIds.length === 3){
        famName = "trio"
      }
      else if(this.sampleIds.length === 4){
        famName = "quad"
      }
      else if(this.sampleIds.length > 4){
        famName = "family"
      }
      this.reviewCaseBadges = [{label: this.sampleIds.length + " samples (" + famName + ")" }];

      if(this.badCoverage){
        this.reviewCaseBadges.push({label:  + this.badCoverageCount + " failed QC"})
      }
      this.$emit('update', this.reviewCaseBadges);
    },

    goodCoverage(i){
      if(this.medianCoverages[i] >= this.minCutoff){
        return true;
      }
      this.badCoverage = true;
      return false;
    },


    formatVarCountsArray(){3
      let tempVarCounts = this.varCountsArray;

      for(let i = 0; i < tempVarCounts.length; i++){
        tempVarCounts[i].counts.SNP = parseInt(tempVarCounts[i].counts.SNP);
        tempVarCounts[i].counts.indel = parseInt(tempVarCounts[i].counts.indel);
        tempVarCounts[i].counts.other = parseInt(tempVarCounts[i].counts.other);
      }
      this.varCountsArray = tempVarCounts;
    },

    buildPage(){
      this.populateRelationshipMap();
      this.formatPedigreeData();
      this.formatCoverageData();
      this.assignProbandToEachSample();
      this.populateDomains();
      this.sortIndicesByRelationship();
      this.checkIsExome();
      this.populateCoverageMedians();
      this.sortData();
      this.populateBadCoverageCount();
      this.populateReviewCaseBadges();
    },

    populateCoverageMedians(){
      this.medianCoverages = [];
      for(let i = 0; i < this.coverageDataArray.length; i++){
        let data = this.coverageDataArray[i];
        let medianCoverage = this.calculateMedianCoverage(data);
        this.medianCoverages.push(medianCoverage);
      }
    },

    calculateMedian(values) {
      let total = 0;

      for(let i = 0; i < values.length; i++){
        total += values[i];
      }

      return total / 2;
    },


    findMedianFromCummulativeFrequencies(medianFreq, cumFreqs){
      for(let i =0; i < cumFreqs.length; i++){
        if(medianFreq >= cumFreqs[i][1] && medianFreq <= cumFreqs[i][2]){
          return cumFreqs[i][0];
        }
      }
      return -1;
    },

    calculateMedianCoverage(data) {
      let freqs = [];
      let cumFreqs = [];
      let start = 0;
      let end = 0;
      for (let i = 0; i < data.length; i++) {
        freqs.push(data[i][1] * 1000000);
        end += (data[i][1] * 1000000);
        let d = [data[i][0], start, end];
        start = end;
        cumFreqs.push(d);
      }
      const medianFreq = this.calculateMedian(freqs);
      let medianCoverage = this.findMedianFromCummulativeFrequencies(medianFreq, cumFreqs);
      return medianCoverage;
    },

    checkIsExome(){
      let totalVarCounts = 0;
      for(let i = 0; i < this.varCountsArray.length; i++){
        let counts = this.varCountsArray[i].counts;

        let indel = counts.indel;

        if(isNaN(indel)){
          indel = 0;
        }
        totalVarCounts = totalVarCounts + (counts.SNP + indel + counts.other);
      }

      let averageCount = totalVarCounts / this.varCountsArray.length;

      if(averageCount < 1000000){
        this.isExome = true;
        this.minCutoff = 51;
        this.isExomeText = "exome"
      }
      else if(averageCount >= 1000000){
        this.isExome = false;
        this.minCutoff = 30;
        this.isExomeText = "genome"
      }
    },


    convertPropsToData(){
      this.pedigreeData = this.pedigree;
      this.modelInfosData = this.modelInfos;
      this.coverageHistosData = this.coverageHistos;
    },

    overridePropsWithDemoData(){
      this.pedigreeData ={"0":{"id":3261,"metrics":{"second_mates":"16534422","test2_77850c8c":"15","proper_pairs":"99.1149","failed_qc":"0","strand_bias":"1.00551","ts_tv_ratio":"2.05896","variant_count":"88110","pedigree":"Pedigree","var_other_count":"4124","duplicate_rate":"0.00348412","affected_status":"Unaffected","file_location":"s3","both_mates_mapped":"32943377","var_snp_count":"77618","singletons":"55024","var_indel_count":"8672","first_mates":"16503521","total_reads":"33037943","mapped_reads":"32998401","read_coverage_iqr":"15","paired_end_reads":"33037943","median_read_coverage":"51"},"distributions":{"chrom_coverage":"null","mut_spec":{"A":[0,12636,4063,1854],"G":[13569,0,3808,2863],"C":[2901,3961,0,13330],"T":[1833,4091,12709,0]},"af_hist":{"usingLogScaleAF":false,"afHistBins":{"6":17695,"8":206,"12":9919,"16":203,"18":10661,"25":11775,"31":8610,"33":156,"37":7772,"41":104,"43":6914}},"coverage_hist":{"quartiles":[59,51,44],"whiskers":[74,29]},"length_hist":{"quartiles":[101,101,101],"whiskers":[101,101]},"frag_hist":{"quartiles":[363,319,277],"whiskers":[449,191]},"mapq_hist":{"quartiles":[60,60,60],"whiskers":[60,60]},"coverage_hist_no_outliers":{"29":0.004871,"30":0.005242,"31":0.005779,"32":0.006489,"33":0.007382,"34":0.008438,"35":0.009793,"36":0.011365,"37":0.013201,"38":0.015237,"39":0.017403,"40":0.019552,"41":0.021913,"42":0.024191,"43":0.026483,"44":0.028585,"45":0.030652,"46":0.032406,"47":0.033824,"48":0.035041,"49":0.035973,"50":0.036446,"51":0.036685,"52":0.036585,"53":0.036086,"54":0.035348,"55":0.034207,"56":0.032812,"57":0.031296,"58":0.029653,"59":0.027818,"60":0.02603,"61":0.02397,"62":0.02191,"63":0.019862,"64":0.017845,"65":0.016009,"66":0.014165,"67":0.012458,"68":0.010852,"69":0.009428,"70":0.008084,"71":0.006864,"72":0.00579,"73":0.004839,"74":0.003993}},"uid":"0ced8131-34f","name":"NA12877.exome","description":null,"ancestry":{"background":604,"data":[-0.1026610208789221,-1.4242045534784185,"EUR"]},"created_at":"2019-07-18T15:12:05.413Z","updated_at":"2019-07-18T15:12:05.413Z","kindred_id":50,"sample_id":3261,"paternal_id":3263,"maternal_id":3264,"sex":1,"affection_status":1,"client_name":"11002","pedigree":{"kindred_id":"b537452d-9852-4605-8fd5-c90635d2824c","sample_id":3261,"paternal_id":3263,"maternal_id":3264,"sex":1,"affection_status":1},"vcf_sample_name":"NA12877","files":{"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12877.exome.bam","tbi":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12877.vcf.gz.tbi","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12877.vcf.gz","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12877.exome.bam.bai"}},"1":{"id":3262,"metrics":{"duplicate_rate":"0.00414535","ts_tv_ratio":"2.14514","first_mates":"16282871","total_reads":"32568521","var_indel_count":"8816","var_other_count":"4006","singletons":"87747","file_location":"s3","strand_bias":"1.0064","mapped_reads":"32505279","second_mates":"16285650","pedigree":"Pedigree","median_read_coverage":"50","read_coverage_iqr":"13","variant_count":"86759","failed_qc":"0","proper_pairs":"98.8382","var_snp_count":"76210","paired_end_reads":"32568521","both_mates_mapped":"32417532","affected_status":"Affected"},"distributions":{"chrom_coverage":"null","mut_spec":{"A":[0,12505,3647,1839],"G":[13474,0,3814,2815],"C":[2882,3847,0,13423],"T":[1858,3529,12577,0]},"af_hist":{"usingLogScaleAF":false,"afHistBins":{"6":2095,"8":124,"12":16045,"16":165,"18":13794,"25":14207,"31":10273,"33":177,"37":8805,"41":93,"43":6914}},"coverage_hist":{"quartiles":[57,50,44],"whiskers":[70,31]},"length_hist":{"quartiles":[101,101,101],"whiskers":[101,101]},"frag_hist":{"quartiles":[366,321,277],"whiskers":[455,188]},"mapq_hist":{"quartiles":[60,60,60],"whiskers":[60,60]},"coverage_hist_no_outliers":{"31":0.004288,"32":0.005304,"33":0.00659,"34":0.008097,"35":0.009874,"36":0.01195,"37":0.014323,"38":0.01694,"39":0.019677,"40":0.022559,"41":0.025512,"42":0.028514,"43":0.031331,"44":0.034076,"45":0.036573,"46":0.038604,"47":0.040373,"48":0.04158,"49":0.042213,"50":0.042424,"51":0.042139,"52":0.041356,"53":0.040086,"54":0.038539,"55":0.036649,"56":0.03441,"57":0.032007,"58":0.029539,"59":0.026872,"60":0.024301,"61":0.021637,"62":0.019012,"63":0.01666,"64":0.014452,"65":0.012375,"66":0.01055,"67":0.008907,"68":0.007446,"69":0.006186,"70":0.005052}},"uid":"72de2cd5-97f","name":"NA12878.exome","description":null,"ancestry":{"background":604,"data":[-0.31801863225785604,-1.4812542726924995,"EUR"]},"created_at":"2019-07-18T15:12:05.413Z","updated_at":"2019-07-18T15:12:05.413Z","kindred_id":50,"sample_id":3262,"paternal_id":3263,"maternal_id":3264,"sex":2,"affection_status":2,"client_name":"11002","pedigree":{"kindred_id":"b537452d-9852-4605-8fd5-c90635d2824c","sample_id":3262,"paternal_id":3263,"maternal_id":3264,"sex":2,"affection_status":2},"vcf_sample_name":"NA12878","files":{"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam.bai","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12878.vcf.gz","tbi":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12878.vcf.gz.tbi"}},"2":{"id":3263,"metrics":{"duplicate_rate":"0.0093774","var_indel_count":"8622","total_reads":"32234312","var_snp_count":"76039","affected_status":"Unaffected","file_location":"s3","proper_pairs":"98.3934","second_mates":"16115247","median_read_coverage":"50","mapped_reads":"32190556","singletons":"61628","pedigree":"Pedigree","both_mates_mapped":"32128928","read_coverage_iqr":"13","ts_tv_ratio":"2.10934","var_other_count":"3940","strand_bias":"1.01811","failed_qc":"0","paired_end_reads":"32234312","variant_count":"86331","first_mates":"16119065"},"distributions":{"chrom_coverage":"null","mut_spec":{"A":[0,12474,3724,1847],"G":[13422,0,3799,2800],"C":[2843,3873,0,13209],"T":[1890,3679,12479,0]},"af_hist":{"usingLogScaleAF":false,"afHistBins":{"6":9626,"8":130,"12":13106,"16":168,"18":11621,"25":12332,"31":9381,"33":168,"37":8728,"41":97,"43":6914}},"coverage_hist":{"quartiles":[57,50,44],"whiskers":[70,31]},"length_hist":{"quartiles":[101,101,101],"whiskers":[101,101]},"frag_hist":{"quartiles":[342,301,263],"whiskers":[421,184]},"mapq_hist":{"quartiles":[60,60,60],"whiskers":[60,60]},"coverage_hist_no_outliers":{"31":0.005022,"32":0.005582,"33":0.006415,"34":0.007484,"35":0.008803,"36":0.010433,"37":0.012406,"38":0.014685,"39":0.017289,"40":0.020048,"41":0.022943,"42":0.025974,"43":0.028879,"44":0.031759,"45":0.034374,"46":0.036817,"47":0.038707,"48":0.040279,"49":0.041342,"50":0.041919,"51":0.041877,"52":0.041344,"53":0.040415,"54":0.038906,"55":0.037139,"56":0.03486,"57":0.032435,"58":0.029845,"59":0.027178,"60":0.024483,"61":0.021751,"62":0.019178,"63":0.01678,"64":0.014483,"65":0.012322,"66":0.010429,"67":0.008729,"68":0.00727,"69":0.006002,"70":0.004924}},"uid":"a215eeec-fbd","name":"NA12891.exome","description":null,"ancestry":{"background":604,"data":[-0.31890483438439093,-1.4071403255097141,"EUR"]},"created_at":"2019-07-18T15:12:05.413Z","updated_at":"2019-07-18T15:12:05.413Z","kindred_id":50,"sample_id":3263,"paternal_id":null,"maternal_id":null,"sex":1,"affection_status":1,"client_name":"11002","pedigree":{"kindred_id":"b537452d-9852-4605-8fd5-c90635d2824c","sample_id":3263,"paternal_id":null,"maternal_id":null,"sex":1,"affection_status":1},"vcf_sample_name":"NA12891","files":{"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam","tbi":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12891.vcf.gz.tbi","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12891.vcf.gz","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam.bai"}},"3":{"id":3264,"metrics":{"file_location":"s3","median_read_coverage":"54","affected_status":"Unaffected","var_snp_count":"76289","first_mates":"17447820","var_indel_count":"8644","read_coverage_iqr":"14","mapped_reads":"34860088","second_mates":"17456304","failed_qc":"0","total_reads":"34904124","ts_tv_ratio":"2.15153","proper_pairs":"98.8257","pedigree":"Pedigree","var_other_count":"3973","variant_count":"86702","singletons":"60944","strand_bias":"1.00962","duplicate_rate":"0.00513074","paired_end_reads":"34904124","both_mates_mapped":"34799144"},"distributions":{"chrom_coverage":"null","mut_spec":{"A":[0,12463,3559,1856],"G":[13629,0,3840,2873],"C":[2887,3861,0,13485],"T":[1896,3435,12505,0]},"af_hist":{"usingLogScaleAF":false,"afHistBins":{"6":9273,"8":167,"12":13729,"16":160,"18":11622,"25":12305,"31":9407,"33":177,"37":8747,"41":93,"43":6914}},"coverage_hist":{"quartiles":[61,54,47],"whiskers":[75,33]},"length_hist":{"quartiles":[101,101,101],"whiskers":[101,101]},"frag_hist":{"quartiles":[346,304,266],"whiskers":[426,186]},"mapq_hist":{"quartiles":[60,60,60],"whiskers":[60,60]},"coverage_hist_no_outliers":{"33":0.003492,"34":0.004287,"35":0.005242,"36":0.006456,"37":0.007819,"38":0.009511,"39":0.011355,"40":0.013482,"41":0.015836,"42":0.018351,"43":0.020962,"44":0.023706,"45":0.026578,"46":0.029313,"47":0.031882,"48":0.034269,"49":0.036385,"50":0.038211,"51":0.039557,"52":0.040429,"53":0.040868,"54":0.040863,"55":0.040346,"56":0.039526,"57":0.038203,"58":0.03667,"59":0.034774,"60":0.032686,"61":0.030352,"62":0.028027,"63":0.025475,"64":0.023028,"65":0.020662,"66":0.018333,"67":0.016085,"68":0.014101,"69":0.012246,"70":0.010549,"71":0.009019,"72":0.007637,"73":0.006424,"74":0.005359,"75":0.00444}},"uid":"f414795e-ced","name":"NA12892.exome","description":null,"ancestry":{"background":604,"data":[-0.2512083937845698,-1.4816045103941913,"EUR"]},"created_at":"2019-07-18T15:12:05.413Z","updated_at":"2019-07-18T15:12:05.413Z","kindred_id":50,"sample_id":3264,"paternal_id":null,"maternal_id":null,"sex":2,"affection_status":1,"client_name":"11002","pedigree":{"kindred_id":"b537452d-9852-4605-8fd5-c90635d2824c","sample_id":3264,"paternal_id":null,"maternal_id":null,"sex":2,"affection_status":1},"vcf_sample_name":"NA12892","files":{"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam.bai","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12892.vcf.gz","tbi":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12892.vcf.gz.tbi"}}};
      this.modelInfosData = [{"relationship":"proband","affectedStatus":"unaffected","sex":"male","name":"NA12877.exome","sample":"NA12877","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12877.vcf.gz","tbi":null,"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12877.exome.bam","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12877.exome.bam.bai"},{"relationship":"sibling","affectedStatus":"affected","sex":"female","name":"NA12878.exome","sample":"NA12878","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12878.vcf.gz","tbi":null,"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam.bai"},{"relationship":"father","affectedStatus":"unaffected","sex":"male","name":"NA12891.exome","sample":"NA12891","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12891.vcf.gz","tbi":null,"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam.bai"},{"relationship":"mother","affectedStatus":"unaffected","sex":"female","name":"NA12892.exome","sample":"NA12892","vcf":"https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome_NA12892.vcf.gz","tbi":null,"bam":"https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam","bai":"https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam.bai"}];
      this.sampleIdData = 3261;
      this.varCountsArray = [{"id":"3261","counts":{"SNP":77618,"indel":8672,"other":4124}},{"id":"3261","counts":{"SNP":76289,"indel":8644,"other":3973}},{"id":"3261","counts":{"SNP":76039,"indel":8622,"other":3940}},{"id":"3261","counts":{"SNP":76210,"indel":8816,"other":4006}}];
      this.coverageHistosData = [{"id":"3261","coverage":{"29":0.004871,"30":0.005242,"31":0.005779,"32":0.006489,"33":0.007382,"34":0.008438,"35":0.009793,"36":0.011365,"37":0.013201,"38":0.015237,"39":0.017403,"40":0.019552,"41":0.021913,"42":0.024191,"43":0.026483,"44":0.028585,"45":0.030652,"46":0.032406,"47":0.033824,"48":0.035041,"49":0.035973,"50":0.036446,"51":0.036685,"52":0.036585,"53":0.036086,"54":0.035348,"55":0.034207,"56":0.032812,"57":0.031296,"58":0.029653,"59":0.027818,"60":0.02603,"61":0.02397,"62":0.02191,"63":0.019862,"64":0.017845,"65":0.016009,"66":0.014165,"67":0.012458,"68":0.010852,"69":0.009428,"70":0.008084,"71":0.006864,"72":0.00579,"73":0.004839,"74":0.003993}},{"id":"3261","coverage":{"31":0.004288,"32":0.005304,"33":0.00659,"34":0.008097,"35":0.009874,"36":0.01195,"37":0.014323,"38":0.01694,"39":0.019677,"40":0.022559,"41":0.025512,"42":0.028514,"43":0.031331,"44":0.034076,"45":0.036573,"46":0.038604,"47":0.040373,"48":0.04158,"49":0.042213,"50":0.042424,"51":0.042139,"52":0.041356,"53":0.040086,"54":0.038539,"55":0.036649,"56":0.03441,"57":0.032007,"58":0.029539,"59":0.026872,"60":0.024301,"61":0.021637,"62":0.019012,"63":0.01666,"64":0.014452,"65":0.012375,"66":0.01055,"67":0.008907,"68":0.007446,"69":0.006186,"70":0.005052}},{"id":"3261","coverage":{"33":0.003492,"34":0.004287,"35":0.005242,"36":0.006456,"37":0.007819,"38":0.009511,"39":0.011355,"40":0.013482,"41":0.015836,"42":0.018351,"43":0.020962,"44":0.023706,"45":0.026578,"46":0.029313,"47":0.031882,"48":0.034269,"49":0.036385,"50":0.038211,"51":0.039557,"52":0.040429,"53":0.040868,"54":0.040863,"55":0.040346,"56":0.039526,"57":0.038203,"58":0.03667,"59":0.034774,"60":0.032686,"61":0.030352,"62":0.028027,"63":0.025475,"64":0.023028,"65":0.020662,"66":0.018333,"67":0.016085,"68":0.014101,"69":0.012246,"70":0.010549,"71":0.009019,"72":0.007637,"73":0.006424,"74":0.005359,"75":0.00444}},{"id":"3261","coverage":{"31":0.005022,"32":0.005582,"33":0.006415,"34":0.007484,"35":0.008803,"36":0.010433,"37":0.012406,"38":0.014685,"39":0.017289,"40":0.020048,"41":0.022943,"42":0.025974,"43":0.028879,"44":0.031759,"45":0.034374,"46":0.036817,"47":0.038707,"48":0.040279,"49":0.041342,"50":0.041919,"51":0.041877,"52":0.041344,"53":0.040415,"54":0.038906,"55":0.037139,"56":0.03486,"57":0.032435,"58":0.029845,"59":0.027178,"60":0.024483,"61":0.021751,"62":0.019178,"63":0.01678,"64":0.014483,"65":0.012322,"66":0.010429,"67":0.008729,"68":0.00727,"69":0.006002,"70":0.004924}}];


    },


    sortData(){

      let tempPed = [null,null,null,null];
      let tempCoverage = [null,null,null,null];
      let tempVarCounts = [null,null,null,null];
      let tempSampleRelationship = [null,null,null,null];
      let tempSamples = [null,null,null,null];
      let tempUuids = [null,null,null,null];
      let tempMedianCoverages = [null,null,null,null]

      for(let i = 0; i < this.sortedIndices.length; i++){
        let index = this.sortedIndices[i];
        tempPed[index] = this.pedigreeDataArray[i];
        tempCoverage[index] = this.coverageDataArray[i];
        tempVarCounts[index] = this.varCountsArray[i];
        tempSampleRelationship[index] = this.sampleIdsAndRelationships[i];
        tempSamples[index] = this.sampleIds[i];
        tempUuids[index] = this.sampleUuids[i];
        tempMedianCoverages[index] = this.medianCoverages[i]
      }

      this.pedigreeDataArray = tempPed.filter(function(el) { return el; });
      this.coverageDataArray = tempCoverage.filter(function(el) { return el; });
      this.varCountsArray = tempVarCounts.filter(function(el) { return el; });
      this.sampleIdsAndRelationships = tempSampleRelationship.filter(function(el) { return el; });
      this.sampleIds = tempSamples.filter(function(el) { return el; });
      this.sampleUuids = tempUuids.filter(function(el) { return el; });
      this.medianCoverages = tempMedianCoverages.filter(function(el) { return el; });

      this.isSorted = true;
    },

    sortIndicesByRelationship(){
      this.sortedIndices = [null, null, null, null];
      for(let i = 0; i < this.sampleIds.length; i++){
        let relationship = this.getRelationshipFromId(this.sampleIds[i]);
         if(relationship === "proband"){
           this.sortedIndices[0] = i;
         }
         else if(relationship === "mother"){
           this.sortedIndices[1] = i;
         }
         else if(relationship === "father"){
           this.sortedIndices[2] = i;
         }
         else if(relationship === "sibling"){
           this.sortedIndices[3] = i;
         }
        }

      this.sortedIndices = this.sortedIndices.filter(function(el) { return el !== null; });

    },

    getRelationshipFromId(id){
      if(this.sampleIdRelationshipMap.hasOwnProperty(id)){
        return this.sampleIdRelationshipMap[id];
      }
      return "relationship unknown";
    },

    populateRelationshipMap(){
      this.sampleIdRelationshipMap = {};
      for(let i = 0; i < this.modelInfosData.length; i++){
        this.sampleIdRelationshipMap[this.modelInfos[i].sample] = this.modelInfos[i].relationship
      }
    },


    populateDomains(){
      let xMin = Math.min();
      let xMax = Math.max();
      let yMin = Math.min();
      let yMax = Math.max();

      for(let i = 0; i < this.coverageDataArray.length; i++){
        for(let j = 0; j < this.coverageDataArray[i].length; j++){
          if(parseInt(this.coverageDataArray[i][j][0]) < xMin){
            xMin = parseInt(this.coverageDataArray[i][j][0]);
          }
          if(parseInt(this.coverageDataArray[i][j][0]) > xMax) {
            xMax = parseInt(this.coverageDataArray[i][j][0]);
          }
          if(this.coverageDataArray[i][j][1] < yMin){
            yMin = this.coverageDataArray[i][j][1];
          }
          if(this.coverageDataArray[i][j][1] > yMax) {
            yMax = this.coverageDataArray[i][j][1];
          }
        }
      }
      this.xDomain = [xMin, xMax+1];
      this.yDomain =  [yMin, yMax];
    },

    formatPedDict(d){
      let sampleIdRelationship = this.getRelationshipFromId(d.vcf_sample_name) + '\t' + d.vcf_sample_name ;
      this.sampleIdsAndRelationships.push(sampleIdRelationship);
      this.sampleUuids.push(d.id);
      this.sampleIds.push(d.vcf_sample_name);
      let pedDict ={
        id: d.id,
        pedigree: {
          affection_status: d.affection_status,
          maternal_id: d.maternal_id,
          paternal_id: d.paternal_id,
          sample_id: d.sample_id,
          sex: d.sex
        }
      };
      return pedDict;
    },

    formatCoverageArray(d){
      let coverageArr = [];
      for(let k in d){
        const coords = [k, d[k]];
        coverageArr.push(coords);
      }
      return coverageArr;
    },

    formatPedigreeData(){
      this.pedigreeDataArray = [];
      this.sampleIds = [];
      this.sampleUuids = [];
      this.sampleIdsAndRelationships = [];
      for(const k in this.pedigreeData){
        const pedDict = this.formatPedDict(this.pedigreeData[k]);
        this.pedigreeDataArray.push(pedDict);
      }
    },

    formatCoverageData(){
      let self = this;
      self.coverageDataArray = [];
      this.coverageHistosData.forEach(function(d){
        const coverageArr = self.formatCoverageArray(d.coverage);
        self.coverageDataArray.push(coverageArr);
      });
    },

    assignProbandToEachSample(){
      this.allPedigreeDataArrays = [];
      for(let i = 0; i < 4; i++){
        this.allPedigreeDataArrays.push(this.pedigreeDataArray);
      }
    }
  },
  computed: {

  },
  watch: {
    coverageHistos: function(){
    },
    allVarCounts: function(){
    },
    pedigree: function(){
    }
  },
}
</script>

<style lang="sass" scoped>

  @import ../../assets/sass/variables

  .capitalize
    text-transform: capitalize


  .columnHeader
    font-size: 16px
    font-weight: 500
    font-family: $iobio-font


  .valign
    vertical-align: top


  .heading
    font-size: 16px
    font-weight: 500
    font-family: $iobio-font
    color: $text-color



  .reviewCase
    color: $text-color
    line-height: 16px
    font-size: 15px
    font-weight: normal
    font-family: $iobio-font



</style>


