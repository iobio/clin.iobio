<style lang="sass" >
@import ../../assets/sass/variables

.save-analysis-dialog
  position: fixed
  right: 50px
  top: 0
  z-index: 999


.save-analysis-content
  padding: 15px 15px 15px 15px

  textarea
    font-size: 13px !important
  input
    font-size: 13px !important

  .close-button
    margin: 0px !important
    padding: 0px !important
    min-width: 20px !important
    height: 20px !important
    margin-bottom: 15px !important

    .btn__content
      padding: 0px
      max-width: 20px
      max-height: 20px

      i.material-icons
        font-size: 20px
        color: $text-color

  .layout
    padding-left: 15px
    padding-right: 15px

  .info-title
    font-size: 14px
    color: $app-header-color
    margin-bottom: 15px

.save-analysis-radios 
  .v-label
    margin-top: 5px
    font-size: 14px
    
  .v-input--selection-controls__ripple
    border-radius: 50%
    cursor: pointer
    height: 22px
    position: absolute
    -webkit-transition: inherit
    transition: inherit
    width: 22px
    left: -6px
    top: calc(50% - 18px)
    margin: 7px  


</style>



<template>

    <v-dialog  content-class="save-analysis-dialog" width="400" persistent v-model="showPopup" >

      <v-card v-if="analysis" class="save-analysis-content full-width">
        <v-card-title style="justify-content: space-between;padding: 0px;">
          <span class="info-title"> {{ analysis.id ? 'Save analysis to Mosaic' : 'Add this analysis to Mosaic' }}</span>
          <v-btn  @click="onClose" text class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
                
        <v-layout row wrap class="save-analysis-radios">
          <v-radio-group v-model="radios" mandatory v-if="analysis.id" style="margin-top: 0px !important">
            <v-radio label="Update analysis" value="update-analysis"></v-radio>
            <v-radio label="Save as new analysis" value="save-new-analysis"></v-radio>
          </v-radio-group>
                    
          <v-flex xs12>
            <v-text-field :hide-details="true" v-model="analysisName" label="Name" type="text">
            </v-text-field>
          </v-flex>

          <v-flex class="mt-2" xs12>
            <v-text-field
              multi-line
              rows="3"
              :hide-details="true"
              label="Description"
              v-model="analysisDescription"
            >
            </v-text-field>
          </v-flex>


          <v-flex class="mt-4" style="display:flex;justify-content:flex-end" xs12>
            <v-btn class="primary mr-2" @click="saveAnalysis">{{ analysis.id ? 'Save' : 'Save' }}</v-btn>
            <v-btn @click="onClose">Cancel</v-btn>
          </v-flex>

        </v-layout>
        
      </v-card>
    </v-dialog>

</template>

<script>

export default {
    name: 'save-analysis-popup',
    props: {
      analysis: null,
      showIt: false
    },
    data() {
      return {
        showPopup: false,
        analysisName: null,
        analysisDescription: null,
        radios: "update-analysis"
      }
    },
    watch: {
      showIt: function() {
        if (this.showIt) {
          this.analysisName = this.analysis.title;
          this.analysisDescription = this.analysis.description;
          this.showPopup = true;
        }
      },
      showPopup: function() {
        if (this.showPopup) {
          this.analysisName = this.analysis.title;
          this.analysisDescription = this.analysis.description;
        }
      },
      radios: function() {
        if(this.radios === "save-new-analysis") {
          this.analysisName = "";
          this.analysisDescription = "";
        }
        else if (this.radios === "update-analysis") {
          this.analysisName = this.analysis.title;
          this.analysisDescription = this.analysis.description;
        }
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      saveAnalysis: function() {
        if(this.radios === "save-new-analysis") {
          this.onSaveAsNewAnalysis();
        }
        else {
          this.onSave();
        }
      },
      onSave: function() {
        this.analysis.title = this.analysisName;
        this.analysis.description = this.analysisDescription;
        this.$emit("on-save-analysis", this.analysis)
        this.showPopup = false;
      },
      onClose: function() {
        this.analysisName = this.analysis.title;
        this.analysisDescription = this.analysis.description;
        this.radios = "update-analysis";
        this.$emit("on-cancel-analysis")
        this.showPopup = false;
      },
      onSaveAsNewAnalysis: function() {
        var newAnalysis = {};
        newAnalysis.payload = this.analysis.payload; 
        newAnalysis.project_id = this.analysis.project_id; 
        newAnalysis.title = this.analysisName;
        newAnalysis.description = this.analysisDescription;
        newAnalysis.sample_id = this.analysis.sample_id; 
        this.$emit("on-save-new-analysis", newAnalysis)
        this.showPopup = false;
      }
    }
}

</script>
