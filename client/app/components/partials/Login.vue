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



</style>


<template>

    <v-layout class="login-dialog mt-5" row wrap justify-center>
       <v-flex xs4 >
        <v-toolbar light class="login-toolbar" >
          <v-toolbar-title class="white--text" >Login to clin.iobio</v-toolbar-title>
        </v-toolbar>
        <v-card  light >
          <v-layout row wrap>
              <v-flex xs12>
                <v-text-field v-model="userName" label="Enter your user name" type="text">
                </v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-text-field v-model="password" label="Enter your password" type="password">
                </v-text-field>
              </v-flex>

              <v-flex xs12>
                <v-select
                    label="Your name"
                    v-bind:items="researchers"
                    v-model="researcher"
                    autocomplete
                    persistent-hint
                ></v-select>
              </v-flex>


              <v-flex xs12>
                <v-btn  @click="authenticate">Login</v-btn>
              </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
</template>

<script>


import UserSession  from  '../../models/UserSession.js'

export default {
  name: 'login',
  components: {
  },
  props: {
    userSession: null
  },
  data() {
    return {
      userName: null,
      password: null,
      researcher: null,
      researchers: [
        "adit",
        "al",
        "anders",
        "attila",
        "gabor",
        "josh",
        "matt",
        "marti",
        "rong",
        "pinar",
        "steve",
        "steph",
        "tony"
      ]
    };
  },
  methods: {

    authenticate: function() {
      let self = this;
      self.userSession.authenticate(self.userName, self.password,
      function(success) {
        if (success) {
          self.$emit('authenticated', self.researcher)
        }
      })
    }

  }
}
</script>