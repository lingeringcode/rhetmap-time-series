import {API_KEY} from "./credential.js"

const start = () => {
  // Initialize the JavaScript client library
  gapi.client.init({
    'apiKey': API_KEY,
    'discoveryDocs': ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  }).then(() => {
    return gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: "1GuECV6Ot60h-Qab3e9-KPaKLdgXB3reoyZgo3VTlO_w",
      range: 'Sheet1!A1:M18',
    })
  }).then((response) => {
    const writePriorPostings = (raw) => {
      let newList = []
      // rank by weeks
      raw.forEach(function(r){
        // loop thru list of dict objs
        // if week 1, append "NA"
        if (r["week"] == 1) {
          r["last_posting_total"] = "NA"
        }
        // if any other week, append previous weeks
        else if (r["week"] > 1) {
          // Loop thru full list and match job_year and previous week
          raw.forEach(function(row){
            if ( (row["job_year"] == r["job_year"]) && (row["week"] == (r["week"]-1))) {
              if (row["posting_total"] != 0) {
                r["last_posting_total"] = row["posting_total"];
              }
              // if no postings, then append previous weeks total
              else if (row["posting_total"] == 0) {
                r["last_posting_total"] = row["last_posting_total"];
              }
            }
          });
        }
      });
      return raw;
    }
    const writeRanks = (lwd) => {
      let w1 = [],w2 = [],w3 = [],w4 = [],w5 = [],w6 = [],w7 = [],w8 = [],w9 = [],w10 = [],w11 = [],w12 = [],w13 = [],w14 = [],w15 = [],w16 = [],w17 = [];

      // rank by weeks
      lwd.forEach(function(l){
        for (const [key, value] of Object.entries(l)) {
          let w;
          if (key == "week") {
            w = value;
            if (w == 1){
              w1.push(l);
            }
            else if (w == 2){
              w2.push(l);
            }
            else if (w == 3){
              w3.push(l);
            }
            else if (w == 4){
              w4.push(l);
            }
            else if (w == 5){
              w5.push(l);
            }
            else if (w == 6){
              w6.push(l);
            }
            else if (w == 7){
              w7.push(l);
            }
            else if (w == 8){
              w8.push(l);
            }
            else if (w == 9){
              w9.push(l);
            }
            else if (w == 10){
              w10.push(l);
            }
            else if (w == 11){
              w11.push(l);
            }
            else if (w == 12){
              w12.push(l);
            }
            else if (w == 13){
              w13.push(l);
            }
            else if (w == 14){
              w14.push(l);
            }
            else if (w == 15){
              w15.push(l);
            }
            else if (w == 16){
              w16.push(l);
            }
            else if (w == 17){
              w17.push(l);
            }
          }
        }
      });

      // send to get ranked per week
      let allWeeks = [w1,w2,w3,w4,w5,w6,w7,w8,w9,w10,w11,w12,w13,w14,w15,w16,w17];
      let rankedAllWeeks = [];
      for (let aa = 0; aa <= allWeeks.length-1; aa++) {
        for (let awi = 0; awi <= allWeeks[aa].length-1; awi++) {
          rankedAllWeeks.push(allWeeks[aa][awi]);
        }
      }
      return rankedAllWeeks;
    }
    const parsePromisedData = (r) => {
      // Parse the response data
      const loadedData = r.result.values;
      return loadedData;
    }
    // MULTILINE CHART //
    const paintDataViz = (data) => {
      // Define the dimensions of the SVG
      let svg = d3.select("#line-chart")
      let margin = {top: 0, right: 150, bottom: 50, left: 0}
      let width = svg.attr("width") - margin.left - margin.right
      let height = svg.attr("height") - margin.top - margin.bottom
      let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      // Define the x & y ranges and color scale
      let x = d3.scaleLinear().range([0, width])
      let y = d3.scaleLinear().range([height, 0])
      let z = d3.scaleOrdinal(d3.schemeAccent)

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
        return Number.isNaN(wkValue);
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
              let week = data[mp].wks.findIndex(firstNaN);
              return week;
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
              let lastMaxPost = findLastPost(data[mp].yr);
              let weekIndex = lastMaxPost - 1;
              let lmp = data[mp].wks[weekIndex];
              return lmp;
            }
          }
        }
      }
      // Retrieve year to add as ID to legend elements
      function addLegendID(d) {
        let yearID = d.substr(0, 4);
        return "legend-"+yearID;
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
            return y(Number.isNaN(d.postings) ? findMaxPost(d) : d.postings);
          });

      // Define the lines
      let line = d3.line()
          .curve(d3.curveBasis)
          .x(function(d) {
            return x( Number.isNaN(d.postings) ? findMaxLastWeek(d) : d.week);
          })
          .y(function(d) {
            return y(Number.isNaN(d.postings) ? findMaxPost(d) : d.postings);
          });

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
          .style("stroke", function(marketYears) { return z(marketYears.id); });

      // Append the area
      markYear.append("path")
          .attr("class", "area")
          .attr("d", function(marketYears) {
            return area(marketYears.values);
          })
          .style("fill", function(marketYears) { return z(marketYears.id); });

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
          .style("font", "14px sans-serif");

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
          let mouse = d3.mouse(this);
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
                    return d.postings;
                  }).right;
              let idx = bisect(d.values, xDate);
              let beginning = 0,
                  end = lines[i].getTotalLength(),
                  target = null;

              while (true){
                let target = Math.floor((beginning + end) / 2);
                let pos = lines[i].getPointAtLength(target);
                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
                }
                if (pos.x > mouse[0])      end = target;
                else if (pos.x < mouse[0]) beginning = target;
                else break; //position found
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

              // FIX THIS 'pos' var error
              // return "translate(" + mouse[0] + "," + pos.y +")";
            });
        });
    }
    const formatBarData = (loadedData) => {
      let listWeeksDicts = []
      // Header Row
      let headerRow = loadedData[0]
      let updatedHeaderRow = []
      let perYearData = []
      for (let h=0; h<=headerRow.length-1; h++) {
        // Append week number
        if (h == 0) {
          updatedHeaderRow.push("Week Number")
        }
        // Rename week start_date columns
        else if (h == 1) {
          updatedHeaderRow.push("Week Start Date")
        }
        // Skip the week num and week start date columns
        else if (h > 1) {
          let yearRow = {}
          yearRow.yr = headerRow[h]+"-"+String((Number(headerRow[h])+1))
          updatedHeaderRow.push( headerRow[h]+"-"+String((Number(headerRow[h])+1)) )

          let yearPostings = []
          for (let i=1; i<=loadedData.length-1; i++) {
            yearPostings.push(loadedData[i][h])
          }
          yearRow.wks = yearPostings
          perYearData.push(yearRow)
        }
      }

      // Skip header row and append data per week with year info
      for (let i=1; i<=loadedData.length-1; i++) {
        // weekly data without first 2 values
        for (let ii = 0; ii<=loadedData[i].length-1; ii++) {
          // Append year's weekly posting total
          if (ii > 1) {
            let newRow = {}
            newRow.week = loadedData[i][0]
            newRow.posting_total = Number(loadedData[i][ii])
            newRow.job_year = headerRow[ii]+"-"+String((Number(headerRow[ii])+1))
            listWeeksDicts.push(newRow)
          }
        }
      }

      // Start drawing multiline chart
      paintDataViz(perYearData)

      let rankedAllWeeks = writeRanks(listWeeksDicts)
      let fullWeeklyData = writePriorPostings(rankedAllWeeks)
      return fullWeeklyData;
    }
    // Paint racing bar chart
    const paintBarViz = (data) => {
      let svg = d3.select("#bar-chart").append("svg")
        .attr("width", 960)
        .attr("height", 600)
      let tickDuration = 2500
      let top_n = 12
      let height = 600
      let width = 960
      const margin = {
        top: 80,
        right: 0,
        bottom: 5,
        left: 0
      }
      let barPadding = (height-(margin.bottom+margin.top))/(top_n*5)
      let caption = svg.append('text')
        .attr('class', 'caption')
        .attr('x', width)
        .attr('y', height-5)
        .style('text-anchor', 'end')
        .html('Source: <a href="http://rhetmap.org/market-comparison/">rhetmap.org</a>')

      let week = 1
        data.forEach(d => {
          d.posting_total = +d.posting_total,
          d.last_posting_total = +d.last_posting_total,
          d.posting_total = isNaN(d.posting_total) ? 0 : d.posting_total,
          d.week = +d.week,
          d.colour = d3.hsl(Math.random()*360,0.75,0.75)
        });

      let weekSlice = data.filter(d => d.week == week && !isNaN(d.posting_total))
        .sort((a,b) => b.posting_total - a.posting_total)
        .slice(0, top_n);

      weekSlice.forEach(function(d,i) {
        d.rank = i;
      });

      let x = d3.scaleLinear()
        .domain([0, d3.max(weekSlice, function(d) {
            if (d.posting_total > 0) { return d.posting_total }
            else if (d.posting_total == 0) { return 0 }
          })]
        )
        .range([margin.left, width-margin.right-65]);

      let y = d3.scaleLinear()
        .domain([top_n, 0])
        .range([height-margin.bottom, margin.top]);

      let xAxis = d3.axisTop()
        .scale(x)
        .ticks(width > 500 ? 5:2)
        .tickSize(-(height-margin.top-margin.bottom))
        .tickFormat(d => d3.format(',')(d));

      svg.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxis)
        .selectAll('.tick line')
        .classed('origin', d => d == 0);

      //Initial bar declaration
      svg.selectAll('rect.bar')
        .data(weekSlice, d => d.job_year)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0)+1) //Initial x decl
        .attr('width', function(d){
          let increment = x(d.posting_total)-x(0)-1;
          if (increment > 0) { return increment }
          else if (increment <= 0) { return 0 }
        })
        .attr('y', d => y(d.rank)+5)
        .attr('height', y(1)-y(0)-barPadding)
        .style('fill', d => d.colour);

      svg.selectAll('text.label')
        .data(weekSlice, d => d.job_year)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.posting_total)-8) //changes x position of job_year label
        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
        .style('text-anchor', 'end')
        .html(d => d.job_year);

      svg.selectAll('text.valueLabel')
        .data(weekSlice, d => d.job_year)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => x(d.posting_total)+5)
        .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
        .text(d => d.posting_total);

      let weekText = svg.append('text')
        .attr('class', 'weekText')
        .attr('x', width-margin.right)
        .attr('y', height-25)
        .style('text-anchor', 'end')
        .html("Week "+week)
        .call(halo, 10);

      let ticker = d3.interval(e => {

        weekSlice = data.filter(d => d.week == week && !isNaN(d.posting_total))
          .sort((a,b) => b.posting_total - a.posting_total)
          .slice(0,top_n);

        weekSlice.forEach(function(d,i) {
          d.rank = i;
        });

        x.domain([0, d3.max(weekSlice, d => d.posting_total)]);

        svg.select('.xAxis')
          .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .call(xAxis);

          let bars = svg.selectAll('.bar').data(weekSlice, d => d.job_year);

          bars
            .enter()
            .append('rect')
            .attr('class', d => `bar ${d.job_year.replace(/\s/g,'_')}`)
            .attr('x', x(0)+1)
            .attr( 'width', function(d) {
              if (d.posting_total != 0) {
                return x(d.posting_total)-x(0)-1
              }
              else if (d.posting_total == 0) {
                return x(d.last_posting_total)-x(0)
              }
            })
            .attr('y', d => y(top_n+1)+5)
            .attr('height', y(1)-y(0)-barPadding)
            .style('fill', d => d.colour)
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('y', d => y(d.rank)+5);

          bars
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('width', function(d) {
                if (d.posting_total != 0) {
                  return x(d.posting_total)-x(0)-1
                }
                else if (d.posting_total == 0) {
                  return x(d.last_posting_total)-x(0)
                }
              })
              .attr('y', d => y(d.rank)+5);

          bars
            .exit()
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('width', d => x(d.posting_total)-x(0)-1)
              .attr('y', d => y(top_n+1)+5)
              .remove();

          let labels = svg.selectAll('.label').data(weekSlice, d => d.job_year);

          labels
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', function(d) {
              if (d.posting_total != 0){
                return x(d.posting_total)-8
              }
              if (d.posting_total == 0){
                return x(d.posting_total)
              }
            })
            .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
            .style('text-anchor', 'end')
            .html(d => d.job_year)
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);


          labels
            .transition()
            .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('x', function(d) {
                if (d.posting_total != 0){
                  return x(d.posting_total)-8
                }
                if (d.posting_total == 0){
                  return x(d.posting_total)
                }
              })
              .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

          labels
            .exit()
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('x', function(d) {
                if (d.posting_total != 0){
                  return x(d.posting_total)-8
                }
                if (d.posting_total == 0){
                  return x(d.posting_total)
                }
              })
              .attr('y', d => y(top_n+1)+5)
              .remove();

          let valueLabels = svg.selectAll('.valueLabel').data(weekSlice, d => d.job_year);

          valueLabels
            .enter()
            .append('text')
            .attr('class', 'valueLabel')
            .attr('x', function(d) {
              if (d.posting_total != 0){
                return x(d.posting_total)-5
              }
              if (d.posting_total == 0){
                return x(d.posting_total)
              }
            })
            .attr('y', d => y(top_n+1)+5)
            .text(d => Number(d.last_posting_total))
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

          valueLabels
            .transition()
              .duration(tickDuration)
              .ease(d3.easeLinear)
              .attr('x', d => x(d.posting_total)+5)
              .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
              .tween("text", function(d) {
                if (!isNaN(d.last_posting_total) && (d.posting_total != 0)
                  && (d.last_posting_total != 0)) {
                    let i = d3.interpolateRound(d.last_posting_total, d.posting_total);
                    return function(t) {
                      this.textContent = d3.format(',')(i(t));
                    };
                }
                else if (!isNaN(d.last_posting_total) && (d.posting_total == 0)
                  && (d.last_posting_total == 0)) {
                  let i = d3.interpolateRound((d.last_posting_total+d.last_posting_total), d.posting_total);
                  // return function(t) {
                  //   this.textContent = d3.format(',')(i(t));
                  // };
                  return t
                }
              });

        valueLabels
          .exit()
          .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', function(d) {
              if (d.posting_total != 0){
                return x(d.posting_total)-8
              }
              if (d.posting_total == 0){
                return x(d.posting_total)
              }
            })
            .attr('y', d => y(top_n+1)+5)
            .remove();

        weekText.html("Week "+week);

        if(week == 17) ticker.stop();
        week = week+1;
      }, tickDuration);
    }
    const halo = function(text, strokeWidth) {
      text.select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this); })
          .style('fill', '#ffffff')
          .style( 'stroke','#ffffff')
          .style('stroke-width', strokeWidth)
          .style('stroke-linejoin', 'round')
          .style('opacity', 1);
    }

    // START PROCESS
    const loadedData = parsePromisedData(response)
    let fwyd = formatBarData(loadedData)
    paintBarViz(fwyd)

  }).catch((err) => {
  	console.log(err.error.message)
  })
}

// Load the JavaScript client library
gapi.load('client', start);
