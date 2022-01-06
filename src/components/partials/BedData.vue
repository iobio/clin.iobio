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
          dense rounded
          color="primary" light
        >
          <v-btn color="white" v-for="(bed, idx) in bedFile_type_genome">
            {{ bed }}
          </v-btn>
        </v-btn-toggle>
        
        <v-btn-toggle
          v-if="dataTypeSelectedName==='Exome'"
          v-model="toggle_bed_selection_exome"
          mandatory
          dense rounded
          color="primary" light
        >
          <v-btn color="white" v-for="(bed, idx) in bedFile_type_exome">
            {{ bed }}
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      
      <v-flex xs9 v-if="showUrlField && dataTypeSelectedName==='Exome' && toggle_bed_selection_exome===1">
        <v-text-field
          label="Enter bed URL"
          hide-details
          v-model="bed_url_exome"
          :rules="urlRules"
          prepend-icon="link"
          @change="onExomeBedUrlChange"
        ></v-text-field>
      </v-flex>
      <v-flex xs9 v-if="showUrlField && dataTypeSelectedName==='Genome' && toggle_bed_selection_genome===2">
        <v-text-field
          label="Enter bed URL"
          hide-details
          v-model="bed_url_genome"
          :rules="urlRules"
          @change="onGenomeBedUrlChange"
          prepend-icon="link"
        ></v-text-field>
      </v-flex>

    </v-layout>
    
  </div>
</template>

<script>
  export default {
    name: 'bed-data',
    props: {
      buildName: null
    },
    data(){
      return {
        dataTypesList: ['Exome', 'Genome'],
        dataTypeSelectedName: 'Exome',
        toggle_bed_selection_genome: 0,
        bedFile_type_genome: ['No bed', 'Standard (GRCh37 Exonic Regions)', 'Custom bed'],
        toggle_bed_selection_exome: 0,
        bedFile_type_exome: ['Standard (GRCh37 Exonic Regions)', 'Custom bed',],
        showUrlField: false,
        bed_url_exome: '', 
        bed_url_genome: '',
        bedFileUrl: 'https://iobio.s3.amazonaws.com/clin.iobio/20130108.exome.targets.bed',
        bedFile37: 'https://iobio.s3.amazonaws.com/clin.iobio/20130108.exome.targets.bed',
        bedFile38: 'https://iobio.s3.amazonaws.com/clin.iobio/20130108.exome.targets.grch38.bed',
        urlRules: [
          v => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v) || 'URL must be valid',
        ],
        buttonBorder: false
      }
    }, 
    methods: {
      isValidUrl: function(url) {
        var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/; 
        var regex = new RegExp(expression);
        return url.match(regex); 
      },
      onExomeBedUrlChange: _.debounce(function (newUrl) {
        if (newUrl && newUrl.length > 0 && this.isValidUrl(newUrl)) {
          this.bedFileUrl = newUrl;
          this.$emit('set-bed-url', this.bedFileUrl);
        }
      }, 100),
      onGenomeBedUrlChange: _.debounce(function (newUrl) {
        if (newUrl && newUrl.length > 0 && this.isValidUrl(newUrl)) {
          this.bedFileUrl = newUrl;
          this.$emit('set-bed-url', this.bedFileUrl);
        }
      }, 100),
      setField: function(){
        if(this.dataTypeSelectedName === 'Exome'){
          
          if(this.toggle_bed_selection_exome === 0){
            this.showUrlField = false; 
            if(this.buildName === 'GRCh37'){
              this.bedFileUrl = this.bedFile37;
            }
            else if(this.buildName === 'GRCh38'){
              this.bedFileUrl = this.bedFile38;
            }
            this.$emit('set-bed-url', this.bedFileUrl); 
          }
          
          else if(this.toggle_bed_selection_exome === 1){ //this is going to be custom, so buildName won't affect the bed file selection. 
            this.showUrlField = true;
            this.bed_url_exome === '' ? this.bedFileUrl = '' : this.bedFileUrl = this.bed_url_exome; 
            this.$emit('set-bed-url', this.bedFileUrl); 
          }
          
        }
        else{ //data type selected is genome 
          if(this.toggle_bed_selection_genome === 0){
            this.showUrlField = false;
            this.bedFileUrl = undefined;
            this.$emit('set-bed-url', this.bedFileUrl); 
          }
          else if(this.toggle_bed_selection_genome === 1){
            this.showUrlField = false;
            if(this.buildName === 'GRCh37'){
              this.bedFileUrl = this.bedFile37;
            }
            else if(this.buildName === 'GRCh38'){
              this.bedFileUrl = this.bedFile38;
            }
            this.$emit('set-bed-url', this.bedFileUrl); 
          }
          else if(this.toggle_bed_selection_genome === 2){
            this.showUrlField = true;
            this.bed_url_genome === '' ? this.bedFileUrl = '' : this.bedFileUrl = this.bed_url_genome; 

            this.$emit('set-bed-url', this.bedFileUrl); 
          }
        }
      }
    }, 
    watch: {
      toggle_bed_selection_genome: function(){
        this.setField();
      },
      toggle_bed_selection_exome: function(){
        this.setField()
      },
      dataTypeSelectedName: function(){ //User changes the data type selection
        this.setField();
      },
      buildName: function(){
        if(this.buildName === 'GRCh38'){
          this.bedFile_type_exome = []; 
          this.bedFile_type_exome = ['Standard (GRCh38 Exonic Regions)', 'Custom bed'];
          this.bedFile_type_genome = [];
          this.bedFile_type_genome = ['No bed', 'Standard (GRCh38 Exonic Regions)', 'Custom bed',];
        }
        else if(this.buildName === 'GRCh37'){
          this.bedFile_type_exome = []; 
          this.bedFile_type_exome = ['Standard (GRCh37 Exonic Regions)', 'Custom bed'];
          this.bedFile_type_genome = [];
          this.bedFile_type_genome = ['No bed', 'Standard (GRCh37 Exonic Regions)', 'Custom bed',];
        }
        this.setField();
      }
    }
  };
</script>

