<style lang="sass">

@import ../../../assets/sass/variables

$badge-inactive-color:  #d8d3d3


#workflow-card
  color: $workflow-inactive-color
  height: 140px
  margin-top: 50px
  margin-bottom: 10px
  padding-top: 10px
  padding-bottom: 0px
  padding-right: 10px
  padding-left: 10px
  text-align: left


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
      font-size: 13px
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

    .task-badge
      display: inline-block
      position: relative
      font-size: 10px
      padding: 3px 7px
      right: -35px
      top: -5px
      color: white
      background-color:  $badge-inactive-color

      &.active
        background-color:  $text-color

      &.empty
        visibility:  hidden
        height: 16px

    .task-text
      margin-top: -10px

  .avatar-button
    position: relative
    padding: 0px
    margin: 0px

    .btn__content
      padding: 0px

      .avatar
        border: solid 2px $workflow-inactive-color

        .headline
          color:  $workflow-inactive-color


  .step-container
    display: inline-block
    vertical-align: top
    text-align: left

    &.active

      .step-label
        color:  $workflow-active-color

      .step
        .avatar-button
          height:      40px
          min-width:   40px

          .avatar
            width:     40px !important
            height:    40px !important
            border: solid 2px $workflow-active-color

            .headline
              font-size: 20px !important
              color: $workflow-active-color !important


      &.active.complete
        .step
          .avatar
            background-color: $workflow-active-color
            .headline
              color: white !important


      .task
        &.complete
          .avatar
            border-color:  $text-color !important
            background-color: $text-color !important
            .material-icons
              color: $text-color !important
        &.active
          .avatar
            background-color:  white !important
            border-color: $workflow-active-color  !important
            .material-icons
              color: white !important
          .task-label
            color: $workflow-active-color
            font-weight: bold
          &.complete
            .avatar
              background-color:  $workflow-active-color !important
              .material-icons
                color: white !important


        .task-label
          color: $text-color

        .avatar-button
          height:    20px !important
          min-width: 20px !important
          .avatar
            width: 20px !important
            height: 20px !important
            border: solid 2px $text-color
            background-color:  white
            margin-top: 0px

            .material-icons
              color: $text-color
              font-size: 14px
              font-weight: bold





    .step-buttons
      display: inline-block

    .divider
      width: 34px
      margin: 0px
      display: inline-block
      height: 2px

      &.short
        width: 14px

      &.long
        width: 46px

    .step-label
      margin-bottom: 10px
      color:  $text-color
      text-transform: uppercase
      font-weight: 600
      font-family: Raleway
      font-size: 13px
      text-align: center


    .step
      display: inline-block
      text-align: center

      .avatar-button
        height:    32px
        min-width: 32px
        margin-left: 3px

        .avatar
          width:   32px !important
          height:  32px !important

          .headline
            font-size: 14px !important
    &.complete
      .avatar
        background-color: $workflow-inactive-color
        .headline
          color: white !important

    .task

      &.complete
        .avatar
          background-color: $workflow-inactive-color !important
          .material-icons
            color: white !important

      .task-label
        width:       24px
        font-size:   11px
        line-height: 12px
        text-align:  center
        min-height:  46px

      .avatar-button
        height:      24px !important
        min-width:   24px !important
        .avatar
          width:             14px !important
          height:            14px !important
          display:           inline-block
          margin-top:        3px
          border: solid 2px  $workflow-inactive-color
          background-color:  white

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
    margin-top: 0px

  #current-checkbox-container
    margin-top: -38px
    max-width: 30px

    label
      display: none

  .step-container
    display: inline-block
    vertical-align: top
    text-align: left

    &.active
      .task
        &.active
          .avatar-button
            visibility: hidden

  #ab-switch
    top: 125px


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
    <div id="workflow-steps" v-if="analysis && analysis.steps">
      <div  v-for="(step, stepIndex) in analysis.steps" :key="step.key"
      :class="{'step-container': true, 'active' : currentStep && step.key == currentStep.key  ? true : false, 'complete': step.complete}">

        <div class="step-label">
          {{ getStepTitle(step.key) }}
        </div>
        <div class="step-buttons">
          <div class="step">
            <v-btn class="avatar-button" flat  @click="onStepClick(step)">
              <v-avatar >
                <span class="headline">{{ getStepNumber(step.key) }} </span>
              </v-avatar>
            </v-btn>
          </div>


          <div v-for="(task, taskIndex) in step.tasks" :key="task.key"
          :class="{'task': true, 'active' : currentTask && task.key == currentTask.key  ? true : false, 'complete': task.complete}">
            <v-divider :class="{'short': taskIndex == 0}"></v-divider>
            <div style="display:inline-block">
              <div class="task-label">
                <v-badge  right
                 :class="{'task-badge': true, 'empty': task.badge == null, 'active': currentStep && step.key == currentStep.key  ? true : false}">{{ task.badge }}</v-badge>
                <div class="task-text">
                  {{ getTaskName(step.key, task.key) }}
                </div>
              </div>
              <v-btn class="avatar-button"  flat  @click="onTaskClick(step, task)">
                  <v-avatar >
                    <v-icon v-if="false && task.complete">check</v-icon>
                  </v-avatar>
              </v-btn>
            </div>
          </div>

        </div>

        <v-divider class="long" v-if="stepIndex < analysis.steps.length-1"></v-divider>
      </div>

      <div id="current-checkbox-container" v-if="currentTask" :style="{left: currentTaskLeft, position: 'relative'}">
       <v-checkbox id="current-task-checkbox"  label="complete" :hide-details="false"
          v-model="currentTaskComplete"
          light></v-checkbox>
      </div>

      <div class="button-panel"  style="text-align:center" >
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

    <div id="ab-switch">
       <v-switch label="alternate" v-model="taskIsCheckbox"></v-switch>
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
    analysis: null,
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
      taskIsCheckbox: false
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
    }
  },
  methods: {
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

          let offset = taskIdx == 0 ? 8 : 28;
          self.currentTaskLeft = $('.task.active')[0].offsetLeft + offset + 'px';

          if (taskIdx == self.currentStep.tasks.length - 1 && stepIdx == self.analysis.steps.length - 1) {
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
        if (stepIdx < self.analysis.steps.length) {
          let theStep = self.analysis.steps[stepIdx];
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
          let theStep = self.analysis.steps[stepIdx-1];
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
    }

  },
  created: function() {
  },
  mounted: function() {
    let self = this;
    self.currentStep = self.analysis.steps[0];
    self.currentTask = self.currentStep.tasks[0];
    self.currentTaskComplete = self.currentTask.complete;
    self.shiftButtons();

  },
  computed:  {
  }
}

</script>