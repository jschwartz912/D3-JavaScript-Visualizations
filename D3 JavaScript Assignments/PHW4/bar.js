var BarMargin = {top: 20, right: 20, bottom: 90, left: 30},
    BarWidth = 600 - BarMargin.left - BarMargin.right,
    BarHeight = 550 - BarMargin.top - BarMargin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, BarWidth], .1);

var y = d3.scale.linear().range([BarHeight, 0]);

var xBarAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yBarAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var barsvg = d3.select(".barchart").append("svg")
    .attr("width", BarWidth + BarMargin.left + BarMargin.right)
    .attr("height", BarHeight + BarMargin.top + BarMargin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + BarMargin.left + "," + BarMargin.top + ")");

d3.csv("cereal.csv", function(error, data) {

    var newdata = d3.nest()
        .key(function(d) { return d.Manufacturer;})
        .rollup(function(d) { 
            return d3.mean(d, function(g) {return g.Calories; });
        }).entries(data);
    
    newdata.forEach(function(d) {
        d.Manufacturer = d.key;
        d.Calories = d.values;
    });
    

  x.domain(newdata.map(function(d) { return d['Manufacturer']; }));
  y.domain([0, d3.max(newdata, function(d) { return d.Calories; })]);

  barsvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xBarAxis)
        .attr("fill", "white")
  .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end");

  barsvg.append("g")
      .attr("class", "y axis")
      .call(yBarAxis)
    .attr("fill", "white")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
        .attr("fill", "white")
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Avg. Calories");

  barsvg.selectAll(".bar")
      .data(newdata)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d['Manufacturer']); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Calories); })
      .attr("height", function(d) { return height - y(d.Calories); })
      .style("fill", function(d) { return color(cValue(d));})
        .on("click", function(d) {
            d3.selectAll(".dot").transition()
                .duration(function(d) {
                    return Math.random() * 1000;
                })
                .delay(function(d) {
                    return Math.random() * 800
                })
                .style("opacity", function (e) {
                    if (d["Manufacturer"] == e["Manufacturer"]) {
                        return 1;
                    }
                    return 0.25;
            });
        }) //end onClick()
        .on("mouseover", function(d) {

          // TODO: show the tool tip
            tooltip.style("opacity", 1);
          // TODO: fill to the tool tip with the appropriate data
            tooltip.html("<b>" + d["Manufacturer"] + "</b>" + "<br/>Avg. Calories: " +                              d3.format(".3r")(d["Calories"]))
                .style("left", d3.event.pageX + 5 + "px")
                .style("top", d3.event.pageY + 5 + "px");
      })
        .on("mouseout", function(d) {
          // TODO: hide the tooltip
            tooltip.style("opacity", 0);
          // TODO: resize the nodes
            d3.selectAll(".dot").transition()
                .duration(500)
                .attr("r", sizeForCircle) //defined earlier in the code in a function

      });
});

function type(d) {
  d.Calories = +d.Calories;
  return d;
}