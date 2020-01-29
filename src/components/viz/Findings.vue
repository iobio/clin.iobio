<style lang="sass"  >

@import ../../assets/sass/variables

#findings-panel
  padding: 15px 20px 5px 20px
  overflow-y: auto
  height: -webkit-fill-available
  height: -moz-available
  background-color:  white

  .card-title
    font-size: 18px
    margin-bottom: 20px
    display: inline-block


  .findings-section
    margin-bottom: 40px

    .interpretation-list
      margin-bottom: 10px


</style>

<template>

  <div id="findings-panel" >


      <div class="findings-section" v-for="interpretation in variantsByInterpretation" :key="interpretation.key" >


        <div v-if="interpretation.organizedVariants && interpretation.organizedVariants.length > 0"
        class="interpretation-list"
        >

          <variant-interpretation-badge
           :interpretation="interpretation.key"
           :interpretationMap="interpretationMap">
          </variant-interpretation-badge>

        </div>



        <template v-for="geneList in interpretation.organizedVariants">

          <template
           v-for="geneObject in geneList.genes">

            <template v-for="(variant, index) in geneObject.variants">
              <div>
                <variant-inspect-card
                 :modelInfos="modelInfos"
                 :genomeBuildHelper="genomeBuildHelper"
                 :selectedVariant="variant"
                 :selectedGene="variant.variantInspect.geneObject"
                 :selectedTranscript="variant.variantInspect.transcriptObject"
                 :info="variant.variantInspect.infoObject"
                 :genePhenotypeHits="variant.variantInspect.genePhenotypeHits"
                >

                </variant-inspect-card>
              </div>
            </template>
          </template>


        </template>


      </div>



  </div>
</template>

<script>


import AppIcon       from '../partials/AppIcon.vue';
import VariantInspectCard   from '../viz/findings/VariantInspectCard.vue';
import VariantInterpretationBadge from '../partials/findings/VariantInterpretationBadge.vue';

export default {
  name: 'findings',
  components: {
    AppIcon,
    VariantInspectCard,
    VariantInterpretationBadge
  },
  props: {
    modelInfos:  null,
    genomeBuildHelper: null,
    variantsByInterpretation: null,
    interpretationMap: null
  },
  data() {
    return {

    }

  },
  methods: {
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
  },
  computed: {

  },
  watch: {
  },
}
</script>
