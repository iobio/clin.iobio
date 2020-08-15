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
        errMessage: "",
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
        this.errMessage = "";
        let lines = data.split('\n');
        let firstLine = lines[0].trim().split(/\s+|\,/g);
        if(firstLine.length >= 6){
          return this.validateSampleIds(data);
        }
        else {
          this.errMessage = "The file does not contain the number of mandatory columns. Please check the input file and try again";
          return false;
        }
      },
      validateSampleIds(data){
        let bool = true;
        let pedLines = data.split('\n');
        let sampleIds = [];
        let maternal_ids = [];
        let paternal_ids = [];
        
        for (let i = 0; i < pedLines.length; i++) {
          let splitLine = pedLines[i].split(/\s+|\,/g)
          if(splitLine && splitLine[0] !== "" && !isNaN(parseInt(splitLine[4]))) {
            sampleIds.push(splitLine[1]);
            if(splitLine[2] != "0"){
              paternal_ids.push(splitLine[2]); 
            }
            if(splitLine[3] != "0"){
              maternal_ids.push(splitLine[3]);
            }
          }
        }
        for(let i=0; i<paternal_ids.length; i++){
          if(!sampleIds.includes(paternal_ids[i])){
            bool = false;
            this.errMessage = "Incorrect sample id's entered for parents. Please correct and try again."
            return bool;
          }
        }
        
        for(let i=0; i<maternal_ids.length; i++){
          if(!sampleIds.includes(maternal_ids[i])){
            bool = false;
            this.errMessage = "Incorrect sample id's entered for parents. Please correct and try again."
            return bool;
          }
        }
        return bool;
      },
    }
  };
</script>

