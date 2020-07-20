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
        data: null
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
              this.$emit("ped-input-validation-errors");
              this.pedData = null;
            }
          }
        }
        else {
          this.$emit("load-ped-file", this.pedData);
        }
      },
      validatePedInput(data){
        let lines = data.split('\n');
        let firstLine = lines[0].trim().split(/\s+|\,/g);
        return firstLine.length >= 6; 
      }
    }
  };
</script>

