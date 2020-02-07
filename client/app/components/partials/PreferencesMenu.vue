<style lang="sass"  >

@import ../../../assets/sass/variables

#prefs-menu-button
  min-width: 20px
  margin: 0px

</style>

<template>
    <v-menu offset-y>
      <v-btn  flat id="prefs-menu-button" slot="activator">
        <v-icon>more_vert</v-icon>
      </v-btn>
      <v-list>


        <v-list-tile v-if="!isMinimized" @click="switchMinimized(true)">
          <v-list-tile-title>
            <v-icon v-if="!isSidebar">expand_less</v-icon>
            <v-icon v-if="isSidebar">chevron_left</v-icon>
            Show less
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="isMinimized" @click="switchMinimized(false)">
          <v-list-tile-title>
            <v-icon  v-if="!isSidebar">expand_more</v-icon>
            <v-icon  v-if="isSidebar">chevron_right</v-icon>
            Show more
          </v-list-tile-title>
        </v-list-tile>


        <v-list-tile v-if="!isSidebar" @click="switchSidebar(true)">
          <v-list-tile-title>
            <v-icon>vertical_split</v-icon>
            Show dashboard on left
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="isSidebar" @click="switchSidebar(false)">
          <v-list-tile-title>
            <v-icon>horizontal_split</v-icon>
            Show dashboard on top
          </v-list-tile-title>
        </v-list-tile>


        <v-list-tile v-if="theme == 'light'" @click="switchTheme('dark')">
          <v-list-tile-title>
            <v-icon >turned_in</v-icon>
            Dark theme
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="theme == 'dark'" @click="switchTheme('light')">
          <v-list-tile-title>
            <v-icon >turned_in_not</v-icon>
            Light theme
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
</template>

<script>
 export default {
  name: 'preferences',
  components: {
  },
  props: {
    isSidebar:   null,
    isMinimized: null,
    theme:       null
  },
  data() {
    let self = this;
    return {
    }
  },
  methods: {
    switchSidebar: function(isSidebar) {
      this.$emit("switch-sidebar", isSidebar)
    },
    switchMinimized: function(isMinimized) {
      this.$emit("switch-minimized", isMinimized)
    },
    switchTheme: function(theme) {
      this.$emit("switch-theme", theme)
    }
  }
}
</script>
