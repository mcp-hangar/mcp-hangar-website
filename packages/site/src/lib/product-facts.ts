/**
 * Facts the site states to machines -- the SoftwareApplication JSON-LD and the
 * "Key facts" in llms.txt / llms-full.txt -- kept in one place, because a claim
 * only machines read is the one nobody proofreads.
 *
 * Checked against core v2.24.0:
 * - SIEM formats: `compliance.format` accepts `cef`, `leef`, `jsonlines` and
 *   `syslog` (server/bootstrap/event_handlers.py `_COMPLIANCE_FORMATS`); the
 *   LEEF exporter writes `LEEF:2.0` and the syslog exporter is RFC 5424.
 * - OTLP is not one of them. It is the trace and audit-span export, a separate
 *   path the homepage already says is "not a SIEM format".
 * - Platforms: the gateway is a pip package and a Linux container image.
 *   public/install.sh installs on Linux and macOS and refuses Windows outright
 *   ("Windows is not supported. Please use WSL"), and nothing in the docs
 *   covers a native Windows install.
 */
export const SIEM_FORMATS = [
  "CEF",
  "LEEF 2.0",
  "JSON lines",
  "RFC 5424 syslog",
] as const;

export const OPERATING_SYSTEMS = "Linux, macOS";

export const AUDIT_EXPORT_FACT = `SIEM export in ${SIEM_FORMATS.slice(0, -1).join(", ")} and ${SIEM_FORMATS.at(-1)}; OTLP is a separate export for traces and audit spans, not a SIEM format`;

export const PLATFORM_FACT =
  "Platforms: Linux and macOS; Windows only through WSL";

/**
 * The positioning facts llms.txt and llms-full.txt lead with. Shared so the
 * two files cannot say different things, and worded from what core v2.24.0
 * ships rather than from the Kubernetes operator alone:
 * - deployment: stdio on a laptop, HTTP on a VM, or Kubernetes via the operator;
 * - the verdict path: identity and tool-access authorization, digest pins, the
 *   approval gate, egress policy (server/tools/batch/executor.py gates);
 * - "nothing on the verdict path is scored or learned" rather than "no anomaly
 *   detection": a threshold-counting security handler does run and emits
 *   signals, but it never decides a call.
 */
export const VERDICT_PATH_FACT =
  "Verdict path: each tool call passes one deterministic allow/deny path (caller identity, tool-access authorization, tool-schema digest pinning, the approval gate, egress policy)";

export const DEPLOYMENT_FACT =
  "Deployment: a laptop over stdio, a VM over HTTP, or Kubernetes; on Kubernetes an operator adds deploy-time admission webhooks and default-deny egress in labelled namespaces";

export const DETERMINISM_FACT =
  "Deterministic by design: explicit policy decides every call; nothing on the verdict path is scored or learned";
