<template>
  <div style="height:150px; width:450px">
    <div class="samplingloader">
      <center>Sampling <img class="ml-2 samplingloader_img" :src="loadingDots"/></center>
    </div>
  </div>
</template>


<script>
import loadingDots from '../../assets/images/loading_dots.gif' 

  export default {
    name: 'sampling-loader',
    components: {
    },
    props: {
    },
    data() {
      return {
        loadingDots: loadingDots,
      }
    },
    methods: {

    }, 
    mounted(){
    }

  }
</script>


<style lang="sass" >
  
@import ../../assets/sass/variables

.samplingloader
  color: $sampling-text-color
  padding-top: 70px
  
.samplingloader_img  
  height: 12px
  
</style>
