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

$(document).on('dblclick', (e) => {
  window.electron.showSettings()
})