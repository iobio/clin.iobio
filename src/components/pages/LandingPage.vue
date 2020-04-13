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

      <v-btn class="ml-2 mr-2" outlined color="rgb(69, 69, 69)">
        <v-icon>play_circle_outline</v-icon>
        <span class="ml-1" @click.stop="videoDialog = true">Watch video</span>
      </v-btn>
      
      <v-btn @click="onShowTermsOfService" color="rgb(69, 69, 69)" class="ml-4" icon title="Terms of Service">
        <v-icon>description</v-icon>
      </v-btn>
      
      <MoreMenu class="ml-4" landingPage="true" />

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
                        clin.iobio makes it easy to review sequencing and case metrics, generate a prioritized list of genes associated with the disease/phenotype, review candidate variants, and generate a report of your findings                      
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
                          <img class="hidden-md-and-down clinical_art" src="../../assets/images/landing_page/clinical_art.svg" alt="Clinical art">
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
                <slide v-for="(slide, idx) in slides" :key="idx" :index="idx">
                  <landing-page-slide
                    :title="slide.title"
                    :description="slide.description"
                    :img_src="slide.img_src"
                  > 
                    <component :is="slide.icon"></component>
                  </landing-page-slide>
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
      
      <NavBarDialog
        v-if="showTermsOfService"
        :headline="terms.headline"
        :content="terms.content"
        id="TermsDialogLandingPage">
      </NavBarDialog>
    </v-content>

  </div>
</template>

<script>

import phenotypeIcon    from '../partials/icons/phenotype-icon.vue'
import caseIcon         from '../partials/icons/case-icon.vue'
import findingsIcon     from '../partials/icons/findings-icon.vue'
import variantsIcon     from '../partials/icons/variants-icon.vue'
import { bus }          from '../../main'
import LandingPageSlide from '../partials/LandingPageSlide.vue'
import MoreMenu         from '../partials/MoreMenu.vue'
import NavBarDialog     from '../partials/NavBarDialog.vue'

import {
  Hooper,
  Slide,
  Progress as HooperProgress,
  Navigation as HooperNavigation
  } from 'hooper';
import 'hooper/dist/hooper.css';

import review_case_img        from '../../assets/images/landing_page/review_case.png'
import review_phenotypes_img  from '../../assets/images/landing_page/review_phenotypes.png'
import review_variants_img    from '../../assets/images/landing_page/review_case.png'
import findings_img           from '../../assets/images/landing_page/findings.png'

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
    findingsIcon,
    LandingPageSlide,
    MoreMenu,
    NavBarDialog
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
        { text: 'Select phenotypes' },
        { text: 'Review variants' },
        { text: 'Report findings' },
      ],
      videoDialog: false, 
      slides: [
        {
          title: "Review case", 
          img_src: review_case_img, 
          description: "Review relatedness, disease/phenotype description, and data quality.",
          icon: caseIcon
        }, 
        {
          title: "Select phenotypes", 
          img_src: review_phenotypes_img, 
          description: "Enter a clinical note and select suspected disorders and phenotypes to generate a prioritized gene list.",
          icon: phenotypeIcon
        }, 
        {
          title: "Review variants", 
          img_src: review_variants_img, 
          description: "Review and attach significance to candidate variants. Promote collaboration by adding notes for colleagues.",
          icon: variantsIcon
        }, 
        {
          title: "Report findings", 
          img_src: findings_img, 
          description: "Look over all aspects of the workflow and reviewed variants and generate a downloadable report.",
          icon: findingsIcon
        }, 
      ], 
      showTermsOfService: false,
      terms: {
        headline: "Terms of service", 
        content: `<strong>Academic Use </strong>
          <br> Gene.iobio is freely available for all Academic use.
          <br><br>
          <strong>Commercial Use </strong>
          <br>
          Users from commercial organisations may register a commercial accounts with Frameshift.  To create a commercial account, contact Frameshift at  <a href="mailto:admin@frameshift.io" target="_top">admin@frameshift.io</a> for a consultation.
          `
      }, 
    }
  },
  methods:  {
    getStarted(){
      bus.$emit("initialize-clin")
    }, 
    updateCarousel(payload) {
      var currentSlide; 
      typeof payload === "number" ? currentSlide = payload : currentSlide = payload.currentSlide;
      this.carouselData = currentSlide;
    },
    changeSlide(step_number){
      this.carouselData = step_number;
    },
    onShowTermsOfService: function(){
      this.showTermsOfService = true;
    },
  },
  mounted: function() {
    bus.$on("close_dialog", ()=>{
      this.showTermsOfService = false; 
    })
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
    font-size: 19px
    
  
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
    width: 530px
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
    
  .clinical_art
    width: 560px
    right: 0
    margin-top: 72px  
      
    
@media (min-width: 1440px)
  .i-hooper_img
    width: 720px    
    
  .i-hooper_text_margin_top
    margin-top: 80px !important  
    
  .clinical_art
    width: 580px
    right: 0
    margin-top: 72px
    
@media (min-width: 1550px)
  .i-hooper_img
    width: 720px    
    
  .i-hooper_text_margin_top
    margin-top: 80px !important  
    
  .clinical_art
    width: 605px
    right: 0
    margin-top: 72px    
</style>

