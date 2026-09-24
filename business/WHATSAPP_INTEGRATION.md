# WhatsApp Business API — Shopper Africa

## Architecture

- **React Native:** enqueue only + `wa.me` share links (no secrets)
- **Firestore `whatsapp_outbox`:** queued template/session jobs
- **Cloud Functions:** send via Meta Cloud API, webhook, scheduled drain, order status trigger

## Templates (approve in Meta)

| Name | Category | When |
|------|----------|------|
| order_confirmed | utility | paid |
| shopper_assigned | utility | shopper assigned |
| out_for_delivery | utility | out for delivery |
| order_delivered | utility | delivered (+ tip in app) |
| abandoned_reminder | marketing | acquisition sequence (opt-in) |
| auth_otp | authentication | optional login |

## Env

```
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=shopper_wa_verify
WHATSAPP_GRAPH_VERSION=v21.0
```

## Opt-in

Marketing sends require `users/{id}.whatsappOptIn === true` (`setWhatsAppOptIn`).
