# Shopper Ghana

Instacart-style grocery marketplace for Ghana / West Africa.

**Stack:** React Native 0.74 · Firebase · MoMo + Paystack · offline-first · multi-vehicle delivery (Okada, car, drone)

## Roles

Customer · Personal Shopper · Rider/Drone · Merchant · Admin

## Quick start

```bash
npm install --legacy-peer-deps
npm run test:core
npx --yes serve web-preview -p 3000
```

Configure Firebase in `src/firebase.ts`. Paystack secret only in Cloud Functions env `PAYSTACK_SECRET_KEY`.

Product model: platform-owned customers, tips after delivery, Paystack + MoMo, no franchise territories.
