---
title: "MCP Hangar v1.0.1 -- Hardening After the April Audit"
date: 2026-04-17
author: MCP Hangar Team
description: "Security hardening release: SSRF protection, default-deny command allow-list, granular RBAC, WebSocket origin validation, and trusted proxy resolution."
---

# MCP Hangar v1.0.1 -- Hardening After the April Audit

v1.0 shipped on April 11. Six days later, v1.0.1 lands with the fixes from our first formal security audit.

This release adds SSRF protection, a default-deny command allow-list, granular RBAC permissions, WebSocket origin validation and backpressure, and a trusted proxy resolver. None of these are theoretical -- every mitigation maps to an attack class that has already been exploited in the MCP ecosystem.

## Why this matters now

The MCP protocol is young, and the attack surface is growing fast. Two CVEs from 2025 illustrate the risk:

| CVE | CVSS | What happened |
|-----|------|---------------|
| [CVE-2025-6514](https://nvd.nist.gov/vuln/detail/CVE-2025-6514) | 9.6 | `mcp-remote` allowed full RCE on the client OS when connecting to a malicious MCP server. A crafted OAuth `authorization_endpoint` URL triggered OS command injection. |
| [CVE-2025-54136](https://nvd.nist.gov/vuln/detail/CVE-2025-54136) | 7.2 | Cursor IDE allowed persistent code execution via a modified MCP config file -- no re-approval prompt after the initial trust grant. |

MCP Hangar is a proxy sitting between your agents and the MCP servers they call. v1.0.1 ensures that even if an upstream server is compromised or misconfigured, the blast radius is contained.

## SSRF protection

MCP server endpoints resolving to private or link-local addresses are now blocked by default. The blocked ranges:

| CIDR | Description |
|------|-------------|
| `10.0.0.0/8` | RFC 1918 private |
| `127.0.0.0/8` | Loopback |
| `169.254.0.0/16` | Link-local |
| `172.16.0.0/12` | RFC 1918 private |
| `192.168.0.0/16` | RFC 1918 private |
| `::1/128` | IPv6 loopback |
| `fc00::/7` | IPv6 unique local |
| `fe80::/10` | IPv6 link-local |

This prevents a compromised or malicious MCP server config from redirecting tool calls to internal services (cloud metadata endpoints, databases, admin APIs).

Validation runs in `validate_no_ssrf()` before every outbound connection to a remote MCP server.

## Command allow-list

v1.0 used a blocklist for subprocess execution. v1.0.1 replaces it with a default-deny allow-list:

```python
ALLOWED_COMMANDS = frozenset({
    "node", "python", "python3", "docker", "uv",
    "npx", "uvx", "pip", "npm",
})
```

Any command not on this list is rejected before the subprocess is spawned. Override with the `MCP_ALLOWED_COMMANDS` environment variable (comma-separated).

This directly addresses the class of attacks behind CVE-2025-6514 -- even if a malicious payload reaches the proxy, only allow-listed binaries can execute.

## Granular RBAC

v1.0 had coarse-grained roles. v1.0.1 adds fine-grained permission strings:

| Permission | Description |
|------------|-------------|
| `policy:write` | Create and update security policies |
| `mcp_servers:read` | View MCP server configuration |
| `mcp_servers:write` | Modify MCP server configuration |
| `mcp_servers:lifecycle` | Start, stop, restart MCP servers |
| `config:reload` | Hot-reload configuration |

A new `agent` role is introduced for data-plane sidecar tokens, scoped to only the permissions the data-plane agent needs. This follows the principle of least privilege -- a compromised agent token cannot modify policies or server configuration.

## WebSocket hardening

Two changes to the event stream WebSocket endpoint:

**Origin validation.** The `Origin` header is validated against the CORS configuration before the WebSocket handshake completes. Connections from unrecognized origins are rejected with a close frame. This prevents cross-site WebSocket hijacking (CSWSH).

**Backpressure.** Each WebSocket connection now has a bounded event queue (`maxsize=1024`). When a slow consumer falls behind, events are dropped rather than buffering unbounded memory. A subscriber limit of 100 connections prevents resource exhaustion.

## Trusted proxy resolver

If MCP Hangar runs behind a load balancer or reverse proxy, client IP extraction from `X-Forwarded-For` must be restricted to trusted sources. v1.0.1 adds `TrustedProxyResolver`:

```bash
MCP_TRUSTED_PROXIES=10.0.0.0/8,172.16.0.0/12
```

The resolver accepts CIDR notation. Only requests forwarded through listed ranges have their `X-Forwarded-For` header honored. This prevents IP spoofing attacks that could bypass rate limiting or audit logging.

## Security tests

v1.0.1 adds `tests/security/test_critical.py` covering SSRF validation, trusted proxy resolution, JWT extraction edge cases, RBAC enforcement, and WebSocket authentication. These run in CI on every commit.

## Upgrade

```bash
pip install mcp-hangar==1.0.1
# or
uv pip install mcp-hangar==1.0.1
```

No breaking changes. No configuration migration required.

## What's next

v1.1 adds cost attribution, compliance export, and end-to-end caller identity in OTEL spans. Read the [v1.1 release post](./2026-05-10-v1-1-cost-attribution-compliance-export) for details.
