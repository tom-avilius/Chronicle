
// all imports, constants and variable declarations are mentioned below

// importing app and BrowserWindow from electron.
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

// importing the file-system module
const fs = require('fs');

// importing the os module
const os = require('os');

// importing the path module
const path = require('path');

// user information variables
const username = os.userInfo().username;
const operatingSystem = os.platform();

// ----------------------END OF IMPORTS-------------------------


// class to manage the whole directory
class ImportDirectory {

  constructor(directoryPath = '') {

    // generating all the extensions
    const extensions = new Json('./components/assets/extensions-list.json', {read: true});
    this.possibleExtensions = extensions.fileContents;

    this.directoryPath = directoryPath;

    // calling import directory to get the contents of the directory specified
    this.directoryItems = this.getDirectory(this.directoryPath);

    // calling create directory info to create individual details of every item inside directoryPath
    this.directoryInfo = this.createDirectoryInfo();

    // calling getExtensions to create list of extensions that occur within the directory
    this.extensionList = this.getExtensions();

    // calling group by extension to group directory items according to their extensions
    this.extensionInfo = this.groupByExtension();
  }


  // function to load all files inside a specified folder
  // it will return an object that will store the details of individual files inside the folder
  getDirectory = () => {
    
    // reading all files inside the directory specified in the directory path
    return fs.readdirSync(this.directoryPath);
  }

  // function to create objects from the list of files in a directory
  // it accepts an object and returns an object of objects with the following information
  // file basename
  // file extension
  // absolute path
  // file size in megabytes
  // boolean 0 for file being a directory.
  createDirectoryInfo = () => {

    // initializing an empty object to store directory info
    var directoryInfo = {};

    // reading every file inside the directory and creating individual info objects, finally storing them inside the directoryInfo
    this.directoryItems.forEach(file => {
      
      const absolutePath = this.directoryPath + "/" +file
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


  // function to return all extensions that occur inside the directoryPath using the directoryInfo
  getExtensions = () => {

    // initializing empty object to store extensions
    var extensions = [];

    // looping through every item of the directory
    this.directoryItems.forEach(item => {

      // getting the individual item of directoryInfo
      const element = this.directoryInfo[item];

      // checking if the element specified is a directory
      if (element.isDirectory) {} else {

        // checking if the extension specified is already present
        if (extensions.includes(element.extension)) {} else {

          // adding the extension
          extensions = [

            // previous extensions themselves
            ...extensions,

            //adding the extension that does not exist
            element.extension
          ];
        }
      }
    });

    return extensions;
  }


  // function to judge the type of file using its extension
  getFileType = (extension="") => {

  return this.possibleExtensions[extension.replace('.', '').toLowerCase()];
  }


  // function to group elements inside the directory info according to their extensions
  // it returns an object of objects with the following details
  // object name is the extension itself and details it contains:
  // number of occurences
  // extension name including the dot
  // file type
  // this list will not include any directory
  groupByExtension = () => {

    // initializing object to store objects containing same extension
    var extensionInfo = {};

    // looping through extension list and storing items of same extension within the directory
    this.extensionList.forEach(extension => {

      // creating extension object inside extensionInfo
      extensionInfo = {

        ...extensionInfo,

        [extension]: [],
      }

      // calling getFileType to know the type of extension
      var fileType = this.getFileType(extension)+'';
      // converting the fileType to Camel Case string
      const start = fileType.charAt(0).toUpperCase()
      fileType = start+fileType.substring(1);

      // looping through each item of directory items to find extensions of items
      this.directoryItems.forEach(item => {

        // extension of item
       const itemExtension = this.directoryInfo[item].extension;
       
      //  checking if the current extension being tracked matches with the item extension
       if (itemExtension == extension) {

        extensionInfo[extension] = [

          ...extensionInfo[extension],

          item,
        ];
       }
      });

      extensionInfo[extension] = {

        // the previous list of items under the same extension
        ...extensionInfo[extension],

        // the number of items having that extension
        'noOfItems': extensionInfo[extension].length,
        // the type of file
        'type': fileType,
      }
    });

    return extensionInfo;
  }


  // function to create new folder if it does not already exist
  createFolder = (name="") => {

    try {

      // checking if the folder exists already
      if (!fs.existsSync(this.directoryPath+'/'+name)) {

      fs.mkdirSync(this.directoryPath+'/'+name);
    }
    } catch (err) {

      console.log('Error while creating folder at ' +this.directoryPath+'/'+name);
      console.log(err);
    }
  }


  // function to create folders and move files according to their types
  // it will create a folder with the same name as that of the file type
  // and move the file with the same type there
  sortDirectory = () => {

    Object.keys(this.extensionInfo).forEach( (key, index) => {

      // creating a new folder with the extension name if does not already exist
      if (!this.extensionInfo[key].type == undefined) {
        this.createFolder(this.extensionInfo[key].type);
      }

      Object.keys(this.extensionInfo[key]).forEach( (keyy, index) => {

        try {

          // changing the path of the items according to their extensions
          fs.rename(this.directoryPath+'/'+this.extensionInfo[key][keyy], this.directoryPath+'/'+this.extensionInfo[key].type+'/'+this.extensionInfo[key][keyy], err => {}); 
        } catch (err) {}
      });
      
    });
  }


  // function to print details of individual items inside the directory (logs this.directoryPath)
  listDirectoryInfo = () => {

    console.log(this.directoryInfo);
  }

  // function to log the list of all extensions present
  listExtensionsList = () => {

    console.log(this.extensionList);
  }

  // function to log the list of all extensionsInfo
  listExtensionsInfo = () => {

    console.log(this.extensionInfo);
  }
}

// class to read, write json files.
class Json {

  constructor (filePath = "", action = {read: false, write: false}, writeKey='', writeValue='') {

    this.filePath = path.resolve(filePath);
    this.fileContents = {};

    if(action.read == true) {

      this.fileContents = this.readFile();
    } 

    if (action.write == true) {

      this.writeFile(writeKey+'', writeValue);
    }
  }

  // function to read file synchronously
  readFile = () => {

    try {

      // reading the file
      const jsonString = fs.readFileSync(this.filePath, {encoding:'utf-8'});
      const jsonData = JSON.parse(jsonString);
      return jsonData;
    } catch (err) {

      console.log("Error reading or parsing the file at " +this.filePath);
      console.error(err);
    }
  }


  // function to write file synchronously
  writeFile = (key = '', value) => {

    try {

      // reading the existing contents of the file
      const jsonString = fs.readFileSync(this.filePath, {encoding: 'utf-8'});
      // converting the string to js object
      var jsonData = JSON.parse(jsonString);

      // appending to the js object the new data that has to be fed.
      jsonData = {...jsonData, [key]:value};
      // converting the updated json data to json string
      jsonData = JSON.stringify(jsonData);

      try {

        // writing the updated data to the file
        fs.writeFileSync(this.filePath, jsonData);
      } catch {

        console.log('Error writing to file at ' +this.filePath);
        console.error(err);
      }
    } catch (err) {

      console.log('Error reading file at ' +this.configPath);
      console.error(err);
    }
  }
 

  // function to list the fileContents
  listFileContents = () => {

    console.log(this.fileContents);
  }
}


// class to manage app configurations
class Configuration {

  constructor () {

    this.configurations = new Json('./components/assets/config.json', {read: true});
    this.config = this.configurations.fileContents;
    this.configPath = this.configurations.filePath;

    this.firtTimeRun = this.checkFirstRun();
  }

// function to check first time run of app
  checkFirstRun = () => {
    if(Object.keys(this.config).length == 0) {
      
      return true;
    } else {return false;}
  }

  // function to feed data into the config.json file
  feed = (key, value) => {

    // feeding the data to the config file
    this.configurations.writeFile(key+'', value);
    // updating the config info
    this.config = this.configurations.readFile();
  }
}


// --------------------------------------------------------------------------------------------------

// Function where the main window is creation is defined.
// this method is called when the app is ready.
const createMainWidow = () => {

  // const downlaodsDirectory = new ImportDirectory('C:/users/'+username+'/Downloads');
  // downlaodsDirectory.sortDirectory();

  // creating the main browser window
  const mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#172731',
      symbolColor: '#3A9188',
      height: 32
    },
    
    webPreferences: {

      preload: path.join(__dirname, 'components/html/js/indexPreload.js'),
    }
  });

  // centering the main window
  mainWindow.center();

  mainWindow.loadFile('./components/html/index.html');

  // creating configurations object
  const config = new Configuration();

  // sending the first time run info as true or false.
  mainWindow.webContents.send('run-info', config.firtTimeRun);

  // listening to the sort-downloads event from the renderer 
  // flag can be true or false
  // if the flag is true downloads directory will be sorted
  ipcMain.on('sort-downloads', (event, flag) => {

    // checking if the flag is true
    // flag will only be true if the application was started for the first time that infers that the config.json is empty
    if (flag) {

      // creating a secondary window that points to the importDownloads.html file
      createSecondaryWindow('./components/html/importDownloads.html');

      // listening to sort-downloads-click event
      // this event will be emitted by the importDownloads.js if the user choses to sort the downlaods directory
      // flag can be true or false
      ipcMain.on('sort-downloads-click', (event, flag) => {

        // checking if the flag is true
        // flag will only be true when to the user clicks on the yes button
        // secondary window will be closed by the importDowloads.js file automatically when either yes or no button is clicked.
        if (flag) {

          // importing the downloads directory
          var downloadsDirectory = new ImportDirectory('C:/users/'+username+'/Downloads');
          // sorting the downloads directory
          downloadsDirectory.sortDirectory();
          // feeding this info to the config.json
          // this will allow Chronicle to know which directory to import at startup
          config.feed('import', [downloadsDirectory.directoryPath+'']);
        }
      })
    }
  })
   
}


// function to create secondary window
const createSecondaryWindow = (htmlFilePath='', width=700, height=250) => {

  // creating additional browser window
  const browserWindow = new BrowserWindow( {
    titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#172731',
    //   symbolColor: '#3A9188',
    //   height: 32
    // },

    height: height,
    width: width,
    
    webPreferences: {

      preload: path.join(__dirname, 'components/html/js/indexPreload.js'),
  }});

  // centering the secondary window
  browserWindow.center();

  // loading the html file
  browserWindow.loadFile(path.resolve(htmlFilePath));
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
