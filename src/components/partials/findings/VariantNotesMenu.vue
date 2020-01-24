<template>


  <v-menu
    offset-y
    :close-on-content-click="false"
    v-model="showMenu"
    :min-width="420"
    :max-width="420"
    bottom>
    <template v-slot:activator="{ on }">
      <v-btn 
      :class="{'findings-show-notes-button': true, 'v-btn--disabled': variant.notes == null || variant.notes.length == 0}" text v-on="on">
        <v-icon style="padding-right:2px">notes</v-icon>
        Notes
        <v-icon style="padding-left:10px">expand_more</v-icon>
      </v-btn>
    </template>

    <div class="individual-notes-container">
      <div class="individual-note" v-for="(note, noteIndex) in notesReverseOrder">

        <div class="note-header">


          <div v-if="note.datetime" class="note-datetime">
            {{ note.datetime }}
          </div>


          <div v-if="note.author" class="note-author">
            {{ note.author }}
          </div>


        </div>
        <div class="note-body">
          {{ note.note }}
        </div>

        <hr/>

      </div>
    </div>






  </v-menu>
</template>

<script>


export default {
  name: 'variant-notes-menu',
  components: {
  },
  props: {
    variant: null
  },
  data () {
    return {
      notes: null,
      notesReverseOrder: null,
      showMenu: false
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    sortNotes: function() {
      let self = this;
      if (this.notes) {
        this.notesReverseOrder =  this.notes.sort(function(noteA, noteB) {
          return noteA.datetime.localeCompare(noteB.datetime);
        }).reverse();
      } else {
        this.notesReverseOrder = [];
      }

    },
    init: function() {
      let self = this;
      if (self.variant) {
        self.$set(self, "notesReverseOrder",  []);
        self.notes = self.variant.notes;

        self.$nextTick(function() {
          self.sortNotes();
        })

      } else {
        self.notes = [];
        self.notesReverseOrder = [];
      }
    }
  },
  created: function() {
  },
  mounted: function() {
    this.init();
  },
  updated: function() {
  },
  watch: {
    variantNotes: function() {
      this.init();
    },
    variant: function() {
      this.init();
    }
  }
}
</script>

<style lang="sass">
@import ../../../assets/sass/variables


.individual-notes-container
  display: flex
  flex-flow: column
  justify-content: flex-start
  margin-top: 10px
  padding-left: 20px
  padding-right: 20px
  background-color: white

  .individual-note
    padding-left: 0px
    padding-bottom: 0px
    font-size: 12px
    overflow-y: scroll
    margin-top: 10px
    min-width: 100%
    max-width: 100%

    .note-header
      display: flex
      justify-content: flex-start
      font-style: italic
      font-size: 13px

      .note-author
        margin-right:  20px
        padding-top: 6px
        line-height: 13px

      .note-datetime
        margin-right:  20px
        padding-top: 6px
        line-height: 13px

      .button-actions
        min-width: 30px
        margin: 2px
        padding: 0px
        height: 22px
        margin-left: -5px

        .btn__content, .v-btn__content
          padding: 0px

          i.material-icons
            font-size: 17px



    .note-body
      padding-top: 10px

.findings-show-notes-button
  margin-top: 5px
  .v-btn__content
    color: $app-header-color

  &.v-btn--disabled
    .v-btn__content
      color: #bdbebd


</style>


