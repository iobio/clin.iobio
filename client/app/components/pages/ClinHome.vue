/*
 * Home.vue
 *
 */
<style lang="sass"  >

@import ../../../assets/sass/variables

$light-grey-background: #eaeaea
$horizontal-dashboard-height: 140px

.application--wrap
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

    .progress-circular
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




</style>



<template>
<div>
  <navigation v-if="!showSplash && isAuthenticated  && workflow && analysis"
   :caseSummary="caseSummary"
   :analysis="analysis">
  </navigation>

  <workflow v-if="!showSplash && isAuthenticated && workflow && analysis"
   :caseSummary="caseSummary"
   :analysis="analysis"
   :workflow="workflow"
   @on-step-changed="onStepChanged"
   @on-task-changed="onTaskChanged">
  </workflow>

  <div id="clin-container" style="display:flex" :class="{authenticated: isAuthenticated}">

    <div id="splash-screen" v-if="showSplash">
      <v-card style="text-align:center;margin-top:100px;width:400px;height:75px">
        <v-progress-circular id="overall-progress"  :size="22"  :width="4" color="teal accent-4"
          :indeterminate="true">
        </v-progress-circular>
        <h3 style="display:inline-block;margin-left: 10px" >Initializing clin.iobio</h3>
      </v-card>
    </div>
    <login
      v-if="!showSplash && !hubSession && !isAuthenticated"
      :userSession="userSession"
      @authenticated="onAuthenticated">
    </login>

    <login-mosaic
      v-if="!showSplash && hubSession && !isAuthenticated"
      :userSession="userSession"
      @authenticated-mosaic="onAuthenticatedMosaic">
    </login-mosaic>






    <div style="width:100%;height:100%;padding: 0px"
    :class="{'app-content': true,  'sidebar': isSidebar, 'minimized': isMinimized}"
    v-show="!showSplash && isAuthenticated " >
      <v-card  class="clin-card"
        v-if="analysis && workflow"
        v-show="analysis && workflow && showFindings"
      >
        <findings
        ref="findingsRef"
        v-if="analysis && workflow"
        v-show="analysis && workflow && showFindings"
        :workflow="workflow"
        :analysis="analysis"
        :caseSummary="caseSummary"
        :modelInfos="modelInfos"
        :pedigree="hubSession ? hubSession.pedigreeSamples : null"
        :sampleId="paramSampleId"
        :phenotypes="analysis.phenotypes"
        :genes="analysis.genes"
        :variants="variants"
        :variantsByInterpretation="variantsByInterpretation"
        :filters="analysis.filters">
        </findings>
      </v-card>


      <div id="gene-panel-iframe"
        v-show="!isAuthenticated || (currentStep == 2  && !showFindings)">
        <iframe
        :src="apps.genepanel.url + '&iobio_source=' + iobioSource"
        style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="gene-iframe" v-show="!isAuthenticated || ((currentStep == 3 || currentStep == 4) && !showFindings)">
        <iframe
        :src="apps.gene.url"
        style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>




    </div>


  </div>
</div>
</template>


<script>

import Navigation from  '../pages/Navigation.vue'
import Workflow from  '../pages/Workflow.vue'
import Findings from  '../viz/Findings.vue'
import Login from  '../partials/Login.vue'
import LoginMosaic from  '../partials/LoginMosaic.vue'
import PreferencesMenu from  '../partials/PreferencesMenu.vue'
import AppIcon from  '../partials/AppIcon.vue'

import AnalysisModel from  '../../models/AnalysisModel.js'
import UserSession  from  '../../models/UserSession.js'
import HubSession  from  '../../models/HubSession.js'


export default {
  name: 'home',
  components: {
    Navigation,
    Workflow,
    Login,
    LoginMosaic,
    Findings,
    PreferencesMenu,
    AppIcon
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
      showSplash: true,

      theme:    self.paramTheme && self.paramTheme.length > 0 ? self.paramTheme : 'dark',
      isSidebar: false,
      isMinimized: false,

      persistCache: false,

      isAuthenticated: false,
      userSession:  null,
      hubSession: null,
      modelInfos: null,


      variantsByInterpretation: [
       { key: 'sig',         display: 'Significant Variants',  abbrev: 'Significant', organizedVariants: []},
       { key: 'unknown-sig', display: 'Variants of Unknown Significance', abbrev: 'Unknown Sig', organizedVariants: []}
      ],

      showFindings: true,

      iobioSource: self.paramIobioSource ? self.paramIobioSource : 'mosaic.chpc.utah.edu',

      appUrls: {
        'localhost': {
            'gene':      'http://localhost:4026/?launchedFromClin=true',
            'genefull':  'http://localhost:4026/?launchedFromClin=true',
            'genepanel': 'http://localhost:4024/?launchedFromClin=true',
            //'bam':       'http://localhost:4027'
        },
        'tony.iobio.io': {
            'gene':      'http://tony.iobio.io:4026/?launchedFromClin=true',
            'genefull':  'http://tony.iobio.io:4026/?launchedFromClin=true',
            'genepanel': 'http://tony.iobio.io:4024/?launchedFromClin=true',
            //'bam':       'http://tony.iobio.io:4027'
        },
        'dev': {
            'gene':      'https://stage.gene.iobio.io/?launchedFromClin=true',
            'genefull':  'https://stage.gene.iobio.io/?launchedFromClin=true',
            'genepanel': 'https://dev.panel.iobio.io/?launchedFromClin=true',
            //'bam':       'https://newbam.iobio.io'
        },
      },

      apps: {
        //'bam':       {url: null, isLoaded: false, step: 0, iframeSelector: '#bam-iframe iframe'},
        'genepanel': {url: null, isLoaded: false, step: 2, iframeSelector: '#gene-panel-iframe iframe'},
        'gene':      {url: null, isLoaded: false, step: 3, iframeSelector: '#gene-iframe iframe'},
        'genefull':  {url: null, isLoaded: true, step:  4, iframeSelector: '#gene-iframe iframe'}
      },

      currentStep: -1,

      analysisModel: null,

      idWorkflow: "2",
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
    phenotypeList: function() {
      let self = this;
      let phenotypeList = [];

      if (self.analysis.phenotypes) {
        self.analysis.phenotypes.forEach(function(phenotypeArray) {
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
    },

    variants: function() {
      this.organizeVariantsByInterpretation();
    }
  },

  methods: {

    init: function() {
      let self = this;

      window.addEventListener("message", self.receiveAppMessage, false);
      var appTarget = null;
      if (window.document.URL.indexOf("localhost") > 0) {
        appTarget = "localhost";
      } if (window.document.URL.indexOf("tony.iobio.io") > 0) {
        appTarget = "tony.iobio.io";
      } else {
        appTarget = "dev";
      }
      //self.apps.bam.url       = self.appUrls[appTarget].bam;
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
            self.caseSummary.description = project.description && project.description.length > 0 ? project.description : "A summary of the trio goes here....";


            self.promiseInitUserSession();

          })
        })
      } else {
        self.promiseInitUserSession();
      }









    },

    promiseInitUserSession: function() {
      let self = this;

      return new Promise(function(resolve, reject) {
        self.userSession = new UserSession();

        if (self.userSession.canAuthenticatePrevSession() && localStorage.getItem('hub-iobio-tkn') && localStorage.getItem('hub-iobio-tkn').length > 0 && self.paramSampleId && self.paramSource) {
          self.userSession.authenticatePrevSession(function(success, userName) {
            if (success) {
              self.onAuthenticatedMosaic(userName, false, function() {
                resolve();
              });
            } else {
              self.showSplash = false;
              self.userSession.clearPrevSession();
              alert("Unable to authenticate user from previous session.")
              reject();
            }

          })
        } else {
          self.showSplash = false;
          resolve();
        }

      })

    },

    onStepChanged: function(stepNumber) {
      this.currentStep = stepNumber
    },

    onTaskChanged: function() {
      let self = this;
      // We have moved to a new step.  Save the workflow step.
      if (self.analysis && self.analysis.id) {
        self.promiseUpdateWorkflow();
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
      this.organizeVariantsByInterpretation();
      this.showFindings = true;
    },

    onAuthenticated: function(researcher, project, clearSavedData) {
      let self = this;
      self.isAuthenticated = true;
      self.showSpash = false;
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

                }
              }

            })

          }


        })
      })

    },

    onAuthenticatedMosaic: function(researcher, clearSavedData, callback) {
      let self = this;
      self.isAuthenticated = true;
      self.analysisModel = new AnalysisModel(self.userSession);
      self.clearSavedAnalysis = clearSavedData;

      self.promiseGetWorkflow(self.idWorkflow)
      .then(function() {

        self.showSplash = false;

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
          return self.promiseGetVariantData()

        })
        .then(function() {


          // Send message to set the data in the iobio apps
          for (var appName in self.apps) {
            let app = self.apps[appName];
            if (!app.isLoaded) {
              console.log("****** clin.iobio set-data for " + appName + " *********")
              self.setData(appName, 500);
            } else {
              console.log("****** BYPASSING clin.iobio set-data for " + appName + ", already loaded *********")

            }
          }

          if (callback) {
            callback();
          }



        })
        .catch(function(error) {
          console.log("Error occurred in onAuthenticatedMosaic: " + error);
          if (callback) {
            callback();
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
              'gtrFullList':          self.analysis.gtrFullList,
              'phenolyzerFullList':   self.analysis.phenolyzerFullList,
              'persistCache':         self.persistCache,
              'variants':             self.variants,
              'variantData':          self.variantData,
              'cache':                self.analysisCache ? self.analysisCache : null
          };
          if (self.paramGeneBatchSize && (appName == 'gene' || appName == 'genefull')) {
            msgObject.batchSize = +self.paramGeneBatchSize;
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


      if (messageObject.type == 'confirm-set-data') {
        console.log("****** confirming set data " + messageObject.app + " *******");
        self.apps[messageObject.app].isLoaded = true;
      } else if (messageObject.type == "apply-genes" && messageObject.sender == 'genepanel.iobio.io') {
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
                self.analysis.gtrFullList = [];
                self.analysis.phenolyzerFullList = [];
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
              self.analysis.gtrFullList = [];
              self.analysis.phenolyzerFullList = [];

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
      self.analysis.genesReport        = messageObject.genesReport;
      self.analysis.genesGtr           = messageObject.genesGtr;
      self.analysis.genesPhenolyzer    = messageObject.genesPhenolyzer;
      self.analysis.genesManual        = messageObject.genesManual;
      self.analysis.gtrFullList        = messageObject.gtrFullList;
      self.analysis.phenolyzerFullList = messageObject.phenolyzerFullList;
      self.analysis.genes              = messageObject.genes;
      self.analysis.phenotypes         = messageObject.searchTerms;


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
      self.organizeVariantsByInterpretation();
      return self.analysisModel.promiseUpdateVariants(self.analysis.id, variants, variantsToRemove);
    },

    promiseUpdateVariants: function(variants) {
      let self = this;
      self.analysisModel.replaceMatchingVariants(variants, self.variants);
      self.organizeVariantsByInterpretation();
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
    },

    organizeVariantsByInterpretation: function() {
      let self = this;

      self.variantsByInterpretation.forEach(function(interpretation) {
        interpretation.organizedVariants = self.organizeVariantsByFilter(interpretation.key);
        interpretation.variantCount      = self.getVariantCount(interpretation.organizedVariants);
        interpretation.genes             = self.getUniqueGenes(interpretation.organizedVariants);
      })
    },
    organizeVariantsByFilter: function(interpretation) {
      let self = this;
      let filterList = [];

      for (var filterName in self.analysis.filters) {
        let filterObject = self.analysis.filters[filterName];
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


      this.variants.forEach(function(variant) {
        if (variant.interpretation == interpretation) {
          theVariants.push(variant);
          variant.candidateGene = true;
        }
      })

      if (theVariants.length > 0) {
        let theGenes   = [];
        theVariants.forEach(function(variant) {
          if ((userFlagged && variant.isUserFlagged) ||
            (filterName && variant.filtersPassed && variant.filtersPassed.indexOf(filterName) >= 0)) {

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
    }

  }
}
</script>
