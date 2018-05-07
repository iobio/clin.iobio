/*
 * Login.vue
 *
 */
<style lang="sass" scoped >

@import ../../../assets/sass/variables


.layout.row
  padding-left: 20px
  padding-right: 20px

</style>


<template>

    <v-layout row wrap class="mt-5" justify-center>
       <v-flex xs4 >
        <v-toolbar dark  color="cyan darken-2">
          <v-toolbar-title>Login to clin.iobio</v-toolbar-title>
        </v-toolbar>
        <v-card >
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
                <v-btn @click="authenticate" raised primary>Login</v-btn>
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
    };
  },
  methods: {

    authenticate: function() {
      let self = this;
      self.userSession.authenticate(self.userName, self.password,
      function(success) {
        if (success) {
          self.$emit('authenticated')
        }
      })
    }

  }
}
</script>