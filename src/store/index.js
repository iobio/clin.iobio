import Vue from 'vue'
import Vuex from 'vuex'
import analysisData  from '../data/analysis.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    analysis: analysisData,
    custom_pedigree_data: [],
    custom_pedigree: null,
    custom_variants_count: [],
    custom_coverage_data: [],
    review_case_badge: null,
    variants_by_interpretation: [],
    custom_model_infos: [],
    custom_gene_set: [],
    custom_case_Summary: {},
    build_name: 'GRCh37',
    imported_variants: [],
    analysis_in_progress_status: false,
    is_launched_from_mosaic: false,
    selected_genes_for_variants_review: [],
    genesAssociatedWithSource: {},
    genes_top: 20,
    genePhenotypeHits_global: {},
  },
  getters: {
    allAnalysis: state => state.analysis,
    getPedigreeData: state => state.custom_pedigree_data,
    getPedigree: state => state.custom_pedigree,
    getVariantsCount: state => state.custom_variants_count,
    getCustomCoverage: state => state.custom_coverage_data,
    getReviewCaseBadge: state => state.review_case_badge,
    getVariantsByInterpretation: state => state.variants_by_interpretation,
    getModelInfos: state => state.custom_model_infos,
    getGeneSet: state => state.custom_gene_set,
    getCaseSummary: state => state.custom_case_Summary,
    getBuildName: state => state.build_name,
    getImportedVariants: state => state.imported_variants,
    getAnalysisProgressStatus: state => state.analysis_in_progress_status,
    getLaunchedFromMosaicFlag: state => state.is_launched_from_mosaic,
    getSelectedGenesForVariantsReview: state => state.selected_genes_for_variants_review,
    getSourceForGenes: state => state.genesAssociatedWithSource,
    getGenesTop: state => state.genes_top,
    getGlobalgenePhenotypeHits: state => state.genePhenotypeHits_global,
  },
  actions: {
    fetchAnalysis({ commit }){
      commit('GET_ANALYSIS')
    }, 
    updateAnalysis({ commit }, analysis){
      commit('SET_ANALYSIS', analysis)
    },
    setPedigreeData({commit}, pedigreeData){
      commit('ADD_PEDIGREE', pedigreeData)
    },
    setPedigree({commit}, pedigree){
      commit('ADD_PED', pedigree)
    },
    setVariantsCount({commit}, variantsCount){
      commit('ADD_VARIANTS_COUNT', variantsCount)
    },
    setCoverageData({commit}, coverageData){
      commit('ADD_COVERAGE_DATA', coverageData)
    },
    setReviewCaseBadge({commit}, reviewCaseBadge){
      commit('SET_REVIEW_CASE_BADGE', reviewCaseBadge)
    },
    setVariantsByInterpretation({commit}, data){
      commit('SET_VARIANTS_BY_INTERPRETATION', data)
    },
    setModelInfos({commit}, modelInfos){
      commit('SET_MODEL_INFOS', modelInfos)
    },
    setCustomGeneSet({commit}, geneSet){
      commit('SET_GENE_SET', geneSet)
    },
    setCaseSummary({commit}, caseSummary){
      commit('SET_CASE_SUMMARY', caseSummary)
    },
    setBuildName({commit}, build){
      commit('SET_BUILD_NAME', build)
    },
    setImportedVariantSets({commit}, variants){
      commit('SET_IMPORTED_VARIANTS', variants)
    },
    setAnalysisInProgressStatus({commit}, status){
      commit('SET_ANALYSIS_IN_PROGRESS_STATUS', status)
    },
    setMosaicLaunchFlag({commit}, flag){
      commit('SET_MOSAIC_LAUNCH_FLAG', flag)
    },
    setSelectedGenesForVariantsReview({commit}, genes){
      commit('SET_SELECTED_GENES_FOR_VARIANTS_REVIEW', genes)
    },
    setGenesSource({commit}, sourceObj){
      commit('SET_GENES_SOURCE', sourceObj)
    },
    setGenesTop({commit}, number){
      commit('SET_GENES_TOP', number)
    },
    setGlobalgenePhenotypeHits({commit}, genesReport){
      commit('SET_GENE_PHENOTYPE_HITS', genesReport)
    },
  },
  mutations: {
    GET_ANALYSIS: (state) => state.analysis,
    SET_ANALYSIS: (state, analysis) => state.analysis = analysis,
    ADD_PEDIGREE: (state, pedigreeData) => state.custom_pedigree_data = pedigreeData,
    ADD_PED: (state, pedigree) => state.custom_pedigree = pedigree,
    ADD_VARIANTS_COUNT: (state, variantsCount) => state.custom_variants_count = variantsCount,
    ADD_COVERAGE_DATA: (state, coverageData) => state.custom_coverage_data = coverageData,
    SET_REVIEW_CASE_BADGE: (state, reviewCaseBadge) => state.review_case_badge = reviewCaseBadge,
    SET_VARIANTS_BY_INTERPRETATION: (state, data) => state.variants_by_interpretation = data,
    SET_MODEL_INFOS: (state, modelInfos) => state.custom_model_infos = modelInfos,
    SET_GENE_SET: (state, geneSet) => state.custom_gene_set = geneSet,
    SET_CASE_SUMMARY: (state, caseSummary) => state.custom_case_Summary = caseSummary,
    SET_BUILD_NAME: (state, build) => state.build_name = build,
    SET_IMPORTED_VARIANTS: (state, variants) => state.imported_variants = variants,
    SET_ANALYSIS_IN_PROGRESS_STATUS: (state, status) => state.analysis_in_progress_status = status,
    SET_MOSAIC_LAUNCH_FLAG: (state, flag) => state.is_launched_from_mosaic = flag,
    SET_SELECTED_GENES_FOR_VARIANTS_REVIEW: (state, genes) => state.selected_genes_for_variants_review = genes,
    SET_GENES_SOURCE: (state, sourceObj) => state.genesAssociatedWithSource = sourceObj,
    SET_GENES_TOP: (state, number) => state.genes_top = number,
    SET_GENE_PHENOTYPE_HITS: (state, genesReport) => state.genePhenotypeHits_global = genesReport,
  },
  modules: {
  }
})
