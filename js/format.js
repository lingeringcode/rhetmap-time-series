import { paintMultiLineViz } from './multiline-chart.js';

export let EXISTING

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
  let rankedAllWeeks = [];
  for (let aa = 0; aa <= allWeeks.length-1; aa++) {
    for (let awi = 0; awi <= allWeeks[aa].length-1; awi++) {
      rankedAllWeeks.push(allWeeks[aa][awi]);
    }
  }
  return rankedAllWeeks;
}

export function formatBarData(data) {
  // Instantiate arrays for racing-bar week data
  let list_week_dicts = []
  let fullWeeklyData = []

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

export function formatMultiLineData(data) {
  let week

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
    
    paintMultiLineViz(yrData)

    EXISTING = yrData[yrData.length - 1].wks    
  }
}