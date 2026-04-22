---
title: "MCP Hangar v1.0 -- Production Release"
date: 2026-04-11
author: MCP Hangar Team
---

# MCP Hangar v1.0 -- Production Release

After months of iterative hardening, we are shipping MCP Hangar v1.0 -- the first production-grade release of the runtime security and governance layer for MCP servers.

This post covers what MCP Hangar is, what changed since the early prototypes, the architecture that makes it work, and the benchmark numbers that back it up.

## What is MCP Hangar?

MCP Hangar sits between AI/LLM tools and the MCP servers they call. It intercepts every tool invocation, applies security policies, propagates caller identity, records a compliance-grade audit trail, and orchestrates parallel execution across MCP servers.

The core use case: you have multiple MCP servers (filesystem, fetch, memory, custom tools), and you need visibility and control over what your AI agents are doing with them. Hangar gives you that without modifying any server code.

## The path to v1.0

The project started as a Python library focused on parallel MCP tool execution. Over 22 releases it grew into a multi-component system:

- **v0.1 -- v0.2**: Initial release, event sourcing, observability module, MCP server groups, Langfuse integration. Authentication stack (API keys, JWT/OIDC, RBAC), Kubernetes operator with MCPServer and MCPServerGroup CRDs.
- **v0.3 -- v0.5**: Facade API (`Hangar` class), batch invocations, SingleFlight deduplication.
- **v0.6 -- v0.8**: Interactive CLI, MCP server bundles, secrets resolver, observability bootstrap, response truncation, tool access filtering with glob patterns, two-level concurrency model.
- **v0.9 -- v0.12**: Security hardening (timing attack prevention, rate limiter backoff, JWT lifetime enforcement, API key rotation), saga persistence, circuit breaker persistence, event store snapshots, K8s operator controllers, REST API with MCP server CRUD, RBAC and tool access policies.
- **v1.0**: Enterprise module system (BSL 1.1), behavioral profiling with deviation detection, network connection monitoring, tool schema drift detection, resource monitoring, OpenTelemetry governance telemetry, cloud connector with event redaction, approval gate. Production hardening across the board.

## Architecture

MCP Hangar is a multi-language, multi-component system designed for both standalone and enterprise deployment:

**Python core** (`mcp-hangar` on PyPI) -- The main proxy and governance engine. Domain-driven design with event sourcing, CQRS command/query separation, and a single-flight deduplication layer. This is what most users install.

**Go sidecar** (`hangar-agent`) -- A data-plane agent that runs alongside your workloads in Kubernetes. It intercepts MCP traffic, applies policies from the Go policy engine, and streams events to the control plane over a bidirectional gRPC connection.

**Go control plane** (`hangar-cloud`) -- The SaaS backend that aggregates events from agents, manages policies, and serves the dashboard API. Agents connect outbound on port 443, so no inbound firewall rules are needed.

**React dashboard** (`hangar-app`) -- Fleet-wide visibility into agent health, MCP server inventory, audit logs, and policy management. Built with React 19 and served either by the Hangar HTTP server or the cloud control plane.

**Kubernetes operator** -- Manages MCPServer and MCPServerGroup custom resources. Includes validating admission webhooks, leader election, health probes, and automatic NetworkPolicy generation for egress control.

## Performance

v1.0 ships with comprehensive benchmark suites for both the Python and Go components. The numbers that matter:

| Component | Metric | Result |
|-----------|--------|--------|
| Python proxy | Full path latency (p50 / p99) | 0.21ms / 0.24ms |
| Python proxy | SLA target | 20x margin under 5ms |
| Go policy engine | 1,000 policies evaluation | 6.5 microseconds |
| Go event buffer | WAL-backed persist | 158 microseconds |
| Go event mapping | Domain event transform | 5.3 microseconds |

The Python proxy adds less than a quarter-millisecond of overhead at p99. The Go policy engine evaluates a thousand rules in under 7 microseconds. These numbers were measured with pytest-benchmark and Go's standard benchmark tooling.

## Security

Production readiness means more than performance. v1.0 includes:

- **CI security scanning**: Trivy filesystem scanning, Semgrep static analysis, and golangci-lint across all components. Pinned to specific versions for reproducible results.
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

For Kubernetes deployments, see the [Helm charts](https://github.com/mcp-hangar/helm-charts) and [operator documentation](/oss/guides/KUBERNETES).

Read the full [quickstart guide](/oss/getting-started/quickstart) or browse the [cookbook](/oss/cookbook/) for 13 recipes covering everything from HTTP gateway setup to production checklists.

## What comes next

The v1.0 release is a foundation. Near-term work includes:

- **Helm chart hardening**: Pod security standards, resource quotas, network policy tightening.
- **Operator HA**: Multi-replica leader election, disruption budgets, graceful failover.
- **CRD versioning**: Conversion webhooks for non-breaking schema evolution.

Follow the project on [GitHub](https://github.com/mcp-hangar/mcp-hangar) or check the [upgrade guide](/oss/upgrade) if you are migrating from an earlier version.
