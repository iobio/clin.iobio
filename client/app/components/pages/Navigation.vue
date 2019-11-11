<style lang="sass">

@import ../../../assets/sass/variables


.dialog.dialog--active
  button
    padding: 0px
    height: 30px !important




nav.toolbar
  padding-top: 5px
  background-color: $nav-color !important
  font-weight: 300 !important


  .toolbar__content
    margin-top: 2px
    align-items: flex-end
    padding-right: 15px
    padding-bottom: 5px

    .percent-label
      font-size: 12px


    #workflow-progress
      display: inline-block
      text-align: center

      .progress-linear__background.primary
        background-color: $workflow-active-color !important
        border-color: $workflow-active-color !important
      .progress-linear__bar__determinate.primary
        background-color: $workflow-active-color !important
        border-color: $workflow-active-color !important


    .toolbar__title
      color: $nav-title-color
      font-family: $iobio-font
    .btn
      color: $nav-text-color


    .toolbar__items
      width: 60%

    .btn
      margin: 0px
      min-width: 78px
      margin-left: 10px

      .btn__content
        padding: 0 0px

    #report-button
      height: 30px
      margin-left: 20px
      margin-bottom: 4px

      .btn__content
        color: $workflow-active-color

        i.material-icons
          color: $workflow-active-color !important
          font-size: 17px !important
          padding-right: 2px


    i.material-icons
      margin-right: 2px
      color:  $nav-text-color !important

    .toolbar__title
      font-size: 18px
      margin-right: 5px
      margin-left: 5px
      padding-bottom: 6px
      min-width: 130px


</style>

<template>
  <div>
    <v-toolbar fixed   height="45"   dark  >


      <v-toolbar-title v-text="title">
      </v-toolbar-title>




      <v-menu
      offset-y
      :close-on-content-click="false"
      :nudge-width="350"
      v-model="showCaseMenu"
      >
        <v-btn v-if="caseSummary && caseSummary.name"  flat slot="activator">
          {{ caseSummary.name }}
        </v-btn>

        <v-card>
        </v-card>
      </v-menu>

      <v-spacer></v-spacer>


      <span id="workflow-progress">
        <v-progress-linear class="primary--text" :value="percentComplete" style="margin-bottom:0px;width:120px" height="16" >
        </v-progress-linear>
        <span class="percent-label">{{ percentComplete }}% complete</span>
      </span>

      <v-spacer></v-spacer>

      <v-menu
      offset-y v-if="false"
      :close-on-content-click="false"
      :nudge-width="350"
      v-model="showPhenotypesMenu"
      >
        <v-btn  flat slot="activator">
          Phenotypes
        </v-btn>

        <v-card>
        </v-card>
      </v-menu>

      <v-menu
      offset-y
      :close-on-content-click="false"
      :nudge-width="350"
      v-model="showGenesMenu"
      >
        <v-btn  flat slot="activator">
          Genes
        </v-btn>

        <v-card>
        </v-card>
      </v-menu>

      <v-menu v-if="false"
      offset-y
      :close-on-content-click="false"
      :nudge-width="350"
      v-model="showVariantsMenu"
      >
        <v-btn  flat slot="activator">
          Variants
        </v-btn>

        <v-card>
        </v-card>
      </v-menu>

      <v-menu
      offset-y
      :close-on-content-click="false"
      :nudge-width="350"
      v-model="showNotesMenu"
      >
        <v-btn  flat slot="activator">
          Notes
        </v-btn>

        <v-card>
        </v-card>
      </v-menu>

      <v-menu
      offset-y v-if="false"
      :close-on-content-click="false"
      :nudge-width="350"
      v-model="showInstructionsMenu"
      >
        <v-btn  flat slot="activator">
          Instructions
        </v-btn>

        <v-card>
        </v-card>
      </v-menu>

      <v-btn id="report-button" @click="createAnalysisPDF">
        <v-icon>assignment</v-icon>
        Report
      </v-btn>

    </v-toolbar>



  </div>
</template>

<script>

import { bus } from '../../routes';

export default {
  name: 'navigation',
  components: {
  },
  props: {
    caseSummary: null,
    analysis: null

  },
  data () {
    let self = this;
    return {
      title: 'clin.iobio',
      clipped: false,
      showCaseMenu: false,
      showPhenotypesMenu: false,
      showGenesMenu: false,
      showVariantsMenu: false,
      showNotesMenu: false,
      showInstructionsMenu: false
    }
  },
  watch: {
  },
  methods: {
    round(value, places) {
      return +(Math.round(value + "e+" + places)  + "e-" + places);
    },
    createAnalysisPDF(){
      bus.$emit("getAnalysisObject");
    }
  },
  created: function() {
  },
  mounted: function() {

  },
  computed:  {
    percentComplete: function() {
      let self = this;
      let taskCount = 0;
      let completeTaskCount = 0;
      self.analysis.payload.steps.forEach(function(step) {
        step.tasks.forEach(function(task) {
          taskCount++;
          if (task.complete) {
            completeTaskCount++;
          }
        })
      })
      return self.round(completeTaskCount / taskCount, 2) * 100;
    }
  }
}

</script>
