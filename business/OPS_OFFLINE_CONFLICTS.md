# Operations: offline sync & conflicts

## Offline outbox

1. Client creates order id + payment ref **before** network
2. Queue persists on device (survives app kill)
3. On online: priority flush (orders/status first)
4. Backoff + jitter on failure
5. After max retries → **dead letter**
6. Admin → Offline Sync: metrics, retry, dismiss

## Conflict rules

| Situation | Rule |
|-----------|------|
| Money status `paid` / `refunded` | Server / webhook only |
| Illegal status jump | Reject + optional dispute |
| Duplicate event id | Ignore (idempotent) |
| Two shoppers claim batch | CAS — first wins |
| Two riders claim job | CAS — first wins |
| Unresolvable | `disputes` queue |

## Status lifecycle (simplified)

```
pending_payment → paid → shopper_assigned → shopping → shopping_complete
  → out_for_delivery → delivered → closed
```

Terminal: cancelled, failed, refunded.
