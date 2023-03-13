
// all variables and constants are mentioned below
const folderList = document.getElementById('folder-list');

// ----------END OF DECLARATIONS-----------------


// handling events of the IPC modules

// handling the run-info event of the mainWindowLoad api via the checkFirstTimeRun.
// the value callback function receives is either true or false
// depending on the first time run of the mainWindow.
window.mainWindowLoad.checkFirstTimeRun( (event, value) => {

  if (value) {

    // sending a message to the main process via the sort-downloads channel using the mainWindowLoad api.
    window.mainWindowLoad.askToSortDownloads(true);
  }
})