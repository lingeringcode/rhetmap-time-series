import { getSSD } from './getdata.js';
import { formatBarData,formatMultiLineData } from './format.js';
import { paintBarViz } from './racing-bars.js';
import { paintPredictChart } from './predict-chart.js';

async function drawCharts() {
  let fwyd

  // 1. Access data
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

  function isolateAverage(data) {
    // Get length of JSON object
    let length = 0
    for(let k in data.feed.entry) if(data.feed.entry.hasOwnProperty(k)) length++
    // Assign average total percentages of posts after Jan. 1
    let AVG_POSTS = Number(data.feed.entry[length-1].gsx$postpercentagebywk17.$t)

    paintPredictChart(AVG_POSTS)
  }
  
  /**
   * Use Promises too retrieve the spreadsheet data
   */
  getSSD(mcURL).then(
      data => {
        fwyd = formatBarData(data)
        paintBarViz(fwyd)
        
        formatMultiLineData(data)

        // Now retrieve data for prediction chart
        getSSD(apURL).then(apData => isolateAverage(apData))
      }
    )
}
drawCharts()
