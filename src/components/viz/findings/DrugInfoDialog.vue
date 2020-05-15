<style lang="sass">
@import ../../../assets/sass/variables

</style>

<template>
  <div>
    <v-dialog
      width="1450" persistent
      :close-on-content-click="false"
      v-model="showDrugInfoDialog"
    >

      <v-card class="full-width">
        <div class="container">
          <v-btn text @click="onCancel" class="close-button" color="white">
            <v-icon>close</v-icon>
          </v-btn>
          <v-card-title class="headline" style="padding-top: 10px;">
            <v-icon class="mr-2">fas fa-pills</v-icon>
            Drugs for {{ gene }}
          </v-card-title>
        </div>
        <v-divider id="gene-associations-dialog-divider"></v-divider>
        <v-card-text style="padding-bottom: 0px">
          <div class="container">
            <v-card-title v-if="drugs.length">
              <span style="margin-left:-22px">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn style="cursor:auto" small class="ma-2" fab color="green lighten-1" v-on="on">
                      <span style="color: white; font-size: 16px"> <strong>{{ drugs.length }}</strong> </span>
                    </v-btn>
                  </template>
                  <span><i>Drugs in clinical trials or approved for {{ gene }}</i></span>
                </v-tooltip>
                <span class="badge-label"> <strong>Unique drugs</strong> </span>
              </span>
              <v-spacer></v-spacer>
              <div class="col-md-3" pa-0 style="margin-right:-20px">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search drug name"
                  single-line
                  hide-details
                ></v-text-field>
              </div>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="drugs"
              class="elevation-3"
              sort-by="drugName"
              :items-per-page="5"
              :search="search"
              no-data-text="Sorry, no drug information is currently available for this gene"
            >
              <template v-slot:item.drugName="{ item }">
                <strong>{{ item.drugName }}</strong>
              </template>
              
              <template v-slot:item.id="{ item }">
                <a :href="item.id_url" target="_blank">{{ item.id }}</a>
              </template>
              
              <template v-slot:item.action_type="{ item }">
                <span>{{ item.action_type | to-firstCharacterUppercase}}</span>
              </template>

              <template v-slot:item.activity="{ item }">
                <span>{{ item.activity | to-firstCharacterUppercase }}</span>
              </template>

              <template v-slot:item.target_type="{ item }">
                <span>{{ item.target_type | to-firstCharacterUppercase }}</span>
              </template>
            </v-data-table>
            <div class="pt-2">
              <span>Source: <a href="https://www.targetvalidation.org/" target="_blank"> Open Targets Platform</a></span>
            </div>
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
  </div>
</template>

<script>


export default {
  name: 'drug-info-dialog',
  components: {
  },
  props: {
    gene: null,
    showDialog: null,
    drugsData: null
  },
  data () {
    return {
      headers: [
        { text: 'Drug', sortable: false, value: 'drugName', width: '17%'},
        { text: 'Molecule ID', sortable: false, value: 'id' },
        { text: 'Molecule type', sortable: false, value: 'molecule_type' },
        { text: 'Mechanism of action', sortable: false, value: 'mechanism_of_action' },
        { text: 'Action type', sortable: false, value: 'action_type' },
        { text: 'Activity', sortable: false, value: 'activity' },
        { text: 'Target class', sortable: false, value: 'target_type' },
      ],
      showDrugInfoDialog: true,
      search: '',
      drugs: []
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
    this.drugs= this.drugsData
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
