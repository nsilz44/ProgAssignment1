
const csvdata = new URL('https://raw.githubusercontent.com/nsilz44/ProgAssignment1/master/woodland_bird_species_trends_UK_1970_to_2014.csv')



class margin{
    constructor(top,left,right,bottom){
    this.top = top
    this.left = left
    this.right = right
    this.bottom = bottom
    }
}

class graph{
    constructor(newdata){
       
    margin = new margin(20, 50, 50, 30)
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    
    var x = d3.scaleLinear()
        .range([width,0]);
    
    var y = d3.scaleBand()
    .rangeRound([0,height])
    .padding(.1)

    var xAxis = d3.axisBottom(x)
    .scale(x);
    
    

    var yAxis = d3.axisLeft(y)
    .scale(y)
    .tickSize(0)
    .tickPadding(6);

    d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     
    d3.csv(newdata).then(function(data){
     data.forEach(function(d){ d["Annual percentage change"] = + d["Annual percentage change"];});
        x.domain(d3.extent(data, function(d) { return d["Annual percentage change"]; })).nice();
       y.domain (d3.map(data, function(d) { return d.Species; }));
    
     
    d3.select("svg.bar")
    .data(data)
  .enter().append("rect")
    .attr("class", function(d) { return "bar bar--" + (d["Annual percentage change"] < 0 ? "negative" : "positive"); })
    .attr("x", function(d) { return x(Math.min(0, d["Annual percentage change"])); })
    .attr("y", function(d) { return y(d["Annual percentage change"]); })
    .attr("width", function(d) { return Math.abs(x(d["Annual percentage change"]) - x(0)); })
    .attr("height", y.bandwidth());

    d3.select("svg").append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    d3.select("svg").append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + x(0) + ",0)")
    .call(yAxis);
         
    }
    )}
}

let newGraph = new graph(csvdata);


