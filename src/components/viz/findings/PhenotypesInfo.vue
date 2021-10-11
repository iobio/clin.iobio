<template>
  <div>
    <div class="col-container row" >
      <!-- flex-text-note  -->
      <v-card class="col-flex-note">
        <v-card-title primary-title style="padding-top: 6px; padding-bottom: 2px">
          <strong class="terms-heading" style="font-size: 16px">
            Inputs
          </strong>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text class="i-clinical_note_text_div">
          <div>
            <div v-if="clinical_note_text.length">
              <div v-for="(note, i) in clinical_note_text" :key="i" class=" i-text--left row" style="font-size: 13px;">
                <div class="col-md-1" style="padding: 5px; padding-left: 11px">
                  {{i + 1}}
                </div>
                <div class="col-md-11" style="padding: 5px; margin-left: -5px">
                  {{ note.note | to-firstCharacterUppercase }}
                </div>
                 
              </div>
            </div>
            <div v-else>
              <center><MissingNoteIcon /></center>
              <center class="mt-2 ml-5"> No clinical note added</center>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <!-- end flex text note -->      
                    
      <!-- flex-gtr-terms -->
      <v-card class="col-flex-terms">
        <v-card-title primary-title style="padding-top: 6px; padding-bottom: 2px">
          <strong class="terms-heading" style="font-size: 16px">
            GTR
          </strong>
          <v-spacer></v-spacer>
          <div style="color:#ababab" v-if="Gtr_searchTermsObj.length">
            <span><h4 style="display:inline"> {{Gtr_searchTermsObj.length}} </h4> </span> 
            <span style="font-size:12px">terms</span>
          </div>
        </v-card-title>
        <v-card-text class="search_status_tbody">
          <div class="">
            <div v-if="Gtr_searchTermsObj.length" v-for="(term, i) in Gtr_searchTermsObj" :key="i" >
              <div class="row " style="margin-bottom: -8px; margin-top: -8px">
                <div class="col-md-1" style="padding-top: 5px;">
                  {{i + 1}}
                </div>
                <div class="col-md-9" style="padding-top: 5px;" >
                  <div class="ml-1" style="text-align: left !important; font-size: 13px" >
                    <span>{{ term.DiseaseName }}</span>
                  </div>
                </div>
                <div class="col-md-1" style="padding-top: 5px;" >
                </div>
              </div>

            </div>
            <div v-if="Gtr_searchTermsObj.length<1">
              <span>
                <center>
                  <MissingTermsIcon>
                  </MissingTermsIcon>
                </center>
                <p style="text-align: center;"><center>Not Selected...</center></p>
              </span>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <!-- end flex gtr terms -->
      


      <!-- flex-Phenolyzer-terms -->
      <v-card class="col-flex-terms">
        <v-card-title primary-title style="padding-top: 6px; padding-bottom: 2px">
          <strong class="terms-heading" style="font-size: 16px">
            Phenolyzer
          </strong>
          <v-spacer></v-spacer>
          <div style="color:#ababab" v-if="Phenolyzer_searchTermsObj.length">
            <span><h4 style="display:inline"> {{Phenolyzer_searchTermsObj.length}} </h4> </span> 
            <span style="font-size:12px">terms</span>
          </div>
        </v-card-title>
        <v-card-text class="search_status_tbody">
          <div class="">
            <div v-if="Phenolyzer_searchTermsObj.length" v-for="(term, i) in Phenolyzer_searchTermsObj" :key="i" >
              <div class="row " style="margin-bottom: -8px; margin-top: -8px">
                <div class="col-md-1" style="padding-top: 5px;">
                  {{i + 1}}
                </div>
                <div class="col-md-9" style="padding-top: 5px;">
                  <div class="ml-1" style="text-align: left !important; font-size: 13px" >
                    <span>{{ term.value | to-firstCharacterUppercase }}</span>
                  </div>
                </div>
                <div class="col-md-1" style="padding-top: 5px;">
                </div>                        
              </div>

            </div>
            <div v-if="Phenolyzer_searchTermsObj.length<1">
              <span>
                <center>
                  <MissingTermsIcon>
                  </MissingTermsIcon>
                </center>
                <p style="text-align: center;"><center>Not Selected...</center></p>
              </span>
            </div>

          </div>
        </v-card-text>
      </v-card>
      <!-- end flex phenolyzer terms -->     
      
      
      <!-- flex-hpo-terms -->
      <v-card class="col-flex-terms" >
        <v-card-title primary-title style="padding-top: 6px; padding-bottom: 2px">
          <strong class="terms-heading" style="font-size: 16px">
            HPO
          </strong>
          <v-spacer></v-spacer>
          <div style="color:#ababab" v-if="Hpo_searchTermsObj.length">
            <span><h4 style="display:inline"> {{Hpo_searchTermsObj.length}} </h4> </span> 
            <span style="font-size:12px">terms</span>
          </div>
        </v-card-title>
        <v-card-text class="search_status_tbody">
          <div class="">
            <div v-if="Hpo_searchTermsObj.length" v-for="(term, i) in Hpo_searchTermsObj" :key="i" >
              <div class="row " style="margin-bottom: -8px; margin-top: -8px">
                <div class="col-md-1" style="padding-top: 5px;">
                  {{i + 1}}
                </div>
                <div class="col-md-9" style="padding-top: 5px;">
                  <div class="ml-1" style="text-align: left !important; font-size: 13px" >
                    <span>{{ term.phenotype }} <br> [{{ term.hpoNumber }}]</span>
                  </div>
                </div>
                <div class="col-md-1" style="padding-top: 5px;">
                </div>                        
              </div>
            </div>
            <div v-if="Hpo_searchTermsObj.length<1">
              <span>
                <center>
                  <MissingTermsIcon>
                  </MissingTermsIcon>
                </center>
                <p style="text-align: center;"><center>Not Selected...</center></p>
              </span>
            </div>

          </div>
        </v-card-text>
      </v-card>
      <!-- end flex hpo terms -->  
      
      
      <!-- flex-manually-added-genes -->
      <!-- <v-card class="col-flex-terms" >
        <v-card-title primary-title style="padding-top: 6px; padding-bottom: 2px">
          <strong class="terms-heading" style="font-size: 16px">
            Added genes 
          </strong>
          <v-spacer></v-spacer>
          <div style="color:#ababab" v-if="manuallyAddedGenes.length">
            <span><h4 style="display:inline"> {{manuallyAddedGenes.length}} </h4> </span> 
            <span style="font-size:12px">genes</span>
          </div>
        </v-card-title>
        <v-card-text class="search_status_tbody">
          <div v-if="showSearchTermsLoader">
            <v-skeleton-loader
              :loading="loading"
              :transition="transition"
              type="chip"
              class="mt-2"
            >
            </v-skeleton-loader>
          </div>
          <div v-if="manuallyAddedGenes.length" >
            <div class="added_genes_block" >
              <div > 
                {{ manuallyAddedGenes.join(", ") }}
              </div>
            </div>
            <br>
            <center>
              <v-btn @click="manuallyAddGenesEvent" outlined small color="primary" class="mr-3">
                <v-icon class="mr-1">add</v-icon>
                Manually Add Genes
              </v-btn>   
            </center>
          </div>
          <div v-if="!manuallyAddedGenes.length">
            <span v-if="!showSearchTermsLoader">

              <MissingTermsIcon>
              </MissingTermsIcon>
              <br>
              <center>
                <v-btn @click="manuallyAddGenesEvent" outlined small color="primary" class="mr-3">
                  <v-icon class="mr-1">add</v-icon>
                  Manually Add Genes
                </v-btn>                    
              </center>
            </span>
          </div>


        </v-card-text>
      </v-card> -->
      <!-- end manually added genes -->                       
             

    </div>
  </div>
</template>


<script>
import MissingNoteIcon from '../../partials/icons/MissingNoteIcon.vue';
import MissingTermsIcon from '../../partials/icons/MissingTermsIcon.vue';
import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'phenotypes-info',
    components: {
      MissingNoteIcon,
      MissingTermsIcon
    },
    props: {
      
    },
    data(){
      return {
        clinical_note_text: [],
        Gtr_searchTermsObj: [],
        Phenolyzer_searchTermsObj: [],
        Hpo_searchTermsObj: [],
        
      }
    },
    
    mounted(){
        this.setPhenotypes();
    },
    
    computed: {
      ...mapGetters(['getSearchedPhenotypes'])
    },
    
    methods: {
      getInfo(){
      },
      setPhenotypes(){
        this.Gtr_searchTermsObj = this.getSearchedPhenotypes[0];
        this.Phenolyzer_searchTermsObj = this.getSearchedPhenotypes[1];
        this.Hpo_searchTermsObj = this.getSearchedPhenotypes[2];
        this.clinical_note_text = this.getSearchedPhenotypes[3];
      }
    },
    
    watch: {
      getSearchedPhenotypes(){
        this.setPhenotypes();
      }
    }

  };
</script>

<style lang="sass">
  
.i-clinical_note_text_div
  display: block
  max-height: 252px
  // min-height: 104px
  overflow-y: scroll
  
.i-clinical_note_viz_div
  display: block
  max-height: 252px
  // min-height: 104px
  // overflow-y: scroll  

.i-note_and_terms_row
  display: flex

.i-note_and_terms_col
  flex: 1


.row-flex
  display: flex

.col-flex-note
  flex: 3
  margin-top: 12px
  margin-bottom: 12px
  margin-left: 12px
  margin-right: 6px

.col-flex-terms
  flex: 2
  margin-top: 12px
  margin-bottom: 12px
  margin-left: 6px
  margin-right: 12px

.col-container
  display: flex

.badge-label
  font-size: 16px
  color: #434343
  font-weight: 400

.terms-heading
  color: #434343
  font-size: 16px
  display: flex
  padding-left: 0px
  margin-left: 0px
  min-width: 170px
  justify-content: flex-start
  // padding-top: 5px
  // padding-bottom: 5px
  align-items: center
  font-weight: 800

  
</style>


