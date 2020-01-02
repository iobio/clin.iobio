/* Copyright 2017-2018, Frameshift Labs, Inc., All rights reserved. */
<template>
  <div
    class="pedigree-graph"
    ref="pedigreeGraph"
    style="margin: auto"
    :style="{ width: width }"
  />
</template>

<script>
import dTree from '../../js/thirdparty/dtree'
import { makeMultiDTreeData } from '../../js/thirdparty/pedigreePreprocess';

export default {
  name: 'PedigreeGraph',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    enableProbandSelect: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 300
    },
    highlighted: {
      type: [String, Number],
      default: null
    },
    linkNodes: {
      type: Boolean,
      default: true
    },
    uuid: {
      validator: (val) => {
        return val === null || typeof val === 'string' || typeof val === 'number'
      },
      required: true
    },
    width: {
      type: Number,
      default: 300
    }
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
      const dTreeData = makeMultiDTreeData(pedigree, +self.uuid);
      // init dTree
      dTree.init(dTreeData, {
        target: pedigraph,
        debug: true,
        height: self.height,
        width: self.width,
        callbacks: {
          nodeHover(name, extra) {
            self.$emit('update:highlighted', extra.uuid);
          },
          nodeLeave(name, extra) {
            self.$emit('update:highlighted', null);
          },
          nodeClick(name, extra) {
            if (self.enableProbandSelect) {
              self.$emit('pedigree-graph--select-pedigree-node', extra);
            }
            if (self.linkNodes) {
              self.$router.push(`/samples/${extra.uuid}`);
            }
          },
        },
      });
      if (this.highlighted !== null) {
        this.applyHighlight();
      }
    },
    applyHighlight() {
      // find the element with the appropriate uuid
      const self = this;
      d3.select(this.$el).selectAll('rect')
        .attr('stroke', function (d) {
          if (!d.extra) {
            return;
          }
          if (+d.extra.uuid === +self.highlighted) {
            return 'black';
          } else if (d.extra.isMainSample) {
            return '#c62828';
          } else {
            return 'gray';
          }
        })
        .attr('fill', function (d) {
          if (!d.extra) {
            return;
          }
          if (+d.extra.uuid === +self.highlighted) {
            return 'black';
          } else if (d.extra.affected) {
            return '#ccc';
          } else {
            return 'white';
          }
        });
      d3.select(this.$el).selectAll('circle')
        .attr('stroke', function (d) {
          if (!d.extra) {
            return;
          }
          if (+d.extra.uuid === +self.highlighted) {
            return 'black';
          } else if (d.extra.isMainSample) {
            return '#c62828';
          } else {
            return 'gray';
          }
        })
        .attr('fill', function (d) {
          if (!d.extra) {
            return;
          }
          if (+d.extra.uuid === +self.highlighted) {
            return 'black';
          } else if (d.extra.affected) {
            return '#ccc';
          } else {
            return 'white';
          }
        });
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    uuid() {
      this.init();
    },
    data() {
      this.init();
    },
    highlighted() {
      this.applyHighlight();
    },
  },
};
</script>

<style>
  .pedigree-graph rect:hover,
  .pedigree-graph circle:hover {
    stroke-width: 4;
  }
</style>
