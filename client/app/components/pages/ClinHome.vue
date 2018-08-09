/*
 * Home.vue
 *
 */
<style lang="sass"  >

@import ../../../assets/sass/variables



.app-content
  margin-top: 170px
  margin-left: 0px
  border-top: $divider-color
  border-top-width: .5px
  border-top-style: none

.app-content.sidebar
  margin-top: 0px
  margin-left: 270px

.app-content.minimized
  margin-top: 60px
  margin-left: 0px

.app-content.minimized.sidebar
  margin-top: 0px
  margin-left: 110px




#clin-container

  .toolbar--fixed.elevation-0
    box-shadow: none !important
    -webkit-box-shadow: none !important

  .stepper__label
    color: $text-color !important

  .workflow-summary-description
    color: $text-color


  .stepper__content
    color: $text-color

  h5
    color:  $app-color
    margin-top: 8px
    margin-bottom: 4px
    margin-left: 0px
    font-size: 16px
    display: inline-block




  .split-btn
    position: absolute
    top: 5px
    left: 154px
    display: inline-block
    margin: 0px
    padding: 0px
    min-width: 20px
    height: 20px

  .split-btn .btn__content
    max-width: 20px
    padding: 0px
    margin: 0px
    height: 20px
    color: $app-color
    font-weight: 600

  .split-btn .btn__content .material-icons
    font-size: 20px
    color: $app-color
    height: 20px
    width: 20px

  .horizontal-dashboard-card
    padding: 0px
    margin: 0px
    width: 100%
    color: $text-color
    border-bottom: $border-color solid 1px

    .split-btn
      top: 10px


    .stepper__label
      line-height: 17px !important
      text-shadow: none !important

    hr.divider
      display: none


    .stepper__step--active
      .stepper__label
        font-weight: 600
        text-shadow: none !important

    .stepper__header
      margin-top: 10px
      -webkit-box-shadow: none
      box-shadow: none
      width: 450px
      float: left
      justify-content: flex-start

    .stepper.stepper--non-linear
      height: 170px
      -webkit-box-shadow: none !important
      background-color: $app-background-color

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
      height: 150px
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

    .stepper__content
      padding: 0px 0px 0px 0px



    .stepper__step
      padding-top: 10px
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
    overflow: scroll-y

    h5.workflow-title
      font-size: 18px

    .workflow-summary-panel
      padding: 12px 10px 10px 10px

    .split-btn
      right: 34px
      left: initial

    .stepper--vertical
      height: calc(100% + 110px)
      background-color: $app-background-color
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

    .stepper__label
      color: $text-color


    .stepper__step--active
      .stepper__label
        font-weight: 600
        text-shadow: none !important

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
      font-size: 12px

    .task-checkbox-header2
      display: inline-block
      margin-top: 5px
      font-size: 12px

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
      width: calc(100% - 320px)
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

  <div id="clin-container" style="display:flex">
    <login
      v-if="!isAuthenticated"
      :userSession="userSession"
      @authenticated="onAuthenticated">
    </login>


    <v-toolbar  v-if="!isSidebar && isAuthenticated && workflow && analysis "
        light  fixed flat  :height="isMinimized ? 60 : 170">
      <div v-show="isAuthenticated"  :class="{'horizontal-dashboard-card': true, 'minimized': isMinimized}">



        <v-stepper v-model="currentStep"  non-linear>
          <div class="workflow-summary-panel" v-show="!isMinimized">
            <div>
              <v-btn class="split-btn" flat fav small
              v-show="!isMinimized"
              @click="isSidebar = true"
              v-tooltip.top="`Show dashboard on left`">
                <v-icon>vertical_split</v-icon>
              </v-btn>
              <h5> {{ workflow.title }} </h5>

              <div>
                {{ workflow.summary}}
              </div>
            </div>
          </div>


          <v-stepper-header>
            <v-btn v-show="isMinimized" :disabled="currentStep == 1" class="stepper-btn" flat small @click="currentStep = currentStep - 1">
              <v-icon>chevron_left</v-icon>
            </v-btn>
            <template v-for="step in analysis.steps">
              <v-stepper-step v-show="!isMinimized || step.number == currentStep" :key="step.number" editable :step="step.number" :complete="step.complete">
                {{ getStepTitle(step.key) }}
              </v-stepper-step>
              <v-divider v-show="step.number != analysis.steps.length  && !isMinimized "></v-divider>
            </template>
            <v-btn v-show="isMinimized" :disabled="currentStep == analysis.steps.length" class="stepper-btn" flat small @click="currentStep = currentStep + 1">
              <v-icon>chevron_right</v-icon>
            </v-btn>
            <div v-show="!isMinimized" class="stepper-btn-panel">
              <v-btn :disabled="currentStep == 1" class="stepper-btn" flat  @click="currentStep = currentStep - 1">
              <v-icon>chevron_left</v-icon>
              Previous
              </v-btn>
              <v-btn :disabled="currentStep == analysis.steps" class="stepper-btn" flat  @click="currentStep = currentStep + 1">
                <v-icon>chevron_right</v-icon>
                Next
              </v-btn>
            </div>
          </v-stepper-header>


          <div class="vertical-divider" ></div>

          <v-stepper-items>
            <template v-for="step in analysis.steps">

              <v-stepper-content :key="step.key" :step="getStepNumber(step.key)">
                <div class="step-summary-panel" v-if="!isMinimized">
                  <h5>{{ getStepTitle(step.key) }}</h5>
                  <div>
                      {{ getStepSummary(step.key) }}
                  </div>
                </div>

                <div class="tasks-panel" v-if="step.tasks">
                  <div  v-show="!isMinimized">
                    <span class="task-checkbox-header1">Complete</span>
                    <span class="task-checkbox-header2">Passed</span>

                  </div>
                  <div class="task-entry"
                   v-for="task in step.tasks"
                   :key="task.key"
                   >
                    <span class="task-name"
                    v-tooltip.left="getTaskName(step.key, task.key)"
                    @mouseover="onMouseOverTask(step, task)"
                    @mouseleave="onMouseLeaveTask(step, task)">
                    {{ getTaskName(step.key, task.key) }}
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
      v-if="isSidebar && isAuthenticated "
      :mini-variant.sync="isMinimized"
      :hide-overlay="true"
      fixed
      light
      flat
      :width="isMinimized ? 120 : 270"
      mini-variant-width="110">
      <div v-show="isAuthenticated && workflow && analysis"  light :class="{'vertical-dashboard-card': true, 'minimized': isMinimized}">



        <v-stepper v-model="currentStep" vertical non-linear >
          <div class="workflow-summary-panel" >
            <div>
              <v-btn class="split-btn" flat fav small
               v-show="!isMinimized"
               @click="isSidebar = false"
               v-tooltip.bottom="`Show dashboard on top`">
                <v-icon>horizontal_split</v-icon>
              </v-btn>

              <h5 class="workflow-title"> {{ workflow.title }} </h5>

              <v-btn class="expansion-btn" flat fav small v-show="!isMinimized" @click="isMinimized = true">
                <v-icon>chevron_left</v-icon>
              </v-btn>
              <v-btn class="expansion-btn" flat fav small v-show="isMinimized" @click="isMinimized = false">
                <v-icon>chevron_right</v-icon>
              </v-btn>

              <div class="workflow-summary-description" v-show="!isMinimized">
                {{ workflow.summary}}
              </div>
            </div>
          </div>




            <template v-for="step in analysis.steps">
              <v-stepper-step v-show="!isMinimized || isSidebar || step.number == currentStep"
              :key="`step` + step.key"
              editable
              :step="getStepNumber(step.key)"
              :complete="step.complete">
                 {{ getStepTitle(step.key) }}
              </v-stepper-step>
              <v-stepper-content :key="`content` + step.key" :step="getStepNumber(step.key)">
                <div class="step-summary-panel" v-if="!isMinimized">
                    {{ getStepSummary(step.key) }}
                </div>

                <div class="tasks-panel" v-if="step.tasks">
                  <div  v-show="!isMinimized">
                    <span class="task-checkbox-header1">Complete</span>
                    <span class="task-checkbox-header2">Passed</span>

                  </div>
                  <div class="task-entry"
                   v-for="task in step.tasks"
                   :key="task.key"
                   >
                    <span class="task-name"
                    v-tooltip.left="getTaskName(step.key, task.key)"
                    @mouseover="onMouseOverTask(step, task)"
                    @mouseleave="onMouseLeaveTask(step, task)">
                    {{ getTaskName(step.key, task.key) }}
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


    <div style="width:100%;height:100%;padding: 0px"
    :class="{'app-content': true, 'sidebar': isSidebar, 'minimized': isMinimized}"
    v-show="isAuthenticated " >
      <v-card  light style="min-height:600px"
        v-if="analysis && workflow"
        v-show="currentStep == 1"
      >
        <intro style="padding:20px"
        :workflow="workflow"
        :analysis="analysis">
        </intro>
      </v-card>


      <v-card  light style="min-height:600px"
        v-show="currentStep == 2"
      >
        <div style="padding:20px">
          Submit full analysis
        </div>
      </v-card>


      <div id="gene-panel-iframe" v-show="currentStep == 3">
        <iframe  :src="apps.genepanel.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="gene-iframe" v-show="currentStep == 4">
        <iframe  :src="apps.gene.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="genefull-iframe" v-show="currentStep == 5">
        <iframe  :src="apps.gene.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <v-card   style="min-height:600px"
        v-show="currentStep == 6"
      >
        <report
        v-if="analysis"
        :phenotypes="analysis.phenotypes"
        :genes="analysis.genes"
        :variants="analysis.variants"
        :filters="analysis.filters">
        </report>
      </v-card>

    </div>


  </div>

</template>


<script>

import Intro from  '../viz/Intro.vue'
import Report from '../viz/Report.vue'
import Login from  '../partials/Login.vue'

import AnalysisModel from  '../../models/AnalysisModel.js'
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
    paramAnalysisId:  null,
    paramTokenType:   null,
    paramToken:       null,
    paramSource:      null
  },
  data() {
    let self = this;
    return {
      greeting: 'clin.iobio.io',
      isSidebar: false,
      isMinimized: false,

      isAuthenticated: false,
      userSession:  null,
      hubSession: null,
      modelInfos: null,

      appUrls: {
        'localhost': {
            'gene':      'http://localhost:4026/?launchedFromClin=true',
            'genepanel': 'http://localhost:4024',
            'bam':       'http://localhost:4027'
        },
        'dev': {
            'gene':      'https://dev.gene.iobio.io/?launchedFromClin=true',
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

      analysisModel: null,

      idWorkflow: "1",
      workflow: null,
      analysis: null,

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
      if (self.isAuthenticated && self.workflow && self.analysis && self.currentStep) {
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
        if (self.analysis && self.analysis.id) {
          self.promiseUpdateWorkflow();
        }
      }
    }
  },

  methods: {

    init: function() {
      let self = this;

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
        // For now, just hardcode is_pedgree = true
        self.hubSession.promiseInit(self.paramSampleId, self.paramSource, true)
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
      self.isAuthenticated = true;
      self.analysisModel = new AnalysisModel(self.userSession);

      self.promiseGetWorkflow(self.idWorkflow)
      .then(function() {


        self.promiseGetAnalysis(
          self.paramProjectId && self.paramProjectId.length > 0 ? self.paramProjectId : 'test-project',
          self.paramSampleId && self.paramSampleId.length > 0 ? self.paramSampleId : 'test-sample',
          self.paramAnalysisId,
          self.workflow,
          true)
        .then(function() {


        })

      })

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

        var msgObject = {
            type:        'set-data',
            sender:      'clin.iobio',
            'modelInfo':  probandModelInfo[0],
            'modelInfos': self.modelInfos,
            'phenotypes': self.analysis.phenotypes,
            'genes':      self.analysis.genes,
            'variants':   self.analysis.variants
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
      if (!this.isValidAppOrigin(event)) {
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
          'gtr':              'gtr-genes',
          'phenotype-driven': 'phenotype-genes',
          'all':              'export-genes'
        }
        this.promiseUpdateGenes(messageObject.genes);
        this.promiseUpdatePhenotypes(messageObject.searchTerms);
        this.promiseCompleteStepTask('genes', taskMap[messageObject.source]);
        this.sendAppMessage('gene', messageObject);
      } if (messageObject.type == "apply-genes" && messageObject.sender == 'gene.iobio.io') {
        this.promiseUpdateGenes(messageObject.genes);
      } else if (messageObject.type == "save-variants") {
        this.promiseUpdateVariants(messageObject.variants);
        this.promiseCompleteStepTask('variants', 'pathogenic');
        this.promiseCompleteStepTask('variants', 'vus');
      } else if (messageObject.type == "save-filters") {
        this.promiseUpdateFilters(messageObject.filters);
      }


    },


    isValidAppOrigin: function(event) {
      return (this.apps.gene.url.indexOf(event.origin) >= 0 || this.apps.genepanel.url.indexOf(event.origin) >= 0);
    },

    promiseGetWorkflow: function(idWorkflow) {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.analysisModel.promiseGetWorkflow(idWorkflow)
        .then(function(theWorkflow) {
          self.workflow = theWorkflow;
          resolve();
        })
        .catch(function(error) {
          reject(error);
        })
      })
    },


    promiseGetAnalysis: function(idProject, idSample, idAnalysis, workflow, createIfEmpty) {
      let self = this;
      return new Promise(function(resolve, reject) {

        if (idAnalysis == null || idAnalysis.length == 0) {

          self.analysisModel.promiseGetAnalysesForSample(workflow.id, idSample)
          .then(function(analyses) {
            if (analyses && analyses.length > 0) {

              // TODO:  get last analysis if there is more than one
              self.analysis = analyses[0];
              self.idAnalysis = self.analysis.id;
              resolve();

            } else if (createIfEmpty) {

              self.idAnalysis = self.createUniqueId();
              self.analysis = {};
              self.analysis.id = self.idAnalysis;
              self.analysis.datetime_created = self.getCurrentDateTime();
              self.analysis.project_id = idProject;
              self.analysis.sample_id = idSample;
              self.analysis.workflow_id = workflow.id;
              self.analysis.genes = [];
              self.analysis.phenotypes = [];
              self.analysis.variants = [];
              self.analysis.steps = workflow.steps.map(function(step) {
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
              self.analysisModel.promiseAddAnalysis(self.analysis)
              .then(function() {
                resolve();
              })
              .catch(function(err) {
                reject(err);
              })

            } else {
              reject("Unable to find/create an analysis");
            }
          })
          .catch(function(err) {
            reject(err);
          })

        } else {
          self.analysisModel.promiseGetAnalysis(idAnalysis)
          .then( function(theAnalysis) {

              self.analysis = theAnalysis;
              self.idAnalysis = self.analysis.id;
              resolve();
          })
          .catch(function(err) {
          reject(err);
          })

        }

      });
    },

    promiseUpdateGenes: function(genes) {
      let self = this;
      self.analysis.genes = genes;
      self.analysis.datetime_last_modified = self.getCurrentDateTime();
      return self.analysisModel.promiseUpdateGenes(self.analysis);
    },

    promiseUpdatePhenotypes: function(phenotypes) {
      let self = this;
      self.analysis.phenotypes = phenotypes;
      self.analysis.datetime_last_modified = self.getCurrentDateTime();
      return self.analysisModel.promiseUpdatePhenotypes(self.analysis);
    },

    promiseUpdateVariants: function(variants) {
      let self = this;
      self.analysis.variants = variants;
      self.analysis.datetime_last_modified = self.getCurrentDateTime();
      return self.analysisModel.promiseUpdateVariants(self.analysis);
    },

    promiseUpdateWorkflow: function() {
      let self = this;
      self.analysis.datetime_last_modified = self.getCurrentDateTime();
      return self.analysisModel.promiseUpdateSteps(self.analysis);
    },

    promiseUpdateFilters: function(filters) {
      let self = this;
      self.analysis.filters = filters;
      self.analysis.datetime_last_modified = self.getCurrentDateTime();
      return self.analysisModel.promiseUpdateFilters(self.analysis);
    },

    promiseCompleteStepTask: function(stepKey, taskKey) {
      var filteredStep = this.analysis.steps.filter(function(step) {
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

    createUniqueId: function() {
      var uniqueId = Math.random().toString(36).substring(2)
                 + (new Date()).getTime().toString(36);
      return uniqueId;
    },

    getCurrentDateTime: function() {
      var dateObj = new Date();
      return dateObj.getTime();
    },

    formatCurrentDateTime: function(time) {
      var dateObject = new Date(time);
      return dateObject.toString();
    }


  }
}
</script>
