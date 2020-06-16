import Vue from 'vue'
import Vuex from 'vuex'
import analysisData  from '../data/analysis.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    analysis: analysisData,
    custom_pedigree_data: [],
    custom_variants_count: [],
    custom_coverage_data: [],
    review_case_badge: null,
    variants_by_interpretation: [],
  },
  getters: {
    allAnalysis: state => state.analysis,
    getPedigreeData: state => state.custom_pedigree_data,
    getVariantsCount: state => state.custom_variants_count,
    getCustomCoverage: state => state.custom_coverage_data,
    getReviewCaseBadge: state => state.review_case_badge,
    getVariantsByInterpretation: state => state.variants_by_interpretation,
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
    }
  },
  mutations: {
    GET_ANALYSIS: (state) => state.analysis,
    SET_ANALYSIS: (state, analysis) => state.analysis = analysis,
    ADD_PEDIGREE: (state, pedigreeData) => state.custom_pedigree_data = pedigreeData,
    ADD_VARIANTS_COUNT: (state, variantsCount) => state.custom_variants_count = variantsCount,
    ADD_COVERAGE_DATA: (state, coverageData) => state.custom_coverage_data = coverageData,
    SET_REVIEW_CASE_BADGE: (state, reviewCaseBadge) => state.review_case_badge = reviewCaseBadge,
    SET_VARIANTS_BY_INTERPRETATION: (state, data) => state.variants_by_interpretation = data,
  },
  modules: {
  }
})
