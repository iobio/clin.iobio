/*
 * LoginDeprecated.vue
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
        <v-toolbar light class="login-toolbar" >
          <v-toolbar-title v-if="!isAuthenticated && !newPasswordRequired" class="white--text" >Login to clin.iobio</v-toolbar-title>
          <v-toolbar-title v-if="!isAuthenticated && newPasswordRequired && !showNewPasswordMessage" class="white--text" >Change your password</v-toolbar-title>
          <v-toolbar-title v-if="!isAuthenticated && newPasswordRequired && showNewPasswordMessage" class="white--text" >Login again</v-toolbar-title>
          <v-toolbar-title v-if="isAuthenticated" class="white--text" >Select a project</v-toolbar-title>
        </v-toolbar>
        <v-card  light >
          <v-layout row wrap>
              <v-flex xs12>
                <v-text-field v-if="!isAuthenticated && !showNewPasswordMessage" v-model="userName" label="Enter your user name" type="text">
                </v-text-field>
              </v-flex>

              <v-flex v-if="!isAuthenticated && !newPasswordRequired && !showNewPasswordMessage" xs12>
                <v-text-field v-model="password" label="Enter your password" type="password">
                </v-text-field>
              </v-flex>

              <v-flex xs12  v-if="!isAuthenticated && newPasswordRequired && !showNewPasswordMessage">
                <v-text-field v-model="newPassword" label="Enter your new password" type="password">
                </v-text-field>
              </v-flex>

              <v-flex xs12 class="new-password-hint" v-if="!isAuthenticated && newPasswordRequired && !showNewPasswordMessage" >
                You are required to set a new password.
              </v-flex>


              <v-flex xs12 v-if="isAuthenticated && !newPasswordRequired">
                <v-switch class="clear-cache-switch"
                  label="Clear saved data"
                  v-model="clearSavedData"
                  >
                </v-switch>
              </v-flex>


              <v-flex xs12 v-if="clearSavedData">
                <v-text-field  v-model="clearSavedDataResearcher" label="Enter your user name" type="text">
                </v-text-field>
              </v-flex>


              <v-flex xs12 v-if="isAuthenticated && !newPasswordRequired">
                <v-select
                    label="Project"
                    v-bind:items="projects"
                    v-model="project"
                    autocomplete
                    persistent-hint
                ></v-select>
              </v-flex>




              <v-flex xs12 v-if="!isAuthenticated">
                <v-btn v-if="!newPasswordRequired" :disabled="userName == null  || password == null ? true : false" @click="authenticate">Login</v-btn>
                <v-btn v-if="newPasswordRequired && !showNewPasswordMessage" :disabled="userName == null  || newPassword == null  ? true : false" @click="authenticateNewPassword">Change Password</v-btn>
              </v-flex>

             <div style="margin-top: 10px;font-size: 16px"
              v-show="!isAuthenticated && showNewPasswordMessage"
              >
                  Your password has been succesfully changed.
                  <br>
                  Please <a  :href="launchUrl">Login</a> with new password.
            </div>

          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
</template>

<script>


import UserSession  from  '../../models/UserSession.js'

export default {
  name: 'login-deprecated',
  components: {
  },
  props: {
    userSession: null
  },
  data() {
    return {
      userName: null,
      password: null,
      project: null,
      projects: [
        "platinum"
      ],

      newPasswordRequired: false,
      newPassword: null,
      showNewPasswordMessage: false,
      launchUrl: false,
      isAuthenticated: false,
      clearSavedData: false,
      clearSavedDataResearcher: null
    };
  },
  mounted() {
    this.launchUrl = window.document.URL;
  },
  watch: {
    project: function() {
      let self = this;
      if (self.isAuthenticated && self.project && self.project.length > 0) {
        if (self.clearSavedData) {
           self.$emit('authenticated', self.clearSavedDataResearcher, self.project, self.clearSavedData)
        } else {
           self.$emit('authenticated', self.userName, self.project, self.clearSavedData)
        }
      }
    }
  },
  methods: {



    authenticate: function() {
      let self = this;
      self.userSession.authenticate(self.userName, self.password,
      function(success) {
        if (success) {
          self.isAuthenticated = true;
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