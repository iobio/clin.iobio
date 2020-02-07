<style lang="sass"  >

@import ../../../assets/sass/variables

#findings-panel
  padding: 5px 20px 5px 20px
  overflow-y: auto
  height: -webkit-fill-available
  height: -moz-available
  background-color:  white

  .avatar.big
    border: #d5d5d5 solid thin
    background-color: white
    color: $text-color
    margin-right: 7px

  .phenotype-search-terms
    margin-top: -15px
    margin-left: 50px

  .phenotype-search-term
    font-size: 13px
    line-height: 15px
    white-space: normal
    font-style: italic



  .sample
    line-height: 15px
    font-size: 13px
    .rel
      display: inline-block
      width: 70px
    .name
      display: inline-block
      width: 100px

  .findings-section
    margin-bottom: 30px
    padding-bottom: 15px

    .subsection
      margin-right: 50px

  .pedigree-graph
    margin-left: -5px !important
    margin-top:  5px !important
    svg
      g

        rect
          stroke: gray !important

  .card-title
    font-size: 18px
    color:   $app-header-color
    margin-bottom: 20px
    display: inline-block

  .card-heading
    display: inline-block
    font-size: 16px
    color:  $app-header-color
    margin-bottom: 10px

  .card-subheading
    display: inline-block
    font-size: 14px
    color:  $app-header-color
    margin-bottom: 10px


  .card-metric
    display: flex
    margin-right: 10px

    .avatar
      margin-right: 7px

    .card-heading-metric
      display: inline-block
      font-size: 14px
      color:  $app-header-color
      width: 90px
      white-space: normal
      line-height: 15px
      align-self: center


  .sig
    i.material-icons
      color: $sig-color !important
      margin-right: 3px
  .unknown-sig
    i.material-icons
      color: $unknown-sig-color !important
      margin-right: 3px

  .card
    min-height: 70px !important

  .list--three-line
    padding-right: 10px

    padding-top: 0px
    .subheader
      height: initial
      font-size: 13px
      margin-left: -3px
      margin-top: 5px

    li
      margin-left: 10px


    .list__tile__avatar
      margin-left: 5px
      margin-right: 5px

      .avatar
        align-items: flex-end

    .list__tile__content

    hr
      margin-bottom: 4px
      margin-top: 4px

    .divider--inset
      margin-left: 22px
      width: calc(100% - 42px)

    .list__tile
      padding: 0px
      height: initial
      padding-left: 13px
      padding-top: 10px
      align-items: flex-start


    .list__tile__sub-title
      height: initial
      line-height: 18px
      -webkit-line-clamp: initial

    .list__tile__title
      height: unset
      line-height: 22px

    .variant-number
      margin-right: 4px
      margin-left: 0px
      display: inline-block
      vertical-align: top
      margin-bottom: 0px
      margin-top: 35px
      border: none

      .chip__content
        width: 24px !important
        height: 24px !important
        justify-content: space-around
        padding: 0px
        font-size: 11px
        background-color: white
        color: $text-color
        border: #d5d5d5 solid thin


    .gene-name
      display: inline-block
      vertical-align: top
      width: 105px
      font-size: 13px
      line-height: 15px
      white-space: normal


    .hgvs
      display: inline-block
      width: 140px
      vertical-align: top
      line-height: 15px
      white-space: normal
      word-break: break-all
      margin-right: 5px

    .vep-consequence
      display: inline-block
      width: 120px
      vertical-align: top
      line-height: 15px
      white-space: normal
      padding-right: 5px

    .inheritance
      display: inline-block
      width: 120px
      vertical-align: top
      font-size: 13px
      line-height: 15px
      white-space: normal
      margin-right: 5px

    .clinvar
      display: inline-block
      width: 100px
      vertical-align: top
      font-size: 13px
      line-height: 15px
      white-space: normal
      margin-right: 5px

    .clinvar-trait
      display: inline-block
      width: 220px
      vertical-align: top
      font-size: 13px
      word-break: break-word
      white-space: normal
      line-height: 15px
      margin-right: 5px

    .variant-notes
      display: inline-block
      width: calc(100% - 870px);
      vertical-align: top
      font-size: 13px
      word-break: break-word
      white-space: normal
      line-height: 15px
      font-style: italic

</style>

<template>

  <div id="findings-panel" >



      <span class="card-title">
        Review results
      </span>

      <div style="display:flex;flex-flow:row">

        <v-card v-show="false && genes && genes.length > 0" class="findings-section" style="margin-left:10px;max-width:480px">

            <span class="card-heading">Analysis Summary</span>

            <div style="display: flex">
              <div class="card-metric">
                <v-avatar class="big">
                  <span class="headline">{{ genes.length }}</span>
                </v-avatar>
                <div class="card-heading-metric">candidate genes</div>
              </div>

              <div class="card-metric">
                <v-avatar class="big">
                  <span class="headline">{{ variantsCandidateGenes ? variantsCandidateGenes.length : 0 }}</span>
                </v-avatar>
                <div class="card-heading-metric">filtered variants in candidate genes</div>
              </div>

              <div class="card-metric">
                <v-avatar class="big">
                  <span class="headline">{{ variantsFullAnalysis ? variantsFullAnalysis.length  : 0 }}</span>
                </v-avatar>
                <div class="card-heading-metric">filtered variants in all genes</div>
              </div>

            </div>
        </v-card>
      </div>


      <v-card v-show="genes && genes.length > 0" class="findings-section" v-for="interpretation in variantsByInterpretation" :key="interpretation.key" >


        <div
        class="interpretation-list"
        >

          <app-icon
            :class="interpretation.key"
            :icon="interpretation.key" height="22" width="22">
          </app-icon>
          <span class="card-heading">
            {{ interpretation.display }}
          </span>

        </div>



        <template v-for="geneList in interpretation.organizedVariants">
          <v-list three-line>
            <template
             v-for="geneObject in geneList.genes">

              <div v-for="(variant, index) in geneObject.variants">

                <v-list-tile ripple
                @click="onVariantSelected(variant)"
                :key="variant.start + ' ' + variant.ref + ' ' + variant.alt">

                  <v-list-tile-content>

                    <v-list-tile-title>

                      <div class="variant-symbols">

                        <span class="gene-name"> {{ variant.gene }}</span>


                        <span class="inheritance">
                           <app-icon
                           :icon="variant.inheritance"
                           v-if="variant.inheritance && variant.inheritance != '' && variant.inheritance != 'none'"
                           class="inheritance-badge" height="15" width="15">
                          </app-icon>

                          {{ variant.inheritance }}
                        </span>


                        <span class="vep-consequence">{{ vepConsequence(variant) }}</span>
                        <span class="hgvs">  {{ hgvsP(variant) }} </span>

                        <span class="clinvar">
                          <app-icon
                           icon="clinvar"
                           v-if="clinvar(variant) == 'clinvar_path' || clinvar(variant) == 'clinvar_lpath'"
                           :level="clinvar(variant) == 'clinvar_path' ? 'high' : 'likely-high'"
                           class="clinvar-badge" height="13" width="13">
                          </app-icon>
                          {{ variant.clinvarClinSig }}
                        </span>

                        <span class="clinvar-trait"> {{ variant.clinvarTrait }} </span>


                        <div class="variant-notes" v-if="variant.notes && variant.notes.length > 0">
                          {{ variant.notes }}
                        </div>

                      </div>

                    </v-list-tile-title>

                    <v-list-tile-sub-title >
                    </v-list-tile-sub-title>

                  </v-list-tile-content>

                </v-list-tile>

              </div>

            </template>
          </v-list>
        </template>


      </v-card>



  </div>
</template>

<script>

import PedigreeGraph from '../viz/PedigreeGraph.vue';
import AppIcon       from '../partials/AppIcon.vue';

export default {
  name: 'findings',
  components: {
    PedigreeGraph,
    AppIcon
  },
  props: {
    workflow:    null,
    analysis:    null,
    caseSummary: null,
    modelInfos:  null,
    pedigree:    null,
    sampleId:    null,
    phenotypes:  null,
    genes:       null,
    variants:    null,
    filters:     null,
    variantsByInterpretation: null
  },
  data() {
    return {

    }

  },
  methods: {
    mappedReadsPercent: function(sample) {
      if (sample) {
        return this.percentage(sample.metrics.mapped_reads / sample.metrics.total_reads);
      } else {
        return "";
      }
    },
    duplicatesPercent: function(sample) {
      if (sample) {
        return this.percentage(sample.metrics.duplicates / sample.metrics.total_reads);
      } else {
        return "";
      }
    },

    onVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", variant);
    },
    refreshReport: function() {

    },

    clinvar: function(variant) {
      if (variant.clinvarClinSig == "pathogenic") {
        return "clinvar_path";
      } else if (variant.clinvarClinSig == "likely pathogenic") {
        return "clinvar_lpath";
      } else {
        return "";
      }
    },
    vepConsequence: function(variant) {
      return variant.consequence;
    },
    hgvsP: function(variant) {
      return this.formatHgvsP(variant, variant.HGVSp);

    },
    formatHgvsP: function(variant, value) {
      let self = this;
      if (value == null || value == '' || Object.keys(value).length == 0) {
        return "";
      } else {
        var buf = "";
        var tokens = value.split(":p.");
        if (buf.length > 0) {
          buf += " ";
        }
        if (tokens.length == 2) {
          var basicNotation = "p." + tokens[1];
          buf += basicNotation;
        } else if (tokens.length == 1 && self.endsWith(tokens[0],"(p.=)")) {
          // If synoymous variants, show p.(=) in cell
          if (variant.consequence == "synonymous_variant") {
                buf += "p.(=)";
          }
        }
        return buf;
      }
    },
    endsWith: function(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },
    percentage: function(a, showSign=true) {
      let self = this;
      var pct = a * 100;
      var places = 0;
      if (pct < .001) {
        places = 4;
      } else if (pct < .01) {
        places = 3;
      } else if (pct < .1) {
        places = 2
      } else if (pct < 1) {
        places = 1;
      } else {
        places = 0;
      }
      return self.round(pct, places) + (showSign ? "%" : "");
    },

    round: function(value, places) {
      return +(Math.round(value + "e+" + places)  + "e-" + places);
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
    },
    phenotypeList: function() {
      let self = this;
      let phenotypeList = [];

      if (self.phenotypes) {
        self.phenotypes.forEach(function(phenotypeArray) {
          if (phenotypeArray) {
            phenotypeArray.forEach(function(phenotype) {
              phenotypeList.push(phenotype);
            })
          }
        })
      }

      return phenotypeList;
    },
    variantsCandidateGenes: function() {
      let self = this;
      if (self.variants) {
        return self.variants.filter(function(variant) {
          return self.genes.indexOf(variant.gene) >= 0;
        })
      }
    },
    variantsFullAnalysis: function() {
      let self = this;
      if (self.variants) {
        return self.variants.filter(function(variant) {
          return self.genes.indexOf(variant.gene) == -1;
        })
      }
    }

  },
  watch: {
  },
}
</script>