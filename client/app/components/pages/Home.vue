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
    height: 115px
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
    <v-card class="dashboard-card">

          <v-btn v-show="false"flat fab small style="float:right"
           v-if="!showDashboard"
           @click="showDashboard = true">
            <v-icon color="grey darken-1" style="font-size:32px">expand_more</v-icon>
          </v-btn>


      <v-stepper v-model="currentStep" non-linear>
        <div class="workflow-summary-panel">
          <div>
            <h5> {{ workflow.title }} </h5>
            <div>
              {{ workflow.summary}}
            </div>
          </div>
        </div>

        <div class="vertical-divider"></div>

        <v-stepper-header>
          <template v-for="step in steps">
            <v-stepper-step :key="step.number" editable :step="step.number" :complete="step.complete">
              {{ step.title }}
            </v-stepper-step>
            <v-divider v-show="step.number != steps.length"></v-divider>
          </template>
        </v-stepper-header>

        <div class="vertical-divider"></div>

        <v-stepper-items v-show="showDashboard">
          <template v-for="step in steps">

            <v-stepper-content :key="step.number" :step="step.number">
              <div class="step-summary-panel">
                <h5>Step {{ step.number }}. {{ step.title }}</h5>
                <div>
                    {{ step.summary }}
                </div>
              </div>

              <div class="tasks-panel">
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
    <v-card style="padding: 2px">
      <div id="bam-iframe" v-show="currentStep == 1">
        <iframe  src="http://nv-dev-new.iobio.io/vue.bam.iobio/" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>


      <div id="gene-panel-iframe" v-show="currentStep == 2">
        <iframe  src="http://localhost:4024" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

      <div id="gene-iframe" v-show="currentStep == 3">
        <iframe  src="http://localhost:4026" style="width:100%;height:100%" frameBorder="0">
        </iframe>
      </div>

    </v-card>
  </div>


</template>


<script>




export default {
  name: 'home',
  components: {
  },
  props: {
    paramIdProject:  null,
    paramDebug:  null
  },
  data() {
    return {
      greeting: 'clin.iobio.vue',
      currentStep: null,
      showDashboard: true,
      workflow: {
        title: 'De novo variant analysis',
        summary: 'Look for de novo variants in whole exome or genome sequencing research project.  Perform basic quality control.'
      },
      steps: [

        { number: 1,
          title: 'Data QC',
          summary: 'Check quality of sequence alignments for the proband.',
          complete: false,
          tasks: [
            { name: 'Genomic wide coverage', complete: false, pass: false },
            { name: 'Median coverage',       complete: false, pass: false },
            { name: 'Mapped reads',          complete: false, pass: false },
            { name: 'Duplicate rate',        complete: false, pass: false }
          ]
        },
        { number: 2,
          title: 'Gene lists',
          summary: 'Generate list of candidate genes.',
          complete: false,
          tasks: [
            { name: 'Panel genes',             complete: false, pass: false },
            { name: 'Phenotype driven genes',  complete: false, pass: false },
            { name: 'Export genes',            complete: false, pass: false }
          ]
        },
        { number: 3,
          title: 'De novo variants',
          summary: 'Interrogate proband for known pathogenic or de novo variants and check for areas of insufficient coverage in genes.',
          complete: false,
          tasks: [
            { name: 'Pathogenic variants',     complete: false, pass: false },
            { name: 'De novo variants',        complete: false, pass: false },
            { name: 'Insufficient coverage',   complete: false, pass: false },
            { name: 'Expand gene list',        complete: false, pass: false }
          ]
        },
        { number: 4,
          title: 'Report',
          summary: 'Generate report for analysis results.',
          complete: false,
          tasks: [
            { name: 'Review',                complete: false, pass: false }
          ]
        }

      ]

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
  },

  methods: {

    init: function() {
      let self = this;
      window.addEventListener("message", self.receiveAppMessage, false);
    },

    sendMessageToGene: function(obj) {
      var theObject = obj ? obj : {type: 'start-analysis', sender: 'clin.iobio'};
      $("#gene-iframe iframe")[0].contentWindow.postMessage(JSON.stringify(theObject), '*');
    },

    sendMessageToGenePanel: function(obj) {
      var theObject = obj ? obj : {type: 'start-analysis', sender: 'clin.iobio'};
      $("#gene-panel-iframe iframe")[0].contentWindow.postMessage(JSON.stringify(theObject), '*');
    },

    receiveAppMessage: function(event) {
      // Do we trust the sender of this message?
      if (event.origin !== "http://localhost:4026" &&  event.origin !== "http://localhost:4024") {
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
        this.sendMessageToGene(messageObject)
      }
    }
  }
}
</script>
