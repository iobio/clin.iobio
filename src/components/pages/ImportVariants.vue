<template>
  <div>
    <v-file-input 
      accept=".csv" 
      label="  Import variants (.csv)" 
      v-model="variantsData" 
      @change="loadVariants"
      show-size counter
      prepend-icon="fas fa-upload"
      :disabled="genes.length>2">
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
    props: {
      genes: null,
    },
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
            this.importRecords = VariantImporter.parseRecordsCSV(reader.result);
            this.$emit("load-variants", this.importRecords);
          }
        }
        else {
          this.$emit("load-variants", []);
        }
      }
    }, 

  };
</script>

