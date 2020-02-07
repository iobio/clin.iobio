<template>

    <div :style="`height: ${height}px`">
        <svg>
            <g class="g-main">
                <g class="axis axis__x"/>
                <g class="axis axis__y"/>

            </g>
            <text class="axis-label axis-label--x"/>
            <text class="axis-label axis-label--y"/>
        </svg>
    </div>

</template>


<script>
    import * as d3 from 'd3';
    import formatNumber from './../../utils/formatNumber.js';

    export default {
        name: 'BoxPlot',
        props: {
            width: null,
            height: null,
            data: null,
            coverageMedian: null
        },

        data() {
            return {
                xScale: null,
                yScale: null,
                yDomain: [0,1],
                labelHeight: 10,
                margin: {
                    top: 10, right: 20, bottom: 15, left: 25,
                },

            };
        },


        mounted(){
            this.drawChart();
        },

        computed: {
            xDomain() {
                return [this.data.min, this.data.max]
            },

            xRange() {
                return [this.margin.left + this.labelHeight, this.width - this.margin.right];
            },

            yRange() {
                return [this.height - this.margin.bottom - this.labelHeight, this.margin.top];
            },
            gMain() {
                return d3.select(this.$el).select('.g-main');
            },

        },

        methods: {
            drawChart() {
                this.setSvgSize();
                this.createAxis();
                this.drawBoxPlot();

            },
            setSvgSize() {
                d3.select(this.$el)
                    .select('svg')
                    .attr('width', this.width)
                    .attr('height', this.height);
            },
            createAxis(){

                this.xScale = d3.scaleLinear()
                    .domain(this.xDomain)
                    .range(this.xRange);
                this.yScale = d3.scaleLinear()
                    .domain(this.yDomain).nice()
                    .range(this.yRange);
                const xAxis = d3.axisBottom()
                    .scale(this.xScale)
                    .ticks(5)

                this.gMain.select('.axis__x')
                    .attr('transform', `translate(0,${this.height - this.margin.bottom - this.labelHeight})`)
                        .call(xAxis);

            },

            drawBoxPlot(){

                console.log("this.data", this.data);

                this.gMain.append("rect")
                    .attr("x", this.xScale(this.data.q1))
                    .attr("y", this.yScale(0.9))
                    .attr("width", this.xScale(this.data.q2) - this.xScale(this.data.q1))
                    .attr("height", this.yScale(0.3))
                    .attr("fill", "#c62828")
                    .attr("stroke", "black");

                this.gMain.append("rect")
                    .attr("x", this.xScale(this.data.q2))
                    .attr("y", this.yScale(0.9))
                    .attr("width", this.xScale(this.data.q3)-this.xScale(this.data.q2))
                    .attr("height", this.yScale(0.3))
                    .attr("fill", "#c62828")
                    .attr("stroke", "black");

                this.gMain.append("line")
                    .attr("x1", this.xScale(this.data.min))
                    .attr("y1", this.yScale(0.5))
                    .attr("x2", this.xScale(this.data.q1))
                    .attr("y2", this.yScale(0.5))
                    .attr("stroke", "black");

                this.gMain.append("line")
                    .attr("x1", this.xScale(this.data.q3))
                    .attr("y1", this.yScale(0.5))
                    .attr("x2", this.xScale(this.data.max))
                    .attr("y2", this.yScale(0.5))
                    .attr("stroke", "black");

            },
        },

        watch: {

        }
    }
</script>

<style scoped>

    .axis >>> text {
        font-size: 9px;
        fill: black
    }
</style>
