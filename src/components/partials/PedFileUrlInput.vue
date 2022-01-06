<template>
  <div>
    <v-text-field
      name="pedUrlInput"
      label="Enter URL for ped file"
      prepend-icon="link"
      hide-details
      v-model="pedUrl"
      :rules="urlRules"
      @change="onPedUrlChange"
      type="url"
    ></v-text-field>
  </div>
</template>

<script>
  export default {
    name: 'ped-file-url-input',
    data(){
      return {
        pedData: null, 
        pedUrl: '',
        urlRules: [
          v => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v) || 'URL must be valid',
        ],
        errMessage: [],
      }
    }, 
    methods: {
      isValidUrl(url){
        var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/; 
        var regex = new RegExp(expression);
        return url.match(regex); 
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
      onPedUrlChange: _.debounce(function (url) {
        if(url && url.length > 0 && this.isValidUrl(url)){
          fetch(url)
            .then(res => {
              if(!res.ok){
                alert("Please enter a correct URL or a presigned URL that can be accessed."); 
              }
              else{
                return res.text(); 
              }
            })
             .then(ped => {
               this.pedData = ped;
               if(this.validatePedInput(this.pedData)){
                 this.$emit("on-ped-url-change", this.pedData);
               }
               else{
                 this.$emit("ped-input-validation-errors");
                 this.pedData = null;
                 this.pedUrl = '';
               }
               // this.buildPedFromTxt(this.pedData);
             })
             .catch(error => {
                console.log(error)
                this.pedData = null
                alert("Please enter a correct URL or a presigned URL that can be accessed."); 
                this.$emit("ped-input-url-error", error)
             })
        }
        else {
          this.pedData = null;
          this.$emit("on-ped-url-change", this.pedData);
        }
      }, 100),
    }, 

  };
</script>

