let mcData,AVG_POSTS,EXISTING
let postTracker = 0
// Instantiate arrays for racing-bar week data
let list_week_dicts = []
let fullWeeklyData = []

////////////////////////////////////////////////////////////
//////////// Get the Google sheet data /////////////////////
////////////////////////////////////////////////////////////

function getSSD(rurl) {

  /**
   *  Define and instantiate a request object
   *  for spreadsheet data
   *  For more info, research "javascript http request objects"
   */
  let xhr = new XMLHttpRequest()

  /**
   * Return a Promise object for asynchronous
   * call for the data, i.e., don't do anything
   * else until the data has been returned.
   */
  return new Promise((resolve, reject) => {

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState !== 4) {
        return
      }

      if (xhr.status === 200) {
        console.log("Retrieved spreadsheet data.\n"
                  +"Parsed it as a JSON object:\n")
        resolve(JSON.parse(xhr.responseText));
      } else {
        console.warn('request_error')
      }
    }

    xhr.open('GET', rurl)
    xhr.send()
  });
}

// ID of the Google Spreadsheet
let marketComparisonID = "1GuECV6Ot60h-Qab3e9-KPaKLdgXB3reoyZgo3VTlO_w"
let avgPercentageSheetID = "132y3k_FJj4Gnf8cU0NtDa0eNhf77SlwiNq5GRPL4MRM"

/**
 * Assign URLs Make sure it is public and
 * set the sheet to 'Anyone with link can view'
 */
let mcURL = "https://spreadsheets.google.com/feeds/list/" 
            + marketComparisonID
            + "/od6/public/values?alt=json"
let apURL = "https://spreadsheets.google.com/feeds/list/" 
            + avgPercentageSheetID
            + "/1/public/values?alt=json"

/**
 * Use Promises too retrieve the spreadsheet data
 */
// getSSD(mcURL).then(mcData => formatBarData(mcData))
getSSD(mcURL).then(
    data => {
      let fwyd = formatBarData(data)
      paintBarViz(fwyd)
      formatMultiLineData(data)
    }
  )

function isolateAverage(data) {
  // Get length of JSON object
  let length = 0
  for(let k in data.feed.entry) if(data.feed.entry.hasOwnProperty(k)) length++
  // Assign average total percentages of posts after Jan. 1
  AVG_POSTS = Number(data.feed.entry[length-1].gsx$postpercentagebywk17.$t)
  paintPredictChart(AVG_POSTS)
}


////////////////////////////////////////////////////////////
//////////// Format the newly retrieved data ///////////////
////////////////////////////////////////////////////////////
function ranker(wk) {
  let listRankedWeeks = [];
  wk.sort(function(a, b) {
    return parseFloat(b.posting_total) - parseFloat(a.posting_total);
  });
  let rank = 1;
  for (let wi = 0; wi <= wk.length-1; wi++) {
    wk[wi]["rank"] = String(rank);
    listRankedWeeks.push(wk);
    rank++
  }
  return listRankedWeeks;
}

function writePriorPostings(raw) {
  newList = [];
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

function writeRanks(lwd) {
  let w1 = [];
  let w2 = [];
  let w3 = [];
  let w4 = [];
  let w5 = [];
  let w6 = [];
  let w7 = [];
  let w8 = [];
  let w9 = [];
  let w10 = [];
  let w11 = [];
  let w12 = [];
  let w13 = [];
  let w14 = [];
  let w15 = [];
  let w16 = [];
  let w17 = [];

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
  rankedAllWeeks = [];
  for (let aa = 0; aa <= allWeeks.length-1; aa++) {
    for (let awi = 0; awi <= allWeeks[aa].length-1; awi++) {
      rankedAllWeeks.push(allWeeks[aa][awi]);
    }
  }
  return rankedAllWeeks;
}

function formatBarData(data) {
  let entries = data.feed.entry;
  
  // Get length of JSON object
  let length = 0;
  for(let k in entries) if(entries.hasOwnProperty(k)) length++;

  // Put week data in array sorted by week
  for (let i = 0; i <= length - 1; i++) {
    const weekObject = entries[i];
    let index = 0;
    let wk = 0;
    for (const [key, value] of Object.entries(weekObject)) {
      if (index == 6) {//Week
          wk = (value.$t).slice(5,7);
          wk = Number(wk);
      }
      else if (index == 7){
        let job_year = "2012-2013";
        let posting_total = 0;
        if (!Number.isNaN(Number(value.$t))){
          posting_total = Number(value.$t);
          let entry = { week:wk, job_year:job_year, posting_total:posting_total};
          list_week_dicts.push(entry)
        }
      }
      else if (index == 8) {
        let jy2 = "2013-2014";
        if (!Number.isNaN(Number(value.$t))){
          let pt2 = Number(value.$t);
          let entry = { week:wk, job_year:jy2, posting_total:pt2};
          list_week_dicts.push(entry)
        }
      }
      else if (index == 9) {
        let jy3 = "2014-2015";
        if (!Number.isNaN(Number(value.$t))){
          let pt3 = Number(value.$t);
          let entry = { week:wk, job_year:jy3, posting_total:pt3};
          list_week_dicts.push(entry)
        }
      }
      else if (index == 10) {
        let jy4 = "2015-2016";
        if (!Number.isNaN(Number(value.$t))){
          let pt4 = Number(value.$t);
          let entry = { week:wk, job_year:jy4, posting_total:pt4};
          list_week_dicts.push(entry)
        }
      }
      else if (index == 11) {
        let jy5 = "2016-2017";
        if (!Number.isNaN(Number(value.$t))){
          let pt5 = Number(value.$t);
          let entry = { week:wk, job_year:jy5, posting_total:pt5};
          list_week_dicts.push(entry)
        }
      }
      else if (index == 12) {
        let jy6 = "2017-2018";
        if (!Number.isNaN(Number(value.$t))){
          let pt6 = Number(value.$t);
          let entry = { week:wk, job_year:jy6, posting_total:pt6};
          list_week_dicts.push(entry)
        }
      }
      else if (index == 13) {
        let jy7 = "2018-2019";
        if (!Number.isNaN(Number(value.$t))){
          let pt7 = Number(value.$t);
          let entry = { week:wk, job_year:jy7, posting_total:pt7};
          list_week_dicts.push(entry)
        }
      }
      else if (index == 14) {
        let jy8 = "2019-2020";
        if (!Number.isNaN(Number(value.$t))){
          let pt8 = Number(value.$t);
          let entry = { week:wk, job_year:jy8, posting_total:pt8};
          list_week_dicts.push(entry)
        }
      }
      else if (index == 15) {
        let jy9 = "2020-2021";
        if ( !Number.isNaN(Number(value.$t)) > 0) {
          let pt9 = Number(value.$t);
          let entry = { week:wk, job_year:jy9, posting_total:pt9};
          list_week_dicts.push(entry)
        }
      }

      index++
    }
  }
  let rankedAllWeeks = writeRanks(list_week_dicts)
  fullWeeklyData = writePriorPostings(rankedAllWeeks)

  return fullWeeklyData
}

function formatMultiLineData(data) {
  console.log("The requested spreadsheet data in the JSON format\n"
              +"has been passed as a parameter for the formatData function:\n");
  console.log(data);
  // Instantiate arrays for week data
  let yr1213wks = []
  let yr1314wks = []
  let yr1415wks = []
  let yr1516wks = []
  let yr1617wks = []
  let yr1718wks = []
  let yr1819wks = []
  let yr1920wks = []
  let yr2021wks = []

  // Instantiate dictionaries/object arrays for year data
  let yr1213 = {}
  let yr1314 = {}
  let yr1415 = {}
  let yr1516 = {}
  let yr1617 = {}
  let yr1718 = {}
  let yr1819 = {}
  let yr1920 = {}
  let yr2021 = {}

  // Get length of JSON object
  let length = 0;
  for(let k in data.feed.entry) if(data.feed.entry.hasOwnProperty(k)) length++;

  // Put week data in array sorted by market years
  for (let i = 0; i <= length - 1; i++) {
    // Start the writing of the first entries.
    if (i === 0) {
      week = data.feed.entry[i].gsx$_cn6ca.$t
      yr1213wks.push(data.feed.entry[i].gsx$justrc.$t)
      yr1314wks.push(data.feed.entry[i].gsx$rctbw.$t)
      yr1415wks.push(data.feed.entry[i].gsx$rctbw_2.$t)
      yr1516wks.push(data.feed.entry[i].gsx$rctbw_3.$t)
      yr1617wks.push(data.feed.entry[i].gsx$rctbw_4.$t)
      yr1718wks.push(data.feed.entry[i].gsx$rctbw_5.$t)
      yr1819wks.push(data.feed.entry[i].gsx$rctbw_6.$t)
      yr1920wks.push(data.feed.entry[i].gsx$rctbw_7.$t)
      /*
        For the new market year, check if cell's empty.
        If empty, type as NaN (Not A Number). If value
        exists, push the value to the array.
      */
      if (data.feed.entry[i].gsx$rctbw_8.$t === "") {
        yr2021wks.push(Number.NaN)
      }
      else {
        yr2021wks.push(data.feed.entry[i].gsx$rctbw_8.$t)
      }
    }
    // After first series of array entries, write the rest.
    else {
      week = data.feed.entry[i].gsx$_cn6ca.$t
      yr1213wks.push(data.feed.entry[i].gsx$justrc.$t)
      yr1314wks.push(data.feed.entry[i].gsx$rctbw.$t)
      yr1415wks.push(data.feed.entry[i].gsx$rctbw_2.$t)
      yr1516wks.push(data.feed.entry[i].gsx$rctbw_3.$t)
      yr1617wks.push(data.feed.entry[i].gsx$rctbw_4.$t)
      yr1718wks.push(data.feed.entry[i].gsx$rctbw_5.$t)
      yr1819wks.push(data.feed.entry[i].gsx$rctbw_6.$t)
      yr1920wks.push(data.feed.entry[i].gsx$rctbw_7.$t)
      /*
        For the new market year, check if cell's empty.
        If empty, type as NaN (Not A Number). If value
        exists, push the value to the array.
      */
      if (data.feed.entry[i].gsx$rctbw_8.$t === "") {
        yr2021wks.push(Number.NaN)
      }
      else {
        yr2021wks.push(data.feed.entry[i].gsx$rctbw_8.$t)
      }
    }
    console.log("Writing out the 17 weeks for each year.")
  }
  console.log("After the _for_ loop, here\'s an example array, yr1213wks:\n")
  console.log(yr1213wks)
  writeYears()

  /*
    Bind week arrays to market years.
    Note how I don't need to pass anything as an
    argument for writeYears(), since all of the
    necessary letiables have been declared within
    the scope of formatData(){...}.
  */
  function writeYears() {
    console.log("writeYears() binds the week arrays to market years.")
    yr1213 = {
      yr:"2012 - 2013",
      wks:yr1213wks
    };
    yr1314 = {
      yr:"2013 - 2014",
      wks:yr1314wks
    };
    yr1415 = {
      yr:"2014 - 2015",
      wks:yr1415wks
    };
    yr1516 = {
      yr:"2015 - 2016",
      wks:yr1516wks
    };
    yr1617 = {
      yr:"2016 - 2017",
      wks:yr1617wks
    };
    yr1718 = {
      yr:"2017 - 2018",
      wks:yr1718wks
    };
    yr1819 = {
      yr:"2018 - 2019",
      wks:yr1819wks
    };
    yr1920 = {
      yr:"2019 - 2020",
      wks:yr1920wks
    };
    yr2021 = {
      yr:"2020 - 2021",
      wks:yr2021wks
    };
    console.log("After writeYears is complete, here\'s an example object array that binds the year string label with the array list of the weekly posting data, yr1213:\n");
    console.log(yr1213);
    writeMarketData();
  }

  // Join all object arrays as one array object
  function writeMarketData() {
    // Define explicit data-types for per Year data
    let yrData = []
    yrData.push(yr1213,yr1314,yr1415,yr1516,yr1617,yr1718,yr1819,yr1920,yr2021)
    console.log("writeMarketData() combines all of the yearly object arrays into one complete object array, yrData:\n")
    console.log(yrData)
    console.log("\nNow, the data are processed and ready to send as an argument to paintDataViz().")
    paintDataViz(yrData)

    EXISTING = yrData[yrData.length - 1].wks
    // Now retrieve data for prediction chart
    getSSD(apURL).then(apData => isolateAverage(apData))
  }
}


////////////////////////////////////////////////////////////
//////////// Write and paint charts ////////////////////////
////////////////////////////////////////////////////////////

// BAR CHART //
function paintBarViz(data) {
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
  };

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

// LINE CHART //
function paintDataViz(data) {

  // Define the dimensions of the SVG
  let svg = d3.select("#line-chart"),
    margin = {top: 0, right: 150, bottom: 50, left: 0},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define the x & y ranges and color scale
  let x = d3.scaleLinear().range([0, width]),
      y = d3.scaleLinear().range([height, 0]),
      z = d3.scaleOrdinal(d3.schemeCategory20);

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
              idx = bisect(d.values, xDate);

          let beginning = 0,
              end = lines[i].getTotalLength(),
              target = null;

          while (true){
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
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

          return "translate(" + mouse[0] + "," + pos.y +")";
        });
    });
}

// PREDICTION CHART //
function paintPredictChart(AVG_POSTS) {

  // Check what week it is; Return week number
  function checkCurrentWeek(e) {
    let weekCheck = []
    for (let i = 0; i <= e.length-1; i++) {
      if (typeof e[i] === "string") {
        weekCheck.push(i)
      }
    }
    wcCount = weekCheck.length

    return wcCount
  }

  let currentWeekCount = checkCurrentWeek(EXISTING)

  //
  function range(start, end) {
    let ans = []
    for (let i = start; i <= end; i++) {
        ans.push({
          wk: Number(i)
        })
    }
    return ans
  }

  //
  let forecast = range((currentWeekCount+1), 39)
  let history = range(1, currentWeekCount)

  // Map array of EXISTING post numbers to week numbers
  function mapExistingWeeksToPosts(w,e) {
    for (let i = 0; i < w.length; i++) {
      if (Number(w[i].wk) <= 17) {
        w[i].posts = Number(e[i])
      }
    }
    return w
  }

  history = mapExistingWeeksToPosts(history, EXISTING)

  // Accrue posts linearly, based on average projection rate
  const predictor = (lastWeek, pwp, pt) => {
    postTracker = postTracker+pwp
    if (lastWeek != 39) {
      return postTracker
    }
    else {
      return pt
    }
  }

  // Map EXISTING data to history array of objects
  const historyIndex = history.map((d, i) => [i, d.posts])

  // If it's week 17, then create the chart
  if ( (historyIndex.length) == 17) {
    let W17 = historyIndex[historyIndex.length-1][1]

    PT = Math.round( (W17 * (1 - AVG_POSTS))) + W17
    // Per week posts for trendline simulation
    let PWP = Math.round( (W17 * (1 - AVG_POSTS))) / 23

    postTracker = W17

    forecast = forecast.map((d, i) => {
      return {
        wk: d.wk,
        posts: predictor(forecast[i].wk, PWP, PT),
      }
    })

    forecast.unshift(history[history.length - 1])

    let predictSection = document.querySelector("#prediction-chart")

    predictSection.innerHTML = '<h3>Based on the historical data, predict the number of job postings per week</h3><p>The chart below shows the approximate projected job postings for the remainder of the current job season: 17-39 weeks (dashed tomato-red line). It uses the average percentage of jobs posted by week 17 to project an endpoint visually.</p><svg id="trend-chart" viewBox="0 0 1000 500"></svg>'

    const chart = d3.select('#trend-chart')
    const forecastMargin = { top: 20, right: 20, bottom: 30, left: 70 }
    const forecastWidth = 1000 - forecastMargin.left - forecastMargin.right
    const forecastHeight = 500 - forecastMargin.top - forecastMargin.bottom
    const innerChart = chart.append('g')
      .attr('transform', `translate(${forecastMargin.left} ${forecastMargin.top})`)

    const x = d3.scaleLinear().rangeRound([0, forecastWidth])
    const y = d3.scaleLinear().rangeRound([forecastHeight, 0])

    const line = d3.line()
      .x(d => x(d.wk))
      .y(d => y(d.posts))

    x.domain([d3.min(history, d => d.wk), d3.max(forecast, d => d.wk)])
    y.domain([0, d3.max(forecast, d => d.posts)])

    innerChart.append('g')
      .attr('transform', `translate(0 ${forecastHeight})`)
      .call(d3.axisBottom(x))

    innerChart.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '1.5em')
      .attr('text-anchor', 'end')
      .text('Job postings')

    innerChart.append('path')
      .datum(history)
      .attr('fill', 'none')
      .attr('stroke', '#9467bd')
      .attr('stroke-width', 3)
      .attr('stroke-forecastWidth', 1.5)
      .attr('d', line)

    innerChart.append('path')
      .datum(forecast)
      .attr('fill', 'none')
      .attr('stroke', 'tomato')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '10,7')
      .attr('stroke-forecastWidth', 1.5)
      .attr('d', line)
  }
}