import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

// export default new Vuetify({
// });

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#45688e',
      },
      dark: {
        primary: '#45688e',
      },
    },
  },
})
