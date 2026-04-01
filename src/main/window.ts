import { BrowserWindow } from 'electron';
import path from 'path';

let win: BrowserWindow | null = null;

export function createWindow(): BrowserWindow {
  win = new BrowserWindow({
    width: 380,
    height: 500,
    resizable: false,
    show: true,
    title: 'On Fire',
    // skipTaskbar: true,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(process.cwd(), 'assets', 'tray-active.ico'),
  });

  // HTML/CSS live in src/renderer; only .ts files go to dist
  win.loadFile(path.join(process.cwd(), 'src', 'renderer', 'index.html'));

  win.on('close', (event) => {
    event.preventDefault();
    win?.hide();
  });

  return win;
}

export function showWindow(): void {
  if (win) {
    win.show();
    win.focus();
  }
}

export function getWindow(): BrowserWindow | null {
  return win;
}
