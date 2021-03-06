
/** Constant for the data which is being used
 * @param {URL} - the url of the data
 * */
const csvdata = new URL('https://raw.githubusercontent.com/nsilz44/ProgAssignment1/master/woodland_bird_species_trends_UK_1970_to_2014.csv');

/** class for the graph */
class Graph {
  /** defualt parameter for the data  */
    constructor (newdata) {
     /**  Sets size of margins
   * @param {number} top - margin size from top
   * @param {number} left - margin size from left
   * @param {number} right - margin size from right
   * @param {number} bottom - margin size from bottom
    */
   var margin = { top: 50, right: 300, bottom: 50, left: 50 };
   var width = 960 - margin.left - margin.right;
   var height = 500 - margin.top - margin.bottom;
    /** Sets the range of the x and y variable */
    var x = d3.scaleLinear()
        .range([width, 0]);
    var y = d3.scaleBand()
      .rangeRound([0, height]);
      /** appends svg to the body of the page */
  var svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    /** appends a group element to svg */
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    /** reads the csvdata */
    d3.csv(newdata).then(function (data) {
    /** formats the data */
      data.forEach(function (d) { d['Short term percentage change'] = +d['Short term percentage change']; });
    /** scales the range of the data in the domains */
      x.domain(d3.extent(data, function (d) { return d['Short term percentage change']; })).nice();
      y.domain(data.map(function (d) { return d.Species; }));
    /** appends the bars for the chart
     * @function "class" - determines whether data is negative or positive
     * @function "x" - determines where to place the x coordinate of bar
     * @function "y" - determines where to place the y coordinate of bar
     * @function "width" - determines width of bar
     * @function "height" - determines height of bar
    */
    svg.selectAll('.bar')
    .data(data)
  .enter().append('rect')
    .attr('class', function (d) { return 'bar bar--' + (d['Short term percentage change'] < 0 ? 'negative' : 'positive'); })
    .attr('x', function (d) { if (d['Short term percentage change'] < 0) return (x(0)); else return (x(d['Short term percentage change'])); })
    .attr('y', function (d) { return y(d.Species); })
    .attr('width', function (d) { return Math.abs(x(d['Short term percentage change']) - x(0)); })
    .attr('height', y.bandwidth());
    /** appends labels to ends of bars
     * @function "x" - determines x coordinate of label
     * @function "y" - determines y coordinate of label
     * @function .text - the text on the label
     */
    svg.selectAll('.text').data(data)
.enter().append('text')
.attr('class', 'label')
.attr('x', function (d) {
  if (d['Short term percentage change'] > 0) return (x(d['Short term percentage change'] + 3.5)); else return (x(d['Short term percentage change'] - 1));
})
.attr('y', function (d) { return y(d.Species); })
    .attr('dy', '.75em')
    .style('font-size', '12px')
    .text(function (d) { return d['Short term percentage change'] + '%'; });

    /** Formats the x axis ticks with a % at the end */
    var xAxis = d3.axisBottom(x)
    .tickFormat(function (d) { return d + '%'; });
    /** Formats the y axis */
    var yAxis = d3.axisLeft(y)
    .tickFormat(' ');
    /** Axis with the name of each species of woodland bird  */
    var rAxis = d3.axisRight(y);
    /** appends the x axis to svg */
    svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    /** append the y axis to svg */
    svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + x(0) + ',0)')
    .call(yAxis);

    /** appends the axis with species name to svg */
    svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + width + ',0)')
    .call(rAxis);
    /** Adds a label to the x axis */
    svg.append('text')
    .attr('x', -30 + width / 2)
    .attr('y', 440)
    .attr('text-anchor', 'middle')
    .text('Short term percentage change');
    /** Creates a heading */
    svg.append('text')
    .attr('x', (width / 2))
    .attr('y', -3)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Woodland bird species trends in the UK 2008 to 2014');
  });
}
}
/** Creates a graph using the url at the top */

// eslint-disable-next-line no-undef
PositiveNegativegraph = new Graph(csvdata);
