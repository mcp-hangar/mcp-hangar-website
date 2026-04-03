# Agent Connection

::: warning LAUNCHING SEPTEMBER 2026
Cloud connectivity will be available when Hangar Cloud launches. You can install and use the OSS agent in standalone mode today. This page describes the connection flow that will be available at launch.
:::

Connect your open-source `mcp-hangar` agent to Hangar Cloud for centralized monitoring, audit trail, and policy management.

## Prerequisites

- `mcp-hangar` agent installed ([Installation guide](/docs/oss/getting-started/installation))
- A Hangar Cloud account (available September 2026 — [join early access](https://app.mcp-hangar.io/early-access))

## Generate an Agent Token

1. Log in to [app.mcp-hangar.io](https://app.mcp-hangar.io)
2. Navigate to **Settings → Agent Tokens**
3. Click **Create Token**
4. Copy the token — format: `hngr_agt_...`

## Configure the Agent

Add the `cloud` section to your agent configuration:

```yaml
# ~/.config/mcp-hangar/config.yaml

cloud:
  enabled: true
  token: "hngr_agt_..."
  endpoint: "https://api.mcp-hangar.io"

  # Optional: control what gets sent
  telemetry:
    send_audit: true      # Audit trail events
    send_metrics: true    # Prometheus-style metrics
    send_traces: false    # OpenTelemetry traces (high volume)

  # Optional: buffering for intermittent connectivity
  buffer:
    max_size: 10000       # Max events to buffer locally
    flush_interval_s: 5   # Flush interval in seconds

# ... existing provider config ...
providers:
  filesystem:
    mode: subprocess
    command: [npx, -y, "@anthropic/mcp-server-filesystem"]
    args: [/Users/you/Documents]
```

## Start the Agent

```bash
mcp-hangar serve
```

The agent will:

1. Start all configured providers
2. Establish a connection to Hangar Cloud
3. Begin streaming audit events and metrics
4. Accept policy updates from the cloud dashboard

## Verify Connection

In the Hangar Cloud dashboard, your agent should appear within 10 seconds under **Fleet → Agents**.

From the CLI:

```bash
mcp-hangar status
# Should show: Cloud: connected (api.mcp-hangar.io)
```

## Multiple Instances

Each running `mcp-hangar serve` process is one **Hangar instance**. Each instance needs its own token. Generate one token per machine / environment:

```yaml
# Production server
cloud:
  token: "hngr_agt_prod_abc123..."

# Development machine
cloud:
  token: "hngr_agt_dev_def456..."
```

Tokens can be labeled in the dashboard for easy identification.

> **Free tier note:** The OSS agent works with unlimited MCP providers in standalone mode. Cloud connectivity adds fleet visibility and centralized policy management.

## Offline Mode

If the agent loses connection to Hangar Cloud:

- **Providers continue working** — no impact on MCP tool execution
- **Events are buffered locally** — up to `buffer.max_size`
- **Reconnection is automatic** — with exponential backoff
- **Buffered events are flushed** — once connection is restored

The agent never depends on cloud availability for core functionality.

## Security

- Agent tokens are scoped to a single organization
- All communication uses TLS 1.3
- Tokens can be revoked instantly from the dashboard
- No provider data (tool inputs/outputs) is sent — only metadata and audit events

