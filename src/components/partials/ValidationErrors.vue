<template>
  <span>
    <div v-for="(error, idx) in validationErrors" >
      <v-alert
        border="left"
        colored-border
        type="error"
        icon="error_outline"
        dense dismissible
        elevation="1"
        style="font-size:12px"
      >
        {{ error }}
      </v-alert>
    </div>
  </span>
</template>

<script>


export default {
  name: 'validation-errors',
  components: {
    
  },
  props: {
    validationErrors: null,
  },
  data () {
    return {
    }
  }
}
</script>

  <style lang="sass" scoped>

  @import ../../assets/sass/variables



  </style>
