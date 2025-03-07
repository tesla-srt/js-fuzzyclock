const { app, BrowserWindow, ipcMain, Tray, Menu, contextBridge } = require('electron');
const path = require('path');

const state = {
    fuzzyness: 1,
    fontSize: 12
}
var fuzzyness = 1
var win, settingsWindow

ipcMain.on('save-settings', (event, data) => {
    state.fuzzyness = data.fuzzyness
    win.webContents.postMessage('pong', state)
})

ipcMain.on('get-settings', (event, data) => event.reply(state))

ipcMain.on('ping', (event, data) => {
    //console.log('tick')
})

ipcMain.on('show-settings', (event, data) => {
    //console.log('👍')
    settingsWindow.show()
})

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 275,
        height: 70,
        frame: false, // This line makes the window frameless
        transparent: true, // Optional: Makes the background transparent
        alwaysOnTop: true, // Optional: Keeps the widget on top of other windows
        maximizable: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'views/js/preloadMain.js'),
            nodeIntegration: true,
            contextIsolation: true
        }
    })

    win.setVisibleOnAllWorkspaces(true)
    win.setMenu(null)
    win.loadFile(path.join(__dirname, 'views/index.html'))
    win.webContents.openDevTools() // Uncomment to open DevTools

    settingsWindow = new BrowserWindow({
        width: 400,
        height: 300,
        //preload: path.join(__dirname, '/views/js/preloadSettings.js'),
        show: false,
        //frame: false, // This line makes the window frameless
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    settingsWindow.setMenu(null)
    settingsWindow.loadURL(`file://${__dirname}/views/settings.html?fuzzyness=${state.fuzzyness}`)
    settingsWindow.webContents.openDevTools(); //

    settingsWindow.on('close', function (e) {
        e.preventDefault()
        settingsWindow.hide()
    });

    //FN: Tray initialization
    const tray = new Tray(path.join(__dirname, 'assets/clock-regular.png')) // Replace with your icon path

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Configure', click: () => settingsWindow.show() },
        { type: 'separator' },
        { label: 'Exit', click: () => app.quit() }
    ]);

    tray.setContextMenu(contextMenu)

    // Handle the tray icon's double-click event
    tray.on('double-click', () => {
        if (win.isVisible()) win.hide();
        else win.show();
    })

    tray.on('middle-click', () => {
        app.quit()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})