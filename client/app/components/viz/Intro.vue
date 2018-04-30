<style lang="sass" scoped >

@import ../../../assets/sass/variables

.card
  min-height: 70px !important

.step-entry
  clear: both
  overflow: auto

.step-number
  width: 24px
  color: white !important
  float: left

.step-description
  float: left
  display: inline-block
  width: calc(100% - 40px)

</style>

<template>
  <div id="intro-card" >
    <div class="text-xs-center">
      <v-btn  color="primary">
        Begin Analysis
      </v-btn>
    </div>


    <h4>Summary</h4>
    <v-card light>
      <div>
        {{ workflow.description }}
      </div>

      <div class="mt-2 step-entry"  v-for="step in filteredSteps" :key="step.number">
              <span class="step-number stepper__step__step primary"> {{ step.number - 1 }}</span>
              <div class="step-description">{{ step.title }}. {{ step.description }}</div>
      </div>
    </v-card>

    <h4 class="mt-4">Workflow</h4>
    <v-card light >
    </v-card>

    <h4 class="mt-4">Analysis tasks</h4>
    <v-card light >
    </v-card>

    <h4 class="mt-4">General operations</h4>
    <v-card light >
    </v-card>


  </div>
</template>

<script>

export default {
  name: 'intro',
  components: {
  },
  props: {
    workflow: null
  },
  data() {
    return {
    };
  },
  computed: {
    filteredSteps: function() {
      let self = this;
      if (self.workflow && self.workflow.steps) {
        return self.workflow.steps.filter(function(step) {
          return !step.isIntro;
        })
      } else {
        return [];
      }
    }
  }
}
</script>