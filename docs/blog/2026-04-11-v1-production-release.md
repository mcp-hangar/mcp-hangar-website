---
title: "MCP Hangar v1.0 -- Production Release"
date: 2026-04-11
author: MCP Hangar Team
description: "MCP Hangar v1.0 ships identity propagation, compliance-grade audit, Kubernetes enforcement, and sub-millisecond proxy overhead."
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

MCP Hangar v1.0 ships in two tiers.

**The OSS agent** (available today, MIT-licensed, `pip install mcp-hangar`) is the Python core: a runtime proxy that sits between AI tools and MCP servers, intercepts every tool invocation, applies security policies, propagates caller identity, records a compliance-grade audit trail, and orchestrates parallel execution. Domain-driven design with event sourcing, CQRS command/query separation, and single-flight deduplication. This is what most users install. It runs anywhere Python runs -- laptop, container, Kubernetes pod.

**The Cloud platform** (in development, [waitlist open](https://mcp-hangar.io/waitlist)) extends the OSS agent into a fleet-managed runtime. A data-plane sidecar runs alongside your workloads in Kubernetes and streams events to a managed control plane over outbound gRPC on port 443 -- no inbound firewall rules. A web dashboard provides fleet-wide visibility into agent health, MCP server inventory, audit logs, and policy management. A Kubernetes operator manages MCPServer and MCPServerGroup custom resources with validating admission webhooks, leader election, and automatic NetworkPolicy generation. Helm charts and a Terraform provider ship with Cloud GA.

Same protocol, same audit semantics, same OTLP export. The OSS agent works standalone today; the Cloud platform makes it operable at fleet scale.

## Performance

v1.0 ships with a comprehensive benchmark suite for the Python proxy. The numbers that matter:

| Component | Metric | Result |
|-----------|--------|--------|
| Python proxy | Full path latency (p50 / p99) | 0.21ms / 0.24ms |
| Python proxy | SLA target | 20x margin under 5ms |

The Python proxy adds less than a quarter-millisecond of overhead at p99. These numbers were measured with pytest-benchmark against the public [benchmark suite](https://github.com/mcp-hangar/benchmarks). Cloud-tier component benchmarks publish with Cloud GA.

## Security

Production readiness means more than performance. v1.0 includes:

- **CI security scanning**: Trivy filesystem scanning, Semgrep static analysis, and golangci-lint across all components. Pinned to specific versions for reproducible results.
- **Dependency auditing**: pip-audit for Python, npm audit (blocking on HIGH+) for the web dashboard, govulncheck for Go components. SBOM generation for all components.
- **Auth stack coverage**: 97.5% test coverage on the authentication and authorization code paths, including API key validation, JWT verification, identity propagation, and rate limiting.
- **Upgrade path**: A detailed upgrade guide covers every breaking change from v0.12 through v1.0, with step-by-step procedures for PyPI, Docker, and Kubernetes deployments.

## Licensing

MCP Hangar core is MIT licensed. Enterprise features (the data-plane sidecar, managed control plane, and Kubernetes operator) use the Business Source License 1.1, which converts to open source after four years. This model lets us invest in the project while keeping the core permanently open.

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

Helm charts and a Terraform provider ship with the Cloud product. For OSS deployments today, run `mcp-hangar serve` directly or in a container.

Read the full [quickstart guide](/oss/getting-started/quickstart) or browse the [cookbook](/oss/cookbook/) for 13 recipes covering everything from HTTP gateway setup to production checklists.

## What comes next

The v1.0 release is a foundation. Near-term work includes:

- **Security audit hardening**: SSRF protection, command allow-list, granular RBAC, WebSocket origin validation (shipped in [v1.0.1](./2026-04-17-hardening-after-the-april-audit)).
- **Observability loop**: Cost attribution, compliance export, caller identity in every OTEL span (shipped in [v1.1](./2026-05-10-v1-1-cost-attribution-compliance-export)).
- **Cloud platform**: Fleet-wide management dashboard, managed SIEM pipelines, Helm charts, and a Kubernetes operator. [Waitlist open](https://mcp-hangar.io/waitlist).

Follow the project on [GitHub](https://github.com/mcp-hangar/mcp-hangar) or check the [upgrade guide](/oss/upgrade) if you are migrating from an earlier version.
