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
        resolve(JSON.parse(xhr.responseText));
      } else {
        console.warn('request_error')
      }
    }

    xhr.open('GET', rurl)
    xhr.send()
  });
}
