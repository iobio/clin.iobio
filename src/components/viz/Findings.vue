<style lang="sass"  >

@import ../../assets/sass/variables

#findings-panel
  padding: 15px 80px 5px 80px
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
    font-size: 18px
    font-weight: 600
    color: $text-color

  .case-summary, .clinical-note
    color: $text-color
    line-height: 16px
    font-size: 14px
    padding-top: 5px

  .case-summary
    // width: 80%

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
    
    <!-- <v-chip-group
      v-model="report_sections"
      column
      multiple
    >
      <v-chip
        filter
        outlined
      >
        Case Information
      </v-chip>
      <v-chip
        filter
        outlined
      >
        Quality Data
      </v-chip>
      <v-chip
        filter
        outlined
      >
        Phenotypes
      </v-chip>
      <v-chip
        filter
        outlined
      >
        Reviewed Variants
      </v-chip>


    </v-chip-group> -->
    
    <v-chip outlined @click="$vuetify.goTo('#case-information', 'linear')">
      Case Information
    </v-chip>
    
    <v-chip class="ml-2" outlined @click="$vuetify.goTo('#phenotype-information', 'linear')">
      Phenotypes
    </v-chip>

    <v-chip class="ml-2" outlined @click="$vuetify.goTo('#reviewed-variants', 'linear')">
      Reviewed Variants
    </v-chip>

    <v-chip class="ml-2" outlined @click="$vuetify.goTo('#quality-data', 'linear')">
      Quality Data
    </v-chip>


    <hr>

      <div style="margin-bottom: 60px; margin-top: 30px">
        <div v-if="report_sections.includes(0) || report_sections.length == 0">
          <div >
            <span id="case-information" class="sub-heading">Case Information</span>
          </div>

          <!-- <span class="sub-heading">Case Summary </span>
          <div class="case-summary">
          {{ caseSummary.description }}
          </div> -->
          <CaseInformation :modelInfos="modelInfos" :caseSummary="caseSummary"></CaseInformation>
        </div>

      </div>
      
      
      <div style="height: 170px"  v-if="report_sections.includes(0) || report_sections.length == 0">
        
      </div>
      
      

      
      <div v-if="report_sections.includes(2) || report_sections.length == 0">
        <span id="phenotype-information" class="sub-heading">Phenotypes</span>
        <PhenotypesInfo></PhenotypesInfo>
      </div>

      <!-- <div v-if="clinicalNotes && clinicalNotes.length > 0" style="width:97%;margin-top:40px;margin-bottom:20px">
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

      </div> -->
      



      <div v-if="report_sections.includes(3) || report_sections.length == 0">
        <hr style="border-top:transparent">

        <div id="reviewed-variants" class="sub-heading" style="margin-top:40px;margin-bottom:0px">Reviewed Variants</div>
        <div v-if="!variantsInterpreted" class="case-summary">
          Variants are not currently reviewed. Please review them in the <a @click="gotoStep(2)"><strong>Review Variants</strong></a> step of the workflow
        </div>

        <div class="findings-section" v-for="interpretation in variantsByInterpretation" :key="interpretation.key" >


          <div v-if="interpretation.organizedVariants && interpretation.organizedVariants.length > 0"
          class="interpretation-list"
          >
          </div>



          <template v-for="geneList in interpretation.organizedVariants">

            <template
             v-for="geneObject in geneList.genes">

              <div v-for="(variant, index) in geneObject.variants" :key="variant.variantInspect.geneObject.gene_name">
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
                   :drugsObj="drugsObj"
                   :gtrTerms="gtrTerms"
                   :phenolyzerTerms="phenolyzerTerms"
                   :hpoTerms="hpoTerms"
                  >

                  </variant-inspect-card>
                </div>
              </div>
            </template>


          </template>


        </div>
        
      </div>
      
      <div style="height: 40px" v-if="report_sections.includes(1) || report_sections.length == 0">
        
      </div>

      
      <div  v-if="report_sections.includes(1) || report_sections.length == 0">
        <div id="quality-data">
          <span class="sub-heading">Quality Data</span>
        </div>

        <QualityInfo 
          :sampleAttributes="sampleAttributes">
        </QualityInfo>
      </div>





  </div>
</template>

<script>


import AppIcon       from '../partials/AppIcon.vue';
import VariantInspectCard   from '../viz/findings/VariantInspectCard.vue';
import { bus }      from '../../main'
import { mapGetters, mapActions } from 'vuex'
import PhenotypesInfo from './findings/PhenotypesInfo.vue'
import CaseInformation from './findings/CaseInformation'
import QualityInfo from './findings/QualityInfo.vue'

export default {
  name: 'findings',
  components: {
    AppIcon,
    VariantInspectCard,
    PhenotypesInfo,
    CaseInformation,
    QualityInfo
  },
  props: {
    analysis: null,
    modelInfos:  null,
    genomeBuildHelper: null,
    caseSummary: null,
    variantsByInterpretation: null,
    interpretationMap: null,
    noteClinical: null,
    gtrTerms: null,
    phenolyzerTerms: null,
    hpoTerms: null,
    sampleAttributes: null,
    launchedFromMosaic: null
  },
  data() {
    return {
      clinicalNotes: null,
      note: null, 
      variantsInterpreted: false, 
      drugsObj: {},
      sources: {
        source: ["imported set", "genelist"],
        sourceIndicator: [1, 2]
      },
      report_sections: [],
    }

  },
  methods: {
    ...mapActions(['setVariantsByInterpretation']),

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
    }, 
    checkIfVariantsinterpreted: function(){
      for(let variant of this.variantsByInterpretation){
        if(variant.organizedVariants.length){
          this.variantsInterpreted = true; 
          break; 
        }
      }
    }, 
    gotoStep: function(stepIndex){
      bus.$emit('navigate-to-step',stepIndex); 
    }
  },
  computed: {



  },
  mounted() {
  },
  watch: {
    analysis: function() {
      this.initClinicalNotes();
    },
    noteClinical: function(){
      this.initClinicalNotes();
    },
    variantsByInterpretation: function() {
      this.setVariantsByInterpretation(this.variantsByInterpretation); //Updates the global state in vuex store. 
      this.initClinicalNotes();
      this.checkIfVariantsinterpreted(); 
    }, 
    hpoTerms: function() {
    },
    phenolyzerTerms: function() {
    }

  },
}
</script>
