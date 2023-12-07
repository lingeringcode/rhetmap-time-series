// Parse HTML table element to JSON array of objects
export const parseHTMLTableElem = (tableEl, expectingHeaderRow) => {

	let columns = Array.from( tableEl.querySelectorAll('th')).map( it => it.textContent)
	let rows = Array.from( tableEl.querySelectorAll('tbody > tr'))

	// must check for table that has no th cells, but only if we are told to "expectingHeaderRow"
	if (columns.length == 0 && expectingHeaderRow) {
		// get columns for a non-th'd table
		columns = Array.from( tableEl.querySelectorAll('tbody > tr')[0].children ).map(it => it.textContent)
		// must remove first row as it is the header
		rows.shift()
	}

	const returnJson = {
		'headers': columns,
		'rows': rows.map(row => {
			const cells = Array.from( row.querySelectorAll('td'))
			return columns.reduce((obj, col, idx) => {
				obj[ col ] = cells[ idx ].textContent
				return obj
			}, {})
		})
	}

	// if we were expecting a header row with th cells lets see if we got it
	// if we got nothing lets try looking for a regular table row as the header
	if (!expectingHeaderRow && returnJson.headers.length == 0 && (returnJson.rows[ 0 ] && Object.keys( returnJson.rows[ 0 ] ).length === 0)) {
		return parseHTMLTableElem( tableEl, true )
	}
	return returnJson
}

export const getSSD = (rurl) => {
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
        // Parse HTML and convert to JSON
        resolve(JSON.parse(xhr.responseText));
      } else {
        console.warn(xhr, 'request_error')
      }
    }

    xhr.open('GET', rurl)
    xhr.send()
  })
}

export const formatBarData = (loadedData) => {
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
  // paintDataViz(perYearData)

  let rankedAllWeeks = writeRanks(listWeeksDicts)
  let fullWeeklyData = writePriorPostings(rankedAllWeeks)
  return [perYearData, fullWeeklyData]
}

export const writePriorPostings = (raw) => {
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

export const writeRanks = (lwd) => {
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
