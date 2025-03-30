//const { ipcRenderer } = require('electron')
let fuzzyness = window.electron.state.fuzzyness

const updateTime = ((a) => {                //FN: updateTime(fuzzyness) Interact with DOM and update the time label 
  let label = document.getElementById('time')
  //let time = timeString(a)
  let time = window.electron.timeString(a)
  label.innerText = time
})



window.onload = function (e) {
  setInterval(() => { updateTime(fuzzyness) }, 59999)
  updateTime(fuzzyness)
}

window.electron.onPong(message => {
  message = message[0]
  console.log('👍')
  console.log(message)
  if (fuzzyness != message.fuzzyness) {
    fuzzyness = message.fuzzyness
    window.electron.state.fuzzyness = fuzzyness
    updateTime(fuzzyness)
  }
})

// ipcRenderer.on('pong', (event, message) => {
//   if (fuzzyness != message) {
//     fuzzyness = message
//     updateTime(fuzzyness)
//   }
// })

// document.addEventListener('mousedown', (e) => {
//   if (e.target.tagName !== 'BUTTON') {
//     ipcRenderer.send('drag-window')
//   }
// })

console.log('Renderer script loaded');

// Function to apply settings to the UI
function applySettings(settings) {
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.style.color = settings.fontColor;
        timeElement.style.fontFamily = settings.fontFamily;
    }
    
    const alpha = settings.bgTransparency;
    document.body.style.backgroundColor = `rgba(0, 0, 0, ${alpha})`;
    document.documentElement.style.setProperty('--bg-opacity', alpha);
}

// Add click handler for settings button
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, adding click handlers');
    
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            console.log('Settings button clicked');
            e.preventDefault();
            e.stopPropagation();
            if (window.electron) {
                window.electron.showSettings();
            }
        });
        
        // Make the button not draggable
        settingsBtn.style.webkitAppRegion = 'no-drag';
    }
});

// Listen for settings updates
window.electron.onPong((args) => {
    console.log('Settings received:', args[0]);
    applySettings(args[0]);
});

// Request initial settings
console.log('Requesting initial settings');
window.electron.getSettings();

// Add click counter for debugging
let lastClickTime = 0;
document.addEventListener('click', (e) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 300) { // Double click detected
        console.log('Double click detected');
        if (window.electron && window.electron.showSettings) {
            console.log('Calling showSettings');
            window.electron.showSettings();
        } else {
            console.error('window.electron or showSettings not available');
            console.log('window.electron:', window.electron);
        }
    }
    lastClickTime = currentTime;
});

// Also try with the dblclick event as backup
document.addEventListener('dblclick', (e) => {
    console.log('Native dblclick event detected');
    if (window.electron && window.electron.showSettings) {
        console.log('Calling showSettings from dblclick');
        window.electron.showSettings();
    }
});

// Add this to check if the script is running
console.log('Event listeners added');

// Add this to verify the window.electron object is available
console.log('Renderer initialized with electron:', window.electron);