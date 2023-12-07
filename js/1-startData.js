import {paintBarViz} from "./racing-bars.js"
import {paintMultiLineViz} from "./multiline-chart.js"
import {getSSD,parseHTMLTableElem,writePriorPostings,writeRanks,formatBarData} from "./utils/utils.js"


const drawCharts = () => {
  // Initialize the JavaScript client library
  // getSSD()
  fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vT-SC1t5Qj4FnVTDw7sj2uJFds1IFEEObSMpcGHbFIqoaw2KOJOcOE4cFPgxokU5DGZByoaHwBUt94L/pub?gid=0&single=true&output=csv').then((response) => {
    return response.blob()
  }).then((blob) => {
    return blob.text()
  }).then((csvString) => {
    let csv = Papa.parse(csvString).data
    return csv
  }).then((csvStructuredData) => {
    // START PROCESSING
    let listPerYearAndWeeklyData = formatBarData(csvStructuredData)
    return listPerYearAndWeeklyData
  }).then((listOfData) => {
    // Start drawing charts
    paintMultiLineViz(listOfData[0])
    paintBarViz(listOfData[1])
  }).catch((err) => {
  	console.log(err)
  })
}
drawCharts()
