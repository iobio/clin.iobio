import boxAndWhiskerBox from './boxAndWhiskerBox.js'

export default function boxAndWhiskerD3() {


  // dimensions
  var margin = {top: 30, right: 50, bottom: 70, left: 50},
      width  = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  //  options
  var defaults = {};


  var labels = true; // show the text labels beside individual boxplots?


  var title = "";
  var labelXAxis = "";
  var labelYAxis = ""



  function chart(selection) {


    // determine inner height (w/o margins)
    var innerHeight = height - margin.top - margin.bottom;

    selection.each(function(summaryData) {

      // set svg element
      let container = d3.select(this);
      container.selectAll("svg").remove();
      let svg = container.append("svg");


      let max = d3.max(summaryData, function(d) {
        return d.whiskers[0];
      })
      let min = d3.min(summaryData, function(d) {
        return d.whiskers[1];
      })


      var chart = boxAndWhiskerBox()
          .height(height)
          .domain([min, max])
          .showLabels(labels);

      svg.attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .attr("class", "box")
         .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // the x-axis
      var x = d3.scale.ordinal()
                      .domain( summaryData.map(function(d) { console.log(d); return d.label } ) )
                      .rangeRoundBands([0 , width], 0.7, 0.3);

      var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");

      // the y-axis
      var y = d3.scale.linear()
                      .domain([min, max])
                      .range([height + margin.top, 0 + margin.top]);

      var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left");

      // draw the boxplots
      svg.selectAll(".box")
        .data(summaryData)
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" +  x(d.label)  + "," + margin.top + ")"; } )
        .call(chart.width(x.rangeBand()));


      // add a title
      svg.append("text")
          .attr("x", (width / 2))
          .attr("y", 0 + (margin.top / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "18px")
          //.style("text-decoration", "underline")
          .text(title);

       // draw y axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text") // and text1
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-size", "16px")
            .text(labelYAxis);

      // draw x axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
        .call(xAxis)
        .append("text")             // text label for the x axis
          .attr("x", (width / 2) )
          .attr("y",  10 )
          .attr("dy", ".71em")
          .style("text-anchor", "middle")
          .style("font-size", "16px")
          .text(labelXAxis);



    });

  }



  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.widthPercent = function(_) {
    if (!arguments.length) return widthPercent;
    widthPercent = _;
    return chart;
  };

  chart.heightPercent = function(_) {
    if (!arguments.length) return heightPercent;
    heightPercent = _;
    return chart;
  };



  return chart;
}