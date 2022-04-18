<template>
  <div>
    <v-app-bar
      color="white"
      light
      dense
    >

      <v-toolbar-title style="margin-left:5px">
        <strong style="color:rgb(47 87 122)">clin.iobio</strong>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click.stop="videoDialog = true" class="ml-2 mr-2" outlined color="rgb(47 87 122)">
        <v-icon>play_circle_outline</v-icon>
        <span class="ml-1">Watch video</span>
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
                      <v-btn v-if="!analysisInProgress" color="white" outlined x-large @click="onLoadDemoDataFromConfig()" class="mt-8">
                        <v-icon>explore</v-icon>
                        <span class="ml-2">Run with demo data</span>
                      </v-btn>
                      <v-btn v-if="!analysisInProgress" color="white" outlined x-large @click="inputOptionsDialog=true" class="mt-8 ml-4">
                        <v-icon>fas fa-upload</v-icon>
                        <span class="ml-2">Load your data</span>
                      </v-btn>
                      <v-btn v-if="analysisInProgress" color="white" outlined x-large @click="backToAnalysis" class="mt-8">
                        <v-icon>play_circle_outline</v-icon>
                        <span class="ml-2">Resume analysis</span>
                      </v-btn>
                      <v-btn v-if="analysisInProgress" color="white" outlined x-large @click="startNewAnalysis" class="mt-8 ml-4">
                        <v-icon>refresh</v-icon>
                        <span class="ml-2">Start new analysis</span>
                      </v-btn>
                      <div v-if="analysisInProgress">
                        <br><br>
                        <center>
                          <v-alert
                            border="left"
                            colored-border
                            type="warning"
                            icon="error_outline"
                            dense
                            elevation="1"
                            dismissible
                            style="font-size:14px; width:70%"
                          >
                            You are in the middle of an analysis
                          </v-alert>
                        </center>
                      </div>
                    </v-flex>
                  </v-flex>
             
                    <v-flex xs12 md12 sm12 lg6 xl5>
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
        <div style="margin:auto"  class="mb-5">
          
          <div class="pa-8" style="font-size:18px;max-width:800px">
            
            <div class="banner-info">
              <span class="banner-tag">Try it out</span>
              <span class="banner-text">Click "Run with demo data" to try out the tool with a public dataset</span>
            </div>

            <div class="banner-info">
              <span class="banner-tag">Run with your data</span> 
              <span class="banner-text">Click "Load your data" and provide URLs to BAM and VCF files</span>
            </div>

            <div class="banner-info">
              <span class="banner-tag">Integrate with your system</span> 
              <span class="banner-text">Clin.iobio can be integrated with a data management system for easy launch. For example, launch clin.iobio from the Platinum Exomes project in <a href="https://frameshift.io/" target="_blank"> <strong>Frameshift's Mosaic</strong> </a>
              </span>
            </div>

            <div class="banner-info">
              <span class="banner-tag">Contact us</span> 
              <span class="banner-text"><a href="mailto:iobioproject@gmail.com"> <strong>Email us</strong> </a> with any feedback or questions about integrating with your own data.</span>
            </div>
          </div>
        </div>

      </v-layout>
      <v-layout row wrap style="background:white;padding-left:20px;justify-content:center">
        <v-container style="max-width:1440px !important;">
          <v-layout row wrap>
            <v-flex xs12 sm12 md2 lg2 xl2>

              <v-list rounded class="hidden-sm-and-down">
                <v-subheader>
                  <strong style="font-size:18px">The workflow steps</strong>
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
        max-width="925"
      >
        <v-card>

          <v-card-title class="headline"></v-card-title>

          <v-card-text v-if="videoDialog">
            <iframe width="875" height="492.1875" src="https://www.youtube.com/embed/MVWiTlNY7yM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 
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
                  <p style="text-align: justify">
                    Users can enter files (.VCF, .BAM) and sample information using a configuration file.  <a href="https://iobio.s3.amazonaws.com/clin.iobio/example_file_config_GRCh38.csv" target="_blank" style="font-weight: 500;padding-left:10px">Example configuration file</a>
                  </p>
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
                  <br>
                  <v-divider></v-divider>
                  <br>
                  <p style="text-align: justify">
                    Users can enter a list of genes or variants into clin.iobio. 
                    These are the genes and/or variants that will be reviewed in the clinical workflow steps of the app.
                    <br>
                    Variants can be imported from a .CSV file.  <a href="https://iobio.s3.amazonaws.com/clin.iobio/example_imported_variants_GRCh38.csv" target="_blank" style="font-weight: 500;padding-left:10px">Example variant file</a>.
                  </p>

                  <div class="row"
                    v-if="autocompleteGenesConfigFlag">
                    <div class="col-md-11">
                      <v-autocomplete
                        chips
                        :items="knownGenesData"
                        v-model="autocompleteGenesConfig"
                        clearable
                        deletable-chips
                        multiple
                        small-chips
                        flat
                        prepend-icon="fas fa-dna"
                        label="Select gene(s)"
                        :search-input.sync="autoCompleteGenesInputSearchConfig"
                        @change="autoCompleteGenesInputSearchConfig=''"
                      ></v-autocomplete>
                    </div>
                    <div class="col-md-1">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-if="autocompleteGenesConfigFlag"
                            v-bind="attrs"
                            v-on="on"
                            style="margin-top:22px"
                            @click="autocompleteGenesConfigFlag=false"
                          >
                            content_copy
                          </v-icon>
                        </template>
                        <span>Click to enter or paste a list of genes</span>
                      </v-tooltip>
                    </div>
                  </div>

                  <div class="row" v-if="!autocompleteGenesConfigFlag">
                    <div class="col-md-11">
                      <v-textarea
                        v-if="!autocompleteGenesConfigFlag"
                        auto-grow rows="1"
                        name="input-7-4"
                        class="mt-2"
                        label="Enter genes"
                        prepend-icon="fas fa-dna"
                        v-model="genes"
                        :disabled="savedInputConfig!==null || importedVariants.length>0"
                      ></v-textarea>
                    </div>
                    <div class="col-md-1">
                      <v-tooltip bottom >
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            v-on="on"
                            style="margin-top:22px"
                            @click="autocompleteGenesConfigFlag=true"
                          >
                            text_fields
                          </v-icon>
                        </template>
                        <span>Click to select genes from a dropdown</span>
                      </v-tooltip>
                    </div>
                  </div>
                    
                    <v-spacer></v-spacer>
                    <center>OR </center>
                    <v-spacer></v-spacer>

                    <ImportVariants
                      @load-variants="loadImportedVariants($event)"
                      @imported-variants-validation-errors="importedVariantsValidationErrors"
                      :genes="genes">
                    </ImportVariants>
                </v-card-text>
              <!-- </v-card> -->
              <br>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="importConfigurationDialog=false" text>Close</v-btn>
            <v-btn color="primary" v-if="savedInputConfig" @click="loadFromSavedConfigInput" :disabled="!validateSavedConfig && savedInputConfig==null">Load</v-btn>
            <!-- <v-btn color="primary" v-if="savedInputConfig===null" @click="onLoadInputConfig" :disabled="dataInputConfig==null || (genes.length<3 && importedVariants.length==0)">Load</v-btn> -->
            <v-btn color="primary" v-if="savedInputConfig===null" @click="onLoadInputConfig" :disabled="dataInputConfig==null">Load</v-btn>

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
            <strong>
              Saved analysis
            </strong>
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="importSavedAnalysisDialog=false"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <div class="container">
              <p style="text-align: justify">
                Users can resume their analysis by uploading the saved JSON file. This file can be downloaded at any point during the analysis by clicking the button "Save analysis" on the navbar.
              </p>
              <br>
              <v-file-input
                @change="importSavedAnalysisConfig"
                accept=".json,"
                label="Analysis (.json)"
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
              <div class="mb-3" v-if="validationErrors.length">
                <ValidationErrors
                  :validationErrors="validationErrors">
                </ValidationErrors>
                <br>
              </div>
              <PedFileReader 
                class="uploader" 
                @load-ped-file="uploadedPedTxt($event)"
                @ped-input-validation-errors="pedInputValidationErrors($event)">
              </PedFileReader>
              <br>
              <center>OR </center>
              <br>
              <PedFileUrlInput 
                @on-ped-url-change="onPedUrlChange($event)"
                @ped-input-validation-errors="pedInputValidationErrors($event)"
                @ped-input-url-error="pedInputUrlError($event)">
              </PedFileUrlInput>
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
            Genes/Variants
            <span class="ml-2">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="grey"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >help</v-icon>
                </template>
                <span>
                  Import genes or variants. <br>
                  Enter genes as a comma seperated list. Eg: PRX, LMNA, RAI1, SCN8A <br></span>
              </v-tooltip>
            </span>
            <v-spacer></v-spacer>
            <span>
              <v-btn text icon @click="closeUploadDataDialogs"><v-icon>close</v-icon></v-btn>
            </span>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" md="12">
              <div class="mb-3" v-if="validationErrors.length">
                <ValidationErrors
                  :validationErrors="validationErrors">
                </ValidationErrors>
                <br>
              </div>
              <p>
                Users can enter a list of genes or variants into clin.iobio. 
                These are the genes and/or variants that will be reviewed in the clinical workflow steps of the app.
                <br>
                Variants can be imported from a .CSV file (<a href="https://drive.google.com/file/d/1JYTbDnMvQ3Nq6UbbUzYhda0CZj1h5Q4m/view" target="_blank">example</a>) or from a <a href="https://gene.iobio.io/" target="_blank"> gene.iobio </a> variants (.VCF) file.
              </p>
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
                @imported-variants-validation-errors="importedVariantsValidationErrors"
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
            <span v-if="!importedVariants.length && genes.length<3">
              <v-btn color="primary" @click="addVariantSet" >Next</v-btn>
            </span>
            <span v-else>
              <v-btn color="primary" v-if="!importedVariants.length" :disabled="genes.length<3" @click="addGeneSet" >Next</v-btn>
              <v-btn color="primary" v-if="importedVariants.length" @click="addVariantSet" >Next</v-btn>
            </span>

          </v-card-actions>

          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- End gene sets dialog -->

    </v-content>

  </div>
</template>

<script>

import phenotypeIcon          from '../partials/icons/phenotype-icon.vue'
import caseIcon               from '../partials/icons/case-icon.vue'
import findingsIcon           from '../partials/icons/findings-icon.vue'
import variantsIcon           from '../partials/icons/variants-icon.vue'
import LandingPageSlide       from '../partials/LandingPageSlide.vue'
import MoreMenu               from '../partials/MoreMenu.vue'
import NavBarDialog           from '../partials/NavBarDialog.vue'
import PedFileReader          from '../partials/PedFileReader.vue'
import PedFileUrlInput        from  '../partials/PedFileUrlInput.vue'
import FilesDialog            from '../partials/FilesDialog.vue'
import CustomDataStepper      from '../partials/CustomDataStepper.vue'
import ValidationErrors       from '../partials/ValidationErrors.vue'
import SkeletonLoadersReview  from '../partials/SkeletonLoadersReview.vue'
import ImportVariants         from  '../partials/ImportVariants.vue'

import { bus }                from '../../main'

import {
  Hooper,
  Slide,
  Progress as HooperProgress,
  Navigation as HooperNavigation
  } from 'hooper';
import 'hooper/dist/hooper.css';

import review_case_img        from '../../assets/images/landing_page/review_case.png'
import review_phenotypes_img  from '../../assets/images/landing_page/review_phenotypes.png'
import review_variants_img    from '../../assets/images/landing_page/review_variants.png'
import findings_img           from '../../assets/images/landing_page/findings.png'

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
    ValidationErrors,
    SkeletonLoadersReview
  },
  props: {
    cohortModel: null,
    launchedFromMosaic: null,
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
      analysisInProgress: false,
      autocompleteGenesConfig: [],
      autocompleteGenesConfigFlag: true,
      knownGenesData: null,
      autoCompleteGenesInputSearchConfig: '',
    }
  },
  computed: mapGetters(['allAnalysis', 'getAnalysisProgressStatus']),
  methods:  {
    ...mapActions(['fetchAnalysis', 'setAnalysisInProgressStatus']),
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
        this.geneSet = this.genes.trim().split(",").filter(gene => gene.length > 0)
          .map(gene => gene.trim().toUpperCase());
      }
      this.$emit('setGeneSet', this.geneSet);
      this.$ga.event('data_type', 'Custom Data', 'Files');
      this.getStarted();
    },
    addVariantSet: function(){
      this.pageCounter = 1;
      this.geneSetDiialog = false;
      this.$ga.event('data_type', 'Custom Data', 'Files');
      this.getStarted();
    },
    onLoadDemoDataFromConfig: function() {
      let self = this;
      this.promiseFetchDemoInputConfig()
      .then(function() {
        self.geneSet = ['PRX', 'LMNA', 'SCN8A', 'DLL4', 'ABCA3', 'MROH8', 'DVL3', 'NOTCH4']
        self.$emit('setGeneSet', self.geneSet)
        self.$emit("setPhenotypeText", "Charcot-Marie-Tooth disease; demyelination; Dejerine sottas disease possibly; sensory neuropathy; hammertoes; difficulty walking")
        self.$ga.event('data_type', 'Custom Data', 'Config File');
        self.getStarted();

      })
      .catch(function() {
        alert("Unable to load demo data")
      })
    },
    onLoadInputConfig: function(){
      this.importConfigurationDialog = false;
      if(this.genes.length && this.autocompleteGenesConfigFlag===false){
        this.geneSet = this.genes.trim().split(",").filter(gene => gene.length > 0)
          .map(gene => gene.trim().toUpperCase());
        this.$emit('setGeneSet', this.geneSet)
      }
      else if(this.autocompleteGenesConfig.length && this.autocompleteGenesConfigFlag){
        this.geneSet = this.autocompleteGenesConfig; 
        this.$emit('setGeneSet', this.geneSet)
      }
      this.$emit("set-custom-case-summary", {
        name: this.caseTitle,
        description: this.caseDescription
      })
      this.$ga.event('data_type', 'Custom Data', 'Config File');
      this.getStarted();
    },
    backToFiles: function(){
      this.geneSetDiialog = false;
      this.pageCounter = 3;
      this.showFiles = true;
      bus.$emit("back-to-files")
    },
    uploadedPedTxt(ped){
      this.pedData = ped;
      if(ped!==null){
        this.validationErrors = [];
        this.buildPedFromTxt(this.pedData);
      }
    },
    onPedUrlChange(ped){
      this.pedData = ped;
      if(this.pedData){
        this.validationErrors = [];
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
    getStarted(e){
      this.analysisInProgress = true;
      this.setAnalysisInProgressStatus(this.analysisInProgress);
      bus.$emit("initialize-clin");
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
        BAM_URL:true, BAI_URL:true
      }
      let bool = true;
      let lines = data.split('\n');
      let headers = lines.splice(0,4);
      if(headers[0].split(':')[0].trim()!=='#PROJECT_NAME'){
        bool = false;
        return bool;
      }
      if(headers[1].split(':')[0].trim()!=='#PROJECT_DESCRIPTION'){
        bool = false;
        return bool;
      }
      if(headers[2].split(':')[0].trim()!=='#BED_URL'){
        bool = false;
        return bool;
      }
      if(headers[3].split(':')[0].trim()!=='#BUILD'){
        bool = false;
        return bool;
      }
      let firstLine = lines[0].trim().split(/\s+|\,/g);
      for(let i=0; i<firstLine.length; i++){
        if(!obj.hasOwnProperty(firstLine[i])){
          bool = false; 
          break;
        }
      }
      return bool;
    },
    validateHeadersOfConfigFile(data){
      var bool = true;
      let newLine = data.split('\n');
      let headers = newLine.splice(0,4);
      if(!headers[0].includes("#PROJECT_NAME")){
        bool = false;
        return bool;
      }
      if(!headers[1].includes("#PROJECT_DESCRIPTION")){
        bool = false;
        return bool;
      }
      if(!headers[2].includes("#BED_URL")){
        bool = false;
        return bool;
      }
      if(!headers[3].includes("#BUILD")){
        bool = false;
        return bool;
      }
      
      return bool;
    },
    promiseFetchDemoInputConfig() {
      let self = this;
      return new Promise(function(resolve, reject) {
        let url = "https://iobio.s3.amazonaws.com/clin.iobio/example_file_config_GRCh38.csv"
        fetch(url)
        .then(res => {
          if(!res.ok){
            console.log("Unable to fetch demo config data file " + url); 
            reject()
          }
          else {
            return res.text();           
          }
        })
        .then(data => {
            console.log(data)
            self.dataInputConfig = data
            self.parseInputConfig(data)
            self.validateSavedConfig = true
            resolve()
        })
        .catch(error => {
          console.log(error)
          reject()
        })

    })

    },
    onInputConfig(ev) {
      let self = this;
      var reader = new FileReader();
      if(this.dataInputConfig){
        this.validationErrors = [];
        this.savedInputConfig = null;
        reader.readAsText(this.dataInputConfig);
        reader.onload = () => {
          let data = reader.result.trim();
          self.parseInputConfig(data)
        }
      }
    },
    parseInputConfig(data) {
      if(this.validateHeadersOfConfigFile(data)){
        let newLine = data.split('\n');
        let headers = newLine.splice(0,4)
        let pedData = [];
        let modelInfoData = [];
        let bedFileUrl = 'https://iobio.s3.amazonaws.com/clin.iobio/20130108.exome.targets.grch38.bed';
        let buildName = 'GRCh38';
        this.caseTitle = headers[0].split('E:')[1].trim();
        this.caseDescription = headers[1].split('N:')[1].trim();
        let bedFile = headers[2].split('L:')[1].trim().split(",")[0];
        if(bedFile !== ''){
          bedFileUrl = bedFile;
        }
        
        let build = headers[3].split('D:')[1].trim();
        if(build !== ''){
          buildName = build;
        }
        
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

          this.formatCustomModelInfo(modelInfoData);
          this.$emit("setBedFileUrl", bedFileUrl);
          this.$emit("set-ped-data", pedFile);
          this.$emit('setBuildForCustomData', buildName);
          this.$emit("set-custom-case-summary", {
            name: this.caseTitle,
            description: this.caseDescription
          })
        }
        else {
          this.validationErrors.push("Headers do not match with the specified file format. Please check the configuration file and try again.")
          this.dataInputConfig = null;
        }
      }
      else{
        this.validationErrors.push("Headers do not match with the specified file format. Please check the configuration file and try again.")
        this.dataInputConfig = null;
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
      this.$emit("load-saved-analysis-custom-data", this.configSavedAnalysisData);
      this.$ga.event('data_type', 'Custom Data', 'Saved Analysis');    
    },
    setBuildForCustomData(buildName){
      this.$emit("setBuildForCustomData", buildName)
    },
    loadImportedVariants(variants){
      if (variants.length) {
        this.validationErrors = [];
      }
      this.$emit("set-imported-variants", variants);
      this.importedVariants = variants;

      this.geneSet = [];
      variants.map( variant => {
        // this.geneSet.push(variant.gene)
      })
    },
    importedVariantsValidationErrors(errorMessage){
      this.validationErrors = [];
      this.validationErrors.push(errorMessage + " Please check the input file and try again.")
      //this.validationErrors.push("Headers do not match for the imported variants. Please check the input //file and try again")
    },
    pedInputValidationErrors(errMessage){
      this.validationErrors = [];
      // this.validationErrors.push(errMessage);
      this.validationErrors = errMessage;
    },
    pedInputUrlError(errMessage){
      this.validationErrors = [];
      this.validationErrors.push(errMessage);
    },
    backToAnalysis(){
      bus.$emit("back-to-analysis");
    },
    startNewAnalysis(){
      if(this.launchedFromMosaic){
        window.history.pushState({}, document.title, "/" + "");
      }
      window.location.reload();
    }
  },
  created: function() {
    fetch('https://s3.amazonaws.com/ped.test.files/known_genes.txt')
      .then( res => res.text())
        .then( data => {
          let lines = data.split('\n');
          this.knownGenesData = lines;
        })
  },
  mounted: function() {
    this.analysisInProgress = this.getAnalysisProgressStatus;
    this.fetchAnalysis();
    bus.$on("close_dialog", ()=>{
      this.showTermsOfService = false;
    })
    bus.$on("close-files-dialog", ()=>{
      this.closeUploadDataDialogs();
    })
    bus.$on("back-to-analysis", () => {
      this.analysisInProgress = this.getAnalysisProgressStatus; 
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
    },
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

.banner-info
  display: flex
  margin-bottom: 20px

.banner-tag
  min-width: 240px
  display: inline-block
  font-weight: 500
  color: #2f587c

.banner-text
  display: inline-block

.i-hopper_text
  color: #2f587c
  font-size: 20px
  padding-top: 10px 

.step-heading-icon
  fill: #2f587c

.i-hooper_img
    width: 100%

.i-hooper_subheading
    font-size: 16px !important
    color: #666666

@media (min-width: 960px)
  .i-hooper_img
    width: 480px

  .i-hooper_text_margin_top
    margin-top: 50px !important

  .i-hooper_text
    font-size: 20px !important
    color: #2f587c !important
    padding-top: 5px 
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
    width: 100%
    margin-top: 72px


@media (min-width: 1264px)
  .i-hooper_img
    width: 620px

  .i-hooper_text_margin_top
    margin-top: 80px !important

  .i-hooper_text
    font-size: 20px !important
    color: #2f587c !important
    padding-top: 5px 
    font-family: poppins !important
    font-weight: 300
    position: absolute
    margin-left: 55px

  .clinical_art
    width: 100%
    margin-top: 72px


@media (min-width: 1440px)
  .i-hooper_img
    width: 720px

  .i-hooper_text_margin_top
    margin-top: 80px !important

  .clinical_art
    width: 100%
    margin-top: 72px

@media (min-width: 1550px)
  .i-hooper_img
    width: 720px

  .i-hooper_text_margin_top
    margin-top: 80px !important

  .clinical_art
    width: 100%
    margin-top: 72px
</style>

<style lang="sass">
  .v-label
    font-size: 12px
    font-weight: 200
  
</style>
