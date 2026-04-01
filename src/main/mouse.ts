import robot from 'robotjs';

let intervalId: NodeJS.Timeout | null = null;
let lastMoveTime = Date.now();

export function startMouseJiggle(idleMinutes = 5, movePixels = 2): void {
  const idleMs = idleMinutes * 60 * 1000;

  intervalId = setInterval(() => {
    const pos = robot.getMousePos();
    const now = Date.now();
    const idleTime = now - lastMoveTime;

    if (idleTime >= idleMs) {
      const originalX = pos.x;
      const originalY = pos.y;

      robot.moveMouse(originalX + movePixels, originalY + movePixels);

      setTimeout(() => {
        robot.moveMouse(originalX, originalY);
      }, 300);

      lastMoveTime = Date.now();
    }
  }, 10000);
}

export function stopMouseJiggle(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function updateMouseActivity(): void {
  lastMoveTime = Date.now();
}

export function isMouseActive(): boolean {
  return intervalId !== null;
}
