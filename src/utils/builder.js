/* Copyright 2017-2020, Frameshift Labs, Inc., All rights reserved. */
/* File from: https://github.com/ErikGartner/dTree
 *
 */

// TODO: refactor code to adhere to linter
/*
eslint-disable
no-unused-vars,
prefer-destructuring,
no-multi-assign,
class-methods-use-this,
no-plusplus,
no-shadow,
no-param-reassign,
no-mixed-operators,
eqeqeq
*/

import _ from 'lodash';
import * as d3 from 'd3';

// import colors from '@/config/colors';

const pedigreeColors = {affected: "#ccc", selected: "rgb(53, 134, 192)"};

export default class TreeBuilder {
    constructor(root, siblings, opts) {
        TreeBuilder.DEBUG_LEVEL = opts.debug ? 1 : 0;

        this.root = root;
        this.siblings = siblings;
        this.opts = opts;
        this.strokeWidth = opts.strokeWidth;
        this.lineWidth = opts.lineWidth;

        // flatten nodes
        this.allNodes = this._flatten(this.root);

        // Calculate node size
        const visibleNodes = _.filter(this.allNodes, (n) => !n.hidden);
        this.nodeSize = opts.callbacks.nodeSize(
            visibleNodes,
            opts.nodeWidth, opts.callbacks.textRenderer,
        );
    }

    create() {
        const opts = this.opts;
        const allNodes = this.allNodes;
        const nodeSize = this.nodeSize;

        const width = opts.width + opts.margin.left + opts.margin.right;
        const height = opts.height + opts.margin.top + opts.margin.bottom;

        // make an SVG
        this.base_svg = d3.select(opts.target)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const svg = this.svg = this.base_svg.append('g');

        // Compute the layout.
        this.tree = d3.tree()
            .nodeSize([nodeSize[0] * 2, nodeSize[1] * 3.5]);
        // splichte: the constants on nodeSize control spacing

        this.tree.separation((a, b) => {
            if (a.data.hidden || b.data.hidden) {
                // should be half of the separation below, due to the phantom root node
                return 0.2;
            }
            return 0.4;
        });

        this._update(this.root);
    }

    _update(source) {
        const opts = this.opts;
        const allNodes = this.allNodes;
        const nodeSize = this.nodeSize;

        const treenodes = this.tree(source);
        const links = treenodes.links();

        // Create the link lines.
        const linkEls = this.svg.selectAll('.link')
            .data(links);

        linkEls.exit().remove();

        linkEls
            .enter()
            .filter((l) => !l.target.data.noParent)
            .append('path')
            .merge(linkEls)
            .attr('class', opts.styles.lineage)
            .attr('stroke-width', this.lineWidth)
            .attr('stroke', 'gray')
            .attr('fill', 'none')
            .attr('d', this._elbow);

        const nodes = this.svg.selectAll('.node')
            .data(treenodes.descendants())
            .enter();

        this._linkSiblings();

        // Draw siblings (marriage)
        const sibEls = this.svg.selectAll('.sibling')
            .data(this.siblings);

        sibEls.exit().remove();

        sibEls
            .enter()
            .append('path')
            .merge(sibEls)
            .attr('class', opts.styles.marriage)
            .attr('stroke-width', this.lineWidth)
            .attr('stroke', 'gray')
            .attr('fill', 'none')
            .attr('d', _.bind(this._siblingLine, this));

        nodes.append('rect')
            .filter((d) => !d.data.hidden)
            .filter((d) => d.data.extra.sex === 'm')
            .attr('stroke', (d) => {
                if (d.data.extra.isMainSample) {
                    return pedigreeColors.selected;
                }
                return 'gray';
            })
            .attr('stroke-width', d => {
                if (d.data.extra.isMainSample) {
                    return "5px";
                }
                else{
                    return this.strokeWidth
                }
            })
            .attr('fill', (d) => {
                if (d.data.extra.affected) {
                    return pedigreeColors.affected;
                }
                return 'white';
            })
            .attr('x', (d) => `${d.x - d3.min([d.cWidth, d.cHeight])}px`)
            .attr('y', (d) => {
                const top = d.y - d3.min([d.cWidth, d.cHeight]);
                return `${top}px`;
            })
            // eslint-disable-next-line
            .attr('width', (d) => {
                // TODO: calculate side from all
                return `${2 * d3.min([d.cWidth, d.cHeight])}px`;
            })
            .attr('height', (d) => `${2 * d3.min([d.cWidth, d.cHeight])}px`)
            .attr('id', (d) => d.data.id);

        // we rotate the square by 90 degrees
        // to keep the height and width the same we need to scale by
        // 1 / sqrt(2) since the diagonal is now the up and down and left and right
        const scaledMinSize = (d) => 1 / Math.sqrt(2) * d3.min([d.cWidth, d.cHeight]);
        // unknown sex make diamond
        nodes.append('rect')
            .filter((d) => !d.data.hidden)
            .filter((d) => d.data.extra.sex === 'u')
            .attr('stroke', (d) => {
                if (d.data.extra.isMainSample) {
                    return pedigreeColors.selected;
                }
                return 'gray';
            })
            .attr('stroke-width', d => {
                if (d.data.extra.isMainSample){
                    return "5px";
                }
                else{
                    return this.strokeWidth
                }
            })
            .attr('fill', (d) => {
                if (d.data.extra.affected) {
                    return pedigreeColors.affected;
                }
                return 'white';
            })
            .attr('x', (d) => `${d.x - (scaledMinSize(d))}px`)
            .attr('y', (d) => {
                const top = d.y - (scaledMinSize(d));
                return `${top}px`;
            })
            .attr('width', (d) => `${2 * scaledMinSize(d)}px`)
            // shrink the width and height so the actual width and height after rotating
            // remains the same
            .attr('height', (d) => `${2 * scaledMinSize(d)}px`)
            // rotate(angle xPos yPos) where xPos = x + width / 2 and yPos = height / 2
            // where x, y, width, and height come from the svg element
            .attr('transform', (d) => `rotate(45 ${d.x} ${d.y})`)
            .attr('id', (d) => d.data.id)
            .style('cursor', 'pointer')
            .on('mouseover', (d) => {
                opts.callbacks.nodeHover(d.data.name, d.data.extra);
            })
            .on('mouseleave', (d) => {
                opts.callbacks.nodeLeave(d.data.name, d.data.extra);
            })
            .on('click', (d) => {
                if (d.data.hidden) {
                    return;
                }
                opts.callbacks.nodeClick(d.data.name, d.data.extra);
            });


        nodes.append('circle')
            .filter((d) => !d.data.hidden)
            .filter((d) => d.data.extra.sex === 'f')
            .attr('stroke', (d) => {
                if (d.data.extra.isMainSample) {
                    return pedigreeColors.selected;
                }
                return 'gray';
            })
            .attr('stroke-width', d => {
                if (d.data.extra.isMainSample){
                    return "5px";
                }
                else{
                    return this.strokeWidth
                }
            })
            .attr('fill', (d) => {
                if (d.data.extra.affected) {
                    return pedigreeColors.affected;
                }
                return 'white';
            })
            .attr('cx', (d) => `${d.x}px`)
            .attr('cy', (d) => {
                const top = d.y - d3.min([d.cWidth, d.cHeight]);
                return `${d.y}px`;
            })
            .attr('r', (d) => `${d3.min([d.cWidth, d.cHeight])}px`)
            .attr('id', (d) => d.data.id);

        // now get bounding box + color it in
        const mySvg = this.svg;
        const bbox = mySvg._groups[0][0].getBBox();
        // account for the phantom first row depth and for box strokes
        const strokeWidth = this.strokeWidth;
        bbox.y -= strokeWidth;
        bbox.height += (strokeWidth * 2) + 1;
        bbox.x -= strokeWidth;
        bbox.width += strokeWidth * 2;
        this.base_svg.attr('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);


    }

    _flatten(root) {
        const n = [];
        let i = 0;

        function recurse(node) {
            if (node.children) {
                node.children.forEach(recurse);
            }
            if (!node.id) {
                node.id = ++i;
            }
            n.push(node);
        }
        recurse(root);
        return n;
    }

    _elbow(d, i) {
        if (d.target.data.noParent) {
            return 'M0,0L0,0';
        }
        const ny = d.target.y + (d.source.y - d.target.y) * 0.50;

        const linedata = [{
            x: d.target.x,
            y: d.target.y,
        }, {
            x: d.target.x,
            y: ny,
        }, {
            x: d.source.x,
            y: d.source.y,
        }];

        const fun = d3.line().curve(d3.curveStepAfter)
            .x((d) => d.x)
            .y((d) => d.y);

        return fun(linedata);
    }

    _linkSiblings() {
        const allNodes = this.allNodes;

        _.forEach(this.siblings, (d) => {
            const start = allNodes.filter((v) => d.source.id == v.data.id);
            const end = allNodes.filter((v) => d.target.id == v.data.id);
            d.source.x = start[0].x;
            d.source.y = start[0].y;
            d.target.x = end[0].x;
            d.target.y = end[0].y;
        });
    }

    _siblingLine(d, i) {
        let ny = d.target.y + (d.source.y - d.target.y) * 0.50;
        const nodeWidth = this.nodeSize[0];
        const nodeHeight = this.nodeSize[1];

        // Not first marriage
        if (d.number > 0) {
            ny -= nodeHeight * 8 / 10;
        }

        const linedata = [{
            x: d.source.x,
            y: d.source.y,
        }, {
            x: d.source.x + nodeWidth * 6 / 10,
            y: d.source.y,
        }, {
            x: d.source.x + nodeWidth * 6 / 10,
            y: ny,
        }, {
            x: d.target.x - nodeWidth * 6 / 10,
            y: ny,
        }, {
            x: d.target.x - nodeWidth * 6 / 10,
            y: d.target.y,
        }, {
            x: d.target.x,
            y: d.target.y,
        }];

        const fun = d3.line()
            .x((d) => d.x)
            .y((d) => d.y);

        return fun(linedata);
    }

    static _nodeSize(nodes, width, textRenderer) {
        // TODO: this computes maximimum height across all node
        // widths and heights.
        // but ours are always the same, so we can ignore.

        const maxWidth = 0;
        let maxHeight = 0;

        const tmpSvg = document.createElement('svg');
        document.body.appendChild(tmpSvg);

        _.map(nodes, (n) => {
            const container = document.createElement('div');
            container.setAttribute('class', n.class);
            container.style.visibility = 'hidden';
            container.style.maxWidth = `${width}px`;

            const text = textRenderer(n.name, n.extra, n.textClass);
            container.innerHTML = text;

            tmpSvg.appendChild(container);
            const height = container.offsetHeight; // changes. that's strange.
            tmpSvg.removeChild(container);

            maxHeight = Math.max(maxHeight, height);
            // n.cHeight = height;
            n.cHeight = 24;
            n.cWidth = width;
        });
        document.body.removeChild(tmpSvg);

        return [width, maxHeight];
    }

    static _nodeRenderer(name, x, y, height, width, extra, id, nodeClass, textClass, textRenderer) {
        let node = '';
        node += '<div ';
        node += 'style="height:100%;width:100%;" ';
        node += `class="${nodeClass}" `;
        node += `id="node${id}">\n`;
        node += textRenderer(name, extra, textClass);
        node += '</div>';
        return node;
    }

    static _textRenderer(name, extra, textClass) {
        let node = '';
        node += '<p ';
        node += 'align="center" ';
        node += `class="${textClass}">\n`;
        node += name;
        node += '</p>\n';
        return node;
    }

    static _debug(msg) {
        if (TreeBuilder.DEBUG_LEVEL > 0) {
            // eslint-disable-next-line
            console.log(msg);
        }
    }
}
