const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
//Lets define our globals
let win, settingsWindow, store, state, tray

// Add error logging
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Try to create cache directory explicitly
const userDataPath = app.getPath('userData');
const cachePath = path.join(userDataPath, 'cache');

try {
    if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath, { recursive: true });
    }
    console.log('Cache directory created/verified at:', cachePath);
} catch (error) {
    console.error('Failed to create cache directory:', error);
}

// Set cache location before app is ready
app.commandLine.appendSwitch('disk-cache-dir', cachePath);
app.commandLine.appendSwitch('disable-gpu-cache');
app.commandLine.appendSwitch('disable-software-rasterizer');

async function initializeStore() {
    const Store = (await import('electron-store')).default;

    const schema = {
        fuzzyness: {
            type: 'number',
            minimum: 1,
            maximum: 5,
            default: 1
        },
        fontSize: {
            type: 'number',
            minimum: 8,
            maximum: 72,
            default: 12
        },
        fontColor: {
            type: 'string',
            default: '#ffffff'
        },
        fontFamily: {
            type: 'string',
            default: 'system-ui'
        },
        bgTransparency: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            default: 0.35
        },
        firstRun: {
            type: 'boolean',
            default: true
        }
    };

    store = new Store({ schema });

    // Initialize state from stored settings
    state = {
        fuzzyness: store.get('fuzzyness'),
        fontSize: store.get('fontSize'),
        fontColor: store.get('fontColor'),
        fontFamily: store.get('fontFamily'),
        bgTransparency: store.get('bgTransparency')
    };

    // Check if this is the first run
    const isFirstRun = store.get('firstRun');
    if (isFirstRun) {
        // Set firstRun to false for future launches
        store.set('firstRun', false);
        return true;
    }
    return false;
}

async function createWindow() {
    // Initialize store first
    const shouldShowSettings = await initializeStore();

    // Create main window
    win = new BrowserWindow({
        width: 275,
        height: 70,
        frame: false,
        transparent: true,
        backgroundColor: '#00000000',
        alwaysOnTop: true,
        maximizable: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'views/js/preloadMain.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Create settings window with proper window behavior
    settingsWindow = new BrowserWindow({
        width: 600,
        height: 600,
        minWidth: 500,
        minHeight: 500,
        show: false,
        frame: true,
        backgroundColor: '#ffffff',
        center: true,
        modal: false,
        alwaysOnTop: false,
        parent: null,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Add window level control
    settingsWindow.setAlwaysOnTop(false);

    win.setVisibleOnAllWorkspaces(true);
    win.setMenu(null);
    win.loadFile(path.join(__dirname, 'views/index.html'));

    settingsWindow.setMenu(null);
    loadSettingsWindow()

    settingsWindow.webContents.on('did-finish-load', () => {
        console.log('Settings window content loaded');
        // Show settings window on first run
        if (shouldShowSettings) {
            settingsWindow.show();
            settingsWindow.focus();
        }
    });

    settingsWindow.on('show', () => {
        console.log('Settings window show event triggered');
    });

    settingsWindow.on('focus', () => {
        loadSettingsWindow()
        console.log('Settings window focused');
    });

    settingsWindow.on('close', (e) => {
        if (!app.isQuitting) {
            e.preventDefault();
            settingsWindow.hide();
        }
    });

    // Tray initialization
    tray = new Tray(path.join(__dirname, 'assets/clock-regular.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Configure', click: () => settingsWindow.show() },
        { type: 'separator' },
        {
            label: 'Exit', click: () => {
                app.isQuitting = true;
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
        if (win.isVisible()) win.hide();
        else win.show();
    });

    // IPC handlers
    ipcMain.on('show-settings', () => {
        console.log('Show settings requested from renderer');
        if (settingsWindow) {
            //Reload the state to the settings window
            loadSettingsWindow()

            try {
                settingsWindow.center();
                settingsWindow.show();
                settingsWindow.focus();
                console.log('Settings window should now be visible');
            } catch (error) {
                console.error('Error showing settings window:', error);
            }
        } else {
            console.error('Settings window is not initialized');
        }
    });

    ipcMain.on('save-settings', (event, data) => {
        Object.assign(state, data);
        // Save to store
        for (const [key, value] of Object.entries(data)) {
            store.set(key, value);
        }
        win.webContents.send('pong', state); //Send the settings back to the main window
    });

    ipcMain.on('get-settings', (event) => {
        win.webContents.send('pong', state);
    });

    win.on('close', () => {
        app.isQuitting = true;
        app.quit();
    });
}

function loadSettingsWindow() {
    settingsWindow.loadURL(
        `file://${__dirname}/views/settings.html?` +
        `fuzzyness=${state.fuzzyness}&` +
        `fontColor=${encodeURIComponent(state.fontColor)}&` +
        `fontFamily=${encodeURIComponent(state.fontFamily)}&` +
        `bgTransparency=${state.bgTransparency}`
    );
}

app.whenReady().then(createWindow);

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