import Store from 'electron-store';

interface AppState {
  onFireEnabled: boolean;
  autoStart: boolean;
}

const store = new Store<AppState>({
  defaults: {
    onFireEnabled: false,
    autoStart: false,
  },
});

export function getState(): AppState {
  return {
    onFireEnabled: store.get('onFireEnabled'),
    autoStart: store.get('autoStart'),
  };
}

export function setOnFire(enabled: boolean): void {
  store.set('onFireEnabled', enabled);
}

export function setAutoStart(enabled: boolean): void {
  store.set('autoStart', enabled);
}
