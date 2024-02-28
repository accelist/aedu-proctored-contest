const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("competitionBridge", {
  setParticipant: (participant: string) => ipcRenderer.send("set-participant", participant),
});
