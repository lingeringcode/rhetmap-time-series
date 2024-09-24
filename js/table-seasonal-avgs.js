export function tabulatedSeasonalAvgs(data) {
  const tableHead = document.querySelector("#seasonal-avgs-head")
  const tableBody = document.querySelector("#tabulated-seasonal-avgs")
  const tdClass = "fifteen"

  // Create rows
  for (let i=0; i<data.length; i++) {
    // Header Row
    if (i == 0) {
      const year = document.createTextNode(data[i][1])
      const posts = document.createTextNode(data[i][2])
      const percentagePosts = document.createTextNode(data[i][3])

      let newRow = document.createElement("tr")
      let yearCell = document.createElement("th", { className: tdClass })
      let postCell = document.createElement("th", { className: tdClass })
      let percentageCell = document.createElement("th", { className: tdClass })

      // Add values to cells
      yearCell.appendChild(year)
      postCell.appendChild(posts)
      percentageCell.appendChild(percentagePosts)

      // Append cells to new row
      newRow.appendChild(yearCell)
      newRow.appendChild(postCell)
      newRow.appendChild(percentageCell)

      // Append to table
      tableHead.appendChild(newRow)
    }
    // Data Rows
    else {
      const year = document.createTextNode(data[i][1])
      const posts = document.createTextNode(data[i][2])
      const percentagePosts = document.createTextNode(data[i][3])

      let newRow = document.createElement("tr")
      let yearCell = document.createElement("td", { className: tdClass })
      let postCell = document.createElement("td", { className: tdClass })
      let percentageCell = document.createElement("td", { className: tdClass })

      // Add values to cells
      yearCell.appendChild(year)
      postCell.appendChild(posts)
      percentageCell.appendChild(percentagePosts)

      // Append cells to new row
      newRow.appendChild(yearCell)
      newRow.appendChild(postCell)
      newRow.appendChild(percentageCell)

      // Append to table
      tableBody.appendChild(newRow)
    }
    
  }
  // data.forEach(row => {
    
  // })
}