import { Tray, Menu, app, BrowserWindow } from 'electron';
import path from 'path';
import { startBlocker, stopBlocker } from './power';
import { startMouseJiggle, stopMouseJiggle } from './mouse';
import { setOnFire, getState } from './store';
import { showWindow } from './window';

let tray: Tray | null = null;
let onFireEnabled = false;

function getIconPath(active: boolean): string {
  return path.join(app.getAppPath(), 'assets', active ? 'tray-active.ico' : 'tray-inactive.ico');
}

function broadcastState(): void {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('state-changed', { onFireEnabled });
  });
}

function updateTrayMenu(): void {
  if (!tray) return;

  tray.setImage(getIconPath(onFireEnabled));
  tray.setToolTip(onFireEnabled ? 'On Fire — Sleep prevention active' : 'On Fire — Inactive');

  const menu = Menu.buildFromTemplate([
    {
      label: onFireEnabled ? '❄ Disable On Fire Mode' : '🔥 Enable On Fire Mode',
      click: toggleOnFire,
    },
    { type: 'separator' },
    { label: '🪟 Open Application', click: showWindow },
    { type: 'separator' },
    { label: '❌ Exit Application', click: () => app.exit(0) },
  ]);

  tray.setContextMenu(menu);
}

export function toggleOnFire(): void {
  onFireEnabled = !onFireEnabled;

  if (onFireEnabled) {
    startBlocker();
    startMouseJiggle();
  } else {
    stopBlocker();
    stopMouseJiggle();
  }

  setOnFire(onFireEnabled);
  updateTrayMenu();
  broadcastState();
}

export function createTray(): void {
  const state = getState();
  onFireEnabled = state.onFireEnabled;

  tray = new Tray(getIconPath(onFireEnabled));

  if (onFireEnabled) {
    startBlocker();
    startMouseJiggle();
  }

  tray.on('click', toggleOnFire);
  updateTrayMenu();
}

export function getOnFireState(): boolean {
  return onFireEnabled;
}
