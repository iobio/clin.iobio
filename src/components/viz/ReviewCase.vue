<style lang="sass"  >

@import ../../assets/sass/variables


#review-case-panel
  padding: 10px 20px 5px 30px
  /*overflow-y: auto*/
  height: -webkit-fill-available
  height: -moz-available
  background-color:  white

  .sub-heading 
    font-size: 16px
    font-weight: 500
    color: #6a6a6a
    padding-bottom: 10px
  

  #edit-description-button
    .material-icons
      color: $app-button-color
      font-size: 18px !important
  
  hr
    margin-top: 0 !important

  svg
    #minTextgetBamStats
      font-weight: 600 !important
    #minLine
      stroke-dasharray: 3 1 !important
      stroke-width: 2px !important
    #medianLine
      stroke-width: 2px !important
      stroke: $current-color !important
      stroke-dasharray: 8 2 !important
    .g-main
      rect
        fill: #75a2c1ba  !important
        stroke: #265073

    .minCoverageInput
      width: 50px !important

    .g-main
      .scores
        rect
          fill: #a2a2a2b3  !important
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
    // margin-left: -5px !important
    margin-left: 26px !important
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

  i.material-icons.good-coverage
    color: #9cc231  !important
    
  .pedigree-help  
    i.material-icons
      font-size: 18px !important
         

</style>

<template>

  <div id="review-case-panel" >

    <div class="review-section">

      <div style="display:flex;flex-direction:row;justify-content:flex-start">
          <div class="container" style="padding:5px">
            <div class="sub-heading">
                Case Summary
                <v-btn  small depressed v-if='canEditCaseSummary'
                @click='onEditProject'
                id='edit-description-button' style='margin-left:20px'>
                </vbtn>
                <v-icon>edit</v-icon>
              </v-btn>
            </div>

            <v-card class="reviewCase">
              <v-card-text>
                {{ caseSummary.description }}
              </v-card-text>
            </v-card>
          </div>

        <div v-if="false" class="subsection">
          <div class="card-subheading">Condition / Phenotype Search Terms</div>
          <div v-for="(phenotype, index) in phenotypeList" class="phenotype-search-term">
            {{phenotype}}
          </div>
        </div>
      </div>

     
    </div>


    <div v-if="modelInfos && modelInfos.length" class="sub-heading" style="margin-left:10px">
                Sample Quality
    </div>

    <v-card style="margin-left:10px;margin-right:10px">

    
      <div v-if="customData && modelInfos && modelInfos.length && !customSavedAnalysis">
        
        <!-- Header  -->
        <div class="container" style="height:75px">
          <div class="row" style="margin-left:100px; margin-right:20px">
            <div class="col-md-3">
              <div class="heading ml-10">
                <span>Sample</span>
                <span class="pedigree-help ml-1">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="grey"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >
                        info
                      </v-icon>
                    </template>
                    <span>
                      <img width="325px" src="../../assets/images/pedigree_tooltip.png" alt="Pedigree help">
                    </span>
                  </v-tooltip>
                </span>
              </div>
            </div>
            <div class="col-md-5" style="display:flex">
              <span>
                <div class="heading mr-4" style="margin-left:90px">
                  Read Coverage
                </div>
              </span>
              <span>
                <v-text-field
                        id="minCoverageInput"
                      label="Expected Coverage"
                      outlined
                      dense
                      value="minCutoff"
                      v-model.number="minCutoff"
                        style="width: 150px"
                ></v-text-field>
              </span>
            </div>
            <div class="col-md-4">
              <div class="heading" style="margin-left:90px">
                Variant Types
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="container">
          <div style="margin-left:100px; margin-right:20px" class="row">
            <div style="width:100%" v-for="(modelInfo,idx) in modelInfos" :key="idx">
              <hr>
              <!-- Pedigree -->
              <div v-if="sampleIdsAndRelationships != null" class="col-md-3 capitalize" >
                <div class="capitalize" style="text-align: center; width: 150px">
                  <strong>{{sampleIdsAndRelationships[idx].split(" ")[1]}}</strong>
                  <br>
                  {{sampleIdsAndRelationships[idx].split(" ")[0]}}
                </div>
                <PedigreeGraph :data="allPedigreeDataArrays[idx]" :id="sampleUuids[idx]" :width="100" :height="85" :pedigree="pedigree"></PedigreeGraph>
              </div>
              <!-- End pedigree -->
              
              <!-- Read coverage -->
              <div class="col-md-5">
                <div v-if="!coverageStatsReceived">
                  <SamplingLoader/>
                </div>
                <div v-if="coverageStatsReceived">
                  <div style="margin-left:150px">
                    <span class="sampled-count">{{ bam_total_reads[idx] | to-formatLabel}} </span>
                    <span> Reads sampled</span>
                  </div>
                  <div class="row">
                    <div class="col-md-8">
                      <BarChart :data="coverageDataArray[idx]" :width="400" :height="150" :x-domain="xDomain" :y-domain="yDomain" :median-coverage="medianCoverages[idx]" :minCutoff="minCutoff"></BarChart>
                    </div>
                    <div class="col-md-4">
                      <div style="padding-top: 20px" v-show="goodCoverage(idx)">
                      <v-tooltip top class="valign">
                        <template v-slot:activator="{ on }">
                          <v-icon class="good-coverage" v-on="on" top color="green"
                            @click="">check_circle
                          </v-icon>
                        </template>
                        <span>Median coverage is above expected coverage threshold of {{minCutoff}}X</span>

                      </v-tooltip>
                        <div v-if="badCoverage" style=" display: inline-flex; width: 120px; line-height: 16px; font-size: 12px; padding-left: 5px;"></div>
                      </div>
                      <div style="padding-top: 20px" v-show="!goodCoverage(idx)">
                            <v-icon v-on="on"     @click=""
                              top color="#B33A3A">mdi-alert-circle
                            </v-icon>
                        <div v-if="badCoverage" style=" display: inline-flex; width: 120px; line-height: 14px; font-size: 13px; padding-left: 5px;">Median coverage is below expected coverage threshold of {{minCutoff}}X</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End read coverage -->
              
              <!-- Variants count -->
              <div class="col-md-4">
                <CustomVcfStats v-if="variantsArrayForSamples" :modelInfos="modelInfo" :idx="idx" :customData="customData"
                  @variants-count="setCustomVariantCounts($event)">
                </CustomVcfStats>
                
                <CustomBamStats v-if="coverageDataArray && bedDataLoaded" :modelInfos="modelInfo" :idx="idx" :customData="customData" :bedFileData="bed"
                  @coverage-reads-count="setCustomReadsCount($event)"
                  @coverage-histos-data="setCoverageHistosData($event)">
                </CustomBamStats>
              </div>
              <!-- End variant counts  -->
            </div>
            <!-- end loop -->

          </div>
          <!-- end row -->

        </div>
        <!-- end container -->
        <hr><br><br>

      </div>
      

      <div v-if="customSavedAnalysis && statsReceived && coverageStatsReceived">
        <div style=" width: 100%; display: inline-flex; flex-direction: row; justify-content: space-around; padding-bottom: 0">
          <!-- <div class="heading" style="margin-right: 90px">Sample</div>  -->
          <div class="heading" style="margin-right: 5px">
            <span>Sample</span>
            <span class="pedigree-help ml-1">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="grey"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    info
                  </v-icon>
                </template>
                <span>
                  <img width="325px" src="../../assets/images/pedigree_tooltip.png" alt="Pedigree help">
                </span>
              </v-tooltip>
            </span>
          </div> 
          <div class="heading" style="margin-right: 90px; display:flex;flex-direction:row;justify-content:space-between">
            <div style="margin-right: 20px">Read Coverage</div>
            <v-text-field
                    id="minCoverageInput"
                  label="Expected Coverage"
                  outlined
                  dense
                  value="minCutoff"
                  v-model.number="minCutoff"
                    style="width: 150px"
            ></v-text-field>
          </div>

          <div class="heading" style="margin-right: 50px">Variant Types</div>
        </div>
        <div v-if="sampleIdsAndRelationships != null" v-for="(d, i) in varCountsArray" >
          <hr>
          <div style=" width: 100%; display: inline-flex; flex-direction: row; justify-content: space-around;">
              <div style="text-align: center; width: 150px" class="capitalize">
                <strong>{{sampleIdsAndRelationships[i].split(" ")[1]}}</strong>
                <br>
                {{sampleIdsAndRelationships[i].split(" ")[0]}}
                <PedigreeGraph :data="allPedigreeDataArrays[i]" :id="sampleUuids[i]" :width="100" :height="85" :pedigree="pedigree"></PedigreeGraph>
              </div>

            <div style="display: inline-flex;">
              <BarChart :data="coverageDataArray[i]" :width="400" :height="150" :x-domain="xDomain" :y-domain="yDomain" :median-coverage="medianCoverages[i]" :minCutoff="minCutoff"></BarChart>

              <div style="padding-top: 20px" v-show="goodCoverage(i)">
              <v-tooltip top class="valign">
                <template v-slot:activator="{ on }">
                  <v-icon class="good-coverage" v-on="on" top color="green"
                           @click="">check_circle</v-icon>
                </template>
                <span>Median coverage is above expected coverage threshold of {{minCutoff}}X</span>

              </v-tooltip>
                <div v-if="badCoverage" style=" display: inline-flex; width: 120px; line-height: 16px; font-size: 12px; padding-left: 5px;"></div>
              </div>
              <div style="padding-top: 20px" v-show="!goodCoverage(i)">
                    <v-icon v-on="on"     @click=""
                            top color="#B33A3A">mdi-alert-circle</v-icon>


                <div v-if="badCoverage" style=" display: inline-flex; width: 120px; line-height: 14px; font-size: 13px; padding-left: 5px;">Median coverage is below expected coverage threshold of {{minCutoff}}X</div>

              </div>

            </div>
            <QualitativeBarChart :data="varCountsArray[i].counts" :customData="customData" :width="300" :height="150" style="padding-top: 0"></QualitativeBarChart>

          </div>
       </div>
       <hr>
      </div>
      <div v-if="customData && !coverageStatsReceived && customSavedAnalysis">
        <center>
          <SkeletonLoadersReview :rowsLength="modelInfos.length">
          </SkeletonLoadersReview>
        </center>
      </div>



      <div v-if="isSorted">
        <div style=" width: 100%; display: inline-flex; flex-direction: row; justify-content: space-around; padding-bottom: 0; margin-bottom: -6px">
          <div class="heading" style="margin-right: 0">
            <span>Sample</span>
            <span class="pedigree-help ml-1">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="grey"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    info
                  </v-icon>
                </template>
                <span>
                  <img width="325px" src="../../assets/images/pedigree_tooltip.png" alt="Pedigree help">
                </span>
              </v-tooltip>
            </span>
          </div> 
          <div class="heading" style="margin-right: 75px; display:flex;flex-direction:row;justify-content:space-between">
          <div style="margin-right: 20px">Read Coverage</div>
          <v-text-field
                  id="minCoverageInput"
                label="Expected Coverage"
                outlined
                dense
                value="minCutoff"
                v-model.number="minCutoff"
                  style="width: 150px"
        ></v-text-field></div>

          <div class="heading" style="margin-right: 50px">Variant Types</div>
        </div>
        <hr>
        <div v-if="sampleIdsAndRelationships != null" v-for="(d, i) in sampleIdsAndRelationships" >
          <div style=" width: 100%; display: inline-flex; flex-direction: row; justify-content: space-around;">
              <div style="text-align: center; width: 150px" class="capitalize">
                <strong>{{sampleIdsAndRelationships[i].split("\t")[1]}}</strong>
                <br>
                {{sampleIdsAndRelationships[i].split("\t")[0]}}
                <PedigreeGraph :data="allPedigreeDataArrays[i]" :id="sampleUuids[i]" :width="100" :height="85" :pedigree="pedigree"></PedigreeGraph>
              </div>

            <div style="display: inline-flex;">
              <BarChart :data="coverageDataArray[i]" :width="400" :height="150" :x-domain="xDomain" :y-domain="yDomain" :median-coverage="medianCoverages[i]" :minCutoff="minCutoff"></BarChart>

              <div style="padding-top: 20px" v-show="goodCoverage(i)">
              <v-tooltip top class="valign">
                <template v-slot:activator="{ on }">
                  <v-icon class="good-coverage" v-on="on" top color="green"
                           @click="">check_circle</v-icon>
                </template>
                <span>Median coverage is above expected coverage threshold of {{minCutoff}}X</span>

              </v-tooltip>
                <div v-if="badCoverage" style=" display: inline-flex; width: 120px; line-height: 16px; font-size: 12px; padding-left: 5px;"></div>
              </div>
              <div style="padding-top: 20px" v-show="!goodCoverage(i)">
                    <v-icon v-on="on"     @click=""
                            top color="#B33A3A">mdi-alert-circle</v-icon>


                <div v-if="badCoverage" style=" display: inline-flex; width: 120px; line-height: 14px; font-size: 13px; padding-left: 5px;">Median coverage is below expected coverage threshold of {{minCutoff}}X</div>

              </div>

            </div>
            <!--<BoxPlot :width="250" :height="150" :data="exomeMedianCoverageData"></BoxPlot>-->
            <QualitativeBarChart :data="varCountsArray[i].counts" :customData="customData" :width="300" :height="150" style="padding-top: 0"></QualitativeBarChart>

          </div>
          <hr>
       </div>
      </div>

    </v-card>

    <div style="height:20px"></div>

  </div>
</template>


<script>
import PedigreeGraph from './PedigreeGraph.vue';
import BoxPlot from './BoxPlot'
import AppIcon       from '../partials/AppIcon.vue';
import QualitativeBarChart from './QualitativeBarChart.vue'
import BarChart from './BarChart.vue'
import SkeletonLoadersReview from '../partials/SkeletonLoadersReview.vue'
import CustomVcfStats from './CustomVcfStats.vue'
import CustomBamStats from './CustomBamStats.vue'
import SamplingLoader from './SamplingLoader.vue'

import Vue from 'vue';

import Vcfiobio           from '../../models/Vcf.iobio'
var vcfiobio = new Vcfiobio();

import { BamStats } from '../../models/BamStats.iobio.js';

import analysisData  from '../../data/analysis.json'

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'review-case',
  components: {
    QualitativeBarChart,
    BarChart,
    PedigreeGraph,
    AppIcon,
    BoxPlot,
    SkeletonLoadersReview,
    CustomVcfStats,
    CustomBamStats,
    SamplingLoader,
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
    launchedFromMosaic: null,
    customData:   null,
    bedFileUrl: null,
    customSavedAnalysis: null,
    canEditCaseSummary: null
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
      varCountsArray: [],
      isSorted: false,
      demoData: null,
      on: null,
      badCoverage: false,
      minCutoff: 30,
      medianCoverages: null,
      reviewCaseBadges: null,
      badCoverageCount: null,
      averageCoverage: null,
      statsReceived: false,
      coverageStatsReceived: false,
      transition: 'scale-transition',
      coverageHistosData: [],
      selectedBamURL: "http://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam",
      backendSource: "backend.iobio.io",
      showFullURL: false,
      siblingCount: 0,

      // default sampling values
      binNumber: 20,
      binSize: 40000,
      sampleMultiplier: 1,
      sampleMultiplierLimit: 4,
      totalReads: 0,

      exomeSampling: false,
      draw: false,

      sampleStats: {},

      readDepthConversionRatio: 0,

      bam: {},
      // bed: {},
      bed: null,
      readDepthChartData: [],
      references: [],

      selectedSeqId: 'all',
      coverageBrushRange: {},

      // Percent Chart Data
      mappedReadsData: [],
      forwardStrandsData: [],
      properPairsData: [],
      singletonsData: [],
      bothMatesData: [],
      duplicatesData: [],

      // Histogram Chart Data
      readOutliers: false,
      readCoverageData: [],
      lengthData: [],
      qualityData: [],

      lengthXAxisLabel: 'Fragment Length',
      qualityXAxisLabel: 'Mapping Quality',

      // this is used to achieve a "natural sort". see
      // https://stackoverflow.com/a/38641281/943814
      sorter: new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      }),

      coverageMean: 0,
      bamCounter: 0,
      variantsArrayForSamples: null,
      bam_total_reads: [],
      bedDataLoaded: false,
    }

  },

  mounted: function(){
    if(this.launchedFromMosaic) {
      this.varCountsArray = this.allVarCounts;

      this.formatVarCountsArray();
      this.convertPropsToData();
      this.buildPage();

    }
    else if(this.customSavedAnalysis){
      let analysis = this.allAnalysis; //gets analysis from Vuex store.

      this.modelInfosData = analysis.custom_model_infos;
      this.reviewCaseBadges = this.getReviewCaseBadge;

      //Set variant counts
      this.varCountsArray = analysis.custom_variants_count;
      this.statsReceived = true;
      this.setVariantsCount(this.varCountsArray)

      //Set coverage data
      this.coverageHistosData = analysis.custom_coverage_data;
      this.formatCoverageData();
      this.populateDomains();
      this.populateCoverageMedians();
      this.populateBadCoverageCount();
      this.coverageStatsReceived = true;
      this.setCoverageData(this.coverageHistosData);

      //Build pedigree
      this.allPedigreeDataArrays = [];
      this.setPedigree(this.pedigree)
      this.populateRelationshipMap();
      this.populateSampleIdsFromCustom(this.pedigree);
      this.populateSampleIdsAndRelationships();
      this.populateReviewCaseBadges();
      this.pedigreeDataArray = this.buildPedFromTxt(this.pedigree);

      let len = Object.keys(this.sampleIdRelationshipMap).length;

      for(let i = 0; i < len; i++){
        this.allPedigreeDataArrays.push(this.pedigreeDataArray)
      }
      this.setPedigreeData(this.allPedigreeDataArrays)

    }
    else if(this.customData){
      if(this.bedFileUrl!==undefined && this.bedFileUrl){
        fetch(this.bedFileUrl)
            .then(response => response.text())
            .then(bed => {
              const defaultBed = bed.replace(/chr/g, '');
              this.bed = defaultBed;
              this.buildCustomPage();
            })
            .catch(error => {
              console.log("error", error);
            });
      }
      else if(this.bedFileUrl===undefined || this.bedFileUrl == null){
        this.bed = undefined;
        this.buildCustomPage();
      }
    }
    else{
      this.buildPage();
    }

  },

  methods: {
    ...mapActions(['setPedigreeData', 'setPedigree', 'setVariantsCount', 'setCoverageData', 'setReviewCaseBadge']),

    getBamStatsFromCustomData: function(modelInfos){
      let promises = [];
      for(let i=0; i<modelInfos.length; i++){
        promises.push(this.loadBamStats(modelInfos[i].bam, modelInfos[i].bai, modelInfos[i].sample));
      }

      Promise.all(promises).then((results) => {
        results.forEach(stats => {
          addToCoverageDataArray(stats)
        })
        toFormatCoverage()
      })

      var addToCoverageDataArray = (stats) => {
        this.coverageHistosData.push({
          "id":"3261",
          "coverage": stats
        })
        this.setCoverageData(this.coverageHistosData);
        //When coverageData is read from analysis object, it will still need to call the format functions
      }

      var toFormatCoverage = () => {
        this.formatCoverageData();
        this.populateDomains();
        this.populateCoverageMedians();
        this.populateBadCoverageCount();
        this.coverageStatsReceived = true
      }

    },
    loadBamStats: function(selectedBamURL, selectedBaiURL, sample) {
      return new Promise((resolve, reject) => {
        // let bed = undefined;
        let bed = this.bed;
        // this.selectedBaiURL = undefined;
        let bam = {}
        if (selectedBamURL && selectedBamURL != '' ) {
          bam = new BamStats(this.backendSource, selectedBamURL, {
            bai: selectedBaiURL
          });

          this.goBam(this.region, resolve, reject, bam, bed);
        }
      })
    },

    goBam: function (region, resolve, reject, bam, bed) {
      let refIndex = 0;

      bam.getHeader().then((header) => {
        this.references = header.sq.filter((sq) => {
          return !filterRef(sq.name);
        })
        .map((sq) => {
          return {
            id: sq.name,
            length: sq.end,
          };
        });
      });

      // get read depth
      bam.estimateBaiReadDepth((name, index, ref) => {

          // turn off read depth loading msg

          if (ref.depths.length > 0 && !filterRef(name)) {
            // Have to use Object.freeze here to prevent Vue from
            // recursively setting up data listeners, which causes huge
            // performance issues with data this big.
            Vue.set(this.readDepthChartData, index, Object.freeze(ref.depths));

            if (!this.draw) {
              this.draw = true;
            }
          }
        },
        function doneCallback() {

        const keys = Object.keys(bam.readDepth);

        const allPoints = keys
          //.sort(this.sorter.compare)
          .filter(function (key) {
            if (filterRef(key))
              return false
            if (bam.readDepth[key].depths.length > 0)
              return true
          }.bind(this))
          .map(function (key) {
            return {
              name: key,
              data: bam.readDepth[key].depths,
              sqLength: bam.readDepth[key].sqLength,
            }
          }.bind(this));

        allPoints
          .sort((a, b) => this.sorter.compare(a.name, b.name));

        var start = region ? region.start : undefined;
        var end = region ? region.end : undefined;

        bam.getHeader().then(() => {
          // Set selected seq & region
          if (!region || (region && region.chr == 'all'))
            this.setSelectedSeq('all', start, end, resolve, reject, bam, bed);
          else
            this.setSelectedSeq(region.chr, start, end, resolve, reject, bam, bed);
        });

      }.bind(this),
      (err) => {
        this.$emit('error');
      })
    },


    setSelectedSeq: function (selected, start, end, resolve, reject, bam, bed) {
      this.selectedSeqId = selected;

      var seqDataIds = this.getSelectedSeqIds(resolve, reject, bam, bed);

      // start sampling
      if (start != undefined && end != undefined) {
        this.goSampling({sampling: this.sampling, sequenceNames: seqDataIds, 'start': start, 'end': end});
        this.draw = false; // force re-draw so brush region is set correctly
        setTimeout(function () {
          this.setBrush(start, end)
          this.draw = true;
        }.bind(this), 200);
      } else {
        this.goSampling({sampling: this.sampling, sequenceNames: seqDataIds},resolve, reject, bam, bed);
      }
    },


    getSelectedSeqIds: function (resolve, reject, bam, bed) {
      if (this.selectedSeqId == 'all') {
        return Object.keys(bam.readDepth)
          .filter(function (key) {
            if (filterRef(key))
              return false
            if (bam.readDepth[key].depths.length > 0)
              return true
          }.bind(this))
      } else
        return [this.selectedSeqId];
    },

    goSampling: function (options, resolve, reject, bam, bed) {
      // add default options
      options = $.extend({
        exomeSampling: this.exomeSampling, //'checked' == $("#depth-distribution input").attr("checked"),
        bed: bed,
        onEnd: function () {
        }
      }, options);

      this.totalReads = 0;

      // update selected stats
      bam.sampleStats(function (data, error, end) {
        if ( error!=undefined && error!='' ){
          alert(error);
        }
        else {

          this.sampleStats = data.coverage_hist;
          this.bamCounter = this.bamCounter+1;
          // console.log("sample sets data in review case", this.sampleStats)
          resolve(this.sampleStats)
        }
      }.bind(this), options);
    },


    buildCustomPage: function(){

      let self = this;
      this.bedDataLoaded = true;
      
      this.allPedigreeDataArrays = [];

      this.modelInfosData = this.modelInfos;

      this.setPedigree(this.pedigree); //Set state in Vuex store

      this.populateRelationshipMap();
      this.populateSampleIdsFromCustom(this.pedigree);
      this.populateSampleIdsAndRelationships();
      this.variantsArrayForSamples = new Array(this.modelInfos.length); 
      // console.log("this.variantsArrayForSamples", this.variantsArrayForSamples);
      // this.getVarCountFromCustomData(this.modelInfos);
      this.coverageHistosData = new Array(this.modelInfos.length);
      this.coverageDataArray = new Array(this.modelInfos.length);
      // this.getBamStatsFromCustomData(this.modelInfos);
      this.populateReviewCaseBadges();

      this.pedigreeDataArray = this.buildPedFromTxt(this.pedigree);

      let len = Object.keys(self.sampleIdRelationshipMap).length;



      for(let i = 0; i < len; i++){
        this.allPedigreeDataArrays.push(this.pedigreeDataArray)
      }
      this.setPedigreeData(this.allPedigreeDataArrays)
    },

    populateSampleIdsAndRelationships(){
      this.sampleIdsAndRelationships = [];

      let keys = Object.keys(this.sampleIdRelationshipMap);
      this.sampleUuids = [];

      for(let i = 0; i < keys.length; i++){
        let key = keys[i];
        let uuid = this.getUuidFromId(key);
        this.sampleUuids.push(uuid);
        this.sampleIdsAndRelationships.push(key + " " + this.sampleIdRelationshipMap[key]);
      }
    },

    getUuidFromId(id){
      if(id === "0"){
        return 0;
      }
      return this.sampleIds.indexOf(id) + 1000;
    },


    populateSampleIdsFromCustom(txt){
      this.sampleIds = [];
      let txtCopy  = txt.slice();
        let pedLines = txtCopy.split('\n');
        for (let i = 0; i < pedLines.length; i++) {
          let splitLine = pedLines[i].split(/\s+|\,/g)
          if(splitLine && splitLine[0] !== "" && !isNaN(parseInt(splitLine[4]))) {
            this.sampleIds.push(splitLine[1]);
          }
        }
    },

    buildPedFromTxt(txt) {
      let pedLines = txt.split('\n');
      let pedArr = [];
      for (let i = 0; i < pedLines.length; i++) {
        let splitLine = pedLines[i].split(/\s+|\,/g)

        if(splitLine && splitLine[0] !== "" && !isNaN(parseInt(splitLine[4]))) {

          let sample = {id: this.getUuidFromId(splitLine[1])};
          let pedigree = {
            kindred_id: splitLine[0],
            sample_id: this.getUuidFromId(splitLine[1]),
            paternal_id: this.getUuidFromId(splitLine[2]),
            maternal_id: this.getUuidFromId(splitLine[3]),
            sex: parseInt(splitLine[4]),
            affection_status: parseInt(splitLine[5])
          }

          sample.pedigree = pedigree;

          if (sample.id) {
            pedArr.push(sample);
          }
        }
      }
      return pedArr;
    },

    getVcfStats(refs, options, vcf, tbi, sample){
      return new Promise((resolve, reject) => {
        vcfiobio.getStats(refs, options, vcf, tbi, sample, function(data) {
          var obj = {
            sample: sample,
            data: data.var_type
          }
          resolve(obj)
        });
      })
    },

    getVarCountFromCustomData(modelInfos){
      var options = {
        "samplingMultiplier": 1,
        "binSize": 80000,
        "binNumber": 50,
        "minFileSamplingSize": 1000000,
        "start": 1
      }

      var refs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      let promises = [];
      for(let i=0; i<modelInfos.length; i++){
        promises.push(this.getVcfStats(refs, options, modelInfos[i].vcf, modelInfos[i].tbi, modelInfos[i].sample))
      }
      Promise.all(promises).then((results)=>{
        results.forEach(stats => {
          addToVarCountsArray(stats.data, stats.sample)
        })
      })

      var addToVarCountsArray = (stats, sample)=>{
        var indels = stats.INS + stats.DEL
        this.statsReceived = true;
        this.varCountsArray.push({
          "id":"3261",
          "sample": sample,
          "counts": {
            "SNP": stats.SNP,
            "INS": stats.INS,
            "DEL": stats.DEL
          }
        })
        this.setVariantsCount(this.varCountsArray)
      }
    },
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

      let famName = "family";
      //Temporary workaround for custom data..
      if(this.customData){
        if(this.modelInfos.length === 1){
          famName = "individual"
        }
        else if(this.modelInfos.length === 2) {
          famName = "duo"
        }
        else if(this.modelInfos.length === 3) {
          famName = "trio"
        }
        else if (this.modelInfos.length > 3) {
          famName = "family"
        }
        this.reviewCaseBadges = [{label: "samples (" + famName + ")", count: this.modelInfos.length  }];
        if(this.badCoverage){
          this.reviewCaseBadges.push({label:  "failed QC", count: this.badCoverageCount, class: 'failed'})
        }
        this.$emit('update', this.reviewCaseBadges);
        this.setReviewCaseBadge(this.reviewCaseBadges)
      }
      else {
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
        this.reviewCaseBadges = [{label: "samples (" + famName + ")", count: this.sampleIds.length  }];

        if(this.badCoverage){
          this.reviewCaseBadges.push({label:  "failed QC", count: this.badCoverageCount, class: 'failed'})
        }
        this.$emit('update', this.reviewCaseBadges);
      }

    },

    goodCoverage(i){
      if(this.medianCoverages[i] >= this.minCutoff){
        return true;
      }
      this.badCoverage = true;
      return false;
    },


    formatVarCountsArray(){
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
      this.populateCoverageMedians();
      this.sortData();
      this.populateBadCoverageCount();
      this.populateReviewCaseBadges();

    },

    populateCoverageMedians(){
      this.medianCoverages = [];
      this.averageCoverage = 0;
      for(let i = 0; i < this.coverageDataArray.length; i++){
        let data = this.coverageDataArray[i];
        let medianCoverage = this.calculateMedianCoverage(data);
        this.medianCoverages.push(medianCoverage);
        this.averageCoverage += parseInt(medianCoverage);
      }
      this.averageCoverage = this.averageCoverage / this.coverageDataArray.length;
      this.$emit('updateCoverage', this.averageCoverage.toFixed(2));

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

    convertPropsToData(){
      this.pedigreeData = this.pedigree;
      this.modelInfosData = this.modelInfos;
      this.coverageHistosData = this.coverageHistos;
    },


    sortData(){

      let tempPed = [];
      let tempCoverage = [];
      let tempVarCounts = [];
      let tempSampleRelationship = [];
      let tempSamples = [];
      let tempUuids = [];
      let tempMedianCoverages = [];

      for(let i = 0; i < this.siblingCount+3; i++){
        tempPed.push(null);
        tempCoverage.push(null);
        tempVarCounts.push(null);
        tempSampleRelationship.push(null);
        tempSamples.push(null);
        tempUuids.push(null);
        tempMedianCoverages.push(null);
      }
      
      for(let i = 0; i < this.sortedIndices.length; i++){
        let index = this.sortedIndices[i];
        // console.log("index is", index);
        // console.log("relation and id", this.sampleIdsAndRelationships[index]);
        // console.log("samples", this.sampleIds[index]);
        tempPed[i] = this.pedigreeDataArray[index];
        // tempCoverage[i] = this.coverageDataArray[index];
        // tempVarCounts[i] = this.varCountsArray[index];
        tempSampleRelationship[i] = this.sampleIdsAndRelationships[index];
        tempSamples[i] = this.sampleIds[index];
        tempUuids[i] = this.sampleUuids[index];
        // tempMedianCoverages[i] = this.medianCoverages[index];
        
        if(this.launchedFromMosaic){
          var var_count_idx; 
          for(var j=0; j<this.varCountsArray.length; j++){
            if(this.varCountsArray[j].sample === this.sampleIds[index]){
              var_count_idx = j;
              // console.log("j", this.varCountsArray[j].sample);
            }
          }
          tempVarCounts[i] = this.varCountsArray[var_count_idx];
          tempMedianCoverages[i] = this.varCountsArray[var_count_idx].median;

          
          
          var coverage_idx; 
          for(var k=0; k<this.varCountsArray.length; k++){
            if(this.varCountsArray[k].sample === this.sampleIds[index]){
              coverage_idx = k;
              // console.log("k", this.varCountsArray[k].sample);
            }
          }
          tempCoverage[i] = this.coverageDataArray[coverage_idx];
        }
        else {
          tempCoverage[i] = this.coverageDataArray[index];
          tempVarCounts[i] = this.varCountsArray[index];
          tempMedianCoverages[i] = this.medianCoverages[index];

        }

        
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
      this.siblingCount = 0;
      this.sortedIndices = [null, null, null, null];

      for(let i = 0; i < this.sampleIdsAndRelationships.length; i++){

        let arr = this.sampleIdsAndRelationships[i].split("\t")
        let relationship = arr[0];

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
           this.sortedIndices[3+this.siblingCount] = i;
           this.siblingCount++;
           this.sortedIndices.push(null);
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
          affection_status: d.pedigree.affection_status,
          maternal_id: d.pedigree.maternal_id,
          paternal_id: d.pedigree.paternal_id,
          sample_id: d.pedigree.sample_id,
          sex: d.pedigree.sex
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

      let len = Object.keys(this.sampleIdRelationshipMap).length;
      for(let i = 0; i < len; i++){
        this.allPedigreeDataArrays.push(this.pedigreeDataArray);
      }
    },
    
    setCustomVariantCounts(data){
      const { counts, idx } = data; 
      this.variantsArrayForSamples[idx] = counts;
      this.setVariantsCount(this.variantsArrayForSamples);
    },
    
    setCustomReadsCount(data){
      const { coverageArr, idx, total_reads } = data
      this.bam_total_reads[idx] = total_reads;
      // this.formatCoverageData();
      this.coverageDataArray[idx] = coverageArr; 
      if(this.checkifNoEmptyIndex(this.coverageDataArray)){
        this.coverageStatsReceived = true;
        this.populateDomains();
        this.populateCoverageMedians();
        this.populateBadCoverageCount();
      }
    },
    
    setCoverageHistosData(data){
      const { coverageHistosData, idx } = data;
      this.coverageHistosData[idx] = coverageHistosData;
      if(this.checkifNoEmptyIndex(this.coverageHistosData)){
        this.setCoverageData(this.coverageHistosData);
      }
    },
    
    checkifNoEmptyIndex(arr){
      var bool = true;
      for (var i = 0; i < arr.length; i++) {
        if(arr[i] === undefined){
          bool = false;
        }
      }
      return bool;
    },


    onEditProject: function() {
      this.$emit("on-edit-project")
    }
  },
  computed: {
    ...mapGetters(['getPedigreeData', 'getVariantsCount', 'getCustomCoverage', 'getReviewCaseBadge', 'getVariantsByInterpretation', 'getModelInfos', 'getGeneSet', 'getCaseSummary', 'allAnalysis']),
  },
  watch: {
    minCutoff: function(){
      this.populateBadCoverageCount();
      this.populateReviewCaseBadges();
    }
  },
}

const validRefs = {};
for (let i = 1; i <= 22; i++) {
  validRefs[i] = true;
  validRefs['chr' + i] = true;
}
validRefs['X'] = true;
validRefs['Y'] = true;

function filterRef(ref) {
  return validRefs[ref] === undefined;
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
    font-family: $iobio-font
    color: $text-color



  .reviewCase
    color: $text-color
    line-height: 16px
    font-size: 14px
    font-weight: normal
    font-family: $iobio-font


    
.v-tooltip__content
  opacity: 1 !important
  padding: 2px

</style>


