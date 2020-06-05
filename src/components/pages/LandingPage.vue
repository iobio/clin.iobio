<template>
  <div>
    <v-file-input 
      @change="importSavedInputConfig"  
      accept=".json,"
      label="Ped file input" 
      v-model="savedInputConfig" 
      show-size counter>
      <template v-slot:selection="{ text }">
        <v-chip
          label
          color="primary"
        >
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>
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
                      <v-btn color="white" outlined x-large @click="onShowFiles" class="mt-8 ml-4">
                        <v-icon>fas fa-upload</v-icon> 
                        <span class="ml-2">Upload data</span>
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
      
      <!-- caseDescriptionDialog -->
      <v-dialog v-model="caseDescriptionDialog" v-if="pageCounter===1" persistent max-width="890">
        <v-card class="full-width" style="height: auto;overflow-y:scroll">
          <CustomDataStepper
            :pageCounter="pageCounter">
          </CustomDataStepper>
          <v-card-title class="headline">
            Case summary
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="closeUploadDataDialogs"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="12">
              <label>Project Name </label>
              <v-text-field
                label="Solo"
                placeholder="WGS analysis"
                solo
                v-model="caseTitle"
              ></v-text-field>
              
              <label>Project Description </label>
              <v-textarea
                solo auto-grow
                name="input-7-4"
                label="The data set (NA12878) is high quality exome sequencing data from three individuals"
                v-model="caseDescription"					
              ></v-textarea>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="closeCaseDescription" text>close</v-btn>
            <v-btn color="primary" @click="addCaseDescription">Next</v-btn>
          </v-card-actions>

          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- End caseDescriptionDialog -->
      

      
      <files-dialog
        v-if="showFiles && pageCounter===2"
       :cohortModel="cohortModel"
       :showDialog="showFiles"
       @on-files-loaded="onFilesLoaded"
       @load-demo-data="onLoadDemoData"
       @on-cancel="backToCaseDescription"
       @isDemo="onIsDemo"
       @get-modeinfo-map="getModelInfoMap"
       :pageCounter="pageCounter"
      >
      </files-dialog>
      
      
      <!-- Genes set dialog -->
      <v-dialog v-model="geneSetDiialog" v-if="pageCounter===3" persistent max-width="890">
        <v-card class="full-width" style="height: auto;overflow-y:scroll">
          <CustomDataStepper
            :pageCounter="pageCounter">
          </CustomDataStepper>
          <v-card-title class="headline">
            Gene Sets
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="closeUploadDataDialogs"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="12">
              <v-textarea
                solo auto-grow
                name="input-7-4"
                label="Enter Genes"
                v-model="genes"					
              ></v-textarea>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="backToFiles" text>Back</v-btn>
            <v-btn color="primary" @click="addGeneSet" :disabled="genes.length<3">Next</v-btn>
          </v-card-actions>

          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- End gene sets dialog -->
      
      <!-- Pedigree upload dialog -->
      <v-dialog v-model="pedigreeUploadDialog" v-if="pageCounter===4" persistent max-width="890">
        <v-card class="full-width" style="height: auto;overflow-y:scroll">
          <CustomDataStepper
            :pageCounter="pageCounter">
          </CustomDataStepper>
          <v-card-title class="headline">
            Pedigree upload
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="closeUploadDataDialogs"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="12">
              <PedFileReader class="uploader" @load-ped-file="uploadedPedTxt($event)"></PedFileReader>
            </v-col>
          <v-card-actions>
            <v-btn color="primary" @click="saveAsConfig">Save as config</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="backToGeneSets" text>Back</v-btn>
            <v-btn :disabled="!pedData" color="primary" @click="addPedigree">Load</v-btn>
          </v-card-actions>

          </v-card-text>
        </v-card>
      </v-dialog>

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
import PedFileReader    from './PedFileReader.vue'

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
import FilesDialog            from '../partials/FilesDialog.vue'
import CustomDataStepper      from '../partials/CustomDataStepper.vue'

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
    NavBarDialog,
    FilesDialog,
    PedFileReader,
    CustomDataStepper
  },
  props: {
    cohortModel: null,
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
          <br> clin.iobio is free for academic use.
          <br><br>
          <strong>Commercial Use </strong>
          <br>
          Commercial use of clin.iobio is licensed through Frameshift Genomics. Please contact Frameshift at  <a href="mailto:admin@frameshift.io" target="_top">admin@frameshift.io</a> to discuss any commercial use of this tool.
          `
      },
      geneSet:[],
      geneSetDiialog: false,
      genes: '',
      customModelInfos: [],
      showFiles: false, 
      pageCounter: 1, 
      pedigreeUploadDialog: false, 
      pedData: null,
      caseDescriptionDialog: false,
      caseDescription: '', 
      caseTitle: '',
      savedInputConfig: null, 
    }
  },
  methods:  {
    onShowFiles: function() {
      this.caseDescriptionDialog = true;
    },
    addCaseDescription: function() {
      this.caseDescriptionDialog = false;
      this.pageCounter = this.pageCounter+1;
      this.showFiles = true; 
      this.$emit("set-custom-case-summary", {
        name: this.caseTitle, 
        description: this.caseDescription
      })
    },
    closeCaseDescription: function() {
      this.caseDescriptionDialog = false;
      this.pageCounter = 1; 
    }, 
    onFilesLoaded: function(analyzeAll) {
      this.showFiles = false;
      this.pageCounter = this.pageCounter+1; 
      this.geneSetDiialog = true
      this.$emit("on-files-loaded", analyzeAll);
    },
    backToCaseDescription: function(){
      this.showFiles = false;
      this.pageCounter = 1;
      this.onShowFiles(); 
    },
    addGeneSet: function(){
      this.pageCounter = this.pageCounter+1;  
      this.geneSetDiialog = false;
      this.geneSet = this.genes.split(",").map(gene => gene.trim().toUpperCase()); 
      this.$emit('setGeneSet', this.geneSet)
      this.pedigreeUploadDialog = true; 
    },
    backToFiles: function(){
      this.geneSetDiialog = false;
      this.pageCounter = 2;
      this.showFiles = true; 
    },  
    uploadedPedTxt(ped){
       this.pedData = ped; 
    }, 
    addPedigree(){
      this.pedigreeUploadDialog = false; 
      this.$emit("set-ped-data", this.pedData); 
      this.getStarted();
    },
    backToGeneSets: function(){
      this.pedigreeUploadDialog = false;
      this.pageCounter = 3;
      this.geneSetDiialog = true;
    }, 
    onLoadDemoData: function(loadAction) {
      this.$emit("load-demo-data", loadAction);
    },
    onIsDemo: function(bool){
      this.$emit("isDemo", bool);
    },
    getModelInfoMap: function(modelInfoMap, vcfUrls, tbiUrls, bamUrls, baiUrls){
      for(var model in modelInfoMap){
        var obj = {}; 
        obj.relationship = model 
        obj.affectedStatus = modelInfoMap[model].isAffected
        obj.name = modelInfoMap[model].name 
        obj.sample = modelInfoMap[model].sample 
        obj.sex = "" 
        var vcf = modelInfoMap[model].vcf !== undefined ? modelInfoMap[model].vcf : vcfUrls[model];
        obj.vcf = vcf 
        var tbi = modelInfoMap[model].tbi !== undefined ? modelInfoMap[model].tbi : tbiUrls[model];
        obj.tbi = tbi 
        obj.bam = bamUrls[model]
        obj.bai = baiUrls[model]
        this.customModelInfos.push(obj)
      }
      console.log("this.customModelInfos", this.customModelInfos)
      this.$emit("custom-model-info",this.customModelInfos); 
    }, 
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
    closeUploadDataDialogs: function(){
      this.caseDescriptionDialog = false; 
      this.showFiles = false; 
      this.geneSetDiialog = false; 
      this.pedigreeUploadDialog = false;
      this.pageCounter = 1; 
    }, 
    saveAsConfig: function(){
      this.$emit("set-ped-data", this.pedData);
      bus.$emit("save-input-config"); 
    }, 
    importSavedInputConfig(ev) {
      var reader = new FileReader();
      reader.readAsText(this.savedInputConfig);
      reader.onload = () => {
        console.log("reader result", reader.result);
        this.$emit("load-saved-input-config", reader.result)
      }
    }
  },
  mounted: function() {
    bus.$on("close_dialog", ()=>{
      this.showTermsOfService = false; 
    })
    bus.$on("close-files-dialog", ()=>{
      this.closeUploadDataDialogs(); 
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

<style lang="sass">
  .v-label 
    font-size: 12px
    font-weight: 200
</style>
