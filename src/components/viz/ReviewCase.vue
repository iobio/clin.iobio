<style lang="sass"  >

@import ../../assets/sass/variables

#review-case-panel
  padding: 5px 20px 5px 20px
  overflow-y: auto
  height: -webkit-fill-available
  height: -moz-available
  background-color:  white

  .avatar.big
    border: #d5d5d5 solid thin
    background-color: white
    color: $text-color
    margin-right: 7px


  .sample
    line-height: 15px
    font-size: 13px
    .rel
      display: inline-block
      width: 70px
    .name
      display: inline-block
      width: 100px

  .review-section
    margin-bottom: 30px
    padding-bottom: 35px

    .subsection
      margin-right: 50px

  .pedigree-graph
    margin-left: -5px !important
    margin-top:  5px !important
    svg
      g

        rect
          stroke: gray !important

  .card-title
    font-size: 18px
    color:   $app-header-color
    margin-bottom: 20px
    display: inline-block

  .card-heading
    display: inline-block
    font-size: 16px
    color:  $app-header-color
    margin-bottom: 10px

  .card-subheading
    display: inline-block
    font-size: 14px
    color:  $app-header-color
    margin-bottom: 10px


  .card
    min-height: 70px !important


</style>

<template>

  <div id="review-case-panel" >

      <span class="card-title">
        Review patient
      </span>

      <div style="display:flex;flex-flow:row">

        <div class="review-section">

          <div style="display:flex;flex-direction:row;justify-content:flex-start">
            <div  class="subsection"  >
              <span class="card-subheading">{{ caseSummary.name }} </span>
              <div style="display:flex">
                <div style="margin-left:15px">
                  <div  class="sample" v-for="modelInfo in modelInfos" :key="modelInfo.sample">
                    <span class="rel">{{ modelInfo.relationship }}</span>
                    <span class="name">{{ modelInfo.sample }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="subsection">
              <div v-if="false" class="card-subheading">Description</div>
              <div style="margin-top:30px;font-size:13px;line-height:15px;width:400px;white-space: normal">
                {{ caseSummary.description }}
              </div>
            </div>

            <div v-if="false" class="subsection">
              <div class="card-subheading">Condition / Phenotype Search Terms</div>
              <div v-for="(phenotype, index) in phenotypeList" class="phenotype-search-term">
                {{phenotype}}
              </div>
            </div>
          </div>
        </div>
      </div>

    <div v-for="(d, i) in allVarCounts" >
      <div style="display: inline-flex">
      {{sampleIds[i]}}
        <PedigreeGraph :data="allPedigreeDataArrays[i]" :id="sampleIds[i]" :width="200" :height="150" :pedigree="pedigree"></PedigreeGraph>
        <VariantType :data="allVarCounts[i].counts" :width="200" :height="150"></VariantType>
        <BarChart :data="coverageDataArray[i]" :width="200" :height="150"></BarChart>
      </div>
   </div>
  </div>
</template>

<script>
import PedigreeGraph from '../viz/PedigreeGraph.vue';
import AppIcon       from '../partials/AppIcon.vue';
import VariantType from '../viz/VariantType.vue'
import BarChart from '../viz/BarChart.vue'

export default {
  name: 'review-case',
  components: {
    BarChart,
    VariantType,
    PedigreeGraph,
    AppIcon
  },
  props: {
    workflow:    null,
    analysis:    null,
    caseSummary: null,
    modelInfos:  null,
    pedigree:    null,
    sampleId:    null,
    allVarCounts: null,
    coverageHistos: null
  },
  data() {
    return {
      uuid: 10,
      sampleIds: null,
      pedigreeDataArray: null,
      allPedigreeDataArrays: null,
      coverageDataArray: null,
    }

  },

  mounted: function(){
    this.formatPedigreeData();
    this.formatCoverageData();
    this.assignProbandToEachSample();
  },

  methods: {
    formatPedDict(d){
      this.sampleIds.push(d.pedigree.sample_id);
      let pedDict ={
        id: d.id,
        pedigree: {
          affection_status: 1,
          maternal_id: d.maternal_id,
          paternal_id: d.paternal_id,
          sample_id: d.sample_id,
          sex: d.sex
        }
      };
      return pedDict;
    },

    formatCoverageArray(d){
      let coverageArr = [];
      for(let k in d){
        const coords = [k, d[k]];
        coverageArr.push(coords);
      }
      return coverageArr;
    },

    formatPedigreeData(){
      this.pedigreeDataArray = [];
      this.sampleIds = [];
      for(const k in this.pedigree){
        const pedDict = this.formatPedDict(this.pedigree[k]);
        this.pedigreeDataArray.push(pedDict);
      }
    },

    formatCoverageData(){
      let self = this;
      self.coverageDataArray = [];
      this.coverageHistos.forEach(function(d){
        const coverageArr = self.formatCoverageArray(d.coverage);
        self.coverageDataArray.push(coverageArr);
      });
    },

    assignProbandToEachSample(){
      this.allPedigreeDataArrays = [];
      for(let i = 0; i < 4; i++){
        this.allPedigreeDataArrays.push(this.pedigreeDataArray);
      }
    }
  },
  computed: {

  },
  watch: {
    coverageHistos: function(){
    },
    allVarCounts: function(){
    },
    pedigree: function(){
    }
  },
}
</script>
