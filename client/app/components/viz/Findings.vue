<style lang="sass"  >

@import ../../../assets/sass/variables

#findings-panel
  padding: 5px 20px 5px 20px
  overflow-y: auto
  height: -webkit-fill-available
  height: -moz-available
  height: 100%
  background-color: white

  .avatar.big
    border: #d5d5d5 solid thin
    background-color: white
    color: $text-color

  .phenotype-search-terms
    margin-top: -15px
    margin-left: 50px

  .phenotype-search-term
    font-size: 13px
    line-height: 15px
    white-space: normal
    font-style: italic

  .findings-section
    margin-bottom: 30px

  .pedigree-graph
    svg
      g
        transform: translate(85px,-35px)

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



  i.material-icons.sig
    color: $significant-color !important
    margin-right: 3px
  i.material-icons.unknown-sig
    color: $significant-color !important
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



      <span class="card-title">Findings</span>

      <div class="findings-section">

        <div style="display:flex;flex-direction:row">
          <div  v-if="pedigree" style="margin-top:-10px;margin-left:-20px;max-width:200px;max-height:140px;text-align:left">
            <pedigree-graph
              :height="140"
              :data="pedigree"
              :uuid="sampleId"
              :width="200"
            />
          </div>
          <div>
            <span class="card-heading"> {{ caseSummary.name }}</span>

            <div style="font-size:13px;line-height:15px;width:400px;white-space: normal">
              {{ caseSummary.phenotypes }}
            </div>
         </div>
          <div >
            <v-avatar class="big">
              <span class="headline">{{ genes.length }}</span>
            </v-avatar>
            <div class="card-heading">candidate genes</div>
            <div class="phenotype-search-terms">
              <div v-for="(phenotype, index) in phenotypeList" class="phenotype-search-term">
                {{phenotype}}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="findings-section" >

          <div class="mt-1 mb-3" v-for="interpretation in variantsByInterpretation" :key="interpretation.key">

            <div
            class="interpretation-list"
            >
             <v-avatar class="big">
              <span class="headline">{{ interpretation.variantCount }}</span>
            </v-avatar>
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


                            <span class="hgvs">  {{ hgvsP(variant) }} </span>


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

          </div>
      </div>


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
    variantsFullAnalysis: null,
    filters:     null
  },
  data() {
    return {
      variantsByInterpretation: [
       { key: 'sig',         display: 'Significant Variants',             organizedVariants: []},
       { key: 'unknown-sig', display: 'Variants of Unknown Significance', organizedVariants: []}
      ]
    };
  },
  methods: {
    mappedReadsPercent: function(sample) {
      return this.globalApp.utility.percentage(sample.metrics.mapped_reads / sample.metrics.total_reads);
    },
    duplicatesPercent: function(sample) {
      return this.globalApp.utility.percentage(sample.metrics.duplicates / sample.metrics.total_reads);
    },
    organizeVariantsByInterpretation: function() {
      let self = this;

      self.variantsByInterpretation.forEach(function(interpretation) {
        interpretation.organizedVariants = self.organizeVariantsByFilter(interpretation.key);
        interpretation.variantCount      = self.getVariantCount(interpretation.organizedVariants);
      })
    },
    organizeVariantsByFilter: function(interpretation) {
      let self = this;
      let filterList = [];

      for (var filterName in self.filters) {
        let filterObject = self.filters[filterName];
        var sortedGenes = self.organizeVariantsByGene(filterName, filterObject.userFlagged, interpretation);
        if (sortedGenes.length > 0) {
          filterList.push({key: filterName, filter: filterObject, genes: sortedGenes});
        }
      }

      let organizedVariants = filterList.sort(function(filterObject1, filterObject2) {
        return filterObject1.filter.order > filterObject2.filter.order;
      })

      var variantIndex = 0;
      organizedVariants.forEach(function(filterObject) {
        filterObject.genes.forEach(function(geneList) {
          geneList.variants.forEach(function(variant) {
            variant.index = variantIndex++;
          })
        })
      })

      return organizedVariants;
    },


    organizeVariantsByGene: function(filterName, userFlagged, interpretation) {
      let self = this;
      let theVariants = [];


      this.variants.forEach(function(variant) {
        if (variant.interpretation == interpretation) {
          theVariants.push(variant);
          variant.candidateGene = true;
        }
      })
      if (this.variantsFullAnalysis) {
        this.variantsFullAnalysis.forEach(function(variant) {
          if (variant.interpretation == interpretation) {
            theVariants.push(variant);
            variant.candidateGene = true;
          }
        })
      }
      if (theVariants.length > 0) {
        let theGenes   = [];
        theVariants.forEach(function(variant) {
          if ((userFlagged && variant.isUserFlagged) ||
            (filterName && variant.filtersPassed && variant.filtersPassed.indexOf(filterName) >= 0)) {

            let theGene = null;
            var idx = theGenes.indexOf(variant.gene);
            if (idx >= 0) {
              theGene = theGenes[idx];
            } else {
              theGene = {};
              theGene.gene = variant.gene;
              theGene.variants = [];
              theGenes.push(theGene);
            }
            theGene.variants.push(variant);

          }
        })
        return theGenes;
      } else {
        return [];
      }
    },
    onVariantSelected: function(variant) {
      this.$emit("flagged-variant-selected", variant);
    },
    refreshReport: function() {
      this.organizeVariantsByInterpretation();
    },
    getVariantCount: function(organizedVariants) {
      let self = this;
      let count = 0;
      if (organizedVariants) {
        organizedVariants.forEach(function(geneList) {
          geneList.genes.forEach(function(gene) {
            count += gene.variants.length;
          })
        })
      }

      return count;
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
    endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
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
    }
  },
  watch: {
    variants: function() {
      this.organizeVariantsByInterpretation();
    },
    variantsFullAnalysis: function() {
      this.organizeVariantsByInterpretation();
    }
  },
}
</script>