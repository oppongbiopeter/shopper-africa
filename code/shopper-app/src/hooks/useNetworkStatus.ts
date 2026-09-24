import { useState, useEffect } from 'react';
import { getNetworkStatus, subscribeToNetwork, NetworkStatus } from '../services/offline';

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(getNetworkStatus());
  useEffect(() => {
    const unsub = subscribeToNetwork(setStatus);
    return unsub;
  }, []);
  return status;
}
