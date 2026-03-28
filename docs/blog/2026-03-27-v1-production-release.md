---
title: "MCP Hangar v1.0 -- Production Release"
date: 2026-03-27
author: MCP Hangar Team
---

# MCP Hangar v1.0 -- Production Release

After months of iterative hardening, we are shipping MCP Hangar v1.0 -- the first production-grade release of the runtime security and governance layer for MCP servers.

This post covers what MCP Hangar is, what changed since the early prototypes, the architecture that makes it work, and the benchmark numbers that back it up.

## What is MCP Hangar?

MCP Hangar sits between AI/LLM tools and the MCP servers they call. It intercepts every tool invocation, applies security policies, propagates caller identity, records a compliance-grade audit trail, and orchestrates parallel execution across providers.

The core use case: you have multiple MCP servers (filesystem, fetch, memory, custom tools), and you need visibility and control over what your AI agents are doing with them. Hangar gives you that without modifying any server code.

## The path to v1.0

The project started as a Python library focused on parallel MCP tool execution. Over successive releases it grew into a multi-component system:

- **v0.1 -- v0.8**: Core proxy, subprocess provider management, circuit breakers, health checks, parallel batch execution.
- **v0.9 -- v0.12**: HTTP gateway, REST API, WebSocket streaming, provider groups with load balancing and failover, Docker/Kubernetes discovery.
- **v0.13 -- v0.14**: Authentication stack (API keys, JWT/OIDC, identity propagation), audit trail with CEF export, behavioral profiling.
- **v0.15**: Kubernetes operator (MCPProvider and MCPProviderGroup CRDs), validating admission webhooks, NetworkPolicy generation. Web dashboard with fleet overview and audit log viewer.
- **v1.0**: Production hardening. Performance benchmarks, CI security scanning (Trivy, Semgrep, gosec), dependency audits with SBOM generation, upgrade documentation, and this release.

## Architecture

MCP Hangar is a multi-language, multi-component system designed for both standalone and enterprise deployment:

**Python core** (`mcp-hangar` on PyPI) -- The main proxy and governance engine. Domain-driven design with event sourcing, CQRS command/query separation, and a single-flight deduplication layer. This is what most users install.

**Go sidecar** (`hangar-agent`) -- A data-plane agent that runs alongside your workloads in Kubernetes. It intercepts MCP traffic, applies policies from the Go policy engine, and streams events to the control plane over a bidirectional gRPC connection.

**Go control plane** (`hangar-cloud`) -- The SaaS backend that aggregates events from agents, manages policies, and serves the dashboard API. Agents connect outbound on port 443, so no inbound firewall rules are needed.

**React dashboard** (`hangar-app`) -- Fleet-wide visibility into agent health, MCP server inventory, audit logs, and policy management. Built with React 19 and served either by the Hangar HTTP server or the cloud control plane.

**Kubernetes operator** -- Manages MCPProvider and MCPProviderGroup custom resources. Includes validating admission webhooks, leader election, health probes, and automatic NetworkPolicy generation for egress control.

## Performance

v1.0 ships with comprehensive benchmark suites for both the Python and Go components. The numbers that matter:

| Component | Metric | Result |
|-----------|--------|--------|
| Python proxy | Full path latency (p50 / p99) | 0.21ms / 0.24ms |
| Python proxy | SLA target | 20x margin under 5ms |
| Go policy engine | 1,000 policies evaluation | 6.5 microseconds |
| Go event buffer | WAL-backed persist | 158 microseconds |
| Go event mapping | Domain event transform | 5.3 microseconds |
| End-to-end | 15 tools, 2 providers, parallel | 380ms |

The Python proxy adds less than a quarter-millisecond of overhead at p99. The Go policy engine evaluates a thousand rules in under 7 microseconds. These numbers were measured with pytest-benchmark and Go's standard benchmark tooling, running in CI on every commit.

## Security

Production readiness means more than performance. v1.0 includes:

- **CI security scanning**: Trivy container scanning, Semgrep static analysis, and golangci-lint with gosec enabled across all components. Pinned to specific versions for reproducible results.
- **Dependency auditing**: pip-audit for Python, npm audit (blocking on HIGH+) for the dashboard, govulncheck for Go components. SBOM generation for all five components.
- **Auth stack coverage**: 97.5% test coverage on the authentication and authorization code paths, including API key validation, JWT verification, identity propagation, and rate limiting.
- **Upgrade path**: A detailed upgrade guide covers every breaking change from v0.12 through v1.0, with step-by-step procedures for PyPI, Docker, and Kubernetes deployments.

## Licensing

MCP Hangar core is MIT licensed. Enterprise features (the Go agent, cloud control plane, and operator) use the Business Source License 1.1, which converts to open source after four years. This model lets us invest in the project while keeping the core permanently open.

## Getting started

Install and run:

```bash
curl -sSL https://mcp-hangar.io/install.sh | bash
mcp-hangar serve
```

Or with pip:

```bash
pip install mcp-hangar
```

For Kubernetes deployments, see the [Helm charts](https://github.com/mcp-hangar/helm-charts) and [operator documentation](/docs/guides/KUBERNETES.html).

Read the full [quickstart guide](/docs/getting-started/quickstart.html) or browse the [cookbook](/docs/cookbook/) for 13 recipes covering everything from HTTP gateway setup to production checklists.

## What comes next

The v1.0 release is a foundation. Near-term work includes:

- **Helm chart hardening**: Pod security standards, resource quotas, network policy tightening.
- **Operator HA**: Multi-replica leader election, disruption budgets, graceful failover.
- **CRD versioning**: Conversion webhooks for non-breaking schema evolution.

Follow the project on [GitHub](https://github.com/mcp-hangar/mcp-hangar) or check the [upgrade guide](/docs/upgrade.html) if you are migrating from an earlier version.
