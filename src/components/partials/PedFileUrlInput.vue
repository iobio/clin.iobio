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
        errMessage: "",
      }
    }, 
    methods: {
      isValidUrl(url){
        var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/; 
        var regex = new RegExp(expression);
        return url.match(regex); 
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
        let ids_gender_map = {};
        
        for (let i = 0; i < pedLines.length; i++) {
          let splitLine = pedLines[i].split(/\s+|\,/g)
          if(splitLine && splitLine[0] !== "" && !isNaN(parseInt(splitLine[4]))) {
            sampleIds.push(splitLine[1]);
            ids_gender_map[splitLine[1]] = splitLine[4]; 
            
            if(splitLine[2] != "0" && splitLine[3] != "0" && splitLine[2] === splitLine[3]){ //Checks for duplicate sample ids of parents.
              bool = false;
              this.errMessage = "Duplicate sample id's entered for parents. Please correct and try again."
              return bool;
            }
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
          if(ids_gender_map[paternal_ids[i]] == "2"){
            bool = false;
            this.errMessage = "Sample id's are incorrectly mapped for parents. Please correct and try again."
            return bool;
          }
        }
        
        for(let i=0; i<maternal_ids.length; i++){
          if(!sampleIds.includes(maternal_ids[i])){
            bool = false;
            this.errMessage = "Incorrect sample id's entered for parents. Please correct and try again."
            return bool;
          }
          if(ids_gender_map[maternal_ids[i]] == "1"){
            bool = false;
            this.errMessage = "Sample id's are incorrectly mapped for parents. Please correct and try again."
            return bool;
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
             .catch(error => console.log(error))
        }
        else {
          this.pedData = null;
          this.$emit("on-ped-url-change", this.pedData);
        }
      }, 100),
    }, 

  };
</script>

