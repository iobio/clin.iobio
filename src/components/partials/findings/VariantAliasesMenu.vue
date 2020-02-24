<template>
  <span>
    <v-menu
    offset-y
    bottom
    v-model="showMenu"
    >

      <template v-slot:activator="{ on }">
        <v-btn id="show-hgvs-button"
         text
         v-on="on"
         v-tooltip.top-center="`HGVSc and HGVSp for variant`"
        >
          <v-icon>label</v-icon>
          {{ label }}
        </v-btn>
      </template>

      <v-card>
        <div class="variant-info" style="padding: 20px;" >
          <div class="card-label">
               HGVSc: {{ info.HGVSc }}
          </div>
          <div class="card-label">
               HGVSp: {{ info.HGVSp }}
          </div>
        </div>
      </v-card>

    </v-menu>

  </span>
</template>

<script>



export default {
  name: 'variant-aliases-menu',
  components: {
  },
  props: {
    label: null,
    geneModel: null,
    selectedGene: null,
    selectedVariant: null,
    info: null
  },
  data () {
    return {
      showMenu: null
    }
  },
  watch: {
  },
  methods: {
  },
  created: function() {
  },
  mounted: function() {
  },
  updated: function() {
  },
  computed: {

  },
  watch: {
  }
}
</script>


<style lang="sass">

@import ../../../assets/sass/variables


#show-hgvs-button
  margin: 0px 0px 0px 0px
  padding: 0px
  min-width: 25px
  max-height: 25px
  padding-right: 5px
  padding-left: 8px
  margin-right: 20px
  padding-bottom: 2px
  margin-left: 2px

  .btn__content, .v-btn__content
    color:  $text-color
    padding-left: 0px
    padding-right: 0px
    color: $link-color
    font-size: 13px
    font-weight: 500

    i.material-icons
      font-size: 20px
      color: $link-color
      vertical-align: top
      padding-right: 3px


</style>