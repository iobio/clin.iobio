<template>
  <div>
    <div v-if="totalReads>0" style="margin-left:70px">
      <span class="sampled-count">{{ totalReads | to-formatLabel}} </span>
      <span class="light">variants sampled</span>
    </div>
    <QualitativeBarChart v-if="totalReads>0" :data="varCounts.counts" :customData="customData" :width="300" :height="150" style="padding-top: 0"></QualitativeBarChart>
    <div v-if="totalReads===0">
      <SamplingLoader/>
    </div>
  </div>
</template>


<script>
import QualitativeBarChart from './QualitativeBarChart.vue'
import BarChart from './BarChart.vue'
import Vcfiobio from '../../models/Vcf.iobio'
var vcfiobio = new Vcfiobio();
import SamplingLoader from './SamplingLoader.vue'

  export default {
    name: 'custom-vcf-stats',
    components: {
      QualitativeBarChart,
      BarChart,
      SamplingLoader,
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
        totalReads: 0,
        varCounts: {
          counts: {
            "SNP": 0,
            "INS": 0,
            "DEL": 0
          }
        }
      }
    },
    methods: {
      getVcfStats(refs, options, vcf, tbi, sample, idx){

        vcfiobio.getStats(refs, options, vcf, tbi, sample, function(data) {
          var stats = data.var_type; 
          var indels = stats.INS + stats.DEL;
          var varCounts = {};
          var reads = data.TotalRecords

          varCounts.counts = {
            "SNP": stats.SNP,
            "INS": stats.INS,
            "DEL": stats.DEL
          }
          addToVarCounts(varCounts.counts, idx, reads, sample);
        });
        
        var addToVarCounts = ((varCounts, idx, reads, sample) => {
          this.totalReads = reads;
          this.varCounts = {
            counts: varCounts, 
            sample: sample,
          }
          this.$emit("variants-count", {
            counts: this.varCounts,
            idx: idx
          })
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
        this.getVcfStats(refs, options, modelInfos.vcf, modelInfos.tbi, modelInfos.sample, idx);
      },
    }, 
    mounted(){
      this.getVarCountFromCustomData(this.modelInfos, this.idx);
    }

  }
</script>


<style lang="sass" >
  
@import ../../assets/sass/variables

.sampled-count
  color: $sampling-text-color
  font-weight: 600
  font-size: 16px
  
</style>

