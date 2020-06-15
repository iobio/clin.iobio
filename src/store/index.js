import Vue from 'vue'
import Vuex from 'vuex'
import analysisData  from '../data/analysis.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    analysis: analysisData
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
    }
  },
  mutations: {
    getAnalysis: (state) => {
      console.log("analysis called from fetchAnalysis", state.analysis.payload.phenotypes);
      return state.analysis.payload.phenotypes; 
    }, 
    setAnalysis: (state, analysis) => state.analysis = analysis,
  },
  modules: {
  }
})
