/**
 * Fulfillment options & ops coverage (not franchise territories).
 */
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { VehicleType } from './deliveryTypes';

export type VehicleToggle = {
  type: VehicleType;
  enabled: boolean;
  label: string;
};

export type OpsCoverageZone = {
  id: string;
  name: string;
  notes?: string;
  centerLat?: number;
  centerLng?: number;
  radiusKm?: number;
  active: boolean;
};

export type FulfillmentConfig = {
  vehicles: VehicleToggle[];
  droneFulfillmentEnabled: boolean;
  opsCoverage: OpsCoverageZone[];
  updatedAt?: any;
  updatedBy?: string;
};

export const DEFAULT_FULFILLMENT: FulfillmentConfig = {
  droneFulfillmentEnabled: true,
  vehicles: [
    { type: 'motorcycle', enabled: true, label: 'Okada (motorcycle)' },
    { type: 'bicycle', enabled: true, label: 'Bicycle' },
    { type: 'car', enabled: true, label: 'Car' },
    { type: 'van', enabled: true, label: 'Van' },
    { type: 'truck', enabled: false, label: 'Truck' },
    { type: 'drone', enabled: true, label: 'Drone' },
  ],
  opsCoverage: [
    {
      id: 'accra-central',
      name: 'Accra — central pilot',
      notes: 'Launch coverage; expand as density grows. Not a sold franchise territory.',
      centerLat: 5.56,
      centerLng: -0.18,
      radiusKm: 12,
      active: true,
    },
  ],
};

export async function getFulfillmentConfig(): Promise<FulfillmentConfig> {
  try {
    const snap = await getDoc(doc(db, 'config', 'fulfillment'));
    if (snap.exists()) {
      return { ...DEFAULT_FULFILLMENT, ...snap.data(), vehicles: snap.data().vehicles || DEFAULT_FULFILLMENT.vehicles } as FulfillmentConfig;
    }
  } catch {}
  return { ...DEFAULT_FULFILLMENT };
}

export async function saveFulfillmentConfig(cfg: FulfillmentConfig, adminId?: string) {
  await setDoc(doc(db, 'config', 'fulfillment'), {
    ...cfg,
    updatedAt: serverTimestamp(),
    updatedBy: adminId || 'admin',
  });
}

export function isVehicleEnabled(cfg: FulfillmentConfig, type: VehicleType): boolean {
  if (type === 'drone' && !cfg.droneFulfillmentEnabled) return false;
  const row = cfg.vehicles.find((v) => v.type === type);
  return row ? row.enabled : false;
}

export function enabledVehicleTypes(cfg: FulfillmentConfig): VehicleType[] {
  return cfg.vehicles
    .filter((v) => {
      if (v.type === 'drone' && !cfg.droneFulfillmentEnabled) return false;
      return v.enabled;
    })
    .map((v) => v.type);
}
