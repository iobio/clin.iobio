<style lang="sass" scoped>

@import ../../assets/sass/variables

.i_headline
  font-size: 22px !important
  font-weight: 400 !important


</style>
<template>

  <span>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          color="rgb(69, 69, 69)"
          dark
          icon
          v-on="on"
        >
          <v-icon medium>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="">
          <v-list-item-title>Terms</v-list-item-title>
        </v-list-item>
        <v-list-item @click="onShowDisclaimer">
          <v-list-item-title>Disclaimer</v-list-item-title>
        </v-list-item>
        
        <v-divider></v-divider>
        
        <v-list-item @click="onShowBlog">
          <v-list-item-title>Blog</v-list-item-title>
        </v-list-item>
        <v-list-item @click="onShowIOBIO">
          <v-list-item-title>iobio</v-list-item-title>
        </v-list-item>
        <v-list-item @click="onSupportIOBIO">
          <v-list-item-title>Support the iobio project</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    
    
    <v-dialog v-model="showDisclaimer" max-width="450">
      <v-card class="full-width">
        <v-card-title class="i_headline">Disclaimer</v-card-title>
        <v-card-text>

                The University of Utah makes no claims that iobio applications, including clin.iobio are approved for clinical use. All users of iobio applications including clin.iobio understand and accept that any information gained by using these applications, whether the information comes from visualization, processing, internal or external databases, or analysis, may not in any way be used for clinical purposes. The University of Utah makes no representation that iobio or clin.iobio is either safe or effective for any intended use for which research may currently be performed.
                <br><br>
                iobio, or any iobio applications ARE TO BE USED FOR RESEARCH PURPOSES ONLY. USE FOR CLINICAL PURPOSES IS EXPRESSLY FORBIDDEN. Approval of iobio applications for clinical use has neither been applied for, nor received, in any country, including the United States of America.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn raised color="white"  @click.native="showDisclaimer = false">Close</v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
  </span>

</template>

<script>

export default {
  name: 'MoreMenu',
  components: {
  },
  props: {
    showIt: {
      type: Boolean
    },
    text: {
      type: String
    }
  },
  data () {
    return {
      showDisclaimer: false,
    }
  }, 
  methods: {
    onShowDisclaimer: function() {
      this.showDisclaimer = true;
    },
    onShowBlog: function() {
      window.open("http://iobio.io/blog.html", "_iobio");
    },
    onShowIOBIO: function() {
      window.open("http://iobio.io", "_iobio");
    },
    onSupportIOBIO: function() {
      window.open("http://iobio.io/support.html", "_iobio");
    },
  }
}
</script>
