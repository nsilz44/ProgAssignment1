var margin = {top: 20, right: 30, bottom: 40, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleBand()
    .rangeRound([0,height])
    .round([0.1])

var xAxis = d3.axisBottom()
    .scale(x);
    

var yAxis = d3.axisLeft()
    .scale(y)
    .tickSize(0)
    .tickPadding(6);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv('https://raw.githubusercontent.com/nsilz44/ProgAssignment1/master/data.csv')
    .then(function(data) {x.domain(d3.extent(data, function(d) { return d.value; })).nice();
    y.domain(data.map(function(d) { return d.name; }));
    
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
      .attr("x", function(d) { return x(Math.min(0, d.value)); })
      .attr("y", function(d) { return y(d.name); })
      .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
      .attr("height", y.bandwidth());

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + x(0) + ",0)")
      .call(yAxis);
});

function type(d) {
  d.value = +d.value;
  return d;
}