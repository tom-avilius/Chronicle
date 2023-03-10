
// all imports, constants and variable declarations are mentioned below

// importing app and BrowserWindow from electron.
const { app, BrowserWindow } = require('electron');

// importing the file-system module
const fs = require('fs');

// importing the os module
const os = require('os');

// importing the path module
const path = require('path');

// user information variables
const username = os.userInfo();
const operatingSystem = os.platform();

// ----------------------END OF IMPORTS-------------------------


// function to load all files inside a specified folder
// it will return an object that will store the details of individual files inside the folder
const importDirectory = (directoryPath = "") => {
  
  // reading all files inside the directory specified in the directory path
  return fs.readdirSync(directoryPath);
}


// function to create objects from the list of files in a directory
// it accepts an object and returns an object of objects with the following information
// file basename
// file extension
// absolute path
// file size in megabytes
// boolean 0 for file being a directory.
const createDirectoryInfo = (directoryPath = "") => {

  // calling import directory to get the contents of the directory specified
  const directory = importDirectory(directoryPath);

  // initializing an empty object to store directory info
  var directoryInfo = {};

  // reading every file inside the directory and creating individual info objects, finally storing them inside the directoryInfo
  directory.forEach(file => {
    
    const absolutePath = directoryPath + "/" +file
    const fileStat = fs.statSync(absolutePath);
    const fileSize = (fileStat.size) / (1024*1024);
    const fileExtension = path.extname(file);
    const fileName = path.basename(file, fileExtension);
    const isDirectory = fileStat.isDirectory();

    directoryInfo = {

      // the directory info itself
      ...directoryInfo, 
    
      [file]: {

        'name': fileName,
        'extension': fileExtension,
        'path': absolutePath,
        'size': fileSize,
        'isDirectory': isDirectory,
      },
    };
  });

  return directoryInfo;
}




// --------------------------------------------------------------------------------------------------

// Function where the main window is creation is defined.
// this method is called when the app is ready.
const createMainWidow = () => {

  // creating the main browser window
  const mainWindow = new BrowserWindow();

  // centering the main window
  mainWindow.center();

  directoryInfo = createDirectoryInfo('C:/users/aaars/Downloads');
  console.log(directoryInfo);
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
