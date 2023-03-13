
// all variables and declarations are mentioned here

// the DOM elements
// yes and no buttons
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// ----------------------------------------------------------------------------------


// attaching event listeners

// adding click event listener to the yes btn and sending the flag as true
yesBtn.addEventListener('click', (event) => {

    // sending flag as true
    window.mainWindowLoad.sortDownloadsBtnClick(true);
    window.close();
});

// adding event listener to the no btn and sending the flag as false
noBtn.addEventListener('click', (event) => {

    window.mainWindowLoad.sortDownloadsBtnClick(false);
    window.close();
});