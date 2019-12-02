<template>
  <v-app>
    <v-content>
      <HelloWorld/>
      <!-- <Main/> -->
      <!-- <PhenotypeExtractor/>
      <GeneList/> -->
      Phenotype Extractor
      <PhenotypeExtractor
        @GtrGeneList="GtrGeneList($event)">
      </PhenotypeExtractor>

      <br>
      Gene list
      <GeneList
        :gtrGenes="gtrGenes">
      </GeneList>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import NewComponents from 'iobio-phenotype-extractor-vue';

export default {
  name: 'App',

  components: {
    HelloWorld,
    ...NewComponents
  },

  data: () => ({
    gtrGenes: [],
  }),

  methods: {
    GtrGeneList(genes){
      console.log("genes returned", genes)
      this.gtrGenes = genes;
    }
  },
};
</script>
