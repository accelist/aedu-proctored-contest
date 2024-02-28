import { app, BrowserWindow, Menu, ipcMain, IpcMainEvent } from "electron";
const path = require("node:path");

let mainWindow: BrowserWindow | null;

// Remove menu bar altogether
Menu.setApplicationMenu(null);

// we probably should not open this page immediately.
// we should probably develop a simple web page in react to allow contestant to enter contest username / ID
// username / ID will be used for validating contest entry and logging
// after that initial page, browser should be redirected to the actual contest page
const contestUrl = `https://www.hackerrank.com/accelist-test-contest`;
const urlAPI = `http://localhost:5231`;

let name = "";
let email = "";
let alreadyLogIn = false;

function createWindow(): void {
  let pathPreload = path.join(__dirname, "preload.js");
  mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      preload: pathPreload,
    },
  });

  mainWindow.loadFile("./pages/login.html");

  mainWindow.on("leave-full-screen", () => {
    terminateForCheating("Leave full screen attempted");
  });

  mainWindow.on("blur", () => {
    terminateForCheating("Blur attempted");
  });

  mainWindow.webContents.on("did-navigate", (event, url) => {
    // Log URL to a web API
    logUrlToApi(url);
  });

  // Disable developer tools
  mainWindow.webContents.on("devtools-opened", () => {
    mainWindow?.webContents.closeDevTools();
  });
}

app.whenReady().then(() => {
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

async function terminateForCheating(event: string) {
  // Dynamically import fetch module
  if(!alreadyLogIn) return;
  const fetch = await import("node-fetch");

  let data = {
    email: email,
    name: name,
    log: event,
  };
  // Log termination attempt
  try {
    const response = await fetch.default(`${urlAPI}/api/competition/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to log URL");
    }
  } catch (error) {
    console.error("Error logging termination:", error);
  }

  app.quit();
}

async function logUrlToApi(url: string): Promise<void> {
  if(!alreadyLogIn) return;
  // Dynamically import fetch module
  const fetch = await import("node-fetch");
  let data = {
    email: email,
    name: name,
    log: `Navigated to ${url}`,
  };
  // Log URL to a web API
  try {
    const response = await fetch.default(`${urlAPI}/api/competition/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Error logging URL:", error);
  }
}

async function initiateQuiz(): Promise<void> {
  // Dynamically import fetch module
  const fetch = await import("node-fetch");

  let data = {
    email: email,
    name: name,
    log: "Initialize Quiz",
  };

  // Log URL to a web API
  try {
    const response = await fetch.default(`${urlAPI}/api/competition/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error("Failed to log URL");
    }
  } catch (error) {
    console.error("Error logging initialize URL:", error);
  }
}

// Listen for the form submission event from the renderer process
ipcMain.on("set-participant", async (event, participantJson) => {
  // Handle the form data in the main process
  console.log("Received form data in main process:", participantJson);
  let participant = JSON.parse(participantJson);
  // You can perform any additional logic or send a response back to the renderer process
  email = participant.email;
  name = participant.name;
  alreadyLogIn = true;
  await initiateQuiz();
  mainWindow?.loadURL(contestUrl);
});
