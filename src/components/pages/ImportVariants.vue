<template>
  <div>
    <v-file-input 
      accept=".csv" 
      label="Import variants" 
      v-model="variantsData" 
      @change="loadVariants"
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
import VariantImporter from '../../models/VariantImporter'

  export default {
    name: 'import-variants',
    data(){
      return {
        variantsData: null,
        importRecords: null,
      }
    }, 
    methods: {
      loadVariants(ev){
        var reader = new FileReader();
        if(this.variantsData){
          reader.readAsText(this.variantsData);
          reader.onload = () => {
            console.log("reader.result", reader.result);
            this.importRecords = VariantImporter.parseRecordsCSV(reader.result);
            this.$emit("load-variants", this.importRecords);
          }
        }
      }
    }, 

  };
</script>

