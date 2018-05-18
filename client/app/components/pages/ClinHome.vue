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
                <div class="task-entry" v-for="task in step.tasks" :key="task.name">
                  <span class="task-name">{{ task.name }}</span>
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
        <iframe  :src="bamUrl" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>


      <div id="gene-panel-iframe" v-show="currentStep == 3">
        <iframe  :src="panelUrl" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="gene-iframe" v-show="currentStep == 4">
        <iframe  :src="geneUrl" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <v-card   style="min-height:600px"
        v-show="currentStep == 5"
      >
        <report
        :project="project">
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
            geneUrl:  'http://localhost:4026',
            panelUrl: 'http://localhost:4024',
            bamUrl:   'http://localhost:4027'
        },
        'dev': {
            geneUrl:  'http://newgene.iobio.io',
            panelUrl: 'http://panel.iobio.io',
            bamUrl:   'http://newbam.iobio.io'
        },
      },
      geneUrl: null,
      panelUrl: null,
      bamUrl: null,

      currentStep: 0,
      showDashboard: true,


      //hubEnpoint: null,
      hubSession: null,

      project: {

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
              summary: 'Check quality of sequence alignments for the proband.',
              description: 'Check the quality of the underlying sequencing data for the proband. Using the BAM.IOBIO app, areas of missing coverage or unexpected statistics potentially suggesting contamination are investigated.',
              complete: false,
              tasks: [
                { name: 'Genomic wide coverage', complete: false, pass: false },
                { name: 'Median coverage',       complete: false, pass: false },
                { name: 'Mapped reads',          complete: false, pass: false },
                { name: 'Duplicate rate',        complete: false, pass: false }
              ]
            },
            { number: 3,
              title: 'Gene lists',
              summary: 'Generate list of candidate genes.',
              description: "The PANEL.IOBIO app is used to identify genes that are most likely associated with the proband's phenotypes.",
              complete: false,
              tasks: [
                { name: 'Panel genes',             complete: false, pass: false },
                { name: 'Phenotype driven genes',  complete: false, pass: false },
                { name: 'Export genes',        complete: false, pass: false }
              ]
            },
            { number: 4,
              title: 'De novo variants',
              summary: 'Interrogate proband for known pathogenic or de novo variants and check for areas of insufficient coverage in genes.',
              description: 'The GENE.IOBIO app is used to interrogate proband variants in the identified gene list that could be candidates for causative variants.',
              complete: false,
              tasks: [
                { name: 'Pathogenic variants',     complete: false, pass: false },
                { name: 'De novo variants',        complete: false, pass: false },
                { name: 'Insufficient coverage',   complete: false, pass: false },
                { name: 'Expand gene list',        complete: false, pass: false }
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
      if (this.isAuthenticated && this.project && this.currentStep) {
        this.promiseUpdateWorkflow();
      }
    }
  },

  methods: {

    init: function() {
      let self = this;

      // WOLRKAROUND - until project id can be passed in from hub
      self.idProject = "501";

      self.userSession = new UserSession();
      window.addEventListener("message", self.receiveAppMessage, false);


      var appTarget = null;
      if (self.$route.fullPath.indexOf("localhost") > 0) {
        appTarget = "localhost";
      } else {
        appTarget = "dev";
      }
      self.geneUrl  = self.appUrls[appTarget].geneUrl;
      self.panelUrl = self.appUrls[appTarget].panelUrl;
      self.bamUrl   = self.appUrls[appTarget].bamUrl;


      if (localStorage.getItem('hub-iobio-tkn') && localStorage.getItem('hub-iobio-tkn').length > 0) {

        self.hubSession = new HubSession();
        self.hubSession.promiseInit(self.paramSampleId, self.paramSource)
        .then(modelInfos => {
          self.modelInfos = modelInfos;
        })

      }


    },

    onAuthenticated: function() {
      let self = this;
      this.isAuthenticated = true;
      this.projectModel = new ProjectModel(this.userSession);


      if (this.idProject) {
        this.promiseGetProject(this.idProject, true)
        .then(function() {
            var msgObject = {
              type: 'set-data',
              sender: 'clin.iobio',
              'modelInfos': self.modelInfos,
              'genes': self.project.genes,
              'variants': self.project.variants
            };
            self.sendMessageToGene(msgObject);

            self.sendMessageToGenePanel();

            var probandModelInfo = self.modelInfos.filter(function(modelInfo) {
              return modelInfo.relationship == 'proband';
            });
            if (probandModelInfo.length > 0) {
              msgObject = {type: 'set-data', sender: 'clin.iobio', 'modelInfo': probandModelInfo[0]};
              self.sendMessageToBam(msgObject);
            }

        })
      }
    },

    sendMessageToGene: function(obj) {
      var theObject = obj ? obj : {type: 'start-analysis', sender: 'clin.iobio'};
      $("#gene-iframe iframe")[0].contentWindow.postMessage(JSON.stringify(theObject), '*');
    },

    sendMessageToGenePanel: function(obj) {
      var theObject = obj ? obj : {type: 'start-analysis', sender: 'clin.iobio'};
      $("#gene-panel-iframe iframe")[0].contentWindow.postMessage(JSON.stringify(theObject), '*');
    },

    sendMessageToBam: function(obj) {
      $("#bam-iframe iframe")[0].contentWindow.postMessage(JSON.stringify(obj), '*');
    },

    receiveAppMessage: function(event) {
      // Do we trust the sender of this message?
      if (event.origin !== this.geneUrl &&  event.origin !== this.panelUrl) {
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
        this.sendMessageToGene(messageObject);
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
    }

  }
}
</script>
