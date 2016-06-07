var margin = {top: 20, right: 20, bottom: 90, left: 30};
var width = 600 - margin.left - margin.right;
var height = 550 - margin.top - margin.bottom;

// pre-cursors
var sizeForCircle = function(d) {
  // TODO: modify the size
  return 8*d.ServingSizeWeight;
}

// setup x
var xValue = function(d) { return d.Calories;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d["Sugars"];}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.Manufacturer;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select(".scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("cereal.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.Calories = +d.Calories;
    d["Sugars"] = +d["Sugars"];
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .attr("fill", "white")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Calories");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .attr("fill", "white")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text("Sugars");

  // draw dots
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", sizeForCircle)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("click", function(d) {
          d3.selectAll(".bar").transition()
                .duration(function(d) {
                    return Math.random() * 1000;
                })
                .delay(function(d) {
                    return Math.random() * 800
                })
                .style("fill", function(e) {
                    if (e.Calories > d.Calories) {
                        return "yellow";
                    }
                    return color(cValue(e));
            });
      })
      .on("mouseover", function(d) {

          // TODO: show the tool tip

          // TODO: fill to the tool tip with the appropriate data

          // TODO: update text in our custom nutrition label

          // TODO: expand all nodes with the same manufacturer
           tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Cereal Name"] + "<br/> Calories: " + xValue(d) 
          + "<br/> Sugars: " + yValue(d))
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");

      })
      .on("mouseout", function(d) {
          // TODO: hide the tooltip

          // TODO: resize the nodes
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);

      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("y", height - 160)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", height - 155)
      .attr("dy", ".35em")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .text(function(d) { return d;});
});
