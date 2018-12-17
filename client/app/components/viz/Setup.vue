<style lang="sass"  >

@import ../../../assets/sass/variables

#setup-panel
  padding: 5px 20px 5px 20px
  background-color: $panel-background-color

  .pedigree-graph
    svg
      g
        transform: translate(85px,0)

  .card-title
    font-size: 18px
    color:   $app-header-color
    margin-bottom: 20px
    display: inline-block

  .card-heading
    display: inline-block
    font-size: 14px
    color:  $app-header-color
    margin-bottom: 2px

  h4
    font-size: 16px
    color:   $app-header-color


  h5
    margin-bottom: 5px
    margin-top: 5px

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
      color: $text-color

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
      <span class="card-title">Overview</span>
      <span style="float:right">
        <v-btn v-if="false" color="primary">
          Apply
        </v-btn>
      </span>
    </div>

    <div style="display:flex;flex-direction:row;justify-content:center">
      <div>
      <span class="card-heading">Pedigree</span>
        <v-card  v-if="pedigree" style="max-width:200px;max-height:200px;text-align:center">
          <pedigree-graph
            :height="170"
            :data="pedigree"
            :uuid="sampleId"
            :highlighted="highlighted"
            :highlighted.sync="highlighted"
            :width="200"
          />
        </v-card>
      </div>
      <div style="margin-left: 40px;display:flex;flex-direction:column">

        <div v-for="sample in pedigree" :key="sample.id" style="margin-bottom:20px">
          <span class="card-heading">{{ globalApp.utility.capitalizeFirstLetter(sample.relationship) }} {{ sample.name }} ({{ sample.metrics.affected_status}})
          </span>
          <v-card style="min-width:330px">
            <v-layout row>
              <v-flex xs10>
                Median Read Coverage
              </v-flex>
              <v-flex xs2>
                {{ sample.metrics.median_read_coverage }}X
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs10>
                Mapped Reads
              </v-flex>
              <v-flex xs2>
                {{ mappedReadsPercent(sample) }}
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs10>
                Proper Pairs
              </v-flex>
              <v-flex xs2>
                {{ sample.metrics.proper_pairs }}%
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs10>
                Duplicates
              </v-flex>
              <v-flex xs2>
                {{ duplicatesPercent(sample) }}
              </v-flex>
            </v-layout>
          </v-card>
        </div>
      </div>
      <div  style="max-width:520px;max-height:500px;margin-left: 40px">
        <span class="card-heading">Coverage</span>
        <v-card class="box-and-whisker-viz">
          <box-and-whisker-viz
           :data="pedigreeCoverageQuartiles"
           width="500">
          </box-and-whisker-viz>
        </v-card>
      </div>
    </div>



    <v-card light v-if="false" class="mt-4">
      <h4 >Overview</h4>
      <div class="model-info-panel">
        <div  v-for="modelInfo in modelInfos" :key="modelInfo.sample" style="margin-bottom: 15px">
          <h5>{{ modelInfo.relationship}}  {{ modelInfo.sample }}</h5>
          <div class="file-info" >{{ modelInfo.vcf }}</div>
          <div class="file-info">{{ modelInfo.bam }}</div>
        </div>
      </div>
    </v-card>



    <v-card v-if="false" class="mt-2" light>
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


    <v-card v-if="false" class="mt-2" light >
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

    <v-card v-if="false" light class="mt-2">
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

import PedigreeGraph from '../viz/PedigreeGraph.vue';
import BoxAndWhiskerViz from '../viz/BoxAndWhiskerViz.vue';

export default {
  name: 'intro',
  components: {
    PedigreeGraph,
    BoxAndWhiskerViz
  },
  props: {
    workflow:   null,
    analysis:   null,
    modelInfos: null,
    pedigree:   null,
    sampleId:   null
  },
  data() {
    return {
      highlighted: null,
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
  methods: {
    mappedReadsPercent: function(sample) {
      return this.globalApp.utility.percentage(sample.metrics.mapped_reads / sample.metrics.total_reads);
    },
    duplicatesPercent: function(sample) {
      return this.globalApp.utility.percentage(sample.metrics.duplicates / sample.metrics.total_reads);
    }
  },
  computed: {
    pedigreeCoverageQuartiles: function() {
      let self = this;
      let coverageQuartiles = [];
      if (self.pedigree) {
        self.pedigree.forEach(function(sample) {
          let quartile = {};
          quartile.label = sample.relationship;
          quartile.quartiles = sample.distributions.coverage_hist.quartiles;
          quartile.whiskers = sample.distributions.coverage_hist.whiskers;
          coverageQuartiles.push(quartile);
        })
      }
      return coverageQuartiles;
    }

  }
}
</script>