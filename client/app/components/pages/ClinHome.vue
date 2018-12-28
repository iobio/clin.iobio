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


  #findings-button
    padding: 4px;
    max-height: 30px;
    margin-left: 10px
    margin-top: 0px
    margin-bottom: 10px

    &.is-active
      background-color:  $app-color

      .btn__content
        color: white

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

    #findings-button
      margin-top: 10px

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

    #findings-button
      background-color: white
      color:  $dark-nav-background-color

      &.is-active
        background-color:  $dark-app-color

        .btn__content
          color: white

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
      v-if="!hubSession && !isAuthenticated"
      :userSession="userSession"
      @authenticated="onAuthenticated">
    </login>

    <login-mosaic
      v-if="hubSession && !isAuthenticated"
      :userSession="userSession"
      @authenticated-mosaic="onAuthenticatedMosaic">
    </login-mosaic>


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
            <v-btn id="findings-button" :class="{'is-active': showFindings}" @click="clickFindings">Findings</v-btn>

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
                    ></v-checkbox>
                    <v-switch small class="task-switch"
                      v-if="false && task.complete"
                      v-model="task.pass"
                      hide-details
                    ></v-switch>
                    <span class="task-name">
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
        v-show="showFindings"
      >
        <findings
        ref="findingsRef"
        :workflow="workflow"
        :analysis="analysis"
        :caseSummary="caseSummary"
        :modelInfos="modelInfos"
        :pedigree="hubSession ? hubSession.pedigreeSamples : null"
        :sampleId="paramSampleId"
        :phenotypes="analysis.phenotypes"
        :genes="analysis.genes"
        :variants="variants"
        :filters="analysis.filters">
        </findings>
      </v-card>


      <div id="gene-panel-iframe"
        v-show="!isAuthenticated || (currentStep == 1  && !showFindings)">
        <iframe
        :src="apps.genepanel.url + '&iobio_source=' + iobioSource"
        style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="gene-iframe" v-show="!isAuthenticated || ((currentStep == 2 || currentStep == 3) && !showFindings)">
        <iframe
        :src="apps.gene.url"
        style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>




    </div>


  </div>

</template>


<script>

import Findings from  '../viz/Findings.vue'
import Login from  '../partials/Login.vue'
import LoginMosaic from  '../partials/LoginMosaic.vue'
import PreferencesMenu from  '../partials/PreferencesMenu.vue'

import AnalysisModel from  '../../models/AnalysisModel.js'
import UserSession  from  '../../models/UserSession.js'
import HubSession  from  '../../models/HubSession.js'


export default {
  name: 'home',
  components: {
    Login,
    LoginMosaic,
    Findings,
    PreferencesMenu
  },
  props: {
    paramDebug:  null,

    paramProjectId:      null,
    paramSampleId:       null,
    paramAnalysisId:     null,
    paramTokenType:      null,
    paramToken:          null,
    paramSource:         null,
    paramIobioSource:    null,
    paramGeneBatchSize:  null,
    paramTheme: null
  },
  data() {
    let self = this;
    return {

      theme:    self.paramTheme && self.paramTheme.length > 0 ? self.paramTheme : 'dark',
      isSidebar: false,
      isMinimized: false,

      persistCache: false,

      isAuthenticated: false,
      userSession:  null,
      hubSession: null,
      modelInfos: null,

      showFindings: true,

//      iobioSource: self.paramIobioSource ? self.paramIobioSource : 'mosaic.chpc.utah.edu',
      iobioSource: self.paramIobioSource ? self.paramIobioSource : 'hub-chpc.iobio.io',

      appUrls: {
        'localhost': {
            'gene':      'http://localhost:4026/?launchedFromClin=true',
            'genefull':  'http://localhost:4026/?launchedFromClin=true',
            'genepanel': 'http://localhost:4024/?launchedFromClin=true',
            'bam':       'http://localhost:4027'
        },
        'dev': {
            'gene':      'https://dev.gene.iobio.io/?launchedFromClin=true',
            'genefull':  'https://dev.gene.iobio.io/?launchedFromClin=true',
            'genepanel': 'https://dev.panel.iobio.io/?launchedFromClin=true',
            'bam':       'https://newbam.iobio.io'
        },
      },

      apps: {
        'bam':       {url: null, isLoaded: false, step: 0, iframeSelector: '#bam-iframe iframe'},
        'genepanel': {url: null, isLoaded: false, step: 1, iframeSelector: '#gene-panel-iframe iframe'},
        'gene':      {url: null, isLoaded: false, step: 2, iframeSelector: '#gene-iframe iframe'},
        'genefull':  {url: null, isLoaded: true, step: 3, iframeSelector: '#gene-iframe iframe'}
      },

      currentStep: -1,

      analysisModel: null,

      idWorkflow: "1",
      workflow: null,
      analysis: null,
      caseSummary: null,
      analysisCache:     null,
      analysisCacheKeys: null,

      variants:          [],
      variantData:       null,


      clearSavedAnalysis: false

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
        self.showFindings = false;




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
        self.hubSession.promiseInit(self.paramSampleId, self.paramSource, true, self.paramProjectId)
        .then(modelInfos => {
          self.modelInfos = modelInfos;

          self.hubSession.promiseGetProject(self.paramProjectId)
          .then(function(project) {
            self.caseSummary = {};
            self.caseSummary.name = project.name;
            self.caseSummary.phenotypes = project.description;
          })
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

    clickFindings: function() {
      this.currentStep = 0;
      if (this.$refs.findingsRef) {
        this.$refs.findingsRef.refreshReport();
      }
      this.showFindings = true;
    },

    onAuthenticated: function(researcher, project, clearSavedData) {
      let self = this;
      self.isAuthenticated = true;
      self.analysisModel = new AnalysisModel(self.userSession);
      self.clearSavedAnalysis = clearSavedData;

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
              'tbi':     modelInfo.tbi,
              'bam':     modelInfo.bam ? modelInfo.bam.proband : null,
              'bai':     modelInfo.bai ? modelInfo.bai.proband : null, },
             {'relationship': 'mother',
              'affectedStatus': 'unaffected',
              'name':    modelInfo.sampleId.mother,
              'sample':  modelInfo.sampleId.mother,
              'vcf':     modelInfo.vcf,
              'tbi':     modelInfo.tbi,
              'bam':     modelInfo.bam ? modelInfo.bam.mother : null,
              'bai':     modelInfo.bai ? modelInfo.bai.mother : null},
             {'relationship': 'father',
              'affectedStatus': 'unaffected',
              'name':    modelInfo.sampleId.father,
              'sample':  modelInfo.sampleId.father,
              'vcf':     modelInfo.vcf,
              'tbi':     modelInfo.tbi,
              'bam':     modelInfo.bam ? modelInfo.bam.father : null,
              'bai':     modelInfo.bai ? modelInfo.bai.father : null },
            ];

          }

        })

      } else {
        promiseModelInfo = Promise.resolve();
      }

      promiseModelInfo.then(function() {
        self.promiseGetWorkflow(self.idWorkflow)
        .then(function() {

          if (self.clearSavedAnalysis) {
            self.promiseClearAnalysis(projectId, sampleId, self.workflow)
          } else {
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

          }


        })
      })

    },

    onAuthenticatedMosaic: function(researcher, clearSavedData) {
      let self = this;
      self.isAuthenticated = true;
      self.analysisModel = new AnalysisModel(self.userSession);
      self.clearSavedAnalysis = clearSavedData;

      self.promiseGetWorkflow(self.idWorkflow)
      .then(function() {


        self.promiseGetAnalysis(
          self.paramProjectId,
          self.paramSampleId,
          self.paramAnalysisId,
          self.workflow,
          {'createIfEmpty': true, 'getCache': true} )
        .then(function() {

          return self.promiseGetVariants()
        })
        .then(function() {

          self.promiseGetVariantData()

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

    isS3() {
      let self = this;
      let S3_URL = "https://s3.amazonaws.com";
      return self.modelInfos.filter(function(modelInfo) {

        let vcfS3 = false;
        let bamS3 = false;
        if (modelInfo.vcf) {
          if (modelInfo.vcf.indexOf(S3_URL) == 0) {
            vcfS3 = true;
          }
        } else {
          vcfS3 = true;
        }

        if (modelInfo.bam) {
          if (modelInfo.vcf.indexOf(S3_URL) == 0) {
           bamS3 = true;
          }
        } else {
           bamS3 = true;
        }

        return vcfS3 && bamS3;
      }).length > 0;
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


        let promise = null;
        if (self.persistCache && (appName == 'gene' || appName == 'genefull')) {
          promise = self.promiseGetCache()
        } else {
          promise = Promise.resolve();
        }

        promise
        .then(function() {
          let app = self.apps[appName];


          var msgObject = {
              type:                  'set-data',
              sender:                'clin.iobio',
              receiver:               appName,
              'iobioSource':          self.isS3() ? 'nv-prod.iobio.io' : self.iobioSource,
              'isFrameVisible':       app.step == self.currentStep,
              'modelInfo':            probandModelInfo[0],
              'modelInfos':           self.modelInfos,
              'phenotypes':           self.analysis.phenotypes,
              'genes':                self.analysis.genes,
              'genesReport':          self.analysis.genesReport,
              'genesGtr':             self.analysis.genesGtr,
              'genesPhenolyzer':      self.analysis.genesPhenolyzer,
              'genesManual':          self.analysis.genesManual,
              'persistCache':         self.persistCache,
              'variants':             self.variants,
              'variantData':          self.variantData,
              'cache':                self.analysisCache ? self.analysisCache : null
          };
          if (self.paramGeneBatchSize && (appName == 'gene' || appName == 'genefull')) {
            msgObject.batchSize = +self.paramGeneBatchSize;
          } else if ((appName == 'gene' || appName == 'genefull') && msgObject.iobioSource != 'nv-prod.iobio.io') {
            msgObject.batchSize = 3;
          }



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
      } else if (messageObject.type == "save-variants") {
        if (messageObject.action == "update") {
          this.promiseUpdateVariants(messageObject.variants)
        } if (messageObject.action == "replace") {
          this.promiseReplaceVariants(messageObject.variants)
        } else if (messageObject.action == "delete") {
          this.promiseDeleteVariants(messageObject.variants)
        }
      } else if (messageObject.type == "save-cache") {
        if (this.persistCache) {
          this.promiseUpdateCache(messageObject.cache);
        }
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

              if (self.clearSavedAnalysis) {
                self.analysis.genes = [];
                self.analysis.genesGtr = [];
                self.analysis.genesPhenolyzer = [];
                self.analysis.genesManual = [];
                self.analysis.genesReport = [];
                self.analysis.phenotypes = [];
                self.genes = [];
              }


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



    promiseClearAnalysis: function(idProject, idSample, workflow) {
      let self = this;
      return new Promise(function(resolve, reject) {


        if (idProject && idProject.length > 0 && idSample && idSample.length > 0) {

          self.analysisModel.promiseGetAnalysesForSample(workflow.id, idProject, idSample)
          .then(function(analyses) {
            if (analyses && analyses.length > 0) {


              self.analysis = analyses[0];
              self.idAnalysis = self.analysis.id;

              if (self.clearSavedAnalysis) {
                self.analysis.genes = [];
                self.analysis.genesGtr = [];
                self.analysis.genesPhenolyzer = [];
                self.analysis.genesManual = [];
                self.analysis.genesReport = [];
                self.analysis.phenotypes = [];
              }

              self.analysisModel.promiseGetVariants(self.analysis.id)
              .then(function(data) {
                return self.promiseDeleteVariants(data);
              })
              .then(function(data) {
                return self.analysisModel.promiseGetCache(self.analysis.id);
              })
              .then(function(data) {
                let cache_keys = data.map(function(cacheItem) {
                  return cacheItem.cache_key;
                })
                return self.analysisModel.promiseDeleteCache(self.analysis.id, cache_keys)
              })
              .then(function(data) {
                return self.analysisModel.promiseGetCache(self.analysis.id);
              })
              .then(function(data) {
                let cache_keys = data.map(function(cacheItem) {
                  return cacheItem.cache_key;
                })
                return self.analysisModel.promiseDeleteCache(self.analysis.id, cache_keys)
              })
              .then(function() {
                resolve();
              })
              .catch(function(error) {
                console.log("Unable to clear analysis " + error);
                reject(error);
              })
            } else {
              resolve();
            }
          })
          .catch(function(err) {
            console.log("Unable to get analysis " + err);
            reject(err);
          })

        }

      });
    },

    promiseGetVariantData: function() {
      let self = this;
      return new Promise(function(resolve, reject) {
        self.analysisModel.promiseGetVariantData(self.analysis.project_id)
        .then(function(variantData) {
          if (variantData && variantData.data) {
            self.variantData = self.analysisModel.parseVariantData(variantData.data, self.analysis);
          } else {
            self.variantData = null;
          }
          resolve();
        })
      })
    },

    promiseGetVariants: function() {
      let self = this;

      return new Promise(function(resolve, reject) {


        self.analysisModel.promiseGetVariants(self.analysis.id)
        .then(function(data) {

          if (self.clearSavedAnalysis) {
            self.promiseDeleteVariants(data)
            .then(function() {
              self.variants = [];
              resolve();
            })
          } else {
            self.variants = data;
            resolve();
          }
        })
        .catch(function(error) {
          let msg = "Problem in ClinHome.promiseGetVariants() : " + error;
          console.log(msg);
          reject(msg);
        })



      })
    },


    promiseGetCache: function() {
      let self = this;

      return new Promise(function(resolve, reject) {


        let cacheItems = [];
        let cacheKeysToDelete = [];

        self.analysisModel.promiseGetCache(self.analysis.id)
        .then(function(data) {
          if (self.clearSavedAnalysis) {
            let cache_keys = data.map(function(cacheItem) {
              return cacheItem.cache_key;
            })
            return self.analysisModel.promiseDeleteCache(self.analysis.id, cache_keys);
          } else {
            return Promise.resolve(data);
          }

        })
        .then(function(data) {
          if (self.clearSavedAnalysis) {
            self.analysisCache = null;
            self.analysisCacheKeys = null;
            resolve();
          } else {
            // For candidate gene variant analysis, we only want to keep cache items
            // for relevant genes
            let applicableGenes = self.analysis.genes.slice();
            self.variants.forEach(function(v) {
              if (applicableGenes.indexOf(v.gene) == -1) {
                applicableGenes.push(v.gene);
              }
            })

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
            self.analysisCache = cacheItems;



            self.analysisCacheKeys = data.map(function(cacheItem) {
              return cacheItem.cache_key;
            });


            self.analysisModel.promiseDeleteCache(self.analysis.id, cacheKeysToDelete)
            .then(function() {
              resolve();
            })
          }

        })
        .catch(function(error) {
          let msg = "Problem in ClinHome.promiseGetCache(): " + error;
          console.log(msg);
          reject(msg);
        })


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


    promiseUpdatePhenotypes: function(phenotypes) {
      let self = this;
      self.analysis.phenotypes = phenotypes;
      self.analysis.datetime_last_modified = self.getCurrentDateTime();
      return self.analysisModel.promiseUpdatePhenotypes(self.analysis);
    },

    promiseReplaceVariants: function(variants) {
      let self = this;
      self.analysisModel.replaceMatchingVariants(variants, self.variants);
      let variantsToRemove = self.analysisModel.getObsoleteVariants(variants, self.variants);

      self.variants = variants;
      if (self.$refs.findingsRef) {
        self.$refs.findingsRef.refreshReport();
      }
      return self.analysisModel.promiseUpdateVariants(self.analysis.id, variants, variantsToRemove);
    },

    promiseUpdateVariants: function(variants) {
      let self = this;
      self.analysisModel.replaceMatchingVariants(variants, self.variants);
      if (self.$refs.findingsRef) {
        self.$refs.findingsRef.refreshReport();
      }
      return self.analysisModel.promiseUpdateVariants(self.analysis.id, variants);
    },


    promiseDeleteVariants: function(variants) {
      let self = this;
      self.analysis.datetime_last_modified = self.getCurrentDateTime();
      return self.analysisModel.promiseDeleteVariants(self.analysis.id, variants);
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

    promiseUpdateCache: function(cacheItems) {
      let self = this;
      return self.analysisModel.promiseUpdateCache(self.analysis.id, cacheItems);
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
