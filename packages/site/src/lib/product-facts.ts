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
