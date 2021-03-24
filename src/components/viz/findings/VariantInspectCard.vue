<template>

  <div v-show="selectedVariant" id="variant-inspect" class="app-card full-width">
    <v-expansion-panels v-model="panel" accordion focusable>
      <v-expansion-panel>
        <v-expansion-panel-header style="min-height:50px; padding-top:8px; padding-bottom:8px">
          <v-chip  style="position:absolute; font-size:15px padding:2px" color="primary">
            <span v-if="panel!==0" >
              <span id="badge-interpretation-label"
                :class="{
                        'not-reviewed': selectedVariant.interpretation == 'not-reviewed',
                        'not-sig'     : selectedVariant.interpretation == 'not-sig',
                        'sig'         : selectedVariant.interpretation == 'sig',
                        'unknown-sig' : selectedVariant.interpretation == 'unknown-sig',
                        'poor-qual'   : selectedVariant.interpretation == 'poor-qual'}"
              >
                <v-icon class="interpretation sig" v-if="selectedVariant.interpretation == 'sig'">verified_user</v-icon>
                <v-icon class="interpretation unknown-sig" v-if="selectedVariant.interpretation == 'unknown-sig'">help</v-icon>
                <v-icon class="interpretation not-sig" v-if="selectedVariant.interpretation == 'not-sig'">thumb_down</v-icon>
                <v-icon class="interpretation poor-qual" v-if="selectedVariant.interpretation == 'poor-qual'">trending_down</v-icon>
                <v-icon class="interpretation unknown-sig" v-if="selectedVariant.interpretation == 'not-reviewed'">help</v-icon>
              </span>
              <strong class="ml-1 mr-1">{{ selectedGene.gene_name }}</strong> 
            </span>
            <span v-else>
              <strong class="ml-1 mr-1">{{ selectedGene.gene_name }}</strong> 
            </span>
          </v-chip>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-if="selectedGene" style="display:flex;align-items:flex-start;justify-content:flex-start;margin-bottom:10px" class="pt-4">
            <span class="" style="margin-right:20px">
              <variant-interpretation-badge
                 :interpretation="selectedVariant.interpretation"
                 :interpretationMap="interpretationMap">
              </variant-interpretation-badge>

            </span>

            <!-- <div  id="variant-heading" v-if="selectedVariant" style="margin-left:20px" class="text-xs-left">
              <span class="pr-1" v-if="selectedVariantRelationship != 'proband'">
                <span class="rel-header">{{ selectedVariantRelationship | showRelationship }}</span>
              </span>




            </div> -->
      <!--
            <variant-links-menu
            v-if="selectedGene && selectedVariant && info"
            :selectedGene="selectedGene"
            :selectedVariant="selectedVariant"
            :geneModel="cohortModel.geneModel"
            :info="info">
            </variant-links-menu>
      -->

      <!-- 
            <span v-if="!info || (info.HGVSpLoading && info.HGVScLoading)"
              style="font-size:13px;margin-top:2px;min-width:80px;margin-left:0px;margin-right:0px"
              v-show="selectedVariantRelationship != 'known-variants'" class=" loader vcfloader" >
              <img src="../../../assets/images/wheel.gif">
              HGVS
            </span>
       -->


            <variant-aliases-menu
            v-show="selectedVariant && (!info.HGVSpLoading || !info.HGVScLoading)"
            v-if="selectedVariant && selectedVariantRelationship != 'known-variants'"
            :label="`HGVS`"
            :info="info">
            </variant-aliases-menu>

            <v-badge class="info" style="margin-top:2px;margin-right:10px" v-if="selectedVariant && selectedVariant.multiallelic && selectedVariant.multiallelic.length > 0">multiallelic</v-badge>

            <span v-if="info && info.rsId && info.rsId != ''" style="margin-top:2px" class="pr-1 mr-1">{{ info.rsId }}</span>

            <app-icon
             style="min-width:35px;margin-top:1px;margin-right:5px;padding-top: 2px;margin-right:10px"
             icon="zygosity" v-if="selectedVariant && selectedVariant.zygosityProband"
             :type="selectedVariant.zygosityProband.toLowerCase() + '-large'"
             height="14" width="35">
            </app-icon>

            <span v-if="selectedVariant" class="variant-header" style="margin-top:2px">

              <span style="vertical-align:top">{{ selectedVariant.type ? selectedVariant.type.toUpperCase() : "" }}</span>
              <span style="vertical-align:top" class="pl-1">{{ coord }}</span>
              <span class="pl-1 refalt">{{ refAlt  }}</span>


            </span>



            <span class="pl-3 variant-header aa-change" style="margin-top:2px">{{ aminoAcidChange }}</span>





            <v-spacer></v-spacer>

            
            <div style="margin-left:20px;margin-right:0px; margin-top:10px; margin-right:10px">
              <v-btn raised id="show-assessment-button" @click='gotoStep(2)'>
                <v-icon>gavel</v-icon>
                Review
              </v-btn>
            </div>
         

            <variant-notes-menu
             :variant="selectedVariant">
            </variant-notes-menu>


          </div>
          
          <span v-if="selectedGene.gene_name">
            <div>
              <span class="chart-label">Source: </span>
              <span v-for="(source, idx) in getSourceIndicatorBadge" :key="idx">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span
                      v-on="on"
                      class="ml-1 mr-1"
                    >
                    <div left color="grey lighten-1" class="myBadge">
                      <span slot="badge"> {{ source }}</span>
                    </div>
                    </span>
                  </template>
                  <span> {{ selectedGeneSources.source[idx]}}</span>
                </v-tooltip>
              </span>
            </div>
          </span>


          <div class="variant-inspect-body">
            <div class="variant-inspect-column" v-if="selectedVariant && selectedVariantRelationship != 'known-variants'">
                <div class="variant-column-header">
                  Quality
                  <v-divider></v-divider>
                </div>
                <variant-inspect-quality-row
                  :info="getQualityInfo()"  >
                </variant-inspect-quality-row>



            </div>
            <div class="variant-inspect-column " v-if="selectedVariant" >
                <div class="variant-column-header">
                  Gene:Phenotype Associations
                  <v-divider></v-divider>
                </div>
                <div v-if="genePhenotypeRankings && genePhenotypeRankings!==null && genePhenotypeRankings.length" >
                  <div v-for="(geneHit, index) in genePhenotypeRankings.slice(0,3)" :key="geneHit.key" class="variant-row" style="flex-flow:column">
                    <div v-for="geneRank in geneHit.geneRanks" :key="geneRank.rank">
                      <div>
                        <v-chip  color="white" v-if="geneRank.rank" class="high">
                          <span class="mr-1">#{{ geneRank.rank  }}</span>
                          <span v-if="geneRank.source">{{  geneRank.source }}</span>
                        </v-chip>
                        <v-chip  color="white" v-else class="high">
                          <span v-if="geneRank.source"> {{ geneRank.source }}</span>
                        </v-chip>
                        <span v-if="geneHit.searchTerm && geneRank.source!=='HPO'" class="pheno-search-term_clin">
                          {{ geneHit.searchTerm | to-firstCharacterUppercase }}
                        </span>
                        <span v-else-if="geneRank.source==='HPO' && geneRank.hpoPhenotype" class="pheno-search-term_clin">
                          {{ geneRank.hpoPhenotype | to-firstCharacterUppercase }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="genePhenotypeRankings!==null && genePhenotypeRankings.length>=4">
                  <v-btn id="show-more-gene-association-button"
                    text small color="primary"
                    slot="activator"
                    style="float:right"
                    v-tooltip.bottom-center="`Show all associations for this variant`"
                    @click="showMoreGeneAssociationsDialog=true">
                      <v-icon>zoom_out_map</v-icon>Show more
                  </v-btn>
                </div>
                <div>
                  <gene-associations-dialog
                    v-if="showMoreGeneAssociationsDialog"
                    :showDialog="showMoreGeneAssociationsDialog"
                    :genePhenotypeHits="genePhenotypeRankings"
                    :selectedGene="selectedGene.gene_name"
                    @close-gene-association-dialog="onCloseGeneAssociationDialog($event)">
                  </gene-associations-dialog>
                </div>
            </div>      
            <div class="variant-inspect-column" v-if="selectedVariant && info">
                <div class="variant-column-header">
                  Pathogenicity
                  <v-divider></v-divider>
                </div>
                <variant-inspect-row  v-for="clinvar,clinvarIdx in info.clinvarLinks" :key="clinvarIdx"
                  :clazz="getClinvarClass(clinvar.significance)" :value="clinvar.clinsig" :label="`ClinVar`" :link="clinvar.url" >
                </variant-inspect-row>

                <div v-if="info.clinvarTrait.length > 0" class="variant-row no-icon no-top-margin small-font">
                  <span>{{ info.clinvarTrait }} </span>
                </div>

                <variant-inspect-row
                  :clazz="getImpactClass(info.vepImpact)" :value="info.vepConsequence"  :label="``"  >
                </variant-inspect-row>

                <variant-inspect-row
                   v-if="info.vepHighestImpactValue.length > 0 && info.vepImpact.toUpperCase() != info.vepHighestImpactValue.toUpperCase()"
                  :clazz="getImpactClass(info.vepHighestImpactValue)" :label=" `Most severe impact in non-canonical transcript`"  >
                </variant-inspect-row>

                <div v-if="info.vepHighestImpactValue.length > 0 && info.vepImpact.toUpperCase() != info.vepHighestImpactValue.toUpperCase()" class="variant-row no-icon no-top-margin">

                          <span v-for="(impactRec, idx) in info.vepHighestImpactRecs" :key="impactRec.impact">
                            <div style="padding-top:5px" v-for="(effectRec, idx1) in impactRec.effects" :key="effectRec.key">
                              {{ getNonCanonicalEffectDisplay(idx1, effectRec) }}
                              <v-btn class="change-transcript-button" flat v-for="transcriptId in effectRec.transcripts"
                               :key="transcriptId"
                                {{ transcriptId }}
                              </v-btn>
                            </div>
                          </span>
                  
                </div>

                <variant-inspect-row v-if="info.revel != '' && info.revel"
                  :clazz="getRevelClass(info)" :value="info.revel"   :label="`REVEL`" >
                </variant-inspect-row>
            </div>

           
            <div class="variant-inspect-column" v-if="selectedVariant && selectedVariantRelationship != 'known-variants'">
                <div class="variant-column-header">
                  Frequency                     
                  <info-popup name="gnomAD"></info-popup>
                  <v-divider></v-divider>
                </div>
                <variant-inspect-row :clazz="afGnomAD.class" :value="afGnomAD.percent" :label="`Allele freq`" :link="afGnomAD.link" >
                </variant-inspect-row>
                <variant-inspect-row v-if="afGnomAD.percentPopMax" :clazz="afGnomAD.class" :value="afGnomAD.percentPopMax" :label="`Pop max allele freq`" >
                </variant-inspect-row>
                <div v-if="afGnomAD.totalCount > 0" class="variant-row no-icon">
                  <span>{{ afGnomAD.altCount }} alt of {{ afGnomAD.totalCount }} total</span>
                </div>
                <div v-if="afGnomAD.homCount > 0"  class="variant-row no-icon">
                  <span>{{ afGnomAD.homCount }} homozygotes</span>
                </div>
            </div>

            <div class="variant-inspect-column" style="min-width:90px" v-if="selectedVariant && selectedVariantRelationship != 'known-variants' && selectedVariant.inheritance.length > 0">
                <div class="variant-column-header">
                  Inheritance
                  <v-divider></v-divider>
                </div>

                <variant-inspect-inheritance-row :selectedVariant="selectedVariant" >
                </variant-inspect-inheritance-row>

                <div class="pedigree-chart">
                  <app-icon class="hide" icon="affected"></app-icon>
                  <pedigree-genotype-viz
                   ref="pedigreeGenotypeViz"
                   style="width:139px"
                   :margin="{left: 15, right: 14, top: 30, bottom: 4}"
                   :nodeWidth="30"
                   :nodePadding="40"
                   :nodeVerticalPadding="30"
                   :data="pedigreeGenotypeData">
                  </pedigree-genotype-viz>
                </div>


            </div>

            <div class="variant-inspect-column last" v-if="selectedVariant" style="min-width:320px;max-width:320px">
                <div class="variant-column-header" >
                  Conservation
                  <v-divider></v-divider>
                </div>
                <div id="conservation-track" style="display:flex;min-width:320px;max-width:320px">
                  <div style="display:flex;flex-direction: column;max-width:130px;min-width:130px;margin-right: 10px">

                    <variant-inspect-row
                      v-show="multiAlignModel && multiAlignModel.selectedScore && showConservation"
                      :clazz="getConservationClass(conservationExactScore)"
                      :value="getConservationScore(conservationExactScore)"   >
                    </variant-inspect-row>

                    <div class="conservation-score-label"
                      v-if="conservationScores && conservationScores.length > 0">
                      phyloP scores
                    </div>

                    <conservation-scores-viz class="conservation-scores-barchart exon"
                     :data=conservationScores
                     :options=conservationOptions
                     :exactScore=conservationExactScore
                     :targetScore=conservationTargetScore
                     :margin="{top: 10, right: 2, bottom: 15, left: 4}"
                     :width="130"
                     :height="60">
                    </conservation-scores-viz>

                    <gene-viz id="conservation-gene-viz" class="gene-viz"
                      v-if="showConservation"
                      v-show="filteredTranscript && filteredTranscript.features && filteredTranscript.features.length > 0"
                      :data="[filteredTranscript]"
                      :margin="conservationGeneVizMargin"
                      :height="16"
                      :trackHeight="geneVizTrackHeight"
                      :cdsHeight="geneVizCdsHeight"
                      :regionStart="coverageRegionStart"
                      :regionEnd="coverageRegionEnd"
                      :showXAxis="false"
                      :showBrush="false"
                      :featureClass="getExonClass"
                      >
                    </gene-viz>


                  </div>
                  <div style="min-width:190px" >

                
                    <toggle-button
                      v-if="false && hasConservationAligns"
                      name1="Nuc"
                      name2="AA"
                      label="Sequence"
                      buttonWidth="90"
                     @click="onToggleConservationNucAA">
                    </toggle-button>
                  

                    <span v-if="multialignInProgress" class="pt-4 loader multialign-loader" >
                        <img src="../../../assets/images/wheel.gif">
                        Loading sequence
                    </span>

                    <multialign-seq-viz style="margin-top:10px;min-width:190px"
                    :data="multialignSequences"
                    :margin="{top: 15, right: 0, bottom: 0, left: 70}"
                    :selectedBase="multialignSelectedBase">
                    </multialign-seq-viz>

                  </div>
                </div>
            </div>

          </div>
          <v-btn text :disabled="!drugsData.length" color="primary" @click="showDrugInformationDialog=true">
            <v-icon color="primary" class="mr-2">fas fa-pills</v-icon>
            <span class="pt-1">Drugs for <strong>{{ selectedGene.gene_name }}</strong></span>
          </v-btn>
          
          <div>
            <drug-info-dialog
              v-if="showDrugInformationDialog"
              :showDialog="showDrugInformationDialog"
              :gene="selectedGene.gene_name"
              @close-drug-info-dialog="onCloseDrugInfoDialog"
              :drugsData="drugsData">
            </drug-info-dialog>
          </div>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- <p><h2>Variant in {{ selectedGene.gene_name }}</h2></p> -->


  </div>

</template>

<script>

import Vue                      from "vue"
import AppIcon                  from "../../partials/AppIcon.vue"
import VariantInspectRow        from "../../partials/findings/VariantInspectRow.vue"
import VariantInspectQualityRow from "../../partials/findings/VariantInspectQualityRow.vue"
import VariantInspectInheritanceRow from "../../partials/findings/VariantInspectInheritanceRow.vue"
import VariantLinksMenu         from "../../partials/findings/VariantLinksMenu.vue"
import VariantAliasesMenu       from "../../partials/findings/VariantAliasesMenu.vue"
import InfoPopup                from "../../partials/findings/InfoPopup.vue"
import ToggleButton             from '../../partials/findings/ToggleButton.vue'
import VariantNotesMenu         from '../../partials/findings/VariantNotesMenu.vue'
import VariantInterpretationBadge from '../../partials/findings/VariantInterpretationBadge.vue'
import GeneViz                  from "../../viz/findings/GeneViz.vue"
import PedigreeGenotypeViz      from "../../viz/findings/PedigreeGenotypeViz.vue"
import ConservationScoresViz    from "../../viz/findings/ConservationScoresViz.vue"
import MultialignSeqViz         from "../../viz/findings/MultialignSeqViz.vue"
import GeneAssociationsDialog   from "./GeneAssociationsDialog.vue"
import DrugInfoDialog           from './DrugInfoDialog.vue'

import BarChartD3               from '../../../d3/findings/BarChart.d3.js'
import MultiAlignD3             from '../../../d3/findings/MultiAlign.d3.js'
import MultiAlignModel          from "../../../models/findings/MultiAlignModel.js"
import { bus }                  from '../../../main'

import { mapGetters, mapActions } from 'vuex'


export default {
  name: 'variant-inspect-card',
  components: {
    AppIcon,
    InfoPopup,
    VariantLinksMenu,
    VariantAliasesMenu,
    VariantInspectRow,
    VariantInspectQualityRow,
    VariantInspectInheritanceRow,
    VariantNotesMenu,
    GeneViz,
    PedigreeGenotypeViz,
    ToggleButton,
    ConservationScoresViz,
    MultialignSeqViz,
    VariantInterpretationBadge,
    GeneAssociationsDialog,
    DrugInfoDialog
  },
  props: {
    selectedVariant: null,
    genomeBuildHelper: null,
    modelInfos: null,
    selectedGene: null,
    selectedTranscript: null,
    info: null,
    genePhenotypeHits: null,
    interpretationMap: null,
    drugsObj: null,
    phenolyzerTerms: null,
    hpoTerms: null
  },
  data() {
    return {
      selectedVariantRelationship: 'proband',


      // genePhenotypeRankings: null,

      coverageRegionStart: null,
      coverageRegionEnd: null,
      exon: null,
      selectedExon: null,

      filteredTranscript: null,

      geneVizMargin: {
        top: 0,
        right: 2,
        bottom: 0,
        left: 4
      },
      conservationGeneVizMargin: {
        top: 0,
        right: 2,
        bottom: 0,
        left: 4
      },
      geneVizTrackHeight: 16,
      geneVizCdsHeight: 12,

      multiAlignModel: new MultiAlignModel(),

      pedigreeGenotypeData: null,

      showConservation: false,
      hasConservationScores: false,
      hasConservationAligns: false,

      conservationSeqType: 'nuc',

      conservationScores: null,
      conservationOptions: null,
      conservationTargetScore: null,
      conservationExactScore: null,

      multialignSequences: null,
      multialignSelectedBase: null,
      multialignInProgress: false,

      // For REVEL range, value must be >= min and < max
      revelMap: [ 
       {min: 0,   max: .5,   value: +1, badge: false, clazz: '',              symbolFunction: ''},
       {min: .5,  max: .75,  value: +2, badge: false, clazz: 'revel_moderate', symbolFunction: ''},
       {min: .75, max: 1,    value: +3, badge: false, clazz: 'revel_high',     symbolFunction: ''}
      ],

      // TODO - Need way to get coverage thresholds
      geneCoverageMin: 10,
      showMoreGeneAssociationsDialog: false,
      showDrugInformationDialog: false,
      drugsData: [],
      genesAssociatedWithSource: {},
      selectedGeneSources: {},
      panel: 0
    }
  },


  methods: {
    refresh: function() {

    },


    formatPopAF: function(afObject) {
      let self = this;
      var popAF = "";
      if (afObject['AF'] != ".") {
        for (var key in afObject) {
          if (key != "AF") {
            var label = key.split("_")[0];
            if (popAF.length > 0) {
              popAF += ", ";
            }
            popAF += label + " " + (afObject[key] == "." ? "0%" : self.globalApp.utility.percentage(afObject[key]));
          }
        }
      }
      return popAF;
    },
    getNonCanonicalImpactDisplay: function(idx, impactRec) {
      let buf = "";
      if (idx > 0) {
        buf += " | ";
      }
      buf += impactRec.impact.toLowerCase() + ' impact ';
      return buf;
    },
    getNonCanonicalEffectDisplay: function(idx, effectRec) {
      let buf = "";
      buf += this.globalApp.utility.capitalizeFirstLetter(effectRec.display) + " in ";
      return buf;
    },
    onShowPileup: function() {
      this.$emit("show-pileup-for-variant",
        this.selectedVariantRelationship ? this.selectedVariantRelationship : 'proband',
        this.selectedVariant);
    },



    formatCanonicalTranscript: function() {
      if (this.selectedTranscript) {
        return this.globalApp.utility.stripTranscriptPrefix(this.selectedTranscript.transcript_id);
      } else {
        return "";
      }
    },





    getNonCanonicalImpact: function(vepHighestImpact) {
      return this.globalApp.utility.capitalizeFirstLetter(vepHighestImpact.toLowerCase());
    },

    getQualityInfo: function() {
      let self  = this;
      if (self.selectedVariant == null) {
        return {clazz: '', depthClazz: '', altRatioClazz: '', reason: ''};
      }

      var zyg       =  self.selectedVariant.zygosityProband.toLowerCase();
      var altAndRef = +self.selectedVariant.refCountProband + +self.selectedVariant.altCountProband;
      var altRatio  = (+self.selectedVariant.altCountProband / +self.selectedVariant.depthProband);

      var info = {clazz: '', depthClazz: '', altRatioClazz: '', reason: ''}

      // TODO - Need way to get coverage thresholds
      var depthThreshold = {'good':     self.geneCoverageMin,
                            'moderate': self.geneCoverageMin - 5};

      var altRatioThreshold = { 'good':     {'het': .1,   'hom': .6, 'homref': 0},
                                'moderate': {'het': .05,  'hom': .4, 'homref': 0} };

      var depthClazz = '';
      var altRatioClazz = '';

      if (+self.selectedVariant.depthProband >= depthThreshold.good) {
        info.depthClazz = 'good';
      } else if (+self.selectedVariant.depthProband >= depthThreshold.moderate) {
        info.depthClazz = 'moderate';
        info.reason += "Questionable sequence depth";
      } else {
        info.depthClazz = 'poor';
        info.reason += "Poor sequence depth";
      }

      if (altRatio >= altRatioThreshold.good[zyg]) {
        info.altRatioClazz = 'good';
      } else if (+self.selectedVariant.depthProband >= depthThreshold.moderate[zyg]) {
        info.altRatioClazz = 'moderate';
        if (info.reason.length > 0) {
          info.reason += ", ";
        }
        info.reason += "Questionable evidence of alternate allele";
      } else {
        info.altRatioClazz = 'poor';
        if (info.reason.length > 0) {
          info.reason += ", ";
        }
        info.reason += "Poor evidence of alternate allele";
      }

      if (info.depthClazz == 'good' && info.altRatioClazz == 'good') {
        info.clazz = 'good';
        info.reason = 'Sufficient depth and allele counts'
      } else if (info.depthClazz == 'poor' || info.altRatioClazz == 'poor') {
        info.clazz = 'poor';
      } else {
        info.clazz = 'moderate';
      }

      return info;
    },


    getRevelClass: function(info) {
      let self = this;
      let clazz = null;
      self.revelMap.forEach(function(revelRange) {
      if (info.revel >= revelRange.min && info.revel < revelRange.max) {
          clazz = revelRange.clazz;
        }
      })

      if (clazz) {
        if (clazz == 'revel_high') {
          return 'level-high';
        } else if (clazz == 'revel_moderate') {
          return 'level-medium';
        } else {
          return 'level-unremarkable';
        }
      } else {
        return 'level-unremarkable';
      }

    },
    getAfClass: function(af) {
      if (af <= .01) {
        return 'level-high';
      } else if (af <= .05) {
        return 'level-medium';
      } else {
        return 'level-unremarkable';
      }
    },
    getImpactClass: function(impact) {
      if (impact && impact.toLowerCase() == 'high') {
        return 'level-high'
      } else if (impact && impact.toLowerCase() == 'moderate') {
        return 'level-medium'
      } else {
        return 'level-unremarkable';
      }
    },
    getClinvarClass: function(significance) {
      if (significance == 'clinvar_path' || significance == 'clinvar_lpath') {
        return 'level-high';
      } else if(significance == 'clinvar_cd') {
        return 'level-medium';
      } else if (significance == 'clinvar_benign' || significance == 'clinvar_lbenign') {
        return 'level-unremarkable';
      } else {
        return '';
      }
    },
    getConservationScore: function(score) {
      if (score == null) {
        return "";
      } else {
        if (score.y > 1.5) {
          return 'Highly conserved ' + score.y;
        } else if (score.y > 1) {
          return 'Moderately conserved ' + score.y;
        } else if (score.y > 0) {
          return 'Marginally conserved ' + score.y;
        } else {
          return 'Not conserved ' + score.y;
        }
      }
    },
    getConservationClass: function(score) {
      if (score == null) {
        return "";
      } else {
        if (score.y > 1.5) {
          return 'level-high'
        } else if (score.y > 1) {
          return 'level-medium'
        } else if (score.y > 0) {
          return 'level-low'
        } else {
          return 'level-unremarkable';
        }
      }
    },
    
    fetchDrugInfo: function(){
      let selectedGene = this.selectedGene.gene_name; 
      fetch(`https://platform-api.opentargets.io/v3/platform/public/search?q=${selectedGene}`)
      .then(res => res.json())
      .then(result => {
        var ensembl_gene_id = result.data[0].data.ensembl_gene_id; 
        fetch(`https://platform-api.opentargets.io/v3/platform/public/evidence/filter?target=${ensembl_gene_id}&datasource=chembl&size=350&datatype=known_drug`)
        .then(res => res.json())
        .then(data => {
          this.drugsData = []; 
          let drugs_arr = []; 
          var obj = []
          data.data.map(drug => {
            if(!drugs_arr.includes(drug.drug.molecule_name)){
              drugs_arr.push(drug.drug.molecule_name)
              obj.push({
                drugName: drug.drug.molecule_name, 
                molecule_type: drug.drug.molecule_type, 
                action_type: drug.evidence.target2drug.action_type.toLowerCase(), 
                mechanism_of_action: drug.evidence.target2drug.mechanism_of_action, 
                target_type: drug.target.target_type.replace("_", " "),
                activity: drug.target.activity.replace("_", " "), 
                id: this.getMoleculeId(drug.drug.id), 
                id_url: drug.drug.id, 
              })
            }
          })
          this.drugsData = obj;
          if(this.drugsObj[this.selectedGene.gene_name]===undefined){
            this.drugsObj[this.selectedGene.gene_name] = this.drugsData; 
          }
        })
      })
    }, 
    getMoleculeId(url_id){
      let url = new URL(url_id)
      return url.pathname.split("/")[2];
    },
     
    loadData: function() {
      let self = this;
      if (self.selectedVariant) {
        if(self.drugsObj[self.selectedGene.gene_name]!==undefined){
          self.drugsData = self.drugsObj[self.selectedGene.gene_name]; 
        }
        else if(self.drugsObj[self.selectedGene.gene_name]===undefined){
          self.fetchDrugInfo(); 
        }

        self.initPedigreeGenotypes();
        // self.initGenePhenotypeHits();
        self.promiseInitCoverage()
        .then(function() {
          self.showMultiAlignments();

        })
      }
    },

    initPedigreeGenotypes() {
      let self = this;
      self.$set(self, "pedigreeGenotypeData", {});
      let thePedigreeGenotypeData = {}
      self.modelInfos.forEach(function(model) {
        if (model.relationship != 'known-variants' && model.relationship != 'sfari-variants') {
          let gtObject = {};
          gtObject.rel = model.relationship;
          gtObject.sex = model.sex
          gtObject.affectedStatus = model.affectedStatus;
          if (self.selectedVariant.variantInspect.genotypes && self.selectedVariant.variantInspect.genotypes[model.sample]) {
            let gt = self.selectedVariant.variantInspect.genotypes[model.sample];
            gtObject.zygosity = gt.zygosity.toLowerCase();

            var altAndRef = +gt.refCount + +gt.altCount;
            var altRatio  = (+gt.altCount / +gt.genotypeDepth);
            var otherCount = 0;
            var otherRatio = 0;
            if (altAndRef < +gt.genotypeDepth) {
              otherCount  = +gt.genotypeDepth - altAndRef;
              otherRatio  = (otherCount / +gt.genotypeDepth);
            }
            gtObject.altRatio   = altRatio;
            gtObject.altCount   = gt.altCount;
            gtObject.otherCount = otherCount;
            gtObject.otherRatio = otherRatio;
            gtObject.refCount   = gt.refCount;
            gtObject.totalCount = gt.genotypeDepth;


          } else {
            gtObject.zygosity = "unknown"
          }
          gtObject.inheritance = self.selectedVariant.inheritance;

          let gtKey = gtObject.rel == 'sibling' ? 'sibling-' + model.name : gtObject.rel;
          thePedigreeGenotypeData[gtKey] = gtObject;
        }
      })
      self.$set(self, "pedigreeGenotypeData", thePedigreeGenotypeData);
      if (self.$refs.pedigreeGenotypeViz) {
        self.$refs.pedigreeGenotypeViz.update();
      } else {
        setTimeout(function() {
          if (self.$refs.pedigreeGenotypeViz) {
            self.$refs.pedigreeGenotypeViz.update();
          }   
        },2000)
      }

    },

    initGenePhenotypeHits: function() {
      let self = this;
      self.genePhenotypeRankings= [];
      if (self.selectedGene && self.selectedVariant && self.genePhenotypeHits) {
        for (var searchTerm in self.genePhenotypeHits) {
          let searchTermLabel = searchTerm.split("_").join(" ");
          var rankRecs        = self.genePhenotypeHits[searchTerm];
          self.genePhenotypeRankings.push( {key: searchTerm, searchTerm: searchTermLabel, geneRanks: rankRecs } );
        }
      }
    },
    promiseInitCoverage: function() {
      let self = this;
      return new Promise(function(resolve, reject) {

        if (self.selectedVariant) {
          self.exon                = self.getExon();
          self.coverageRegionStart = self.getCoverageRegionStart();
          self.coverageRegionEnd   = self.getCoverageRegionEnd();
          self.conservationSeqType = "nuc";
          resolve();

        } else {
          self.exon = null;
          self.coverageRegionStart = null;
          self.coverageRegionEnd = null;
          resolve();
        }
      })
    },
    showCoverageAlleleBar: function() {
      let self = this;
      let theDepth = self.selectedVariant.bamDepth;
      let theAltCount = null;
      // If samtools mpileup didn't return coverage for this position, use the variant's depth
      // field.
      if (theDepth == null || theDepth == '') {
        theDepth = self.selectedVariant.genotypeDepth;
      }
      if (self.selectedVariant.genotype && self.selectedVariant.genotype.altCount) {
        theAltCount = self.selectedVariant.genotype.altCount;
      }

      if (self.$refs.depthVizRef) {
        self.$refs.depthVizRef.showCurrentPoint({pos: self.selectedVariant.start, depth: theDepth, altCount: theAltCount});
      }

    },
    getExonClass: function(exon, i) {
      if (exon && exon.danger) {
        return exon.feature_type.toLowerCase() + (exon.danger.proband ? " danger" : "");
      } else {
        return exon.feature_type.toLowerCase();
      }
    },
    getExonNumber: function() {
      if (this.selectedVariant.hasOwnProperty("vepExon") && !$.isEmptyObject(this.selectedVariant.vepExon)) {
        return Object.keys(this.selectedVariant.vepExon)[0];
      } else {
        return null;
      }
    },

    getExon: function() {
      let self = this;
      let exonNumber = self.getExonNumber();
      if (exonNumber != null) {
        if (self.selectedTranscript && self.selectedTranscript.features) {
          var exons = self.selectedTranscript.features.filter(function(feature) {
            if ( feature.transcript_type == 'protein_coding'
                || feature.transcript_type == 'mRNA'
                || feature.transcript_type == 'transcript'
                || feature.transcript_type == 'primary_transcript') {
              return feature.feature_type.toLowerCase() == 'utr' || feature.feature_type.toLowerCase() == 'cds';
            } else {
              return feature.feature_type.toLowerCase() == 'exon';
            }
          })

          let theExon = exons.filter(function(feature) {
            return +feature.start <= +self.selectedVariant.start && +feature.end >= +self.selectedVariant.start;
          })

          self.filteredTranscript = $.extend({}, self.selectedTranscript);
          self.filteredTranscript.features = theExon;

          if (theExon && theExon.length > 0) {
            return theExon[0];
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        if (self.selectedTranscript) {
          self.filteredTranscript = $.extend({}, self.selectedTranscript);
          self.filteredTranscript.features = [];
        }
        return null;
      }
    },
    getCoverageRegionStart: function() {
      let self = this;

      if (self.exon) {
        let exonWidth = +self.exon.end  -  +self.exon.start;
        return +self.exon.start - Math.round(exonWidth * .60);
      } else  {
        return +self.selectedVariant.start - 1000;
      }
    },
    getCoverageRegionEnd: function() {
      let self = this;
      if (self.exon) {
        let exonWidth = +self.exon.end  -  +self.exon.start;
        return +self.exon.end + Math.round(exonWidth * .60);
      } else  {
        return +self.selectedVariant.start + 1000;
      }
    },

    showMultiAlignments: function() {
      let self = this;
      self.showConservation = false;
      self.hasConservationScores = false;
      self.hasConservationAligns = false;
      self.conservationTargetScore = null;
      self.conservationExactScore = null;
      self.conservationScores = null;
      self.conservationOptions = null;
      self.multialignSequences = null;
      self.multialignSelectedBase = null;
      self.multialignInProgress = true;

      let promises = [];
      let p1 = self.multiAlignModel.promiseGetConservationScores(self.coverageRegionStart,
                                                  self.coverageRegionEnd,
                                                  self.selectedGene,
                                                  self.selectedVariant,
                                                  self.genomeBuildHelper.getBuildAlias(self.genomeBuildHelper.ALIAS_UCSC))
      .then(function(data) {
        if (data) {
          self.conservationExactScore  = data.selectedScore;
          self.conservationTargetScore = data.targetScore;
          self.conservationScores      = data.scores;
          self.conservationOptions     = data.options;
          self.hasConservationScores   = self.multiAlignModel.hasConservationScores(self.coverageRegionStart,
                                                                                    self.coverageRegionEnd,
                                                                                    self.selectedGene);
          self.showConservation =  self.hasConservationScores || self.hasConservationAligns;
        }
      });
      promises.push(p1);


      let p2 = self.multiAlignModel.promiseGetMultiAlignments(self.selectedGene,
                                                  self.selectedVariant,
                                                  self.genomeBuildHelper.getBuildAlias(self.genomeBuildHelper.ALIAS_UCSC),
                                                  self.conservationSeqType)
      .then(function(data) {
        if (data) {
          self.multialignSelectedBase = data.selectedBase;
          self.multialignSequences    = data.sequences;
          self.hasConservationAligns  = data.sequences.length > 0;
          self.multialignInProgress = false;
        }
      })
      .catch(function(error) {
        self.multialignInProgress = false;
      })
      promises.push(p2)

      Promise.all(promises)
      .then(function() {
        self.showConservation =  self.hasConservationScores || self.hasConservationAligns;
      })

    },
    onToggleConservationNucAA: function(seqType) {
      let self = this;
      if (self.selectedVariant) {
        self.multialignInProgress = true;
        self.conservationSeqType = seqType.toLowerCase();
        self.multiAlignModel.promiseGetMultiAlignments(self.selectedGene,
                                                    self.selectedVariant,
                                                    self.genomeBuildHelper.getBuildAlias(self.genomeBuildHelper.ALIAS_UCSC),
                                                    self.conservationSeqType)
        .then(function(data) {
          if (data) {
            self.multialignInProgress   = false;
            self.multialignSequences    = data.sequences;
            self.multialignSelectedBase = data.selectedBase;
          }
        })
        .catch(function(data) {
          self.multialignInProgress = false;
        })        
      }
    },
    gotoStep: function(stepIndex){
      bus.$emit('navigate-to-step',stepIndex); 
    },
    onCloseGeneAssociationDialog: function(data){
      this.showMoreGeneAssociationsDialog = false;
    }, 
    onCloseDrugInfoDialog: function(){
      this.showDrugInformationDialog = false
    },
  },


  computed: {
    ...mapGetters(['getPedigreeData', 'getPedigree', 'getVariantsCount', 'getCustomCoverage', 'getReviewCaseBadge', 'getVariantsByInterpretation', 'getModelInfos', 'getGeneSet', 'getCaseSummary', 'getBuildName', 'getAnalysisProgressStatus', 'getLaunchedFromMosaicFlag', 'getSelectedGenesForVariantsReview', 'getSourceForGenes', 'getGlobalgenePhenotypeHits']),

    hgvsLabel: function() {
      if (this.selectedVariant && this.selectedVariant.extraAnnot && this.info.HGVSpAbbrev && this.info.HGVSpAbbrev.length > 0) {
        return this.info.HGVSpAbbrev;
      } else {
        return 'HGVS';
      }
    },


    coord: function() {
      let self = this;
      if (self.selectedVariant) {
        return self.selectedVariant.chrom + ":" + self.selectedVariant.start;
      } else {
        return "";
      }
    },

    refAlt: function() {
      let self = this;
      var refAlt = "";
      if (self.selectedGene && self.selectedGene.strand && self.selectedVariant) {
        if (self.isEduMode) {
          if (self.selectedGene.strand == "-") {
            refAlt = self.globalApp.utility.switchGenotype(self.selectedVariant.eduGenotype)
          } else {
            refAlt = self.selectedVariant.eduGenotype;
          }
        } else {
          refAlt =   self.selectedVariant.ref + "->" + self.selectedVariant.alt;
          if (self.selectedVariant.ref == '' && self.selectedVariant.alt == '') {
            refAlt = '(' + variant.len + ' bp)';
          }

        }
      }
      return refAlt;
    },
    aminoAcidChange: function() {
      let aaChange = "";
      let self = this;
      if (self.selectedVariant && Object.keys(self.selectedVariant.variantInspect.vepAminoAcids).join("").length > 0) {
        for (let aa in self.selectedVariant.variantInspect.vepAminoAcids) {
          aaChange += self.globalApp.utility.formatAminoAcidChange(aa)
        }
        if (Object.keys(self.selectedVariant.variantInspect.vepProteinPosition).join("").length > 0) {
          aaChange += " at " + Object.keys(self.selectedVariant.variantInspect.vepProteinPosition).join(" ");
        }
      }
      if (aaChange.length > 0) {
        return aaChange;
      } else {
        return "";
      }
    },
    afGnomAD: function() {
      if (this.selectedVariant) {
        if (this.globalApp.gnomADExtraAll || (this.globalApp.gnomADExtra && this.selectedVariant.variantInspect && selectedVariant.variantInspect.extraAnnot)) {
          if (this.selectedVariant.variantInspect.gnomAD == null || this.selectedVariant.variantInspect.gnomAD.af == null) {
            return {percent: "?", link: null, class: ""};
          } else if (this.selectedVariant.variantInspect.gnomAD.af  == '.') {
            return {percent: "0%", link: null, class: "level-high"};
          } else  {
            var gnomAD = {};
            gnomAD.link =  "http://gnomad.broadinstitute.org/variant/"
              + this.selectedVariant.chrom + "-"
              + this.selectedVariant.start + "-"
              + this.selectedVariant.ref + "-"
              + this.selectedVariant.alt;

            if (this.genomeBuildHelper.getCurrentBuildName() == 'GRCh38') {
              gnomAD.link += "?dataset=gnomad_r3"
            };

            gnomAD.percent       = this.globalApp.utility.percentage(this.selectedVariant.variantInspect.gnomAD.af);
            gnomAD.class         = this.getAfClass(this.selectedVariant.variantInspect.gnomAD.af);
            gnomAD.percentPopMax = this.selectedVariant.variantInspect.gnomAD.afPopMax != '.' ? this.globalApp.utility.percentage(this.selectedVariant.variantInspect.gnomAD.afPopMax) : '0%';
            gnomAD.altCount      = this.selectedVariant.variantInspect.gnomAD.altCount;
            gnomAD.totalCount    = this.selectedVariant.variantInspect.gnomAD.totalCount;
            gnomAD.homCount      = this.selectedVariant.variantInspect.gnomAD.homCount;
            return gnomAD;

          }
        } else {
          if (this.selectedVariant.variantInspect.vepAf == null || this.selectedVariant.variantInspect.vepAf.gnomAD.AF == null) {
            return {percent: "?", link: null, class: ""};
          } else if (this.selectedVariant.variantInspect.vepAf.gnomAD.AF == ".") {
            return {percent: "0%", link: null, class: "level-high"};
          } else  {
            var gnomAD = {};
            gnomAD.link =  "http://gnomad.broadinstitute.org/variant/"
              + this.selectedVariant.chrom + "-"
              + this.selectedVariant.start + "-"
              + this.selectedVariant.ref + "-"
              + this.selectedVariant.alt;

            if (this.genomeBuildHelper.getCurrentBuildName() == 'GRCh38') {
              gnomAD.link += "?dataset=gnomad_r3"
            };              

            gnomAD.percent       = this.globalApp.utility.percentage(this.selectedVariant.variantInspect.vepAf.gnomAD.AF);
            gnomAD.class         = this.getAfClass(this.selectedVariant.variantInspect.vepAf.gnomAD.AF);
            gnomAD.percentPopMax = 0;
            gnomAD.altCount      = 0;
            gnomAD.totalCount    = 0;
            gnomAD.homCount      = 0;
            return gnomAD;
          }

        }
      }
    },
    
    sourceIndicatorLabel: function() {
      let label = "Variant defined in ";
      let gene_name = this.selectedGene.gene_name;
      let source = this.getSourceForGenes[gene_name].source.join(", ");
      label += source
      return label;
    },
    
    getSourceIndicatorBadge: function() {
      this.selectedGeneSources.source = this.getSourceForGenes[this.selectedGene.gene_name].source;
      this.selectedGeneSources.sourceIndicator = this.getSourceForGenes[this.selectedGene.gene_name].sourceIndicator;
      return this.getSourceForGenes[this.selectedGene.gene_name].sourceIndicator;
    },
    
    genePhenotypeRankings: function() {
      if (this.getGlobalgenePhenotypeHits) {
        if (this.getGlobalgenePhenotypeHits[this.selectedGene.gene_name]) {
          var genePhenotypeRankings = []; 
          var searchTermRecs = this.getGlobalgenePhenotypeHits[this.selectedGene.gene_name];
          if (searchTermRecs) {
            for (var searchTerm in searchTermRecs) {
              let searchTermLabel = searchTerm.split("_").join(" ");
              var rankRecs        = searchTermRecs[searchTerm];
              genePhenotypeRankings.push( {key: searchTerm, searchTerm: searchTermLabel, geneRanks: rankRecs } );
            }
          }
          return genePhenotypeRankings;
        }
        else{
          return "";
        }
      } else {
        return "";
      }
    },

  },

  watch: {
    selectedVariant: function() {
      this.$nextTick(function() {
        this.loadData();
      })
    },
    phenolyzerTerms(){
    },
    hpoTerms(){
    }



  },

  filters: {

    showRelationship: function(buf) {
      if (buf == null) {
        return "";
      } else if (buf == 'known-variants') {
        return 'ClinVar';
      } else {
        // Capitalize first letter
        return buf.charAt(0).toUpperCase() + buf.slice(1);
      }
    },



  },

  updated: function() {
  },

  mounted: function() {
    this.loadData();
  },

  created: function() {
  }


}
</script>

<style lang="sass" >
@import ../../../assets/sass/variables


#variant-inspect
  padding-left: 10px
  padding-top: 10px
  padding-right: 10px
  padding-bottom: 10px
  margin-bottom: 20px
  // border: thin solid #e4e3e3

  .multialign-loader
    font-size: 12px


  .refalt 
    max-width: 200px
    white-space: normal
    display: inline-block
    word-break: break-all
    
  .aa-change
    max-width: 200px
    white-space: normal
    display: inline-block
    word-break: break-all    

  #show-assessment-button
    padding: 0px
    height: 26px !important
    background-color: $app-button-color !important
    color: white !important
    margin: 0px
    padding-left: 10px
    padding-right: 10px

    i.material-icons
      font-size: 15px
      padding-right: 3px

  .subheader
    padding-bottom: 10px
    font-size: 13px
    color: $app-header-color
    margin-top: -5px

  #notes-input
    margin-top: 8px
    .input-group input
      color: $text-color
    .input-group
      padding: 10px 0 0
    .input-group
      label
        font-size: 13px
        line-height: 14px
        height: 18px
        top: 8px
        font-weight: normal
    .input-group__input
      min-height: 0px
      margin-top: 8px
    .input-group--text-field input
      font-size: 13px
      height: 14px
    .input-group
      padding-top: 0px
    .input-group__details:before
      background-color: $text-color
    .input-group__details:after
      background-color: $text-color




  .variant-inspect-body
    display: flex
    flex-direction: row
    flex-wrap: wrap
    justify-content: space-around
    padding-top: 5px



    #conservation-track
      .variant-text
        max-width: 120px



    .variant-inspect-column
      display: flex
      flex-direction: column
      padding: 5px
      padding-left: 0px
      min-width: 150px
      max-width: 210px
      margin-bottom: 0px
      margin-right: 15px
      padding-top: 0px
      padding-bottom: 0px


      &.last
        border-right: none

      .variant-column-header
        font-size: 14px
        color:  $app-header-color
        margin-top: 5px
        margin-bottom: 15px

        hr
          margin-top: 1px
          margin-bottom: 5px
          height: 1px

      .variant-row
        display: flex
        flex-direction: row
        font-size: 13px
        margin-bottom: 10px
        max-width: 260px
        align-items: flex-start

        &.last
          margin-bottom: 0px

      .pheno-search-term_clin
        max-width: 100px
        display: inline-block
        vertical-align: top
        line-height: 14px
        padding-top: 5px

      #qual-track
        margin-top: 0px
        #depth-viz
          .circle-label
            font-size: 13px !important

          .y.axis
            .tick
              text
                font-size: 10px !important

          .coverage-problem-glyph
            fill: $coverage-problem-glyph-color

        .gene-viz
          svg
            .transcript.current
              outline: none !important

      #conservation-track
        .conservation-score-label
          font-size: 12px
        .gene-viz
          svg
            .transcript.current
              outline: none !important

  .rel-header
    font-style: italic

  .variant-header
    color: $app-header-color
    font-size: 14px

  #variant-heading
    color: $app-header-color
    padding-bottom: 5px
    font-size: 16px
    padding-top: 0px
    min-width: 180px
    display: flex
    justify-content: flex-start


  .variant-action-button
      padding: 0px
      height: 22px !important
      margin: 0px
      min-width: 110px !important
      max-width: 110px
      font-weight: 500
      color: $link-color

      .btn__content, .v-btn__content
        color: $link-color !important
        padding-left: 8px
        padding-right: 8px
        font-size: 12px

        i.material-icons
          color: $link-color !important




  .change-transcript-button
    max-height: 14px
    padding: 0px
    margin: 0px
    color: $link-color
    line-height: 14px
    vertical-align: top

    .v-btn__content
      font-size: 12px



  .pedigree-chart 
    circle 
      fill: none
      stroke: black
      stroke-width: 1px

    rect 
      stroke: black
      stroke-width: 1px
      fill: none

    .half-circle  
      path
        fill: none
        stroke: black
        stroke-width: 1px

    .half-diamond 
      path 
        fill: none
        stroke: black
        stroke-width: 1px

    rect.het 
      stroke: none !important

    .het, .hom
      fill: #c5c5c5 !important
      stroke: black

    .half-circle  
      path.het 
        fill: #c5c5c5 !important
        stroke: black
    .half-diamond 
      path.het 
        fill: #c5c5c5 !important
        stroke: black


    .het.critical.proband, .hom.critical.proband
      fill: #c5c5c5 !important

    .half-diamond 
      path.het.critical.proband 
        fill: #c5c5c5 !important

    line 
      stroke: black !important


    .proband
      stroke: $current-color !important
      stroke-width: 3px !important

    .allele-count-bar 
      rect.alt-count 
        fill: $current-color
        opacity: .65

      text
        font-size: 11px
        text-anchor: middle
        
#source-indicator-text
  font-size: 12px
  color: #434343
  
.myBadge
  background-color: #efeeee 
  border-radius: 90px 
  height: 16px
  color: #717171 
  margin-left: 1px 
  // margin-right: 1px
  // padding: .5px 3px .5px 3px 
  text-align: center 
  vertical-align: middle
  width: 16px
  display: inline-block
  font-size: 11px
  font-family: raleway
  
#badge-interpretation-label
  font-family: $app-font
  // padding-left: 3px
  padding-right: 3px
  font-size: 13px
  color: $workflow-active-color
  width: auto
  margin-bottom: 3px
  padding-top: 2px
  padding-bottom: 2px
  border-radius: 4px
  border: $workflow-active-color

  i.material-icons
    font-size: 20px !important
    margin-right: 0px
    padding-right: 0px

  &.not-reviewed
    i.material-icons
      color: $unknown-significance-color !important

  &.sig
    i.material-icons
      color: $significant-color !important

  &.not-sig
    i.material-icons
      color: $not-significant-color  !important

  &.poor-qual
    i.material-icons
      color: $poor-qual-color !important

  &.unknown-sig
    i.material-icons
      color: $unknown-significance-color !important
  
</style>

<style lang="css">


</style>





