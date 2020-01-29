
/** Class repersenting the chart. */
class Chart{
    /**
     * Create the chart
     * @param {Array} data - This is the chart's data values.
     */
    constructor(data){

        this.data = data 

        //array of the data's columns initialised 
        this.allGroup = [...this.data.columns]

        //call draw method
        this.draw()
    }
    /**
     *This will define the charts dimensions and margins, and set up the svg object.  
     */
    draw() {
      // define width, height and margin
      this.margin = {
          top: 10,
          right: 100,
          bottom: 50,
          left: 50
      };
      this.width =920 - this.margin.left - this.margin.right,
      this.height = this.width - 100;

      //set up svg and append it
      this.svg = d3.select("body").append('svg');
      this.svg.attr('width',  this.width);
      this.svg.attr('height', this.height);
      this.plot = this.svg.append('g')
          .attr('transform',`translate(${this.margin.left},${this.margin.top})`);

      //create other chart pieces
      this.createScales();
      this.addAxes();
      this.addLine();
      this.addTooltip();
      this.addDots();
  }
  /**
   * This will define the scale for the axes.
   */
  createScales() {
      //shorthand to save time later
      const m = this.margin;
      
      // calculate max and min for data
      const xExtent = d3.extent(this.data, function(d) { return d.time; });

      //set up scales for axes
      this.xScale = d3.scaleTime()
          .range([0, this.width-m.right])
          .domain(xExtent)

      this.yScale = d3.scaleLinear()
          .range([this.height-(m.top+m.bottom), 0])
          .domain([0,20]);
  }
  /**
   * This will create the axes.
   */
  addAxes() {
      //shorthand to save time later
      const m = this.margin;

      // create and append axis elements
      const xAxis = d3.axisBottom()
          .scale(this.xScale)
          .ticks(10);

      const yAxis = d3.axisLeft()
          .scale(this.yScale)
          .tickFormat(d3.format("d"));

      this.plot.append("g")
          .attr("class", "x axis")
          .attr("transform", `translate(0, ${this.height-(m.top+m.bottom)})`)
          .call(xAxis);
      
        this.plot.append("text")
          .attr("text-anchor", "end")
          .attr("x", this.width /2)
          .attr("y", this.height - 20)
          .style("font-size", 15)
          .text("Date (Years)");
        
      this.plot.append("g")
          .attr("class", "y axis")
          .call(yAxis)  
          
      this.plot.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -this.margin.left + 11)
        .attr("x", -this.height /2 + 80 )
        .style("font-size", 15)
        .text("Temperature (°C)")
  }
  /**
   * This will create the line using the intial data.
   */
  addLine() {

    //find first data column
    const First = this.allGroup[1]
    const Initial = this.data.map(function(d){return {time: d.time, value:d[First]} })

    //create line and append it
    this.line = this.plot
        .append('path')
        // use data stored in `this`
        .datum(Initial)
        .classed('line',true)
        .attr('d',d3.line()
         .x(d => this.xScale(+d.time))
         .y(d => this.yScale(+d.value)))
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .style("fill", "none")
}
/**
 * This will create the points using the intial data.
 */
addDots(){
  //find first data column
  const First = this.allGroup[1]
  const Initial = this.data.map(function(d){return {time: d.time, value:d[First]} })

  //create points and append them
  this.dot = this.plot
    .selectAll("circle")
    .data(Initial)
    .enter()
    .append("circle")
      .attr("cx", (d => this.xScale(+d.time)))
      .attr("cy", (d => this.yScale(+d.value)))
      .attr("r", 5)
      .style("fill", "#69b3a2")
      .on("mouseover",this.mouseover)
      .on("mousemove",this.mousemove)
      .on("mouseleave",this.mouseleave)

}
/**This will create tooltips for the points, these will act as labels when the points are moused over */
addTooltip(){

  //create tooltips
  const Tooltip = d3.select("#my_dataviz")
  .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-color", "#d3d3d3")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "10px")

    // Functions that change the tooltip when user hover / move / leave a cell
    this.mouseover = function(d) {
      Tooltip
        .style("opacity", 1)
    }
    this.mousemove = function(d) {
      Tooltip
        .html( "Date:" + d.time + "<br/>" + "Temperature:" + d.value + "°C")
        .style("top", (d3.event.pageY + 16) + "px")
        .style("left", (d3.event.pageX + 16) + "px");
        d3.select(this).attr("r", 7).style("fill", "green");
    }
    this.mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
        d3.select(this).attr("r", 5).style("fill", "#69b3a2");
    }
}

/**
 * This will update the line and points when the slider is moved
 * @param {String} selectedGroup - This is the current slider option. 
 */
update(selectedGroup){

  //map the current column from slider onto a constant
  const dataFilter = this.data.map(function(d){return {time: d.time, value:d[selectedGroup]} })

  //create new line using the new data
  this.line
      .datum(dataFilter)
      .transition()
      .duration(1000)
      .attr("d", d3.line()
        .x(d => this.xScale(+d.time))
        .y(d => this.yScale(+d.value)))

  //create new points using the new data
  this.dot
    .data(dataFilter)
    .transition()
    .duration(1000)
      .attr("cx", (d => this.xScale(+d.time)))
      .attr("cy", (d => this.yScale(+d.value)))  

  }
  
}


