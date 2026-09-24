# Pricing, tax & locale (business rules)

## Countries (starter set)

| Code | Currency | Tax | Default lang | Payment rails (business) |
|------|----------|-----|--------------|---------------------------|
| GH | GHS | VAT 15% exclusive | en | MoMo, Telecel, AT Money, Paystack cards |
| NG | NGN | VAT 7.5% | en | Paystack, cards |
| KE | KES | VAT 16% | en | M-Pesa, cards |
| ZA | ZAR | VAT 15% inclusive | en | Cards, EFT |
| CI | XOF | TVA 18% | fr | Orange Money, MoMo, cards |
| SN | XOF | TVA 18% | fr | Wave, Orange Money, cards |
| UG | UGX | VAT 18% | en | MoMo, Airtel Money |
| TZ | TZS | VAT 18% | en | M-Pesa, Tigo Pesa |
| RW | RWF | VAT 18% | en | MoMo, cards |
| EG | EGP | VAT 14% | ar | Cards, Fawry |

## Fee model (customer)

- Subtotal (goods)
- Delivery fee (distance / express / peak — admin configurable)
- Service fee
- Tax (per country mode)
- Tip after delivery (passthrough to workers)

## Shopper earnings (Instacart-style, configurable)

- Base batch pay
- Heavy-item boost
- Peak multiplier
- Multi-order bonus
- Tips (passthrough)

Admin edits live in pricing config (Firestore `config/pricing`).
