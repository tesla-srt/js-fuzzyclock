const { app, BrowserWindow, ipcMain, Tray, Menu, MessageChannelMain } = require('electron');
const path = require('path');
var fuzzyness = 1
let win, settingsWindow

function createWindow() {
    win = new BrowserWindow({
        width: 275,
        height: 70,
        frame: false, // This line makes the window frameless
        transparent: true, // Optional: Makes the background transparent
        alwaysOnTop: true, // Optional: Keeps the widget on top of other windows
        title: "fuzzytime.js",
        webPreferences: {
            preload: path.join(__dirname, 'preloadMain.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.setMenu(null)
    win.loadFile('index.html');
    //win.webContents.openDevTools(); // Uncomment to open DevTools
}

ipcMain.on('save-settings', (event, data) => {
    fuzzyness = data
    win.webContents.postMessage('pong', fuzzyness)
})

ipcMain.on('ping', (event, data) => {
    //console.log('tick')
})


app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 275,
        height: 70,
        useContentSize: true,
        frame: false, // This line makes the window frameless
        transparent: true, // Optional: Makes the background transparent
        alwaysOnTop: true, // Optional: Keeps the widget on top of other windows
        maximizable: false,
        resizable: false,
        webPreferences: {
            //preload: path.join(__dirname, '/views/js/preloadMain.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.setMenu(null)
    win.loadFile(path.join(__dirname, 'views/index.html'));
    
    //win.webContents.openDevTools(); // Uncomment to open DevTools
    
    settingsWindow = new BrowserWindow({
        width: 400,
        height: 300,
        //preload: path.join(__dirname, '/views/js/preloadSettings.js'),
        parent: win,
        show: false,
        //frame: false, // This line makes the window frameless
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    settingsWindow.setMenu(null)
    settingsWindow.loadURL(`file://${__dirname}/views/settings.html?fuzzyness=${fuzzyness}`);
    //settingsWindow.webContents.openDevTools(); //

    settingsWindow.on('close', function (e) {
        e.preventDefault()
        settingsWindow.hide()
    });

    //FN: Tray initialization
    const tray = new Tray(path.join(__dirname, '_res/clock-regular.png')); // Replace with your icon path

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Configure', click: () => settingsWindow.show() },
        { type: 'separator' },
        { label: 'Exit', click: () => app.quit() }
    ]);

    tray.setContextMenu(contextMenu);

    // Handle the tray icon's double-click event
    tray.on('double-click', () => {
        if (win.isVisible()) win.hide();
        else win.show();
    });

    tray.on('middle-click', () => {
        app.quit()
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

