// Parse HTML table element to JSON array of objects
export function parseHTMLTableElem(tableEl, expectingHeaderRow) {

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

export function getSSD(rurl) {
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
