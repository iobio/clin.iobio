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
            console.log("reader.result", reader.result);
            
            if(this.validateCsvImport(reader.result.trim())) {
              this.importRecords = VariantImporter.parseRecordsCSV(reader.result);
              this.$emit("load-variants", this.importRecords);
            }
            else {
              this.$emit("imported-variants-validation-errors");
              this.variantsData = null;
            }
          }
        }
        else {
          this.$emit("load-variants", []);
        }
      },
      validateCsvImport(data){
        let fields = ['chrom', 'start', 'end', 'ref', 'alt', 'gene', 'transcript']; 
        
        let bool = true; 
        let lines = data.split('\n');
        let firstLine = lines[0].trim().split(/\s+|\,/g);
        
        for(let i=0; i<firstLine.length; i++){
          firstLine[i] = firstLine[i].replace(/""/g, '').replace(/^"(.*)"$/, '$1')
        }
        
        for(let i=0; i<fields.length; i++){
          if(!firstLine.includes(fields[i])){
            bool = false;
            break;
          }
        }
        return bool;
      }
    }, 

  };
</script>

