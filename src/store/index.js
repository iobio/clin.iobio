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
    review_case_badge: null
  },
  getters: {
    allAnalysis: state => state.analysis,
    getPedigreeData: state => state.custom_pedigree_data,
    getVariantsCount: state => state.custom_variants_count,
    getCustomCoverage: state => state.custom_coverage_data,
    getReviewCaseBadge: state => state.review_case_badge,
  },
  actions: {
    fetchAnalysis({ commit }){
      commit('getAnalysis')
    }, 
    updateAnalysis({ commit }, analysis){
      commit('setAnalysis', analysis)
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
    }
  },
  mutations: {
    getAnalysis: (state) => {
      return state.analysis.payload.phenotypes; 
    }, 
    setAnalysis: (state, analysis) => state.analysis = analysis,
    ADD_PEDIGREE: (state, pedigreeData) => state.custom_pedigree_data = pedigreeData,
    ADD_VARIANTS_COUNT: (state, variantsCount) => state.custom_variants_count = variantsCount,
    ADD_COVERAGE_DATA: (state, coverageData) => state.custom_coverage_data = coverageData,
    SET_REVIEW_CASE_BADGE: (state, reviewCaseBadge) => state.review_case_badge = reviewCaseBadge,
  },
  modules: {
  }
})
