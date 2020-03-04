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

      <!-- <v-btn text>
        Legend
      </v-btn> -->
      
      <v-btn class="ml-2" outlined color="rgb(69, 69, 69)">
        <v-icon>play_circle_outline</v-icon>
        <span class="ml-1" @click.stop="videoDialog = true">Watch video</span>
      </v-btn>
      
      <!-- <a href="https://mosaic.chpc.utah.edu/" target="_blank">
        <v-btn class="ml-2" outlined color="primary">
          <span >Launch with Mosaic</span>
        </v-btn>
      </a> -->


      <v-btn text disabled>
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
                        A comprehensive variant analysis workflow
                      </h1>
                      <br>
                      <span class="i-hero_subheading">
                        clin.iobio allows you to review sequencing and case metrics, generate a prioritized list of genes most highly associated with the disease/phenotype, review and mark variants as significant, and generate a report of your findings.   
                      </span>
                      <br>
                      <v-btn color="white" outlined x-large @click="getStarted" class="mt-8">
                        <v-icon>explore</v-icon> 
                        <span class="ml-2">Try it with demo data</span>
                      </v-btn>
                    </v-flex>
                  </v-flex>
                  <v-flex xs12 md12 sm12 lg1 xl1 ></v-flex>
                    <v-flex xs12 md12 sm12 lg5 xl5>
                      <v-flex text-xs-center>
                          <img class="hidden-md-and-down clinical_art" src="./clinical_art.svg" alt="Clinical art">
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
            <v-flex xs12 sm12 md2 lg2 xl2>
              
              <v-list rounded class="hidden-sm-and-down">
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
            <v-flex xs12 sm12 md10 lg10 xl10>
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
                      <v-flex xs12 sm12 md6 lg6 xl6>
                        <img class="i-hooper_img hidden-sm-and-down" src="./review_case.png" alt="review_case">
                      </v-flex>
                      <v-flex xs12 sm12 md1 lg1 xl1></v-flex>
                      <v-flex xs12 sm12 md5 lg4 xl4 class="i-hooper_text_margin_top">
                        <span class="step-heading-icon"><case-icon/></span>
                        <span class="i-hooper_text">Review case</span>
                        <br><br><br>
                        <span class="i-hooper_subheading">
                          Review relatedness, disease/phenotype description, and data quality
                        </span>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg1 xl1></v-flex>
                    </v-layout>
                  </v-container>
                </slide>
                <slide >
                  <v-container fluid>
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md6 lg6 xl6>
                        <img class="i-hooper_img hidden-sm-and-down" src="./review_phenotypes.png" alt="review_phenotypes">
                      </v-flex>
                      <v-flex xs12 sm12 md1 lg1 xl1></v-flex>
                      <v-flex xs12 sm12 md5 lg4 xl4 class="i-hooper_text_margin_top">
                        <span class="step-heading-icon"><phenotype-icon/></span>
                        <span class="i-hooper_text">Review phenotypes</span>
                        <br><br><br>
                        <span class="i-hooper_subheading">
                          Enter a clinical note and select suspected disorders and phenotypes to generate a prioritized gene list
                        </span>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg1 xl1></v-flex>

                    </v-layout>
                  </v-container>

                </slide>
                <slide>
                  <v-container fluid>
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md6 lg6 xl6>
                        <img class="i-hooper_img hidden-sm-and-down" src="./review_variants.png" alt="review_variants">
                      </v-flex>
                      <v-flex xs12 sm12 md1 lg1 xl1></v-flex>
                      <v-flex xs12 sm12 md5 lg4 xl4 class="i-hooper_text_margin_top">
                        <span class="step-heading-icon"><variants-icon/></span>
                        <span class="i-hooper_text">Review variants</span>
                        <br><br><br>
                        <span class="i-hooper_subheading">
                          Review variants and mark them as significant or uncertain. And add notes for collaborators!
                        </span>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg1 xl1></v-flex>

                    </v-layout>
                  </v-container>

                </slide>

                <slide>
                  <v-container fluid>
                    <v-layout row wrap>
                      <v-flex xs12 sm12 md6 lg6 xl6>
                        <img class="i-hooper_img hidden-sm-and-down" src="./findings.png" alt="Findings">
                      </v-flex>
                      <v-flex xs12 sm12 md1 lg1 xl1></v-flex>
                      <v-flex xs12 sm12 md5 lg4 xl4 class="i-hooper_text_margin_top">
                        <span class="step-heading-icon"><findings-icon/></span>
                        <span class="i-hooper_text">Findings</span>
                        <br><br><br>
                        <span class="i-hooper_subheading">
                          Look over all aspects of the workflow and reviewed variants and generate a downloadable report
                        </span>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg1 xl1></v-flex>

                    </v-layout>
                  </v-container>

                </slide>
              </hooper>

            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
      
      
      <v-dialog
        v-model="videoDialog"
        max-width="600"
      >
        <v-card>
       
          <v-card-title class="headline"></v-card-title>

          <v-card-text v-if="videoDialog">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/g43CsDVfJIo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="primary darken-1"
              text
              @click="videoDialog = false"
            >
              Close
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
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
    HooperNavigation,
    caseIcon,
    phenotypeIcon,
    variantsIcon,
    findingsIcon
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
      videoDialog: false
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
    
  
.i-hooper_subheading
  font-size: 18px !important
  font-weight: 200
  
.hooper-progress-inner
  background-color: $app-button-color !important  
  height: 7px
  border-top-left-radius: 8px 
  border-bottom-left-radius: 8px

.hooper-progress
  height: 7px !important
  border-radius: 8px  
  
.step-heading-icon
  margin-top: 10px 
  
  svg 
    height: 44px
    width: 44px
    position: absolute
    padding-top: 5px
  
.i-hooper_text
  font-size: 32px !important
  font-family: poppins !important  
  font-weight: 300
  position: absolute
  margin-left: 55px  
  
@media (min-width: 960px)
  .i-hooper_img
    width: 480px  
  
  .i-hooper_text_margin_top
    margin-top: 50px !important  
    
  .i-hooper_text
    font-size: 24px !important
    font-family: poppins !important  
    font-weight: 300
    position: absolute
    margin-left: 55px  
  
    
@media (min-width: 1050px)
  .i-hooper_img
    width: 520px  
  
  .i-hooper_text_margin_top
    margin-top: 50px !important
      
  .clinical_art
    width: 570px
    right: 0
    margin-top: 72px       
      

@media (min-width: 1264px)
  .i-hooper_img
    width: 620px      
    
  .i-hooper_text_margin_top
    margin-top: 80px !important   
  
  .i-hooper_text
    font-size: 32px !important
    font-family: poppins !important  
    font-weight: 300
    position: absolute
    margin-left: 55px  
      
    
@media (min-width: 1440px)
  .i-hooper_img
    width: 720px    
    
  .i-hooper_text_margin_top
    margin-top: 80px !important  
    
  .clinical_art
    width: 615px
    right: 0
    margin-top: 72px
    
  
    
// .i-hooper_img
//   width: 720px  

</style>

