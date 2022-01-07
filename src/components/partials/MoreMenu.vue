<style lang="sass" scoped>

@import ../../assets/sass/variables

.i_headline
  font-size: 20px !important
  font-weight: 400 !important

  
</style>

<template>

  <span>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          :color="more_menu_icon_color"
          dark
          :icon="showIconButton"
          :text="showTextButton"
          v-on="on"
        >
          <v-icon medium>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="onShowTermsOfService">
          <v-list-item-title>Terms of Service</v-list-item-title>
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
        
      </v-list>
    </v-menu>
    
    
    <NavBarDialog
      v-if="showDisclaimer"
      :headline="disclaimer.headline"
      :content="disclaimer.content"
      id="DisclaimerDialog">
    </NavBarDialog>
    
    <NavBarDialog
      v-if="showTermsOfService"
      :headline="terms.headline"
      :content="terms.content"
      id="TermsDialog">
    </NavBarDialog>
  
  </span>

</template>

<script>
import NavBarDialog from './NavBarDialog.vue'
import { bus }      from  '../../main'

export default {
  name: 'MoreMenu',
  components: {
    NavBarDialog
  },
  props: {
    landingPage: {
      type: String
    }
  },
  data () {
    return {
      showDisclaimer: false,
      showTermsOfService: false,
      disclaimer: {
        headline: "Disclaimer", 
        content: `The University of Utah makes no claims that iobio applications,
         including clin.iobio are approved for clinical use. All users of iobio applications including clin.iobio understand and accept that any information gained by using these applications, whether the information comes from visualization, processing, internal or external databases, or analysis, may not in any way be used for clinical purposes. The University of Utah makes no representation that iobio or                 clin.iobio is either safe or effective for any intended use for which research may currently be performed.
        <br><br>
        iobio, or any iobio applications ARE TO BE USED FOR RESEARCH PURPOSES ONLY. USE FOR CLINICAL PURPOSES IS EXPRESSLY FORBIDDEN. Approval of iobio applications for clinical use has neither been applied for, nor received, in any country, including the United States of America.
        `
      }, 
      terms: {
        headline: "Terms of service", 
        content: `<strong>Academic Use </strong>
          <br> clin.iobio is free for academic use.
          <br><br>
          <strong>Commercial Use </strong>
          <br>
          Commercial use of clin.iobio is licensed through Frameshift Genomics. Please contact Frameshift at  <a href="mailto:admin@frameshift.io" target="_top">admin@frameshift.io</a> to discuss any commercial use of this tool.
          `
      }, 
      more_menu_icon_color: "rgb(69, 69, 69)", 
      showIconButton: true, 
      showTextButton: false
    }
  }, 
  methods: {
    onShowTermsOfService: function(){
      this.showTermsOfService = true;
    },
    onShowDisclaimer: function() {
      this.showDisclaimer = true;
    },
    onShowBlog: function() {
      window.open("http://iobio.io/blog.html", "_iobio");
    },
    onShowIOBIO: function() {
      window.open("http://iobio.io", "_iobio");
    },
    
  },
  mounted(){
    bus.$on("close_dialog", ()=>{
      this.showTermsOfService = false; 
      this.showDisclaimer = false; 
    })
    this.landingPage=="true" ? this.more_menu_icon_color = "rgb(69, 69, 69)" : this.more_menu_icon_color = "white"
    if(this.landingPage=="true"){
      this.more_menu_icon_color = "rgb(69, 69, 69)"; 
      this.showIconButton = true; 
      this.showTextButton = false; 
    }
    else {
      this.more_menu_icon_color = "white";
      this.showIconButton = false; 
      this.showTextButton = true; 
    }
  }, 
  watch: {
    landingPage(){
      if(this.landingPage=="true"){
        this.more_menu_icon_color = "rgb(69, 69, 69)";
        this.showIconButton = true; 
        this.showTextButton = false; 
      }
      else {
        this.more_menu_icon_color = "white";
        this.showIconButton = false; 
        this.showTextButton = true; 
      }    
    }
  }
}
</script>
