// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    dragWindow: () => ipcRenderer.send('drag-window'),
	ping: () => ipcRenderer.send('ping')
});


ipcRenderer.on('port', e => {
  // port received, make it globally available.
  window.electronMessagePort = e.ports[0]

  window.electronMessagePort.onmessage = messageEvent => {
    // handle message
    console.log(messageEvent)
  }
})

window.addEventListener('DOMContentLoaded', () => {
  // Access Node.js modules safely through window.api.someMethod(); calls
  // example of that; the API is defined below

  // Example for hiding the main app menu using API call (instead of direct window manipulation)

  // --- Example API usage to access functionalities ----

  // ... and more functionalities to control appearance,  ...  and functionality (such as minimize, maximize), etc


        
	
 });