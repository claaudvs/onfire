interface ElectronAPI {
  getState: () => Promise<{ onFireEnabled: boolean }>;
  toggleOnFire: () => void;
  onStateChanged: (cb: (state: { onFireEnabled: boolean }) => void) => void;
  mouseActivity: () => void;
}

const api = (window as unknown as { electronAPI: ElectronAPI }).electronAPI;

const toggleBtn   = document.getElementById('toggle-btn')  as HTMLButtonElement;
const statusText  = document.getElementById('status-text') as HTMLSpanElement;
const brandEmoji  = document.getElementById('brand-emoji') as HTMLSpanElement;

function updateUI(onFireEnabled: boolean): void {
  // Core elements
  toggleBtn.textContent  = onFireEnabled ? 'Disable On Fire' : 'Enable On Fire';
  toggleBtn.className    = onFireEnabled ? 'toggle-btn active' : 'toggle-btn';
  statusText.textContent = onFireEnabled ? 'Sleep prevention active' : 'System running normally';

  // Brand emoji + window title
  brandEmoji.textContent = onFireEnabled ? '🔥' : '❄️';
  document.title         = onFireEnabled ? '🔥 On Fire' : '❄️ On Fire';

  // Dashboard badge
  const badge = document.getElementById('badge');
  if (badge) {
    badge.textContent = onFireEnabled ? 'Active' : 'Inactive';
    badge.className   = onFireEnabled ? 'badge active' : 'badge';
  }

  // Main card border
  const mainCard = document.getElementById('main-card');
  if (mainCard) mainCard.className = onFireEnabled ? 'main-card active' : 'main-card';

  // State ring + text
  const stateRing = document.getElementById('state-ring');
  const stateText = document.getElementById('state-text');
  if (stateRing) stateRing.className = onFireEnabled ? 'state-ring active' : 'state-ring';
  if (stateText) {
    stateText.textContent = onFireEnabled ? 'ON' : 'OFF';
    stateText.className   = onFireEnabled ? 'state-text active' : 'state-text';
  }

  // Status dot
  const statusDot = document.getElementById('status-dot');
  if (statusDot) statusDot.className = onFireEnabled ? 'status-dot active' : 'status-dot';

  // Stat cards
  const mouseStat = document.getElementById('mouse-stat');
  const powerStat = document.getElementById('power-stat');
  if (mouseStat) {
    mouseStat.textContent = onFireEnabled ? 'Active' : 'Inactive';
    mouseStat.className   = onFireEnabled ? 'stat-val active' : 'stat-val';
  }
  if (powerStat) {
    powerStat.textContent = onFireEnabled ? 'Active' : 'Inactive';
    powerStat.className   = onFireEnabled ? 'stat-val active' : 'stat-val';
  }
}

toggleBtn.addEventListener('click', () => {
  api.toggleOnFire();
});

document.addEventListener('mousemove', () => api.mouseActivity());

api.onStateChanged((state: { onFireEnabled: boolean }) => {
  updateUI(state.onFireEnabled);
});

api.getState().then((state: { onFireEnabled: boolean }) => {
  updateUI(state.onFireEnabled);
});
