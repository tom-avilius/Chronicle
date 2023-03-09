
// all imports, constants and variable declarations are mentioned below

// importing app and BrowserWindow from electron.
const { app, BrowserWindow } = require('electron');
// importing the file-system module
const fs = require('fs');

// ----------------------END OF IMPORTS-------------------------


// function to load all files inside a specified folder
// it will return an object that will store the details of individual files inside the folder
const importDirectory = (directoryPath = "") => {
  
  return fs.readdirSync(directoryPath);
}




// --------------------------------------------------------------------------------------------------

// Function where the main window is creation is defined.
// this method is called when the app is ready.
const createMainWidow = () => {

  // creating the main browser window
  const mainWindow = new BrowserWindow();

  // centering the main window
  mainWindow.center();

  const downloadsDirectory = importDirectory('C:/users/aaars/Downloads');
}


// app execution starts from here when the app is ready.
try {

  app.whenReady().then(() => {

    // calling create main window to create the browser window
    createMainWidow(); 
  });
} catch (error) {

  console.log('Error while creating the main window..\n');
  console.error(error);
}
