/*
 * Home.vue
 *
 */
<style lang="sass" scoped >

@import ../../../assets/sass/variables





.app-content
  margin-top: 170px
  margin-left: 0px

.app-content.sidebar
  margin-top: 0px
  margin-left: 270px

.app-content.minimized
  margin-top: 60px
  margin-left: 0px

.app-content.minimized.sidebar
  margin-top: 0px
  margin-left: 110px



.stepper__content
  color: $text-color

h5
  color:  $app-color
  margin-top: 8px
  font-size: 16px
  display: inline-block



.split-btn
  position: absolute
  top: 5px
  left: 0px
  display: inline-block
  margin: 0px
  padding: 0px
  min-width: 30px
  height: 30px

  .btn__content
    max-width: 30px
    padding: 0px
    margin: 0px
    height: 30px
    color: $app-color
    font-weight: 600

    .material-icons
      font-size: 2em
      color: $app-color
      height: 30px
      width: 30px

.horizontal-dashboard-card
  padding: 0px
  margin: 0px
  width: 100%
  color: $text-color

  hr.divider
    display: none


  .stepper__step--active
    .stepper__label
      font-weight: 600

  .stepper__header
    margin-top: 10px
    -webkit-box-shadow: none
    box-shadow: none
    width: 600px
    float: left
    justify-content: flex-start

  .stepper.stepper--non-linear
    height: 170px

  .stepper-btn-panel
    width: 100%
    text-align: center

  .stepper-btn
    color: $app-color
    display: inline-block
    margin: 0px
    margin-top: 12px
    padding: 0px
    min-width: 110px
    height: 30px

  .stepper-btn .btn__content
    max-width: 110px
    padding: 0px
    margin: 0px
    height: 30px


  .vertical-divider
    border-left: 1px solid $divider-color
    height: 160px
    float: left
    margin-top: 5px
    margin-bottom: 5px
    margin-left: 10px
    margin-right: 10px

  .workflow-summary-panel
    width: 200px
    float: left
    display: inline-block
    padding: 5px 5px 5px 10px
    overflow-y: scroll
    font-size: 12px

    h5
      margin-left: 30px

  .stepper__content
    padding: 0px 0px 0px 0px



  .stepper__step
    padding-top: 0px
    padding-bottom: 10px
    padding-left: 10px
    padding-right: 10px
    width: 150px

  .stepper__items
    float: left
    display: inline-block
    margin-left: 5px
    min-width: 480px

  .step-summary-panel
    width: 200px
    float: left
    display: inline-block
    padding: 5px 15px 5px 5px
    overflow-y: scroll
    font-size: 12px

  .tasks-panel
    width: 280px
    float: left
    display: inline-block
    padding-top: 0px

  .task-entry
    clear: both
    overflow: auto

  .task-name
    float: left
    display: inline-block
    vertical-align: top
    width: 160px
    cursor: pointer

  .task-switch
    float: left
    display: inline-block !important
    width: 24px !important
    height: 30px
    margin-left: 20px
    margin-right: 0px
    margin-bottom: 0px
    vertical-align: top
    margin-top: 0px !important


  .task-checkbox-header1
    margin-left: 150px
    display: inline-block
    float: left
    width: 74px
    margin-top: 5px

  .task-checkbox-header2
    display: inline-block
    float: left
    margin-top: 5px


  .expansion-btn
    bottom: 0px
    right: 5px
    position: absolute
    margin: 0px
    padding: 0px
    min-width: 110px
    height: 30px
    color: $app-color


  .expansion-btn .btn__content
    max-width: 110px
    padding: 0px
    margin: 0px
    height: 30px
    font-weight: 600

  .expansion-btn .btn__content .material-icons
    font-size: 2em
    color: $app-color
    height: 30px
    width: 30px

.vertical-dashboard-card
  height: 100%
  .stepper--vertical
    height: calc(100% + 110px)
    .stepper__step
      width: 100%
      padding: 14px 10px 14px 5px
    .stepper__header
      height: initial
      -webkit-box-shadow: none
      box-shadow: none
    .stepper__content
      margin: -8px -36px -16px 16px
      padding: 8px 50px 16px 8px


  .workflow-summary-panel
    padding: 0px 10px 10px 10px
  .step-summary-panel
    width: 220px
    word-wrap: break-word
  .tasks-panel
    width: 220px

  .task-entry

  .task-name
    display: inline-block
    vertical-align: bottom
    width: 115px
    cursor: pointer
    line-height: 15px
    padding-bottom: 8px
    padding-top: 3px

  .task-switch
    display: inline-block !important
    width: 24px !important
    height: 30px
    margin-left: 20px
    margin-right: 0px
    margin-bottom: 0px
    vertical-align: top
    margin-top: 0px !important


  .task-checkbox-header1
    margin-left: 95px
    display: inline-block
    width: 74px
    margin-top: 5px

  .task-checkbox-header2
    display: inline-block
    margin-top: 5px

  .expansion-btn
    top: 0px
    right: 5px
    position: absolute
    margin: 0px
    padding: 0px
    min-width: 30px
    height: 30px

  .expansion-btn .btn__content
    max-width: 30px
    padding: 0px
    margin: 0px
    height: 30px
    color: $app-color !important
    font-weight: 600

  .expansion-btn .btn__content .material-icons
    font-size: 2em
    color: $app-color
    height: 30px
    width: 30px


.vertical-dashboard-card.minimized
  .stepper--vertical
    .stepper__step
      width: 100%
      padding: 14px 5px 14px 3px
    .stepper__content
      margin:  0px -36px -6px 6px
      padding: 8px 50px 16px 8px
    .stepper__header
      padding-left: 2px
    .stepper__step__step
      margin-right: 6px

    .step-summary-panel
      width: 100px
      word-wrap: break-word
  .tasks-panel
    width: 100px
  .task-switch
    margin-left: 0px
    margin-bottom: 10px
  .task-name
    width: 80px
    padding-right: 10px
    padding-bottom: 0px


.horizontal-dashboard-card.minimized
  .stepper.stepper--non-linear
    height: 60px
  .stepper__header
    height: 60px
    width: 280px
    margin-right: 10px
    margin-top: 0px
  .stepper__step
    padding: 16px 5px 24px 5px
  .stepper__items
    width: calc(100% - 310px)
  .stepper-btn
    min-width: 40px
  .stepper-btn .btn__content
      max-width: 40px

  .tasks-panel
    padding-top: 13px
    width: 100%
  .task-name
    width: initial
    padding-top: 3px
    padding-right: 5px
  .task-entry
    display: inline-block
    clear: initial
    margin-right: 30px
  .task-switch
    float: left
    width: 40px !important
    margin-left: 0px

  .vertical-divider
    height: 50px



</style>



<template>

  <div style="display:flex">
    <login
      v-if="!isAuthenticated"
      :userSession="userSession"
      @authenticated="onAuthenticated">
    </login>


    <v-toolbar v-if="!isSidebar && isAuthenticated"  dark  fixed   :height="isMinimized ? 60 : 170">
      <div v-show="isAuthenticated"  :class="{'horizontal-dashboard-card': true, 'minimized': isMinimized}">



        <v-stepper v-model="currentStep"  non-linear>
          <div class="workflow-summary-panel" v-show="!isMinimized">
            <div>
              <v-btn class="split-btn" flat fav small
              v-show="!isMinimized"
              @click="isSidebar = true"
              v-tooltip.right="`Show dashboard on left`">
                <v-icon>vertical_split</v-icon>
              </v-btn>
              <h5> {{ project.workflow.title }} </h5>

              <div>
                {{ project.workflow.summary}}
              </div>
            </div>
          </div>

          <div class="vertical-divider" v-show="!isMinimized"></div>

          <v-stepper-header>
            <v-btn v-show="isMinimized" :disabled="currentStep == 1" class="stepper-btn" flat small @click="currentStep = currentStep - 1">
              <v-icon>chevron_left</v-icon>
            </v-btn>
            <template v-for="step in project.workflow.steps">
              <v-stepper-step v-show="!isMinimized || step.number == currentStep" :key="step.number" editable :step="step.number" :complete="step.complete">
                {{ step.title }}
              </v-stepper-step>
              <v-divider v-show="step.number != project.workflow.steps.length  && !isMinimized "></v-divider>
            </template>
            <v-btn v-show="isMinimized" :disabled="currentStep == project.workflow.steps.length" class="stepper-btn" flat small @click="currentStep = currentStep + 1">
              <v-icon>chevron_right</v-icon>
            </v-btn>
            <div v-show="!isMinimized" class="stepper-btn-panel">
              <v-btn :disabled="currentStep == 1" class="stepper-btn" flat  @click="currentStep = currentStep - 1">
              <v-icon>chevron_left</v-icon>
              Previous
              </v-btn>
              <v-btn :disabled="currentStep == project.workflow.steps" class="stepper-btn" flat  @click="currentStep = currentStep + 1">
                <v-icon>chevron_right</v-icon>
                Next
              </v-btn>
            </div>
          </v-stepper-header>


          <div class="vertical-divider" ></div>

          <v-stepper-items>
            <template v-for="step in project.workflow.steps">

              <v-stepper-content :key="step.number" :step="step.number">
                <div class="step-summary-panel" v-if="!isMinimized">
                  <h5>{{ step.title }}</h5>
                  <div>
                      {{ step.summary }}
                  </div>
                </div>

                <div class="tasks-panel" v-if="step.tasks">
                  <div  v-show="!isMinimized">
                    <span class="task-checkbox-header1">Complete</span>
                    <span class="task-checkbox-header2">Passed</span>

                  </div>
                  <div class="task-entry"
                   v-for="task in step.tasks"
                   :key="task.name"
                   >
                    <span class="task-name"
                    v-tooltip.left="task.name"
                    @mouseover="onMouseOverTask(step, task)"
                    @mouseleave="onMouseLeaveTask(step, task)">
                    {{ task.name }}
                    </span>
                    <v-checkbox class="task-switch"
                      v-model="task.complete"
                      v-tooltip.right="`Completed`"
                    ></v-checkbox>
                    <v-switch small class="task-switch"
                      v-if="task.complete"
                      v-model="task.pass"
                      v-tooltip.right="`Passed`"
                    ></v-switch>
                  </div>

                </div>
              </v-stepper-content>
            </template>
          </v-stepper-items>
        </v-stepper>

          <v-btn class="expansion-btn" flat fav small v-show="!isMinimized" @click="isMinimized = true">
            <v-icon>expand_less</v-icon>
            show less
          </v-btn>
          <v-btn class="expansion-btn" flat fav small v-show="isMinimized" @click="isMinimized = false">
            <v-icon>expand_more</v-icon>
            show more
          </v-btn>



      </div>
    </v-toolbar>

    <v-navigation-drawer
      v-if="isSidebar && isAuthenticated"
      :mini-variant.sync="isMinimized"
      :hide-overlay="true"
      fixed
      dark
      :width="isMinimized ? 110 : 270"
      mini-variant-width="110">
      <div v-show="isAuthenticated"  light :class="{'vertical-dashboard-card': true, 'minimized': isMinimized}">



        <v-stepper v-model="currentStep" vertical non-linear >
          <div class="workflow-summary-panel" >
            <div>
              <v-btn class="split-btn" flat fav small
               v-show="!isMinimized"
               @click="isSidebar = false"
               v-tooltip.right="`Show dashboard on top`">
                <v-icon>horizontal_split</v-icon>
              </v-btn>

              <h5> {{ project.workflow.title }} </h5>

              <v-btn class="expansion-btn" flat fav small v-show="!isMinimized" @click="isMinimized = true">
                <v-icon>chevron_left</v-icon>
              </v-btn>
              <v-btn class="expansion-btn" flat fav small v-show="isMinimized" @click="isMinimized = false">
                <v-icon>chevron_right</v-icon>
              </v-btn>

              <div v-show="!isMinimized">
                {{ project.workflow.summary}}
              </div>
            </div>
          </div>




            <template v-for="step in project.workflow.steps">
              <v-stepper-step v-show="!isMinimized || isSidebar || step.number == currentStep"
              :key="`step` + step.number"
              editable
              :step="step.number"
              :complete="step.complete">
                 {{ step.title }}
              </v-stepper-step>
              <v-stepper-content :key="`content` + step.number" :step="step.number">
                <div class="step-summary-panel" v-if="!isMinimized">
                    {{ step.summary }}
                </div>

                <div class="tasks-panel" v-if="step.tasks">
                  <div  v-show="!isMinimized">
                    <span class="task-checkbox-header1">Complete</span>
                    <span class="task-checkbox-header2">Passed</span>

                  </div>
                  <div class="task-entry"
                   v-for="task in step.tasks"
                   :key="task.name"
                   >
                    <span class="task-name"
                    v-tooltip.left="task.name"
                    @mouseover="onMouseOverTask(step, task)"
                    @mouseleave="onMouseLeaveTask(step, task)">
                    {{ task.name }}
                    </span>
                    <v-checkbox class="task-switch"
                      v-model="task.complete"
                      v-tooltip.right="`Completed`"
                    ></v-checkbox>
                    <v-switch small class="task-switch"
                      v-if="task.complete"
                      v-model="task.pass"
                      v-tooltip.right="`Passed`"
                    ></v-switch>
                  </div>

                </div>
              </v-stepper-content>
            </template>






        </v-stepper>



      </div>
    </v-navigation-drawer>


    <div style="width:100%;height:100%;padding: 2px"
    :class="{'app-content': true, 'sidebar': isSidebar, 'minimized': isMinimized}"
    v-show="isAuthenticated" >

      <v-card  light style="min-height:600px"
        v-show="currentStep == 1"
      >
        <div>
          Load data
        </div>
      </v-card>

      <v-card  light style="min-height:600px"
        v-show="currentStep == 2"
      >
        <div>
          Submit full analysis
        </div>
      </v-card>

      <v-card  light style="min-height:600px"
        v-show="currentStep == 3"
      >
        <div>
          Enter phenotypes
        </div>
      </v-card>


      <div id="gene-panel-iframe" v-show="currentStep == 4">
        <iframe  :src="apps.genepanel.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="gene-iframe" v-show="currentStep == 5">
        <iframe  :src="apps.gene.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="genefull-iframe" v-show="currentStep == 6">
        <iframe  :src="apps.gene.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <v-card   style="min-height:600px"
        v-show="currentStep == 7"
      >
        <report
        :phenotypes="project.phenotypes"
        :genes="project.genes"
        :variants="project.variants"
        :filters="project.filters">
        </report>
      </v-card>

    </div>


  </div>

</template>


<script>

import Intro from  '../viz/Intro.vue'
import Report from '../viz/Report.vue'
import Login from  '../partials/Login.vue'

import ProjectModel from  '../../models/ProjectModel.js'
import UserSession  from  '../../models/UserSession.js'
import HubSession  from  '../../models/HubSession.js'



export default {
  name: 'home',
  components: {
    Intro,
    Login,
    Report
  },
  props: {
    paramDebug:  null,

    paramProjectId:   null,
    paramSampleId:    null,
    paramTokenType:   null,
    paramToken:       null,
    paramSource:      null
  },
  data() {
    let self = this;
    return {
      greeting: 'clin.iobio.vue',

      isSidebar: false,
      isMinimized: false,

      showDashboard: true,

      isAuthenticated: false,
      userSession:  null,


      idProject: null,
      projectModel: null,

      modelInfos: null,

      appUrls: {
        'localhost': {
            'gene':      'http://localhost:4026/#/?launchedFromClin=true',
            'genepanel': 'http://localhost:4024',
            'bam':       'http://localhost:4027'
        },
        'dev': {
            'gene':      'http://newgene.iobio.io/#/?launchedFromClin=true',
            'genepanel': 'http://panel.iobio.io',
            'bam':       'http://newbam.iobio.io'
        },
      },

      apps: {
        'bam':       {url: null, isLoaded: false, step: 2, iframeSelector: '#bam-iframe iframe'},
        'genepanel': {url: null, isLoaded: false, step: 3, iframeSelector: '#gene-panel-iframe iframe'},
        'gene':      {url: null, isLoaded: false, step: 4, iframeSelector: '#gene-iframe iframe'}
      },

      currentStep: 0,



      //hubEnpoint: null,
      hubSession: null,

      project: null,

      projectTemplate: {

        workflow: {
          title: 'Variant analysis',
          summary: 'Look for causative variants in whole exome or genome sequencing research project. ',
          description: 'The variant report is used to search for caustive variants in a proband, when sequencing data is present for the proband and both parents.  This report is comprised of the following steps:',
          steps: [

            { number: 1,
              title: 'Load data',
              summary: 'Load the sequencing variant and alignment files for the trio.',
              isIntro: false
            },
            { number: 2,
              title: 'Submit full analysis',
              summary: 'Check quality of sequence alignments for the proband.',
              description: 'Check the quality of the underlying sequencing data for the proband. Using the BAM.IOBIO app, areas of missing coverage or unexpected statistics potentially suggesting contamination are investigated.',
              complete: false,
              tasks: [
                { name: 'Specify filters',  key: 'genome_wide_filters', tooltip: 'Specify the filters to apply to all variants to limit to a reasonable set of variants that are possibly causative', complete: false, pass: false },
                { name: 'Enter email',       key: 'email',  tooltip: 'Enter the email to receive notification when the job has finished', complete: false, pass: false }
              ]
            },
            { number: 3,
              title: 'Phenotypes',
              summary: 'Enter all of the phenotypes associated with the proband.',
              description: 'Enter all of the phenotypes associated with the proband.',
              complete: false,
              tasks: [
                { name: 'Enter text description',  key: 'phenotype_description', tooltip: 'Enter free form text that describes the proband\'s phenotypes', complete: false, pass: false },
                { name: 'GTR search terms',       key: 'phenotype_gtr',  tooltip: 'Specify all of the syndromes/disorders that can be searched in the Genetic Testing Registry', complete: false, pass: false },
                { name: 'Phenolyzer search terms',       key: 'phenotype_phenolyzer',  tooltip: 'Specify all of the phenotypes that can be used to run Phenolyzer', complete: false, pass: false }
              ]
            },
            { number: 4,
              title: 'Genes',
              app: 'genepanel',
              summary: 'Generate list of candidate genes.',
              description: "The PANEL.IOBIO app is used to identify genes that are most likely associated with the proband's phenotypes.",
              complete: false,
              tasks: [
                { name: 'Panel genes',             key: 'gtr-genes',       complete: false, pass: false },
                { name: 'Phenotype driven genes',  key: 'phenotype-genes', complete: false, pass: false },
                { name: 'Export genes',            key: 'export-genes',    complete: false, pass: false }
              ]
            },
            { number: 5,
              title: 'Variants (gene driven)',
              app: 'gene',
              summary: 'Interrogate proband for known pathogenic for possible caustive variants based on genes associated with proband\'s phenotypes. Check for areas of insufficient coverage in genes.',
              description: 'The GENE.IOBIO app is used to interrogate proband variants in the identified gene list that could be candidates for causative variants.',
              complete: false,
              tasks: [
                { name: 'Pathogenic variants',     key: 'pathogenic',     tooltip: 'After genes are analyzed, this badge will show you the number of genes with pathogenic variants, which are variants with a 5% allele frequency or less and a pathogenic/likely pathogenic designation from ClinVar', complete: false, pass: false },
                { name: 'VUS',        key: 'vus',         tooltip: 'After genes are analyzed, this badge will show you the number of genes with  ossible caustive variants, which are variants with a 5% allele frequency', complete: false, pass: false },
                { name: 'Insufficient coverage',   key: 'coverage',       tooltip: 'After genes are analyzed, this badge will show you the number of genes insufficient coverage.', complete: false, pass: false },
                { name: 'Expand gene list',        key: 'genes-menu',     tooltip: 'Enter a new gene name or click on the + button to expand the gene list', complete: false, pass: false }
              ]
            },
            { number: 6,
              title: 'Variants (full analysis)',
              app: 'genefull',
              summary: 'Review possible caustive variants found in whole exome/genome of proband, taking into account inheritance mode based on parents and siblings',
              description: 'The GENE.IOBIO app is used to review variants from whole exome/genome variant analysis',
              complete: false,
              tasks: [
                { name: 'Pathogenic variants',     key: 'pathogenic',     tooltip: 'After genes are analyzed, this badge will show you the number of genes with pathogenic variants, which are variants with a 5% allele frequency or less and a pathogenic/likely pathogenic designation from ClinVar', complete: false, pass: false },
                { name: 'VUS',        key: 'vus',         tooltip: 'After genes are analyzed, this badge will show you the number of genes with  ossible caustive variants, which are variants with a 5% allele frequency', complete: false, pass: false }
              ]
            },
            { number: 7,
              title: 'Report',
              summary: 'Generate report for analysis results.',
              description: 'Results from this full analysis are summarized in the report, which can be updated or amended.',
              complete: false
            }

          ]

        }
      }


    }
  },

  created: function() {
    this.init();

  },



  mounted: function() {

  },

  computed: {

  },

  watch: {
    currentStep: function() {
      let self = this;
      if (self.isAuthenticated && self.project && self.currentStep) {
        var theApp = null;

        // If this is the first time we have loaded the app, send
        // message to set the data
        for (var appName in self.apps) {
          let app = self.apps[appName];
          if (app.step == self.currentStep && !app.isLoaded) {
              self.setData(appName, 500);
              app.isLoaded = true;
          }
        }


        // We have moved to a new step.  Save the workflow step.
        if (self.project && self.project.idProject) {
          self.promiseUpdateWorkflow();
        }
      }
    }
  },

  methods: {

    init: function() {
      let self = this;

      self.project = self.projectTemplate;

      // WORKAROUND - until project id can be passed in from hub
      self.idProject = self.paramProjectId && self.paramProjectId.length > 0 ? self.paramProjectId : "testexploratory";

      self.userSession = new UserSession();
      window.addEventListener("message", self.receiveAppMessage, false);


      var appTarget = null;
      if (window.document.URL.indexOf("localhost") > 0) {
        appTarget = "localhost";
      } else {
        appTarget = "dev";
      }
      self.apps.bam.url       = self.appUrls[appTarget].bam;
      self.apps.genepanel.url = self.appUrls[appTarget].genepanel;
      self.apps.gene.url      = self.appUrls[appTarget].gene;


      if (localStorage.getItem('hub-iobio-tkn') && localStorage.getItem('hub-iobio-tkn').length > 0
          && self.paramSampleId && self.paramSource) {

        self.hubSession = new HubSession();
        self.hubSession.promiseInit(self.paramSampleId, self.paramSource)
        .then(modelInfos => {
          self.modelInfos = modelInfos;
        })

      } else {
        let demoVcf = "https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome.vcf.gz";
        let demoBams = {
            'proband': 'https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam',
            'mother':  'https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam',
            'father':  'https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam'
        };
        self.modelInfos = [
          {relationship: 'proband', affectedStatus: 'affected',   name: 'NA12878', 'sample': 'NA12878', 'vcf': demoVcf, 'tbi': null, 'bam': demoBams['proband'], 'bai': null },
          {relationship: 'mother',  affectedStatus: 'unaffected', name: 'NA12892', 'sample': 'NA12892', 'vcf': demoVcf, 'tbi': null, 'bam': demoBams['mother'], 'bai': null  },
          {relationship: 'father',  affectedStatus: 'unaffected', name: 'NA12891', 'sample': 'NA12891', 'vcf': demoVcf, 'tbi': null, 'bam': demoBams['father'], 'bai': null  }
        ];
      }


    },

    onAuthenticated: function() {
      let self = this;
      this.isAuthenticated = true;
      this.projectModel = new ProjectModel(this.userSession);


      if (this.idProject) {
        this.promiseGetProject(this.idProject, true)
        .then(function() {


        })
      }
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

        var msgObject = {
            type: 'set-data',
            sender: 'clin.iobio',
            'modelInfo': probandModelInfo[0],
            'modelInfos': self.modelInfos,
            'phenotypes': self.project.phenotypes,
            'genes': self.project.genes,
            'variants': self.project.variants
        };

        self.sendAppMessage(appName, msgObject);
      }, pauseMillisec);

    },

    sendAppMessage: function(appName, obj) {
      let self = this;
      var theObject = obj ? obj : {type: 'start-analysis', sender: 'clin.iobio'};
      var iframeSelector = self.apps[appName].iframeSelector;
      if (iframeSelector && iframeSelector.length > 0 && $(iframeSelector).length > 0) {
        $(iframeSelector)[0].contentWindow.postMessage(JSON.stringify(theObject), '*');
      } else {
        console.log("Unable to send clin message to " + appName + " because iframe not present ");
        console.log(theObject);
      }
    },


    receiveAppMessage: function(event) {
      // Do we trust the sender of this message?
      if (event.origin !== this.apps.bam.url &&  event.origin !== this.apps.gene.url &&  event.origin !== this.apps.genepanel.url) {
        if (this.paramDebug) {
          console.log("parentWindow received message frum untrusted sender. Event.origin is " + event.origin );
        }
        return;
      }
      var messageObject = JSON.parse(event.data);

      if (this.paramDebug) {
        alert("Clin received message:" + event.data);
        console.log("clin.iobio: message received")
        console.log(messageObject);
      }




      if (messageObject.type == "apply-genes" && messageObject.sender == 'genepanel.iobio.io') {
        var taskMap = {
          'gtr':              'Panel genes',
          'phenotype-driven': 'Phenotype driven genes',
          'all':              'Export genes'
        }
        this.promiseUpdateGenes(messageObject.genes);
        this.promiseUpdatePhenotypes(messageObject.searchTerms);
        this.promiseCompleteStepTask('Gene lists', taskMap[messageObject.source]);
        this.sendAppMessage('gene', messageObject);
      } if (messageObject.type == "apply-genes" && messageObject.sender == 'gene.iobio.io') {
        this.promiseUpdateGenes(messageObject.genes);
        this.sendAppMessage('gene', messageObject);
      } else if (messageObject.type == "save-variants") {
        this.promiseUpdateVariants(messageObject.variants);
        this.promiseCompleteStepTask('De novo variants', 'De novo variants');
        this.promiseCompleteStepTask('De novo variants', 'Pathogenic variants');
      } else if (messageObject.type == "save-filters") {
        this.promiseUpdateFilters(messageObject.filters);
      }


    },

    promiseGetProject: function(idProject, createIfEmpty) {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.projectModel.promiseGetProject(idProject)
        .then( function(theProject) {

          if (theProject == null && createIfEmpty) {
            self.project = $.extend({}, self.projectTemplate);
            self.project.idProject = idProject;
            self.project.genes = [];
            self.project.phenotypes = [];
            self.project.variants = [];
            self.projectModel.promiseAddProject(self.project)
            .then(function() {
              resolve();
            })

          } else {
            self.project = theProject;
            resolve();
          }

        })
        .catch(function(err) {
          reject(err);
        })
      });
    },

    promiseUpdateGenes: function(genes) {
      let self = this;
      self.project.genes = genes;
      return self.projectModel.promiseUpdateGenes(self.project);
    },

    promiseUpdatePhenotypes: function(phenotypes) {
      let self = this;
      self.project.phenotypes = phenotypes;
      return self.projectModel.promiseUpdatePhenotypes(self.project);
    },

    promiseUpdateVariants: function(variants) {
      let self = this;
      self.project.variants = variants;
      return self.projectModel.promiseUpdateVariants(self.project);
    },

    promiseUpdateWorkflow: function() {
      let self = this;
      return self.projectModel.promiseUpdateWorkflow(self.project);
    },

    promiseUpdateFilters: function(filters) {
      let self = this;
      self.project.filters = filters;
      return self.projectModel.promiseUpdateFilters(self.project);
    },

    promiseCompleteStepTask: function(stepTitle, taskName) {
      var filteredStep = this.project.workflow.steps.filter(function(step) {
        return step.title == stepTitle;
      })
      if (filteredStep.length > 0) {
        var filteredTask = filteredStep[0].tasks.filter(function(task) {
          return task.name == taskName;
        })
        if (filteredTask.length > 0) {
          filteredTask[0].complete = true;
        }
      }
      return this.promiseUpdateWorkflow();
    },

    onMouseOverTask: function(step, task) {
      let self = this;
      let msgObject = {
        'type':   'show-tooltip',
        'sender': 'clin.iobio',
        'task':   task
      };
      self.sendAppMessage(step.app, msgObject);
    },

    onMouseLeaveTask: function(step, task) {
      let self = this;
      let msgObject = {
        'type':   'hide-tooltip',
        'sender': 'clin.iobio',
        'task':   task
      };
      self.sendAppMessage(step.app, msgObject);
    }

  }
}
</script>
