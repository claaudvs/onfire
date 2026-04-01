import { powerSaveBlocker } from 'electron';

let blockerId: number | null = null;

export function startBlocker(): void {
  if (blockerId === null) {
    blockerId = powerSaveBlocker.start('prevent-display-sleep');
  }
}

export function stopBlocker(): void {
  if (blockerId !== null && powerSaveBlocker.isStarted(blockerId)) {
    powerSaveBlocker.stop(blockerId);
    blockerId = null;
  }
}

export function isActive(): boolean {
  return blockerId !== null && powerSaveBlocker.isStarted(blockerId);
}
