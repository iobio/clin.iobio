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
            <v-icon>warning</v-icon>
            No Data
        </v-layout>
        <div v-else>
            <svg class="variant-types-bar-chart">
                <g
                        :transform="`translate(${margin.left},${margin.top + 10})`"
                        class="g-main"
                >
                    <g class="axis axis__y"/>
                    <g class="axis axis__x"/>

                </g>
                <text class="axis-label axis-label--y"/>
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
                        top: 25, right: 30, bottom: 5, left: 50,
                    };
                },
            },
            yAxisLabel: {
                type: String,
                default: 'Variant Count',
            },
            colorScale: {
                type: Function,
                default: d3.scaleOrdinal().range(['#0080A8', '#2EB0CE', '#37D4EF', '#97E9F2']),
            },
            customData: null
        },
        data() {
            return {
                barPadding: 0.2,
                topOffset: 50,
                totalVarCount: 0,
                maxCount: null,
            };
        },
        computed: {
            gMain() {
                return d3.select(this.$el).select('.g-main');
            },
            innerHeight() {
                return this.height - this.margin.top - this.margin.bottom - this.topOffset;
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
                this.populateMaxCount();
                this.drawChart();
                this.drawTotalVarCount();
            },
            width() {
                this.drawChart();
            },
        },
        mounted() {
            this.populateMaxCount();
            this.drawChart();
            this.drawTotalVarCount();
        },
        methods: {

            populateMaxCount(){

                let indel = parseInt(this.data.indel);
                let other = parseInt(this.data.other);
                let snp = parseInt(this.data.SNP);

                if(isNaN(indel)){
                    indel = 0;
                }
                if(isNaN(snp)){
                    snp = 0;
                }
                if(isNaN(other)){
                    other = 0;
                }
                this.maxCount = (snp, other, indel);
            },

            drawTotalVarCount() {

                let indel = parseInt(this.data.indel);
                let other = parseInt(this.data.other);
                let snp = parseInt(this.data.SNP);
                let ins = parseInt(this.data.INS);
                let del = parseInt(this.data.DEL);

                if(isNaN(indel)){
                    indel = 0;
                }
                if(isNaN(snp)){
                    snp = 0;
                }
                if(isNaN(other)){
                    other = 0;
                }
                if(isNaN(ins)){
                    ins = 0;
                }
                if(isNaN(del)){
                    del = 0;
                }

                if(this.customData){
                  this.totalVarCount = snp + ins + del;
                }
                else{
                  this.totalVarCount = snp + other + indel;
                  d3.select(this.$el).select('svg')
                      .append("text")
                      .attr('y', 12)
                      .attr('x', this.width / 2)
                      .attr("fill", "black")
                      .attr("text-anchor", "middle")
                      .text("Total: " + this.nFormatter(this.totalVarCount, 1));

                }
            },

            formatLabel(count){

                if(isNaN(count)){
                    return "";
                }

                return this.nFormatter(count, 1)
            },

            nFormatter(num, digits) {
                var si = [
                    {value: 1, symbol: ""},
                    {value: 1E3, symbol: "K"},
                    {value: 1E6, symbol: "M"},
                    {value: 1E9, symbol: "B"},
                    {value: 1E12, symbol: "T"}
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

                const yAxisLength = this.height - this.margin.top - this.margin.bottom;
                const middleOfYAxis = this.margin.top + (yAxisLength / 2);
                d3.select(this.$el).select('svg')
                    .select('.axis-label--y')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', 0)
                    .attr('x', -middleOfYAxis + 20)
                    .attr('dy', '10px')
                    .attr("font-size", "11px")
                    .attr("fill", "black")
                    .text(this.yAxisLabel);

                const xAxis = d3.axisBottom()
                    .scale(this.xScale)
                    .tickSize(0);

                this.gMain.select('.axis__x')
                    .attr('transform', `translate(0,${this.innerHeight - this.margin.bottom + 5})`)
                    .call(xAxis);


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

                var labels = this.gMain
                    .selectAll(".type-label")
                    .data(this.dataArray)
                
                labels.exit().remove();
                
                labels.enter()
                    .append('text')
                    .merge(labels)
                    .attr('class', 'type-label')
                    .attr('dy', '-2')
                    .attr('x', (d) => this.xScale(d[xColumn]) + (this.xScale.bandwidth() / 2))
                    .attr('y', (d) => this.yScale(d[yColumn]))
                    .text(d => this.formatLabel(d.count));
                    
                    
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
        /*fill: none;*/
        stroke: #666666;
        shape-rendering: crispEdges;
    }

    .axis__x text{
        /*fill: none;*/
    }

    .axis__x .tick{
        /*fill: none;*/
    }


</style>
