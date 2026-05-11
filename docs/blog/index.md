# Blog

Engineering updates, release announcements, and technical deep dives from the MCP Hangar team.

---

## 2026

### [SEP-1763 Compliance: How MCP Hangar Became an MCP-Native Interceptor](./2026-05-11-interceptor-framework-sep-1763)

*May 11, 2026*

MCP Hangar v1.2 implements the SEP-1763 interceptor framework: hook-based event model, wildcard subscriptions, IMutator contract with priority-ordered pipeline, ResponseTruncator, and discoverable interceptors/list endpoint.

### [Tool Integrity for MCP: Digest Pinning in MCP Hangar v1.2](./2026-05-11-digest-pinning-sep-1766)

*May 11, 2026*

v1.2 introduces digest pinning for MCP tools (SEP-1766). SHA-256 fingerprints of tool schemas enable drift detection, mutation blocking, and allowlist-based version pinning with audit/warn/block enforcement modes.

### [MCP Hangar v1.1 -- Cost Attribution, Compliance Export, and End-to-End Caller Identity](./2026-05-10-v1-1-cost-attribution-compliance-export)

*May 10, 2026*

v1.1 closes the observability loop: every tool call now carries cost data, caller identity, and compliance-ready export. Three new SIEM formats in OSS, FinOps metrics out of the box, and end-to-end caller tracing in every OTEL span.

### [MCP Hangar v1.0.1 -- Hardening After the April Audit](./2026-04-17-hardening-after-the-april-audit)

*April 17, 2026*

Security hardening release addressing findings from the April 2026 security audit. SSRF protection, default-deny command allow-list, granular RBAC, WebSocket origin validation and backpressure, and trusted proxy resolution.

### [MCP Hangar v1.0 -- Production Release](./2026-04-11-v1-production-release)

*April 11, 2026*

After months of hardening, MCP Hangar reaches its first stable production release. Identity propagation, compliance-grade audit trail, Kubernetes enforcement, and sub-millisecond proxy overhead -- all validated by comprehensive benchmarks and security audits.
