/* Copyright 2017-2020, Frameshift Labs, Inc., All rights reserved. */
<template>
    <div :style="`height: ${height}px`">
        <svg v-if="showChart">
            <g class="g-main">
                <g class="axis axis__x"/>
                <g class="axis axis__y"/>
                <g class="scores"/>
                <g class="brush">
                    <text
                            class="extent extent--e"
                            text-anchor="start"
                    />
                    <text
                            class="extent extent--w"
                            text-anchor="end"
                    />
                </g>
            </g>
            <text class="axis-label axis-label--x"/>
            <text class="axis-label axis-label--y"/>
        </svg>
        <v-layout
                v-else
                id="no-data-alert"
                key="no-data"
                fill-height
                justify-center
                align-center
        >
            <v-icon>warning</v-icon>
            No Data
        </v-layout>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    import {formatNumber} from '../../utils/formatNumber.js';

    export default {
        name: 'BarChart',
        props: {
            barPadding: {
                type: Number,
                default: 1,
            },
            canFilter: {
                type: Boolean,
                default: false,
            },
            color: {
                type: String,
                default: '#c62828',
            },
            data: {
                type: Array,
                required: true,
            },
            height: {
                type: Number,
                default: 100,
            },
            margin: {
                type: Object,
                default() {
                    return {
                        top: 20, right: 40, bottom: 30, left: 50,
                    };
                },
            },
            onBrushEnd: {
                type: Function,
                default: () => {
                },
            },
            stashDomain: {
                type: Function,
                default: () => {
                },
            },
            tickFormatX: {
                type: Function,
                default: null,
            },
            tickFormatY: {
                type: Function,
                default: null,
            },
            width: {
                type: Number,
                default: 400,
            },
            showXAxis: {
                type: Boolean,
                default: true,
            },
            xAxisLabel: {
                type: String,
                default: 'Coverage',
            },
            yAxisLabel: {
                type: String,
                default: '% of Targeted Regions',
            },
            xDomain: {
                type: [Boolean, Array],
                default: false,
            },
            yDomain: {
                type: [Boolean, Array],
                default: false,
            },
        },
        data() {
            return {
                clearingFilters: false,
                brush: null,
                brushLocation: null,
                // controls gap between axis and its label
                labelHeight: 16,
                xScale: null,
                yScale: null,
                medianCoverage: null,
            };
        },
        computed: {
            gMain() {
                return d3.select(this.$el).select('.g-main');
            },
            typedData() {
                return this.data.map((d) => [Number(d[0]), Number(d[1])]);
            },
            showChart() {
                // check if null was passed in
                return this.typedData ? this.typedData.length > 0 : false;
            },
            xDomainLocal() {
                // extend domain if we don't have a zero bin at the end
                // this is necessary so the xaxis extends all the way since we draw our bins
                // starting at the value and going right
                const extend = this.typedData[this.typedData.length - 1][1] === 0 ? 0 : 1;
                return [this.typedData[0][0], this.typedData[this.typedData.length - 1][0] + extend];
            },
            yDomainLocal() {
                return d3.extent(this.typedData.map((arr) => arr[1]));
            },
            xRange() {
                return [this.margin.left + this.labelHeight, this.width - this.margin.right];
            },
            yRange() {
                return [this.height - this.margin.bottom - this.labelHeight, this.margin.top];
            },
        },
        watch: {
            color() {
                this.update();
            },
            data() {
                this.update();
            },
            width() {
                this.update();
            },
            xDomain() {
                this.update();
            },
            yDomain() {
                this.update();
            },
            xAxisLabel() {
                this.update();
            },
            yAxisLabel() {
                this.update();
            },
            medianCoverage() {
                this.update();
            }
        },
        mounted() {
            this.checkForData(this.drawChart);
            this.calculateMedianCoverage();
            this.plotMedian();
        },
        methods: {

            plotMedian(){

                let svg = d3.select(this.$el)
                    .select('svg');

                //todo: unhardcode max coverage
                let max = Math.max.apply(Math, this.data.map(function(a) { return a[1]; }))
                max = max + 0.05*max;
                console.log("max", max);



                //todo: create group, append median coverage text to median rect
                //todo: refactor rect to line or path element
                svg.append('line')
                    .attr("id", "medianLine")
                    .attr("stroke", "black")
                    .attr("stroke-dasharray", "10 5")
                    .attr('x1', this.xScale(this.medianCoverage))
                    .attr('y1', this.yScale(0))
                    .attr('x2', this.xScale(this.medianCoverage))
                    .attr('y2', this.yScale(max))

                svg.append('text')
                    .attr("id", "medianText")
                    .attr("fill", "black")
                    .attr("font-size", "12px")
                    .attr('x', this.xScale(this.medianCoverage) + 5)
                    .attr('y', this.yScale(max - (0.05*max)))
                    .text(this.medianCoverage.toString() + 'X Median')

            },

            calculateMedian(values) {
                let total = 0;

                for(let i = 0; i < values.length; i++){
                    total += values[i];
                }

                return total / 2;
            },


            findMedianFromCummulativeFrequencies(medianFreq, cumFreqs){
                for(let i =0; i < cumFreqs.length; i++){
                    if(medianFreq >= cumFreqs[i][1] && medianFreq <= cumFreqs[i][2]){
                        return cumFreqs[i][0];
                    }
                }
                return -1;
            },

            calculateMedianCoverage() {
                let freqs = [];
                let cumFreqs = [];
                let start = 0;
                let end = 0;
                for (let i = 0; i < this.data.length; i++) {
                    freqs.push(this.data[i][1] * 1000000);
                    end += (this.data[i][1] * 1000000);
                    let d = [this.data[i][0], start, end];
                    start = end;
                    cumFreqs.push(d);
                }
                const medianFreq = this.calculateMedian(freqs);
                this.medianCoverage = this.findMedianFromCummulativeFrequencies(medianFreq, cumFreqs);
                console.log("median coverage", this.medianCoverage);
            },

            checkForData(func) {
                if (!this.showChart) {
                    return;
                }
                func();
            },
            drawChart() {
                this.setSvgSize();
                this.createAxis();
                this.addLabels();
                this.drawBars();
                this.addBrush();
                this.stashDomain(this.xScale, this.yScale);
            },
            setSvgSize() {
                d3.select(this.$el)
                    .select('svg')
                    .attr('width', this.width)
                    .attr('height', this.height);
            },
            createAxis() {
                this.xScale = d3.scaleLinear()
                    .domain(this.xDomain ? this.xDomain : this.xDomainLocal)
                    .range(this.xRange);
                this.yScale = d3.scaleLinear()
                // gets size of smallest and largest bin
                    .domain(this.yDomain ? this.yDomain : this.yDomainLocal).nice()
                    .range(this.yRange);
                const xAxis = d3.axisBottom()
                    .scale(this.xScale)
                    // could make this a prop if there is a good use case for it
                    .ticks(5)
                    .tickFormat(this.tickFormatX ? this.tickFormatX : formatNumber);
                const yAxis = d3.axisLeft()
                    .scale(this.yScale)
                    .ticks(5)
                    .tickFormat(this.tickFormatY ? this.tickFormatY : formatNumber);
                if (this.showXAxis) {
                    this.gMain.select('.axis__x')
                        .attr('transform', `translate(0,${this.height - this.margin.bottom - this.labelHeight})`)
                        .call(xAxis);
                }
                this.gMain.select('.axis__y')
                    .attr('transform', `translate(${this.margin.left + this.labelHeight} , 0)`)
                    .call(yAxis);
            },
            addLabels() {
                const yAxisLength = this.height - this.margin.top - this.margin.bottom;
                const middleOfYAxis = this.margin.top + (yAxisLength / 2);
                d3.select(this.$el).select('svg')
                    .select('.axis-label--y')
                    .attr('text-anchor', 'middle')
                    .attr('transform', 'rotate(-90)')
                    // x and y are switched because the rotate
                    .attr('y', 0)
                    .attr('x', -middleOfYAxis)
                    .attr('dy', '10px')
                    .text(this.yAxisLabel);
                const xAxisLength = this.width - this.margin.left - this.margin.right;
                const middleOfXAxis = this.margin.left + (xAxisLength / 2);
                d3.select(this.$el).select('svg')
                    .select('.axis-label--x')
                    .attr('text-anchor', 'middle')
                    .attr('x', middleOfXAxis)
                    .attr('y', this.height)
                    .attr('dy', '-5px')
                    .text(this.xAxisLabel);
            },
            drawBars() {
                const dataJoin = this.gMain.select('.scores').selectAll('rect').data(this.typedData, (d) => d);
                dataJoin.enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .merge(dataJoin)
                    .attr('fill', this.color)
                    .attr('x', (d) => this.xScale(d[0]) + 1)
                    .attr('y', (d) => this.yScale(d[1]))
                    .attr('width', () => Math.abs(((this.xRange[1] - this.xRange[0]) / this.typedData.length) - this.barPadding))
                    .attr('height', (d) => this.yScale(this.yScale.domain()[0]) - this.yScale(d[1]));
                dataJoin.exit().remove();
            },
            addBrush() {
                if (this.canFilter) {
                    this.brush = d3.brushX()
                        .extent([[this.xRange[0], this.yRange[1]], [this.xRange[1], this.yRange[0]]])
                        .on('brush', this.updateBrush)
                        .on('end', this.localBrushEnd);
                    this.gMain.select('.brush')
                        .call(this.brush);
                }
            },
            updateBrushExtent() {
                if (this.canFilter) {
                    const brushEl = this.gMain.select('.brush');
                    this.brush.extent([[this.xRange[0], this.yRange[1]], [this.xRange[1], this.yRange[0]]]);
                    brushEl.call(this.brush);
                    const extentRange = d3.brushSelection(brushEl.node());
                    // if brush is currently drawn
                    if (extentRange) {
                        const [left, right] = this.brushLocation;
                        const toMove = [left, right].map(this.xScale);
                        // move the brush
                        brushEl.call(this.brush.move, toMove);
                    }
                }
            },
            updateBrush() {
                // moving the brush with brush.move emits an event
                // this catches that to prevent an infinite loop
                if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') {
                    return;
                }
                this.moveBrush();
            },
            moveBrush() {
                const xVals = this.typedData.map((arr) => arr[0]);
                const brushEl = this.gMain.select('.brush');
                const extentRange = d3.brushSelection(brushEl.node());
                const toolTipE = brushEl.select('.extent--e');
                const toolTipW = brushEl.select('.extent--w');
                // check if extent is null
                if (extentRange) {
                    const extentDomain = extentRange.map(this.xScale.invert);
                    const left = xVals[d3.bisectLeft(xVals, extentDomain[0])];
                    // the min is to handle if the bisect gives us a value larger than the array
                    const right = xVals[Math.min(d3.bisectLeft(xVals, extentDomain[1]), xVals.length - 1)];
                    this.brushLocation = [left, right];
                    const toMove = [left, right].map(this.xScale);
                    // move the brush
                    brushEl.call(this.brush.move, toMove);
                    // you can't put a <text> inside a <rect> so i was forced to manually set the location
                    const eastPos = [this.gMain.select('.handle--e').attr('x'), this.gMain.select('.handle--e').attr('y')];
                    const westPos = [this.gMain.select('.handle--w').attr('x'), this.gMain.select('.handle--w').attr('y')];
                    // formats the numbers so they won't be huge if they are a float
                    const toolTipNumbers = [left, right].map((el) => formatNumber(el));
                    toolTipE
                        .attr('x', eastPos[0])
                        // offset so doesn't interfere with axis
                        .attr('y', eastPos[1] - 3)
                        .text(toolTipNumbers[1]);
                    toolTipW
                        .attr('x', westPos[0])
                        .attr('y', westPos[1] - 3)
                        .text(toolTipNumbers[0]);
                } else {
                    // reset tooltips
                    toolTipE.text('');
                    toolTipW.text('');
                }
            },
            localBrushEnd() {
                // check if brush was cleared and clear tooltips if you cleared brush
                const extentRange = d3.brushSelection(this.gMain.select('.brush').node());
                if (extentRange === null) {
                    this.gMain.select('.extent--e').text('');
                    this.gMain.select('.extent--w').text('');
                    this.onBrushEnd([]);
                } else {
                    this.onBrushEnd(this.brushLocation);
                }
            },
            update() {
                this.setSvgSize();
                this.createAxis();
                this.drawBars();
                this.addLabels();
                this.updateBrushExtent();
                this.stashDomain(this.xScale, this.yScale);
            },
            clearFilters() {
                this.gMain.select('.brush').call(this.brush.move, null);
            },
        },
    };
</script>

<style scoped>
    .axis-label {
        font-size: 11px;
        fill: black
    }

    .axis >>> text {
        font-size: 9px;
        fill: black
    }


    .extent {
        font-size: 11px;
        fill: black
    }
</style>
