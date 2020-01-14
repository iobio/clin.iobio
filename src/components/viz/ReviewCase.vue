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


    <div v-if="launchedFromMosaic  && isSorted">
      <div style=" width: 100%; display: inline-flex; flex-direction: row; justify-content: space-around;">
        <div>Sample</div> <div>Read Coverage</div><div>Variant Type Distribution</div>
      </div>
      <div v-for="(d, i) in allVarCounts" >
        <div style=" width: 100%; display: inline-flex; flex-direction: row; justify-content: space-around;">

          <div class="sample">
            {{sampleIdsAndRelationships[i]}}
          <PedigreeGraph :data="allPedigreeDataArrays[i]" :id="sampleUuids[i]" :width="150" :height="150" :pedigree="pedigree"></PedigreeGraph>
          </div>
          <BarChart :data="coverageDataArray[i]" :width="400" :height="200" :x-domain="xDomain" :y-domain="yDomain" ></BarChart>
          <QualitativeBarChart :data="varCountsArray[i].counts" :width="300" :height="200"></QualitativeBarChart>

        </div>
     </div>
    </div>
  </div>
</template>

<script>
import PedigreeGraph from './PedigreeGraph.vue';
import AppIcon       from '../partials/AppIcon.vue';
import QualitativeBarChart from './QualitativeBarChart.vue'
import BarChart from './BarChart.vue'

export default {
  name: 'review-case',
  components: {
    QualitativeBarChart,
    BarChart,
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
    coverageHistos: null,
    launchedFromMosaic: null
  },
  data() {
    return {
      uuid: 10,
      sampleIds: null,
      sampleUuids: null,
      sampleIdsAndRelationships: null,
      pedigreeDataArray: null,
      allPedigreeDataArrays: null,
      coverageDataArray: null,
      xDomain: null,
      yDomain: null,
      sampleIdRelationshipMap: null,
      sortedIndices: null,
      varCountsArray: null,
      isSorted: false,

    }

  },

  mounted: function(){
    this.varCountsArray = this.allVarCounts;
    if(this.launchedFromMosaic) {
      this.populateRelationshipMap();
      this.formatPedigreeData();
      this.formatCoverageData();
      this.assignProbandToEachSample();
      this.populateDomains();
      this.sortIndicesByRelationship();
      this.sortData();
    }
  },

  methods: {

    sortData(){

      let tempPed = [null,null,null,null];
      let tempCoverage = [null,null,null,null];
      let tempVarCounts = [null,null,null,null];
      let tempSampleRelationship = [null,null,null,null];
      let tempSamples = [null,null,null,null];
      let tempUuids = [null,null,null,null];

      for(let i = 0; i < this.sortedIndices.length; i++){
        let index = this.sortedIndices[i];
        tempPed[index] = this.pedigreeDataArray[i];
        tempCoverage[index] = this.coverageDataArray[i];
        tempVarCounts[index] = this.varCountsArray[i];
        tempSampleRelationship[index] = this.sampleIdsAndRelationships[i];
        tempSamples[index] = this.sampleIds[i];
        tempUuids[index] = this.sampleUuids[i];
      }

      this.pedigreeDataArray = tempPed.filter(function(el) { return el; });
      this.coverageDataArray = tempCoverage.filter(function(el) { return el; });
      this.varCountsArray = tempVarCounts.filter(function(el) { return el; });
      this.sampleIdsAndRelationships = tempSampleRelationship.filter(function(el) { return el; });
      this.sampleIds = tempSamples.filter(function(el) { return el; });
      this.sampleUuids = tempUuids.filter(function(el) { return el; });

      this.isSorted = true;
    },

    sortIndicesByRelationship(){
      this.sortedIndices = [0,0,0,0];
      for(let i = 0; i < this.sampleIds.length; i++){
        let relationship = this.getRelationshipFromId(this.sampleIds[i]);
         if(relationship === "proband"){
           this.sortedIndices[0] = i;
         }
         else if(relationship === "mother"){
           this.sortedIndices[1] = i;
         }
         else if(relationship === "father"){
           this.sortedIndices[2] = i;
         }
         else{
           this.sortedIndices[3] = i;
         }
        }
    },

    getRelationshipFromId(id){
      if(this.sampleIdRelationshipMap.hasOwnProperty(id)){
        return this.sampleIdRelationshipMap[id];
      }
      return "relationship unknown";
    },

    populateRelationshipMap(){
      this.sampleIdRelationshipMap = {};
      for(let i = 0; i < this.modelInfos.length; i++){
        this.sampleIdRelationshipMap[this.modelInfos[i].sample] = this.modelInfos[i].relationship
      }
    },


    populateDomains(){
      let xMin = Math.min();
      let xMax = Math.max();
      let yMin = Math.min();
      let yMax = Math.max();

      for(let i = 0; i < this.coverageDataArray.length; i++){
        for(let j = 0; j < this.coverageDataArray[i].length; j++){
          if(parseInt(this.coverageDataArray[i][j][0]) < xMin){
            xMin = parseInt(this.coverageDataArray[i][j][0]);
          }
          if(parseInt(this.coverageDataArray[i][j][0]) > xMax) {
            xMax = parseInt(this.coverageDataArray[i][j][0]);
          }
          if(this.coverageDataArray[i][j][1] < yMin){
            yMin = this.coverageDataArray[i][j][1];
          }
          if(this.coverageDataArray[i][j][1] > yMax) {
            yMax = this.coverageDataArray[i][j][1];
          }
        }
      }
      this.xDomain = [xMin, xMax+1];
      this.yDomain =  [yMin, yMax];
    },

    formatPedDict(d){
      let sampleIdRelationship = this.getRelationshipFromId(d.vcf_sample_name) + '\t' + d.vcf_sample_name ;
      this.sampleIdsAndRelationships.push(sampleIdRelationship);
      this.sampleUuids.push(d.id);
      this.sampleIds.push(d.vcf_sample_name);
      let pedDict ={
        id: d.id,
        pedigree: {
          affection_status: d.affection_status,
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
      this.sampleUuids = [];
      this.sampleIdsAndRelationships = [];
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
