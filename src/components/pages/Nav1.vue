<style lang="sass" scoped>

@import ../../assets/sass/variables



</style>
<template>
  <div>
    NAV1 | <span> <a @click="onShowFiles"> Files </a></span>
    
    <!-- <vcf-form
          :cohortModel="cohortModel"
          :dataType="getDataType('vcf')"
          :fileType="getFileType('vcf')"
          :slideBackground="slideBackground"
          :modelInfoList="modelInfoList"
          :allDataModels="DATA_MODELS"
          :maxSamples="MAX_SAMPLES"
          :uploadedUrl="uploadedVcfUrl"
          :uploadedIndexUrl="uploadedTbiUrl"
          :parentModelInfoIdx="modelInfoIdx"
>
</vcf-form> -->
    
    <files-dialog
      v-if="showFiles"
     :cohortModel="cohortModel"
     :showDialog="showFiles"
     @on-files-loaded="onFilesLoaded"
     @load-demo-data="onLoadDemoData"
     @on-cancel="showFiles = false"
     @isDemo="onIsDemo"
    >
    </files-dialog>
  </div>
</template>

<script>
import FilesDialog from '../partials/FilesDialog.vue'
import VcfForm from './VcfForm.vue'
export default {
  components: {
    FilesDialog,
    VcfForm
  },
  props: {
    cohortModel: null,
  },
  data () {
    return {
      showFiles: false,
      slideBackground: 'white',
      modelInfoList: [],
      DATA_MODELS: [
          'vcf',
          'coverage',
          'cnv',
          'rnaSeq',
          'atacSeq'
      ],
      DATA_DESCRIPTORS: [
    'Variant Calls',
    'Read Coverage',
    'Copy Number',
    'Raw RNAseq',
    'Raw ATACseq'
],                FILE_DESCRIPTORS: [
                    'vcf',
                    'bam',
                    'cnv',
                    'bam',
                    'bam'
                ],
      MAX_SAMPLES: 6,
      uploadedVcfUrl: null,
      uploadedTbiUrl: null,
      uploadedSelectedSamples: [],
      modelInfoIdx: 0
    }
  }, 
  methods: {
    onShowFiles: function() {
      console.log("show files")
      this.showFiles = true;
    },
    onFilesLoaded: function(analyzeAll) {
      this.showFiles = false;
      this.$emit("on-files-loaded", analyzeAll);
    },
    onLoadDemoData: function(loadAction) {
      this.$emit("load-demo-data", loadAction);
    },
    onIsDemo: function(bool){
      this.$emit("isDemo", bool);
    },
    getDataType: function (type) {
    let idx = this.DATA_MODELS.indexOf(type);
    return this.DATA_DESCRIPTORS[idx];
},
getFileType: function (type) {
    let idx = this.DATA_MODELS.indexOf(type);
    if (idx < 0) {
        return 'summary';
    }
    return this.FILE_DESCRIPTORS[idx];
},

  }
}
</script>
