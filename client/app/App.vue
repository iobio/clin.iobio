<style lang="sass">
@import "../assets/sass/site.sass";


iframe
  min-height: 1024px !important

.container
  margin-top: 0px
  margin-bottom: 10px
  margin-right: 0px
  margin-left: 0px
  width: 100%
  padding: 0px 5px 0px 5px

button
  color: $text-color

.theme--light
  .content--wrap
    .btn
      color: $text-color
      padding-top: 2px
      padding-bottom: 2px
      height: 30px

.chip
  background-color:  $default-badge-color
  .chip__content
    color: white
    background-color:  $default-badge-color
    font-size: 12px
    height: 20px


.toolbar
  .input-group__details
    .progress-linear__background
      background-color: $amber-lighten-3 !important
    .progress-linear__bar__indeterminate--active
      .progress-linear__bar__indeterminate
        background-color: $amber-lighten-2 !important


.stepper__step__step
  background-color: $default-badge-color !important
  color: white !important

.stepper__step--active
  .stepper__step__step
    background-color: $app-color !important
    color: white !important

.stepper__label
  color: $text-color

.theme--light
  .stepper
    .stepper__step--active
      .stepper__label
        text-shadow: none
        color: $app-color !important

.application
  .theme--light
    .stepper
      .stepper__step--active
        .stepper__label
          text-shadow: none
          color: $app-color !important

.task-switch
  &.accent--text
    color:  $app-color !important

button
  &.primary
    background-color: $app-color !important
    border-color: $app-color !important


</style>

<template>

  <div id="app">

    <v-app light>
      <router-view></router-view>
    </v-app>


  </div>
</template>

<script>



export default {
  name: 'app',
  data() {
    return {
    }
  }
}
</script>


