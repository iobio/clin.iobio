<style lang="sass" >
@import ../../assets/sass/variables

.save-project-dialog
  top: 0
  z-index: 999


.save-project-content
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


</style>



<template>

    <v-dialog  content-class="save-project-dialog" width="400" persistent v-model="showPopup" >

      <v-card  class="save-project-content full-width">
        <v-card-title style="justify-content: space-between;padding: 0px;">
          <span class="info-title">Edit case summary</span>
          <v-btn  @click="onClose" text class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
                
        <v-layout row wrap class="save-analysis-radios">
                   
          <v-flex class="mt-2" xs12>
            <v-textarea
              :hide-details="true"
              label="Description"
              v-model="projectDescription"
            >
            </v-textarea>
          </v-flex>


          <v-flex class="mt-4" style="display:flex;justify-content:flex-end" xs12>
            <v-btn class="primary mr-2" @click="saveProject">Save</v-btn>
            <v-btn @click="onClose">Cancel</v-btn>
          </v-flex>

        </v-layout>
        
      </v-card>
    </v-dialog>

</template>

<script>

export default {
    name: 'save-project-popup',
    props: {
      showIt: null,
      name: null,
      description: null
    },
    data() {
      return {
        showPopup: false,
        projectName: null,
        projectDescription: null,
      }
    },
    watch: {
      showIt: function() {
        if (this.showIt) {
          this.projectName = this.name
          this.projectDescription = this.description;
          this.showPopup = true;
        }
      },
      showPopup: function() {
        if (this.showPopup) {
          this.projectName = this.name
          this.projectDescription = this.description;
        }
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      saveProject: function() {
        this.$emit("on-save-project", this.projectDescription)
        this.showPopup = false;
      },
      onClose: function() {
        this.projectName = this.name;
        this.projectDescription = this.description;
        this.$emit("on-cancel-project")
        this.showPopup = false;
      }
    }
}

</script>