export type PaymentMethodId = 'mtn_momo' | 'telecel_cash' | 'airteltigo_money' | 'visa' | 'mastercard';
export type PaymentChannel = 'mobile_money' | 'card';
export type PaymentMethod = {
  id: PaymentMethodId; channel: PaymentChannel; label: string; shortLabel: string;
  hint?: string; brand?: 'visa' | 'mastercard'; enabled: boolean;
};
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'mtn_momo', channel: 'mobile_money', label: 'MTN Mobile Money', shortLabel: 'MoMo', hint: 'Approve on phone or dial *170#', enabled: true },
  { id: 'telecel_cash', channel: 'mobile_money', label: 'Telecel Cash', shortLabel: 'Telecel', hint: 'Approve in Telecel Cash app', enabled: true },
  { id: 'airteltigo_money', channel: 'mobile_money', label: 'AirtelTigo Money', shortLabel: 'AT Money', hint: 'Approve in AirtelTigo Money app', enabled: true },
  { id: 'visa', channel: 'card', label: 'Visa', shortLabel: 'Visa', brand: 'visa', hint: 'Pay securely with Visa', enabled: true },
  { id: 'mastercard', channel: 'card', label: 'Mastercard', shortLabel: 'Mastercard', brand: 'mastercard', hint: 'Pay securely with Mastercard', enabled: true },
];
export function getMethod(id: PaymentMethodId): PaymentMethod {
  return PAYMENT_METHODS.find((m) => m.id === id) || PAYMENT_METHODS[0];
}
export function isMobileMoney(id: PaymentMethodId) { return getMethod(id).channel === 'mobile_money'; }
export function isCard(id: PaymentMethodId) { return getMethod(id).channel === 'card'; }

import type { CountryCode } from './localeConfig';
import { COUNTRY_PROFILES } from './localeConfig';
export function methodsForCountry(country: CountryCode) {
  const rails = new Set(COUNTRY_PROFILES[country]?.paymentRails || []);
  const map: Record<string, PaymentMethodId | null> = {
    mtn_momo: 'mtn_momo', telecel_cash: 'telecel_cash', airteltigo_money: 'airteltigo_money',
    visa: 'visa', mastercard: 'mastercard', paystack: 'visa', mpesa: 'mtn_momo',
    orange_money: 'mtn_momo', wave: 'telecel_cash', opay: 'visa', palm_pay: 'visa',
    airtel_money: 'airteltigo_money', tigopesa: 'telecel_cash', momo: 'mtn_momo', fawry: 'visa', eft: 'visa',
  };
  const ids = new Set<PaymentMethodId>();
  for (const r of rails) { const id = map[r]; if (id) ids.add(id); }
  if (rails.has('paystack') || rails.has('visa')) { ids.add('visa'); ids.add('mastercard'); }
  const list = PAYMENT_METHODS.filter((m) => m.enabled && ids.has(m.id));
  return list.length ? list : PAYMENT_METHODS.filter((m) => m.enabled);
}
