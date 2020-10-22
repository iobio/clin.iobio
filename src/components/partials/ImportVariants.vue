<template>
  <div>
    <v-file-input 
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
            if(ev.type === "text/csv"){ //Checks if file format is csv
              if(this.validateCsvImport(reader.result.trim())) {
                this.importRecords = VariantImporter.parseRecordsCSV(reader.result);
                console.log("this.importRecords", this.importRecords);
                this.$emit("load-variants", this.importRecords);
              }
              else {
                this.$emit("imported-variants-validation-errors");
                this.variantsData = null;
              }
            }
            else {
              this.parseVCFfile(reader.result.trim())
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
      },
      parseVCFfile(data){
        let lines = data.split('\n');
        var idx = 0;
        for(let i=0; i<lines.length; i++){
          if(lines[i].includes('#CHROM')){
            idx = i; 
            break;
          }
          else {
            // TODO: does not include chromose position, so invalid VCF and show error msg
          }
        }
        
        var importRecords = [];
        let variants_data = lines.slice(idx+1); 
        for (var i = 0; i < variants_data.length; i++) {
          let splitLine = variants_data[i].split('\t');
          console.log("splitLine", splitLine);
          var importRec = {};
          importRec.chrom = splitLine[0];
          // importRec.start = splitLine[1];
          // importRec.end = splitLine[1];
          importRec.ref = splitLine[3];
          importRec.alt = splitLine[4];
          // importRec.filtersPassed = "notCategorized";
          importRec.variantSet = "notCategorized";
          importRec.isImported = true;
          
          var info_data = splitLine[7].split("IOBIO=")[1].split("|");
          console.log("info_data", info_data);
          
          var start = info_data[0].replace("start#", "").trim();
          start !== '.' ? importRec.start = start : importRec.start = splitLine[1];

          var end = info_data[1].replace("end#", "").trim();
          end !== '.' ? importRec.end = end : importRec.end = splitLine[1];

          var geneName = info_data[2].replace("geneName#", "").trim();
          importRec.gene = geneName;

          var filtersPassed = info_data[5].replace("filtersPassed#", "").trim();
          filtersPassed !== '.' ? importRec.filtersPassed = filtersPassed : importRec.filtersPassed = '';

          var consequence = info_data[11].replace("consequence#", "").trim();
          consequence !== '.' ? importRec.consequence = consequence : importRec.consequence = '';
          
          var inheritance = info_data[15].replace("inheritance#", "").trim();
          inheritance !== '.' ? importRec.inheritance = inheritance : importRec.inheritance = null;

          
          var afgnomAD = info_data[14].replace("afgnomAD#", "").trim();
          afgnomAD !== '.' ? importRec.afgnomAD = afgnomAD : importRec.afgnomAD = '';

          var impact = info_data[8].replace("impact#", "").trim();
          impact !== '.' ? importRec.highestImpact = impact : importRec.highestImpact = '';

          importRecords.push(importRec);

        }
        
        this.$emit("load-variants", importRecords);
      }
    }, 

  };
</script>

