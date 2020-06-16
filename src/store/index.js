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
  },
  getters: {
    allAnalysis: state => state.analysis
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
      console.log("coverageData in store", coverageData);
      commit('ADD_COVERAGE_DATA', coverageData)
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

  },
  modules: {
  }
})
