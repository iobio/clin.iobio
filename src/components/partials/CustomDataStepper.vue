<template>
  <div class="mb-4">
    <v-stepper alt-labels v-model="pageCounter">
      <v-stepper-header>
        <v-stepper-step :complete="pageCounter > 1" step="1">Description</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="pageCounter > 2" step="2">Pedigree</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="pageCounter > 3" step="3">Files</v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step step="4" :complete="pageCounter > 4"  >Genes/Variants</v-stepper-step>
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
