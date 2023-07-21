import { EXISTING } from './format.js';

export function paintPredictChart(AVG_POSTS) {
  let isItNaN = (maybeNaN) => maybeNaN!=maybeNaN
  let postTracker = 0

  // Check what week it is; Return week number
  function checkCurrentWeek(e) {
    let weekCheck = []
    for (let i = 0; i <= e.length-1; i++) {
      if (isItNaN(e[i]) != true) {
        weekCheck.push(i)
      }
    }
    let wcCount = weekCheck.length

    return wcCount
  }

  let currentWeekCount = checkCurrentWeek(EXISTING)

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

    let PT = Math.round( (W17 * (1 - AVG_POSTS))) + W17
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