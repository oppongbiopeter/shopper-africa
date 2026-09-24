export type VehicleType =
  | 'motorcycle'
  | 'bicycle'
  | 'car'
  | 'van'
  | 'truck'
  | 'drone';

export type DeliveryStatus =
  | 'searching'
  | 'assigned'
  | 'heading_to_store'
  | 'at_store'
  | 'heading_to_customer'
  | 'nearby'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export type DeliveryAgent = {
  id: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  vehiclePlate?: string;
  droneId?: string;
  rating: number;
  photoUrl?: string;
  currentLat?: number;
  currentLng?: number;
  heading?: number;
  batteryPercent?: number;
  isOnline: boolean;
};

export type DeliveryJob = {
  orderId: string;
  agentId?: string;
  vehicleType?: VehicleType;
  status: DeliveryStatus;
  assignedAt?: number;
  pickedUpAt?: number;
  deliveredAt?: number;
  estimatedMinutes?: number;
  trackingUrl?: string;
  lat?: number;
  lng?: number;
  lastLocationAt?: number;
};

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  motorcycle: 'Okada (Motorcycle)',
  bicycle: 'Bicycle',
  car: 'Car',
  van: 'Van',
  truck: 'Truck',
  drone: 'Drone',
};

export const VEHICLE_ICONS: Record<VehicleType, string> = {
  motorcycle: '🏍',
  bicycle: '🚲',
  car: '🚗',
  van: '🚐',
  truck: '🚚',
  drone: '🛸',
};
