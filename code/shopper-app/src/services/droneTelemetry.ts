import { doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type DroneTelemetryPacket = {
  droneId: string; lat: number; lng: number; altitudeM: number; speedKmh: number;
  batteryPercent: number; heading: number;
  flightStatus: 'idle' | 'takeoff' | 'enroute' | 'hovering' | 'landing' | 'delivered' | 'returning' | 'emergency';
  orderId?: string; signalStrength?: number; timestamp: number;
};

export async function ingestDroneTelemetry(packet: DroneTelemetryPacket) {
  const agentRef = doc(db, 'agents', packet.droneId);
  await updateDoc(agentRef, {
    currentLat: packet.lat, currentLng: packet.lng, heading: packet.heading,
    batteryPercent: packet.batteryPercent, altitudeM: packet.altitudeM, speedKmh: packet.speedKmh,
    flightStatus: packet.flightStatus, lastTelemetryAt: serverTimestamp(),
    isOnline: packet.flightStatus !== 'idle' && packet.flightStatus !== 'emergency',
  }).catch(async () => {
    await setDoc(agentRef, {
      id: packet.droneId, name: `Drone ${packet.droneId}`, phone: '', vehicleType: 'drone',
      droneId: packet.droneId, rating: 5, currentLat: packet.lat, currentLng: packet.lng,
      batteryPercent: packet.batteryPercent, isOnline: true, flightStatus: packet.flightStatus,
      lastTelemetryAt: serverTimestamp(),
    });
  });
  if (packet.orderId) {
    await updateDoc(doc(db, 'deliveryJobs', packet.orderId), {
      lat: packet.lat, lng: packet.lng, lastLocationAt: packet.timestamp || Date.now(),
      batteryPercent: packet.batteryPercent, altitudeM: packet.altitudeM, flightStatus: packet.flightStatus,
    }).catch(() => {});
    await updateDoc(doc(db, 'orders', packet.orderId), {
      'delivery.lat': packet.lat, 'delivery.lng': packet.lng,
      'delivery.lastLocationAt': packet.timestamp || Date.now(),
      'delivery.batteryPercent': packet.batteryPercent, 'delivery.altitudeM': packet.altitudeM,
      'delivery.flightStatus': packet.flightStatus,
    }).catch(() => {});
  }
}

export async function simulateDroneFlight(opts: {
  droneId: string; orderId: string; from: { lat: number; lng: number }; to: { lat: number; lng: number }; steps?: number;
}) {
  const steps = opts.steps || 12;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = opts.from.lat + (opts.to.lat - opts.from.lat) * t;
    const lng = opts.from.lng + (opts.to.lng - opts.from.lng) * t;
    let flightStatus: DroneTelemetryPacket['flightStatus'] = 'enroute';
    if (i === 0) flightStatus = 'takeoff';
    if (i === steps) flightStatus = 'delivered';
    await ingestDroneTelemetry({
      droneId: opts.droneId, orderId: opts.orderId, lat, lng,
      altitudeM: 40 + Math.sin(t * Math.PI) * 30, speedKmh: 35,
      batteryPercent: Math.max(20, 95 - i * 4), heading: 90, flightStatus, timestamp: Date.now(),
    });
    await new Promise((r) => setTimeout(r, 1200));
  }
}
