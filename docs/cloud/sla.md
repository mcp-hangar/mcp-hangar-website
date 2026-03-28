# SLA & Uptime

Service level agreements for Hangar Cloud.

## Availability

| Plan | Uptime SLA | Support Response |
|------|-----------|-----------------|
| Pro | 99.5% | 24h (business days) |
| Enterprise | 99.9% | 4h (24/7) |

Uptime is measured monthly and excludes scheduled maintenance windows.

## Status Page

Current platform status and incident history: [status.mcp-hangar.io](https://status.mcp-hangar.io)

Subscribe to notifications via email or webhook.

## Scheduled Maintenance

Maintenance windows are announced at least 72 hours in advance via:

- Status page
- Email to organization owners
- In-dashboard notification

Typical maintenance windows: Tuesdays 06:00–08:00 UTC.

## Incident Response

| Severity | Description | Response Time (Enterprise) |
|----------|-------------|---------------------------|
| **P1** — Platform outage | Dashboard and API unavailable | 30 minutes |
| **P2** — Degraded service | Partial functionality impacted | 2 hours |
| **P3** — Minor issue | Non-critical feature affected | 4 hours |
| **P4** — Informational | Cosmetic or documentation issue | Next business day |

## Data Residency

Hangar Cloud runs on:

- **Primary**: AWS eu-central-1 (Frankfurt)
- **DR**: AWS eu-west-1 (Ireland)

Enterprise customers can request dedicated tenancy or custom data residency.

## Credits

If monthly uptime falls below the SLA target, service credits are applied:

| Uptime | Credit |
|--------|--------|
| 99.0% – 99.9% | 10% of monthly fee |
| 95.0% – 99.0% | 25% of monthly fee |
| < 95.0% | 50% of monthly fee |

Credits are applied automatically to the next invoice.

