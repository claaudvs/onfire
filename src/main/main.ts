import { app, ipcMain, globalShortcut } from 'electron';
import { createWindow, showWindow } from './window';
import { createTray, getOnFireState, toggleOnFire } from './tray';
import { updateMouseActivity } from './mouse';
import * as fs from 'fs';
import * as path from 'path';

const logDir = path.join(app.getPath('userData'), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function log(msg: string): void {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(path.join(logDir, 'app.log'), line);
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  globalShortcut.register('CommandOrControl+Shift+F', toggleOnFire);

  ipcMain.handle('get-state', () => ({ onFireEnabled: getOnFireState() }));
  ipcMain.on('toggle-on-fire', toggleOnFire);
  ipcMain.on('mouse-activity', updateMouseActivity);

  log('App started');
});

app.on('window-all-closed', () => {
  // Keep running in tray — do not quit
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  log('App exited');
});
