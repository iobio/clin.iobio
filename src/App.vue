<template>
  <v-app>
    <v-content>
      <HelloWorld/>
      <!-- <Main/> -->
      <!-- <PhenotypeExtractor/>
      <GeneList/> -->
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({

  }),

  methods: {

  },
};
</script>
