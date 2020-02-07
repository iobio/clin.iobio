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
    margin-bottom: 0px

    .interpretation-list
      margin-bottom: 10px


  .sub-heading
    font-size: 16px
    font-weight: 500
    color: $text-color

  .case-summary, .clinical-note
    color: $text-color
    line-height: 16px
    font-size: 14px
    padding-top: 5px

  .case-summary
    width: 80%

  .clinical-note
    display: flex
    justify-content: space-between

    .note, .note-header
      min-width:  60%
      max-width: 60%

    .note
      padding: 10px
      border: thin solid #e4e3e3

    .arrow
      max-width: 50px
      min-width: 50px
      align-self: center
      text-align: center

    .phenotypes, .phenotypes-header
      min-width: 40%
      max-width: 40%


    .phenotypes
      padding: 10px
      border: thin solid #e4e3e3


</style>

<template>

  <div id="findings-panel" >

      <div style="margin-bottom: 20px">
        <span class="sub-heading">Case Summary </span>
        <div class="case-summary">
        {{ caseSummary.description }}
        </div>

      </div>

      <div v-if="clinicalNotes && clinicalNotes.length > 0" style="width:80%;margin-top:40px;margin-bottom:20px">
        <hr style="border-top:transparent">
        <span class="sub-heading">Phenotypes</span>
        <div class="clinical-note" style="margin-bottom:5px">

          <div class="note-header" style="font-weight:500">
            Input
          </div>
          <div class="arrow">
          </div>
          <div class="phenotypes-header" style="font-weight:500">
            Phenotypes terms
          </div>
        </div>
        <div style="margin-bottom:20px" class="clinical-note" v-for="clinicalNote in clinicalNotes" :key="note">

          <div class="note">
            {{ clinicalNote.note }}
          </div>
          <div class="arrow">
            <v-icon>arrow_forward</v-icon>
          </div>
          <div class="phenotypes">
            {{ clinicalNote.phenotypes.join(", ") }}
          </div>
        </div>

      </div>

      <hr style="border-top:transparent">

      <div class="sub-heading" style="margin-top:40px;margin-bottom:0px">Reviewed Variants</div>

      <div class="findings-section" v-for="interpretation in variantsByInterpretation" :key="interpretation.key" >


        <div v-if="interpretation.organizedVariants && interpretation.organizedVariants.length > 0"
        class="interpretation-list"
        >
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
                 :interpretationMap="interpretationMap"
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

export default {
  name: 'findings',
  components: {
    AppIcon,
    VariantInspectCard
  },
  props: {
    analysis: null,
    modelInfos:  null,
    genomeBuildHelper: null,
    caseSummary: null,
    variantsByInterpretation: null,
    interpretationMap: null,
  },
  data() {
    return {
      clinicalNotes: null,
      note: null
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
    initClinicalNotes: function() {
      let self = this;
      self.clinicalNotes = [];
      if (self.analysis && self.analysis.payload && self.analysis.payload.phenotypes && self.analysis.payload.phenotypes.length > 3) {
        let noteObjects = self.analysis.payload.phenotypes[3];
        noteObjects.forEach(function(noteObject) {
          let clinNote = {};
          clinNote.note = noteObject.note;
          clinNote.phenotypes = [];
          if (noteObject.gtr_terms && noteObject.gtr_terms.length > 0) {
            noteObject.gtr_terms.forEach(function(gtrTerm) {
              if (gtrTerm) {
                let phen = gtrTerm.DiseaseName.toLowerCase();
                if (clinNote.phenotypes.indexOf(phen) == -1){
                  clinNote.phenotypes.push(phen)
                }
              }
            })
          }
          if (noteObject.phenolyzer_terms && noteObject.phenolyzer_terms.length > 0) {
            noteObject.phenolyzer_terms.forEach(function(phenolyzerTerm) {
              if (phenolyzerTerm) {
                let phen = phenolyzerTerm.label.toLowerCase();
                if (clinNote.phenotypes.indexOf(phen) == -1) {
                  clinNote.phenotypes.push(phen)
                }
              }
            })
          }
          if (noteObject.hpo_terms && noteObject.hpo_terms.length > 0) {
            noteObject.hpo_terms.forEach(function(hpoTerm) {
              if (hpoTerm) {
                let phen = hpoTerm.phenotype.toLowerCase();
                if (clinNote.phenotypes.indexOf(phen) == -1) {
                  clinNote.phenotypes.push(phen)
                }
              }
            })
          }
          self.clinicalNotes.push(clinNote);
        })
      }
    }
  },
  computed: {



  },
  watch: {
    analysis: function() {
      this.initClinicalNotes();
    },
    variantsByInterpretation: function() {
      this.initClinicalNotes();
    }
  },
}
</script>
