# Cloud Dashboard

::: warning LAUNCHING SEPTEMBER 2026
The cloud dashboard is in development and not yet publicly available. This page describes the planned functionality. [Join early access](https://app.mcp-hangar.io/early-access) to be notified at launch.
:::

The Hangar Cloud dashboard provides fleet-wide visibility into your MCP infrastructure.

## Fleet Overview

The main dashboard shows all connected agents, their MCP servers, and current health status.

<!-- TODO: screenshot placeholder -->

### Agent List

Each connected agent reports:

- **Status** — Online, degraded, or offline
- **MCP Servers** — Count and state distribution (ready, degraded, dead)
- **Tools** — Total tool count across all MCP servers
- **Uptime** — Time since last restart
- **Version** — Agent version and configuration hash

### MCP Server Health

Drill into any agent to see individual MCP server health:

- State machine visualization (COLD → READY → DEGRADED → DEAD)
- Circuit breaker status and failure counts
- Latency percentiles (p50, p95, p99)
- Tool call throughput

## Audit Trail

The audit trail records every tool invocation across your fleet with identity tracking.

### Filtering

Filter audit records by:

- **Time range** — Last hour, 24h, 7d, 30d, or custom
- **Agent** — Specific agent or all agents
- **MCP Server** — Specific MCP server
- **Caller** — Identity of the invoker
- **Severity** — Info, warning, error
- **Event type** — Tool call, lifecycle, policy violation

### CEF Export

Export audit records in Common Event Format for compliance:

```
GET /api/observability/audit/export?format=cef&from=2026-03-01&to=2026-03-28
```

Supported formats: `cef`, `json`, `csv`.

## Metrics Charts

Live metrics visualizations for:

- Tool call rate (calls/second)
- Error rate and circuit breaker trips
- Latency distribution
- MCP Server state distribution over time
- Top callers by volume

## Policy Management

> Available on Pro and Enterprise plans.

Create and push policies to agents in real time:

- Tool access filtering (allow/deny lists)
- Rate limiting per caller or MCP server
- Execution timeouts
- Required authentication levels

See [Teams & Roles](/cloud/teams) for permission management.

