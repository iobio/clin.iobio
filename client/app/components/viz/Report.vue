<style lang="sass"  >

@import ../../../assets/sass/variables

.impact_HIGH
  fill: #E0292B !important
  color: #E0292B !important
  font-weight: bold

.impact_MODERATE
  fill: #F49A73 !important
  color: #F49A73 !important
  font-weight: bold

.impact_MODIFIER
  fill: #f9e4b5
  color: #f9e4b5

.impact_LOW
  fill: rgba(181, 207, 107, 0.65)
  color: rgba(181, 207, 107, 0.65)

.impact_NOIMPACT, .impact_none, .effect_none
  fill: #FAF5BE
  stroke: #807D7D

</style>

<style lang="sass" scoped >

@import ../../../assets/sass/variables

.card
  min-height: 70px !important

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


.list--three-line
  padding-top: 5px
  .subheader
    height: initial
    font-size: 13px
    margin-left: -5px
    text-color: $text-color
    margin-top: 5px

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
    .has-called-variants
      font-size: 15px
      color: $called-variant-color
      margin-top: -3px
      margin-left: 2px



</style>

<template>
  <div id="intro-card" >

<!--
    <h4>Summary</h4>
    <v-card>
      <div class="mt-2 step-entry"  v-for="step in filteredSteps" :key="step.number">
        <span class="step-number stepper__step__step primary"> {{ step.number - 1 }}</span>
        <div class="step-description">{{ step.title }}</div>
      </div>
    </v-card>
-->

    <div style="height: 100%">
      <div style style="float:left;height:100%;width:30%">
        <h4 class="mt-4">Phenotypes</h4>
        <v-card >
          {{ project.phenotypes ? project.phenotypes.join(", ") : '' }}
        </v-card>
      </div>
      <div style="float: left;height:100%;width:30%;margin-left:30px">
        <h4 class="mt-4">Genes</h4>
        <v-card >
          {{ project.genes }}
        </v-card>
      </div>

      <div style="float: left;margin-left: 30px;height:100%;width:30%">
        <h4 class="mt-4">Variants</h4>
        <v-card>
          <v-list three-line>
            <template v-for="(variant, index) in project.variants">

              <v-list-tile
              :key="variant.start + ' ' + variant.ref + ' ' + variant.alt"
              avatar>


                <v-list-tile-avatar>
                 <v-chip class="variant-number">
                  {{ index + 1 }}
                 </v-chip>
                </v-list-tile-avatar>

                <v-list-tile-content>

                  <v-list-tile-title>


                    <div class="variant-symbols">

                      {{ variant.gene }}

                      <variant-icon
                       :icon="clinvar(variant)"
                       v-if="clinvar(variant) == 'clinvar_path' || clinvar(variant) == 'clinvar_lpath'"
                       class="clinvar-badge" height="12" width="12">
                      </variant-icon>

                      <variant-icon
                       :icon="variant.inheritance"
                       v-if="variant.inheritance"
                       class="inheritance-badge" height="15" width="15">
                      </variant-icon>

                      <variant-icon
                       icon="impact"
                       :type="variant.type.toLowerCase()"
                       :clazz="highestImpactClass(variant)"
                       class="impact-badge" height="15" width="15">
                      </variant-icon>

                     <variant-icon
                       v-if="variant.zygosity"
                       icon="variant.zygosity"
                       :type="variant.zygosity.toLowerCase()"
                       height="14" width="24">
                      </variant-icon>

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
                        <span class="vep-consequence">{{ variant.consequence }}</span>
                      </div>
                      <span class="af">{{ afDisplay(variant) }}</span>
                    </div>
                    <div class="variant-label">
                      <div style="display:inline-block;" >
                        <span class="hgvs">  {{ hgvsP(variant) }} </span>
                      </div>
                      <div style="display:inline-block;vertical-align:top">
                        <span class="rsid">{{ variant.rsId }}</span>
                      </div>
                    </div>
                  </v-list-tile-sub-title>

                </v-list-tile-content>

              </v-list-tile>

            </template>
          </v-list>
        </v-card>

      </div>
    </div>




  </div>
</template>

<script>

import VariantIcon from  '../partials/VariantIcon.vue'

export default {
  name: 'report',
  components: {
    VariantIcon
  },
  props: {
    project: null
  },
  data() {
    return {
    };
  },
  methods: {

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
  computed: {
    filteredSteps: function() {
      let self = this;
      if (self.project && self.project.workflow && self.project.workflow.steps) {
        return self.project.workflow.steps.filter(function(step) {
          return !step.isIntro && step.title != 'Report';
        })
      } else {
        return [];
      }
    }
  }
}
</script>