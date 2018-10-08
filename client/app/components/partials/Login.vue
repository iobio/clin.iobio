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

              <v-flex v-if="!newPasswordRequired" xs12>
                <v-text-field v-model="password" label="Enter your password" type="password">
                </v-text-field>
              </v-flex>

              <v-flex xs12 v-if="newPasswordRequired">
                <v-text-field v-model="newPassword" label="Enter your new password" type="password">
                </v-text-field>
              </v-flex>

              <v-flex xs12 v-if="!newPasswordRequired">
                <v-select
                    label="Project"
                    v-bind:items="projects"
                    v-model="project"
                    autocomplete
                    persistent-hint
                ></v-select>
              </v-flex>

              <v-flex v-if="!newPasswordRequired" xs12>
                <v-select
                    label="Your name"
                    v-bind:items="researchers"
                    v-model="researcher"
                    autocomplete
                    persistent-hint
                ></v-select>
              </v-flex>


              <v-flex xs12>
                <v-btn v-if="!newPasswordRequired" :disabled="researcher == null || userName == null  || password == null || project == null? true : false" @click="authenticate">Login</v-btn>
                <v-btn v-if="newPasswordRequired" :disabled="userName == null  || newPassword == null  ? true : false" @click="authenticateNewPassword">Change Password</v-btn>
              </v-flex>

             <v-alert class="success"
              success
              :value="showNewPasswordMessage"
              >
                  Your password has been succesfully changed.  Please launch clin.iobio again to login.
            </v-alert>
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
      ],
      project: null,
      projects: [
        "platinum",
        "A474",
        "A476"
      ],

      newPasswordRequired: false,
      newPassword: null,
      showNewPasswordMessage: false
    };
  },
  methods: {

    authenticate: function() {
      let self = this;
      self.userSession.authenticate(self.userName, self.password,
      function(success) {
        if (success) {
          self.$emit('authenticated', self.researcher, self.project)
        }
      },
      function() {
        self.newPasswordRequired = true;

      })
    },

    authenticateNewPassword: function() {
      let self = this;
      self.userSession.authenticateNewPassword(self.newPassword,
      function(success) {
        if (success) {
          self.showNewPasswordMessage = true;
        }
      });
    }

  }
}
</script>