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

let isNaN = (maybeNaN) => maybeNaN!=maybeNaN

function countFeedLength(e) {
  let length = 0
  for(let k in e) if(e.hasOwnProperty(k)) length++;
  return length
}

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
  let list_week_dicts = []
  let fullWeeklyData = []

  let entries = data.feed.entry

  let colNames = returnColumnNames(String(entries[0].content.$t))

  entries.forEach( e => {
    let jy = 2012
    colNames.forEach( c => {
      let jyString = jy+'-'+(jy+1)
      jyString = String(jyString)

      if (isNaN(e[c].$t) == true) {
        let row = {
          week: (e.gsx$_cn6ca.$t).slice(5,7), 
          job_year: jyString, 
          posting_total: NaN
        }
        list_week_dicts.push(row)
      }
      else {
        let row = {
          week: (e.gsx$_cn6ca.$t).slice(5,7), 
          job_year: jyString, 
          posting_total: e[c].$t
        }
        list_week_dicts.push(row)
      }
      jy++
    })
  })

  let rankedAllWeeks = writeRanks(list_week_dicts)
  fullWeeklyData = writePriorPostings(rankedAllWeeks)

  return fullWeeklyData
}

export function formatMultiLineData(data) {
  
  let length = countFeedLength(data.feed.entry)

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