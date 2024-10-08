import {paintBarViz} from "./racing-bars.js"
import {paintMultiLineViz} from "./multiline-chart.js"
import {paintPredictChart} from "./predict-chart.js"
import {tabulatedSeasonalAvgs} from "./table-seasonal-avgs.js"
import {parseHTMLTableElem,writePriorPostings,writeRanks,formatBarData} from "./utils/utils.js"


const drawCharts = () => {
  // Fetch the data
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
    paintBarViz(listOfData[1])
    paintMultiLineViz(listOfData[0])
    // paintPredictChart(listOfData[0])
  }).catch((err) => {
  	console.log(err)
  })

  // Tabulated seasonal summary stats
  fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vT-SC1t5Qj4FnVTDw7sj2uJFds1IFEEObSMpcGHbFIqoaw2KOJOcOE4cFPgxokU5DGZByoaHwBUt94L/pub?gid=568311789&single=true&output=csv').then((response) => {
    return response.blob()
  }).then((blob) => {
    return blob.text()
  }).then((csvString) => {
    let csv = Papa.parse(csvString).data
    return csv
  }).then((csvStructuredData) => {
    // START PROCESSING
    tabulatedSeasonalAvgs(csvStructuredData)
    console.log(csvStructuredData)
    // let listPerYearAndWeeklyData = formatBarData(csvStructuredData)
    // return listPerYearAndWeeklyData
  }).catch((err) => {
  	console.log(err)
  })
  // .then((listOfData) => {
  //   // Start drawing charts
  //   paintBarViz(listOfData[1])
  //   paintMultiLineViz(listOfData[0])
  //   // paintPredictChart(listOfData[0])
  // }).catch((err) => {
  // 	console.log(err)
  // })

}
drawCharts()
