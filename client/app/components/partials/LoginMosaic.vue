/*
 * Login.vue
 *
 */
<style lang="sass"  >

@import ../../../assets/sass/variables

.login-dialog
  .row
    padding-left: 20px
    padding-right: 20px

.login-toolbar
  .toolbar__content
    background-color: $login-nav-color !important
.new-password-hint
  font-size: 15px
  padding: 10px
  font-style: italic
  color: $app-color


</style>


<template>

    <v-layout class="login-dialog mt-5" row wrap justify-center>
       <v-flex xs4 >

        <v-card  light >
          <v-layout row wrap>


              <v-flex xs12>
                <v-text-field v-model="researcher" label="Enter clin.iobio user name" type="text">
                </v-text-field>
              </v-flex>

              <v-flex v-if="!isAuthenticated " xs12>
                <v-text-field v-model="password" label="Enter clin.iobio password" type="password">
                </v-text-field>
              </v-flex>


              <v-flex xs12 v-if="!isAuthenticated">
                <v-btn  :disabled="researcher == null || password == null ? true : false" @click="authenticate">Launch clin.iobio</v-btn>
              </v-flex>

          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
</template>

<script>


import AWSSession  from  '../../models/AWSSession.js'

export default {
  name: 'login-mosaic',
  components: {
  },
  props: {
    awsSession: null
  },
  data() {
    return {
      researcher: null,
      password:  null,
      isAuthenticated: false,
      clearSavedData: false
    };
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    authenticate: function() {
      let self = this;
      self.awsSession.authenticateMosaic(self.researcher, self.password,
        function(success) {
          if (success) {
            self.$emit('authenticated-mosaic', self.researcher);
            self.isAuthenticated = true;
          }
        },
        function() {
        })
    }

  }
}
</script>