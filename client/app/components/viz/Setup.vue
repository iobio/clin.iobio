<style lang="sass" scoped >

@import ../../../assets/sass/variables

#setup-panel

  .card
    min-height: 70px !important


  .model-info-panel
    display: flex
    justify-content: space-between
    flex-wrap: wrap

    .file-info
      font-size: 12px

    h5
      font-size: 14px
      color: $app-color

  .row
    margin-left: 10px
    margin-right: 10px

</style>

<template>
  <div id="setup-panel" >



    <h4>Samples</h4>
    <v-card light class="model-info-panel">
      <div  v-for="modelInfo in modelInfos" :key="modelInfo.sample">
        <h5>{{ modelInfo.relationship}}&nbsp;&nbsp;{{ modelInfo.sample }}</h5>
        <div class="file-info" >{{ modelInfo.vcf }}</div>
        <div class="file-info">{{ modelInfo.bam }}</div>
      </div>
    </v-card>



    <h4>General settings</h4>
    <v-card light>
        <v-layout row>
          <v-flex xs2>
            <v-text-field
              name="Number of genes to select"
              label="Number of genes to select"
              value="10"
            ></v-text-field>
          </v-flex>
        </v-layout>
    </v-card>

    <h4 class="mt-4">Variant filters in candidate genes</h4>

    <v-card light >
        <v-layout row>
          <v-flex xs1>
            <v-text-field
              name="Allele freq"
              label="Allele freq"
              value="5"
              prefix="<"
              suffix="%"
            ></v-text-field>
          </v-flex>
        </v-layout>
    </v-card>

    <h4 class="mt-4">Variant filters in all genes</h4>
    <v-card light >
      <v-layout row>
        <v-flex xs1>
          <v-text-field
              name="Allele freq"
              label="Allele freq"
              value="1"
              prefix="<"
              suffix="%"
          ></v-text-field>
        </v-flex>
        <v-flex xs1 class="ml-3">
          <v-text-field
              name="Coverage"
              label="Coverage"
              value="15"
              prefix=">"
              suffix="X"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-card>

    <div class="text-xs-right">
      <v-btn  color="primary">
        Apply
      </v-btn>
    </div>


  </div>
</template>

<script>

export default {
  name: 'intro',
  components: {
  },
  props: {
    workflow: null,
    analysis: null,
    modelInfos: null
  },
  data() {
    return {
    };
  },
  computed: {

  }
}
</script>