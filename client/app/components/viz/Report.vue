<style lang="sass"  >

@import ../../../assets/sass/variables


#clin-report-card
  display: flex
  flex-direction: column
  padding: 5px 20px 5px 20px
  background-color: $clin-panel-background-color
  min-height: 600px

  .findings
    display: flex
    flex-direction: row

    .col1
      display: flex
      flex-direction: column

    .col2
      display: flex
      flex-direction: column
      width: 500px


  h5
    font-size: 18px
    color:   $app-header-color

  h4
    font-size: 16px
    color:   $app-header-color

  .card
    min-height: 70px !important


  .genes-card, .phenotypes-card
    width: 300px

  .list
    padding-top: 0px

  .list__tile
    padding: 2px 0px 2px 0px
    height: 36px

    .list__tile__avatar
      min-width: 30px

      .avatar
        width: 24px !important
        height: 24px !important

      .badge
        background-color: $default-badge-color
        font-size: 11px
        width: 24px !important
        height: 24px !important
        padding: 3px 3px !important
        border-radius: 24px
        line-height: initial

  .phenotype-entry
    line-height: 18px
    font-size: 14px

  .gene-entry
    line-height: 18px
    font-size: 14px

  #clinvar-symbol
    display: inline-block
    vertical-align: top



  i.material-icons.sig
    color: $significant-color !important
    margin-right: 3px
  i.material-icons.unknown-sig
    color: $significant-color !important
    margin-right: 3px


  .variant-toolbar
    width: calc(100% - 1px)
    padding-right: 20px
    background-color: white
    margin-bottom: 20px


    #close-button
      padding-right: 0px
      position: absolute
      right: 0px
      display: inline-block
      margin-left: 0px
      min-width: 22px
      margin-top: 0px

      i.material-icons
        font-size: 22px

    .toolbar__title
      font-family: inherit
      font-size: 15px
      min-width: initial
      padding-right: 30px
      padding-top: 10px
      display: inline-block

    .toolbar-button
      min-width: 70px
      margin-right: 5px
      margin-left: 0px
      font-size: 13px
      height: 30px
      margin-top: -7px

      .btn__content
        padding: 0px

      i.material-icons
        font-size: 16px
        padding-right: 4px


  .filtered-variants-panel
    margin-top: 10px
    margin-left: 10px

  .user-flagged-variants-panel
    margin-top: 30px
    margin-left: 10px




  .subheader
    height: initial
    font-size: 15px
    padding-left: 5px

    span
      text-align: left;
      margin-left: -2px;
      padding-right: 3px

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
      padding-left: 3px
      padding-top: 10px
      align-items: flex-start


    .list__tile__sub-title
      height: initial
      line-height: 18px
      -webkit-line-clamp: initial

    .list__tile__title
      height: 22px
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

    .variant-notes
      font-size: 13px
      background-color:  $notes-background-color

    .variant-label
      font-size: 13px


      .coord
        display: inline-block
        width: 105px
        line-height: 12px
        vertical-align: top
      .hgvs
        display: inline-block
        width: 105px
        line-height: 12px
        vertical-align: top
      .vep-consequence
        display: inline-block
        width: 125px
        line-height: 12px
        vertical-align: top
      .rsid
        display: inline-block
        width: 125px
        line-height: 12px
        vertical-align: top

      .af
        display: inline-block
        width: 100px
        vertical-align: top
        line-height: 12px


    .variant-symbols
      .gene-name
        display: inline-block
        margin-top: -2px
        vertical-align: top
        width: 105px
        font-size: 13px
        font-weight: bold

      .transcript
        display: inline-block
        width: 125px
        margin-top: -2px
        vertical-align: top
        font-size: 13px

      .has-called-variants
        font-size: 15px
        color: $called-variant-color
        margin-top: -3px
        margin-left: 2px



</style>

<style lang="sass" scoped >

@import ../../../assets/sass/variables

.card
  min-height: 0px !important
  width: auto

.step-entry
  overflow: auto
  float: left
  display: inline-block
  width: 30%

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
  <div id="clin-report-card">

    <h5>Findings</h5>
    <div class="findings">


      <div class="mt-2 col1" >
        <v-card class="phenotypes-card" >
          <h4 >Phenotypes</h4>

          <v-list one-line>
            <template v-for="(phenotype, index) in phenotypeList">
              <v-list-tile avatar  v-bind:key="phenotype" @click="" >
                <v-list-tile-avatar>
                  <v-badge> {{ index + 1 }} </v-badge>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="phenotype"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>

        </v-card>

        <v-card   class="mt-2 genes-card">
          <h4 >Candidate genes</h4>

          <v-list one-line>
            <template v-for="(gene, index) in genes">
              <v-list-tile avatar  v-bind:key="gene" @click="" >
                <v-list-tile-avatar>
                  <v-badge> {{ index + 1 }} </v-badge>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="gene"></v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>



        </v-card >
      </div>

      <div class="mt-2 ml-4 col2" v-for="analysis in variantsByAnalysis" :key="analysis.key">
        <v-card>
          <h4 >{{ analysis.display + ' ' }}</h4>

          <div class="mt-1 mb-3" v-for="interpretation in analysis.interpretations" :key="interpretation.key">

            <v-subheader
            class="interpretation-list"
            >
              <v-icon :class="interpretation.key" v-if="interpretation.key == 'sig'">star</v-icon>
              <v-icon :class="interpretation.key" v-if="interpretation.key == 'unknown-sig'">star_half</v-icon>
              {{ interpretation.display }} {{ interpretation.organizedVariants.length == 0 ? ' (none)' : ''}}

            </v-subheader>



            <template v-for="geneList in interpretation.organizedVariants">
              <v-list three-line>
                <template
                 v-for="geneObject in geneList.genes">

                  <template v-for="(variant, index) in geneObject.variants">

                    <v-list-tile ripple
                    @click="onVariantSelected(variant)"
                    :key="variant.start + ' ' + variant.ref + ' ' + variant.alt">

                      <v-list-tile-avatar v-show="true">
                       <v-chip class="variant-number" >
                        {{ variant.index + 1 }}
                       </v-chip>
                      </v-list-tile-avatar>

                      <v-list-tile-content>

                        <v-list-tile-title>

                          <div class="variant-symbols">

                            <span class="gene-name"> {{ variant.gene }}</span>
                            <span class="transcript"> {{ variant.transcript }}</span>
                            <app-icon
                             icon="clinvar"
                             v-if="clinvar(variant) == 'clinvar_path' || clinvar(variant) == 'clinvar_lpath'"
                             :level="clinvar(variant) == 'clinvar_path' ? 'high' : 'likely-high'"
                             class="clinvar-badge" height="13" width="13">
                            </app-icon>

                            <app-icon
                             :icon="variant.inheritance"
                             v-if="variant.inheritance && variant.inheritance != '' && variant.inheritance != 'none'"
                             class="inheritance-badge" height="15" width="15">
                            </app-icon>

                            <app-icon
                             icon="impact"
                             :type="variant.type.toLowerCase()"
                             :clazz="highestImpactClass(variant)"
                             class="impact-badge" height="15" width="15">
                            </app-icon>

                           <app-icon
                             icon="zygosity"
                             :type="zygosity(variant).toLowerCase()"
                             height="14" width="24">
                            </app-icon>

                            <v-icon v-if="variant.fbCalled == 'Y'" class="has-called-variants">
                              check_circle
                            </v-icon>


                          </div>
                        </v-list-tile-title>

                        <v-list-tile-sub-title >
                          <div class="variant-label">
                            <div style="display:inline-block;" >
                              <span class="coord"> {{ variant.start + " " + variant.ref + "->" + variant.alt }} </span>
                            </div>
                            <div style="display:inline-block;vertical-align:top">
                              <span class="vep-consequence">{{ vepConsequence(variant) }}</span>
                            </div>
                            <span class="af">{{ afDisplay(variant) }}</span>
                          </div>
                          <div class="variant-label">
                            <div style="display:inline-block;" >
                              <span class="hgvs">  {{ hgvsP(variant) }} </span>
                            </div>
                            <div style="display:inline-block;vertical-align:top">
                              <span  class="rsid">{{ rsId(variant) }}</span>
                            </div>
                            <div style="display:inline-block;vertical-align:top">
                              <span  class="rsid">{{ revel(variant) }}</span>
                            </div>
                          </div>
                          <div class="variant-notes" v-if="variant.notes && variant.notes.length > 0">
                            {{ variant.notes }}
                          </div>
                        </v-list-tile-sub-title>

                      </v-list-tile-content>

                    </v-list-tile>


                  </template>

                </template>
              </v-list>
            </template>

          </div>


        </v-card>

      </div>


    </div>

  </div>
</template>

<script>

import AppIcon from  '../partials/AppIcon.vue'
import FilterIcon from  '../partials/FilterIcon.vue'

export default {
  name: 'report',
  components: {
    AppIcon,
    FilterIcon
  },
  props: {
    phenotypes: null,
    genes: null,
    variants: null,
    variantsFullAnalysis: null,
    filters: null

  },
  data() {
    return {
      variantsByAnalysis: null
    };
  },
  computed: {
    phenotypeList: function() {
      let self = this;
      let phenotypeList = [];

      if (self.phenotypes) {
        self.phenotypes.forEach(function(phenotypeArray) {
          phenotypeArray.forEach(function(phenotype) {
            phenotypeList.push(phenotype);
          })
        })
      }

      return phenotypeList;
    }
  },
  methods: {

    organizeVariantsByAnalysis: function() {
      let self = this;
      self.variantsByAnalysis = [
        { key: 'gene',         display: 'Variants in candidate genes', interpretations: null},
        { key: 'genefull',     display: 'Variants in all genes',       interpretations: null}
      ]
      self.variantsByAnalysis.forEach(function(analysis) {
        analysis.interpretations = self.organizeVariantsByInterpretation(analysis.key);
      })
    },

    organizeVariantsByInterpretation: function(analysisKey) {
      let self = this;
      let variantsByInterpretation = [
       { key: 'sig',         display: 'Significant',          organizedVariants: null},
       { key: 'unknown-sig', display: 'Unknown Significance', organizedVariants: null}
      ];
      variantsByInterpretation.forEach(function(interpretation) {
        interpretation.organizedVariants = self.organizeVariantsByFilter(analysisKey, interpretation.key);
      })
      return variantsByInterpretation;
    },
    organizeVariantsByFilter: function(analysisKey, interpretation) {
      let self = this;
      let filterList = [];

      for (var filterName in self.filters) {
        let filterObject = self.filters[filterName];
        var sortedGenes = self.organizeVariantsByGene(filterName, filterObject.userFlagged, analysisKey, interpretation);
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


    organizeVariantsByGene: function(filterName, userFlagged, analysisKey, interpretation) {
      let self = this;
      let theVariants = [];
      if (analysisKey == 'gene' && this.variants) {
        theVariants = this.variants.filter(function(v) {
          return v.interpretation == interpretation;
        });
      }
      if (analysisKey == 'genefull' && this.variantsFullAnalysis) {
        theVariants = this.variantsFullAnalysis.filter(function(v) {
          return v.interpretation == interpretation;
        });
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
      this.organizeVariantsByAnalysis();
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
    rsId: function(variant) {
      return variant.rsId;
    },
    vepConsequence: function(variant) {
      return variant.consequence;
    },
    hgvsP: function(variant) {
      return this.formatHgvsP(variant, variant.HGVSp);

    },
    revel: function(variant) {
      return variant.REVEL && variant.REVEL.length > 0 ?  "REVEL " + variant.REVEL : "";
    },
    highestImpactClass: function(variant) {
      let clazz = "filter-symbol";
      clazz += " impact_" + (variant.impact && variant.impact.length > 0 ? variant.impact.toUpperCase() : "none");
      return clazz;
    },
    afDisplay: function(variant) {
      var label = this.isBasicMode ? "freq " : "af ";
      return  label +  this.percentage(variant.afgnomAD ? variant.afgnomAD : 0);
    },
    zygosity: function(variant) {
      return variant.zygosityProband.toUpperCase();
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
  watch: {
    variants: function() {
      this.organizeVariantsByAnalysis();
    },
    variantsFullAnalysis: function() {
      this.organizeVariantsByAnalysis();
    }
  },
}
</script>