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



.task-switch
  &.accent--text
    color:  $app-color !important

button
  &.primary
    background-color: $button-color !important
    border-color: $button-color !important

.card
  -webkit-box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.10), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 1px 3px 0px rgba(0,0,0,0.03) !important
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.10), 0px 1px 1px 0px rgba(0,0,0,0.07), 0px 1px 3px 0px rgba(0,0,0,0.03) !important

nav.toolbar
  -webkit-box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.03), 0px 1px 3px 0px rgba(0,0,0,0.01) !important
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.05), 0px 1px 1px 0px rgba(0,0,0,0.03), 0px 1px 3px 0px rgba(0,0,0,0.01) !important

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


