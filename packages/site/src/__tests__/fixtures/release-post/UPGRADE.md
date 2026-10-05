# Upgrading

## Upgrade to 2.24.0

### `batch_call_refused` from a gate no longer carries `error`

The line keeps `gate` and `reason`. A query on `{error}` should move to `reason`.

<!-- release-please folds upgrade.d fragments above this line -->

```yaml
observability:
  tracing:
    caller_ids: true   # {not an expression}
```

## Upgrade to 2.23.0

### a stdio front door advertises tools.listChanged

Nothing to do.

## 2.6.0 — three things to check before you roll out

### 1. Per-tenant digest pins with authentication off now refuse the boot

Check `auth.enabled` when `<pins>` are tenant-keyed.

## 2.5.3 — two things a client may notice

Unrelated.
