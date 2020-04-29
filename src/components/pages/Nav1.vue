<style lang="sass" scoped>

@import ../../assets/sass/variables



</style>
<template>
  <div>
    NAV1 | <span> <a @click="onShowFiles"> Files </a></span>
    
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

export default {
  components: {
    FilesDialog
  },
  props: {
    cohortModel: null,
  },
  data () {
    return {
      showFiles: false,
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

  }
}
</script>
