/* Copyright 2017-2019, Frameshift Labs, Inc., All rights reserved. */
<template>
    <div :style="`height: ${height}px`">
        <v-layout
                v-if="!showChart"
                id="no-data-alert"
                key="no-data"
                fill-height
                justify-center
                align-center
        >
            <v-icon>warning</v-icon> No Data
        </v-layout>
        <div v-else>
            <svg>
                <g
                        :transform="`translate(${margin.left},${margin.top})`"
                        class="g-main"
                >
                    <g class="axis axis__y" />
                </g>
            </svg>
        </div>
    </div>
</template>

<script>

    import * as d3 from 'd3'

    const xColumn = 'type';
    const yColumn = 'count';
    export default {
        name: 'QualitativeBarChart',
        props: {
            data: {
                type: Object,
                default() {
                    return {};
                },
            },
            height: {
                type: Number,
                default: 250,
            },
            width: {
                type: Number,
                default: undefined,
            },
            margin: {
                type: Object,
                default() {
                    return {
                        top: 30, right: 30, bottom: 10, left: 30,
                    };
                },
            },
            colorScale: {
                type: Function,
                default: d3.scaleOrdinal().range(['#0080A8', '#2EB0CE', '#37D4EF', '#97E9F2']),
            },
        },
        data() {
            return {
                barPadding: 0.2,
            };
        },
        computed: {
            gMain() {
                return d3.select(this.$el).select('.g-main');
            },
            innerHeight() {
                return this.height - this.margin.top - this.margin.bottom;
            },
            innerWidth() {
                return this.outerWidth - this.margin.left - this.margin.right;
            },
            outerWidth() {
                return this.width || this.$el.offsetWidth;
            },
            dataArray() {
                return Object.keys(this.data).map((k) => {
                    const obj = {};
                    obj[xColumn] = k;
                    obj[yColumn] = this.data[k];
                    return obj;
                });
            },
            xScale() {
                return d3.scaleBand().range([0, this.innerWidth]).padding(this.barPadding);
            },
            yScale() {
                return d3.scaleLinear().range([this.innerHeight, 0]);
            },
            showChart() {
                // check if null was passed in
                return this.data ? Object.keys(this.data).length > 0 : false;
            },
        },
        watch: {
            data() {
                this.drawChart();
            },
            width() {
                this.drawChart();
            },
        },
        mounted() {
            this.drawChart();
            this.addCountsToBars();
        },
        methods: {

            addCountsToBars(){
              console.log("this.data", this.data)
            },

            nFormatter(num, digits) {
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "k" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    },

            setSvgSize() {
                if (!this.showChart) {
                    return;
                }
                d3.select(this.$el).select('svg')
                    .attr('width', this.outerWidth)
                    .attr('height', this.height);
            },
            drawChart() {
                if (!this.showChart) {
                    return;
                }
                this.setSvgSize();
                this.xScale.domain(this.dataArray.map((d) => d[xColumn]));
                this.yScale.domain([0, d3.max(this.dataArray, (d) => d[yColumn])]);
                this.colorScale.domain(this.dataArray.map((d) => d[xColumn]));
                const yAxis = d3.axisLeft()
                    .scale(this.yScale)
                    .ticks(4, 's') // Use approximately 4 tick marks.
                    .tickSizeOuter(0);
                this.gMain.select('.axis__y').call(yAxis);


                console.log("this.dataArray", this.dataArray);


                const bars = this.gMain
                    .selectAll('rect')
                    .data(this.dataArray);
                bars.exit().remove();
                bars.enter()
                    .append('rect')
                    .merge(bars)
                    .attr('width', this.xScale.bandwidth())
                    .attr('x', (d) => this.xScale(d[xColumn]))
                    .attr('y', (d) => this.yScale(d[yColumn]))
                    .attr('height', (d) => this.innerHeight - this.yScale(d[yColumn]))
                    .attr('fill', (d) => this.colorScale(d[xColumn]));


                const typeLabels = this.gMain.selectAll('.type-label').data(this.dataArray);
                typeLabels.enter().append('text')
                    .merge(typeLabels)
                    .attr('class', 'type-label')
                    .attr('dy', '-2')
                    .attr('x', (d) => this.xScale(d[xColumn]) + (this.xScale.bandwidth() / 2))
                    .attr('y', (d) => this.yScale(d[yColumn]))
                    .text((d) => d[xColumn])
                    .attr('fill', (d) => this.colorScale(d[xColumn]));
                typeLabels.exit().remove();


                let labels = this.gMain
                    .selectAll(".textLables")
                    .data(this.dataArray);

                labels
                    .enter()
                    .append('text')
                    .merge(labels)
                    .attr('x', (d) => this.xScale(d[xColumn]) + (this.xScale.bandwidth() / 2))
                    .attr('y', (d) => this.yScale(d[yColumn]/2))
                    .attr("fill", "white")
                    .attr("text-anchor", "middle")
                    .text(d => this.nFormatter(d.count, 1));
            },
        },
    };
</script>

<style>
    .axis text {
        fill: #666666;
    }
    text.type-label {
        text-anchor: middle;
    }
    .axis path, .axis line {
        fill: none;
        stroke: #666666;
        shape-rendering: crispEdges;
    }
</style>
