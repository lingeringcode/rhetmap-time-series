export function paintMultiLineViz(data) {

  // Define the dimensions of the SVG
  let svg = d3.select("#line-chart"),
    margin = {top: 0, right: 150, bottom: 50, left: 0},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // Define the x & y ranges and color scale
  let x = d3.scaleLinear().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeBrBG[data.length])

  /*

  * Below are 3 functions that help the subsequently
  * written d3.line() method. FYI, JS requires that
  * such functions be written before their use in the
  * code.

  * firstNaN: Find and return first instance
  * of NaN (empty spreadsheet cell value) in
  * an array, which will be from the new
  * market year.

  */
  function firstNaN(wkValue) {
    return Number.isNaN(wkValue)
  }

  /*
  * findMaxLastWeek: Find and return last posting,
  * which helps year, which has cell values with
  * no value yet.
  */
  function findMaxLastWeek(d) {
    for (let mp = 0; mp <= data.length - 1; mp++) {
      for (let mw = 0; mw <= data[mp].wks.length - 1; mw++) {
        // Find first NaN instance and return it if TRUE
        if ( Number.isNaN(data[mp].wks[mw]) ) {
          let week = data[mp].wks.findIndex(firstNaN)
          return week
        }
      }
    }
  }

  // Returns last available posting count
  function findMaxPost(d) {
    // Returns last week for its index
    function findLastPost(yr) {
      for (let i = 0; i <= data.length - 1; i++) {
        if (data[i].yr == yr) { // Get year with NaN
          for (let j = 0; j <= data[i].wks.length - 1; j++) {
            let key = data[i].wks.findIndex(firstNaN);
            return key;
          }
        }
      }
    }
    for (let mp = 0; mp <= data.length - 1; mp++) {
      for (let mw = 0; mw <= data[mp].wks.length - 1; mw++) {
        if ( Number.isNaN(data[mp].wks[mw]) ) {
          let lastMaxPost = findLastPost(data[mp].yr)
          let weekIndex = lastMaxPost - 1
          let lmp = data[mp].wks[weekIndex]
          return lmp
        }
      }
    }
  }

  // Retrieve year to add as ID to legend elements
  function addLegendID(d) {
    let yearID = d.substr(0, 4)
    return "legend-"+yearID
  }
  /*
    * Define x & y values for each line and its area
    * Hacky solutions for NaNs: findMaxLastWeek() & findMaxPost()
  */
  // Define the areas for each line
  let area = d3.area()
      .curve(d3.curveBasis)
      .x(function(d) {
        return x( Number.isNaN(d.postings) ? findMaxLastWeek(d) : d.week);
      })
      .y0(height)
      .y1(function(d) {
        return y(Number.isNaN(d.postings) ? findMaxPost(d) : d.postings)
      });

  // Define the lines
  let line = d3.line()
      .curve(d3.curveBasis)
      .x(function(d) {
        return x( Number.isNaN(d.postings) ? findMaxLastWeek(d) : d.week)
      })
      .y(function(d) {
        return y(Number.isNaN(d.postings) ? findMaxPost(d) : d.postings)
      })

  /*
    Format data for drawing. This is where
    the processed data really shines to create
    the multiple lines for each year. :-)
  */
  let marketYears = data.map(function(d) {
    let wkD = d.wks;
    let week = 0;
    return {
      id: d.yr,
      values: wkD.map(function(f) {
        if (parseInt(f) == 0){
          return { week: week+=1, postings: Number.NaN };
        } else {
          return { week: week+=1, postings: f };
        }
      })
    };
  });

  console.log(marketYears)

  // Set the domains of the axes
  x.domain([
    parseInt(marketYears[0].values[0].week),
    parseInt(marketYears[marketYears.length - 1].values[marketYears[marketYears.length - 1].values.length - 1].week)
  ]);

  y.domain([
    d3.min(marketYears, function(c) { return 0; }),
    d3.max(marketYears, function(c) { return d3.max(c.values, function(d) { return parseInt(d.postings)+20; }); })
  ]);

  z.domain(marketYears.map(function(c) { return c.id; }));

  // Define the legend
  let legend = svg.selectAll('g')
    .data(marketYears, function(d){ return d; })
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr("id", function(d){
      return addLegendID(d.id);
    });

  legend.append('rect')
    .attr('x', width - 20)
    .attr('y', function(d, i) {
      return (i * 20) - 4;
    })
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', function(d) {
      return z(d.id);
    });

  legend.append('text')
    .attr('x', width - 8)
    .attr('y', function(d, i) {
      return (i * 20) + 5;
    })
    .text(function(d) {
      return d.id+": ";
    });

  d3.selectAll(".legend")
    .attr("transform", "translate(-875,5)");

  // Draw axes
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("y", 15)
      .attr("x", 15)
      .attr("dy", "2.5em")
      .attr("fill", "#000")
      .text("Weeks");

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("dy", "2.5em")
      .attr("fill", "#000")
      .text("Postings");

  let markYear = g.selectAll(".markYear")
    .data(marketYears)
    .enter().append("g")
      .attr("class", "markYear");

  // Append line
  markYear.append("path")
      .attr("class", "area")
      .attr("class", "line")
      .attr("d", function(marketYears) {
        return line(marketYears.values);
      })
      .style("stroke", function(marketYears) { 
        return z(marketYears.id)
      })

  // Append the area
  markYear.append("path")
      .attr("class", "area")
      .attr("d", function(marketYears) {
        return area(marketYears.values);
      })
      .style("fill", function(marketYears) { 
        return z(marketYears.id) 
      })

  // Create labels
  markYear.append("text")
      .datum(function(d) {
        return {
          id: d.id,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function(d) {
        return "translate("
                  + x( Number.isNaN(d.value.postings) ? findMaxLastWeek(d) : d.value.week )
                  + ","
                  + y( Number.isNaN(d.value.postings) ? findMaxPost(d) : d.value.postings) + ")";
      })
      .attr("x", 50)
      .attr("dy", "0.5em")
      .style("font", "14px sans-serif")

  /**
  *
  *   Mouseover line and circle effect
  *   Modified from src: http://stackoverflow.com/questions/34886070/multiseries-line-chart-with-mouseover-tooltip/34887578#34887578
  *
  **/
  let mouseG = svg.append("g")
    .attr("class", "mouse-over-effects");

  mouseG.append("path") // this is the black vertical line to follow mouse
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  let lines = document.getElementsByClassName('line');

  let mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(marketYears)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

  mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", function(d) {
      return z(d.postings);
    })
    .style("fill", "none")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");

  mousePerLine.append("text");

  mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
    .attr('width', width) // can't catch mouse events on a g element
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('mouseout', function() { // on mouse out hide line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "0");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "0");
    })
    .on('mouseover', function() { // on mouse in show line, circles and text
      d3.select(".mouse-line")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line circle")
        .style("opacity", "1");
      d3.selectAll(".mouse-per-line text")
        .style("opacity", "1");
    })
    .on('mousemove', function() { // mouse moving over canvas
      let mouse = d3.mouse(this)
      let pos
      d3.select(".mouse-line")
        .attr("d", function() {
          let d = "M" + mouse[0] + "," + height;
          d += " " + mouse[0] + "," + 0;
          return d;
        });

      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {

          let xDate = x.invert(mouse[0]),
              bisect = d3.bisector(function(d) {
                return d.postings
              }).right
              let idx = bisect(d.values, xDate)

          let beginning = 0,
              end = lines[i].getTotalLength(),
              target = null

          while (true){
            target = Math.floor((beginning + end) / 2)
            pos = lines[i].getPointAtLength(target)
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break
            }
            if (pos.x > mouse[0])      end = target
            else if (pos.x < mouse[0]) beginning = target
            else break //position found
          }

          // Add mouseover label
          legend.select('text')
            .text(function(d) {
              let weekNum = xDate.toFixed(0);
              let postNum = d.values[(parseInt(xDate.toFixed(0))-1)].postings;
              let yrID = d.id;
              let label;

              if (Number.isNaN(postNum)) {
                label = yrID
                          +': Week: '
                          +weekNum
                          +', Postings: '
                          +'N/A';
              } else {
                label = yrID
                          +': Week: '
                          +weekNum
                          +', Postings: '
                          +postNum;
              }

              return label;
            })
            .attr("transform", function(d) {
              let weekNum = d.values[(parseInt(xDate.toFixed(0))-1)].week;
              return "translate(5,0)";
            });

          return "translate(" + mouse[0] + "," + pos.y +")"
        });
    });
}