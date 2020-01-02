/* File from: https://github.com/ErikGartner/dTree
 *
 */
import _ from 'lodash';
import d3 from 'd3';

class TreeBuilder {

  constructor(root, siblings, opts) {
    TreeBuilder.DEBUG_LEVEL = opts.debug ? 1 : 0;

    this.root = root;
    this.siblings = siblings;
    this.opts = opts;

    // flatten nodes
    this.allNodes = this._flatten(this.root);

    // Calculate node size
    var visibleNodes = _.filter(this.allNodes, function(n) {
      return !n.hidden;
    });
    this.nodeSize = opts.callbacks.nodeSize(visibleNodes,
      opts.nodeWidth, opts.callbacks.textRenderer);
  }

  create() {

    var opts = this.opts;
    var allNodes = this.allNodes;
    var nodeSize = this.nodeSize;

    var width = opts.width + opts.margin.left + opts.margin.right;
    var height = opts.height + opts.margin.top + opts.margin.bottom;

    //make an SVG
    this.base_svg = d3.select(opts.target)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    var svg = this.svg = this.base_svg.append('g');
//      .attr('transform', 'translate(' + width / 2 + ',' + opts.margin.top + ')');

    // Compute the layout.
    this.tree = d3.layout.tree()
      .nodeSize([nodeSize[0]*2, nodeSize[1] * 3.5]);
    // splichte: the constants on nodeSize control spacing

    this.tree.separation(function separation(a, b) {
      if (a.hidden || b.hidden) {
        // should be half of the separation below, due to the phantom root node
        return 0.2;
      } else {
        return 0.4;
      }
    });

    this._update(this.root);

  }

  _update(source) {

    var opts = this.opts;
    var allNodes = this.allNodes;
    var nodeSize = this.nodeSize;

    var nodes = this.tree.nodes(source);

    var links = this.tree.links(nodes);

    this.strokeWidth = 2;

    // Create the link lines.
    this.svg.selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', opts.styles.lineage)
      .attr('stroke-width', this.strokeWidth)
      .attr('stroke', 'gray')
      .attr('fill', 'none')
      .attr('d', this._elbow);

    var nodes = this.svg.selectAll('.node')
      .data(nodes)
      .enter();

    this._linkSiblings();

    // Draw siblings (marriage)
    this.svg.selectAll('.sibling')
      .data(this.siblings)
      .enter()
      .append('path')
      .attr('class', opts.styles.marriage)
      .attr('stroke-width', this.strokeWidth)
      .attr('stroke', 'gray')
      .attr('fill', 'none')
      .attr('d', _.bind(this._siblingLine, this));

    // correct for d3 tree layout having a "phantom" root
    // by finding and subtracting that row
    let firstRowTop;

    nodes.append('rect')
      .filter(function(d) {
        return d.hidden ? false : true;
      })
      .filter(function(d) {
        return d.extra.sex==='m';
      })
      .attr('stroke', d => {
        if (d.extra.isMainSample) {
          return '#ed5858';
        } else {
          return 'gray';
        }
      })
      .attr('stroke-width', this.strokeWidth)
      .attr('fill', d => {
        if (d.extra.affected) {
          return '#ccc';
        } else {
          return 'white';
        }
      })
      .attr('x', function(d) {
        return d.x - d3.min([d.cWidth, d.cHeight]) + 'px';
      })
      .attr('y', function(d) {
        let top = d.y - d3.min([d.cWidth, d.cHeight]);
        if (d.depth===1) {
          firstRowTop = top;
        }
        return top + 'px';
      })
      .attr('width', function(d) {
        // TODO: calculate side from all
        return 2*d3.min([d.cWidth, d.cHeight])+'px';
      })
      .attr('height', function(d) {
        return 2*d3.min([d.cWidth, d.cHeight])+'px';
      })
      .attr('id', function(d) {
        return d.id;
      })
      .style('cursor', 'pointer')
      .on('mouseover', function (d) {
        opts.callbacks.nodeHover(d.name, d.extra);
      })
      .on('mouseleave', function (d) {
        opts.callbacks.nodeLeave(d.name, d.extra);
      })
      .on('click', function(d)  {
        if (d.hidden) {
          return;
        }
        opts.callbacks.nodeClick(d.name, d.extra);
      });

    nodes.append('circle')
      .filter(function(d) {
        return d.hidden ? false : true;
      })
      .filter(function(d) {
        return d.extra.sex==='f';
      })
      .attr('stroke', d => {
        if (d.extra.isMainSample) {
          return '#ed5858';
        } else {
          return 'gray';
        }
      })
      .attr('stroke-width', this.strokeWidth)
      .attr('fill', d => {
        if (d.extra.affected) {
          return '#ccc';
        } else {
          return 'white';
        }
      })
      .attr('cx', function(d) {
        return d.x + 'px';
      })
      .attr('cy', function(d) {
        let top = d.y - d3.min([d.cWidth, d.cHeight]);
        if (d.depth===1) {
          firstRowTop = top;
        }
        return d.y + 'px';
      })
      .attr('r', function(d) {
        return d3.min([d.cWidth, d.cHeight])+'px';
      })
      .attr('id', function(d) {
        return d.id;
      })
      .style('cursor', 'pointer')
      .on('mouseover', function (d) {
        opts.callbacks.nodeHover(d.name, d.extra);
      })
      .on('mouseleave', function (d) {
        opts.callbacks.nodeLeave(d.name, d.extra);
      })
      .on('click', function(d)  {
        if (d.hidden) {
          return;
        }
        opts.callbacks.nodeClick(d.name, d.extra, d.id);
      });

    // now get bounding box + color it in
    let my_svg = this.svg;
    let bbox = my_svg[0][0].getBBox();
    // account for the phantom first row depth and for box strokes
    let strokeWidth = this.strokeWidth;
    bbox.y = bbox.y+firstRowTop-strokeWidth;
    bbox.height = bbox.height-firstRowTop+strokeWidth*2;
    bbox.x = bbox.x-strokeWidth;
    bbox.width = bbox.width+strokeWidth*2;

    this.base_svg.attr("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
  }
  _flatten(root) {
    var n = [];
    var i = 0;

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
    if (d.target.noParent) {
      return 'M0,0L0,0';
    }
    var ny = d.target.y + (d.source.y - d.target.y) * 0.50;

    var linedata = [{
      x: d.target.x,
      y: d.target.y
    }, {
      x: d.target.x,
      y: ny
    }, {
      x: d.source.x,
      y: d.source.y
    }];

    var fun = d3.svg.line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      })
      .interpolate('step-after');
    return fun(linedata);
  }

  _linkSiblings() {

    var allNodes = this.allNodes;

    _.forEach(this.siblings, function(d)  {
      var start = allNodes.filter(function(v) {
        return d.source.id == v.id;
      });
      var end = allNodes.filter(function(v) {
        return d.target.id == v.id;
      });
      d.source.x = start[0].x;
      d.source.y = start[0].y;
      d.target.x = end[0].x;
      d.target.y = end[0].y;
    });

  }

  _siblingLine(d, i) {

    var ny = d.target.y + (d.source.y - d.target.y) * 0.50;
    var nodeWidth = this.nodeSize[0];
    var nodeHeight = this.nodeSize[1];

    // Not first marriage
    if (d.number > 0) {
      ny -= nodeHeight * 8 / 10;
    }

    var linedata = [{
      x: d.source.x,
      y: d.source.y
    }, {
      x: d.source.x + nodeWidth * 6 / 10,
      y: d.source.y
    }, {
      x: d.source.x + nodeWidth * 6 / 10,
      y: ny
    }, {
      x: d.target.x - nodeWidth * 6 / 10,
      y: ny
    }, {
      x: d.target.x - nodeWidth * 6 / 10,
      y: d.target.y
    }, {
      x: d.target.x,
      y: d.target.y
    }];

    var fun = d3.svg.line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      })
      .interpolate('linear');
    return fun(linedata);
  }

  static _nodeSize(nodes, width, textRenderer) {
    // TODO: this computes maximimum height across all node
    // widths and heights.
    // but ours are always the same, so we can ignore.

    var maxWidth = 0;
    var maxHeight = 0;

    var tmpSvg = document.createElement('svg');
    document.body.appendChild(tmpSvg);

    _.map(nodes, function(n) {
      var container = document.createElement('div');
      container.setAttribute('class', n.class);
      container.style.visibility = 'hidden';
      container.style.maxWidth = width + 'px';

      var text = textRenderer(n.name, n.extra, n.textClass);
      container.innerHTML = text;

      tmpSvg.appendChild(container);
      var height = container.offsetHeight; // changes. that's strange.
      tmpSvg.removeChild(container);

      maxHeight = Math.max(maxHeight, height);
      //n.cHeight = height;
      n.cHeight = 24;
      n.cWidth = width;
    });
    document.body.removeChild(tmpSvg);

    return [width, maxHeight];
  }

  static _nodeRenderer(name, x, y, height, width, extra, id, nodeClass, textClass, textRenderer) {
    var node = '';
    node += '<div ';
    node += 'style="height:100%;width:100%;" ';
    node += 'class="' + nodeClass + '" ';
    node += 'id="node' + id + '">\n';
    node += textRenderer(name, extra, textClass);
    node += '</div>';
    return node;
  }

  static _textRenderer(name, extra, textClass) {
    var node = '';
    node += '<p ';
    node += 'align="center" ';
    node += 'class="' + textClass + '">\n';
    node += name;
    node += '</p>\n';
    return node;
  }

  static _debug(msg) {
    if (TreeBuilder.DEBUG_LEVEL > 0)  {
      console.log(msg);
    }
  }

}

export default TreeBuilder;