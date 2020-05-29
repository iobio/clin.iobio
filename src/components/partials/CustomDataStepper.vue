<template>
  <div>
    <v-stepper  alt-labels v-model="pageCounter">
      <v-stepper-header>
        <v-stepper-step :complete="pageCounter > 1" step="1">Files</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="pageCounter > 2" step="2">Gene sets</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="3" :complete="pageCounter > 3"  >Pedigree</v-stepper-step>
      </v-stepper-header>
    </v-stepper>
  </div>
</template>


<script>
  export default {
    name: 'custom-data-stepper',
    props: {
      pageCounter: {
        type: Number
      } 
    },
    data() {
      return {
      }
    },
    methods: {

    }, 
    mounted(){
    }

  }
</script>


<style>

</style>
