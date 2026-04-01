import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getState: () => ipcRenderer.invoke('get-state'),
  toggleOnFire: () => ipcRenderer.send('toggle-on-fire'),
  onStateChanged: (callback: (state: { onFireEnabled: boolean }) => void) => {
    ipcRenderer.on('state-changed', (_event, state) => callback(state));
  },
  mouseActivity: () => ipcRenderer.send('mouse-activity'),
});
