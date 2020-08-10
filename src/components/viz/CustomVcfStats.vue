<template>
  <div>
    {{ totalReads }} Variants sampled
    <QualitativeBarChart v-if="totalReads>0" :data="justVarCounts.counts" :customData="customData" :width="300" :height="150" style="padding-top: 0"></QualitativeBarChart>
  </div>
</template>


<script>
import QualitativeBarChart from './QualitativeBarChart.vue'
import BarChart from './BarChart.vue'
import Vcfiobio from '../../models/Vcf.iobio'
var vcfiobio = new Vcfiobio();

  export default {
    name: 'custom-vcf-stats',
    components: {
      QualitativeBarChart,
      BarChart,
    },
    props: {
      modelInfos: null,
      idx: null,
      customData: null,
    },
    data() {
      return {
        varCountsArray: [],
        statsReceived: false,
        justVarCounts: {},
        totalReads: 0,
        justVarCounts: {
          counts: {
            "SNP": 0,
            "INS": 0,
            "DEL": 0
          }
        }
      }
    },
    methods: {
      getVcfStats(refs, options, vcf, tbi, sample){
        return new Promise((resolve, reject) => {
          vcfiobio.getStats(refs, options, vcf, tbi, sample, function(data) {
            var obj = {
              sample: sample,
              data: data.var_type
            }
            resolve(obj)
          });
        })
      },
      
      justGetVcfStats(refs, options, vcf, tbi, sample, idx){

        vcfiobio.getStats(refs, options, vcf, tbi, sample, function(data) {
          console.log("data", data);
          var stats = data.var_type; 
          var indels = stats.INS + stats.DEL;
          var justVarCounts = {};
          var reads = data.TotalRecords

          justVarCounts.counts = {
            "SNP": stats.SNP,
            "INS": stats.INS,
            "DEL": stats.DEL
          }
          addToVarCounts(justVarCounts.counts, idx, reads, sample);
        });
        var addToVarCounts = ((justVarCounts, idx, reads, sample) => {
          // this.justVarCounts.counts = justVarCounts;
          this.totalReads = reads;
          this.justVarCounts = {
            counts: justVarCounts, 
            sample: sample,
          }
          this.$emit("variants-count", {
            counts: this.justVarCounts,
            idx: idx
          })
          // this.justVarCounts.counts = justVarCounts;

        })

      },
      
      getVarCountFromCustomData(modelInfos, idx){
        var options = {
          "samplingMultiplier": 1,
          "binSize": 80000,
          "binNumber": 50,
          "minFileSamplingSize": 1000000,
          "start": 1
        }

        var refs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        let promises = [];
        this.justGetVcfStats(refs, options, modelInfos.vcf, modelInfos.tbi, modelInfos.sample, idx)
        promises.push(this.getVcfStats(refs, options, modelInfos.vcf, modelInfos.tbi, modelInfos.sample))
        Promise.all(promises).then((results)=>{
          results.forEach(stats => {
            addToVarCountsArray(stats.data, stats.sample)
          })
        })
        
        var addToVarCountsArray = (stats, sample)=>{
          var indels = stats.INS + stats.DEL
          this.statsReceived = true;
          this.varCountsArray.push({
            "id":"3261",
            "sample": sample,
            "counts": {
              "SNP": stats.SNP,
              "INS": stats.INS,
              "DEL": stats.DEL
            }
          })
          // this.setVariantsCount(this.varCountsArray)
        }
      },
    }, 
    mounted(){
      this.getVarCountFromCustomData(this.modelInfos, this.idx);
    }

  }
</script>


<style>

</style>
