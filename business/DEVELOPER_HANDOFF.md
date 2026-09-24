# Developer handoff — Shopper Africa

## Package layout

```
shopper-africa-package/
  code/
    shopper-app/          ← React Native application (run this)
  business/
    PRODUCT_OVERVIEW.md
    PRICING_TAX_LOCALE.md
    OWNERSHIP_AND_GROWTH.md
    OPS_OFFLINE_CONFLICTS.md
    DEVELOPER_HANDOFF.md  ← this file
    DRONE_GCAA_NOTES.md
    GHANA_FILING_CHECKLIST.md
    LAUNCH_PLAYBOOK.md
    WHATSAPP_INTEGRATION.md
```

## Run the code

```bash
cd code/shopper-app
npm install --legacy-peer-deps
npm run test:core
npx --yes serve web-preview -p 3000   # browser UI mock
# Device: npx react-native run-android
```

## Configure before production

1. Firebase project → `src/firebase.ts`
2. Paystack secret → Cloud Functions env only (`PAYSTACK_SECRET_KEY`)
3. Firestore `config/paystack` public key + callback
4. MoMo webhook endpoint
5. Pricing / geofence / drone rules via Admin or Firestore config

## Key code map

| Business concern | Code |
|------------------|------|
| Locale / tax / FX display | `src/services/localeConfig.ts` |
| Growth | `src/services/growthAfrica.ts` |
| Offline queue | `src/services/offline.ts` |
| Conflicts | `src/services/conflictResolution.ts` |
| Paystack | `src/services/paystack.ts` |
| WhatsApp | `src/services/whatsapp.ts` |
| Drone | `droneEligibility.ts`, `droneFleet.ts` |
| Earnings | `earnings.ts`, `pricingConfig.ts` |

## Demo mode

Works for logic tests and web preview without live Firebase keys. Full device flows need Firebase + (optional) Paystack test keys.
