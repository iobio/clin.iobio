<template>
  <g-signin-button
    :params="googleSignInParams"
    @success="onSignInSuccess"
    @error="onSignInError">
    Sign in with Google
  </g-signin-button>
</template>

<script>

import GSignInButton from 'vue-google-signin-button'

export default {
  name: 'login-mosaic',
  components: {
    GSignInButton
  },
  props: {
    userSession: null
  },
  data () {
    return {
      /**
       * The Auth2 parameters, as seen on
       * https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams.
       * As the very least, a valid client_id must present.
       * @type {Object}
       */
      googleSignInParams: {
        client_id: '441987904815-39hjghloslpfr3tgkkpavb8khdvj6jou.apps.googleusercontent.com'
      }

    }
  },
  methods: {
    onSignInSuccess (googleUser) {
      let self = this;

      const profile = googleUser.getBasicProfile();

     self.userSession.authenticateGoogle(googleUser,
      function(success) {
        if (success) {
          self.$emit('authenticated', profile.ig, "platinum");
        }
      })
    },
    onSignInError (error) {
      // `error` contains any error occurred.
      console.log('Google sign in error', error)
    }
  }
}
</script>

<style>
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
}
</style>