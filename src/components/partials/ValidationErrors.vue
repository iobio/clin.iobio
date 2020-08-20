<template>
  <span>
    <div v-for="(error, idx) in errors" >
      <v-alert
        border="left"
        colored-border
        type="error"
        icon="error_outline"
        dense
        elevation="1"
        style="font-size:12px"
        @input=remove(idx)
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
      alert: true,
      errors: []
    }
  },
  mounted(){
    this.errors = [...this.validationErrors]
  },
  updated(){
  },
  watch: {
    validationErrors(){
      this.errors = [...this.validationErrors]
      // this.alert = true;
    }
  },
  methods: {
    remove(i){
      this.errors.splice(i,1);
      this.errors = [...this.errors];
    }
  }
}
</script>

  <style lang="sass" scoped>

  @import ../../assets/sass/variables



  </style>
