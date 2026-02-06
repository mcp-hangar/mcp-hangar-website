---
title: MCP Hangar Documentation
---

# MCP Hangar Documentation

**Parallel MCP Execution** — 50x faster tool calls for your AI agents.

<div class="tip custom-block" style="padding: 16px; border-radius: 8px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); margin: 24px 0;">
  <p style="margin: 0;"><strong>🚀 Quick Start:</strong> <a href="/docs/getting-started/quickstart">Get up and running in 2 minutes →</a></p>
</div>

## What is MCP Hangar?

MCP Hangar is a production-grade infrastructure layer for Model Context Protocol (MCP) providers. It enables:

- **⚡ Parallel Execution** — Batch multiple tool calls, execute simultaneously
- **🔄 Lifecycle Management** — Lazy loading, health monitoring, auto-restart
- **🛡️ Circuit Breakers** — Fault isolation, graceful degradation
- **📊 Observability** — OpenTelemetry traces, Prometheus metrics

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
| [Observability](/docs/guides/OBSERVABILITY) | Metrics, traces, logging |
| [Authentication](/docs/guides/AUTHENTICATION) | Secure your providers |
| [Containers](/docs/guides/CONTAINERS) | Docker and OCI providers |

## Performance

| Scenario | Time | Success Rate |
|----------|------|--------------|
| 15 tools, 2 providers | 380ms | 100% |
| Thundering herd (50 concurrent) | 1.3s | 100% |
| Cold start + batch | <500ms | 100% |
