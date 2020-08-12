<template>
  <div>
  </div>
</template>


<script>
import QualitativeBarChart from './QualitativeBarChart.vue'
import BarChart from './BarChart.vue'
import { BamStats } from '../../models/BamStats.iobio.js';
import Vue from 'vue';


  export default {
    name: 'custom-bam-stats',
    components: {
      QualitativeBarChart,
      BarChart,
    },
    props: {
      modelInfos: null,
      idx: null,
      customData: null,
      bedFileData: null,
    },
    data() {
      return {
        coverageHistosData: {},
        selectedBamURL: "http://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam",
        backendSource: "backend.iobio.io",
        showFullURL: false,
        siblingCount: 0,

        // default sampling values
        binNumber: 20,
        binSize: 40000,
        sampleMultiplier: 1,
        sampleMultiplierLimit: 4,
        totalReads: 0,

        exomeSampling: false,
        draw: false,

        sampleStats: {},

        readDepthConversionRatio: 0,

        bam: {},
        // bed: {},
        bed: null,
        readDepthChartData: [],
        references: [],

        selectedSeqId: 'all',
        coverageBrushRange: {},

        // Percent Chart Data
        mappedReadsData: [],
        forwardStrandsData: [],
        properPairsData: [],
        singletonsData: [],
        bothMatesData: [],
        duplicatesData: [],

        // Histogram Chart Data
        readOutliers: false,
        readCoverageData: [],
        lengthData: [],
        qualityData: [],

        lengthXAxisLabel: 'Fragment Length',
        qualityXAxisLabel: 'Mapping Quality',

        // this is used to achieve a "natural sort". see
        // https://stackoverflow.com/a/38641281/943814
        sorter: new Intl.Collator(undefined, {
          numeric: true,
          sensitivity: 'base'
        }),

        coverageMean: 0,
        bamCounter: 0,
        total_reads: 0,
      }
    },
    methods: {
      
      loadBamStats: function(selectedBamURL, selectedBaiURL, sample, idx) {
          // let bed = undefined;
          let bed = this.bed;
          // this.selectedBaiURL = undefined;
          let bam = {}
          if (selectedBamURL && selectedBamURL != '' ) {
            bam = new BamStats(this.backendSource, selectedBamURL, {
              bai: selectedBaiURL
            });

            this.goBam(this.region, bam, bed, idx);
          }
      },

      goBam: function (region, bam, bed, idx) {
        let refIndex = 0;

        bam.getHeader().then((header) => {
          this.references = header.sq.filter((sq) => {
            return !filterRef(sq.name);
          })
          .map((sq) => {
            return {
              id: sq.name,
              length: sq.end,
            };
          });
        });

        // get read depth
        bam.estimateBaiReadDepth((name, index, ref) => {

            // turn off read depth loading msg

            if (ref.depths.length > 0 && !filterRef(name)) {
              // Have to use Object.freeze here to prevent Vue from
              // recursively setting up data listeners, which causes huge
              // performance issues with data this big.
              Vue.set(this.readDepthChartData, index, Object.freeze(ref.depths));

              if (!this.draw) {
                this.draw = true;
              }
            }
          },
          function doneCallback() {

          const keys = Object.keys(bam.readDepth);

          const allPoints = keys
            //.sort(this.sorter.compare)
            .filter(function (key) {
              if (filterRef(key))
                return false
              if (bam.readDepth[key].depths.length > 0)
                return true
            }.bind(this))
            .map(function (key) {
              return {
                name: key,
                data: bam.readDepth[key].depths,
                sqLength: bam.readDepth[key].sqLength,
              }
            }.bind(this));

          allPoints
            .sort((a, b) => this.sorter.compare(a.name, b.name));

          var start = region ? region.start : undefined;
          var end = region ? region.end : undefined;

          bam.getHeader().then(() => {
            // Set selected seq & region
            if (!region || (region && region.chr == 'all'))
              this.setSelectedSeq('all', start, end, bam, bed, idx);
            else
              this.setSelectedSeq(region.chr, start, end, bam, bed, idx);
          });

        }.bind(this),
        (err) => {
          this.$emit('error');
        })
      },


      setSelectedSeq: function (selected, start, end, bam, bed, idx) {
        this.selectedSeqId = selected;

        var seqDataIds = this.getSelectedSeqIds(bam, bed, idx);

        // start sampling
        if (start != undefined && end != undefined) {
          this.goSampling({sampling: this.sampling, sequenceNames: seqDataIds, 'start': start, 'end': end});
          this.draw = false; // force re-draw so brush region is set correctly
          setTimeout(function () {
            this.setBrush(start, end)
            this.draw = true;
          }.bind(this), 200);
        } else {
          this.goSampling({sampling: this.sampling, sequenceNames: seqDataIds},bam, bed, idx);
        }
      },


      getSelectedSeqIds: function (bam, bed, idx) {
        if (this.selectedSeqId == 'all') {
          return Object.keys(bam.readDepth)
            .filter(function (key) {
              if (filterRef(key))
                return false
              if (bam.readDepth[key].depths.length > 0)
                return true
            }.bind(this))
        } else
          return [this.selectedSeqId];
      },

      goSampling: function (options, bam, bed, idx) {
        // add default options
        options = $.extend({
          exomeSampling: this.exomeSampling, //'checked' == $("#depth-distribution input").attr("checked"),
          bed: bed,
          onEnd: function () {
          }
        }, options);

        this.totalReads = 0;

        // update selected stats
        bam.sampleStats(function (data, error, end) {
          if ( error!=undefined && error!='' ){
            alert(error);
          }
          else {

            this.sampleStats = data.coverage_hist;
            this.bamCounter = this.bamCounter+1;
            // console.log("total stats", data.total_reads);
            // console.log("sample sets data in review case", data, " and idx is :", idx)
            // resolve(this.sampleStats)
            this.addCoverageData(data, idx); 
          }
        }.bind(this), options);
      },
      
      addCoverageData: function(stats, idx){
        this.coverageHistosData = {
          "coverage": stats.coverage_hist,
        }
        this.total_reads = stats.total_reads;
        // console.log("total_reads in custom page", total_reads);
        // this.$emit("coverage-reads-count", {
        //   coverageHistosData: this.coverageHistosData,
        //   idx: idx,
        //   total_reads: total_reads
        // })
        
        this.toFormatCoverage(idx)
      },
      
      toFormatCoverage(idx){
        this.formatCoverageData(idx);
        this.populateDomains();

      },
      
      formatCoverageData(idx){
        let self = this;
        self.coverageDataArray = [];
        const coverageArr = self.formatCoverageArray(this.coverageHistosData.coverage);
        // console.log("coverageArr", coverageArr, " id : ", idx);
        this.$emit("coverage-reads-count", {
          coverageArr,
          idx,
          total_reads: this.total_reads
        })
        // this.coverageHistosData.forEach(function(d){
        //   const coverageArr = self.formatCoverageArray(d.coverage);
        //   self.coverageDataArray.push(coverageArr);
        // });
      },
      
      getBamStatsFromCustomData: function(modelInfos, idx){
        this.loadBamStats(modelInfos.bam, modelInfos.bai, modelInfos.sample, idx)

        // Promise.all(promises).then((results) => {
        //   results.forEach(stats => {
        //     addToCoverageDataArray(stats)
        //   })
        //   // toFormatCoverage()
        // })

        // var addToCoverageDataArray = (stats) => {
        //   console.log("stats bam - ", stats);
        //   this.coverageHistosData.push({
        //     "id":"3261",
        //     "coverage": stats
        //   })
          // this.setCoverageData(this.coverageHistosData);
          //When coverageData is read from analysis object, it will still need to call the format functions
        // }

        var toFormatCoverage = () => {
          this.formatCoverageData();
          this.populateDomains();
          this.populateCoverageMedians();
          this.populateBadCoverageCount();
          this.coverageStatsReceived = true
        }

      },
      
      formatCoverageArray(d){
        let coverageArr = [];
        for(let k in d){
          const coords = [k, d[k]];
          coverageArr.push(coords);
        }
        return coverageArr;
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
    }, 
    mounted(){
      this.bed = this.bedFileData;
      this.getBamStatsFromCustomData(this.modelInfos, this.idx);
    },
  }
  
  const validRefs = {};
  for (let i = 1; i <= 22; i++) {
    validRefs[i] = true;
    validRefs['chr' + i] = true;
  }
  validRefs['X'] = true;
  validRefs['Y'] = true;

  function filterRef(ref) {
    return validRefs[ref] === undefined;
  }

</script>


<style>

</style>
