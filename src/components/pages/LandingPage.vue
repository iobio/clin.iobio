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
        </v-flex>
      </v-layout>
      
      
      <v-layout row wrap style="background:white">
        <v-container>
          <v-layout row wrap>
            <v-flex xs2>
              
              <v-list rounded>
                <v-subheader>
                  <strong style="font-size:18px">Workflow steps</strong>
                </v-subheader>
                <v-divider></v-divider>
                <v-list-item-group v-model="step_number" color="primary">
                  <v-list-item
                    v-for="(step, i) in workflow_steps"
                    :key="i"
                  >
                    <v-list-item-content @click="changeSlide(i)">
                      <v-list-item-title v-text="step.text"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-flex>
            <v-flex xs10>
              <hooper 
                :vertical="true" 
                style="height: 400px; background:white" 
                :itemsToShow="1" 
                :centerMode="true" 
                :transition="1050"
                ref="carousel"
                @slide="updateCarousel"
              >
                <hooper-progress slot="hooper-addons"></hooper-progress>
                <slide>
                  <v-container fluid>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <img style="width:700px;" src="./review_case.png" alt="review_case">
                      </v-flex>
                      <v-flex xs1></v-flex>
                      <v-flex xs4 class="mt-12">
                        <span class="i-hooper_text">Review case</span>
                        <br><br>
                        <span class="i-hooper_subheading">
                          Review relatedness, case description, and
                          data quality for your data
                        </span>
                      </v-flex>
                      <v-flex xs1></v-flex>
                    </v-layout>
                  </v-container>
                </slide>
                <slide >
                  <v-container fluid>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <img style="width:700px;" src="./review_phenotypes.png" alt="review_phenotypes">
                      </v-flex>
                      <v-flex xs1></v-flex>
                      <v-flex xs4 class="mt-12">
                        <span class="i-hooper_text">Review phenotypes</span>
                        <br><br>
                        <span class="i-hooper_subheading">
                          Review phenotypes from entered 
                          clinical notes and generate a prioritized 
                          gene list
                        </span>
                      </v-flex>
                      <v-flex xs1></v-flex>

                    </v-layout>
                  </v-container>

                </slide>
                <slide>
                  <v-container fluid>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <img style="width:700px;" src="./review_variants.png" alt="review_variants">
                      </v-flex>
                      <v-flex xs1></v-flex>
                      <v-flex xs4 class="mt-12">
                        <span class="i-hooper_text">Review variants</span>
                        <br><br>
                        <span class="i-hooper_subheading">
                          Review and mark variants as significant, 
                          Variants of unknown significance and 
                          Add notes
                        </span>
                      </v-flex>
                      <v-flex x1></v-flex>

                    </v-layout>
                  </v-container>

                </slide>

                <slide>
                  <v-container fluid>
                    <v-layout row wrap>
                      <v-flex xs6>
                        <img style="width:700px;" src="./findings.png" alt="Findings">
                      </v-flex>
                      <v-flex xs1></v-flex>
                      <v-flex xs4 class="mt-12">
                        <span class="i-hooper_text">Findings</span>
                        <br><br>
                        <span class="i-hooper_subheading">
                          Review results from all stages of the 
                          workflow and download report
                        </span>
                      </v-flex>
                      <v-flex xs1></v-flex>

                    </v-layout>
                  </v-container>

                </slide>
              </hooper>

            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
      
      
      <v-layout row wrap>
        
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
      carouselData: 0,
      step_number: 0,
      workflow_steps: [
        { text: 'Review case' },
        { text: 'Review phenotypes' },
        { text: 'Review variants' },
        { text: 'Findings' },
      ],
    }
  },
  methods:  {
    getStarted(){
      bus.$emit("initialize-clin")
    }, 
    updateCarousel(payload) {
      var currentSlide; 
      typeof payload === "number" ? currentSlide = payload : currentSlide = payload.currentSlide;
      console.log("currentSlide" ,currentSlide)
      this.carouselData = currentSlide;
      // this.step_number = currentSlide; 
    },
    changeSlide(step_number){
      console.log("changeSlide:", step_number); 
      this.carouselData = step_number;
    }
  },
  mounted: function() {

  },
  watch: {
    carouselData () {
      this.$refs.carousel.slideTo(this.carouselData);
      setTimeout(()=>{
        this.step_number = this.carouselData;
      },50)
      
    },
    step_number(){
    }
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
    
.i-hooper_text
  font-size: 36px !important
  font-family: poppins !important  
  font-weight: 300
  
.i-hooper_subheading
  font-size: 20px !important
  font-weight: 200
  
.hooper-progress-inner
  background-color: $app-button-color !important  
  height: 7px
  border-top-left-radius: 8px 
  border-bottom-left-radius: 8px

.hooper-progress
  height: 7px !important
  border-radius: 8px  
</style>

