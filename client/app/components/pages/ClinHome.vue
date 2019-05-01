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
   :analysisSteps="analysis.payload.steps"
   :workflow="workflow"
   @on-step-changed="onStepChanged"
   @on-task-changed="onTaskChanged"
   @on-task-completed="onTaskCompleted">
  </workflow>

  <div id="clin-container" style="display:flex" :class="{authenticated: isAuthenticated}">

    <div id="splash-screen" v-if="showSplash">
      <v-card :style="showSplashProgress ? 'text-align:center;margin-top:100px;width:400px;height:75px' : 'text-align:left;margin-top:100px;width:400px;height:125px'">
        <v-progress-circular id="overall-progress"  v-if="showSplashProgress" :size="22"  :width="4" color="teal accent-4"
          :indeterminate="true">
        </v-progress-circular>
        <h3  style="display:inline-block;margin-left: 10px" > {{ splashMessage }} </h3>
      </v-card>
    </div>


    <login-mosaic
      v-if="!showSplash && mosaicSession && !isAuthenticated"
      :awsSession="awsSession"
      @authenticated-mosaic="onAuthenticatedMosaic">
    </login-mosaic>






    <div style="width:100%;height:100%;padding: 0px"
    :class="{'app-content': true}"
    v-show="!showSplash && isAuthenticated " >
      <v-card  class="clin-card"
        v-if="analysis && workflow"
        v-show="analysis && workflow && currentStep == 1 && !showFindings"
      >
        <review-case
        ref="reviewCaseRef"
        v-if="analysis && workflow"
        v-show="analysis && workflow"
        :workflow="workflow"
        :analysis="analysis.payload"
        :caseSummary="caseSummary"
        :modelInfos="modelInfos"
        :pedigree="mosaicSession ? mosaicSession.pedigreeSamples : null"
        :sampleId="paramSampleId">
        </review-case>
      </v-card>


      <v-card  class="clin-card"
        v-if="analysis && workflow"
        v-show="analysis && workflow && currentStep == 5 && !showFindings "
      >
        <findings
        ref="findingsRef"
        v-if="analysis && workflow"
        v-show="analysis && workflow"
        :workflow="workflow"
        :analysis="analysis.payload"
        :caseSummary="caseSummary"
        :modelInfos="modelInfos"
        :pedigree="mosaicSession ? mosaicSession.pedigreeSamples : null"
        :sampleId="paramSampleId"
        :phenotypes="analysis.payload.phenotypes"
        :genes="analysis.payload.genes"
        :variants="analysis.payload.variants"
        :variantsByInterpretation="variantsByInterpretation"
        :filters="analysis.payload.filters">
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

import Navigation    from  '../pages/Navigation.vue'
import Workflow      from  '../pages/Workflow.vue'
import ReviewCase    from  '../viz/ReviewCase.vue'
import Findings      from  '../viz/Findings.vue'
import LoginMosaic   from  '../partials/LoginMosaic.vue'
import AppIcon       from  '../partials/AppIcon.vue'

import AWSSession    from  '../../models/AWSSession.js'
import MosaicSession from  '../../models/MosaicSession.js'

import workflowData  from '../../../data/workflows.json'
import variantData   from '../../../data/variants_mosaic_platinum.json'

export default {
  name: 'home',
  components: {
    Navigation,
    Workflow,
    LoginMosaic,
    ReviewCase,
    Findings,
    AppIcon
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
    paramGeneBatchSize:  null
  },
  data() {
    let self = this;
    return {
      showSplash: true,
      splashMessage: "Initializing clin.iobio",
      showSplashProgress: true,

      isAuthenticated: false,
      awsSession:  null,
      mosaicSession: null,
      modelInfos: null,

      workflows:        workflowData,
      importedVariants: variantData,


      variantsByInterpretation: [
       { key: 'sig',         display: 'Significant Variants',  abbrev: 'Significant', organizedVariants: []},
       { key: 'unknown-sig', display: 'Variants of Unknown Significance', abbrev: 'Unknown Sig', organizedVariants: []}
      ],

      showFindings: false,

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

      currentStep: 1,

      idWorkflow: "workflow.clin.1.0",
      workflow: null,
      analysis: null,
      caseSummary: null

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

        self.mosaicSession = new MosaicSession();
        // For now, just hardcode is_pedgree = true
        self.mosaicSession.promiseInit(self.paramSampleId, self.paramSource, true, self.paramProjectId)
        .then(modelInfos => {
          self.modelInfos = modelInfos;

          self.mosaicSession.promiseGetProject(self.paramProjectId)
          .then(function(project) {
            self.caseSummary = {};
            self.caseSummary.name = project.name;
            self.caseSummary.description = project.description && project.description.length > 0 ? project.description : "A summary of the trio goes here....";


            self.promiseInitAWSSession();

          })
        })
        .catch(function(error) {
          self.showSplashProgress = false;
          self.splashMessage = error;
        })
      } else {
        self.promiseInitAWSSession();
      }









    },

    promiseInitAWSSession: function() {
      let self = this;

      return new Promise(function(resolve, reject) {
        self.awsSession = new AWSSession();

        if (self.awsSession.canAuthenticatePrevSession() && localStorage.getItem('hub-iobio-tkn') && localStorage.getItem('hub-iobio-tkn').length > 0 && self.paramSampleId && self.paramSource) {
          self.awsSession.authenticatePrevSession(function(success, userName) {
            if (success) {
              self.onAuthenticatedMosaic(userName, function() {
                resolve();
              });
            } else {
              self.showSplash = false;
              self.awsSession.clearPrevSession();
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

    onTaskChanged: function(stepNumber, task) {
      let self = this;
      for (var appName in self.apps) {
        let app = self.apps[appName];
        if (app.step == stepNumber) {
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
      if (self.analysis && self.analysis.id) {
        self.promiseUpdateWorkflow();
      }
    },


    clickFindings: function() {
      this.currentStep = 0;
      this.organizeVariantsByInterpretation();
      this.showFindings = true;
    },



    onAuthenticatedMosaic: function(researcher, callback) {
      let self = this;
      self.isAuthenticated = true;

      self.workflow = self.workflows[self.idWorkflow];

      if (self.workflow == null) {
        alert("Unable to find workflow " + self.idWorkflow);
        return;
      }

      self.showSplash = false;

      self.mosaicSession.getApplications();

      self.promiseGetAnalysis(
        self.paramProjectId,
        self.paramAnalysisId,
        self.workflow)
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
        console.log("Error occurred in onAuthenticatedMosaic: " + error);
        if (callback) {
          callback();
        }
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
              'iobioSource':          self.iobioSource,
              'isFrameVisible':       app.step == self.currentStep,
              'modelInfo':            probandModelInfo[0],
              'modelInfos':           self.modelInfos,
              'phenotypes':           self.analysis.payload.phenotypes,
              'genes':                self.analysis.payload.genes,
              'genesReport':          self.analysis.payload.genesReport,
              'genesGtr':             self.analysis.payload.genesGtr,
              'genesPhenolyzer':      self.analysis.payload.genesPhenolyzer,
              'genesManual':          self.analysis.payload.genesManual,
              'gtrFullList':          self.analysis.payload.gtrFullList,
              'phenolyzerFullList':   self.analysis.payload.phenolyzerFullList,
              'persistCache':         self.persistCache,
              'variants':             self.analysis.payload.variants
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
        self.apps[messageObject.app].isLoaded = true;
      } else if (messageObject.type == "apply-genes" && messageObject.sender == 'genepanel.iobio.io') {
        var taskMap = {
          'gtr':              'gtr-genes',
          'phenotype-driven': 'phenotype-genes',
          'all':              'export-genes'
        }
        this.promiseUpdateGenesData(messageObject);
        this.setGeneTaskBadges();
        if (this.analysis.payload.genes.length == 0) {
          this.clearVariantTaskBadges();
        }
        this.promiseCompleteStepTask('genes', taskMap[messageObject.source]);
        this.sendAppMessage('gene', messageObject);
      } else if (messageObject.type == "save-variants") {
        if (messageObject.action == "replace" || messageObject.action == "update") {
          this.promiseUpdateVariants(messageObject.variants)
        } else if (messageObject.action == "delete") {
          this.promiseDeleteVariants(messageObject.variants)
        }
      } else if (messageObject.type == "save-filters") {
        this.promiseUpdateFilters(messageObject.filters);
      } else if (messageObject.type == "insufficient-coverage") {
        this.setCoverageTaskBadge(messageObject.geneCount);
      }


    },

    findMatchingVariantIndex(variant) {
      let matchingIdx = -1;
      let idx = 0;
      let self = this;
      if (self.analysis && self.analysis.payload.variants) {
        self.analysis.payload.variants.forEach(function(v) {
          if (matchingIdx == -1
              && v.gene == variant.gene
              && v.start == variant.start
              && v.ref == variant.ref
              && v.alt == variant.alt ) {
            matchingIdx = idx;
          }
          idx++;
        })
      }
      return matchingIdx;
    },

    isValidAppOrigin: function(event) {
      return (this.apps.gene.url.indexOf(event.origin) >= 0 || this.apps.genepanel.url.indexOf(event.origin) >= 0);
    },

    setGeneTaskBadges: function() {
      let self = this;
      self.analysis.payload.steps.forEach(function(step) {
        step.tasks.forEach(function(task) {
          if (task.key == 'gtr-genes' && self.analysis.payload.genesGtr) {
            if  (self.analysis.payload.genesGtr.length > 0) {
              task.badge = self.analysis.payload.genesGtr.length;
            } else {
              delete task.badge;
            }
          } else if (task.key == 'phenotype-genes' && self.analysis.payload.genesPhenolyzer) {
            if (self.analysis.payload.genesPhenolyzer.length > 0) {
              task.badge = self.analysis.payload.genesPhenolyzer.length;
            } else {
              delete task.badge;
            }
          } else if (task.key == 'summary-genes' && self.analysis.genes ) {
            if (self.analysis.payload.genes.length > 0) {
              task.badge = self.analysis.payload.genes.length;
            } else {
              delete task.badge;
            }
          }
        })
      })
    },

   setVariantTaskBadges: function() {
      let self = this;
      if (self.analysis.payload.variants) {
        let variantsCandidateGenes = self.analysis.payload.variants.filter(function(variant) {
          return self.analysis.payload.genes && self.analysis.payload.genes.length > 0 && self.analysis.payload.genes.indexOf(variant.gene) >= 0;
        })
        self.analysis.payload.steps.forEach(function(step) {
          step.tasks.forEach(function(task) {
            if (task.key == 'review' ) {
              if (variantsCandidateGenes.length > 0) {
                task.badge =  variantsCandidateGenes.length;
              } else {
                delete task.badge;
              }
            } else if (task.key == 'coverage' ) {
              if (variantsCandidateGenes.length == 0) {
                delete task.badge;
              }
            } else if (task.key == 'review-full') {
              let fullAnalysisCount = self.analysis.payload.variants.length - variantsCandidateGenes.length;
              if (fullAnalysisCount > 0) {
                task.badge =  fullAnalysisCount;
              } else {
                delete task.badge;
              }
            }
          })
        })
      }
    },

    clearVariantTaskBadges: function() {
      let self = this;
      self.analysis.payload.steps.forEach(function(step) {
        step.tasks.forEach(function(task) {
          if (task.key == 'review' ) {
              delete task.badge;
          } else if (task.key == 'coverage') {
              delete task.badge;
          }
        })
      })
    },

    setCoverageTaskBadge: function(geneCount) {
      let self = this;
      if (self.analysis.payload.variants && self.analysis.payload.variants.length > 0) {
        self.analysis.payload.steps.forEach(function(step) {
          step.tasks.forEach(function(task) {
            if (task.key == 'coverage') {
              task.badge =  geneCount
            }
          })
        })
      }
    },


    promiseGetAnalysis: function(idProject, idAnalysis, workflow, options={}) {
      let self = this;
      return new Promise(function(resolve, reject) {

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
          newAnalysis.title = "clin.iobio analysis";
          newAnalysis.description = "a description goes here";
          newAnalysis.payload = {};
          newAnalysis.payload.project_id = idProject;
          newAnalysis.payload.sample_id = self.paramSampleId;
          newAnalysis.payload.datetime_created = self.getCurrentDateTime();
          newAnalysis.payload.workflow_id = workflow.id;
          newAnalysis.payload.genes = [];
          newAnalysis.payload.phenotypes = [];
          newAnalysis.payload.gtrFullList = [];
          newAnalysis.payload.phenolyzerFullList = [];
          newAnalysis.payload.variants = self.importedVariants.variants;
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

          self.mosaicSession.promiseAddAnalysis(idProject, newAnalysis)
          .then(function(analysis) {
            console.log("**********  adding mosaic analysis " + analysis.id + " **************")

            self.analysis = analysis;
            self.setGeneTaskBadges();
            resolve();

          })
          .catch(function(err) {
            reject(err);
          })

        }

      });
    },



    promiseUpdateGenesData: function(messageObject) {
      let self = this;
      self.analysis.payload.genesReport        = messageObject.genesReport;
      self.analysis.payload.genesGtr           = messageObject.genesGtr;
      self.analysis.payload.genesPhenolyzer    = messageObject.genesPhenolyzer;
      self.analysis.payload.genesManual        = messageObject.genesManual;
      self.analysis.payload.gtrFullList        = messageObject.gtrFullList;
      self.analysis.payload.phenolyzerFullList = messageObject.phenolyzerFullList;
      self.analysis.payload.genes              = messageObject.genes;
      self.analysis.payload.phenotypes         = messageObject.searchTerms;
      self.setGeneTaskBadges();


      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      self.analysis.title = self.analysis.title + self.getCurrentDateTime();
      return self.mosaicSession.promiseUpdateAnalysis(self.analysis);
    },


    promiseUpdatePhenotypes: function(phenotypes) {
      let self = this;
      self.analysis.payload.phenotypes = phenotypes;
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      return self.mosaicSession.promiseUpdateAnalysis(self.analysis);
    },


    promiseUpdateVariants: function(variantsToReplace) {
      let self = this;
      variantsToReplace.forEach(function(variant) {
        let matchingIdx = self.findMatchingVariantIndex(variant);
        if (matchingIdx != -1) {
          self.analysis.payload.variants[matchingIdx] = variant;
        } else {
          self.analysis.payload.variants.push(variant);
        }
      })
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      self.organizeVariantsByInterpretation();
      self.setVariantTaskBadges();
      return self.mosaicSession.promiseUpdateAnalysis(self.analysis);
    },

    promiseDeleteVariants(variantsToRemove) {
      let self = this;
      let toRemove = [];
      if (variantsToRemove && self.analysis.payload.variants) {
        variantsToRemove.forEach(function(variantToRemove) {
          let matchingIdx = self.findMatchingVariantIndex(variantToRemove);
          if (matchingIdx != -1) {
            toRemove.push($.extend({}, variantToRemove));
          }
        })
      }
      toRemove.forEach(function(v) {
        let idx = self.findMatchingVariantIndex(v, self.analysis.payload.variants);
        self.analysis.payload.variants.remove(idx);
      })
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      self.organizeVariantsByInterpretation();
      self.setVariantTaskBadges();
      return self.mosaicSession.promiseUpdateAnalysis(self.analysis);
    },

    promiseUpdateWorkflow: function() {
      let self = this;
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      return self.mosaicSession.promiseUpdateAnalysis(self.analysis);
    },

    promiseUpdateFilters: function(filters) {
      let self = this;
      self.analysis.payload.filters = filters;
      self.analysis.payload.datetime_last_modified = self.getCurrentDateTime();
      return self.mosaicSession.promiseUpdateAnalysis(self.analysis);
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

      self.variantsByInterpretation.forEach(function(interpretation) {
        interpretation.organizedVariants = self.organizeVariantsByFilter(interpretation.key);
        interpretation.variantCount      = self.getVariantCount(interpretation.organizedVariants);
        interpretation.genes             = self.getUniqueGenes(interpretation.organizedVariants);
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


      this.analysis.payload.variants.forEach(function(variant) {
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
