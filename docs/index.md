---
title: MCP Hangar Documentation
---

# MCP Hangar Documentation

**Parallel MCP Execution** — 50x faster tool calls for your AI agents.

<div class="tip custom-block" style="padding: 16px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); margin: 24px 0;">
  <p style="margin: 0;"><strong>🚀 One-Liner Install:</strong> <code>curl -sSL https://mcp-hangar.io/install.sh | bash && mcp-hangar init -y && mcp-hangar serve</code></p>
</div>

## What is MCP Hangar?

MCP Hangar is a production-grade control plane for Model Context Protocol (MCP) providers. It enables:

- **⚡ Parallel Execution** — Batch multiple tool calls, execute simultaneously
- **🔄 Hot-Reload Config** — Live configuration changes without restart
- **🛡️ Circuit Breakers** — Fault isolation, automatic failover
- **📊 Observability** — OpenTelemetry traces, Prometheus metrics, Langfuse

## What's New in v0.6.6

- **Cookbook** — Step-by-step production recipes (Gateway, Health, Circuit Breaker, Failover)
- **Hot-Reload** — File watching, SIGHUP, or `hangar_reload_config` MCP tool
- **Smart Init** — Runtime detection, smoke tests, config merging
- **One-Liner** — Zero-interaction install and setup

## Getting Started

| Guide | Description |
|-------|-------------|
| [Installation](/docs/getting-started/installation) | Install via pip, curl, or from source |
| [Quick Start](/docs/getting-started/quickstart) | Your first parallel MCP call |
| [CLI Reference](/docs/reference/cli) | All available commands |

## Core Guides

| Guide | Description |
|-------|-------------|
| [Batch Invocations](/docs/guides/BATCH_INVOCATIONS) | Parallel execution deep dive |
| [Hot-Reload](/docs/reference/hot-reload) | Live configuration reloading |
| [Observability](/docs/guides/OBSERVABILITY) | Metrics, traces, logging |
| [Authentication](/docs/guides/AUTHENTICATION) | Secure your providers |
| [Containers](/docs/guides/CONTAINERS) | Docker and OCI providers |
| [Kubernetes](/docs/guides/KUBERNETES) | K8s operator and CRDs |

## Integrations

| Integration | Description |
|-------------|-------------|
| [OpenLIT (OTLP)](/docs/integrations/openlit-otlp) | Send OTLP traces and metrics to OpenLIT |

## Performance

| Scenario | Time | Success Rate |
|----------|------|--------------|
| 15 tools, 2 providers | 380ms | 100% |
| Thundering herd (50 concurrent) | 1.3s | 100% |
| Cold start + batch | <500ms | 100% |
