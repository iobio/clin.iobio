<style lang="sass">

@import ../../assets/sass/variables

$badge-inactive-color:  #d8d3d3


#workflow-card
  color: $workflow-inactive-color
  height: auto
  margin-bottom: 8px
  padding-right: 10px
  padding-left: 10px
  padding-top: 5px
  padding-bottom: 10px
  text-align: center
  background-color: #f1efe9
  

  #ab-switch
    position: absolute
    top: 145px
    right: 20px
    width: 97px

    label
      font-size: 12px
      margin-left: -4px

  #workflow-steps
    text-align: center
    width: fit-content
    display: inline-block
    margin-right: 0px


  #current-step-summary
    float: right
    text-align: left
    width: calc(100% - 870px)
    font-size: 12px
    margin-left: 20px
    margin-right: 0px

    .current-step-label
      font-size: 15px
      text-transform: uppercase
      color:  $workflow-active-color
      font-weight: 600
      font-family: Raleway

  .vertical-divider
    border-left: 1px solid #ded9d9
    height: 120px
    float: right
    margin-top: 5px
    margin-bottom: 5px
    margin-left: 20px
    margin-right: 10px


  .input-group--selection-controls.accent--text
    .icon--selection-control
      color: $text-color

  .input-group--selection-controls.accent--text.input-group--active
    .icon--selection-control
      color: $text-color


  .button-panel
    margin-top: -27px

    .nav-btn
      margin: 0px
      margin-left: 10px
      margin-right: 20px
      color: $text-color
      height: 22px
      padding: 0px
      margin-bottom: 7px
      margin-top: 10px
      min-width: 50px

      .material-icons
        color:  $text-color
        font-size: 20px
        font-weight: bold

  #current-checkbox-container
    vertical-align: middle
    margin-left: 0px
    margin-right: 0px
    margin-top: -12px

    .checkbox
      margin: 0px
      margin-top: 4px

    label
      padding-top: 4px
      margin-left: -6px
      font-size: 11px

  .task
    display: inline-block
    text-align: center
    margin-left: 0px

    .task-label
      .v-badge__badge
        justify-content: flex-start !important

    .task-badge
      display: inline-block
      position: relative
      font-size: 12px
      font-weight: 600
      font-style: italic
      right: -70px
      top: 10px
      color: $workflow-badge-color
      background-color: transparent
      line-height: 13px


      &.active
        background-color:  transparent

      &.empty
        visibility:  hidden
        height: 16px

      &.sig
        color: $workflow-badge-red-color !important
      &.unknown-sig
        color: $workflow-badge-orange-color  !important 



    .task-text
      margin-top: -10px

  .avatar-button
    position: relative
    padding: 0px
    margin: 0px

    .v-btn__content
      padding: 0px

      .v-avatar
        border: solid 2px $workflow-inactive-color

        .headline
          color:  $workflow-inactive-color


  .step-container
    display: inline-block
    text-align: left

    &.active

      .step-label
        color:  $workflow-active-color

      .step
        .avatar-button
          height:      40px
          min-width:   40px

          .v-avatar
            width:     40px !important
            height:    40px !important
            min-width:   0px !important
            border: solid 2px $workflow-active-color

            .headline
              font-size: 20px !important
              color: $workflow-active-color !important


      &.active.complete
        .step
          .v-avatar
            background-color: $workflow-active-color
            .headline
              color: white !important


      .task
        &.complete
          .v-avatar
            border-color:  $text-color !important
            background-color: $text-color !important
            .material-icons
              color: $text-color !important
        &.active
          .v-avatar
            background-color:  transparent !important
            border-color: $workflow-active-color  !important
            .material-icons
              color: white !important
          .task-label
            color: $workflow-active-color
            font-weight: bold
          &.complete
            .v-avatar
              background-color:  $workflow-active-color !important
              .material-icons
                color: white !important


        .task-label
          color: $text-color

        .avatar-button
          height:    20px !important
          min-width: 20px !important
          .v-avatar
            width: 20px !important
            height: 20px !important
            min-width:   0px !important
            border: solid 2px $text-color
            background-color:  white
            margin-top: 0px

            .material-icons
              color: $text-color
              font-size: 14px
              font-weight: bold





    .step-buttons
      display: inline-block

    .v-divider
      width: 34px
      margin: 0px
      display: inline-block
      height: 2px

      &.short
        width: 70px

      &.long
        width: 80px

      &.invisible
        visibility: hidden


    .step-label
      margin-bottom: 5px
      color:  $text-color
      text-transform: uppercase
      font-weight: 600
      font-family: Raleway
      font-size: 15px
      text-align: center
      margin-left: 100px



      &.first
        margin-left: 5px


    .step
      display: inline-block
      text-align: center

      .avatar-button
        height:    32px
        min-width: 32px
        margin-left: 3px

        .v-avatar
          width:   32px !important
          height:  32px !important
          min-width:   0px !important

          .headline
            font-size: 14px !important
    &.complete
      .v-avatar
        background-color: $workflow-inactive-color
        .headline
          color: white !important

    .task

      &.complete
        .v-avatar
          background-color: $workflow-inactive-color !important
          .material-icons
            color: white !important

      .task-label
        width:       140px
        font-size:   13px
        line-height: 14px
        text-align:  center
        min-height:  55px
        max-height:  55px
        font-weight: 500

      .avatar-button
        height:      24px !important
        min-width:   15px !important
        .v-avatar
          width:             14px !important
          height:            14px !important
          min-width:           0px !important
          display:           inline-block
          margin-top:        3px
          border: solid 2px  $workflow-inactive-color
          background-color:  transparent

          .material-icons
            color: $workflow-inactive-color
            font-size: 11px
            font-weight: bold
            width: 16px
            height: 16px


#workflow-card.task-is-checkbox

  .input-group--selection-controls.accent--text
    .icon--selection-control
      color: $workflow-active-color

  .input-group--selection-controls.accent--text.input-group--active
    .icon--selection-control
      color: $workflow-active-color


  .button-panel
    // margin-top: -25px
    margin-top: -15px

  #current-checkbox-container
    margin-top: -52px
    max-width: 30px
    height: 35px

    label
      display: none

  .step-container
    display: inline-block
    text-align: left
    padding-bottom: 3px
    padding-top: 3px

    &.active

      .step-label
        color: white
        background-color: $workflow-active-color
        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.65)
        -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.65)

      .task
        &.active
          .avatar-button
            visibility: hidden

  #ab-switch
    top: 125px

  .v-application, .accent--text
    color: $workflow-active-color !important

</style>

<style>
@media only screen and (max-width: 1010px) {
  .right-panel {
    display: none !important
  }
}
</style>

<template>
  <v-card light id="workflow-card" :class="{'task-is-checkbox': taskIsCheckbox}" >
    <div id="workflow-steps" v-if="analysisStepsRefreshed">
      <div  v-for="(step, stepIndex) in analysisStepsRefreshed" :key="step.key"
      :class="{'step-container': true, 'active' : currentStep && step.key == currentStep.key  ? true : false, 'complete': step.complete}">

        <div :class="{'step-label': true, 'first': stepIndex == 0}" >
          {{ getStepTitle(step.key) }}
        </div>
        <div class="step-buttons">
          <div class="step">
            <v-divider v-if="stepIndex != 0" :class="{'long': true}"></v-divider>
            <v-btn class="avatar-button" text  @click="onStepClick(step)">
              <v-avatar >
                <span class="headline">{{ getStepNumber(step.key) }} </span>
              </v-avatar>
            </v-btn>
          </div>


          <div v-for="(task, taskIndex) in step.tasks" :key="task.key"
          :class="{'task': true, 'active' : currentTask && task.key == currentTask.key  ? true : false, 'complete': task.complete}">
            <div style="display:inline-block">
              <div class="task-label">
                <v-badge right color="transparent" >

                  <span v-if="task.badges" v-for="taskBadge, idx in task.badges" :key="taskBadge.label"
                  :class="getTaskBadgeClass(taskBadge, currentStep && step.key == currentStep.key)" slot="badge">{{ taskBadge.count + ' ' + taskBadge.label }}</span>

                  <span v-if="!task.badges" :class="{'task-badge': true, 'empty': true, 'active': false}" slot="badge"></span>
                </v-badge>

                <div class="task-text">
                  {{ getTaskName(step.key, task.key) }}
                </div>
              </div>
              <v-divider :class="{'short': true}"></v-divider>
              <v-btn class="avatar-button"  text  @click="onTaskClick(step, task)">
                  <v-avatar >
                    <v-icon v-if="false && task.complete">check</v-icon>
                  </v-avatar>
              </v-btn>
              <v-divider
              :class="{'short': true, 'invisible': stepIndex == analysisSteps.length-1  && taskIndex == step.tasks.length-1}"></v-divider>
            </div>
          </div>

        </div>

      </div>

      <div id="current-checkbox-container" v-if="currentTask" :style="{left: currentTaskLeft, position: 'relative'}">
       <v-checkbox id="current-task-checkbox"  label="complete" :hide-details="false"
          v-model="currentTaskComplete"
          light></v-checkbox>
      </div>

      <div class="button-panel" v-show="false" style="text-align:center" >
        <v-btn :class="{'nav-btn': true, 'disabled': disablePrev}"  small  @click="onPrevTask"><v-icon>arrow_back</v-icon></v-btn>
        <v-btn :class="{'nav-btn': true, 'disabled': disableNext}"  small  @click="onNextTask"><v-icon>arrow_forward</v-icon></v-btn>
      </div>
    </div>


    <div id="current-step-summary" class="right-panel" v-if="false && currentStep">
      <div class="current-step-label" style="font-size:11px">{{ getStepTitle(currentStep.key) }}</div>
      <div style="font-size: 11px">
          {{ getStepSummary(currentStep.key) }}
      </div>
    </div>


  </v-card>
</template>

<script>


export default {
  name: 'workflow',
  components: {
  },
  props: {
    caseSummary: null,
    analysisSteps: null,
    workflow: null

  },
  data () {
    let self = this;
    return {
      currentStep: null,
      currentTask: null,
      currentTaskComplete: null,
      currentTaskLeft: '0px',
      disableNext: false,
      disablePrev: false,
      taskIsCheckbox: true,
      badges: null,
      analysisStepsRefreshed: []
    }
  },
  watch: {
    currentTask: function() {
      let self = this;
      self.$emit("on-task-changed")
    },
    currentTaskComplete: function() {
      let self = this;
      let theComplete = self.currentTask.complete;
      if (theComplete != self.currentTaskComplete) {
        self.currentTask.complete = self.currentTaskComplete;
        let completed = self.currentStep.tasks.filter(function(task) {
          return task.complete;
        })
        if (completed.length == self.currentStep.tasks.length) {
          self.currentStep.complete = true;
        } else {
          self.currentStep.complete = false;
        }
        self.$emit("on-task-completed", self.currentStep, self.currentTask);
      }
    },
    analysisSteps: function() {
      this.analysisStepsRefreshed = this.analysisSteps;
    }
  },
  methods: {
    refresh: function() {
      let self = this;

      self.$set(self, "analysisStepsRefreshed", [])
      let theSteps = [];
      self.analysisSteps.forEach(function(analysisStep) {
        theSteps.push(analysisStep);
      })
      self.$set(self, "analysisStepsRefreshed", theSteps)

    },
    onStepClick: function(step) {
      let self = this;
      self.setStepAndTask(step, step.tasks[0]);
    },
    onTaskClick: function(step, task) {
      let self = this;
      self.setStepAndTask(step, task);
      self.shiftButtons();
    },
    setStepAndTask: function(step, task) {
      let self = this;

      let oldStepNumber = self.currentStep.number;
      self.currentStep = step;

      self.setTask(task);
      if (oldStepNumber != self.currentStep.number) {
        self.$emit("on-step-changed", self.getStepNumber(self.currentStep.key))
      }

    },
    setTask: function(task) {
      let self = this;
      let oldTaskKey = self.currentTask.key
      self.currentTask = task;
      self.currentTaskComplete = self.currentTask.complete;
      self.shiftButtons();
      if (oldTaskKey != self.currentTask.key) {
        self.$emit("on-task-changed", self.getStepNumber(self.currentStep.key), self.currentTask)
      }
    },
    shiftButtons: function() {
      let self = this;
      setTimeout(function() {
        self.$nextTick(function() {

          let stepIdx = self.currentStep.number - 1;
          let taskIdx =  self.currentStep.tasks.indexOf(self.currentTask);

          let offsetLeft = $('#workflow-steps')[0].offsetLeft;

          let offset = taskIdx == 0 ? 67 : 67;
          self.currentTaskLeft = $('.task.active')[0].offsetLeft - offsetLeft + offset + 'px';

          if (taskIdx == self.currentStep.tasks.length - 1 && stepIdx == self.analysisSteps.length - 1) {
            self.disableNext = true;
          } else {
            self.disableNext = false;
          }

          if (stepIdx == 0 && taskIdx == 0) {
            self.disablePrev = true;
          } else {
            self.disablePrev = false;
          }
        })

      }, 200)
    },
    onNextTask: function() {
      let self = this;
      let taskIdx =  self.currentStep.tasks.indexOf(self.currentTask);
      if (taskIdx == self.currentStep.tasks.length - 1) {
        // Go to next step
        let stepIdx = self.currentStep.number;
        if (stepIdx < self.analysisSteps.length) {
          let theStep = self.analysisSteps[stepIdx];
          self.setStepAndTask(theStep, theStep.tasks[0]);
        }

      } else {
        // Go to next task in same step
        self.setTask(self.currentStep.tasks[taskIdx+1]);
      }
    },
    onPrevTask: function() {
      let self = this;
      let taskIdx =  self.currentStep.tasks.indexOf(self.currentTask);
      if (taskIdx == 0) {
        // Go to prev step
        let stepIdx = self.currentStep.number - 1;
        if (stepIdx > 0) {
          let theStep = self.analysisSteps[stepIdx-1];
          self.setStepAndTask(theStep, theStep.tasks[theStep.tasks.length - 1]);
        }

      } else {
        // Go to prev task in same step
        self.setTask(self.currentStep.tasks[taskIdx-1]);
      }

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
    getTaskBadgeClass: function(taskBadge, active) {
      let buf = "task-badge ";
      buf += taskBadge.class ? taskBadge.class : "";
      if (active) {
        buf += " active";
      }
      if (taskBadge.count == null || taskBadge.count == 0 || taskBadge.count == '') {
        buf += " hide";
      }
      return buf;
    }


  },
  created: function() {
  },
  mounted: function() {
    let self = this;
    self.analysisStepsRefreshed = self.analysisSteps;
    self.currentStep = self.analysisSteps[0];
    self.currentTask = self.currentStep.tasks[0];
    self.currentTaskComplete = self.currentTask.complete;

    self.shiftButtons();


  }
}

</script>
