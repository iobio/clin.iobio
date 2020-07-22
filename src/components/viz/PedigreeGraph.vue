/* Copyright 2017-2018, Frameshift Labs, Inc., All rights reserved. */
<template>
  <div
    class="pedigree-graph"
    id="pedGraph"
    ref="pedigreeGraph"
    :style="{width: width +'px' }"

  />
</template>

<script>
import dTree from '../../utils/dtree.js';
import { makeMultiDTreeData } from '../../utils/pedigreePreprocess.js';
const pedigreeColors = {affected: "#ccc", selected: "rgb(53, 134, 192)"};

export default {
  name: 'PedigreeGraph',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    enableProbandSelect: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 300,
    },
    highlighted: {
      type: [String, Number],
      default: null,
    },
    linkNodes: {
      type: Boolean,
      default: true,
    },
    path: {
      type: String,
      default: '',
    },
    strokeWidth: {
      type: Number,
      default: 2,
    },
    // eslint-disable-next-line
    id: {
      validator: (val) => val === null || typeof val === 'string' || typeof val === 'number',
      required: true,
    },
    width: {
      type: Number,
      default: 300,
    },

    pedigree: null

  },
  watch: {
    id() {
      this.init();
    },
    data() {
      this.init();
    },

    width() {
      this.init();
    },
    highlighted() {
      this.applyHighlight();
    },
  },
  mounted() {
    this.init();
    // this.highlightProband();
      },
  methods: {


    init() {
      const self = this;
      const pedigraph = self.$refs.pedigreeGraph;
      const pedigree = this.data;
      // delete dTree if it exists
      if (pedigraph && pedigraph.childNodes.length > 0) {
        pedigraph.removeChild(pedigraph.childNodes[0]);
      }
      // exit if this sample has no pedigree
      if (!pedigree || pedigree.length === 0) {
        return;
      }
      const dTreeData = makeMultiDTreeData(pedigree, Number(self.id));
      // init dTree
      dTree.init(dTreeData, {
        target: pedigraph,
        debug: true,
        height: self.height,
        width: self.width,
        strokeWidth: this.strokeWidth,
      });
      if (this.highlighted !== null) {
        this.applyHighlight();
      }
    },
    applyHighlight() {
      // find the element with the appropriate id
      const self = this;
      d3.select(this.$el).selectAll('rect')
              .attr('fill', (d) => {
                if (!d.data.extra) {
                  return 'white';
                }
                if (Number(d.data.extra.id) === (self.highlighted)) {
                  return pedigreeColors.highlighted;
                }
                if (d.data.extra.affected) {
                  return pedigreeColors.affected;
                }
                return 'white';
              });
      d3.select(this.$el).selectAll('circle')
              .attr('fill', (d) => {
                if (!d.data.extra) {
                  return 'white';
                }
                if (Number(d.data.extra.id) === Number(self.highlighted)) {
                  return pedigreeColors.highlighted;
                }
                if (d.data.extra.affected) {
                  return pedigreeColors.affected;
                }
                return 'white';
              });
    },
  },
};
</script>
