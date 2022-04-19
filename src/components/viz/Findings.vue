<style lang="sass"  >

@import ../../assets/sass/variables

#findings-panel
  padding: 15px 20px 5px 20px
  overflow-y: auto
  height: -webkit-fill-available
  height: -moz-available
  background-color:  white

  #variant-inspect
    padding-left: 0px
    padding-top: 0px

  #edit-description-button
    .material-icons
      color: $app-button-color

  .clinical-note
    .v-card__title
      font-size: 14px
      padding-top: 5px
      padding-bottom: 5px
      justify-content: space-between

      .term-count
        color: rgba(0, 0, 0, 0.54)

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
    // width: 80%

  .clinical-note
    display: flex
    justify-content: flex-start

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
        <span class="sub-heading">Case Summary 
          <v-btn v-if="canEditCaseSummary" small depressed @click="onEditProject" id="edit-description-button" style="margin-left:20px">
              <v-icon size="18">edit</v-icon>
          </v-btn>
        </span>
        <v-card style="margin-top:5px">
          <v-card-text>
            {{ caseSummaryDescription }}
          </v-card-text>
        </v-card>
      </div>

      <div v-if="clinicalNotes && clinicalNotes.length > 0" style="width:97%;margin-top:40px;margin-bottom:20px">
        <hr style="border-top:transparent">
        <span class="sub-heading">Phenotypes</span>

        <div style="margin-bottom:20px;margin-top:10px" class="clinical-note" >

          <v-card style="width:300px;margin-right:15px">
            <v-card-title>Inputs</v-card-title>
            <v-card-text>
              <div style="margin-bottom: 10px" v-for="clinicalNote in clinicalNotes" :key="note">
                {{ clinicalNote.note }}
              </div>
            </v-card-text>
          </v-card>

          <v-card style="width:300px;margin-right:15px">
            <v-card-title>
              <div>GTR</div>
              <div class="term-count">{{ phenotypeTerms['GTR'].length }} terms</div>
            </v-card-title>
            <v-card-text>
              <div v-for="phenotype in phenotypeTerms['GTR']" class="row" style="margin-bottom: -8px; margin-top: -8px" >
                <div class="col-md-1" style="padding-top: 5px;">
                  <span v-if="phenotype.status==='Searching'">
                    <v-progress-circular
                      :width="2"
                      :size="18"
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </span>
                  <span v-else-if="phenotype.status==='Completed'">
                    <v-icon color="green" style="font-weight: bolder; font-size:18px"">done</v-icon>
                  </span>
                  <span v-else-if="phenotype.status==='NoGenes'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="grey" style="font-size:20px" v-on="on">block</v-icon>
                      </template>
                      <span>No genes were found for this term</span>
                    </v-tooltip>
                  </span>
                  <span v-else-if="phenotype.status==='NotAvailable'"><v-icon>indeterminate_check_box</v-icon></span>
                  <span v-else>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="gray lighten-4" v-on="on">error</v-icon>
                      </template>
                      <span>The network request for this term failed. Please delete this term and try again.</span>
                    </v-tooltip>
                  </span>
                </div>
                <div class="col-md-11" style="padding-top: 5px;">
                  {{ phenotype.term }}
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card style="width:300px;margin-right:15px">
            <v-card-title>
              <div>Phenolyzer</div>
              <div class="term-count">{{ phenotypeTerms['Phenolyzer'].length }} terms</div>
            </v-card-title>
            <v-card-text>
              <div v-for="phenotype in phenotypeTerms['Phenolyzer']" class="row" style="margin-bottom: -8px; margin-top: -8px" >
                <div class="col-md-1" style="padding-top: 5px;">
                  <span v-if="phenotype.status==='Searching'">
                    <v-progress-circular
                      :width="2"
                      :size="18"
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </span>
                  <span v-else-if="phenotype.status==='Completed'">
                    <v-icon color="green" style="font-weight: bolder; font-size:18px"">done</v-icon>
                  </span>
                  <span v-else-if="phenotype.status==='NoGenes'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="grey" style="font-size:20px" v-on="on">block</v-icon>
                      </template>
                      <span>No genes were found for this term</span>
                    </v-tooltip>
                  </span>
                  <span v-else-if="phenotype.status==='NotAvailable'"><v-icon>indeterminate_check_box</v-icon></span>
                  <span v-else>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="gray lighten-4" v-on="on">error</v-icon>
                      </template>
                      <span>The network request for this term failed. Please delete this term and try again.</span>
                    </v-tooltip>
                  </span>
                </div>
                <div class="col-md-11" style="padding-top: 5px;">
                  {{ phenotype.term }}
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card style="width:300px;margin-right:15px">
            <v-card-title>
              <div>HPO</div>
              <div class="term-count">{{ phenotypeTerms['HPO'].length }} terms</div>
            </v-card-title>
            <v-card-text>
              <div v-for="phenotype in phenotypeTerms['HPO']" class="row" style="margin-bottom: -8px; margin-top: -8px" >
                <div class="col-md-1" style="padding-top: 5px;">
                  <span v-if="phenotype.status==='Searching'">
                    <v-progress-circular
                      :width="2"
                      :size="18"
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </span>
                  <span v-else-if="phenotype.status==='Completed'">
                    <v-icon color="green" style="font-weight: bolder; font-size:18px"">done</v-icon>
                  </span>
                  <span v-else-if="phenotype.status==='NoGenes'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="grey" style="font-size:20px" v-on="on">block</v-icon>
                      </template>
                      <span>No genes were found for this term</span>
                    </v-tooltip>
                  </span>
                  <span v-else-if="phenotype.status==='NotAvailable'"><v-icon>indeterminate_check_box</v-icon></span>
                  <span v-else>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-icon color="gray lighten-4" v-on="on">error</v-icon>
                      </template>
                      <span>The network request for this term failed. Please delete this term and try again.</span>
                    </v-tooltip>
                  </span>
                </div>
                <div class="col-md-11" style="padding-top: 5px;">
                  <div>
                    {{ phenotype.term }}
                  </div>
                  <div>
                    [{{ phenotype.hpoNumber }}]
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card v-if="addedGenes.length > 0" style="width:200px;">
            <v-card-title>
              <div>Added genes</div>
              <div class="term-count">{{ addedGenes.length }} genes</div>
            </v-card-title>
            <v-card-text>
              <div v-for="gene in addedGenes" class="row" style="margin-bottom: -8px; margin-top: -8px" >
                <div class="col-md-12" style="padding-top: 5px;">
                  {{ gene }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>

      </div>

      <hr style="border-top:transparent">

      <div class="sub-heading" style="margin-top:40px;margin-bottom:5px">Reviewed Variants</div>
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
</template>

<script>


import AppIcon       from '../partials/AppIcon.vue';
import VariantInspectCard   from '../viz/findings/VariantInspectCard.vue';
import { bus }      from '../../main'
import { mapGetters, mapActions } from 'vuex'

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
    caseSummaryDescription: null,
    variantsByInterpretation: null,
    interpretationMap: null,
    noteClinical: null,
    gtrTerms: null,
    phenolyzerTerms: null,
    hpoTerms: null,
    currentStep: null,
    canEditCaseSummary: null
  },
  data() {
    return {
      clinicalNotes: null,
      phenotypeTerms: null,
      note: null, 
      variantsInterpreted: false, 
      drugsObj: {},
      sources: {
        source: ["imported set", "genelist"],
        sourceIndicator: [1, 2]
      },
      addedGenes: [],
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

      self.addedGenes = self.analysis.payload.genesReport.filter(function(geneItem) {
        return geneItem.isImportedGenes == true
      }).map(function(geneItem) {
        return geneItem.name
      })

      self.clinicalNotes = [];
      self.phenotypeTerms = {'GTR': [], 'Phenolyzer': [], 'HPO': []};      

      if (self.analysis && self.analysis.payload && self.analysis.payload.phenotypes && self.analysis.payload.phenotypes.length > 3) {
        let searchStatus = {'GTR': [], 'Phenolyzer': [], 'HPO': []}
        self.analysis.payload.phenotypes[0].forEach(function(term) {
          searchStatus['GTR'][term.DiseaseName] = term.gtrSearchStatus
        })
        self.analysis.payload.phenotypes[1].forEach(function(term) {
          searchStatus['Phenolyzer'][term.label] = term.phenolyzerSearchStatus
        })
        self.analysis.payload.phenotypes[2].forEach(function(term) {
          searchStatus['HPO'][term.phenotype] = term.hpoSearchStatus
        })
                

        let noteObjects = self.analysis.payload.phenotypes[3];
        noteObjects.forEach(function(noteObject) {
          let clinNote = {};
          clinNote.note = noteObject.note;
          clinNote.phenotypes = {'GTR': [], 'Phenolyzer': [], 'HPO': []};        
          if (noteObject.gtr_terms && noteObject.gtr_terms.length > 0) {
            noteObject.gtr_terms.forEach(function(gtrTerm) {
              if (gtrTerm) {
                let phen = gtrTerm.DiseaseName;
                let status = searchStatus['GTR'][phen]
                self.phenotypeTerms['GTR'].push({'term': phen, 'status': status})
              }
            })
          }
          if (noteObject.phenolyzer_terms && noteObject.phenolyzer_terms.length > 0) {
            noteObject.phenolyzer_terms.forEach(function(phenolyzerTerm) {
              if (phenolyzerTerm) {
                let phen = phenolyzerTerm.label;
                let status = searchStatus['Phenolyzer'][phen]
                self.phenotypeTerms['Phenolyzer'].push({'term': phen, 'status': status})
              }
            })
          }
          if (noteObject.hpo_terms && noteObject.hpo_terms.length > 0) {
            noteObject.hpo_terms.forEach(function(hpoTerm) {
              if (hpoTerm) {
                let phen = hpoTerm.phenotype;
                let hpoNumber = hpoTerm.hpoNumber;
                let status = searchStatus['HPO'][phen]
                self.phenotypeTerms['HPO'].push({'term': phen, 'hpoNumber': hpoNumber, 'status': status})
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
    },
    onEditProject: function() {
      this.$emit("on-edit-project")
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
    currentStep: function() {
      if (this.currentStep == 4) {
        this.initClinicalNotes()
      }
    }


  },
}
</script>
