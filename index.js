(function () {

  const username = 'gassio'
  const githubToken = 'ea41eb5c55dfca4145456b9619c00f0be6da4982'

  var theData = {
    repo: ['tensorflow/tensorflow', 'twbs/bootstrap', 'microsoft/vscode'],    
    page: 0,
    perPage: 100,
  }

  var arrayToCSV = function (data, columnDelimiter, lineDelimiter) {
    let result, ctr, keys
  
    if (data === null || !data.length) {
      return null
    }
  
    keys = Object.keys(data[0])
  
    result = ""
    result += keys.join(columnDelimiter)
    result += lineDelimiter
  
    data.forEach(item => {
      ctr = 0
      keys.forEach(key => {
        if (ctr > 0) {
          result += columnDelimiter
        }
        
        if (typeof item[key] === "string" && item[key].includes(columnDelimiter)) {
          // Replaces the spaces in the Title with _
          if (key === 'TITLE') result += `"${item[key]}"`.split(' ').join('_')
          else result += `"${item[key]}"`
        } 
        else {
          // Replaces the spaces in the Title with _
          if (key === 'TITLE') result += item[key].split(' ').join('_')
          else result += item[key]
        }
        // Not used.
        // result += typeof item[key] === "string" && item[key].includes(columnDelimiter) ? `"${item[key]}"` : item[key]
        ctr++
      })
      result += lineDelimiter
    })
  
    return result
  }

  var createFile = function(content) {
    var myBlob = new Blob([content], {type: 'text/plain'});
    var url = window.URL.createObjectURL(myBlob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "githubtestapi.csv";
    anchor.click();
    window.URL.revokeObjectURL(url);
    document.removeChild(anchor);
  }

  var fetchAllEvents = function() {
    let totalPages = 100
    let jsonData = []
    
    let authString = `${username}:${githubToken}`

    let h = new Headers();
    h.append('Authorization', 'Basic ' + window.btoa('gassio:ea41eb5c55dfca4145456b9619c00f0be6da4982'))

    for (let k=0; k < totalPages; k++) {
      theData.page++

      fetch('https://api.github.com/repos/' + theData.repo[1] + '/issues/events' +  '?per_page=' + theData.perPage + '&page=' + theData.page, {
        method: 'GET',
        headers: h,
      })
        .then(response => response.json())
        .then(data => {
          for (let i=0; i < data.length; i++) {
              // console.log(data[i].id + ' ' + data[i].issue.number + ' | ' + data[i].event + ' | ' + data[i].created_at + ' | ' + data[i].actor.login + ' | ' + data[i].issue.title)
              let line = { 'EVENT_ID': data[i].id, 'ISSUE_ID': data[i].issue.number, 'TYPE': data[i].event, 'CREATION_DATE': data[i].created_at, 'ACTOR': data[i].actor.login, 'TITLE': data[i].issue.title }
              jsonData.push(line) 
          }
          if (k == totalPages-1) {
            console.log(k)
            let fileContent = arrayToCSV(jsonData, '\t', '\n')
            console.log(fileContent)
            createFile(fileContent)
          }
        });
    }

  }

  fetchAllEvents()
    
  document.addEventListener('click', function (event) { 
    event.preventDefault();  
      
      if (event.target.matches('#export-to-excel')) {
      }

  }, false);

})()
