
<style lang="sass">
@import ../../assets/sass/variables




#files-form
  padding-left: 40px
  padding-right: 20px

  .input-group.radio
    margin-top: 0px
    margin-bottom: 0px

  .v-radio
    padding-right: 0px
    margin-bottom: 0px

  .radio label,
  .v-radio label
    line-height: 25px
    padding-top: 3px
    font-size: 13px
    margin: 0px

  .input-group.radio-group
    padding-top: 0px

  .v-input--radio-group
    padding-top: 0px
    margin-top: 0px

  .input-group__selections__comma, .v-select__selection--comma
    font-size: 13px

  .input-group.input-group--selection-controls.switch,
  .v-input--selection-controls.v-input--switch,
    label
      font-weight: normal
      font-size: 13px
      padding-left: 5px

  .radio-group
    padding-top: 0px
    .input-group__input
      min-height: 25px

  .loader
    display: inline-block
    margin-right: 2px

    img
      width: 20px
      height: 20px

  .sample-label
    span
      margin-top: 2px
      margin-bottom: 2px
      vertical-align: top
      margin-left: 0px
      font-size: 15px
      color: black
      display: inline-block
      margin-right: 20px
      font-weight: 600
    .switch
      display: inline-block
      width: 100px

  .v-text-field__slot,
  .v-select__slot
    input
      font-size: 12px
      color: $text-color

  .sample-label
    .v-input--switch
      margin-bottom: 10px
      margin-top: 0px

</style>

<template>
   <v-dialog v-model="showFilesDialog" persistent max-width="890" >
      <v-card class="full-width" style="height: auto;overflow-y:scroll">
        <CustomDataStepper
          :pageCounter="pageCounter">
        </CustomDataStepper>



          <v-form id="files-form">

            <v-card-title class="headline">
              <span style="margin-left: -30px; font-weight:500">Files</span>
              <v-spacer></v-spacer>
              <span>
                <v-btn text @click="closeFilesDialog" icon><v-icon>close</v-icon></v-btn>
              </span>
            </v-card-title>
            <v-flex v-if="validationErrors.length">
              <!-- Please correct the following errors: -->
              <ValidationErrors
                :validationErrors="validationErrors">
              </ValidationErrors>
              <br>
            </v-flex>

            <v-layout row nowrap class="mt-0" style="padding-right:32px">
              


              <v-flex class="mt-0" style="max-width: 160px;margin-left: 10px;" >
                  <v-radio-group v-model="mode" @change="onModeChanged"  hide-details column>
                        <v-radio color="primary" label="Single"  value="single"></v-radio>
                        <v-radio color="primary" label="Trio"    value="trio"></v-radio>
                  </v-radio-group>
              </v-flex>

              <v-flex style="width:90px;margin-right:10px" >
                  <v-switch color="primary" label="Separate URL for index" hide-details v-model="separateUrlForIndex">
                  </v-switch>
              </v-flex>


              <v-flex style="max-width:190px" >
                <v-select
                  label="Species"
                  hide-details
                  v-model="speciesName"
                  :items="speciesList"
                ></v-select>
              </v-flex>

              <v-flex style="max-width:160px" class="ml-2">
                <v-select
                  label="Genome Build"
                  hide-details
                  v-model="buildName"
                  :items="buildList"
                ></v-select>
               </v-flex>

            </v-layout>


            <bed-data
              :buildName="buildName"
              @set-bed-url="setBedUrl($event)">
            </bed-data>


            <v-layout row wrap class="mt-3">
               <v-flex xs12
                 v-for="rel in rels[mode]"
                    :key="rel"
                    :id="rel"
                    v-if="modelInfoMap && modelInfoMap[rel] && Object.keys(modelInfoMap[rel]).length > 0">

                  <sample-data
                    class="mt-5"
                    ref="sampleDataRef"
                    v-if="modelInfoMap && modelInfoMap[rel] && Object.keys(modelInfoMap[rel]).length > 0"
                    :modelInfo="modelInfoMap[rel]"
                    :separateUrlForIndex="separateUrlForIndex"
                    @sample-data-changed="validate"
                    @samples-available="onSamplesAvailable"
                    @bam-urls="setBamUrls"
                    :customPedigreeMapData="customPedigreeMapData"
                  >
                </sample-data>
               </v-flex>

            </v-layout >

            <v-layout row nowrap class="mt-2">
            </v-layout>
            
            <v-layout row wrap>
              <v-flex xs12 class="mt-2 text-xs-right">
                <div class="loader" v-show="inProgress">
                  <img src="../../assets/images/wheel.gif">
                </div>
                <v-card-actions class="mb-4">
                  <v-spacer></v-spacer>

                 <v-btn color="primary" text @click="onCancel"> Back</v-btn>
                 
                 <v-btn class="ml-2" color="primary"
                   @click="onLoad"
                   :disabled="(!isValid) || (bedFileUrl=='') || (!buildName)">
                   Next
                 </v-btn>

                </v-card-actions>
              </v-flex>
            </v-layout>

          </v-form>
      </v-card>
  </v-dialog>
</template>

<script>

import SampleData          from '../partials/SampleData.vue'
import CustomDataStepper   from '../partials/CustomDataStepper.vue'
import BedData             from '../partials/BedData.vue'
import ValidationErrors    from '../partials/ValidationErrors.vue'

import { bus }             from  '../../main'

export default {
  name: 'files-dialog',
  components: {
    SampleData,
    CustomDataStepper,
    BedData,
    ValidationErrors
  },
  props: {
    cohortModel: null,
    showDialog: null, 
    pageCounter: null,
    customPedigreeMapData: null,
  },
  data () {
    return {
      showFilesDialog: false,
      isValid: false,
      mode: 'single',
      speciesList: [],
      speciesName: null,
      buildName: null,
      activeTab: null,
      modelInfoMap: {
        proband: {},
        mother: {},
        father: {}
      },
      rels: {
        single: ['proband'],
        trio: ['proband', 'mother', 'father']
      },
      demoActions: [
        {'display': 'Demo WES trio', 'value': 'exome'},
        {'display': 'Demo WGS trio', 'value': 'genome'}
      ],
      demoAction: null,
      separateUrlForIndex: false,
      probandSamples: null,
      affectedSibs: null,
      unaffectedSibs: null,
      inProgress: false, 
      vcfUrls: {
        proband: '', 
        mother: '', 
        father: '',
        sibling: ''
      }, 
      tbiUrls: {
        proband: '', 
        mother: '', 
        father: '',
        sibling: ''
      },
      bamUrls: {
        proband: '', 
        mother: '', 
        father: '',
        sibling: ''
      }, 
      baiUrls: {
        proband: '', 
        mother: '', 
        father: '',
        sibling: ''
      }, 
      customModelInfos: [],
      sampleIdDupsCounter: {},
      validationErrors: [],
      // bedFileUrl: ''
      bedFileUrl: 'https://raw.githubusercontent.com/chmille4/bam.iobio.io/vue/client/data/20130108.exome.targets.bed'
    }
  },
  watch: {
    showDialog: function() {
      if (this.cohortModel && this.showDialog) {
        this.showFilesDialog = true
        this.mode = this.cohortModel.mode;
        this.init();
      }
    },
    showFilesDialog: function() {
      if (!this.showFilesDialog) {
        this.$emit("on-cancel");
      }
    },
    buildName: function(){
    }

  },
  methods: {
    isBamUrlValid: function(url, sample){
      //does bam url have the correct sample id? 
      if(url.includes(sample)){
        return true; 
      }
      else {
        this.validationErrors.push(`The BAM url does not match for the sample ${sample}`)
        return false; 
      }
    }, 
    getModelInfoMap: function(modelInfoMap, vcfUrls, tbiUrls, bamUrls, baiUrls){
      for(var model in modelInfoMap){
        var bam; 
        if(modelInfoMap[model].bam){
          bam = modelInfoMap[model].bam
        }
        else {
          bam = bamUrls[model];
        }
        // TODO: Add a similar check for bai urls
        
        if(this.customPedigreeMapData.hasOwnProperty(modelInfoMap[model].sample)){
          if(this.sampleIdDupsCounter[modelInfoMap[model].sample] === undefined){ //check if sample ids are duplicated
            this.sampleIdDupsCounter[modelInfoMap[model].sample] = 1; 
            // Validate bam  urls 
            if(this.isBamUrlValid(bam, modelInfoMap[model].sample)){
              var obj = {}; 
              obj.relationship = model 
              // obj.affectedStatus = this.customPedigreeMapData[modelInfoMap[model].sample].isAffected
              obj.affectedStatus = modelInfoMap[model].isAffected
              obj.name = modelInfoMap[model].name 
              obj.sample = modelInfoMap[model].sample 
              obj.sex = this.customPedigreeMapData[modelInfoMap[model].sample].sex
              var vcf = modelInfoMap[model].vcf !== undefined ? modelInfoMap[model].vcf : vcfUrls[model];
              obj.vcf = vcf 
              var tbi = modelInfoMap[model].tbi !== undefined ? modelInfoMap[model].tbi : tbiUrls[model];
              obj.tbi = tbi 
              // obj.bam = bamUrls[model]
              obj.bam = bam
              obj.bai = baiUrls[model]
              this.customModelInfos.push(obj)
            }
            else {
            }
          }
          else {
            this.validationErrors.push(`Sample id ${modelInfoMap[model].sample} is duplicated.`)
          }
        }
        else{
          this.validationErrors.push(`Sample ids do not match with the pedigree data. Please check the ped file`)
        }
      }
      // console.log("this.customModelInfos in files dialog", this.customModelInfos); 
    },
    onLoad: function() {
      let self = this;
      self.validationErrors = [];
      self.inProgress = true;

      // self.$emit("get-modeinfo-map", self.modelInfoMap, self.vcfUrls, self.tbiUrls, self.bamUrls, self.baiUrls); 
      // self.getModelInfoMap(self.modelInfoMap, self.vcfUrls, self.tbiUrls, self.bamUrls, self.baiUrls); 
      self.cohortModel.mode = self.mode;
      self.cohortModel.genomeBuildHelper.setCurrentBuild(self.buildName);
      self.cohortModel.genomeBuildHelper.setCurrentSpecies(self.speciesName);

      self.cohortModel.promiseAddClinvarSample()
      .then(function() {
        return  self.cohortModel.promiseSetSibs(self.affectedSibs, self.unaffectedSibs)
      })
      .then(function() {
        self.cohortModel.setAffectedInfo(true);
        self.cohortModel.isLoaded = true;
        self.cohortModel.getCanonicalModels().forEach(function(model) {
          if (model.name == null || model.name.length == 0) {
            model.name = model.relationship;
          }
        })
        self.cohortModel.sortSampleModels();

      })
      .then(function() {
        let performAnalyzeAll = self.demoAction ? true : false;
        self.getModelInfoMap(self.modelInfoMap, self.vcfUrls, self.tbiUrls, self.bamUrls, self.baiUrls); 
        if(self.customModelInfos.length === Object.keys(self.modelInfoMap).length){
        // if(!self.validationErrors.length){ //If there are no validation errors, its a success and go to next page 
          self.inProgress = false;
          self.$emit("on-files-loaded", performAnalyzeAll);
          self.showFilesDialog = false;
          self.$emit("get-modeinfo-map", self.customModelInfos);
          self.$emit("bed-file-url", self.bedFileUrl);
          self.$emit("set-build-custom-data", self.buildName);
        }
        else {
          self.inProgress = false;
          self.isValid = false;
          // self.validationErrors = [];
          self.customModelInfos = [];
          self.sampleIdDupsCounter = {};
        }
        // self.inProgress = false;
        // 
        // self.$emit("on-files-loaded", performAnalyzeAll);
        // self.showFilesDialog = false;
      })
    },
    onCancel:  function() {
      let self = this;
      self.$emit("on-cancel");
      self.showFilesDialog = false;
    },
    onModeChanged: function() {
      if (this.mode == 'trio' && this.cohortModel.getCanonicalModels().length < 3 ) {
        this.promiseInitMotherFather();
      } else if (this.mode == 'single' && this.cohortModel.getCanonicalModels().length > 1) {
        this.removeMotherFather();
      }

      this.validate();
    },
    onLoadDemoData: function() {
      let self = this;
      this.$emit('isDemo', true);

      if (self.mode == 'single') {
        self.mode = 'trio';
      }

      var p = null;
      if (self.cohortModel.getCanonicalModels().length < 3 ) {
        p = self.promiseInitMotherFather();
      } else {
        p = Promise.resolve();
      }
      p.then(function() {
        self.cohortModel.demoModelInfos[self.demoAction].forEach(function(modelInfo) {
          var rel = modelInfo.relationship;
          self.modelInfoMap[rel] = modelInfo;
        })
        self.cohortModel.getCanonicalModels().forEach(function(model) {
          self.promiseSetModel(model);
        })
      })
    },
    promiseSetModel: function(model) {
      let self = this;
      return new Promise(function(resolve, reject) {
        var theModel = model;
        var theModelInfo = self.modelInfoMap[theModel.relationship];
        theModelInfo.model = theModel;
        theModel.onVcfUrlEntered(theModelInfo.vcf, null, function(success, sampleNames) {
          if (success) {
            theModelInfo.samples = sampleNames;
            if (theModel.relationship == 'proband') {
              self.probandSamples = sampleNames;
            }
            self.$refs.sampleDataRef.forEach(function(ref) {
              if (ref.modelInfo.relationship == theModel.relationship) {
                theModel.sampleName = theModelInfo.sample;
                ref.updateSamples(sampleNames, theModelInfo.sample);
                theModel.name = theModel.sampleName;
                self.validate();
              }
            })
            theModel.onBamUrlEntered(theModelInfo.bam, null, function(success) {
              self.validate();
              if (success) {
                resolve();
              } else {
                reject();
              }
            })
          } else {
            reject();
          }
        })
      })
    },
    validate: function() {
      this.isValid = false;
      // console.log("this.modelInfoMap", this.modelInfoMap)
      // this.$emit("Set-modelInfoMap", this.modelInfoMap)
      if (this.mode == 'single') {
        if (this.modelInfoMap.proband && this.modelInfoMap.proband.model.isReadyToLoad()) {
          this.isValid = true;
          // console.log("this.isValid", this.isValid)
        }
      } else {
        if (this.modelInfoMap.proband && this.modelInfoMap.proband.model && this.modelInfoMap.proband.model.isReadyToLoad()
            && this.modelInfoMap.mother && this.modelInfoMap.mother.model && this.modelInfoMap.mother.model.isReadyToLoad()
            && this.modelInfoMap.father && this.modelInfoMap.father.model && this.modelInfoMap.father.model.isReadyToLoad()) {
          this.isValid = true;
        }
      }
    },
    setBamUrls: function(relationship, bam, bai){
      this.bamUrls[relationship] = bam; 
      this.baiUrls[relationship] = bai; 
    }, 
    onSamplesAvailable: function(relationship, samples, vcf, tbiUrl) {
      // console.log("onSamplesAvailable", relationship , " samples : ", samples)
      this.vcfUrls[relationship] = vcf; 
      this.tbiUrls[relationship] = tbiUrl; 
      // console.log("this.vcfUrls", this.vcfUrls)
      if (relationship == 'proband') {
        this.probandSamples = samples;
        if (this.cohortModel.sampleMapSibs.affected && this.cohortModel.sampleMapSibs.affected.length > 0) {
          this.affectedSibs = this.cohortModel.sampleMapSibs.affected.map(function(sampleModel) {
            return sampleModel.sampleName;
          })
        }
        if (this.cohortModel.sampleMapSibs.unaffected && this.cohortModel.sampleMapSibs.unaffected.length > 0) {
          this.unaffectedSibs = this.cohortModel.sampleMapSibs.unaffected.map(function(sampleModel) {
            return sampleModel.sampleName;
          })
        }
      }
      if (samples && samples.length > 0 && this.getModel(relationship)) {
        this.getModel(relationship).samples = samples;
      }
    },
    getModel: function(relationship) {
      var theModel = null;
      if (this.cohortModel) {
        var modelObject = this.cohortModel.sampleMap[relationship];
        if (modelObject) {
          theModel = modelObject.model;
        }
      }
      return theModel;
    },
    init: function() {
      let self = this;
      self.modelInfoMap = {};
      if (self.cohortModel && self.cohortModel.getCanonicalModels().length > 0) {
        self.initModelInfo();
      } else {
        var modelInfo = {};
        modelInfo.relationship = 'proband';
        modelInfo.vcf = null;
        modelInfo.bam = null;
        modelInfo.affectedStatus = 'affected'
        self.cohortModel.promiseAddSample(modelInfo)
        .then(function() {
          self.initModelInfo();
        })
      }
    },
    initModelInfo: function() {
      let self = this;
      self.separateUrlForIndex = false;
      self.cohortModel.getCanonicalModels().forEach(function(model) {
        var modelInfo = self.modelInfoMap[model.relationship];
        if (modelInfo == null) {
          modelInfo = {};
          modelInfo.relationship = model.relationship;
          modelInfo.sex          = model.sex ? model.sex : null;
          modelInfo.vcf          = model.vcf ? model.vcf.getVcfURL() : null;
          modelInfo.tbi          = model.vcf ? model.vcf.getTbiURL() : null;
          modelInfo.bam          = model.bam ? model.bam.bamUri : null;
          modelInfo.bai          = model.bam ? model.bam.baiUri : null;
          modelInfo.sample       = model.getSampleName();
          modelInfo.name         = model.getName();
          modelInfo.samples      = model.sampleNames;
          modelInfo.isAffected   = model.isAffected();
          modelInfo.model        = model;
          if (modelInfo.tbi || modelInfo.bai) {
            self.separateUrlForIndex = true;
          }
          self.$set(self.modelInfoMap, model.relationship, modelInfo);
        }
      })
    },
    promiseInitMotherFather: function() {
      let self = this;

      return new Promise(function(resolve, reject) {
        var modelInfoMother = {};
        modelInfoMother.relationship = 'mother';
        modelInfoMother.sex = "female";
        modelInfoMother.vcf = null;
        modelInfoMother.bam = null;
        modelInfoMother.affectedStatus = 'unaffected'
        self.cohortModel.promiseAddSample(modelInfoMother)
        .then(function() {
          var modelInfoFather = {};
          modelInfoFather.relationship = 'father';
          modelInfoFather.sex = "male"
          modelInfoFather.vcf = null;
          modelInfoFather.bam = null;
          modelInfoFather.affectedStatus = 'unaffected'

            self.cohortModel.promiseAddSample(modelInfoFather)
            .then(function() {

              self.initModelInfo();
              resolve();

            })
            .catch(function(error) {
              reject(error);
            })
        })
        .catch(function(error) {
          reject(error);
        })

      })
    },
    removeMotherFather: function() {
      let self = this;
      delete self.modelInfoMap.mother;
      delete self.modelInfoMap.father;
      self.cohortModel.removeSample("mother");
      self.cohortModel.removeSample("father");
    }, 
    closeFilesDialog: function() {
      this.showFilesDialog = false; 
      bus.$emit("close-files-dialog")
    },
    setBedUrl: function(url) {
      this.bedFileUrl = url;
    }
  },
  computed: {
    buildList: function() {
      if (this.speciesName && this.cohortModel.genomeBuildHelper) {
        return this.cohortModel.genomeBuildHelper.speciesToBuilds[this.speciesName].map(function(gb) {
          return gb.name;
        })
      } else {
        return [];
      }
    }
  },
  created: function() {
    let self = this;

  },
  mounted: function() {
    bus.$on("back-to-files", () => {
      self.sampleIdDupsCounter = {};
      self.validationErrors = [];
    })    
    if (this.cohortModel) {
      this.speciesName =  this.cohortModel.genomeBuildHelper.getCurrentSpeciesName();
      // this.buildName   =  this.cohortModel.genomeBuildHelper.getCurrentBuildName();
      this.speciesList =  this.cohortModel.genomeBuildHelper.speciesList.map(function(sp) {
        return sp.name;
      }).filter(function(name) {
        return name == 'Human';
      });
    }

    if (this.cohortModel && this.showDialog) {
      this.showFilesDialog = true
      this.mode = this.cohortModel.mode;
      this.init();
    }

  }
}
</script>
