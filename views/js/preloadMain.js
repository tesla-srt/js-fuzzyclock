// preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script starting');

// Create the exposed electron object
const electronHandler = {
    dragWindow: () => ipcRenderer.send('drag-window'),
    showSettings: () => {
        console.log('showSettings called in preload');
        ipcRenderer.send('show-settings');
    },
    getSettings: () => ipcRenderer.send('get-settings'),
    onPong: (callback) => ipcRenderer.on('pong', (e, ...args) => callback(args)),
    timeString: (fuzzyness) => {
        // Ported from https://github.com/KDE/kdeplasma-addons/blob/master/applets/fuzzy-clock/package/contents/ui/FuzzyClock.qml
        // KDE Plasma FuzzyClock
        let hourNames = [
            [
                "One o'clock",
                "Five past one",
                "Ten past one",
                "Quarter past one",
                "Twenty past one",
                "Twenty-five past one",
                "Half past one",
                "Twenty-five to two",
                "Twenty to two",
                "Quarter to two",
                "Ten to two",
                "Five to two",
            ],
            [
                "Two o'clock",
                "Five past two",
                "Ten past two",
                "Quarter past two",
                "Twenty past two",
                "Twenty-five past two",
                "Half past two",
                "Twenty-five to three",
                "Twenty to three",
                "Quarter to three",
                "Ten to three",
                "Five to three",
            ],
            [
                "Three o'clock",
                "Five past three",
                "Ten past three",
                "Quarter past three",
                "Twenty past three",
                "Twenty-five past three",
                "Half past three",
                "Twenty-five to four",
                "Twenty to four",
                "Quarter to four",
                "Ten to four",
                "Five to four",
            ],
            [
                "Four o'clock",
                "Five past four",
                "Ten past four",
                "Quarter past four",
                "Twenty past four",
                "Twenty-five past four",
                "Half past four",
                "Twenty-five to five",
                "Twenty to five",
                "Quarter to five",
                "Ten to five",
                "Five to five",
            ],
            [
                "Five o'clock",
                "Five past five",
                "Ten past five",
                "Quarter past five",
                "Twenty past five",
                "Twenty-five past five",
                "Half past five",
                "Twenty-five to six",
                "Twenty to six",
                "Quarter to six",
                "Ten to six",
                "Five to six",
            ],
            [
                "Six o'clock",
                "Five past six",
                "Ten past six",
                "Quarter past six",
                "Twenty past six",
                "Twenty-five past six",
                "Half past six",
                "Twenty-five to seven",
                "Twenty to seven",
                "Quarter to seven",
                "Ten to seven",
                "Five to seven",
            ],
            [
                "Seven o'clock",
                "Five past seven",
                "Ten past seven",
                "Quarter past seven",
                "Twenty past seven",
                "Twenty-five past seven",
                "Half past seven",
                "Twenty-five to eight",
                "Twenty to eight",
                "Quarter to eight",
                "Ten to eight",
                "Five to eight",
            ],
            [
                "Eight o'clock",
                "Five past eight",
                "Ten past eight",
                "Quarter past eight",
                "Twenty past eight",
                "Twenty-five past eight",
                "Half past eight",
                "Twenty-five to nine",
                "Twenty to nine",
                "Quarter to nine",
                "Ten to nine",
                "Five to nine",
            ],
            [
                "Nine o'clock",
                "Five past nine",
                "Ten past nine",
                "Quarter past nine",
                "Twenty past nine",
                "Twenty-five past nine",
                "Half past nine",
                "Twenty-five to ten",
                "Twenty to ten",
                "Quarter to ten",
                "Ten to ten",
                "Five to ten",
            ],
            [
                "Ten o'clock",
                "Five past ten",
                "Ten past ten",
                "Quarter past ten",
                "Twenty past ten",
                "Twenty-five past ten",
                "Half past ten",
                "Twenty-five to eleven",
                "Twenty to eleven",
                "Quarter to eleven",
                "Ten to eleven",
                "Five to eleven",
            ],
            [
                "Eleven o'clock",
                "Five past eleven",
                "Ten past eleven",
                "Quarter past eleven",
                "Twenty past eleven",
                "Twenty-five past eleven",
                "Half past eleven",
                "Twenty-five to twelve",
                "Twenty to twelve",
                "Quarter to twelve",
                "Ten to twelve",
                "Five to twelve",
            ],
            [
                "Twelve o'clock",
                "Five past twelve",
                "Ten past twelve",
                "Quarter past twelve",
                "Twenty past twelve",
                "Twenty-five past twelve",
                "Half past twelve",
                "Twenty-five to one",
                "Twenty to one",
                "Quarter to one",
                "Ten to one",
                "Five to one",
            ]
        ]

        let halflingTime = [
            "Sleep",
            "Breakfast",
            "Second Breakfast",
            "Elevenses",
            "Lunch",
            "Afternoon tea",
            "Dinner",
            "Supper",
        ]

        let dayTime = [
            "Night",
            "Early morning",
            "Morning",
            "Almost noon",
            "Noon",
            "Afternoon",
            "Evening",
            "Late evening",
        ]

        let weekTime = ["Start of week", "Middle of week", "End of week", "Weekend!"]


        fuzzyness = (fuzzyness < 1 ? 1 : fuzzyness)
        fuzzyness = (fuzzyness > 5 ? 5 : fuzzyness)
        let d = new Date()
        let hours = d.getHours()
        let minutes = d.getMinutes()

        if (fuzzyness == 1 || fuzzyness == 2) {
            let sector = 0
            let realHour = 0

            if (fuzzyness == 1) {
                if (minutes > 2) {
                    sector = (minutes - 3) / 5 + 1
                }
            } else {
                sector = ((minutes + 7) / 15 * 3)
                sector = (Math.floor(sector / 3) * 3)
            }

            if (hours % 12 > 0) {
                realHour = hours % 12 - 1
            } else {
                realHour = 12 - (hours % 12 + 1)
            }

            sector = Math.floor(sector)
            if (sector == 12) {
                realHour += 1
                if (Math.floor(realHour) >= hourNames.length) {
                    realHour = 0
                }
                sector = 0
            }

            return hourNames[Math.floor(realHour)][sector]
        } else if (fuzzyness == 3) {
            return halflingTime[Math.floor(hours / 3)]
        } else if (fuzzyness == 4) {
            return dayTime[Math.floor(hours / 3)]
        } else {
            let dow = d.getDay()

            let weekTimeId
            if (dow == 1) {
                weekTimeId = 0
            } else if (dow >= 2 && dow <= 4) {
                weekTimeId = 1
            } else if (dow == 5) {
                weekTimeId = 2
            } else {
                weekTimeId = 3
            }

            return weekTime[weekTimeId]
        }
    },
    state: {
        fuzzyness: 1,
        fontSize: 12
    }
};

// Expose the electron object to the renderer
contextBridge.exposeInMainWorld('electron', electronHandler);

console.log('Preload script finished, exposed:', Object.keys(electronHandler));

window.addEventListener('DOMContentLoaded', () => {
  // Access Node.js modules safely through window.api.someMethod(); calls
  // example of that; the API is defined below

  // Example for hiding the main app menu using API call (instead of direct window manipulation)

  // --- Example API usage to access functionalities ----

  // ... and more functionalities to control appearance,  ...  and functionality (such as minimize, maximize), etc




});