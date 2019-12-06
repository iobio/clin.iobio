<template>
  <v-app>
    <v-content>
      <ClinHome/>
    </v-content>
  </v-app>
</template>

<script>
import ClinHome from './components/pages/ClinHome.vue';

export default {
  name: 'App',

  components: {
    ClinHome,
  },

  data: () => ({

  }),

  methods: {

  },
};
</script>
