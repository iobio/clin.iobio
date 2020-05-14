<style lang="sass">
@import ../../../assets/sass/variables

</style>

<template>
    <v-dialog
    width="1200" persistent
    :close-on-content-click="false"
    v-model="showDrugInfoDialog"
    >

      <v-card class="full-width">
        <div class="container">
          <v-btn text @click="onCancel" class="close-button" color="white">
            <v-icon>close</v-icon>
          </v-btn>
          <v-card-title class="headline" style="padding-top: 10px;">Drug information for {{ gene }}</v-card-title>
        </div>
        <v-divider id="gene-associations-dialog-divider"></v-divider>
        <v-card-text style="padding-bottom: 0px">
          <div class="container">
            <v-data-table
              :headers="headers"
              :items="drugs"
              :items-per-page="10"
              class="elevation-1"
        			sort-by="fda"
        			sort-desc
            ></v-data-table>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" tile @click="onCancel">
            Cancel
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
</template>

<script>


export default {
  name: 'drug-info-dialog',
  components: {
  },
  props: {
    gene: null,
    showDialog: null,
    drugs: null
  },
  data () {
    return {
      headers: [
        { text: 'Drug', sortable: false, value: 'drugName' },
        { text: 'Molecule type', sortable: false, value: 'molecule_type' },
        { text: 'Mechanism of action', sortable: false, value: 'mechanism_of_action' },
        { text: 'Action type', sortable: false, value: 'action_type' },
        { text: 'Activity', sortable: false, value: 'activity' },
        { text: 'Target class', sortable: false, value: 'target_type' },
      ],
      showDrugInfoDialog: true,
      gtrHits: [], 
      phenolyzerHits: [], 
      hpoHits: [], 
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    onCancel: function() {
      this.showDrugInfoDialog = false;
      this.$emit("close-drug-info-dialog", this.showDrugInfoDialog)
    }, 
  },
  created: function() {
  },
  mounted: function() {
    console.log("drugs", this.drugs)
  },
  updated: function() {
  },
  watch: {
    showDrugInfoDialog: function() {
    },
    showDialog: function() {
      this.showDrugInfoDialog = this.showDialog
    }, 

  }
}
</script>
