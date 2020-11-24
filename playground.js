(function () {

    const username = 'gassio'
    const githubToken = 'ea41eb5c55dfca4145456b9619c00f0be6da4982'
  
    var theData = {
      testArray: [{ id: 1, title: 'asdf'}],
      repo: ['tensorflow/tensorflow', 'twbs/bootstrap', 'microsoft/vscode'],    
      perPage: 100,
      page: 0,
      issues: [],
      events: [],
      eventIssues: [],
    }
  
    var exportToExcel = function(events, columns) { 
      console.log(events)
  
      var wb = XLSX.utils.book_new()
      var ws = XLSX.utils.json_to_sheet(events, { header: columns }) 
  
      XLSX.utils.book_append_sheet(wb, ws, 'events-issues')
      XLSX.writeFile(wb, 'events-and-issues.xlsx')
    }  
  
    var fetchIssues = function () {
      fetch('https://api.github.com/search/issues?q=' + theData.repo + '+type:issue').then(function (response) {
        if (response.ok) return response.json();
        return Promise.reject(response);
      })
      .then(function (issues) {
          for (let i=0; i < issues.length; i++) {
              fetch('https://api.github.com/repos/' + theData.repo + '/issues/' + issues.number + '/events').then(function (response) {
                  if (response.ok) return response.json()
                  return Promise.reject(response)
              })
              .then(function(events) {
                  for (let j=0; j < events.length; j++) {
                    console.log(theData.issues[issueId].id + ' ' + events[j].event + ' ' + events[j].created_at + ' ' + events[j].actor.login + ' ' + theData.issues[issueId].title)
                }
              })
              .catch(function(err) {
                console.log(err)
              })
          }
      })
      .catch(function (error) {
          console.warn('Something went wrong.', error);
      });
    }
  
    var fetchEvents = function (issueId) {
      fetch('https://api.github.com/repos/' + theData.repo + '/issues/' + issueId + '/events').then(function (response) {
          if (response.ok) return response.json()
          return Promise.reject(response)
      })
      .then(function(data) {
         
          for (let j=0; j < data.length; j++) {
            console.log(theData.issues[issueId].id + ' ' + data[j].event + ' ' + data[j].created_at + ' ' + data[k].actor.login + ' ' + theData.issues[issueId].title + ' ' )
        }
        // theData.events = data
          // for (let j=0; j < theData.events.length; j++) {
          //     console.log(theData.issues[issueId].id + ' ' + theData.issues[issueId].title + ' ' + theData.events[j].event + " at " + theData.events[j].created_at)
          //     let line = { "id": theData.issues[issueId].id, "title": theData.issues[issueId].title, "event_name": theData.events[j].event, "event_time": theData.events[j].created_at }
          //     theData.eventIssues.push(line)
          // }
          // return theData.eventIssues
      })
      .catch(function (error) {
          console.log(error)
      })
    }
  
})()
  