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

      <v-btn @click.stop="videoDialog = true" class="ml-2 mr-2" outlined color="rgb(69, 69, 69)">
        <v-icon>play_circle_outline</v-icon>
        <span class="ml-1">Watch video</span>
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
                        <span class="ml-2">Run with demo data</span>
                      </v-btn>
                      <v-btn color="white" outlined x-large @click="inputOptionsDialog=true" class="mt-8 ml-4">
                        <v-icon>fas fa-upload</v-icon>
                        <span class="ml-2">Load your data</span>
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

      <!-- input options dialog -->
      <v-dialog
        v-model="inputOptionsDialog"
        scrollable
        :overlay="false"
        max-width="450px"
      >
        <v-card class="full-width" style="height: auto;overflow-y:scroll">
          <v-card-title primary-title>
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="inputOptionsDialog=false"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <div class="container">
              <v-btn color="primary" block outlined x-large @click="onShowFiles">
                <v-icon>input</v-icon>
                <span class="ml-2">Enter your data</span>
              </v-btn>
              <v-divider></v-divider>
              <v-btn color="primary" block outlined x-large @click="importConfiguration">
                <v-icon>folder_open</v-icon>
                <span class="ml-2">Upload configuration file</span>
              </v-btn>
              <v-divider></v-divider>
              <v-btn color="primary" block outlined x-large @click="importSavedAnalysis">
                <v-icon>publish</v-icon>
                <span class="ml-2">Import saved analysis</span>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- end input options dialog -->

      <!-- import configuration dialog -->
      <v-dialog
        v-model="importConfigurationDialog"
        scrollable
        :overlay="false"
        max-width="650"
      >
        <v-card class="full-width" style="height: auto;overflow-y:scroll">
          <v-card-title primary-title>
            <strong>
              Input configuration
              <span>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      color="grey"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >help</v-icon>
                  </template>
                  <span>Import a configuration file</span>
                </v-tooltip>
              </span>
            </strong>
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="importConfigurationDialog=false"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <div class="container">
              <!-- <v-card> -->
                <v-card-text>
                  <div class="mb-3" v-if="validationErrors.length">
                    <ValidationErrors
                      :validationErrors="validationErrors">
                    </ValidationErrors>
                    <br>
                  </div>
                  <v-file-input
                    @change="onInputConfig"
                    accept=".csv"
                    label="Data input configuration (.csv)"
                    v-model="dataInputConfig"
                    :disabled="savedInputConfig!==null"
                    prepend-icon="fas fa-file-upload"
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
                  
                  <center>
                    <span> <a href="https://drive.google.com/file/d/1bKaY-TzNTOSbW6MDWJyEnurPbpHc80VA/view?usp=sharing" target="_blank"> Example </a> </span> | 
                    <span> <a href="https://drive.google.com/file/d/1m0wRDNrqBGHeSLYmYrQknS6XIKpw6Cry/view?usp=sharing" target="_blank"> Template </a> </span>
                  </center>
                  <br>
                  <v-divider></v-divider>
                  <br>
                    <v-textarea
                      auto-grow rows="1"
                      name="input-7-4"
                      class="mt-2"
                      label="Enter genes"
                      prepend-icon="fas fa-dna"
                      v-model="genes"
                      :disabled="savedInputConfig!==null || importedVariants.length>0"
                    ></v-textarea>
                    
                    <v-spacer></v-spacer>
                    <center>OR </center>
                    <v-spacer></v-spacer>

                    <ImportVariants
                      @load-variants="loadImportedVariants($event)"
                      :genes="genes">
                    </ImportVariants>
                </v-card-text>
              <!-- </v-card> -->
              <br>
              <!-- <v-divider></v-divider>
              <br>
              <strong> 
                Saved input
                <span>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        color="grey"
                        dark
                        v-bind="attrs"
                        v-on="on"
                      >help</v-icon>
                    </template>
                    <span>Import a configuration file of the saved input</span>
                  </v-tooltip>

                </span>
               </strong> <br><br>
              
              <v-card>
                <v-card-text>
                  <v-file-input
                    @change="importSavedInputConfig"
                    accept=".json,"
                    label="Saved input configuration"
                    v-model="savedInputConfig"
                    :disabled="dataInputConfig!==null"
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
                </v-card-text>
              </v-card> -->
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="importConfigurationDialog=false" text>Close</v-btn>
            <v-btn color="primary" v-if="savedInputConfig" @click="loadFromSavedConfigInput" :disabled="!validateSavedConfig && savedInputConfig==null">Load</v-btn>
            <v-btn color="primary" v-if="savedInputConfig===null" @click="onLoadInputConfig" :disabled="dataInputConfig==null || (genes.length<3 && importedVariants.length==0)">Load</v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- end input configuration dialog -->
      
      <!-- import saved analysis dialog -->
      <v-dialog
        v-model="importSavedAnalysisDialog"
        scrollable persistent
        :overlay="false"
        max-width="650"
      >
        <v-card class="full-width" style="height: auto;overflow-y:scroll">
          <v-card-title primary-title>
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="importSavedAnalysisDialog=false"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <div class="container">
              <v-file-input
                @change="importSavedAnalysisConfig"
                accept=".json,"
                label="Saved analysis"
                v-model="savedAnalysisConfig"
                prepend-icon="publish"
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
              
              <v-divider></v-divider>
              <!-- <label>Enter 6 digit passcode </label> -->
              <!-- Make it disabled till the file is attached -->
              <!-- <v-text-field
                solo
                prepend-icon="vpn_key"
                placeholder="Ex. 793402"
                counter="6"
                :disabled="this.savedAnalysisConfig===null"
                v-model="passCode"
              ></v-text-field>
              <br>              
              <v-alert
                border="left" colored-border type="error"
                icon="error_outline" dense elevation="1"
                style="font-size:12px" v-model="passcodeIncorrectAlert"
                dismissible
              >
                The entered passcode is incorrect.
              </v-alert> -->


            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="importSavedAnalysisDialog=false" text>Close</v-btn>
            <v-btn color="primary" @click="loadFromSavedAnalysis" :disabled="!validateSavedAnalysisData && savedAnalysisConfig==null">Load</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- end import saved analysis dialog -->


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
                placeholder="Provide project name here..."
                solo
                v-model="caseTitle"
              ></v-text-field>

              <label>Project Description </label>
              <v-textarea
                solo auto-grow
                name="input-7-4"
                label="Provide project description here.."
                v-model="caseDescription"
              ></v-textarea>
              <!-- <br>
              <PedFileReader class="uploader" @load-ped-file="uploadedPedTxt($event)"></PedFileReader> -->

          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="closeCaseDescription" text>Close</v-btn>
            <v-btn color="primary" @click="addCaseDescription">Next</v-btn>
          </v-card-actions>

          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- End caseDescriptionDialog -->

      <!-- Pedigree upload dialog -->
      <v-dialog v-model="pedigreeUploadDialog" v-show="pageCounter===2" persistent max-width="890">
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
              <br>
              <center>OR </center>
              <br>
              <PedFileUrlInput @on-ped-url-change="onPedUrlChange($event)"></PedFileUrlInput>
            </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <!-- <v-btn color="primary" @click="backToGeneSets" text>Back</v-btn> -->
            <v-btn color="primary" @click="backToCaseDescription" text>Back</v-btn>
            <v-btn :disabled="!pedData" color="primary" @click="addPedigree">Load</v-btn>
          </v-card-actions>

          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- End Pedigree upload dialog -->



      <!-- VCF and BAM files dialog -->
      <files-dialog
        v-if="showFiles && pageCounter===3"
        :cohortModel="cohortModel"
        :showDialog="showFiles"
        @on-files-loaded="onFilesLoaded"
        @load-demo-data="onLoadDemoData"
        @on-cancel="backToPedUpload"
        @isDemo="onIsDemo"
        @get-modeinfo-map="getModelInfoMap"
        @bed-file-url="setBedFileUrl"
        :pageCounter="pageCounter"
        :customPedigreeMapData="customPedigreeMapData"
        @set-build-custom-data="setBuildForCustomData"
      >
      </files-dialog>
      <!-- End VCF and BAM files dialog -->


      <!-- Genes set dialog -->
      <v-dialog v-model="geneSetDiialog" v-if="pageCounter===4" persistent max-width="890">
        <v-card class="full-width" style="height: auto;overflow-y:scroll">
          <CustomDataStepper
            :pageCounter="pageCounter">
          </CustomDataStepper>
          <v-card-title class="headline">
            Gene sets/ Variants
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="closeUploadDataDialogs"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="12">
              <v-textarea
                auto-grow
                rows="1"
                name="input-7-4"
                label=" Enter genes"
                v-model="genes"
                prepend-icon="fas fa-dna"
                :disabled="importedVariants.length>0"
              ></v-textarea>
              <br>
              <center>OR </center>
              <br>
              <ImportVariants
                @load-variants="loadImportedVariants($event)"
                :genes="genes">
              </ImportVariants>
            </v-col>
          <v-card-actions>
            <!-- <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn :disabled="genes.length<3" v-on="on" color="primary" @click="saveAsConfig" outlined>
                  <v-icon>save</v-icon>
                  <span class="ml-1">Save configuration</span>
                </v-btn>
              </template>
              <span>Download the entered information in a config file for easier accees in future</span>
            </v-tooltip> -->
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="backToFiles" text>Back</v-btn>
            <!-- <v-btn color="primary" @click="addGeneSet" :disabled="genes.length<3">Next</v-btn> -->
            <v-btn color="primary" v-if="!importedVariants.length" :disabled="genes.length<3" @click="addGeneSet" >Next</v-btn>
            <v-btn color="primary" v-if="importedVariants.length" @click="addVariantSet" >Next</v-btn>

          </v-card-actions>

          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- End gene sets dialog -->

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
import PedFileUrlInput  from  './PedFileUrlInput.vue'
import ImportVariants   from  './ImportVariants.vue'
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
import ValidationErrors       from '../partials/ValidationErrors.vue'

import { mapGetters, mapActions } from 'vuex'

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
    CustomDataStepper,
    PedFileUrlInput,
    ImportVariants,
    ValidationErrors
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
      inputOptionsDialog: false,
      importConfigurationDialog: false,
      validateSavedConfig: false,
      configCustomData: {},
      pedUrl: '',
      urlRules: [
  			v => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v) || 'URL must be valid',
  		],
      customPedigreeMapData: {},
      importSavedAnalysisDialog: false,
      savedAnalysisConfig: null,
      validateSavedAnalysisData: false,
      configSavedAnalysisData: {},
      passCode: '',
      passcodeIncorrectAlert: false,
      dataInputConfig: null,
      importedVariants: [],
      validationErrors: [],
    }
  },
  computed: mapGetters(['allAnalysis']),
  methods:  {
    ...mapActions(['fetchAnalysis']),
    getfetchAnalysis: function(){
      this.fetchAnalysis();
    },
    onShowFiles: function() {
      this.inputOptionsDialog = false;
      this.caseDescriptionDialog = true;
    },
    importConfiguration: function(){
      this.inputOptionsDialog = false;
      this.importConfigurationDialog = true;
    },
    importSavedAnalysis: function(){
      this.inputOptionsDialog = false;
      this.importSavedAnalysisDialog = true;
    },
    addCaseDescription: function() {
      this.caseDescriptionDialog = false;
      this.pageCounter = this.pageCounter+1;
      // this.showFiles = true;
      this.$emit("set-custom-case-summary", {
        name: this.caseTitle,
        description: this.caseDescription
      })
      this.pedigreeUploadDialog = true;
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
      // this.showFiles = false;
      this.pedigreeUploadDialog = false;
      this.pageCounter = 1;
      this.onShowFiles();
    },
    backToPedUpload: function(){
      this.showFiles = false;
      this.pedigreeUploadDialog = true;
      this.pageCounter = 2;
    },
    addGeneSet: function(){
      this.pageCounter = 1;
      this.geneSetDiialog = false;
      if(this.genes.length){ //temp, if variant sets are selected
        this.geneSet = this.genes.split(",").map(gene => gene.trim().toUpperCase());
      }
      // this.geneSet = this.genes.split(",").map(gene => gene.trim().toUpperCase());
      this.$emit('setGeneSet', this.geneSet)
      this.getStarted();
    },
    addVariantSet: function(){
      this.pageCounter = 1;
      this.geneSetDiialog = false;
      this.getStarted();
    },
    onLoadInputConfig: function(){
      this.importConfigurationDialog = false;
      if(this.genes.length){
        this.geneSet = this.genes.split(",").map(gene => gene.trim().toUpperCase());
        this.$emit('setGeneSet', this.geneSet)
      }
      this.getStarted();
    },
    backToFiles: function(){
      this.geneSetDiialog = false;
      this.pageCounter = 3;
      this.showFiles = true;
      bus.$emit("back-to-files")
    },
    uploadedPedTxt(ped){
      console.log("peed", ped);
      this.pedData = ped;
      this.buildPedFromTxt(this.pedData);
    },
    onPedUrlChange(ped){
      this.pedData = ped;
      if(this.pedData){
        this.buildPedFromTxt(this.pedData);  
      }
    },
    buildPedFromTxt(txt) {
      let pedLines = txt.split('\n');
      let pedArr = [];
      for (let i = 0; i < pedLines.length; i++) {
        let splitLine = pedLines[i].split(/\s+|\,/g);
        let sexMap = {
          "1": "male",
          "2": "female",
          "other": "unknown"
        }
        let statusMap = {
          0: false,
          1: false,
          2: true,
          "-9": false
        }
        console.log("splitLine[0]", splitLine[0]);
        if(splitLine && splitLine[0] !== "" && !isNaN(parseInt(splitLine[4]))) {
          var sample = splitLine[1];
          var sex = sexMap[parseInt(splitLine[4])];
          var isAffected = statusMap[parseInt(splitLine[5])]
          if(this.customPedigreeMapData[sample] === undefined){
            this.customPedigreeMapData[sample] = {
              sample, sex, isAffected
            }
          }
        }
      }
      console.log("this.customPedigreeMapData", this.customPedigreeMapData);
    },
    addPedigree(){
      this.pedigreeUploadDialog = false;
      this.pageCounter = this.pageCounter+1;
      this.showFiles = true;
      this.$emit("set-ped-data", this.pedData);
      // this.getStarted();
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
    isBamUrlValid: function(url, sample){
      if(url.includes(sample)){
        console.log("BAM url is valid");
      }
      else {
        console.log("bam url is not valid");
      }
    },
    getModelInfoMap: function(customModelInfos){
      this.$emit("custom-model-info",customModelInfos);
    },
    setBedFileUrl: function(bed){
      this.$emit("setBedFileUrl", bed)
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
      if(this.savedInputConfig){
        this.dataInputConfig = null;
        reader.readAsText(this.savedInputConfig);
        reader.onload = () => {
          let data = reader.result;
          this.configCustomData = JSON.parse(data);
          if(typeof this.configCustomData === "object"){
            this.validateSavedConfig = true;
          }
        }
      }
      else {
        this.validateSavedConfig = false;
      }
    },
    validateInputConfig(data){
      let obj = {
        ID:true, SAMPLE_ID: true, PATERNAL_ID: true,  MATERNAL_ID:true, SEX:true,
        AFFECTED_STATUS:true, RELATION: true, VCF_URL: true, TBI_URL: true, 
        BAM_URL:true, BAI_URL:true, BED_URL: true, BUILD: true
      }
      let bool = true;
      let lines = data.split('\n');
      let firstLine = lines[0].trim().split(/\s+|\,/g);
      for(let i=0; i<firstLine.length; i++){
        if(!obj.hasOwnProperty(firstLine[i])){
          bool = false; 
          break;
        }
      }
      return bool;
    },
    onInputConfig(ev) {
      var reader = new FileReader();
      if(this.dataInputConfig){
        this.validationErrors = [];
        this.savedInputConfig = null;
        reader.readAsText(this.dataInputConfig);
        reader.onload = () => {
          let data = reader.result.trim();
          console.log("data in input config", data);
          let newLine = data.split('\n');
          let pedData = [];
          let modelInfoData = [];
          let bedFileUrl = 'https://raw.githubusercontent.com/chmille4/bam.iobio.io/vue/client/data/20130108.exome.targets.bed';
          let buildName = 'GRCh37';
          
          let sexMap = {
            "1": "male",
            "2": "female",
            "other": "unknown"
          }
          let statusMap = {
            "0": false,
            "1": false,
            "2": true,
            "-9": false
          }
          
          if(this.validateInputConfig(data)){
            for (var i = 0; i < newLine.length; i++) {
              var pedLines = newLine[i].split(/\s+|\,/g).slice(0,6);
              pedData.push(pedLines.join(' '));
              
              var modelInfoLines = newLine[i].split(/\s+|\,/g).slice();
              if(i!==0){
                modelInfoLines[4] = sexMap[modelInfoLines[4]]; 
                modelInfoLines[5] = statusMap[modelInfoLines[5]];
              }
              modelInfoData.push(modelInfoLines);
            }
            modelInfoData.shift();
            let pedFile = pedData.join('\n');
            let bedFile = modelInfoData[0][11]; 
            if(bedFile !== ''){
              bedFileUrl = bedFile;
            }
            let build = modelInfoData[0][12].trim();;
            if(build !== ''){
              buildName = build;
            }
            this.formatCustomModelInfo(modelInfoData);
            this.$emit("setBedFileUrl", bedFileUrl);
            this.$emit("set-ped-data", pedFile);
            this.$emit('setBuildForCustomData', buildName);
          }
          else {
            this.validationErrors.push("Headers do not match with the specified file format. Please check the configuration file and try again.")
            // alert("Headers do not match with the specified file format.");
            this.dataInputConfig = null;
          }

        }
      }
    },
    formatCustomModelInfo(modelInfoData){
      var modelInfo = [];
      modelInfoData.map(model => {
        var obj = {}; 
        obj.sample = model[1];
        obj.relationship = model[6]; 
        obj.affectedStatus = model[5];
        obj.name = null; 
        obj.sex = model[4];
        obj.vcf = model[7]; 
        obj.tbi = model[8] !== '' ? model[8] : null; 
        obj.bam = model[9]; 
        obj.bai = model[10] !== '' ? model[10] : null;
        modelInfo.push(obj);
      })
      console.log("modelInfo", modelInfo);
      this.$emit("custom-model-info",modelInfo);

    },
    importSavedAnalysisConfig(ev) {
      var reader = new FileReader();
      if(this.savedAnalysisConfig){
        reader.readAsText(this.savedAnalysisConfig);
        reader.onload = () => {
          let data = reader.result;
          this.configSavedAnalysisData = JSON.parse(data);
          if(typeof this.configSavedAnalysisData === "object" && typeof this.configSavedAnalysisData.pass_code === "number"){
            this.validateSavedAnalysisData = true;
          }
        }
      }
      else {
        this.validateSavedAnalysisData = false;
      }
    },
    loadFromSavedConfigInput(){
        this.$emit("load-saved-input-config", this.configCustomData)
    },
    loadFromSavedAnalysis(){
      this.$emit("load-saved-analysis-custom-data", this.configSavedAnalysisData)
    
      // if(this.configSavedAnalysisData.pass_code == this.passCode){
      //   this.$emit("load-saved-analysis-custom-data", this.configSavedAnalysisData)
      // }
      // else {
      //   this.passcodeIncorrectAlert = true;
      // }
    },
    setBuildForCustomData(buildName){
      this.$emit("setBuildForCustomData", buildName)
    },
    loadImportedVariants(variants){
      this.$emit("set-imported-variants", variants);
      this.importedVariants = variants;
      console.log("importedVariants", this.importedVariants);

      this.geneSet = [];
      variants.map( variant => {
        // this.geneSet.push(variant.gene)
      })
    }
  },
  mounted: function() {
    this.fetchAnalysis();
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
    },
    passCode(){
      this.passcodeIncorrectAlert = false;
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
