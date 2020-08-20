<template>
  <div class="text-reader">
    <v-file-input 
      accept=".txt, .ped" 
      label="Ped file input" 
      v-model="pedData" 
      @change="loadTextFromFile"
      show-size counter>
      <template v-slot:selection="{ text }">
        <v-chip
          label
          color="primary"
        >
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>
  </div>
</template>

<script>
  export default {
    name: 'ped-file-reader',
    data(){
      return {
        pedData: null, 
        data: null,
        errMessage: [],
      }
    }, 
    methods: {
      loadTextFromFile(ev) {
        var reader = new FileReader();
        if(this.pedData){
          reader.readAsText(this.pedData);
          reader.onload = () => {
            if(this.validatePedInput(reader.result)){
              this.$emit("load-ped-file", reader.result)
            }
            else{
              this.$emit("ped-input-validation-errors", this.errMessage);
              this.pedData = null;
            }
          }
        }
        else {
          this.$emit("load-ped-file", this.pedData);
        }
      },
      validatePedInput(data){
        this.errMessage = [];
        let lines = data.split('\n');
        let firstLine = lines[0].trim().split(/\s+|\,/g);
        if(firstLine.length >= 6){
          return this.validateSampleIds(data);
        }
        else {
          var error_msg = "The file does not contain the number of mandatory columns. Please check the input file and try again";
          this.errMessage.push(error_msg);
          return false;
        }
      },
      validateSampleIds(data){
        let bool = true;
        let pedLines = data.split('\n');
        let sampleIds = [];
        let maternal_ids = [];
        let paternal_ids = [];
        let ids_gender_map = {};
        this.errMessage = [];
        
        for (let i = 0; i < pedLines.length; i++) {
          let splitLine = pedLines[i].split(/\s+|\,/g)
          if(splitLine && splitLine[0] !== "" && !isNaN(parseInt(splitLine[4]))) {
            sampleIds.push(splitLine[1]);
            ids_gender_map[splitLine[1]] = splitLine[4]; 
            
            if(splitLine[2] != "0" && splitLine[3] != "0" && splitLine[2] === splitLine[3]){ //Checks for duplicate sample ids of parents.
              bool = false;
              var error_msg = `Maternal and paternal ids are identical for sample ${splitLine[1]}. Please ensure these ids correctly represent the samples for mother and father.`;
              this.errMessage.push(error_msg);
            }
            if(splitLine[2] != "0"){
              paternal_ids.push(splitLine[2]); 
            }
            if(splitLine[3] != "0"){
              maternal_ids.push(splitLine[3]);
            }
          }
        }
        
        
        for (let i = 0; i < pedLines.length; i++) {
          let splitLine = pedLines[i].split(/\s+|\,/g)
          if(splitLine && splitLine[0] !== "" && !isNaN(parseInt(splitLine[4]))) {
            var current_sample = splitLine[1];
            var paternal_id = splitLine[2];
            var maternal_id = splitLine[3]; 
            
            if(paternal_id != "0"){
              if(!sampleIds.includes(paternal_id)){
                bool = false;
                var error_msg = `Sample ${current_sample} has paternal id ${paternal_id}, but this sample is not present in the ped. Please ensure that the paternal id is entered correctly, and if so, that this sample has their own row in the ped file`
                this.errMessage.push(error_msg)
              }
              if(ids_gender_map[paternal_id] == "2"){
                bool = false;
                var error_msg = `Sample ${paternal_id} is listed as the father of sample ${current_sample}, but is listed as being female. Please ensure that the paternal id for sample ${current_sample} is correct, and if so, ensure that the sex of sample ${paternal_id} is listed as male.`
                this.errMessage.push(error_msg)
              }
            }
            
            if(maternal_id != "0"){
              if(!sampleIds.includes(maternal_id)){
                bool = false;
                var error_msg = `Sample ${current_sample} has maternal id ${maternal_id}, but this sample is not present in the ped. Please ensure that the maternal id is entered correctly, and if so, that this sample has their own row in the ped file`
                this.errMessage.push(error_msg)
              }
              if(ids_gender_map[maternal_id] == "1"){
                bool = false;
                var error_msg = `Sample ${maternal_id} is listed as the mother of sample ${current_sample}, but is listed as being male. Please ensure that the maternal id for sample ${current_sample} is correct, and if so, ensure that the sex of sample ${maternal_id} is listed as female.`
                this.errMessage.push(error_msg)
              }
            }
            
          }
        }
        
        return bool;
      },
    }
  };
</script>

