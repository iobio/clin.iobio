<style lang="sass">

@import ../../../assets/sass/variables



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

  #workflow-steps
    text-align: center
    width: fit-content
    display: inline-block
    margin-right: 10px


  #current-step-summary
    float: right
    text-align: left
    width: 240px
    font-size: 12px
    margin-left: 40px
    margin-left: 20px
    margin-right: 5px

    .current-step-label
      font-size: 14px
      text-transform: uppercase
      color:  $workflow-active-color
      margin-bottom: 5px


  .input-group--selection-controls.accent--text
    .icon--selection-control
      color: $text-color

  .input-group--selection-controls.accent--text.input-group--active
    .icon--selection-control
      color: $workflow-active-color


  .button-panel
    margin-top: -37px

    .nav-btn
      margin: 0px

      .material-icons
        color:  $text-color
        font-size: 24px
        font-weight: bold

  #current-checkbox-container
    vertical-align: middle
    margin-left: 0px
    margin-right: 0px
    margin-top: -15px

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

    &.active

      .step-label
        color:  $workflow-active-color
      .step
        .avatar-button
          height:      48px
          min-width:   48px

          .avatar
            width:     48px !important
            height:    48px !important
            border: solid 2px $workflow-active-color

            .headline
              font-size: 20px !important
              color: $workflow-active-color !important

        .task
          .avatar
            border-color:  $text-color !important
            background-color: white !important

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
          &.complete
            .avatar
              background-color:  $workflow-active-color !important
              .material-icons
                color: white !important


        .task-label
          color: $text-color

        .avatar-button
          height:    24px !important
          min-width: 24px !important
          .avatar
            width: 24px !important
            height: 24px !important
            border: solid 2px $text-color
            background-color:  white

            .material-icons
              color: $text-color
              font-size: 18px
              font-weight: bold





    .step-buttons
      display: inline-block

    .divider
      width: 26px
      margin: 0px
      display: inline-block
      height: 2px

      &.short
        width: 26px

      &.long
        width: 60px

    .step-label
      margin-bottom: 5px
      color:  $text-color
      text-transform: uppercase

    .step
      display: inline-block
      text-align: center

      .avatar-button
        height:    48px
        min-width: 48px
        margin-left: 3px

        .avatar
          width:   48px !important
          height:  48px !important

          .headline
            font-size: 12px !important
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
        min-height:  40px

      .avatar-button
        height:      16px
        min-width:   16px
        .avatar
          width:             16px !important
          height:            16px !important
          border: solid 2px  $workflow-inactive-color
          background-color:  white

          .material-icons
            color: $workflow-inactive-color
            font-size: 11px
            font-weight: bold
            width: 16px
            height: 16px


      &.active
        .task-label
          color: $workflow-active-color
        .avatar-button
          height:    24px
          min-width: 24px
          .avatar
            width: 24px !important
            height: 24px !important
            border: solid 2px $workflow-active-color
            background-color:  $workflow-active-color

            .material-icons
              color: white
              font-size: 20px
              font-weight: bold







</style>

<template>
  <v-card light id="workflow-card" >
    <div id="workflow-steps">
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
              <div class="task-label">{{ getTaskName(step.key, task.key) }}</div>
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
       <v-checkbox id="current-task-checkbox"  label="Complete" :hide-details="false"
          v-model="currentTaskComplete"
          light></v-checkbox>
      </div>

      <div class="button-panel"  style="text-align:center" >
        <v-btn :class="{'nav-btn': true, 'disabled': disablePrev}" icon flat @click="onPrevTask"><v-icon>arrow_back</v-icon></v-btn>
        <v-btn :class="{'nav-btn': true, 'disabled': disableNext}"icon flat @click="onNextTask"><v-icon>arrow_forward</v-icon></v-btn>
      </div>
    </div>

    <div id="current-step-summary">
      <div class="current-step-label">{{ getStepTitle(currentStep.key) }}</div>
      <div>
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
      disablePrev: false
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
        self.$emit("on-task-completed", self.currentTask);
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
      self.$nextTick(function() {
        self.currentTaskLeft = $('.task.active')[0].offsetLeft + 20 + 'px';

        let stepIdx = self.currentStep.number - 1;
        let taskIdx =  self.currentStep.tasks.indexOf(self.currentTask);
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
          selt.setStepAndTask(theStep, theStep.tasks[theStep.tasks.length - 1]);
        }

      } else {
        // Go to prev task in same step
        set.setTask(tasks[taskIdx-1]);
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
    self.shiftButtons();

  },
  computed:  {
  }
}

</script>