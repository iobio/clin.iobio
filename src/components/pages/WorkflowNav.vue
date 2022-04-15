<template>

    <v-card  class="workflow-card-new">
      <div >
        <div  class="step-flow-container">
           <div :class="{'step-flow': true, 'current': step.current}" v-for="step in steps" :key="step.number">
             <div class="glyph" >
                <v-icon v-if="!step.current && step.complete" @click="onStepClicked(step)">
                  check_circle
                </v-icon>
                <v-icon v-if="!step.current && !step.complete" @click="onStepClicked(step)">
                  panorama_fish_eye
                </v-icon>
                <v-checkbox v-if="step.current" v-model="currentStepComplete" hide-details></v-checkbox>
             </div>
             <div  :class="{'line': true, 'complete': step.complete}" v-if="step.number != 4"></div>
            </div>
        </div>
            <div class="step-container" >
                 <div  v-for="step in steps" :key="step.number" :class="{'step': true, 'current': step.current}" @click="onStepClicked(step)">

                        <div  style="display:flex;flex-flow:column;align-items:center;justify-content:center">
                          <div class="step-label">{{ step.name }}</div>
                          <div class="step-icon" v-tooltip.right="step.description">
                            <case-icon v-if="step.number == 1" ></case-icon>
                            <phenotype-icon v-if="step.number == 2" ></phenotype-icon>
                            <variants-icon v-if="step.number == 3" ></variants-icon>
                            <findings-icon v-if="step.number == 4" ></findings-icon>
                          </div>
                          </div>

                    <div class="badges">
                      <div v-for="badge in step.badges" :key="badge.label">
                       <v-icon dark id="failed-icon"  v-if="false && badge.class && badge.class == 'failed'">error</v-icon>
                        <v-badge
                          v-if="badge.count && badge.count != ''"
                          :content="badge.count" :class="badge.class ? badge.class : ''">
                          {{ badge.label | to-firstCharacterUppercase}}
                        </v-badge>
                      </div>
                    </div>
                 </div>
            </div>
      </div>
       
    </v-card>

</template>

<script>

import phenotypeIcon from '../partials/icons/phenotype-icon.vue'
import caseIcon      from '../partials/icons/case-icon.vue'
import findingsIcon  from '../partials/icons/findings-icon.vue'
import variantsIcon  from '../partials/icons/variants-icon.vue'
import { bus }       from '../../main'
import { mapGetters, mapActions } from 'vuex'


export default {
  name: 'workflow-new',
  components: {
    caseIcon,
    phenotypeIcon,
    variantsIcon,
    findingsIcon
  },
  props: {
    caseSummary: null,
    analysisSteps: null,
    workflow: null
  },
  data () {
    let self = this;
    return {
      steps: [],
      currentStepNumber: 1,
      currentStepComplete: null
    }
  },
  computed: {
    ...mapGetters(['allAnalysis']),
  },
  methods:  {
    ...mapActions(['fetchAnalysis']),
    getfetchAnalysis: function(){
      this.fetchAnalysis(); //calling action 
    },
    refresh: function() {
        let self = this;
        self.steps = []
        let theSteps = [];

        /*
        let lastCompleteStep = null;
        let lastCompleteTask = null;
        self.analysisSteps.forEach(function(step) {
          if (step.tasks[0].complete) {
            lastCompleteTask = step.tasks[0];
            lastCompleteStep = step;
          }
        })
        if (lastCompleteStep == null && self.currentStepNumber == 1) {
          lastCompleteStep = self.analysisSteps[0];
          lastCompleteTask = lastCompleteStep.tasks[0];
        }
        if (lastCompleteStep && self.currentStepNumber == 1) {
          self.currentStepNumber = lastCompleteStep.number;
          self.analysisSteps.forEach(function(step) {
            step.tasks.forEach(function(task) {
              task.current = (task.key == lastCompleteTask.key ? true : false);
            })
          })
        } 
        */


        self.analysisSteps.forEach(function(step) {
            let workflowStep = self.getWorkflowStep(step.key)
            step.tasks.forEach(function(task) {
              if (step.number == self.currentStepNumber) {
                self.currentStepComplete = task.complete
              }
              let workflowTask = self.getWorkflowTask(workflowStep, task.key)
              theSteps.push(
                   {key:          task.key,
                    stepKey:      step.key,
                    number:       step.number, 
                    name:         workflowStep.title, 
                    complete:     task.complete, 
                    current:      self.currentStepNumber == step.number, 
                    description:  workflowTask.name, 
                    badges:       task.badges, 
                    workflowStep: workflowStep, 
                    workflowTask: workflowTask})
            })
        })
        self.steps = theSteps;
    },
    onStepClicked: function(theStep) {
      let self = this;
      self.currentStepNumber = theStep.number;
      self.currentStepComplete = theStep.complete;
      theStep.current = true;
      self.steps.forEach(function(step) {
        step.current = (step.number == theStep.number ? true : false)
      })
      self.$emit('on-step-changed', theStep.number)
      self.$emit('on-task-changed', theStep.number, theStep)
      
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
    getWorkflowTask: function(workflowStep, taskKey) {
      if (workflowStep) {
        var theTasks = workflowStep.tasks.filter(function(task) {
          return task.key == taskKey;
        })
        return theTasks.length > 0 ? theTasks[0] : null;
      } else {
        return null;
      }
    }, 
    goToStepInProgress: function(){
      let self = this; 
      var stepInProgress = 0; 
      for(var i=0; i<self.steps.length-1; i++){
        if(self.steps[i].complete){
          stepInProgress++; 
        }
        else if(!self.steps[i].complete){
          break; 
        }
      }
      self.onStepClicked(self.steps[stepInProgress])
    }, 

  },
  mounted: function() {
    let self = this;
    this.refresh();
    this.$emit('on-step-changed',self.currentStepNumber)
    this.goToStepInProgress(); 
    bus.$on('navigate-to-step', (stepIndex)=>{
      self.onStepClicked(self.steps[stepIndex]); 
    })
    
  },
  watch: {
    currentStepComplete: function() {
      let self = this;
      self.steps.forEach(function(step) {
        if (step.number == self.currentStepNumber) {
          step.complete = self.currentStepComplete;
          self.$emit('on-task-completed', 
                      {key: step.stepKey, complete: step.complete}, step)
        }
      })
    },

  }
}
</script>


<style lang="sass">

@import ../../assets/sass/variables

.workflow-new
  .theme--dark.v-toolbar.v-sheet 
    background-color: $wf-nav-color-top !important

.v-application
  #application-content.workflow-new 
    .accent--text 
      color: white !important
      caret-color: white !important
    #report-button
      height: 30px
      margin-left: 20px
      margin-bottom: 4px
      background-color: $button-color
    #save-button
      background-color: $button-color !important

    #workflow-progress
      display: flex
      padding-bottom: 10px
      margin-left: 50px

      .v-btn__content
        color: white

        i.material-icons
          color: white !important
          font-size: 17px !important
          padding-right: 2px
      

      .v-progress-linear__background.primary
        background-color: white !important
        border-color: white !important
        opacity: 0.4
      .v-progress-linear__determinate.primary
        background-color: white !important
        border-color: white !important
        opacity: .8 !important  

.workflow-card-new
  font-family: 'Raleway' !important
  border-radius: 0px !important
  padding: 10px
  display: flex !important
  flex-flow: row !important
  justify-content: center

  
  background-color: $wf-nav-color !important
  color: white !important

  i.material-icons
    color: white 


  .step-flow-container
    display: flex
    flex-flow: row
    margin-left: 135px
    margin-bottom: 10px
    margin-right: -135px



    .step-flow
      display: flex
      flex-flow: row
      width: 300px
      justify-content: flex-start
      .line
        height: 10px
        align-self: top
        border-bottom: thin solid white
        width: 300px
        margin-top: 5px

        &.complete
          border-bottom: 4px solid white
          margin-top: 6.5px



      .glyph
        align-self: top
        width:  25px
        height: 25px
        cursor: pointer !important
        margin-left: -3px

        
        i.material-icons
          font-size: 28px !important

        .v-input--checkbox
          width: 28px
          margin-top: 0px
          margin-right: 0px

          .mdi-checkbox-blank-outline, .mdi-checkbox-marked
            font-size: 28px
            color: $wf-current

      &.current
        .glyph
          i.material-icons
            color: $wf-current  
            
        .v-input--selection-controls__ripple
          left: -8px !important
          width: 30px !important
          height: 30px !important
          top: calc(50% - 23px) !important
            
      
  .step-container
    display: flex
    flex-flow: row

    .step
      width: 300px
      display: flex
      flex-flow: column
      
      .step-icon
        padding-top: 0px
        cursor: pointer !important

        svg
          fill: white
          height: 40px
          width: 40px
      .step-label
        cursor: pointer !important

      &.current
        color: $wf-current 
        background-color: #ffffff24
        border-radius: 10px
        padding-top: 2px
        svg
          fill: $wf-current 
        .step-label
          font-weight: 600

      .badges
        display: flex
        flex-wrap: wrap
        justify-content: center

        margin-top: 5px

        #failed-icon
          font-size: 20px !important
          color: $wf-badge-red-color !important

        .v-badge 
          margin-right: 25px
          margin-bottom: 10px
          color: $wf-badge-text-color !important
          font-size: 13px !important
          font-weight: 500
          .v-badge__wrapper
            .v-badge__badge
              background-color: $wf-badge-color !important
              color: white
              font-weight: 600
              font-size: 12px
              left: calc(100% + 1px) !important
              bottom: calc(100% - 10px) !important

          &.no-count
            .v-badge__wrapper
              .v-badge__badge
                background-color: transparent !important

          &.sig
            .v-badge__wrapper
              .v-badge__badge
                background-color: $wf-badge-red-color !important
                color: white

          &.failed
            .v-badge__wrapper
              .v-badge__badge
                background-color: $wf-badge-red-color !important
                color: white

          &.unknown-sig
            .v-badge__wrapper
              .v-badge__badge
                background-color: $wf-badge-orange-color !important
                color: white
                
          &.poor-qual
            .v-badge__wrapper
              .v-badge__badge
                background-color: $poor-qual-color !important
                color: white      
                
          &.not-sig
            .v-badge__wrapper
              .v-badge__badge
                background-color: $not-significant-color !important
                color: white

</style>

