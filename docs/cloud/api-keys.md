# API Keys

Platform API keys allow programmatic access to the Hangar Cloud API.

## Creating an API Key

1. Navigate to **Settings → API Keys**
2. Click **Create Key**
3. Enter a descriptive name (e.g., "CI/CD pipeline", "Monitoring script")
4. Select permissions scope
5. Copy the key — it will only be shown once

API keys use the format: `hngr_pk_...`

## Permission Scopes

| Scope | Description |
|-------|-------------|
| `read:fleet` | View agents, providers, and health status |
| `read:audit` | Query audit trail records |
| `read:metrics` | Access metrics and dashboards |
| `write:policies` | Create and update policies |
| `write:agents` | Manage agent tokens |
| `admin` | Full API access |

## Using the API

```bash
curl -H "Authorization: Bearer hngr_pk_..." \
     https://api.mcp-hangar.io/v1/fleet/agents
```

See the [Cloud API Reference](https://api.mcp-hangar.io/docs) for full endpoint documentation.

## Key Rotation

1. Create a new key with the same permissions
2. Update your integrations to use the new key
3. Revoke the old key

Keys can be revoked immediately from **Settings → API Keys**.

## Rate Limits

| Plan | Rate Limit |
|------|-----------|
| Pro | 100 requests/minute |
| Enterprise | 1,000 requests/minute |

Rate limit headers are included in every response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1711612800
```

