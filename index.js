
// all imports, constants and variable declarations are mentioned below

// importing app and BrowserWindow from electron.
const { app, BrowserWindow } = require('electron');

// ----------------------END OF IMPORTS-------------------------




// --------------------------------------------------------------------------------------------------

// Function where the main window is creation is defined.
// this method is called when the app is ready.
const createMainWidow = () => {

  // creating the main browser window
  const mainWindow = new BrowserWindow();

  // centering the main window
  mainWindow.center();
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
