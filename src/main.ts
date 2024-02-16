import { app, BrowserWindow, globalShortcut, Menu } from 'electron';

let mainWindow: BrowserWindow | null;

// Remove menu bar altogether
Menu.setApplicationMenu(null);

// we probably should not open this page immediately.
// we should probably develop a simple web page in react to allow contestant to enter contest username / ID
// username / ID will be used for validating contest entry and logging
// after that initial page, browser should be redirected to the actual contest page
const contestUrl = `https://www.hackerrank.com/accelist-test-contest`;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(contestUrl);

    mainWindow.on('leave-full-screen', () => {
        terminateForCheating();
    });

    mainWindow.on('blur', () => {
        terminateForCheating();
    });

    mainWindow.webContents.on('did-navigate', (event, url) => {
        // Log URL to a web API
        logUrlToApi(url);
    });

    // Disable developer tools
    mainWindow.webContents.on('devtools-opened', () => {
        mainWindow?.webContents.closeDevTools();
    });
}

function terminateForCheating() {
    // Log termination attempt
    try {
        // const response = await fetch.default('YOUR_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ url })
        // });

        // if (!response.ok) {
        //     throw new Error('Failed to log URL');
        // }
        console.log('TERMINATED');
    } catch (error) {
        console.error('Error logging termination:', error);
    }

    app.quit();
}

async function logUrlToApi(url: string): Promise<void> {
    // Dynamically import fetch module
    const fetch = await import('node-fetch');

    // Log URL to a web API
    try {
        // const response = await fetch.default('YOUR_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ url })
        // });

        // if (!response.ok) {
        //     throw new Error('Failed to log URL');
        // }
        console.log(url);
    } catch (error) {
        console.error('Error logging URL:', error);
    }
}

app.whenReady().then(() => {
    createWindow();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
