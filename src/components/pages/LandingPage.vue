<template>
  <div>
    <v-app-bar
      color="white"
      light
      dense
    >

      <v-toolbar-title>clin.iobio</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

    </v-app-bar>
    
    <v-content>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <!-- <v-card> -->
            <v-responsive class="overview-jumbotron" :gradient="gradient">
              <v-container fill-height>
                <v-layout row wrap>
                  <v-flex xs12 md12 sm12 lg1 xl1 ></v-flex>
                  <v-flex xs12 md12 sm12 lg5 xl5>
                    <v-flex text-xs-center>
                    </v-flex>
                  </v-flex>
                    <v-flex xs12 md12 sm12 lg5 xl5>
                      <v-flex text-xs-center>
                          <img style="margin-top:72px; right: 0; width:610px;" src="./clinical_art.svg" alt="Clinical art">
                      </v-flex>
                    </v-flex>
                    <v-flex xs12 md12 sm12 lg1 xl1 ></v-flex>
                  <v-flex xs12>
                    <v-btn color="primary" @click="getStarted">getStarted</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>

            </v-responsive>
          <!-- </v-card> -->
        </v-flex>
      </v-layout>
    </v-content>

  </div>
</template>

<script>

import phenotypeIcon from '../partials/icons/phenotype-icon.vue'
import caseIcon      from '../partials/icons/case-icon.vue'
import findingsIcon  from '../partials/icons/findings-icon.vue'
import variantsIcon  from '../partials/icons/variants-icon.vue'
import { bus }       from '../../main'

export default {
  name: 'landing-page',
  components: {
  },
  props: {
  },
  data () {
    let self = this;
    return {
      gradient: 'to top,  #0D47A1,#42A5F5',
    }
  },
  methods:  {
    getStarted(){
      console.log("initialize-clin")
      bus.$emit("initialize-clin")
    }
  },
  mounted: function() {

  },
  watch: {

  }
}
</script>


<style lang="sass">

@import ../../assets/sass/variables

.overview-jumbotron
  height: 570px !important
  background: radial-gradient(#30638E, #2D4B64)
</style>

