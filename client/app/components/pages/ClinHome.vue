/*
 * Home.vue
 *
 */
<style lang="sass"  >

@import ../../../assets/sass/variables


.clin-card
  background-color: rgb(250, 250, 250)
  min-height: 600px
  padding: 0px



.app-content
  margin-top: 145px
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
  margin-left: 150px


.task-entry
  .task-switch
    height: 30px !important
    .input-group--selection-controls__ripple
      height: 30px !important
    &.input-group--hide-details
      .input-group__details
        display: none !important
        min-height: 0px !important

.toolbar__content
  background: $nav-background-color

#clin-container
  font-size: 14px

  .navigation-drawer--fixed
    overflow-y: auto


  .input-group--selection-controls.accent--text
    .icon--selection-control
      color: $text-color

  .input-group--selection-controls.accent--text.input-group--active
    .icon--selection-control
      color: $app-color

  .stepper__step
    .stepper__label
      color: $text-color
      line-height: 16px


  .stepper__step.stepper__step--active
    .stepper__label
      color: $app-color
    .stepper__step__step.primary
      background-color: $app-color !important

  .toolbar--fixed.elevation-0
    box-shadow: none !important
    -webkit-box-shadow: none !important


  .workflow-summary-panel
    color: $text-color

  .workflow-summary-title
    font-size: 16px
    padding-top: 3px


  .workflow-summary-description
    font-family: $app-text-font
    line-height: 15px
    font-size: 13px


  .step-summary-panel
    font-family: $app-text-font
    line-height: 16px
    font-size: 14px

  .task-name
    font-family: $app-text-font
    font-size: 14px



  .stepper__content
    color: $text-color !important

  h5
    color:  $text-color
    margin-top: 2px
    margin-bottom: 5px
    margin-left: 0px
    font-size: 18px
    display: inline-block




  .preferences-button
    position: absolute
    top: 0px
    left: 240px
    display: inline-block
    margin: 0px
    padding: 0px
    min-width: 20px
    height: 20px
    z-index: 1

  .preferences-button .btn__content
    max-width: 20px
    padding: 0px
    margin: 0px
    height: 20px
    color: $text-color
    font-weight: 600

  .preferences-button .btn__content .material-icons
    font-size: 20px
    color: $text-color
    height: 20px
    width: 20px

  .horizontal-dashboard-card
    padding: 0px
    margin: 0px
    width: 100%
    color: $text-color
    border-bottom: $nav-border-color solid 1px

    .split-btn
      top: 10px



    .stepper__label
      line-height: 17px !important
      text-shadow: none !important
      font-size: 16px

    hr.divider
      background-color: $text-color !important

    .stepper__step--active
      .stepper__label
        font-weight: 600
        text-shadow: none !important

    .stepper__header
      margin-top: 5px
      -webkit-box-shadow: none
      box-shadow: none
      font-size: 14px
      justify-content: space-between
      height: 30px

    .stepper.stepper--non-linear
      height: 145px
      -webkit-box-shadow: none !important
      background-color: $nav-background-color

    .stepper-btn-panel
      height: 30px
      vertical-align: top

    .stepper-btn
      color: $app-color
      display: inline-block
      margin: 0px
      margin-top: 0px
      padding: 0px
      height: 30px

    .stepper-btn .btn__content
      max-width: 110px
      padding: 0px
      margin: 0px
      height: 30px


    .vertical-divider
      border-left: 1px solid $divider-color
      height: 120px
      float: left
      margin-top: 5px
      margin-bottom: 5px
      margin-left: 10px
      margin-right: 0px

    .workflow-summary-panel
      width: 270px
      float: left
      display: inline-block
      padding: 5px 5px 5px 10px
      overflow-y: auto
      margin-left: 4px
      margin-right: 0px

      h5
        margin-bottom: 10px

    .stepper__content
      padding: 0px 0px 0px 0px

      .stepper__wrapper
        display: flex
        flex-direction: row
        justify-content: center

    .stepper__step
      padding-top: 5px
      padding-bottom: 5px
      margin-left: 0px
      margin-right: 0px

    .stepper__items
      display: flex
      margin-left: 5px
      min-width: 480px

    .step-summary-panel
      width: 300px
      display: inline-block
      padding: 15px 15px 5px 5px
      overflow-y: auto

    .tasks-panel
      display: inline-block
      padding-top: 0px
      margin-top: 10px

    .task-entry
      clear: both
      overflow: auto
      display: flex


    .task-name
      display: flex
      vertical-align: top
      cursor: pointer
      padding-top: 6px

    .task-switch
      display: flex
      max-width: 24px !important
      height: 25px
      margin-left: 20px
      margin-right: 5px
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


  .vertical-dashboard-card
    height: 100%


    .preferences-button
      top: 4px
      right: 0px
      left: initial

    h5.workflow-title
      font-size: 16px
      margin-top: 0px

    .workflow-summary-panel
      padding: 13px 10px 10px 10px

    .split-btn
      right: 34px
      left: initial

    .stepper--vertical
      height: calc(100% + 110px)
      background-color: $nav-background-color
      .stepper__step
        width: 100%
        padding: 14px 10px 14px 5px
        margin-bottom: 0px
        margin-top: 8px
      .stepper__header
        height: initial
        -webkit-box-shadow: none
        box-shadow: none
        font-size: 14px
      .stepper__content
        margin: -8px -36px -16px 16px
        padding: 8px 50px 16px 8px

      .stepper__content:not(:last-child)
        border-left: 1px solid $text-color

    .stepper__label
      color: $text-color
      font-size: 16px


    .stepper__step--active
      .stepper__label
        font-weight: 600
        text-shadow: none !important

    .step-summary-panel
      width: 220px
      word-wrap: break-word
      margin-bottom: 10px

    .tasks-panel
      width: 220px



    .task-name
      display: inline-block
      vertical-align: bottom
      width: 170px
      cursor: pointer
      line-height: 15px
      padding-bottom: 8px
      padding-top: 3px

    .task-switch
      display: inline-block !important
      width: 24px !important
      height: 30px !important
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



  .vertical-dashboard-card.minimized

    .workflow-title
      width: 105px

    .stepper--vertical
      .stepper__step
        width: 100%
        padding: 14px 5px 14px 3px
      .stepper__content
        margin:  0px -36px -6px 6px
        padding: 8px 50px 0px 8px
      .stepper__header
        padding-left: 2px
      .stepper__step__step
        margin-right: 6px

      .step-summary-panel
        width: 100px
        word-wrap: break-word

      .stepper__content:not(:last-child)
        border-left: none !important

    .task-entry
      display: flex
    .tasks-panel
      width: 100px
    .task-switch
      margin-left: 0px
      margin-bottom: 10px
      margin-right: 4px
    .task-name
      width: 80px
      padding-right: 10px
      padding-bottom: 0px


  .horizontal-dashboard-card.minimized

    .preferences-button
      top: 0px
      left: 0px
      right: initial

    .stepper.stepper--non-linear
      height: 60px
      display: flex
    .stepper__header
      height: 60px
      margin-right: 30px
      margin-top: 0px
      margin-left: 30px
    .stepper__step
      padding: 16px 5px 24px 5px
    .stepper__items
      display: flex
    .stepper-btn
      min-width: 40px
      margin-top: 10px
    .stepper-btn .btn__content
        max-width: 40px

    .tasks-panel
      padding-top: 12px
      display: flex
      width: initial
      margin-top: 0px
    .task-name
      width: initial
      padding-top: 5px
      padding-right: 5px
    .task-entry
      display: flex
      clear: initial
      margin-right: 30px
    .task-switch
      display: flex
      width: 40px !important
      margin-left: 0px

    .vertical-divider
      height: 50px
      display: none







#clin-container

  &.dark

    .preferences-button
      .btn__content
        .material-icons
          color: white

    .toolbar__content
      background: $dark-nav-background-color

    .workflow-summary-description
      color: $dark-text-color

    .input-group--selection-controls.accent--text
      .icon--selection-control
        color: $dark-text-color


    .input-group--selection-controls.accent--text.input-group--active
      .icon--selection-control
        color: $dark-app-color


    .stepper__step__step
      background-color: $dark-stepper-color

    .stepper__step.stepper__step
      .stepper__label
        color: $dark-text-color

    .stepper__step.stepper__step--active
      .stepper__label
        color: $dark-app-color
      .stepper__step__step.primary
        background-color: $dark-app-color !important

    .stepper__content
      color: $dark-text-color !important

    h5
      color:  $dark-text-color

    .split-btn .btn__content
      color: $dark-text-color

    .split-btn .btn__content .material-icons
      color: $dark-text-color


    .horizontal-dashboard-card
      color: $dark-text-color
      border-bottom: $dark-nav-border-color solid 1px

      .stepper.stepper--non-linear
        background-color: $dark-nav-background-color

      .stepper-btn
        color: $dark-app-color


      .expansion-btn
        color: $dark-app-color

      .expansion-btn .btn__content .material-icons
        color: $dark-app-color

      hr.divider
        background-color: $dark-text-color !important

    .vertical-dashboard-card
      .stepper--vertical
        background-color: $dark-nav-background-color

      .stepper__label
        color: $dark-text-color

      .expansion-btn .btn__content
        color: $dark-app-color !important

      .expansion-btn .btn__content .material-icons
        color: $dark-app-color


</style>



<template>

  <div id="clin-container" style="display:flex" :class="theme">
    <login
      v-if="!isAuthenticated"
      :userSession="userSession"
      @authenticated="onAuthenticated">
    </login>


    <v-toolbar  v-if="!isSidebar && isAuthenticated && workflow && analysis "
        light  fixed flat  :height="isMinimized ? 60 : 145">
      <div v-show="isAuthenticated"  :class="{'horizontal-dashboard-card': true, 'minimized': isMinimized}">

          <preferences-menu
            class="preferences-button"
            :isSidebar="isSidebar"
            :isMinimized="isMinimized"
            :theme="theme"
            @switch-theme="switchTheme"
            @switch-sidebar="switchSidebar"
            @switch-minimized="switchMinimized">
          </preferences-menu>

          <div class="workflow-summary-panel" v-show="!isMinimized">
            <div>

              <h5 v-if="!caseSummary"class="workflow-summary-title"> {{ workflow.title }} </h5>
              <div v-if="!caseSummary" class="workflow-summary-description">
                {{ workflow.summary}}
              </div>

              <h5 v-if="caseSummary" class="workflow-summary-title"> {{ caseSummary.name }} </h5>
              <div v-if="caseSummary" class="workflow-summary-description">
                {{ caseSummary.phenotypes}}
              </div>
            </div>
          </div>

          <div class="vertical-divider" ></div>


        <v-stepper v-model="currentStep"  non-linear>

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
              <v-btn :disabled="currentStep == analysis.steps.length" class="stepper-btn" flat  @click="currentStep = currentStep + 1">
                <v-icon>chevron_right</v-icon>
                Next
              </v-btn>
            </div>
          </v-stepper-header>




          <v-stepper-items>
            <template v-for="step in analysis.steps">

              <v-stepper-content :key="step.key" :step="getStepNumber(step.key)">
                <div class="step-summary-panel" v-if="!isMinimized">
                  <h5 v-if="false">{{ getStepTitle(step.key) }}</h5>
                  <div>
                      {{ getStepSummary(step.key) }}
                  </div>
                </div>

                <div class="tasks-panel" v-if="step.tasks">
                  <div  v-show="!isMinimized">
                    <span v-if="false"  class="task-checkbox-header1">Complete</span>
                    <span v-if="false" class="task-checkbox-header2">Passed</span>

                  </div>
                  <div class="task-entry"
                   v-for="task in step.tasks"
                   :key="task.key"
                   >
                    <v-checkbox class="task-switch"
                      v-model="task.complete"
                      hide-details
                      v-tooltip.right="`Completed`"
                    ></v-checkbox>
                    <v-switch small class="task-switch"
                      v-if="false && task.complete"
                      v-model="task.pass"
                      v-tooltip.right="`Passed`"
                      hide-details
                    ></v-switch>
                    <span class="task-name"
                    v-tooltip.left="getTaskName(step.key, task.key)"
                    @mouseover="onMouseOverTask(step, task)"
                    @mouseleave="onMouseLeaveTask(step, task)">
                    {{ getTaskName(step.key, task.key) }}
                    </span>
                  </div>

                </div>
              </v-stepper-content>
            </template>
          </v-stepper-items>
        </v-stepper>



      </div>
    </v-toolbar>

    <v-navigation-drawer
      v-if="isSidebar && isAuthenticated "

      :hide-overlay="true"
      fixed
      light
      flat
      :width="isMinimized ? 150 : 270"
      mini-variant-width="150">
      <div v-show="isAuthenticated && workflow && analysis"  light :class="{'vertical-dashboard-card': true, 'minimized': isMinimized}">

        <preferences-menu
          class="preferences-button"
          :isSidebar="isSidebar"
          :isMinimized="isMinimized"
          :theme="theme"
          @switch-theme="switchTheme"
          @switch-sidebar="switchSidebar"
          @switch-minimized="switchMinimized">
        </preferences-menu>

        <v-stepper v-model="currentStep" vertical non-linear >
          <div class="workflow-summary-panel" >
            <div>

              <h5 v-if="!caseSummary" class="workflow-title"> {{ workflow.title }} </h5>
              <div v-if="!caseSummary" class="workflow-summary-description" v-show="!isMinimized">
                {{ workflow.summary}}
              </div>

              <h5 v-if="caseSummary" class="workflow-title"> {{ caseSummary.name }} </h5>
              <div v-if="caseSummary"  class="workflow-summary-description" v-show="!isMinimized">
                {{ caseSummary.phenotypes}}
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
                    <span v-if="false" class="task-checkbox-header1">Complete</span>
                    <span v-if="false" class="task-checkbox-header2">Passed</span>

                  </div>
                  <div class="task-entry"
                   v-for="task in step.tasks"
                   :key="task.key"
                   >
                    <v-checkbox class="task-switch"
                      v-model="task.complete"
                      v-tooltip.right="`Completed`"
                    ></v-checkbox>
                    <v-switch  small class="task-switch"
                      v-if="false && task.complete"
                      v-model="task.pass"
                      v-tooltip.right="`Passed`"
                    ></v-switch>
                    <span class="task-name"
                    v-tooltip.left="getTaskName(step.key, task.key)"
                    @mouseover="onMouseOverTask(step, task)"
                    @mouseleave="onMouseLeaveTask(step, task)">
                    {{ getTaskName(step.key, task.key) }}
                    </span>
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
      <v-card  class="clin-card"
        v-if="analysis && workflow"
        v-show="currentStep == 1"
      >
        <setup
        :workflow="workflow"
        :analysis="analysis"
        :modelInfos="modelInfos">
        </setup>
      </v-card>


      <div id="gene-panel-iframe" v-show="!isAuthenticated || currentStep == 2">
        <iframe  :src="apps.genepanel.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="gene-iframe" v-show="!isAuthenticated || currentStep == 3">
        <iframe  :src="apps.gene.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="genefull-iframe" v-show="!isAuthenticated || currentStep == 4">
        <iframe  :src="apps.gene.url + '&mode=full'" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <v-card  class="clin-card"
        v-show="currentStep == 5"
      >
        <report
        ref="reportRef"
        v-if="analysis"
        :phenotypes="analysis.phenotypes"
        :genes="analysis.genes"
        :variants="variants.gene"
        :variantsFullAnalysis="variants.genefull"
        :filters="analysis.filters">
        </report>
      </v-card>

    </div>


  </div>

</template>


<script>

import Setup from  '../viz/Setup.vue'
import Report from '../viz/Report.vue'
import Login from  '../partials/Login.vue'
import PreferencesMenu from  '../partials/PreferencesMenu.vue'

import AnalysisModel from  '../../models/AnalysisModel.js'
import UserSession  from  '../../models/UserSession.js'
import HubSession  from  '../../models/HubSession.js'


export default {
  name: 'home',
  components: {
    Setup,
    Login,
    Report,
    PreferencesMenu
  },
  props: {
    paramDebug:  null,

    paramProjectId:   null,
    paramSampleId:    null,
    paramAnalysisId:  null,
    paramTokenType:   null,
    paramToken:       null,
    paramSource:      null,

    paramTheme: null
  },
  data() {
    let self = this;
    return {
      greeting: 'clin.iobio.io',
      theme:    self.paramTheme && self.paramTheme.length > 0 ? self.paramTheme : 'dark',
      isSidebar: false,
      isMinimized: false,

      isAuthenticated: false,
      userSession:  null,
      hubSession: null,
      modelInfos: null,

      appUrls: {
        'localhost': {
            'gene':      'http://localhost:4026/?launchedFromClin=true',
            'genefull':  'http://localhost:4026/?launchedFromClin=true&mode=full',
            'genepanel': 'http://localhost:4024/?launchedFromClin=true',
            'bam':       'http://localhost:4027'
        },
        'dev': {
            'gene':      'https://dev.gene.iobio.io/?launchedFromClin=true',
            'genefull':  'https://dev.gene.iobio.io/?launchedFromClin=true&mode=full',
            'genepanel': 'https://dev.panel.iobio.io/?launchedFromClin=true',
            'bam':       'http://newbam.iobio.io'
        },
      },

      apps: {
        'bam':       {url: null, isLoaded: false, step: 0, iframeSelector: '#bam-iframe iframe'},
        'genepanel': {url: null, isLoaded: false, step: 2, iframeSelector: '#gene-panel-iframe iframe'},
        'gene':      {url: null, isLoaded: false, step: 3, iframeSelector: '#gene-iframe iframe'},
        'genefull':  {url: null, isLoaded: false, step: 4, iframeSelector: '#genefull-iframe iframe'}
      },

      currentStep: 0,

      analysisModel: null,

      idWorkflow: "1",
      workflow: null,
      analysis: null,
      caseSummary: null,
      analysisCache:     {'gene': null, 'genefull': null},
      analysisCacheKeys: {'gene': null, 'genefull': null},
      variants:          {'gene': null, 'genefull': null},
      variantData:       {'gene': null, 'genefull': null}

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





        // If we are going to gene.iobio (candidate genes), request
        // the genes from gene panel
        let appGene = self.apps.gene;
        if (appGene.step == self.currentStep && appGene.isLoaded) {
          var msgObject = {
            type:                  'request-genes',
            sender:                'clin.iobio',
            receiver:              'genepanel' };
          self.sendAppMessage('genepanel', msgObject);
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

      }


    },

    switchTheme: function(theme) {
      this.theme = theme;
    },
    switchSidebar: function(isSidebar) {
      this.isSidebar = isSidebar
    },
    switchMinimized: function(isMinimized) {
      this.isMinimized = isMinimized
    },

    onAuthenticated: function(researcher, project) {
      let self = this;
      self.isAuthenticated = true;
      self.analysisModel = new AnalysisModel(self.userSession);

      let sampleId = null;
      if (researcher && researcher.length > 0) {
        sampleId = researcher;
      } else if (self.paramSampleId && self.paramSampleId.length > 0) {
        sampleId = self.paramSampleId;
      } else {
        sampleId = 'test-sample';
      }

      let projectId = null;
      if (project && project.length > 0) {
        projectId = project;
      } else if (self.paramProjectId && self.paramProjectId.length > 0) {
        projectId = self.paramProjectId;
      } else {
        projectId = 'test-project';
      }

      let promiseModelInfo = null;
      if (self.hubSession == null) {

        promiseModelInfo = self.analysisModel.promiseGetModelInfo(projectId)
        .then(function(modelInfo) {

          self.caseSummary = modelInfo.summary;

          if (self.hubSession == null) {
            self.modelInfos = [
             {'relationship': 'proband',
              'affectedStatus': 'affected',
              'name':    modelInfo.sampleId.proband,
              'sample':  modelInfo.sampleId.proband,
              'vcf':     modelInfo.vcf,
              'tbi':     null,
              'bam':     modelInfo.bam.proband,
              'bai':     null },
             {'relationship': 'mother',
              'affectedStatus': 'unaffected',
              'name':    modelInfo.sampleId.mother,
              'sample':  modelInfo.sampleId.mother,
              'vcf':     modelInfo.vcf,
              'tbi':     null,
              'bam':     modelInfo.bam.mother,
              'bai':     null },
             {'relationship': 'father',
              'affectedStatus': 'unaffected',
              'name':    modelInfo.sampleId.father,
              'sample':  modelInfo.sampleId.father,
              'vcf':     modelInfo.vcf,
              'tbi':     null,
              'bam':     modelInfo.bam.father,
              'bai':     null },
            ];

          }

        })

      } else {
        promiseModelInfo = Promise.resolve();
      }

      promiseModelInfo.then(function() {
        self.promiseGetWorkflow(self.idWorkflow)
        .then(function() {


          self.promiseGetAnalysis(
            projectId,
            sampleId,
            self.paramAnalysisId,
            self.workflow,
            {'createIfEmpty': true, 'getCache': true} )
          .then(function() {


            // Send message to set the data in the iobio apps
            for (var appName in self.apps) {
              let app = self.apps[appName];
              if (!app.isLoaded) {
                  self.setData(appName, 500);
                  app.isLoaded = true;
              }
            }

          })

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

        self.promiseGetVariants(appName)
        .then(function() {
          return self.promiseGetVariantData(appName)
        })
        .then(function() {
          return self.promiseGetCache(appName)
        })
        .then(function() {
          let app = self.apps[appName];
          var msgObject = {
              type:                  'set-data',
              sender:                'clin.iobio',
              receiver:               appName,
              'isFrameVisible':       app.step == self.currentStep,
              'modelInfo':            probandModelInfo[0],
              'modelInfos':           self.modelInfos,
              'phenotypes':           self.analysis.phenotypes,
              'genes':                self.analysis.genes,
              'genesReport':          self.analysis.genesReport,
              'genesGtr':             self.analysis.genesGtr,
              'genesPhenolyzer':      self.analysis.genesPhenolyzer,
              'genesManual':          self.analysis.genesManual,
              'variants':             appName == 'gene' || appName == 'genefull'  ? self.variants[appName] : null,
              'variantData':          appName == 'genefull' && self.variantData.genefull && self.variantData.genefull.length > 0 ? self.analysisModel.parseVariantData(self.variantData.genefull) : null,
              'cache':                self.analysisCache[appName] ? self.analysisCache[appName] : null
          };

        self.sendAppMessage(appName, msgObject);

        })


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
        this.promiseUpdateGenesData(messageObject);
        this.promiseCompleteStepTask('genes', taskMap[messageObject.source]);
        this.sendAppMessage('gene', messageObject);
      } if (messageObject.type == "apply-genes" && messageObject.sender == 'gene.iobio.io') {
        this.promiseUpdateGenes(messageObject.genes);
      } else if (messageObject.type == "save-variants") {
        if (messageObject.action == "update") {
          this.promiseUpdateVariants(messageObject.app, messageObject.variants)
        } if (messageObject.action == "replace") {
          this.promiseReplaceVariants(messageObject.app, messageObject.variants)
        } else if (messageObject.action == "delete") {
          this.promiseDeleteVariants(messageObject.app, messageObject.variants)
        }
      } else if (messageObject.type == "save-cache") {
        this.promiseUpdateCache(messageObject.app, messageObject.cache);
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


    promiseGetAnalysis: function(idProject, idSample, idAnalysis, workflow, options={}) {
      let self = this;
      return new Promise(function(resolve, reject) {

        var createIfEmpty = options.hasOwnProperty("createIfEmpty") ? options.createIfEmpty : true;


        if (idProject && idProject.length > 0 && idSample && idSample.length > 0) {

          self.analysisModel.promiseGetAnalysesForSample(workflow.id, idProject, idSample)
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
              }),
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

    promiseGetVariantData: function(app) {
      let self = this;
      return new Promise(function(resolve, reject) {
        if (app == 'genefull') {
          self.analysisModel.promiseGetVariantData(app, self.analysis.project_id)
          .then(function(variantData) {
            if (variantData && variantData.data) {
              self.variantData[app] = variantData.data;
            } else {
              self.variantData[app] = null;
            }
            resolve();
          })
        } else {
          self.variantData[app] = null;
          resolve();
        }
      })
    },

    promiseGetVariants: function(app) {
      let self = this;

      return new Promise(function(resolve, reject) {
        if ( app == 'genefull' || app == 'gene') {

          self.analysisModel.promiseGetVariants(app, self.analysis.id)
          .then(function(data) {
            self.variants[app] = data;
            resolve();
          })
          .catch(function(error) {
            let msg = "Problem in ClinHome.promiseGetVariants() for " + app + ": " + error;
            console.log(msg);
            reject(msg);
          })

        } else {
          self.variants[app] = null;
          resolve();
        }

      })
    },


    promiseGetCache: function(app) {
      let self = this;

      return new Promise(function(resolve, reject) {
        if (app == 'gene' || app == 'genefull') {

          let cacheItems = [];
          let cacheKeysToDelete = [];

          self.analysisModel.promiseGetCache(app, self.analysis.id)
          .then(function(data) {

            // For candidate gene variant analysis, we only want to keep cache items
            // for relevant genes
            let applicableGenes = [];
            if (app == 'gene') {
              applicableGenes = self.analysis.genes;
            } else if (app == 'genefull') {
              let geneMap = {};
              self.variants.genefull.forEach(function(v) {
                geneMap[v.gene] = true;
              })
              for (var geneName in geneMap) {
                applicableGenes.push(geneName);
              }
            }
            data.forEach(function(cacheItem) {
              var keyTokens = cacheItem.cache_key.split(self.analysisModel.DELIM);
              // TODO:  Use common class cache helper to parse key
              if (keyTokens.length > 2) {
                let gene = keyTokens[2];
                if (applicableGenes.indexOf(gene) >= 0) {
                  cacheItems.push(cacheItem);
                } else {
                  cacheKeysToDelete.push(cacheItem.cache_key);
                }
              }
            })
            self.analysisCache[app] = cacheItems;



            self.analysisCacheKeys[app] = data.map(function(cacheItem) {
              return cacheItem.cache_key;
            });


            self.analysisModel.promiseDeleteCache(app, self.analysis.id, cacheKeysToDelete)
            .then(function() {
              resolve();
            })

          })
          .catch(function(error) {
            let msg = "Problem in ClinHome.promiseGetCache(): " + error;
            console.log(msg);
            reject(msg);
          })

        } else {
          self.analysisCache[app] = null;
          self.analysisCacheKeys[app] = null;
          resolve();
        }

      })
    },

    promiseUpdateGenesData: function(messageObject) {
      let self = this;
      self.analysis.genesReport     = messageObject.genesReport;
      self.analysis.genesGtr        = messageObject.genesGtr;
      self.analysis.genesPhenolyzer = messageObject.genesPhenolyzer;
      self.analysis.genesManual     = messageObject.genesManual;
      self.analysis.genes           = messageObject.genes;
      self.analysis.phenotypes      = messageObject.searchTerms;
      self.analysis.datetime_last_modified = self.getCurrentDateTime();
      return self.analysisModel.promiseUpdateGenesData(self.analysis);
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

    promiseReplaceVariants: function(app, variants) {
      let self = this;
      self.analysisModel.replaceMatchingVariants(variants, self.variants[app]);
      let variantsToRemove = self.analysisModel.getObsoleteVariants(variants, self.variants[app]);

      self.variants[app] = variants;
      if (self.$refs.reportRef) {
        self.$refs.reportRef.refreshReport();
      }
      return self.analysisModel.promiseUpdateVariants(app, self.analysis.id, variants, variantsToRemove);
    },

    promiseUpdateVariants: function(app, variants) {
      let self = this;
      self.analysisModel.replaceMatchingVariants(variants, self.variants[app]);
      if (self.$refs.reportRef) {
        self.$refs.reportRef.refreshReport();
      }
      return self.analysisModel.promiseUpdateVariants(app, self.analysis.id, variants);
    },


    promiseDeleteVariants: function(app, variants) {
      let self = this;
      self.analysis.datetime_last_modified = self.getCurrentDateTime();
      return self.analysisModel.promiseDeleteVariants(app, self.analysis.id, variants);
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

    promiseUpdateCache: function(app, cacheItems) {
      let self = this;
      return self.analysisModel.promiseUpdateCache(app, self.analysis.id, cacheItems);
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
