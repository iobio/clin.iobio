<style lang="sass"  >

@import ../../../assets/sass/variables


#clin-report-card
  padding: 0 10px 0 10px
  display: flex
  flex-direction: row

  #clinvar-symbol
    display: inline-block
    vertical-align: top


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
      color:  $text-color

    .toolbar-button
      min-width: 70px
      color: $text-color
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



  .gene-list

  .subheader
    color: $text-color
    height: initial
    font-size: 15px

    span
      text-align: left;
      margin-left: -2px;
      padding-right: 3px

  .list--three-line
    margin-bottom: 35px
    padding-top: 0px
    .subheader
      height: initial
      font-size: 13px
      margin-left: -3px
      text-color: $text-color
      margin-top: 5px

    li
      margin-left: 10px


    .list__tile__avatar
      margin-left: 15px

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

    .list__tile__avatar
      min-width: initial

    .list__tile__sub-title
      height: initial
      line-height: 18px

    .list__tile__title
      height: 22px
      line-height: 22px

    .variant-number
      margin-right: 4px
      margin-left: 0px
      display: inline-block
      vertical-align: top
      margin-bottom: 0px
      margin-top: -2px

      .chip__content
        width: 24px !important
        height: 24px !important
        justify-content: space-around
        padding: 0px
        font-size: 11px

    .variant-label
      font-size: 12px
      color: $text-color !important


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
        width: 105px
        line-height: 12px
        vertical-align: top
      .rsid
        display: inline-block
        width: 105px
        line-height: 12px
        vertical-align: top

      .af
        display: inline-block
        width: 60px
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



      <div class="mr-4" style="max-width:400px">
        <div class="mb-4" >
          <h4 >Phenotypes</h4>
          <v-card >
            {{ phenotypes ? phenotypes.join(", ") : '' }}
          </v-card>
        </div>
        <div class="mr-4" >
          <h4 >Genes</h4>
          <v-card style="word-break: break-word;" >
            {{ genes ? genes.join(" ")  : '' }}
          </v-card>
        </div>
      </div>

      <div >
        <h4 >Variants</h4>
        <v-card>

          <template v-for="geneList in organizedVariants">
            <v-subheader
            :key="geneList.key"
            class="gene-list"
            >
                <filter-icon :icon="geneList.key"></filter-icon>
                {{ geneList.filter.title }}

            </v-subheader>
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
                          <app-icon
                           icon="clinvar"
                           v-if="clinvar(variant) == 'clinvar_path' || clinvar(variant) == 'clinvar_lpath'"
                           :level="clinvar(variant) == 'clinvar_path' ? 'high' : 'likely-high'"
                           class="clinvar-badge" height="13" width="13">
                          </app-icon>

                          <app-icon
                           :icon="variant.inheritance"
                           v-if="variant.inheritance && variant.inhertance != '' && variant.inheritance != 'none'"
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
                        </div>
                      </v-list-tile-sub-title>

                    </v-list-tile-content>

                  </v-list-tile>


                </template>

              </template>
            </v-list>
          </template>

        </v-card>

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
    filters: null

  },
  data() {
    return {
      organizedVariants: null
    };
  },
  methods: {
    organizeVariantsByFilter: function() {
      let self = this;
      let filterList = [];


      for (var filterName in self.filters) {
        let filterObject = self.filters[filterName];
        var sortedGenes = self.organizeVariantsByGene(filterName, filterObject.userFlagged);
        if (sortedGenes.length > 0) {
          filterList.push({key: filterName, filter: filterObject, genes: sortedGenes});
        }
      }

      self.organizedVariants = filterList.sort(function(filterObject1, filterObject2) {
        return filterObject1.filter.order > filterObject2.filter.order;
      })

      var variantIndex = 0;
      self.organizedVariants.forEach(function(filterObject) {
        filterObject.genes.forEach(function(geneList) {
          geneList.variants.forEach(function(variant) {
            variant.index = variantIndex++;
          })
        })
      })
    },


    organizeVariantsByGene: function(filterName, userFlagged) {
      let self = this;
      if (this.variants) {
        let theGenes   = [];
        this.variants.forEach(function(variant) {
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


    clinvar: function(variant) {
      if (variant.isProxy) {
        if (variant.clinvarClinSig == "pathogenic") {
          return "clinvar_path";
        } else if (variant.clinvarClinSig == "likely pathogenic") {
          return "clinvar_lpath";
        } else {
          return "";
        }
      } else {
        return variant.clinvar;
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
    highestImpactClass: function(variant) {
      let clazz = "filter-symbol";
      clazz += " impact_" + variant.impact.toUpperCase();
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
      this.organizeVariantsByFilter();
    }
  },
}
</script>