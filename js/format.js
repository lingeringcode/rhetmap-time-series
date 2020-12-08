import { paintMultiLineViz } from './multiline-chart.js';
import { drawAvgBars } from './avg-posts-per-week.js';

export let EXISTING

export const YEARS = [
  {yr: "2012-2013",wks:[]},
  {yr: "2013-2014",wks:[]},
  {yr: "2014-2015",wks:[]},
  {yr: "2015-2016",wks:[]},
  {yr: "2016-2017",wks:[]},
  {yr: "2017-2018",wks:[]},
  {yr: "2018-2019",wks:[]},
  {yr: "2019-2020",wks:[]},
  {yr: "2020-2021",wks:[]}
]

function writePriorPostings(raw) {
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
            r["last_posting_total"] = row["posting_total"]
          }
          // if no postings, then append previous weeks total
          else if (row["posting_total"] == 0) {
            r["last_posting_total"] = row["last_posting_total"]
          }
        }
      })
    }
  })
  return raw
}

function writeRanks(lwd) {
  let allWeeksList = []
  // Rank by weeks
  lwd.forEach(function(l){
    for (const [key, value] of Object.entries(l)) {
      let w
      if (key == "week") {
        w = value
        allWeeksList.push({
          week:w,
          rank:l.rank,
          colour:l.colour,
          job_year: l.job_year,
          last_posting_total: l.last_posting_total,
          posting_total: l.posting_total
        })
      }
    }
  })
  
  return allWeeksList
}

let isNaN = (maybeNaN) => maybeNaN!=maybeNaN

function getStandardDeviation(w) {
  let noNan = []
  w.forEach(r => {
    if (isNaN(r) != true) {
      noNan.push(r)
    }
  })
  const n = noNan.length
  const mean = noNan.reduce((a, b) => a + b) / n
  return Math.sqrt(noNan.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

/**
 * 1. Find posts difference between weeks, e.g., wk2-wk1
 *  
 */
function formatAvgBarData(weeklies) {
  let avgTallies = []
  
  // loop first week
  for (let i = 0; i < weeklies.length-1; i++) {
    // Loop through weeks
    let diffList = []
    if (i != weeklies[i].posts.length || i != 0) {

      for (let p = 0; p <= weeklies[i].posts.length-1; p++) {
        let diff = weeklies[i+1].posts[p] - weeklies[i].posts[p]
        diffList.push(diff)
      }

      let avg = 0
      diffList.forEach(diff => {
        if (isNaN(diff) != true) {
          avg = avg+diff
        }
      })

      avg = avg / diffList.length
      let stDev = getStandardDeviation(diffList)

      avgTallies.push({
        week: i+2,
        weekLabel: String(i+1)+'-'+String(i+2), 
        postDiff: avg,
        stDev: stDev
      })
    }
  }
  drawAvgBars(avgTallies)
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

  function returnColumnNames(str) {
    const regex = /(justrc\:|rctbw\:|rctbw_\d{1,}\:)/gm
    let colMatches = ((str || '').match(regex) || [])
    let cleanMatches = []

    // Clean matches
    colMatches.forEach(cm =>
      cleanMatches.push('gsx$'+cm.substring(0,cm.length-1))
    )
    return cleanMatches
  }
  
  let length = 0
  for(let k in data.feed.entry) if(data.feed.entry.hasOwnProperty(k)) length++;
  let totalNumberOfYears = returnColumnNames(String(data.feed.entry[0].content.$t))
  totalNumberOfYears = totalNumberOfYears.length

  function organizeAsPerYear(pw) {
    pw.forEach(p => {
      let pl = p.posts
      for (let i = 0; i <= pl.length-1; i++) {
        YEARS[i].wks.push(pl[i])
      }
    })
    paintMultiLineViz(YEARS)
    EXISTING = YEARS[YEARS.length - 1].wks
  }

  function organizePerWeek(data) {
    let wkData = []
    // Put week data in array sorted by market years
    for (let i = 0; i <= length - 1; i++) {
      let allColNamesPerWeek = returnColumnNames(String(data.feed.entry[i].content.$t))
      let week
      let posts = []
      for (let c = 0; c <= allColNamesPerWeek.length-1; c++) {
        week = String(i+1)
        let row = data.feed.entry[i]
        let col = allColNamesPerWeek[c]
        posts.push(Number(row[col].$t))
      }
      // Check posts length, before pushing to list
      if ( (totalNumberOfYears - posts.length) == 1) {
        // Add Nan, since week not complete for current year
        posts.push(NaN)
        wkData.push({
          wk:data.feed.entry[i].gsx$_cn6ca.$t,
          posts:posts
        })
      }
      else {
        // If week posted, push to main data
        wkData.push({
          wk:data.feed.entry[i].gsx$_cn6ca.$t,
          posts:posts
        })
      }
    }
    organizeAsPerYear(wkData)
    formatAvgBarData(wkData)// start creating average posts per week
  }
  organizePerWeek(data)
}