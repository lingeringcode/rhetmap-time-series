# From data feed to data viz: Reviewing the rewriting of the tabulated data

In the ordered list below, I review the major changes in the way the data was originally structured as tabulated information. Be sure to note how Ridolfo's data is written as a typical spreadsheet, which follows the standard rows and columns structure. In the second list item, note how the spreadsheet is reformatted as a JSON (JavaScript Object Notation). Then, be sure to note how I revise the data from its original format, using the JavaScript programming language. I use the first year (2012-2013) as a running example throughout the list below, as well as console logs which I review in the video:

1. In the below image, this is how Ridolfo has structured the data in a table format: <br /><img style="width:60%" src="images/google-sheets-market-comparison.png" />
2. In the <code>getData()</code> function (lines 38-740, I retrieve the spreadsheet data in the JSON feed format. Note that this JSON feed includes data specific to the application data, which helps render the details of the user-interface rendering of Ridolfo's original table. Conseqeuntly, it includes far more information than I need; hence, the data processing work to follow. <br /><img style="width:60%" src="images/google-rhetmap-json.png" />
3. At the start of the <code>formatData()</code>, inside the <code>for</code> loop <small>(lines 152-184)</small>, I write the <code>yr1213wks</code> and other weekly data per year formats:<br /><br /><code>["68", "83", "95", "113", "123", "134", "149", "155", "167", "176", "184", "193", "196", "198", "201", "205", "205"]</code>.<br /><br />
4. In <code>writeYears()</code> <small>(lines 115-148)</small>, I write the <code>yr1213</code> and other year data formats:<br /><br /><code>{yr: "2012 - 2013", wks: ["68", "83", "95", ...] }</code>.<br /><br />
  <pre>
{
      yr: "2012 - 2013",
      wks: ["68", "83", "95", "113", "123", "134", ...]
}
  </pre>
5. In <code>writeMarketData()</code> <small>(lines 187-196)</small>, I write the <code>yrData</code> format:<br /><br /><code>[ { yr:"", wks:{...} }, { yr:"", wks:{...} }, ... ]</code>.<br /><br />
  <pre>[
    0: {
      yr: "2012 - 2013",
      wks: {
        0: "68",
        1: "83",
        2: "95",
        3: "113",
        ...
      }
    },
    1: {
      yr: "2013 - 2014",
      wks: {
        0: "61",
        1: "77",
        2: "91",
        3: "103",
        ...
      }
    }
    ...
  ]
  </pre>
