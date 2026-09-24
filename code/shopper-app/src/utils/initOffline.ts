import { initNetworkListener, flushQueue } from '../services/offline';

export function initOffline() {
  const unsubNetwork = initNetworkListener();
  flushQueue().catch(console.warn);
  return () => {
    unsubNetwork();
  };
}
