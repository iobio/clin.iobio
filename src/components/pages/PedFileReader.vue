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
          reader.onload = () => this.$emit("load-ped-file", reader.result)
        }
        else {
          this.$emit("load-ped-file", this.pedData);
        }
      }
    }
  };
</script>

