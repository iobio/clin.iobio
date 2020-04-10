<style lang="sass" scoped>

@import ../../assets/sass/variables



</style>
<template>
  <span>
    <v-dialog v-model="showDialog" max-width="450">
      <v-card class="full-width">
        <v-card-title class="i_headline"> {{ headline }}</v-card-title>
        <v-card-text>
          <div v-html="content"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn raised color="white"  @click.native="showDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
  </span>
</template>

<script>
import { bus } from '../../main'

export default {
  name: 'NavBarDialog',
  components: {
  },
  props: {
    dialog: {
      type: Boolean
    },
    content: {
      type: String
    }, 
    headline: {
      type: String
    }, 
  },
  watch: {
    showDialog(){
      if(!this.showDialog){
        bus.$emit("close_dialog")
      }
    }
  },
  data () {
    return {
      showDialog: true, 
    }
  }, 
  mounted(){
    
  }
}
</script>
