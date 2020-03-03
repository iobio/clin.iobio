<template>
  <div>
    <v-app-bar
      color="white"
      light
      dense
    >

      <v-toolbar-title>
        <strong>clin.iobio</strong>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

    </v-app-bar>
    
    <v-content>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <!-- <v-card> -->
            <v-responsive class="overview-jumbotron" :gradient="gradient">
              <v-container fluid fill-height>
                <v-layout row wrap>
                  <v-flex xs12 md12 sm12 lg1 xl1 ></v-flex>
                  <v-flex xs12 md12 sm12 lg5 xl5>
                    <v-flex text-xs-center class="i-hero_text">
                      <h1>
                        Workflow and reporting for 
                        variant analysis pipeline
                      </h1>
                      <br>
                      <span class="i-hero_subheading">
                        Clin.iobio lets you review case, 
                        generate gene list from phenotypes, review variants 
                        and generate report of your findings.   
                      </span>
                      <v-btn color="white" outlined x-large @click="getStarted" class="mt-8">
                        <v-icon>explore</v-icon> 
                        <span class="ml-2">Get started with demo data</span>
                      </v-btn>
                    </v-flex>
                  </v-flex>
                  <v-flex xs12 md12 sm12 lg1 xl1 ></v-flex>
                    <v-flex xs12 md12 sm12 lg5 xl5>
                      <v-flex text-xs-center>
                          <img style="margin-top:72px; right: 0; width:630px;" src="./clinical_art.svg" alt="Clinical art">
                      </v-flex>
                    </v-flex>
                </v-layout>
              </v-container>

            </v-responsive>
          <!-- </v-card> -->
        </v-flex>
        
        <hooper :vertical="true" style="height: 400px" :itemsToShow="1" :centerMode="true">
          <hooper-navigation slot="hooper-addons"></hooper-navigation>
          <hooper-progress slot="hooper-addons"></hooper-progress>
          <slide>
            slide 1
          </slide>
          <slide >
            slide 2
          </slide>
          <slide>
            slide 3
          </slide>

          <slide>
            slide 4
          </slide>
        </hooper>
        
        

      </v-layout>
    </v-content>

  </div>
</template>

<script>

import phenotypeIcon from '../partials/icons/phenotype-icon.vue'
import caseIcon      from '../partials/icons/case-icon.vue'
import findingsIcon  from '../partials/icons/findings-icon.vue'
import variantsIcon  from '../partials/icons/variants-icon.vue'
import { bus }       from '../../main'
import {
  Hooper,
  Slide,
  Progress as HooperProgress,
  Navigation as HooperNavigation
  } from 'hooper';
import 'hooper/dist/hooper.css';


export default {
  name: 'landing-page',
  components: {
    Hooper,
    Slide,
    HooperProgress,
    HooperNavigation
  },
  props: {
  },
  data () {
    let self = this;
    return {
      gradient: 'to top,  #0D47A1,#42A5F5',
    }
  },
  methods:  {
    getStarted(){
      console.log("initialize-clin")
      bus.$emit("initialize-clin")
    }
  },
  mounted: function() {

  },
  watch: {

  }
}
</script>


<style lang="sass">

@import ../../assets/sass/variables

.overview-jumbotron
  height: 530px !important
  background: radial-gradient(#30638E, #2D4B64)
  
.i-hero_text
  text-align: center  
  margin-top: 95px
  color: rgb(242, 242, 242)
  // padding: 10px
  
  .i-hero_subheading
    font-size: 20px
</style>

