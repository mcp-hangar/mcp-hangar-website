---
title: OSS Agent Documentation
---

# MCP Hangar -- OSS Agent

**Production-grade MCP runtime** -- parallel execution, circuit breakers, policy files, and local audit trail.

<div class="tip custom-block" style="padding: 16px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); margin: 24px 0;">
  <p style="margin: 0;"><strong>One-Liner Install:</strong> <code>curl -sSL https://mcp-hangar.io/install.sh | bash && mcp-hangar init -y && mcp-hangar serve</code></p>
</div>

## What is the MCP Hangar Agent?

The `mcp-hangar` agent is an open-source, MIT-licensed runtime for Model Context Protocol (MCP) MCP servers. It runs on your machine or server and provides:

- **Parallel Execution** -- Batch multiple tool calls, execute simultaneously
- **Hot-Reload Config** -- Live configuration changes without restart
- **Circuit Breakers** -- Fault isolation, automatic failover
- **Observability** -- OpenTelemetry traces, Prometheus metrics

> **Looking for the managed cloud platform?** Hangar Cloud launches in September 2026. See [Hangar Cloud Docs](/cloud/) for details, or [join early access](https://app.mcp-hangar.io/early-access).

## Getting Started

| Guide | Description |
|-------|-------------|
| [Installation](/oss/getting-started/installation) | Install via pip, curl, or from source |
| [Quick Start](/oss/getting-started/quickstart) | Your first parallel MCP call |
| [CLI Reference](/oss/reference/cli) | All available commands |

## Core Guides

| Guide | Description |
|-------|-------------|
| [Batch Invocations](/oss/guides/BATCH_INVOCATIONS) | Parallel execution deep dive |
| [Hot-Reload](/oss/reference/hot-reload) | Live configuration reloading |
| [Observability](/oss/guides/OBSERVABILITY) | Metrics, traces, logging |
| [Authentication](/oss/guides/AUTHENTICATION) | Secure your MCP servers |
| [Containers](/oss/guides/CONTAINERS) | Docker and OCI MCP servers |
| [Kubernetes](/oss/guides/KUBERNETES) | K8s operator and CRDs |

## Integrations

| Integration | Description |
|-------------|-------------|
| [OpenLIT (OTLP)](/oss/integrations/openlit-otlp) | Send OTLP traces and metrics to OpenLIT |

## Performance

| Scenario | Time | Success Rate |
|----------|------|--------------|
| 15 tools, 2 MCP servers | 380ms | 100% |
| Thundering herd (50 concurrent) | 1.3s | 100% |
| Cold start + batch | <500ms | 100% |
