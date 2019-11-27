<template>
  <v-app>
    <v-content>
      <HelloWorld/>
      <!-- <Main/> -->
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
    //
  }),
};
</script>
