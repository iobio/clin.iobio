<style lang="sass">
@import ../../../assets/sass/variables

.box-and-whisker-viz
  .box
    font: 10px


  .box line,
  .box rect,
  .box circle
    fill: steelblue
    stroke: #000
    stroke-width: 1px


  .box
    .center
      stroke-dasharray: 3,3


    .outlier
      fill: none;
      stroke: #000


  .axis
    font-size: 12px

  .axis.x
    .tick
      text
        font-size: 14px

  .axis path,
  .axis line
    fill: none
    stroke: #000
    shape-rendering: crispEdges


  .x.axis path
    fill: none
    stroke: #000
    shape-rendering: crispEdges

  text.box
    font-size: 12px

  text.whisker
    font-size: 12px


</style>


<template>
    <div class="box-and-whisker-viz">

    </div>
</template>

<script>

import boxAndWhiskerBox from '../../d3/boxAndWhiskerBox.js'
import boxAndWhiskerD3 from '../../d3/boxAndWhiskerD3.js'

export default {
    name: 'box-and-whisker-viz',
    props: {
      data: {},
      margin:{
        type: Object,
        default: function() {
          return {top: 30, right: 50, bottom: 70, left: 50}
        }
      },
      width: {
        type: Number,
        default: 400
      },
    },
    data() {
      return {
        boxAndWhiskerChart: {}
      }
    },
    created: function() {
    },
    mounted: function() {
      this.draw();
    },
    methods: {
      draw: function() {
        var self = this;

        this.boxAndWhiskerChart =  boxAndWhiskerD3()
          .width(this.width)
          .margin(this.margin)

        this.setBoxAndWhiskerChart();
        this.update();
      },
      update: function() {
        let self = this;
        if (self.data) {
          self.boxAndWhiskerChart.width(self.width);
          var selection = d3.select(self.$el).datum( self.data );
          self.boxAndWhiskerChart(selection);
        }
      },
      setBoxAndWhiskerChart: function() {
        this.$emit('update-box-and-whisker-chart', this.boxAndWhiskerChart);
      }
    },
    watch: {
      data: function() {
        this.update();
      }

    }
}
</script>