<style lang="sass"  >

@import ../../assets/sass/variables

#findings-panel
  padding: 15px 20px 5px 20px
  overflow-y: auto
  height: -webkit-fill-available
  height: -moz-available
  background-color:  white

  .card-title
    font-size: 18px
    margin-bottom: 20px
    display: inline-block


  .findings-section
    margin-bottom: 0px

    .interpretation-list
      margin-bottom: 10px


  .sub-heading
    font-size: 16px
    font-weight: 500
    color: $text-color

  .case-summary, .clinical-note
    color: $text-color
    line-height: 16px
    font-size: 14px
    padding-top: 5px

  .case-summary
    // width: 80%

  .clinical-note
    display: flex
    justify-content: space-between

    .note, .note-header
      min-width:  60%
      max-width: 60%

    .note
      padding: 10px
      border: thin solid #e4e3e3

    .arrow
      max-width: 50px
      min-width: 50px
      align-self: center
      text-align: center

    .phenotypes, .phenotypes-header
      min-width: 40%
      max-width: 40%


    .phenotypes
      padding: 10px
      border: thin solid #e4e3e3


</style>

<template>

  <div id="findings-panel" >
    <v-row align="center" justify="space-around">
      <v-btn text @click="addNew"> <v-icon>add</v-icon> Content </v-btn>
      <v-btn text @click="addImage"> <v-icon>add</v-icon> Image </v-btn>
      <v-btn text @click="addEmbed"> <v-icon>add</v-icon> Embed </v-btn>
      <v-btn text @click="addCodeBlock">
        <v-icon>add</v-icon> Code block
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="draftMode" text @click="publish">
        <v-icon>save</v-icon> Publish
      </v-btn>
      <v-btn v-if="!draftMode" text @click="setDraftMode">
        <v-icon class="mr-2">create</v-icon> Draft
      </v-btn>
    </v-row>

      <div style="margin-bottom: 20px">
        <span class="sub-heading">Case Summary </span>
        <div class="case-summary">
        {{ caseSummary.description }}
        </div>

      </div>

      <div v-if="clinicalNotes && clinicalNotes.length > 0" style="width:97%;margin-top:40px;margin-bottom:20px">
        <hr style="border-top:transparent">
        <span class="sub-heading">Phenotypes</span>
        <div class="clinical-note" style="margin-bottom:5px">

          <div class="note-header" style="font-weight:500">
            Input
          </div>
          <div class="arrow">
          </div>
          <div class="phenotypes-header" style="font-weight:500">
            Phenotypes terms
          </div>
        </div>
        <div style="margin-bottom:20px" class="clinical-note" v-for="clinicalNote in clinicalNotes" :key="note">

          <div class="note">
            {{ clinicalNote.note }}
          </div>
          <div class="arrow">
            <v-icon>arrow_forward</v-icon>
          </div>
          <div class="phenotypes">
            {{ clinicalNote.phenotypes.join(", ") }}
          </div>
        </div>

      </div>

      <hr style="border-top:transparent">

      <div class="sub-heading" style="margin-top:40px;margin-bottom:0px">Reviewed Variants</div>
      <div v-if="!variantsInterpreted" class="case-summary">
        Variants are not currently reviewed. Please review them in the <a @click="gotoStep(2)"><strong>Review Variants</strong></a> step of the workflow
      </div>

      <div class="findings-section" v-for="interpretation in variantsByInterpretation" :key="interpretation.key" >


        <div v-if="interpretation.organizedVariants && interpretation.organizedVariants.length > 0"
        class="interpretation-list"
        >
        </div>



        <template v-for="geneList in interpretation.organizedVariants">

          <template
           v-for="geneObject in geneList.genes">

            <div v-for="(variant, index) in geneObject.variants" :key="variant.variantInspect.geneObject.gene_name">
              <div>
                <variant-inspect-card
                 :modelInfos="modelInfos"
                 :genomeBuildHelper="genomeBuildHelper"
                 :selectedVariant="variant"
                 :selectedGene="variant.variantInspect.geneObject"
                 :selectedTranscript="variant.variantInspect.transcriptObject"
                 :info="variant.variantInspect.infoObject"
                 :genePhenotypeHits="variant.variantInspect.genePhenotypeHits"
                 :interpretationMap="interpretationMap"
                 :drugsObj="drugsObj"
                >

                </variant-inspect-card>
              </div>
            </div>
          </template>


        </template>


      </div>
      <hr>
      Custom blocks
      <br>
      <div v-for="(block, idx) in content" :key="idx" class="mt-5">
        <div
          @mouseover="hoverDiv(idx)"
          @mouseout="mouseOutDiv"
          v-bind:class="[
            draftMode && mouseOverIdx === idx ? 'blockDivHover' : 'blockDiv',
          ]"
        >
          <div style="padding: 15px; margin: 5px">
            <br />
            <input
              class="titleEditable"
              v-model="block.title"
              placeholder="Heading"
              v-if="draftMode"
              style="padding:10px"
            />
            <div v-if="!draftMode" class="titleEditable">
              {{ block.title }}
            </div>
            <!-- <vue-editor v-model="content[idx].body"></vue-editor> -->
            <!-- vue-editor docs: https://www.npmjs.com/package/vue2-editor -->
            <div v-if="block.codeEditorBlock">
              <div class="editor">
                <editor-content
                  class="editor__content"
                  :editor="block.codeEditor"
                />
              </div>
            </div>

            <div v-if="block.embedBlock">
              <div
                v-show="block.embedContent.length"
                v-html="block.embedContent"
              ></div>
              <div>
                <input
                  type="text"
                  v-model="block.embedContent"
                  placeholder="Paste embed content"
                  v-if="draftMode"
                  class="iframe__input"
                />
              </div>
            </div>

            <div v-if="block.imageContent">
              <div class="my-8">
                <image-uploader
                  :preview="true"
                  :className="[
                    'fileinput',
                    { 'fileinput--loaded': content[idx].hasImage },
                  ]"
                  capture="environment"
                  :debug="1"
                  doNotResize="gif"
                  :autoRotate="true"
                  outputFormat="verbose"
                  @input="setImage($event, idx)"
                  :id="idx.toString()"
                >
                  <label :for="idx" slot="upload-label">
                    <figure v-if="draftMode">
                      <v-icon x-large>insert_photo</v-icon>
                    </figure>
                    <span v-if="draftMode" class="upload-caption">{{
                      content[idx].hasImage ? "Replace" : "Click to upload"
                    }}</span>
                  </label>
                </image-uploader>
              </div>
            </div>
            <div v-if="!block.imageContent">
              <editor-menu-bar
                v-if="draftMode"
                :editor="block.editor"
                v-slot="{ commands, isActive, focused }"
              >
                <div
                  class="menubar is-hidden"
                  :class="{ 'is-focused': focused }"
                >
                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.bold() }"
                    @click="commands.bold"
                  >
                    <v-icon small>format_bold</v-icon>
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.italic() }"
                    @click="commands.italic"
                  >
                    <v-icon small>format_italic</v-icon>
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.strike() }"
                    @click="commands.strike"
                  >
                    <v-icon small>format_strikethrough</v-icon>
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.underline() }"
                    @click="commands.underline"
                  >
                    <v-icon small>format_underline</v-icon>
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.code() }"
                    @click="commands.code"
                  >
                    <v-icon small>code</v-icon>
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                    @click="commands.heading({ level: 1 })"
                  >
                    H1
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                    @click="commands.heading({ level: 2 })"
                  >
                    H2
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                    @click="commands.heading({ level: 3 })"
                  >
                    H3
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.bullet_list() }"
                    @click="commands.bullet_list"
                  >
                    <v-icon small>format_list_bulleted</v-icon>
                  </v-btn>

                  <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.ordered_list() }"
                    @click="commands.ordered_list"
                  >
                    <v-icon small>format_list_numbered</v-icon>
                  </v-btn>

                  <!-- <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.blockquote() }"
                    @click="commands.blockquote"
                  >
                    <v-icon small>format_quote</v-icon>
                  </v-btn> -->

                  <!-- <v-btn
                    text
                    class="menubar__v-btn"
                    :class="{ 'is-active': isActive.code_block() }"
                    @click="commands.code_block"
                  >
                    c b
                  </v-btn> -->
                </div>
              </editor-menu-bar>

              <editor-content
                class="editor__content"
                :editor="block.editor"
              />
            </div>

            <!-- Editor menu bar: -->
            <v-btn
              v-if="draftMode"
              @click="deleteBlock(idx)"
              style="float: right"
              text
              rounded
              small
              color="gray"
              ><v-icon small>delete</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

  </div>
</template>

<script>


import AppIcon       from '../partials/AppIcon.vue';
import VariantInspectCard   from '../viz/findings/VariantInspectCard.vue';
import { bus }      from '../../main'
import { mapGetters, mapActions } from 'vuex'


import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Blockquote,
  BulletList,
  CodeBlock,
  HardBreak,
  Heading,
  ListItem,
  OrderedList,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Focus,
  Placeholder,
  CodeBlockHighlight,
} from "tiptap-extensions";

import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import { VueEditor } from "vue2-editor";

export default {
  name: 'findings',
  components: {
    AppIcon,
    VariantInspectCard,
    VueEditor,
    EditorContent,
    EditorMenuBar,

  },
  props: {
    analysis: null,
    modelInfos:  null,
    genomeBuildHelper: null,
    caseSummary: null,
    variantsByInterpretation: null,
    interpretationMap: null,
  },
  data() {
    return {
      clinicalNotes: null,
      note: null, 
      variantsInterpreted: false, 
      drugsObj: {},
      sources: {
        source: ["imported set", "genelist"],
        sourceIndicator: [1, 2]
      },
      draftMode: true,
      mouseOverIdx: null,
      content: [
        {
          title: "",
          modelContent: "Write something",
          editor: new Editor({
            editable: true,
            onUpdate: ({ getJSON, getHTML }) => {
              console.log("getJSON", getJSON());
            },
            content: `Write something`,
            extensions: [
              new Blockquote(),
              new BulletList(),
              new CodeBlock(),
              new HardBreak(),
              new Heading({ levels: [1, 2, 3] }),
              new ListItem(),
              new OrderedList(),
              new TodoItem(),
              new TodoList(),
              new Link(),
              new Bold(),
              new Code(),
              new Italic(),
              new Strike(),
              new Underline(),
              new History(),
              new Focus({
                className: "has-focus",
              }),
            ],
          }),
          imageContent: false,
          body: `<p>Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.</p><p>Hola</p>`,
        },
      ],
      content_editor: "<h1>Some initial content</h1>",
    }

  },
  methods: {
    ...mapActions(['setVariantsByInterpretation']),

    vepConsequence: function(variant) {
      return variant.consequence;
    },
    hgvsP: function(variant) {
      return this.formatHgvsP(variant, variant.HGVSp);

    },
    formatHgvsP: function(variant, value) {
      let self = this;
      if (value == null || value == '' || Object.keys(value).length == 0) {
        return "";
      } else {
        var buf = "";
        var tokens = value.split(":p.");
        if (buf.length > 0) {
          buf += " ";
        }
        if (tokens.length == 2) {
          var basicNotation = "p." + tokens[1];
          buf += basicNotation;
        } else if (tokens.length == 1 && self.endsWith(tokens[0],"(p.=)")) {
          // If synoymous variants, show p.(=) in cell
          if (variant.consequence == "synonymous_variant") {
                buf += "p.(=)";
          }
        }
        return buf;
      }
    },
    initClinicalNotes: function() {
      let self = this;
      self.clinicalNotes = [];
      if (self.analysis && self.analysis.payload && self.analysis.payload.phenotypes && self.analysis.payload.phenotypes.length > 3) {
        let noteObjects = self.analysis.payload.phenotypes[3];
        noteObjects.forEach(function(noteObject) {
          let clinNote = {};
          clinNote.note = noteObject.note;
          clinNote.phenotypes = [];
          if (noteObject.gtr_terms && noteObject.gtr_terms.length > 0) {
            noteObject.gtr_terms.forEach(function(gtrTerm) {
              if (gtrTerm) {
                let phen = gtrTerm.DiseaseName.toLowerCase();
                if (clinNote.phenotypes.indexOf(phen) == -1){
                  clinNote.phenotypes.push(phen)
                }
              }
            })
          }
          if (noteObject.phenolyzer_terms && noteObject.phenolyzer_terms.length > 0) {
            noteObject.phenolyzer_terms.forEach(function(phenolyzerTerm) {
              if (phenolyzerTerm) {
                let phen = phenolyzerTerm.label.toLowerCase();
                if (clinNote.phenotypes.indexOf(phen) == -1) {
                  clinNote.phenotypes.push(phen)
                }
              }
            })
          }
          if (noteObject.hpo_terms && noteObject.hpo_terms.length > 0) {
            noteObject.hpo_terms.forEach(function(hpoTerm) {
              if (hpoTerm) {
                let phen = hpoTerm.phenotype.toLowerCase();
                if (clinNote.phenotypes.indexOf(phen) == -1) {
                  clinNote.phenotypes.push(phen)
                }
              }
            })
          }
          self.clinicalNotes.push(clinNote);
        })
      }
    }, 
    checkIfVariantsinterpreted: function(){
      for(let variant of this.variantsByInterpretation){
        if(variant.organizedVariants.length){
          this.variantsInterpreted = true; 
          break; 
        }
      }
    }, 
    gotoStep: function(stepIndex){
      bus.$emit('navigate-to-step',stepIndex); 
    },
    hoverDiv(idx) {
      this.mouseOverIdx = idx;
    },
    mouseOutDiv() {
      this.mouseOverIdx = null;
    },
    publish() {
      this.draftMode = false;
      console.log("this.content", this.content);
      bus.$emit("draft-mode", false);
    },
    setDraftMode() {
      this.draftMode = true;
      bus.$emit("draft-mode", true);
    },
    addImage() {
      this.content.push({
        title: "",
        body: "",
        editor: null,
        codeEditor: null,
        imageContent: true,
        hasImage: false,
        image: null,
        modelContent: "",
      });
    },
    setImage: function(output, idx) {
      this.content[idx].hasImage = true;
      this.content[idx].image = output;
    },
    deleteBlock(idx) {
      if (this.content[idx].editor !== null) {
        this.content[idx].editor.destroy();
      } else if (this.content[idx].codeEditor !== null) {
        this.content[idx].codeEditor.destroy();
      }
      this.content.splice(idx, 1);
      this.content = [...this.content];
    },
    addEmbed() {
      this.content.push({
        title: "",
        body: "",
        editor: null,
        codeEditor: null,
        embedBlock: true,
        embedContent: ``,
        modelContent: "",
      });
    },
    addCodeBlock() {
      this.content.push({
        codeEditorBlock: true,
        embedBlock: false,
        editor: null,
        title: "",
        body: "",
        modelContent: "",
        codeEditor: new Editor({
          extensions: [
            new CodeBlockHighlight({
              languages: {
                javascript,
                css,
              },
            }),
            new Bold(),
            new Code(),
          ],
          content: `
            <pre><code></code><pre>
          `,
        }),
      });
    },
    addNew() {
      this.content.push({
        title: "",
        body: "",
        modelContent: "",
        codeEditor: null,
        editor: new Editor({
          content: "Write something",
          editable: true,
          extensions: [
            new Blockquote(),
            new BulletList(),
            new CodeBlock(),
            new HardBreak(),
            new Heading({ levels: [1, 2, 3] }),
            new ListItem(),
            new OrderedList(),
            new TodoItem(),
            new TodoList(),
            new Link(),
            new Bold(),
            new Code(),
            new Italic(),
            new Strike(),
            new Underline(),
            new History(),
            new Focus({
              className: "has-focus",
            }),
            new Placeholder({
              emptyNodeText: (node) => {
                return "Placeholder text";
              },
            }),
          ],
        }),
      });
    },
  },
  computed: {



  },
  mounted() {
  },
  watch: {
    analysis: function() {
      this.initClinicalNotes();
    },
    variantsByInterpretation: function() {
      this.setVariantsByInterpretation(this.variantsByInterpretation); //Updates the global state in vuex store. 
      this.initClinicalNotes();
      this.checkIfVariantsinterpreted(); 
    }, 
  },
}
</script>

<style>
.menubar {
  margin-bottom: 1rem;
  -webkit-transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
}

.menubar.is-hidden {
  /* visibility: hidden; */
  /* opacity: 0; */
  display: none;
}

/* .menubar.is-hidden {
  visibility: visible;
  opacity: 1;
} */

/* .is-hidden {
  visibility: visible;
  opacity: 1;
} */

.is-focused {
  display: block !important;
  opacity: 1;
  visibility: visible;
}

.is-active {
  font-weight: 900 !important;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.ProseMirror {
  padding: 15px !important;
}

#fileInput {
  display: none;
}

.fileinput {
  display: none;
}

.titleEditable {
  font-size: 25px;
  font-weight: 800;
  width: 100%;
}

.blockDiv {
  border: 1px dotted white;
}
.blockDivHover {
  border: 1px dotted #cfcfcf;
  /* border-style: solid; */
}
.iframe__input {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
}

.editor__content pre {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #000;
  color: #fff;
  font-size: 1.2rem;
  overflow-x: auto;
}

.img-preview {
  width: 75% !important;
}
</style>


<style lang="scss">
pre {
  &::before {
    content: attr(data-language);
    text-transform: uppercase;
    display: block;
    text-align: right;
    font-weight: bold;
    font-size: 0.6rem;
  }
  code {
    .hljs-comment,
    .hljs-quote {
      color: #999999;
    }
    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f2777a;
    }
    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #f99157;
    }
    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #99cc99;
    }
    .hljs-title,
    .hljs-section {
      color: #ffcc66;
    }
    .hljs-keyword,
    .hljs-selector-tag {
      color: #6699cc;
    }
    .hljs-emphasis {
      font-style: italic;
    }
    .hljs-strong {
      font-weight: 700;
    }
  }
}
</style>

