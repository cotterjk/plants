
// —————————— VALUE VARIABLES
// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 0, left: 10},
    width = d3.select('#my_dataviz').node().offsetWidth - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var tickLabels = ['J','F','M','A','M','J','J','A','S','O','N','D'];

// —————————— ON-PAGE VARIABLES

// Add Y axis
var y = d3.scaleLinear()
  .domain([-300, 300])
  .range([ height, 0 ]);

d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class","frame_svg")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

frame_svg = d3.select("#my_dataviz").selectAll("svg");

  // Add X axis label:
frame_svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height-30 )
  .text("Week");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-300, 300])
    .range([ height, 0 ]);

 var svg_legend = d3.select("#my_legend")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("fill","#ccc")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // create a tooltip
  var Tooltip = frame_svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17)



// —————————— "HELPER" FUNCTIONS
function mouseover(d,i) {
  Tooltip.style("opacity", 1)
  d3.selectAll(".myArea").style("opacity", .2)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)

  d3.selectAll(".myLabel").style("opacity", .2)
 d3.select("#speciesLabel" + i)
      .style("opacity", 1)

}
function mouseleave(d) {
  Tooltip.style("opacity", 0)
  d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
  d3.selectAll(".myLabel").style("opacity", 1)
 }

 function mouseover_label(d,i) {
     Tooltip.style("opacity", 1)
     d3.selectAll(".myArea").style("opacity", .2)
     d3.select("#species" + i)
       .style("stroke", "black")
       .style("opacity", 1)
   d3.selectAll(".myLabel").style("opacity", .2)
   d3.select(this)
       .style("opacity", 1)
 }

 function mouseleave_label(d,i) {
     Tooltip.style("opacity", 0)
     d3.selectAll(".myArea")
          .style("opacity", 1)
          .style("stroke", "none")
      d3.selectAll(".myLabel")
           .style("opacity", 1)
  }

// MAIN DATA BINDING, AND DRAWING WITH DATA
function main_draw() {
    clear_draw();
    frame_svg.selectAll("mylayers").remove();
    width = d3.select('#my_dataviz').node().offsetWidth - margin.left - margin.right;
    // console.log(width);
    frame_svg.attr("width", width + margin.left + margin.right);
    // Parse the Data
    d3.csv("dailyObs2019_bySpecies_Top25_withWeek.csv", function(data) {

    // Area generator
    var area = d3.area()
     .x(function(d, i) { return x(i); })
     .y0(function(d) { return y(d[0]); })
     .y1(function(d) { return y(d[1]); })
     .curve(d3.curveBasis);

      // List of groups = header of the csv files
      var keys = data.columns.slice(1)

      function mousemove_label(d,i) {
          Tooltip.text(keys[i])
      }

      function mousemove(d,i) {
        grp = keys[i]
        Tooltip.text(grp)
      }

      //Array of evenly spaced 1/12s * 50
      var tickDistance = [...Array(13).keys()].map(x => x * (50/12));
      // Add X axis
      var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d,i) { return i; }))
        .range([ 0, width ]);
      frame_svg.append("g")
        .attr("transform", "translate(0," + height*0.8 + ")")
        .call(d3.axisBottom(x).tickValues(tickDistance).tickSize(-height*.7).tickFormat(function(d,i){ return tickLabels[i] }))
        .select(".domain").remove()
      // Customization
      frame_svg.selectAll(".tick line").attr("stroke", "#b8b8b8")
      frame_svg.selectAll(".tick>text").attr("transform", "translate(" + width/24 + ")")


      //stack the data?
      var stackedData = d3.stack()
        .offset(d3.stackOffsetSilhouette)
        .keys(keys)
        (data)

      // Show the areas
      frame_svg
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
          .attr("class", "myArea")
          .attr("id", function(d,i) { return "species" + i })
          .style("fill", "#aaa" )
          .attr("d", area)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)


      svg_legend
        .selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
          .attr("x", 0)
          .attr("y", function(d,i){ return 10 + i*(15) + (5)}) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", "darkgreen")
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .attr("class","myLabel")
          .attr("id", function(d,i) { return "speciesLabel" + i })
          .style("alignment-baseline", "middle")
          .on("mouseover", mouseover_label)
          .on("mousemove", mousemove_label)
          .on("mouseleave", mouseleave_label)
    })
}

function clear_draw() {
    frame_svg.selectAll("path").remove(); //removes curve areas
    frame_svg.selectAll("g").remove(); //removes ticks
    svg_legend.selectAll("text").remove(); //removes legend

    // // console.log("Removing")
}

// —————————— END DATA BINDING DRAWING FUNCTION

var timeout;
window.addEventListener('resize', function (event) {

	// console.log('no debounce');

	// If there's a timer, cancel it
	if (timeout) {
		window.cancelAnimationFrame(timeout);
	}

	// Setup the new requestAnimationFrame()
	timeout = window.requestAnimationFrame(function () {

		main_draw();
		// console.log('debounced');

	});

}, false);
main_draw();
