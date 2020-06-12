<template>
  <div>
    <v-layout row wrap class="mt-5">
      <v-flex xs12 class="sample-label mb-2 mt-1" >
        <span> Data type </span>
      </v-flex>

      <v-flex xs3>
          <v-select
            label="Data"
            hide-details
            v-model="dataTypeSelectedName"
            dense
            solo
            :items="dataTypesList"
          ></v-select>
      </v-flex>
      
      <v-flex xs5 class="ml-5">
        <v-btn-toggle
          v-if="dataTypeSelectedName==='Genome'"
          v-model="toggle_bed_selection_genome"
          mandatory
          dense
          color="primary"
          group
        >
          <v-btn  v-for="(bed, idx) in bedFile_type_genome">
            {{ bed }}
          </v-btn>
        </v-btn-toggle>
        
        <v-btn-toggle
          v-if="dataTypeSelectedName==='Exome'"
          v-model="toggle_bed_selection_exome"
          mandatory
          dense
          color="primary"
          group
        >
          <v-btn v-for="(bed, idx) in bedFile_type_exome">
            {{ bed }}
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      
      <v-flex xs9 v-if="showUrlField && dataTypeSelectedName==='Exome' && toggle_bed_selection_exome===1">
        <v-text-field
          label="Enter bed URL"
          hide-details
          v-model="bed_url_exome"
          prepend-icon="link"
        ></v-text-field>
      </v-flex>
      <v-flex xs9 v-if="showUrlField && dataTypeSelectedName==='Genome' && toggle_bed_selection_genome===2">
        <v-text-field
          label="Enter bed URL"
          hide-details
          v-model="bed_url_genome"
          prepend-icon="link"
        ></v-text-field>
      </v-flex>

    </v-layout>
    
  </div>
</template>

<script>
  export default {
    name: 'bed-data',
    data(){
      return {
        dataTypesList: ['Exome', 'Genome'],
        dataTypeSelectedName: 'Exome',
        toggle_bed_selection_genome: 0,
        bedFile_type_genome: ['No bed file', 'Standard (GRCh37 Exonic Regions)', 'Custom Bed'],
        toggle_bed_selection_exome: 0,
        bedFile_type_exome: ['Standard (GRCh37 Exonic Regions)', 'Custom Bed',],
        showUrlField: false,
        bed_url_exome: '', 
        bed_url_genome: ''
      }
    }, 
    methods: {

    }, 
    watch: {
      toggle_bed_selection_genome: function(){
        if(this.toggle_bed_selection_genome === 2){
          this.showUrlField = true;
        }
        else {
          this.showUrlField = false;
        }
      },
      toggle_bed_selection_exome: function(){
        if(this.toggle_bed_selection_exome === 1){
          this.showUrlField = true;
        }
        else {
          this.showUrlField = false; 
        }
      }
    }
  };
</script>

