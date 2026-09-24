# Shopper Africa — 90-day user acquisition playbook

**Product:** Instacart-style grocery marketplace (Ghana-first)
**Model:** Platform-owned customers · Paystack + MoMo · tips after delivery
**Not in scope:** Franchise territories, exclusive zip sales, merchant CRM imports

## North-star rules

1. Density first — acquire only inside active ops coverage.
2. Second order > install — measure cost per user who orders twice in 14 days.
3. Supply with demand — stores + shoppers + riders before paid ads scale.
4. WhatsApp-native — share links, recovery, and support on WhatsApp.

## Channel checklist

| Channel | Week 1–4 | Week 5–8 | Week 9–12 | Owner |
|---------|----------|----------|-----------|--------|
| In-app referral + WhatsApp share | ON | ON | ON | Growth |
| Abandoned WhatsApp/SMS sequence | ON | ON | Optimize | Growth |
| First-order credit (e.g. FIRST20) | ON | ON | Taper if CAC OK | Growth |
| Store till QR / poster | Seed 15 stores | 30 stores | All zone stores | Partnerships |
| Meta ads (geo-fenced) | Test GHS 50–100/day | Scale winners | Double down | Growth |
| Campus / office ambassadors | 5 ambassadors | 15 | Maintain | Ops |
| TikTok creators | Off | Pilot 5 | Scale if CAC good | Growth |

## Campaign copy

Referral WhatsApp: I order groceries on Shopper — use my code {{code}} and we both get {{amount}} credit.

Abandoned: +1h WhatsApp, +24h SMS, +72h WhatsApp with {{code}} / {{amount}} / {{link}}.

First-order: FIRST20, GHS 20 off, min basket GHS 80 (all configurable).

## 90-day plan

Days 1–30: one ops zone, 15–30 stores, shoppers + riders, referral + first-order + abandoned on.
Days 31–60: geo-fenced ads, kill bad CAC channels.
Days 61–90: scale winners, add adjacent zone only if NPS is solid.

## App wiring

`acquisitionConfig.ts`, `growthAfrica.ts`, Admin → Growth.
