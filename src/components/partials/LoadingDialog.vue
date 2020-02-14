<style lang="sass" scoped>

@import ../../assets/sass/variables



</style>
<template>
  <span>
    <v-dialog
      v-model="showIt"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          <p class="pt-2">{{ text }}</p>
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>

export default {
  name: 'LoadingDialog',
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
    }
  }
}
</script>
