/*
 * Home.vue
 *
 */
<style lang="sass"  >

@import ../../assets/sass/variables

.configError
  font-size: 16px

.configTitle
  font-size: 20px

.v-snack--right
  margin-right: 350px !important

.v-snack
  top: 0px !important

  .v-snack__wrapper
    min-width: 200px !important
    background-color: transparent !important

    .v-snack__content
      min-height: 35px !important
      padding-top: 10px !important
      padding-bottom: 2px !important
      font-size: 12px !important
      font-weight: 500 !important

.v-btn
  letter-spacing: initial !important

.theme--dark.v-toolbar.v-sheet
  background-color: $nav-color !important


$light-grey-background: #eaeaea
$horizontal-dashboard-height: 140px

.application--wrap, #application-content
  background-color: $light-grey-background

.v-content
  background-color: $light-grey-background



#clin-container
  background-color: $light-grey-background
  height: -webkit-fill-available
  height: -moz-available

  &.authenticated
    background-color: white

  #splash-screen
    background-color: $light-grey-background
    width: 100%
    display: flex
    justify-content: center
    height: 1024px

    .v-progress-circular
      color: $navy-blue !important
    h3
      color: $navy-blue !important

.clin-card
  background-color: white
  min-height: 600px
  padding: 0px



.major-shadow
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.49) !important
  -webkit-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.49) !important

.app-content
  margin-top: 0px
  margin-left: 0px
  border-top: $divider-color
  border-top-width: .5px
  border-top-style: none



#clin-container
  font-size: 14px

@media (min-width: 960px)
  .container
    max-width: 960px !important

@media (min-width: 1050px)
  .container
    max-width: 1050px !important

@media (min-width: 1175px)
  .container
    max-width: 1175px !important

@media (min-width: 1264px)
  .container
    max-width: 1264px !important

@media (min-width: 1330px)
  .container
    max-width: 1330px !important

@media (min-width: 1440px)
  .container
    max-width: 1440px !important

@media (min-width: 1550px)
  .container
    max-width: 1550px !important

@media (min-width: 1635px)
  .container
    max-width: 1635px !important

.i-passcode
  letter-spacing: 4px
  font-size: 42px

</style>



<template>
<div id="application-content" :class="{'workflow-new': newWorkflow ? true : false}">
  <landing-page
    v-if="!launchedFromMosaic && showLandingPage"
    :cohortModel="cohortModel"
    :launchedFromMosaic="launchedFromMosaic"
    @custom-model-info="customModelInfo"
    @setGeneSet="setGeneSet($event)"
    @set-ped-data="setPedData($event)"
    @set-custom-case-summary="setCustomCaseSummary($event)"
    @load-saved-input-config="loadSavedInputConfig($event)"
    @load-saved-analysis-custom-data="loadSavedAnalysisCustomData($event)"
    @setBedFileUrl="setBedFileUrl($event)"
    @setBuildForCustomData="setBuildForCustomData($event)"
    @set-imported-variants="setImportedVariants($event)">
  </landing-page>


  <v-dialog  width="500"  v-model="showConfigError"  >
    <v-card class="info-card full-width">
      <v-card-title style="justify-content:space-between">
        <span class="configTitle">{{ 'Error parsing config file'}}</span>
        <v-btn  @click="onClose" text class="close-button">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <div class="configError">
        {{configMessage}}
      </div>
    </v-card>
  </v-dialog>

  <navigation v-if="!showLandingPage && !showSplash && isAuthenticated  && workflow && analysis"
   :caseSummary="caseSummary"
   :analysis="analysis"
   :launchedFromMosaic="launchedFromMosaic"
   @show-save-analysis="toggleSaveModal(true)"
   :customData="customData">
  </navigation>


  <workflow v-if="!showLandingPage && !newWorkflow && iframesMounted && !showSplash && isAuthenticated && workflow && analysis"
   ref="workflowRef"
   :caseSummary="caseSummary"
   :analysisSteps="analysis.payload.steps"
   :workflow="workflow"
   @on-step-changed="onStepChanged"
   @on-task-changed="onTaskChanged"
   @on-task-completed="onTaskCompleted">
  </workflow>


  <workflow-nav v-if="!showLandingPage && newWorkflow && iframesMounted && !showSplash && isAuthenticated && workflow && analysis"
   ref="workflowRefNew"
   :caseSummary="caseSummary"
   :analysisSteps="analysis.payload.steps"
   :workflow="workflow"
   @on-step-changed="onStepChanged"
   @on-task-changed="onTaskChanged"
   @on-task-completed="onTaskCompleted">
  </workflow-nav>

  <div id="clin-container" style="display:flex" :class="{authenticated: isAuthenticated}">

    <div id="splash-screen" v-if="showSplash" >
      <v-card style="display:flex;justify-content:center;align-items:center;margin-top:100px;width:320px;max-height:100px">
        <v-progress-circular id="overall-progress" :size="22"  :width="2" color="accent-4"
          :indeterminate="true">
        </v-progress-circular>
        <h3  style="font-weight: 400;display: inline-block;padding-left: 6px;margin: 0px;" > {{ splashMessage }} </h3>
      </v-card>
    </div>



    <div style="width:100%;height:100%;padding: 0px"
    :class="{'app-content': true}"
    v-show="!showSplash && isAuthenticated " >
      <v-card  class="clin-card"
        v-if="analysis && workflow"
        v-show="analysis && workflow && currentStep == 1 && !showFindings  && !showLandingPage"
      >
        <review-case
        ref="reviewCaseRef"
        v-if="analysis && workflow && currentStep == 1"
        v-show="analysis && workflow"
        :workflow="workflow"
        :analysis="analysis.payload"
        :caseSummary="caseSummary"
        :modelInfos="modelInfos"
        :pedigree="rawPedigree"
        :sampleId="params.sample_id"
        :allVarCounts="allVarCounts"
        :coverageHistos="coverageHistos"
        :launchedFromMosaic="launchedFromMosaic"
        @update="updateReviewCaseBadges"
        @updateCoverage="updateAverageCoverage"
        :customData=customData
        :bedFileUrl="bedFileUrl"
        :customSavedAnalysis="customSavedAnalysis">
        </review-case>
      </v-card>


      <v-card  class="clin-card"
        v-if="analysis && workflow"
        v-show="analysis && workflow && currentStep == 2 && !showFindings && !showLandingPage"
      >
        <keep-alive>
          <PhenotypeExtractor
            v-if="analysis && workflow && currentStep == 2 && !showFindings && !showLandingPage"
            :phenotypes="analysis.payload.phenotypes"
            @summaryGenes="summaryGenes($event)"
            @saveSearchedPhenotypes="saveSearchedPhenotypes($event)"
            :VennDiagramData="analysis.payload.VennDiagramData"
            @GtrGeneList="GtrGeneList($event)"
            @PhenolyzerGeneList="PhenolyzerGeneList($event)"
            @HpoGeneList="HpoGeneList($event)"
            :AddedGenes="AddedGenes"
            @vennData="vennData($event)"
            :demoTextNote="analysis.payload.demoTextNote"
            @VennDiagramData="VennDiagramData($event)"
            :geneToDelete="geneToDelete">
          </PhenotypeExtractor>
        </keep-alive>

        <keep-alive>
          <GeneList
            v-if="analysis && workflow && currentStep == 2 && !showFindings && !showLandingPage"
            :summaryGeneList="analysis.payload.genesReport"
            @importedGenes="importedGenes($event)"
            @UpdateListOnDelete="UpdateListOnDelete($event)"
            :venn_diag_data="venn_diag_data"
            @bus_delete_gene="bus_delete_gene"
            @gene_to_delete=gene_to_delete($event)>
          </GeneList>
        </keep-alive>

      </v-card>


      <v-card  class="clin-card"
        v-if="analysis && workflow && !showLandingPage"
        v-show="analysis && workflow && currentStep == 4 || showFindings "
      >
        <findings
        ref="findingsRef"
        v-if="analysis && workflow && variantsByInterpretation && !showLandingPage"
        :genomeBuildHelper="genomeBuildHelper"
        :modelInfos="modelInfos"
        :caseSummary="caseSummary"
        :analysis="analysis"
        :variantsByInterpretation="variantsByInterpretation"
        :interpretationMap="interpretationMap">
        </findings>
      </v-card>

      <div v-show="!showLandingPage">
        <div id="gene-iframe" style="width:100%;height:1024px" v-show="!isAuthenticated || ((currentStep == 3) && !showFindings)">
          <iframe
          :src="apps.genefull.url"
          style="width:100%;height:100%" frameBorder="0">
          </iframe>
        </div>
      </div>

      <v-snackbar
        :timeout="snackbar.timeout"
        :top="snackbar.top"
        :bottom="snackbar.bottom"
        :center="snackbar.center"
        :left="snackbar.left"
        :right="snackbar.right"
        v-model="showSnackbar"
       >
        <span v-html="snackbar.message"></span>
        <v-btn
          v-if="snackbar.close" flat color="white"
          @click.native="showSnackbar = false">
          <v-icon>close</v-icon>
        </v-btn>

      </v-snackbar>

      <LoadingDialog
        v-if="generatingReport"
        :showIt="generatingReport"
        text="Generating report..."
      >
      </LoadingDialog>

      <!-- Pass code dialog -->
      <v-dialog
        v-model="showPassCode"
        :overlay="false"
        max-width="450px" persistent
      >
        <v-card class="full-width" style="height: auto;overflow-y:scroll">
          <v-card-title primary-title>
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="showPassCode=false"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <div class="container">
              The passcode for this saved analysis is:
              <br>
              <center>
                <span><h1 class="i-passcode">{{ passcode }}</h1></span>
              </center>
              <br>
              This passcode will be required when uploading the saved analysis config file to resume this analysis.
              Please make sure to write it down or <a @click="savePasscode">download </a> as it won't be show again.
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- end pass code dialog -->

      <!-- Bypassed genes dialog -->
      <v-dialog v-model="byPassedGenesDialog" persistent max-width="450">
        <v-card>
          <v-card-title class="headline">Warning</v-card-title>
          <v-card-text>
            Bypassing unknown gene:
            <span v-for="gene in byPassedGenes" :key="gene"> {{ gene }}  </span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn style="float:right" @click.native="closeByPassedGenesDialog">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--End Bypassed genes dialog -->


    </div>


  </div>
  <save-analysis-popup
    :showIt="showSaveModal"
    :analysis="analysis"
    @on-save-analysis="promiseSaveAnalysis({notify:true})"
    @on-cancel-analysis="onCancelAnalysis">
  </save-analysis-popup>
</div>
</template>


<script>
import Navigation    from  '../pages/Navigation.vue'
import Workflow      from  '../pages/Workflow.vue'
import WorkflowNav   from  '../pages/WorkflowNav.vue'
import ReviewCase    from  '../viz/ReviewCase.vue'
import Findings      from  '../viz/Findings.vue'
import AppIcon       from  '../partials/AppIcon.vue'
import LoadingDialog from '../partials/LoadingDialog.vue'
import LandingPage   from '../pages/LandingPage.vue'

import MosaicSession from  '../../models/MosaicSession.js'
import GenomeBuildHelper from '../../models/GenomeBuildHelper.js'
import CohortModel       from '../../models/CohortModel'
import FreebayesSettings from '../../models/FreebayesSettings'
import Glyph              from '../../partials/Glyph.js'
// import Bam                from  '../../models/Bam.iobio.js'
import vcfiobio           from  '../../models/Vcf.iobio.js'
import Translator         from  '../../models/Translator.js'
import GenericAnnotation  from  '../../models/GenericAnnotation.js'
import EndpointCmd        from  '../../models/EndpointCmd.js'

import SaveAnalysisPopup  from '../partials/SaveAnalysisPopup.vue'

import workflowData  from '../../data/workflows.json'
import variantData   from '../../data/variants_mosaic_platinum.json'
import analysisData  from '../../data/analysis.json'

import axios from 'axios'
import { saveAs } from 'file-saver'
import { bus } from '../../main'

import NewComponents from 'iobio-phenotype-extractor-vue';

import Vue from 'vue';

import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'home',
  components: {
    Navigation,
    Workflow,
    WorkflowNav,
    ReviewCase,
    Findings,
    AppIcon,
    SaveAnalysisPopup,
    LoadingDialog,
    LandingPage,
    ...NewComponents
  },
  props: {
    paramDebug:          null,
    paramAnalysisId:     null,
    paramProjectId:      null,
    paramSampleId:       null,
    paramAnalysisId:     null,
    paramTokenType:      null,
    paramToken:          null,
    paramSource:         null,
    paramIobioSource:    null,
    paramGeneBatchSize:  null,
    paramClientApplicationId: null,
    paramBuild: null,
    paramGeneSetId:       null,
    paramGenes:           null,
    paramVariantSetId:    null,
  },
  data() {
    let self = this;
    return {
      newWorkflow: true,
      showSplash: false,
      splashMessage: "Initializing clin.iobio",
      showSplashProgress: false,
      showLandingPage: false,

      iframesMounted: false,

      isAuthenticated: false,
      mosaicSession: null,
      modelInfos: null,
      launchedFromMosaic: false,
      user: null,
      showSaveModal: false,

      genomeBuildHelper: null,

      workflows:        workflowData,
      importedVariants: variantData,

      variantSetCounts: {},
      averageCoverage: null,


      variantsByInterpretationTemplate: [
       { key: 'sig',         display: 'significant',  abbrev: 'Significant', organizedVariants: []},
       { key: 'unknown-sig', display: 'unknown significance ', abbrev: 'Unknown Sig', organizedVariants: []},
       { key: 'not-reviewed', display: 'Not Reviewed', abbrev: 'Not reviewed', organizedVariants: []},
       { key: 'poor-qual', display: 'poor quality', abbrev: 'Poor qual', organizedVariants: []},
       { key: 'not-sig', display: 'Not Significant', abbrev: 'Not sig', organizedVariants: []},
      ],

      variantsByInterpretation: [],

      showFindings: false,

      appUrls: {
        'localhost': {
          'gene':      'http://localhost:4026/?launchedFromClin=true&frame_source=' + window.document.URL,
          'genefull':  'http://localhost:4026/?launchedFromClin=true&frame_source=' + window.document.URL,
        },
        'tony.iobio.io': {
          'gene':      'http://tony.iobio.io:4026/?launchedFromClin=true&frame_source=' + window.document.URL,
          'genefull':  'http://tony.iobio.io:4026/?launchedFromClin=true&frame_source=' + window.document.URL,
        },
        'prod': {
            'gene':      'https://stage.gene.iobio.io/?launchedFromClin=true&frame_source=' + window.document.URL,
            'genefull':  'https://stage.gene.iobio.io/?launchedFromClin=true&frame_source=' + window.document.URL,
        },
      },

      apps: {
        'genefull':  {url: null, isLoaded: false, isMounted: false, step: 3,  iframeSelector: '#gene-iframe iframe'}
      },

      currentStep: 1,

      idWorkflow: "workflow.clin.1.0",
      workflow: null,
      analysis: null,
      caseSummary: null,
      geneSet: null,
      variantSet: null,
      showConfigError: false,
      configMessage: "",


      demoModelInfos:  [
        {relationship: 'proband', affectedStatus: 'affected',   name: 'NA12878', 'sample': 'NA12878', sex: 'female',  'vcf': self.getDemoVcf().exome, 'tbi': null, 'bam': self.getDemoBams().exome['proband'], 'bai': null },
        {relationship: 'mother',  affectedStatus: 'unaffected', name: 'NA12892', 'sample': 'NA12892', sex: 'female',  'vcf': self.getDemoVcf().exome, 'tbi': null, 'bam': self.getDemoBams().exome['mother'], 'bai': null  },
        {relationship: 'father',  affectedStatus: 'unaffected', name: 'NA12891', 'sample': 'NA12891', sex: 'male',    'vcf': self.getDemoVcf().exome, 'tbi': null, 'bam': self.getDemoBams().exome['father'], 'bai': null  },
        {relationship: 'sibling', affectedStatus: 'unaffected', name: 'NA12877', 'sample': 'NA12877', sex: 'male',    'vcf': self.getDemoVcf().exome, 'tbi': null, 'bam': self.getDemoBams().exome['sibling'], 'bai': null  },
      ],

      demoUser: {
        "id": 13,
        "email": "iobioproject@gmail.com",
        "first_name": "User",
        "last_name": " ",
        "created_at": "2018-12-14T08:15:12.805Z",
        "updated_at": "2019-04-09T22:09:54.306Z",
        "username": "tonya_lee.disera_6b762afd",
        "confirmation_status": "CONFIRMED"
      },

      gtrGenes: [],
      summaryGeneList: [],
      AddedGenes:[],

      showSnackbar: false,
      snackbar: {message: '', timeout: 0, left: false, right: false, center: true, top: true, bottom: false},

      // temp workaround until Adit fixes router.js
      params: {},
      rawPedigree: null,
      allVarCounts: null,
      coverageHistos: null,
      venn_diag_data: {},
      geneToDelete: '',



      interpretationMap: {
        'sig': 'Significant',
        'unknown-sig': 'Unknown significance',
        'not-reviewed': 'Not reviewed',
        'not-sig': 'Not significant',
        'poor-qual': 'Poor quality',
        'reviewed': 'Reviewed',
      },
      reviewCaseBadges: null,
      generatingReport: false,
      cohortModel: null,
      customData: false,
      customGeneSet: [],
      bedFileUrl: '',
      variantsAnalyzedCounted: 0,
      customSavedAnalysis: false,
      passcode: '',
      showPassCode: false,
      buildName: 'GRCh37',
      knownGenesData: null,
      byPassedGenes: [],
      byPassedGenesDialog: false,
      importedCustomVariants: [],
      sampleId: null,
      variantsCount: 0,
      deletedGenesList: [],
    }

  },

  created: function() {

  },



  mounted: function() {
    this.init();
    fetch('https://s3.amazonaws.com/ped.test.files/known_genes.txt')
      .then( res => res.text())
        .then( data => {
          let lines = data.split('\n');
          this.knownGenesData = data;
        })
    bus.$on("getAnalysisObject", ()=>{
      this.generatePDF()
    })
    bus.$on("initialize-clin", ()=>{
      // console.log(this.analysis);
      this.showLandingPage = false;
      this.showSplash = true;
      setTimeout(()=>{
        this.onAuthenticated();
      }, 2000)
    })
    bus.$on("save-input-config", ()=>{
      this.saveAsInputConfig();
    })
    bus.$on("save-analysis-object", () => {
      this.saveAnalysisJson()
    })
    bus.$on("show-landing-page", () => {
      this.showLandingPage = true;
    })
    bus.$on("back-to-analysis", () => {
      this.showLandingPage = false;
    })
  },

  computed: {
    ...mapGetters(['getPedigreeData', 'getPedigree', 'getVariantsCount', 'getCustomCoverage', 'getReviewCaseBadge', 'getVariantsByInterpretation', 'getModelInfos', 'getGeneSet', 'getCaseSummary', 'getBuildName', 'getAnalysisProgressStatus', 'getLaunchedFromMosaicFlag']),
    phenotypeList: function() {
      let self = this;
      let phenotypeList = [];

      if (self.analysis.payload.phenotypes) {
        self.analysis.payload.phenotypes.forEach(function(phenotypeArray) {
          if (phenotypeArray) {
            phenotypeArray.forEach(function(phenotype) {
              phenotypeList.push(phenotype);
            })
          }
        })
      }

      return phenotypeList;
    },

    hasVariants: function() {
      let self = this;
      let count = 0;
      if (self.variantsByInterpretation) {
        self.variantsByInterpretation.forEach(function(interpretation) {
          count += interpretation.variantCount;
        });
      }
      return count > 0;
    }

  },

  watch: {
    reviewCaseBadges: function(){
      this.setVariantTaskBadges();
    },

    currentStep: function() {
      let self = this;
      if (self.isAuthenticated && self.workflow && self.analysis && self.currentStep) {
        var theApp = null;
        self.showFindings = false;




        // If we are going to gene.iobio (candidate genes), request
        // the genes from gene panel
        let appGene = self.apps.genefull;
        if (appGene.step == self.currentStep && appGene.isMounted) {
          var appName = "genefull";
          var iframeSelector = self.apps[appName].iframeSelector;

          if(self.byPassedGenes.length){
            self.byPassedGenesDialog = true;
          }

          console.log("Sending genesReport to gene.iobio")

          var theObject = {
                type: 'apply-genes',
                source: 'all',
                genesReport: self.analysis.payload.genesReport,
                searchTerms:  self.analysis.payload.phenotypes,
                gtrFullList: self.analysis.payload.gtrFullList,
                phenolyzerFullList: self.analysis.payload.phenolyzerFullList,
                hpoFullList: self.analysis.payload.hpoFullList
              }
          $(iframeSelector)[0].contentWindow.postMessage(JSON.stringify(theObject), '*');

        }


        // Indicate to app that it is now visible
        for (var appName in self.apps) {
          let app = self.apps[appName];
          if (app.isLoaded && app.step == self.currentStep) {
            var msgObject = {
              type:                  'show',
              sender:                'clin.iobio',
              isFrameVisible:        true,
              receiver:              appName };
            self.sendAppMessage(appName, msgObject);
          }
        }

        // We have moved to a new step.  Save the workflow step.
        if (self.analysis) {
          self.promiseUpdateWorkflow();
        }
      }
    },

    variants: function() {
      this.organizeVariantsByInterpretation();
    }
  },

  methods: {
    ...mapActions(['updateAnalysis', 'setModelInfos', 'setCustomGeneSet', 'setCaseSummary', 'setBuildName', 'setImportedVariantSets', 'setAnalysisInProgressStatus', 'setMosaicLaunchFlag']),

    init: function() {
      let self = this;
      var appTarget = null;
      if (window.document.URL.indexOf("localhost") > 0) {
        appTarget = "localhost";
      } else if (window.document.URL.indexOf("tony.iobio.io") > 0) {
        appTarget = "tony.iobio.io";
      } else {
        appTarget = "prod";
      }
      self.apps.genefull.url      = self.appUrls[appTarget].genefull;
      window.addEventListener("message", self.receiveAppMessage, false);



      self.promiseIFramesMounted()
      .then(function() {

        self.globalApp.initServices();

        self.genomeBuildHelper = new GenomeBuildHelper(self.globalApp);
        return self.genomeBuildHelper.promiseInit({DEFAULT_BUILD: 'GRCh37'})
      })
      .then(function() {
        if (self.paramBuild && self.paramBuild.length > 0) {
          self.genomeBuildHelper.setCurrentBuild(self.paramBuild);
        } else {
          // TODO - genome build is required
          self.genomeBuildHelper.setCurrentBuild("GRCh37")
        }

        let glyph = new Glyph();
        let translator = new Translator(self.globalApp, glyph);
        let genericAnnotation = new GenericAnnotation(glyph);

        // self.geneModel = new GeneModel(self.globalApp, self.forceLocalStorage, self.launchedFromHub);
        // self.geneModel.geneSource = self.forMyGene2 ? "refseq" : "gencode";
        // self.geneModel.genomeBuildHelper = self.genomeBuildHelper;
        // self.geneModel.setAllKnownGenes(self.allGenes);
        // self.geneModel.translator = translator;


        // Instantiate helper class than encapsulates IOBIO commands

        // self.variantExporter = new VariantExporter(self.globalApp);
        let endpoint = new EndpointCmd(self.globalApp,
          1588141188430,
          self.genomeBuildHelper,
          self.globalApp.utility.getHumanRefNames);

        self.cohortModel = new CohortModel(
          self.globalApp,
          null,
          null,
          endpoint,
          genericAnnotation,
          translator,
          self.geneModel,
          self.variantExporter,
          self.cacheHelper,
          self.genomeBuildHelper,
          new FreebayesSettings());


        if (localStorage.getItem('hub-iobio-tkn') && localStorage.getItem('hub-iobio-tkn').length > 0 && self.paramSampleId && self.paramSource) {
          self.showLandingPage = false;
          self.showSplash = true;
          self.showSplashProgress = true;
          // Temporary workaround until router is fixed to pass paramSampleId, paramSource, etc
          self.params.sample_id             = self.paramSampleId
          self.params.analysis_id           = self.paramAnalysisId
          self.params.project_id            = self.paramProjectId
          self.params.source                = self.paramSource
          self.params.iobio_source          = self.paramIobioSource
          self.params.client_application_id = self.paramClientApplicationId
          self.params.gene_set_id           = self.paramGeneSetId
          self.params.genes                 = self.paramGenes
          self.params.variant_set_id        = self.paramVariantSetId

          if (self.params.analysis_id == 'undefined') {
            self.params.analysis_id = null;
          }
          if (self.params.iobio_source == 'undefined') {
            self.params.iobio_source = null;
          }

          self.launchedFromMosaic = true;
          self.mosaicSession = new MosaicSession();
          self.setAnalysisInProgressStatus(true);
          self.setMosaicLaunchFlag(true);
          // For now, just hardcode is_pedgree = true
          self.mosaicSession.promiseInit(self.params.sample_id, self.params.source,
            true, self.params.project_id, self.params.client_application_id, self.params.gene_set_id, self.params.variant_set_id)
          .then(data => {
            self.modelInfos = data.modelInfos;
            self.user       = data.user;
            self.geneSet    = data.geneSet;
            self.coverageHistos = data.coverageHistos;
            self.rawPedigree = data.rawPedigree;
            self.allVarCounts = data.allVarCounts;
            self.variantSet = data.variantSet;

            self.mosaicSession.promiseGetProject(self.params.project_id)
            .then(function(project) {
              self.onAuthenticated()

              self.caseSummary = {};
              self.caseSummary.name = project.name;
              self.caseSummary.description = project.description && project.description.length > 0 ? project.description : "A summary of the trio goes here....";



            })
          })
          .catch(function(error) {
            self.showSplashProgress = false;
            self.splashMessage = error;
          })
        } else {
          self.params.source = "";
          self.showLandingPage = true;
          self.modelInfos = self.demoModelInfos;
          self.user       = self.demoUser;

          // self.onAuthenticated()

          self.caseSummary = {}
          self.caseSummary.name = "Demo Platinum"
          self.caseSummary.description = "The platinum data set (NA12878) is high quality exome sequencing data from three individuals. It serves as a truthset and benchmark for genomic tools. The original manuscript was published in 2017 doi: 10.1101/gr.210500.116";



        }
      })
      .catch(function(error) {
        alert("Unable to set genome build")
        console.log(error)
      })

    },

    closeByPassedGenesDialog: function(){
      this.byPassedGenesDialog = false;
      this.byPassedGenes = [];
    },


    getDemoVcf: function() {

      return  {
        'exome': "https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome.vcf.gz",
        'genome': "https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz"
      }
    },

    getDemoBams: function() {

      return {
        'exome': {
          'proband': 'https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam',
          'mother':  'https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam',
          'father':  'https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam',
          'sibling': 'https://s3.amazonaws.com/iobio/samples/bam/NA12877.exome.bam'
        },
        'genome': {
          'proband': 'https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12878.bam',
          'mother':  'https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12892.bam',
          'father':  'https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12891.bam'
        }
      }

    },

    onAuthenticated: function(callback) {
      let self = this;
      self.isAuthenticated = true;


      self.workflow = self.workflows[self.idWorkflow];

      if (self.workflow == null) {
        alert("Unable to find workflow " + self.idWorkflow);
        return;
      }

      self.showSplash = false;

      if(self.customSavedAnalysis){
        // Send message to set the data in the iobio apps
        for (var appName in self.apps) {
          let app = self.apps[appName];
          if (!app.isLoaded) {
            self.setData(appName, 500);
          } else {

          }
        }

        if (callback) {
          callback();
        }
      }
      else if(self.customData){
        self.analysis = analysisData;
        self.idAnalysis = self.analysis.id;
        if(!self.importedCustomVariants){
          self.analysis.payload.variants = [];
        }
        else {
          self.analysis.payload.variants = self.importedCustomVariants;
        }
        // self.analysis.payload.variants = [];
        // Send message to set the data in the iobio apps
        for (var appName in self.apps) {
          let app = self.apps[appName];
          if (!app.isLoaded) {
            self.setData(appName, 500);
          } else {

          }
        }

        if (callback) {
          callback();
        }
      }
      else if(self.launchedFromMosaic) {
        self.promiseGetAnalysis(
          self.params.project_id,
          self.params.analysis_id,
          self.workflow)
          .then(function() {
            // Now import the variants from the variant set provided
            // when launching clin.iobio from Mosaic
            if (self.variantSet && self.variantSet.variants) {
              let bypassedCount = 0;
              self.variantSet.variants.filter(function(variant) {
                return variant.sample_ids.indexOf(parseInt(self.paramSampleId)) >= 0;
              })
              .forEach(function(variant) {
                let importedVariant = {};
                if (variant.gene_symbol && variant.gene_symbol.length > 0) {
                  importedVariant.gene  = variant.gene_symbol;
                  importedVariant.chrom = variant.chr;
                  importedVariant.start = variant.pos;
                  importedVariant.end   = variant.pos;
                  importedVariant.ref   = variant.ref;
                  importedVariant.alt   = variant.alt;
                  importedVariant.filtersPassed    = "notCategorized";
                  importedVariant.inheritance      = null;
                  importedVariant.afgnomAD         = variant.gnomad_allele_frequency;
                  importedVariant.highestImpact    = variant.gene_impact;
                  importedVariant.consequence      = variant.gene_consequence;
                  importedVariant.isImported       = true;
                  importedVariant.variantSet       = "notCategorized";
                  self.analysis.payload.variants.push(importedVariant);
                  if (self.analysis.payload.genes.indexOf(importedVariant.gene) < 0) {
                    self.analysis.payload.genes.push(importedVariant.gene);
                  }
                } else {
                  console.log("Bypassing variant " + variant.chr + " " + variant.pos + " because gene not provided")
                  bypassedCount++;
                }
              })
              if (bypassedCount > 0) {
                if (bypassedCount == self.variantSet.variants.length) {
                  alert("Error", "None of the " + bypassedCount + " variants were loaded because the variants were missing gene name.", )

                } else {
                  alert("Warning", bypassedCount + " variants bypassed due to missing gene name")

                }
              }
            }
          })
        .then(function() {

          // Send message to set the data in the iobio apps
          for (var appName in self.apps) {
            let app = self.apps[appName];
            if (!app.isLoaded) {
              self.setData(appName, 500);
            } else {

            }
          }

          if (callback) {
            callback();
          }



        })
        .catch(function(error) {
          console.log("Error occurred in onAuthenticated " + error);
          if (callback) {
            callback();
          }
        })
      }
      else {
        //Load with demo data
        self.analysis = analysisData;
        self.idAnalysis = self.analysis.id;
        self.analysis.payload.genes = ['PRX', 'LMNA', 'SCN8A', 'DLL4', 'ABCA3', 'MROH8', 'DVL3', 'NOTCH4']
        self.analysis.payload.variants = [];
        // Send message to set the data in the iobio apps
        for (var appName in self.apps) {
          let app = self.apps[appName];
          if (!app.isLoaded) {
            self.setData(appName, 500);
          } else {

          }
        }

        if (callback) {
          callback();
        }
      }

    },


    promiseIFramesMounted: function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        let promises = [];
        for (var appName in self.apps) {
          if (self.apps[appName].currentStep != -1 && !self.apps[appName].mounted) {
            let p = self.promiseIFrameMounted(appName);
            promises.push(p);
          }
        }
        Promise.all(promises)
        .then(function() {
          self.iframesMounted = true;
          resolve();
        })
        .catch(function(error) {
          reject(error)
        })
      })
    },

    promiseIFrameMounted: function(appName) {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.checkIFrameMounted(appName, function(mounted) {
          if (mounted) {
            resolve();
          } else {
            reject();
          }
        })
      })
    },

    checkIFrameMounted: function(appName, callback) {
      let self = this;

      if (self.apps[appName].isMounted) {
        callback(true)
      } else {
        // If we are here, it is not loaded. Set things up so we check   the status again in 100 milliseconds
        window.setTimeout(function() {
          self.checkIFrameMounted(appName, callback);
        }, 100);
      }
    },


    onStepChanged: function(stepNumber) {
      this.currentStep = stepNumber
    },

    onClose: function(){
      this.showConfigError = false;
    },

    onTaskChanged: function(stepNumber, task) {
      let self = this;
      for (var appName in self.apps) {
        let app = self.apps[appName];
        if (app.step == stepNumber) {
          if (app.step.key == 'review-findings') {
            self.organizeVariantsByInterpretation();
          }
          var msgObject = {
            type:                  'show-' + task.key,
            sender:                'clin.iobio',
            isFrameVisible:        true,
            receiver:              appName };
          self.sendAppMessage(appName, msgObject);
        }
      }
    },

    onTaskCompleted: function(step, task) {
      let self = this;

      // We have moved to a new step.  Save the workflow step.
      if (self.analysis) {
        // For some reason, the step object on the analysis needs
        // to be refreshed.
        self.analysis.payload.steps.forEach(function(st) {
          if ( st.key == step.key) {
            st.complete = step.complete;
            st.tasks.forEach(function(t) {
              if (t.key == task.key) {
                t.complete = task.complete;
              }
            })
          }
        })
        self.promiseUpdateWorkflow();
      }
    },


    clickFindings: function() {
      this.currentStep = 0;
      this.organizeVariantsByInterpretation();
      this.showFindings = true;
    },


    getWorkflowStep: function(stepKey) {
      let self = this;
      if (self.workflow) {
        var theSteps = self.workflow.steps.filter(function(step) {
          return step.key == stepKey;
        })
        return theSteps.length > 0 ? theSteps[0] : null;
      } else {
        return null;
      }
    },
    getStepNumber: function(stepKey) {
      var workflowStep = this.getWorkflowStep(stepKey);
      return workflowStep ? workflowStep.number : "";
    },
    getStepTitle: function(stepKey) {
      var workflowStep = this.getWorkflowStep(stepKey);
      return workflowStep ? workflowStep.title : "";
    },
    getStepSummary: function(stepKey) {
      var workflowStep = this.getWorkflowStep(stepKey);
      return workflowStep ? workflowStep.summary : "";
    },
    getWorkflowTask: function(stepKey, taskKey) {
      let self = this;
      var workflowStep = self.getWorkflowStep(stepKey);
      if (workflowStep) {
        var theTasks = workflowStep.tasks.filter(function(task) {
          return task.key == taskKey;
        })
        return theTasks.length > 0 ? theTasks[0] : null;
      } else {
        return null;
      }
    },
    getTaskName: function(stepKey, taskKey) {
      var theTask = this.getWorkflowTask(stepKey, taskKey);
      return theTask ? theTask.name : "";
    },


    setData: function(appName, pauseMillisec=0) {
      let self = this;

      setTimeout( () => {
        var probandModelInfo = self.modelInfos.filter(function(modelInfo) {
          return modelInfo.relationship == 'proband';
        });
        if (probandModelInfo.length == 0) {
          console.log("Unable to locate proband model info");
          return;
        }
        if(self.customData){
          self.analysis.payload.genes = self.customGeneSet;
        }
        let app = self.apps[appName];
        let currentBuildName = self.genomeBuildHelper.getCurrentBuildName();

        let genes = self.analysis.payload.genes;
        let gene_set = [];
        self.byPassedGenes = [];

        genes.map( gene => {
          if(self.knownGenesData.includes(gene.toUpperCase()) && !gene_set.includes(gene.toUpperCase()) ){
            gene_set.push(gene.toUpperCase());
          }
          else {
            self.byPassedGenes.push(gene.toUpperCase());
          }
        })
        var msgObject = {
            type:                  'set-data',
            sender:                'clin.iobio',
            receiver:               appName,
            'user':                 self.user,
            'iobioSource':          self.params.source,
            'isFrameVisible':       app.step == self.currentStep,
            'modelInfo':            probandModelInfo[0],
            'modelInfos':           self.modelInfos,
            'analysis':             self.analysis,
            'phenotypes':           self.analysis.payload.phenotypes,
            'genes':                gene_set,
            'genesReport':          self.analysis.payload.genesReport,
            'genesGtr':             self.analysis.payload.genesGtr,
            'genesPhenolyzer':      self.analysis.payload.genesPhenolyzer,
            'genesManual':          self.analysis.payload.genesManual,
            'gtrFullList':          self.analysis.payload.gtrFullList,
            'phenolyzerFullList':   self.analysis.payload.phenolyzerFullList,
            'buildName':            currentBuildName,
            'variantSet':           self.variantSet
        };
        if (self.paramGeneBatchSize && (appName == 'gene' || appName == 'genefull')) {
          msgObject.batchSize = +self.paramGeneBatchSize;
        }

        console.log("ClinHome.setData  " + appName + " msgObject is: " + msgObject.modelInfo)




        self.sendAppMessage(appName, msgObject);



       }, pauseMillisec);

    },

    sendAppMessage: function(appName, obj) {
      let self = this;
      var theObject = obj ? obj : {type: 'start-analysis', sender: 'clin.iobio'};
      if (!theObject.hasOwnProperty("isFrameVisible")) {
        let app = self.apps[appName];
        theObject.isFrameVisible = app.step == self.currentStep;
      }

      var iframeSelector = self.apps[appName].iframeSelector;
      if (iframeSelector && iframeSelector.length > 0 && $(iframeSelector).length > 0) {
        $(iframeSelector)[0].contentWindow.postMessage(JSON.stringify(theObject), '*');
      } else {
        console.log("Unable to send clin message to " + appName + " because iframe not present ");
        console.log(theObject);
      }
    },

    receiveAppMessage: function(event) {
      let self = this;


      // Do we trust the sender of this message?
      if (!this.isValidAppOrigin(event)) {
        if (this.paramDebug) {
          console.log("parentWindow received message frum untrusted sender. Event.origin is " + event.origin );
        }
        return;
      }

      var messageObject = null;
      try {
        messageObject = JSON.parse(event.data);
      }
      catch(error) {
        return;
      }

      if (!messageObject.hasOwnProperty("type")) {
        return;
      }

      if (this.paramDebug) {
        alert("Clin received message:" + event.data);
        console.log("clin.iobio: message received")
        console.log(messageObject);
      }

      if (messageObject.type == 'mounted') {
        self.apps[messageObject.app].isMounted = true;
      } else if (messageObject.type == 'confirm-set-data') {
        if (!self.apps[messageObject.app].isLoaded ) {
          self.apps[messageObject.app].isLoaded = true;
        }
      } else if (messageObject.type == "apply-genes" && messageObject.sender == 'genepanel.iobio.io') {
        this.promiseCompleteStepTask('genes', taskMap[messageObject.source]);
      } else if (messageObject.type == "save-analysis") {
          this.analysis.payload.filters  = messageObject.analysis.payload.filters;
          this.analysis.payload.variants = messageObject.analysis.payload.variants;
          // this.variantsCount = messageObject.analysis.payload.variantCount
          this.organizeVariantsByInterpretation();
          this.setVariantTaskBadges();
          this.promiseAutosaveAnalysis({notify: true})
          .then(function() {

          })
          .catch(function(error) {

          })
      } else if (messageObject.type == "update-variant-count"){
        this.variantsCount = messageObject.variantCount;
        this.setVariantTaskBadges();
      }


    },


    isValidAppOrigin: function(event) {
      return (this.apps.genefull.url.indexOf(event.origin) >= 0 || this.apps.genepanel.url.indexOf(event.origin) >= 0);
    },

    setGeneTaskBadges() {
      let self = this;
      let phenotypesCount = 0;
      let notesCount = 0;
      let allPhenotypes =[];
      if(self.analysis.payload.phenotypes!==undefined){
        let gtr_phenotypes = self.analysis.payload.phenotypes[0];
        let phenolyzer_phenotypes = self.analysis.payload.phenotypes[1];
        let hpo_phenotypes = self.analysis.payload.phenotypes[2];
        notesCount = self.analysis.payload.phenotypes[3].length;

        if(gtr_phenotypes.length){
          gtr_phenotypes.map(term => {
            let cleaned_str = term.DiseaseName.replace(/-/g, " ").replace(/\s\s+/g, ' ').toLowerCase().trim();
            allPhenotypes.push(cleaned_str);
          })
        }

        if(phenolyzer_phenotypes.length){
          phenolyzer_phenotypes.map(term => {
            let cleaned_str = term.value.replace("-", " ").replace(/\s\s+/g, ' ').toLowerCase().trim();
            allPhenotypes.push(cleaned_str)
          })
        }

        if(hpo_phenotypes.length){
          hpo_phenotypes.map(term => {
            if(term.phenotype!==undefined){
              allPhenotypes.push(term.phenotype.toLowerCase().trim())
            }
          })
        }
      }

      let uniqueSet = new Set(allPhenotypes);
      let uniqueArray = [...uniqueSet];
      phenotypesCount = uniqueArray.length;

      self.analysis.payload.steps.forEach(function(step) {
        step.tasks.forEach(function(task) {
          if (task.key == 'review-phenotypes-genes') {
            task.badges = [
              {count: phenotypesCount > 0 ? phenotypesCount : '', label: (phenotypesCount > 1 ? 'phenotypes' : 'phenotype') },
              {count: notesCount > 0 ? notesCount : '', label: (notesCount > 1 ? 'notes' : 'note')}
            ];
          }
        })
        self.refreshWorkflowSteps();

      })
    },

    refreshWorkflowSteps: function() {
      let self = this;
      if (self.newWorkflow) {
        if (self.$refs.workflowRefNew) {
          self.$refs.workflowRefNew.refresh();
        }
      } else {
        if (self.$refs.workflowRef) {
          self.$refs.workflowRef.refresh();
        }

      }

    },

   setVariantTaskBadges: function() {
      let self = this;
      if (self.analysis.payload.variants) {
        let variantsCandidateGenes = self.analysis.payload.variants.filter(function(variant) {
          return self.analysis.payload.genes && self.analysis.payload.genes.length > 0 && self.analysis.payload.genes.indexOf(variant.gene) >= 0;
        })
        self.analysis.payload.steps.forEach(function(step) {
          step.tasks.forEach(function(task) {
            if (task.key == 'review-patient' ) {
              task.badges = self.reviewCaseBadges;

            } else if (task.key == 'coverage' ) {
              if (variantsCandidateGenes.length == 0) {
                delete task.badges;
              }
            } else if (task.key == 'review-full') {
                if(JSON.stringify(self.analysis.payload.variants[0]) === '{}'){
                  self.analysis.payload.variants.shift();
                }
                // let fullAnalysisCount = self.analysis.payload.variants.length;
                let fullAnalysisCount = self.variantsCount;

                if (fullAnalysisCount > 0) {
                  task.badges = [{count: fullAnalysisCount, label: 'variants'}];
                } else {
                  delete task.badges;
              }
            } else if (task.key == 'review-results') {
              task.badges = []

              let badgeLabels = [];
              let badgeCounts = [];
              let badgeClasses = [];

              //Add the count of variant which is not reviewed (but has comments) to unknown-sig
              if(self.variantsByInterpretation.length > 2 && self.variantsByInterpretation[2].key ==  'not-reviewed' && self.variantsByInterpretation[1].key == 'unknown-sig'){
                if(self.variantsByInterpretation[2].variantCount > 0){
                  self.variantsByInterpretation[1].variantCount += self.variantsByInterpretation[2].variantCount;
                }
              }

              self.variantsByInterpretation.forEach(function(interpretation) {
                if(interpretation.key == 'sig' || interpretation.key == 'unknown-sig' || interpretation.key == "poor-qual"){
                  if(interpretation.variantCount > 0){
                    badgeLabels.push(interpretation.display);
                    badgeCounts.push(interpretation.variantCount);
                    badgeClasses.push(interpretation.key);
                  }
                }
              })
              for (var i=0; i<badgeLabels.length; i++){
                task.badges.push({count: badgeCounts[i], label: badgeLabels[i],
                                  class: badgeClasses[i]
                })
              }
            }
          })
        })
        self.refreshWorkflowSteps();
      }
    },

    clearVariantTaskBadges: function() {
      let self = this;
      self.analysis.payload.steps.forEach(function(step) {
        step.tasks.forEach(function(task) {
          if (task.key == 'review' ) {
              delete task.badges;
          } else if (task.key == 'coverage') {
              delete task.badges;
          }
        })
      })
      self.refreshWorkflowSteps();
    },

    setCoverageTaskBadge: function(geneCount) {
      let self = this;
      if (self.analysis.payload.variants && self.analysis.payload.variants.length > 0) {
        self.analysis.payload.steps.forEach(function(step) {
          step.tasks.forEach(function(task) {
            if (task.key == 'coverage') {
              task.badges =  [{count: geneCount > 0 ? geneCount : null, 'label': 'genes'}];
            }
          })
        })
        self.refreshWorkflowSteps();
      }
    },

    toggleSaveModal(bool) {
      this.showSaveModal = bool;
    },

    promiseSaveAnalysis: function(options) {
      let self = this;

      return new Promise(function(resolve, reject) {
        if (self.analysis.id ) {

          let promiseSave = null;
          if (options && !options.autoupdate) {
            promiseSave = self.mosaicSession.promiseUpdateAnalysisTitle(self.analysis)
          } else {
            promiseSave = self.mosaicSession.promiseUpdateAnalysis(self.analysis)
          }

          if (options && options.notify) {
              self.onShowSnackbar( {message: 'saving analysis...',
                timeout: 3000, top: true, right: true });
          }

          promiseSave
          .then(function(analysis) {
            if (options && options.notify) {
              self.onShowSnackbar( {message: '\'' + self.analysis.title + '\'  saved.', timeout: 3000, top: true, right: true });
            }
            self.analysis = analysis;
            resolve();
          })
          .catch(function(error) {
            alertify.error("Unable to save analysis")
            console.log("Error occurred when saving analysis. ", error)
            self.onShowSnackbar( {message: 'Unable to update analysis.', timeout: 6000});
            reject(error);
          })

        } else {

          self.mosaicSession.promiseAddAnalysis(self.analysis.project_id, self.analysis)
          .then(function(analysis) {
            console.log("**********  adding mosaic analysis " + self.analysis.id + " " + " **************")
            if (options && options.notify) {
              self.onShowSnackbar( {message: 'Analysis  \'' + self.analysis.title + '\'  saved.', timeout: 3000, top: true, right: true});
            }
            self.analysis = analysis;
            resolve();
          })
          .catch(function(error) {
            self.onShowSnackbar( {message: 'Unable to add analysis.', timeout: 6000});
            reject(error);
          })
        }

      })


    },

    onCancelAnalysis: function() {
      let self = this;
      self.showSaveModal = false
    },

    promiseAutosaveAnalysis(options) {
      let self = this;
      if (self.analysis.id && self.launchedFromMosaic) {
        let theOptions = options ? options : {};
        theOptions.autoupdate = true;
        return self.promiseSaveAnalysis(theOptions);
      } else {
        return Promise.resolve();
      }

    },


    promiseGetAnalysis: function(idProject, idAnalysis, workflow, options={}) {
      let self = this;
      return new Promise(function(resolve, reject) {

        if (self.launchedFromMosaic) {
          if (idAnalysis && idAnalysis.length > 0) {

            self.mosaicSession.promiseGetAnalysis(idProject, idAnalysis)
            .then(function(analysis) {
              if (analysis) {

                self.analysis = analysis;
                self.idAnalysis = self.analysis.id;

                self.setGeneTaskBadges();
                resolve();

              } else {
                reject("Unable to find/create an analysis " + idAnalysis);
              }
            })
            .catch(function(err) {
              reject(err);
            })

          } else {
            var newAnalysis = {};
            newAnalysis.title = "";
            newAnalysis.description = "";
            newAnalysis.project_id = idProject;
            newAnalysis.sample_id = self.params.sample_id;
            newAnalysis.payload = {};
            newAnalysis.payload.project_id = idProject;
            newAnalysis.payload.sample_id = self.params.sample_id;
            newAnalysis.payload.datetime_created = self.getCurrentDateTime();
            newAnalysis.payload.workflow_id = workflow.id;
            newAnalysis.payload.genes = [];
            newAnalysis.payload.phenotypes = [];
            newAnalysis.payload.gtrFullList = [];
            newAnalysis.payload.phenolyzerFullList = [];

            // HACK WORKAROUND!!
            // Workaround until Adit can handle null VennDiagram in his component
            //
            self.initForPhenotypist(newAnalysis);

            // If a gene set was specified, initialize the genes accordingly
            if (self.geneSet && self.geneSet.genes) {
              self.geneSet.genes.forEach(function(geneName) {
                newAnalysis.payload.genes.push(geneName);
              })
            } else if (self.params.genes) {
              // Otherwise, if a gene set wasn't specified but a gene was,
              // initialize the genes to this single gene
              self.params.genes.split(",").forEach(function(geneName) {
                newAnalysis.payload.genes.push(geneName);
              })
            }



            newAnalysis.payload.variants = [];


            newAnalysis.payload.steps = workflow.steps.map(function(step) {
              let stepObject = {
                key: step.key,
                number: step.number,
                complete: false
              };
              if (step.tasks) {
                stepObject.tasks = step.tasks.map(function(task) {
                  return {
                    key: task.key,
                    complete: false,
                    passed: false,
                  }
                })
              }
              return stepObject;
            })
            self.analysis = newAnalysis;
            resolve();

          }
        } else {
          self.analysis = analysisData;
          self.idAnalysis = self.analysis.id;

          // These are the platinum variants that we are just grabbing
          // from a json file to mimic what variant sets from genome-wide
          // filters would look like
          self.analysis.payload.variants = [];
          if(self.customData) {
            self.analysis.payload.variants = [{}];
          }
          else{
            self.analysis.payload.variants = self.importedVariants.variants;
          }

          self.setGeneTaskBadges();
          resolve();

        }
      });
    },


    initForPhenotypist(analysis) {
      analysis.payload.VennDiagramData = {
                  "gtr": {
                    "count": 0
                  },
                  "phenolyzer": {
                    "count": 0
                  },
                  "ImportedGenes": {
                    "count": 0
                  },
                  "ClinPhen": {
                    "count": 0
                  },
                  "gtr_phenolyzer": {
                    "count": 0
                  },
                  "gtr_ImportedGenes": {
                    "count": 0
                  },
                  "gtr_ClinPhen": {
                    "count": 0
                  },
                  "phenolyzer_ImportedGenes": {
                    "count": 0
                  },
                  "phenolyzer_ClinPhen": {
                    "count": 0
                  },
                  "ImportedGenes_ClinPhen": {
                    "count": 0
                  },
                  "gtr_phenolyzer_ImportedGenes": {
                    "count": 0
                  },
                  "gtr_phenolyzer_ClinPhen": {
                    "count": 0
                  },
                  "gtr_ImportedGenes_ClinPhen": {
                    "count": 0
                  },
                  "phenolyzer_ImportedGenes_ClinPhen": {
                    "count": 0
                  },
                  "gtr_phenolyzer_ImportedGenes_ClinPhen": {
                    "count": 0
                  }
                };
      analysis.payload.genesGtr = [];
      analysis.payload.phenotypes = [[],[], [], []];
      analysis.payload.genesManual = [];
      analysis.payload.genesReport = [];
      analysis.payload.gtrFullList = [];
      analysis.payload.genesPhenolyzer = [];
      analysis.payload.hpoFullList = [];
      analysis.payload.phenolyzerFullList = [];
      analysis.payload.demoTextNote = ""
    },



    promiseUpdateGenesData: function(messageObject) {
      let self = this;
      self.analysis.payload.genesReport        = messageObject.genesReport;
      self.analysis.payload.genesGtr           = messageObject.genesGtr;
      self.analysis.payload.genesPhenolyzer    = messageObject.genesPhenolyzer;
      self.analysis.payload.genesManual        = messageObject.genesManual;
      self.analysis.payload.gtrFullList        = messageObject.gtrFullList;
      self.analysis.payload.phenolyzerFullList = messageObject.phenolyzerFullList;

      // WORKAROUND so that genes aren't blanked out
      if (self.analysis.payload.genes == null) {
        self.analysis.payload.genes = [];
      }
      //self.analysis.payload.genes              = messageObject.genes;


      self.analysis.payload.phenotypes         = messageObject.phenotypes;


      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      return self.promiseAutosaveAnalysis();
    },


    promiseUpdatePhenotypes: function(phenotypes) {
      let self = this;
      self.analysis.payload.phenotypes = phenotypes;
      self.setGeneTaskBadges();
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      self.updateAnalysis(self.analysis);
      return self.promiseAutosaveAnalysis();
    },

    promiseUpdateVennDiagramData: function(data) {
      let self = this;
      self.analysis.payload.VennDiagramData = data;
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      return self.promiseAutosaveAnalysis();
    },

    promiseUpdateGenesReport: function(genes) {
      let self = this;
      self.analysis.payload.genesReport = genes;
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      return self.promiseAutosaveAnalysis();
    },

    promiseUpdateAnalysis: function(analysis) {
      let self = this;
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      self.organizeVariantsByInterpretation();
      self.setVariantTaskBadges();
      return self.promiseAutosaveAnalysis();
    },


    promiseUpdateWorkflow: function() {
      let self = this;
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      return self.promiseAutosaveAnalysis();
    },


    promiseCompleteStepTask: function(stepKey, taskKey) {
      var filteredStep = this.analysis.payload.steps.filter(function(step) {
        return step.key == stepKey;
      })
      if (filteredStep.length > 0) {
        var filteredTask = filteredStep[0].tasks.filter(function(task) {
          return task.key == taskKey;
        })
        if (filteredTask.length > 0) {
          filteredTask[0].complete = true;
        }
      }
      return this.promiseUpdateWorkflow();
    },

    onMouseOverTask: function(step, task) {
      let self = this;
      if (step.app) {
        let msgObject = {
          'type':   'show-tooltip',
          'sender': 'clin.iobio',
          'task':   self.getWorkflowTask(step.key, task.key)
        };
        self.sendAppMessage(step.app, msgObject);

      }
    },

    onMouseLeaveTask: function(step, task) {
      let self = this;
      if (step.app) {
        let msgObject = {
          'type':   'hide-tooltip',
          'sender': 'clin.iobio',
          'task':   self.getWorkflowTask(step.key, task.key)
        };
        self.sendAppMessage(step.app, msgObject);
      }
    },


    getCurrentDateTime: function() {
      var dateObj = new Date();
      return dateObj.getTime();
    },

    formatCurrentDateTime: function(time) {
      var dateObject = new Date(time);
      return dateObject.toString();
    },

    organizeVariantsByInterpretation: function() {
      let self = this;
      // self.variantsAnalyzedCounted = self.variantsAnalyzedCounted + 1;

      self.variantsByInterpretation = [];

      self.variantsByInterpretationTemplate.forEach(function(interpretationTemplate) {
        let interpretation = $.extend({}, interpretationTemplate)
        interpretation.organizedVariants = self.organizeVariantsByFilter(interpretation.key);
        interpretation.variantCount      = self.getVariantCount(interpretation.organizedVariants);
        interpretation.genes             = self.getUniqueGenes(interpretation.organizedVariants);
        self.variantsByInterpretation.push(interpretation)
      })
    },
    organizeVariantsByFilter: function(interpretation) {
      let self = this;
      let filterList = [];

      for (var filterName in self.analysis.payload.filters) {
        let filterObject = self.analysis.payload.filters[filterName];
        var sortedGenes = self.organizeVariantsByGene(filterName, filterObject.userFlagged, interpretation);
        if (sortedGenes.length > 0) {
          filterList.push({key: filterName, filter: filterObject, genes: sortedGenes});
        }
      }

      let organizedVariants = filterList.sort(function(filterObject1, filterObject2) {
        return filterObject1.filter.order > filterObject2.filter.order;
      })

      var variantIndex = 0;
      organizedVariants.forEach(function(filterObject) {
        filterObject.genes.forEach(function(geneList) {
          geneList.variants.forEach(function(variant) {
            variant.index = variantIndex++;
          })
        })
      })

      return organizedVariants;
    },
    getVariantCount: function(organizedVariants) {
      let self = this;
      let count = 0;
      if (organizedVariants) {
        organizedVariants.forEach(function(geneList) {
          geneList.genes.forEach(function(gene) {
            count += gene.variants.length;
          })
        })
      }

      return count;
    },
    getUniqueGenes: function(organizedVariants) {
      let self = this;
      let uniqueGenes = [];
      if (organizedVariants) {
        organizedVariants.forEach(function(geneList) {
          geneList.genes.forEach(function(geneObject) {
            if (uniqueGenes.indexOf(geneObject.gene) == -1) {
              uniqueGenes.push(geneObject.gene);
            }
          })
        })
      }

      return uniqueGenes;
    },

    organizeVariantsByGene: function(filterName, userFlagged, interpretation) {
      let self = this;
      let theVariants = [];

      self.setVariantTaskBadges();


      this.analysis.payload.variants.forEach(function(variant) {
        if (variant.interpretation == interpretation) {
          theVariants.push(variant);
          variant.candidateGene = true;
        }
      })

      if (theVariants.length > 0) {
        let theGenes   = [];
        theVariants.forEach(function(variant) {
          let isReviewed = (variant.notes && variant.notes.length > 0)
                    || (variant.interpretation != null
                    && (variant.interpretation == "sig" || variant.interpretation == "unknown-sig" || (variant.interpretation == "not-sig" && variant.notes.length>0) || variant.interpretation == "poor-qual" || (variant.interpretation == "not-reviewed" && variant.notes.length>0)));

          if (isReviewed && filterName && filterName == 'reviewed') {

            let theGene = null;
            var idx = theGenes.indexOf(variant.gene);
            if (idx >= 0) {
              theGene = theGenes[idx];
            } else {
              theGene = {};
              theGene.gene = variant.gene;
              theGene.variants = [];
              theGenes.push(theGene);
            }
            theGene.variants.push(variant);
          }

        })
        return theGenes;
      } else {
        return [];
      }
    },

    generatePDF: function(){
      this.generatingReport = true;
      let analysis_sample = JSON.stringify(this.analysis)
      let config = {
        headers: {
          'Content-Type': 'text/plain'
        },
        responseType: 'blob'
      }
      axios.post('https://backend.iobio.io/clinReport', analysis_sample, config)
        .then((res)=>{
          this.generatingReport = false;
          const pdfBlob = new Blob([res.data], { type: 'application/pdf' })
          saveAs(pdfBlob, "analysis.pdf")
        })
        .catch((err)=>{
          console.log(err);
          alert("Failed to generate report. Please try again")
        })
    },

    summaryGenes(genes){
      let res = [];
      genes.map(gene => {
        if(!this.deletedGenesList.includes(gene.name)){
          res.push(gene);
        }
      })

      this.summaryGeneList = res;
      this.analysis.payload.genesReport = this.summaryGeneList;
      this.promiseUpdateGenesReport(res);
    },

    saveSearchedPhenotypes(phenotypes){
      this.analysis.payload.phenotypes = phenotypes;
      this.promiseUpdatePhenotypes(phenotypes);
    },

    GtrGeneList(genes){
      var gtrCompleteLsit = [];
      genes.map(gene=>{
        if(!this.deletedGenesList.includes(gene.name)){
          gtrCompleteLsit.push({
            name: gene.name,
            gtrRank: gene.indexVal,
            gtrAssociated: gene.isAssociatedGene
          })
        }
      })
      this.analysis.payload.gtrFullList = gtrCompleteLsit;
    },

    PhenolyzerGeneList(genes){
      var phenolyzerCompleteList = [];
      genes.map(gene=>{
        if(!this.deletedGenesList.includes(gene.geneName)){
          phenolyzerCompleteList.push({
            name: gene.geneName,
            phenolyzerRank: gene.indexVal
          })
        }
      })
      this.analysis.payload.phenolyzerFullList = phenolyzerCompleteList;
    },

    HpoGeneList(genes){
      var hpoCompleteList = [];
      genes.map(gene=>{
        if(!this.deletedGenesList.includes(gene.gene)){
          hpoCompleteList.push({
            name: gene.gene,
            hpoRank: gene.index
          })
        }
      })
      this.analysis.payload.hpoFullList = hpoCompleteList;
    },

    importedGenes(genes){
      genes.map(gene => {
        let idx = this.deletedGenesList.indexOf(gene);
        if(idx > -1){
          this.deletedGenesList.splice(idx, 1);
        }
      })
      this.AddedGenes = genes;
    },

    UpdateListOnDelete(genes){
      this.summaryGeneList = genes;
      this.analysis.payload.genesReport = genes;
    },

    bus_delete_gene(gene){
      this.deletedGenesList.push(gene);
      // this.geneToDelete = gene;
      this.updateGeneListsOfEachTool();
    },


    updateGeneListsOfEachTool(){

      //GTR
      let gtrCompleteList = this.analysis.payload.gtrFullList;
      let gtr_res = [];
      gtrCompleteList.map(gene => {
        if(!this.deletedGenesList.includes(gene.name)){
          gtr_res.push(gene);
        }
      })
      this.analysis.payload.gtrFullList = gtr_res;


      //Phenolyzer
      let phenolyzerCompleteList = this.analysis.payload.phenolyzerFullList;
      let phenolyzer_res = [];
      phenolyzerCompleteList.map(gene => {
        if(!this.deletedGenesList.includes(gene.name)){
          phenolyzer_res.push(gene);
        }
      })
      this.analysis.payload.phenolyzerFullList = phenolyzer_res;

      //HPO
      let hpoCompleteList = this.analysis.payload.hpoFullList;
      let hpo_res = [];
      hpoCompleteList.map(gene => {
        if(!this.deletedGenesList.includes(gene.name)){
          hpo_res.push(gene);
        }
      })
      this.analysis.payload.hpoFullList = hpo_res;

    },

    onShowSnackbar: function(snackbar) {
      if (snackbar && snackbar.message) {
        this.showSnackbar = true;

        snackbar.left     = snackbar.left ? snackbar.left : false;
        snackbar.right    = snackbar.right ? snackbar.right : false;
        snackbar.center   = snackbar.center ? snackbar.center : false;
        snackbar.top      = snackbar.top ? snackbar.top : false;
        snackbar.bottom   = snackbar.bottom ? snackbar.bottom : false;

        if (!snackbar.left && !snackbar.right && !snackbar.center) {
          snackbar.center = true;
        }
        if (!snackbar.top && !snackbar.bottom) {
          snackbar.top = true;
        }

        this.snackbar = snackbar;

        if (this.snackbar.timeout == null) {
          this.snackbar.timeout = 6000;
        }
      }
    },
    onHideSnackbar: function() {
      this.showSnackbar = false;
    },
    vennData(data){
      this.venn_diag_data = data;
    },
    VennDiagramData(obj){
      this.analysis.payload.VennDiagramData = obj;
      this.promiseUpdateVennDiagramData(obj);
    },

    updateReviewCaseBadges(badges){
      this.reviewCaseBadges = badges;
    },
    gene_to_delete(gene){
      this.geneToDelete = gene;
    },

    updateAverageCoverage(cov){
      this.averageCoverage = cov;
    },

    customModelInfo(modelInfos){
      this.modelInfos = modelInfos;
      this.setModelInfos(this.modelInfos);
      this.customData = true;
    },

    setGeneSet(geneSet){
      this.customGeneSet = geneSet;
      this.setCustomGeneSet(this.customGeneSet);
    },
    setPedData(pedigree){
      this.rawPedigree = pedigree;
    },
    setCustomCaseSummary(caseSummary){
      this.caseSummary = {};
      this.caseSummary.name = caseSummary.name;
      this.caseSummary.description = caseSummary.description;
      this.setCaseSummary(this.caseSummary);
    },
    saveAsInputConfig(){
      var configObj = {
        "caseSummary": this.caseSummary,
        "modelInfos": this.modelInfos,
        "customGeneSet": this.customGeneSet,
        "rawPedigree": this.rawPedigree,
        "bedFileUrl": this.bedFileUrl
      }
      let configData = JSON.stringify(configObj);
      const jsonBlob = new Blob([configData], { type: "application/json" });
      saveAs(jsonBlob, "clin-input-config.json")
    },
    importSavedInputConfig(ev){
      const file = ev.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        return e.target.result;
      }
      reader.readAsText(file);
    },
    validateConfigFile(customData){
      let bool = true;
      let message = "";

      if(customData.hasOwnProperty("caseSummary")){
        if(!customData.caseSummary.hasOwnProperty("name")){
          bool = false;
          message = "Could not interpret project name field (\"caseSummary\":{\"name\":\"\",\"description\":\"\"})";
        }
        if(!customData.caseSummary.hasOwnProperty("description")) {
          bool = false;
          message = "Could not interpret description field (\"caseSummary\":{\"name\":\"\",\"description\":\"\"})" ;
        }
      }
      else{
        bool = false;
        message = "Could not interpret case summary field (\"caseSummary\":{\"name\":\"\",\"description\":\"\"})";

      }

      if(!customData.hasOwnProperty("bedFileUrl")){
        bool = false;
        message = "Could not interpret bed file URL. (\"bedFileUrl\": \"\")";

      }
      if(!customData.hasOwnProperty("rawPedigree")){
        bool = false;
        message = "Could not interpret pedigree field (\"rawPedigree\": \"\")";

      }
      if(!customData.hasOwnProperty("customGeneSet")){
        message = "Could not interpret gene list field (\"customGeneSet\":[\"\"],)";

        bool = false;
      }
      if(!customData.hasOwnProperty("modelInfos")){
        message = "Could not interpret files field (\"modelInfos\":[\"\"])";
        bool = false;
      }
      else{

        let idMap = {};
        let relationshipMap = {}

        for(let i = 0; i < customData.modelInfos.length; i++) {
          let sample = customData.modelInfos[i];

          if(idMap.hasOwnProperty(sample.sample)){
            bool = false;
            message = "Error parsing config file. Duplicate sample ids detected for sample " + sample.sample + '.';
          }
          else{
            idMap[sample.sample] = 1;
          }

          if(sample.relationship === "mother") {
            if (relationshipMap.hasOwnProperty(sample.relationship)) {
              bool = false;
              message = "Multiple mothers detected";
            }
            else{
              relationshipMap[sample.relationship] = 1;
            }
          }
          if(sample.relationship === "father") {
            if (relationshipMap.hasOwnProperty(sample.relationship)) {
              bool = false;
              message = "Multiple fathers found";
            }
            else{
              relationshipMap[sample.relationship] = 1;
            }
          }


          if(!this.isUrlValid(sample.bam, sample.sample)){
            bool = false;
            message = "sampleId " + sample.sample + " does not match bam url";
          }

          let bamExt = sample.bam.substr(sample.bam.lastIndexOf('.') + 1);
          let vcfExt = sample.vcf.substr(sample.vcf.lastIndexOf('.') + 1);

          if(bamExt !== "bam"){
            message = "Extension for bam file " + sample.bam + " was not recognized";
            bool = false;
          }
          if(vcfExt !== "vcf" && vcfExt !== "gz" ){
            message = "Extension for vcf file " + sample.vcf + " was not recognized";
            bool = false;
          }
        }

      }
      let ret = {bool: bool, message: message};
      return ret;

    },

    isUrlValid: function(url, sample){
      if(url.includes(sample)){
        return true;
      }
      else {
        return false;
      }
    },

    loadSavedInputConfig(customData){

      let validate = this.validateConfigFile(customData);

      if(validate.bool){

        this.caseSummary = {};
        this.caseSummary.name = customData.caseSummary.name;
        this.caseSummary.description = customData.caseSummary.description;
        this.rawPedigree = customData.rawPedigree;
        this.customGeneSet = customData.customGeneSet;
        this.modelInfos = customData.modelInfos;
        this.bedFileUrl = customData.bedFileUrl;
        this.customData = true;

        this.showLandingPage = false;
        this.showSplash = true;
        setTimeout(()=>{
          this.onAuthenticated();
        }, 2000)
      }
      else{
        this.showConfigError = true;
        this.configMessage = validate.message;
      }
    },
    loadSavedAnalysisCustomData(analysis){
      this.setAnalysisInProgressStatus(true);
      this.analysis = analysis;
      this.updateAnalysis(this.analysis);
      this.modelInfos = analysis.custom_model_infos;
      this.setModelInfos(this.modelInfos);
      this.customGeneSet = analysis.custom_gene_set;
      this.setCustomGeneSet(this.customGeneSet);
      this.caseSummary = analysis.custom_case_Summary;
      this.setCaseSummary(this.caseSummary);
      this.buildName = analysis.build_name;
      this.setBuildName(this.buildName);
      this.genomeBuildHelper.setCurrentBuild(analysis.build_name);
      this.rawPedigree = analysis.custom_pedigree;
      this.customSavedAnalysis = true;
      this.customData = true;
      // this.variantsByInterpretation = analysis.variants_by_interpretation;
      // bus.$emit("initialize-clin")
      this.showLandingPage = false;
      this.showSplash = true;
      setTimeout(()=>{
        this.onAuthenticated();
        this.organizeVariantsByInterpretation();
        this.setVariantTaskBadges();
      }, 2000)

    },
    setBedFileUrl(bedUrl){
      this.bedFileUrl = bedUrl;
    },
    setBuildForCustomData(buildName){
      this.buildName = buildName;
      this.genomeBuildHelper.setCurrentBuild(buildName);
      this.setBuildName(this.buildName);
    },
    saveAnalysisJson(){
      let analysis_obj = this.analysis;
      analysis_obj.custom_pedigree_data = this.getPedigreeData;
      analysis_obj.custom_pedigree = this.getPedigree;
      analysis_obj.custom_variants_count = this.getVariantsCount;
      analysis_obj.custom_coverage_data = this.getCustomCoverage;
      analysis_obj.review_case_badge = this.getReviewCaseBadge;
      analysis_obj.custom_model_infos = this.getModelInfos;
      analysis_obj.variants_by_interpretation = this.getVariantsByInterpretation;
      analysis_obj.custom_gene_set = this.getGeneSet;
      analysis_obj.custom_case_Summary = this.getCaseSummary;
      analysis_obj.build_name = this.getBuildName;
      analysis_obj.pass_code = Math.floor(100000 + Math.random() * 900000);
      let analysisObject = JSON.stringify(analysis_obj);
      const jsonBlob = new Blob([analysisObject], { type: "application/json" });
      saveAs(jsonBlob, "clin-saved-analysis.json");
      // this.showPassCodeDialog(analysis_obj.pass_code);
    },
    showPassCodeDialog(pass_code){
      this.showPassCode = true;
      this.passcode = pass_code;
    },
    savePasscode(){
      const txtBlob = new Blob([this.passcode], { type: "text/plain" });
      saveAs(txtBlob, "passcode-clin.txt");

    },
    setImportedVariants(variants){
      let self = this;

      let bypassedCount = 0;
      // self.analysis.payload.variants = [];
      // self.analysis.payload.genes = [];
      variants.forEach(function(variant) {
        let importedVariant = {};
        if (variant.gene && variant.gene.length > 0) {
          importedVariant.gene  = variant.gene;
          importedVariant.chrom = variant.chrom;
          importedVariant.start = variant.start;
          importedVariant.end   = variant.end;
          importedVariant.ref   = variant.ref;
          importedVariant.alt   = variant.alt;
          importedVariant.filtersPassed    = variant.filtersPassed;
          importedVariant.inheritance      = variant.inheritance;
          importedVariant.afgnomAD         = variant.afgnomAD;
          importedVariant.highestImpact    = variant.highestImpact;
          importedVariant.consequence      = variant.consequence;
          importedVariant.isImported       = true;
          importedVariant.variantSet       = variant.filtersPassed;
          self.importedCustomVariants.push(importedVariant);
          if (self.customGeneSet.indexOf(importedVariant.gene) < 0) {
            self.customGeneSet.push(importedVariant.gene);
          }
        }
      })
      self.setImportedVariantSets(self.importedCustomVariants);
      self.setCustomGeneSet(self.customGeneSet);
    }
  }
}

</script>
