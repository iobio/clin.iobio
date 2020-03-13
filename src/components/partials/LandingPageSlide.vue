<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 sm12 md6 lg6 xl6>
          <img class="i-hooper_img hidden-sm-and-down" :src="img_src">
        </v-flex>
        <v-flex xs12 sm12 md1 lg1 xl1></v-flex>
        <v-flex xs12 sm12 md5 lg4 xl4 class="i-hooper_text_margin_top">
          <span class="step-heading-icon">
            <slot></slot>
          </span>
          <span class="i-hooper_text">{{ title }}</span>
          <br><br><br>
          <span class="i-hooper_subheading">
            {{ description }}
          </span>
        </v-flex>
        <v-flex xs12 sm12 md12 lg1 xl1></v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'landing-page-slide',
  components: {
    
  },
  props: {
    title: {
      type: String
    }, 
    img_src: {
      type: String
    }, 
    description: {
      type: String
    }, 
    icon: null 
  },
  data () {
    return {
    }
  }, 
  mounted(){
  }
}
</script>


<style lang="sass" scoped>

@import ../../assets/sass/variables



</style>