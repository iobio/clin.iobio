/*
 * Home.vue
 *
 */
<style lang="sass" scoped >

@import ../../../assets/sass/variables

.dashboard-card
  padding: 3px

  h5
    font-weight: bold
    margin-top: 3px

  .vertical-divider
    border-left: 1px solid $divider-color
    height: 125px
    float: left
    margin-top: 5px
    margin-bottom: 5px
    margin-left: 3px
    margin-right: 3px

.workflow-summary-panel
  width: 200px
  float: left
  display: inline-block
  padding: 5px 5px 5px 10px
  overflow-y: scroll
  font-size: 12px

.stepper__content
  padding: 0px 0px 0px 0px

.stepper__header
  -webkit-box-shadow: none
  box-shadow: none
  width: calc(100% - 700px)
  float: left
  height: 135px

.stepper__items
  float: left
  display: inline-block
  margin-left: 5px
  width: 480px

.step-summary-panel
  height: 135px
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

.task-checkbox-header2
  display: inline-block
  float: left


</style>



<template>

  <div>
    <login
      v-show="!isAuthenticated"
      :userSession="userSession"
      @authenticated="onAuthenticated">
    </login>

    <v-card v-show="isAuthenticated" light class="dashboard-card">

          <v-btn v-show="false"flat fab small style="float:right"
           v-if="!showDashboard"
           @click="showDashboard = true">
            <v-icon color="grey darken-1" style="font-size:32px">expand_more</v-icon>
          </v-btn>


      <v-stepper v-model="currentStep" non-linear>
        <div class="workflow-summary-panel">
          <div>
            <h5> {{ project.workflow.title }} </h5>
            <div>
              {{ project.workflow.summary}}
            </div>
          </div>
        </div>

        <div class="vertical-divider"></div>

        <v-stepper-header>
          <template v-for="step in project.workflow.steps">
            <v-stepper-step  :key="step.number" editable :step="step.number" :complete="step.complete">
              {{ step.title }}
            </v-stepper-step>
            <v-divider v-show="step.number != project.workflow.steps.length"></v-divider>
          </template>
        </v-stepper-header>

        <div class="vertical-divider"></div>

        <v-stepper-items v-show="showDashboard">
          <template v-for="step in project.workflow.steps">

            <v-stepper-content :key="step.number" :step="step.number">
              <div class="step-summary-panel">
                <h5>Step {{ step.number }}. {{ step.title }}</h5>
                <div>
                    {{ step.summary }}
                </div>
              </div>

              <div class="tasks-panel" v-if="step.tasks">
                <div>
                  <span class="task-checkbox-header1">Complete</span>
                  <span class="task-checkbox-header2">Passed</span>

                </div>
                <div class="task-entry"
                 v-for="task in step.tasks"
                 :key="task.name"
                 v-tooltip.top="task.name"
                 @mouseover="onMouseOverTask(step, task)"
                 @mouseleave="onMouseLeaveTask(step, task)">
                  <span class="task-name" >{{ task.name }}</span>
                  <v-checkbox class="task-switch"
                    v-model="task.complete"
                  ></v-checkbox>
                  <v-switch small class="task-switch"
                    v-if="task.complete"
                    v-model="task.pass"
                  ></v-switch>
                </div>

              </div>
            </v-stepper-content>
          </template>
        </v-stepper-items>
      </v-stepper>


    </v-card>

    <v-card v-show="isAuthenticated" style="padding: 2px">

      <v-card  light style="min-height:600px"
        v-show="currentStep == 1"
      >
        <intro
        :project="project">
        </intro>
      </v-card>

      <div id="bam-iframe" v-show="currentStep == 2">
        <iframe  :src="apps.bam.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>


      <div id="gene-panel-iframe" v-show="currentStep == 3">
        <iframe  :src="apps.genepanel.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="gene-iframe" v-show="currentStep == 4">
        <iframe  :src="apps.gene.url" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <v-card   style="min-height:600px"
        v-show="currentStep == 5"
      >
        <report
        :phenotypes="project.phenotypes"
        :genes="project.genes"
        :variants="project.variants">
        </report>
      </v-card>

    </v-card>
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

      isAuthenticated: false,
      userSession:  null,

      idProject: null,
      projectModel: null,

      modelInfos: null,

      appUrls: {
        'localhost': {
            'gene':      'http://localhost:4026',
            'genepanel': 'http://localhost:4024',
            'bam':       'http://localhost:4027'
        },
        'dev': {
            'gene':      'http://newgene.iobio.io',
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
      showDashboard: true,


      //hubEnpoint: null,
      hubSession: null,

      project: null,

      projectTemplate: {

        workflow: {
          title: 'De novo variant analysis',
          summary: 'Look for de novo variants in whole exome or genome sequencing research project.  Perform basic quality control.',
          description: 'The de novo report is used to search for de novo variants in a proband, when sequencing data is present for the proband and both parents.  This report is comprised of the following steps:',
          steps: [

            { number: 1,
              title: 'Overview',
              summary: 'Get an overview of the steps for of de novo variant analysis',
              isIntro: true
            },
            { number: 2,
              title: 'Data QC',
              app: 'bam',
              summary: 'Check quality of sequence alignments for the proband.',
              description: 'Check the quality of the underlying sequencing data for the proband. Using the BAM.IOBIO app, areas of missing coverage or unexpected statistics potentially suggesting contamination are investigated.',
              complete: false,
              tasks: [
                { name: 'Genome wide coverage',  key: 'genome_wide_coverage', tooltip: 'Some instruction here about how to determine if coverage across entire genome is okay', complete: false, pass: false },
                { name: 'Median coverage',       key: 'median_coverage',  tooltip: 'Instructions here about median coverage', complete: false, pass: false },
                { name: 'Mapped reads',          key: 'mapped_reads',     tooltip: 'Instructions here about mapped reads', complete: false, pass: false },
                { name: 'Duplicate rate',        key: 'duplicate_rate',   tooltip: 'Instructions here about duplicate rate', complete: false, pass: false }
              ]
            },
            { number: 3,
              title: 'Gene lists',
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
            { number: 4,
              title: 'De novo variants',
              app: 'gene',
              summary: 'Interrogate proband for known pathogenic or de novo variants and check for areas of insufficient coverage in genes.',
              description: 'The GENE.IOBIO app is used to interrogate proband variants in the identified gene list that could be candidates for causative variants.',
              complete: false,
              tasks: [
                { name: 'Pathogenic variants',     key: 'pathogenic',     tooltip: 'After genes are analyzed, this badge will show you the number of genes with pathogenic variants, which are variants with a 5% allele frequency or less and a pathogenic/likely pathogenic designation from ClinVar', complete: false, pass: false },
                { name: 'De novo variants',        key: 'denovo',         tooltip: 'After genes are analyzed, this badge will show you the number of genes with de novo variants, which are variants with a 5% allele frequency or less and a de novo inheritance mode', complete: false, pass: false },
                { name: 'Insufficient coverage',   key: 'coverage',       tooltip: 'After genes are analyzed, this badge will show you the number of genes insufficient coverage.', complete: false, pass: false },
                { name: 'Expand gene list',        key: 'genes-menu',     tooltip: 'Enter a new gene name or click on the + button to expand the gene list', complete: false, pass: false }
              ]
            },
            { number: 5,
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
        self.promiseUpdateWorkflow();
      }
    }
  },

  methods: {

    init: function() {
      let self = this;

      self.project = self.projectTemplate;

      // WORKAROUND - until project id can be passed in from hub
      self.idProject = self.paramProjectId && self.paramProjectId.length > 0 ? self.paramProjectId : "test";

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
      if (iframeSelector && iframeSelector.length > 0) {
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




      if (messageObject.type == "apply-genes") {
        var taskMap = {
          'gtr':              'Panel genes',
          'phenotype-driven': 'Phenotype driven genes',
          'all':              'Export genes'
        }
        this.promiseUpdateGenes(messageObject.genes);
        this.promiseUpdatePhenotypes(messageObject.searchTerms);
        this.promiseCompleteStepTask('Gene lists', taskMap[messageObject.source]);
        this.sendAppMessage('gene', messageObject);
      } else if (messageObject.type == "save-variants") {
        this.promiseUpdateVariants(messageObject.variants);
        this.promiseCompleteStepTask('De novo variants', 'De novo variants');
        this.promiseCompleteStepTask('De novo variants', 'Pathogenic variants');
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
