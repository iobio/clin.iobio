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

  },
  modules: {
  }
})
