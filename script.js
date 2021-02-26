
// #D9E5D0 Lightest green, text background
// #C5D8B6 Main light green, viz background
// #63845A Medium green, text and viz fill
// #34422C Dark green, highlight text / viz select




// —————————— VALUE VARIABLES
// set the dimensions and margins of the graph
var margin = {top: 20, right: 50, bottom: 0, left: 10},
    width = d3.select('#my_dataviz').node().offsetWidth - margin.left - margin.right;
    height = 390 - margin.top - margin.bottom;

var tickLabels = ['J','F','M','A','M','J','J','A','S','O','N','D'];

// —————————— ON-PAGE VARIABLES

d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class","frame_svg")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


  // Add Y axis
  var y = d3.scaleLinear()
    .domain([700, -700])
    .range([ height, 0 ]);

 var svg_legend = d3.select("#my_legend")
  .append("svg")
    // .attr("width", width + margin.left + margin.right)
    .attr("height", 470 + margin.top + margin.bottom)
    .attr("fill","none")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

          frame_svg = d3.select("#my_dataviz").selectAll("svg");


  // create a tooltip
  var Tooltip = frame_svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17)



// —————————— "HELPER" FUNCTIONS
function mouseover(d,i) {
    ////old styles from guide
 //  Tooltip.style("opacity", 1)
 //  d3.selectAll(".myArea").style("opacity", .2)
 //  d3.select(this)
 //    .style("stroke", "#C5D8B6")
 //    .style("opacity", 1)
 //
 //  d3.selectAll(".myLabel").style("opacity", .2)
 // d3.select("#speciesLabel" + i)
 //      .style("opacity", 1)
//// new designed styles
 d3.select(this)
   .style("fill", "#34422C")

d3.select("#speciesLabel" + i)
     .style("fill", "#34422C")

console.log ("i: " + i);
document.getElementById('plant_thumbnail').src = ("assets/images/plant" + i + ".jpg");
console.log("assets/images/plant" + i + ".jpg");
document.getElementById('plant_thumbnail').style.visibility = "visible";
}
function mouseleave(d) {
  Tooltip.style("opacity", 0)
  // d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
  // d3.selectAll(".myLabel").style("opacity", 1) //Default styles from guide
  d3.selectAll(".myArea").style("fill", "#63845A")
  d3.selectAll(".myLabel").style("fill", "#63845A")
  document.getElementById('plant_thumbnail').style.visibility = "hidden";
 }

 function mouseover_label(d,i) {
     ////default from guide
   //   Tooltip.style("opacity", 1)
   //   d3.selectAll(".myArea").style("opacity", .2)
   //   d3.select("#species" + i)
   //     .style("stroke", "#C5D8B6")
   //     .style("opacity", 1)
   // d3.selectAll(".myLabel").style("opacity", .2)
   // d3.select(this)
   //     .style("opacity", 1)
   ////new designed styles
   d3.select(this)
        .style("fill", "#34422C")
    d3.select("#species" + i)
         .style("fill", "#34422C")
 console.log ("i: " + i);
 document.getElementById('plant_thumbnail').src = ("assets/images/plant" + i + ".jpg");
 console.log("assets/images/plant" + i + ".jpg");
 document.getElementById('plant_thumbnail').style.visibility = "visible";
 }

 function mouseleave_label(d,i) {
     d3.selectAll(".myArea")
          .style("fill", "#63845A")
      d3.selectAll(".myLabel")
          .style("fill", "#63845A")
  document.getElementById('plant_thumbnail').style.visibility = "hidden";
  }

// MAIN DATA BINDING, AND DRAWING WITH DATA
function main_draw() {
    clear_draw();
    frame_svg.selectAll("mylayers").remove();
    width = d3.select('#my_dataviz').node().offsetWidth - margin.left - margin.right;
    // console.log(width);
    frame_svg.attr("width", width + margin.left + margin.right);
    // Parse the Data
    d3.csv("dailyObs2020_bySpecies_Top25_withWeek_sortFreq.csv", function(data) {

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
      var tickDistance = [...Array(13).keys()].map(x => x * (49/11));
      // Add X axis
      var x = d3.scaleLinear()
        .domain(d3.extent(data, function(d,i) { return i; }))
        .range([ 0, d3.select('#my_dataviz').node().offsetWidth]);
      frame_svg.append("g")
        .attr("transform", "translate(0," + height*0.9 + ")")
        .call(d3.axisBottom(x).tickValues(tickDistance).tickSize(-height*.8).tickFormat(function(d,i){ return tickLabels[i] }))
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
          .style("fill", "#63845A" )
          .style("stroke","#C5D8B6")
          .attr('stroke-width', 0.2)
          .attr("d", area)
          .on("mouseover", mouseover)
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)


      svg_legend
        .selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
          .attr("x", -10)
          .attr("y", function(d,i){ return i*(18) + (5)}) // 100 is where the first label appears. 18 is the distance between labels
          .style("fill", "#63845A")
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

    setTimeout(function() {
	// Setup the new requestAnimationFrame()
	timeout = window.requestAnimationFrame(function () {

		main_draw();
		// console.log('debounced');

	   });
   }, 100)

}, false);
main_draw();
