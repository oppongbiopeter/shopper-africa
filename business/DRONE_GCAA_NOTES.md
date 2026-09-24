# Drone delivery — Ghana regulatory notes

## Product rules (app)

- Max payload ~2.5 kg
- Max range ~8 km
- Store must support drone
- Weather gate
- Customer confirms clear drop zone
- Abort → automatic fail-over to motorcycle (Okada)

## Regulatory (Ghana)

- GCAA RPAS / Part 28 style rules apply to commercial ops
- National UTM is largely CONOPS / feasibility (2025–2026 framing)
- **Shopper does not replace a certified operator** — app requests missions; licensed operator flies

## Architecture stance

Operator-partner model: fleet registry + nest + mission request + telemetry ingest; airspace clearance stays with operator/GCAA tools, not reinvented in-app.
