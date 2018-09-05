<style lang="sass"  >

@import ../../../assets/sass/variables

#setup-panel
  padding: 5px 20px 5px 20px
  background-color: $clin-panel-background-color

  h5
    font-size: 18px
    color:   $app-header-color

  h4
    font-size: 16px
    color:   $app-header-color

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
      color: $app-header-color

  .row
    margin-left: 10px
    margin-right: 10px

  .input-group--select
    .input-group__selections__comma
      font-size: 13px
      line-height: 15px

</style>

<template>
  <div id="setup-panel" >



    <div style="text-xs-center" >
      <h5>Setup</h5>
      <span style="float:right">
        <v-btn color="primary">
          Apply
        </v-btn>
      </span>
    </div>

    <v-card light class="mt-4">
      <h4 >Samples</h4>
      <div class="model-info-panel">
        <div  v-for="modelInfo in modelInfos" :key="modelInfo.sample">
          <h5>{{ modelInfo.relationship}}  {{ modelInfo.sample }}</h5>
          <div class="file-info" >{{ modelInfo.vcf }}</div>
          <div class="file-info">{{ modelInfo.bam }}</div>
        </div>
      </div>
    </v-card>



    <v-card class="mt-2" light>
      <h4>Candidate genes</h4>
        <v-layout row>
          <v-flex xs3>
            <v-text-field
              name="Max size of candidate gene list"
              label="Max size of candidate gene list"
              value="50"
            ></v-text-field>
          </v-flex>
        </v-layout>
    </v-card>


    <v-card class="mt-2" light >
        <h4 >Variant filters in candidate genes</h4>
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
          <v-flex xs1 class="ml-4">
            <v-text-field
              name="Coverage"
              label="Coverage"
              value="10"
              prefix=">"
              suffix="X"
            ></v-text-field>
          </v-flex>
          <v-flex xs3 class="ml-4">
            <v-select
                label="Clinvar"
                v-bind:items="clinvar"
                v-model="clinvarSelectedCandidateGenes"
                multiple
                persistent-hint
              ></v-select>
          </v-flex>
          <v-flex xs3 class="ml-4">
            <v-select
                label="Inheritance modes"
                v-bind:items="inheritanceModes"
                v-model="inheritanceModesSelectedCandidateGenes"
                multiple
                persistent-hint
              ></v-select>
          </v-flex>
          <v-flex xs3 class="ml-4">
            <v-select
                label="VEP impact"
                v-bind:items="impacts"
                v-model="impactsSelectedCandidateGenes"
                multiple
                persistent-hint
              ></v-select>
          </v-flex>
        </v-layout>
    </v-card>

    <v-card light class="mt-2">
    <h4 >Variant filters in all genes</h4>
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
        <v-flex xs1 class="ml-4">
          <v-text-field
              name="Coverage"
              label="Coverage"
              value="15"
              prefix=">"
              suffix="X"
          ></v-text-field>
         </v-flex>
         <v-flex xs3 class="ml-4">
            <v-select
                label="Clinvar"
                v-bind:items="clinvar"
                v-model="clinvarSelected"
                multiple
                persistent-hint
              ></v-select>
          </v-flex>
          <v-flex xs3 class="ml-4">
          <v-select
              label="Inheritance modes"
              v-bind:items="inheritanceModes"
              v-model="inheritanceModesSelected"
              multiple
              persistent-hint
            ></v-select>
        </v-flex>
        <v-flex xs3 class="ml-4">
          <v-select
              label="VEP impact"
              v-bind:items="impacts"
              v-model="impactsSelected"
              multiple
              persistent-hint
            ></v-select>
        </v-flex>
      </v-layout>
    </v-card>



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
      inheritanceModes: ["De novo", "Recessive", "Compound het", "Autosomal dominant", "X-linked"],
      inheritanceModesSelected: ["De novo", "Recessive", "Compound het", "Autosomal dominant", "X-linked"],
      inheritanceModesSelectedCandidateGenes: ["De novo", "Recessive", "Compound het", "Autosomal dominant", "X-linked"],

      impacts: ["High", "Moderate", "Modifier", "Low"],
      impactsSelected: ["High"],
      impactsSelectedCandidateGenes: ["High", "Moderate"],

      clinvar: ["Pathogenic", "Likely pathogenic", "Uncertain signficance", "Conflicting data", "Unknown", "Benign", "Likely benign"],
      clinvarSelected: ["Pathogenic", "Likely pathogenic"],
      clinvarSelectedCandidateGenes: ["Pathogenic", "Likely pathogenic"]

    };
  },
  computed: {

  }
}
</script>