#!/usr/bin/env python3
"""Extract what the home page says about a call from MCP Hangar core itself.

    python3 scripts/core-data.py <path to a mcp-hangar clone> <tag> [--python <interpreter>]

Writes src/data/core.json. Run it when the advertised version moves; CI does
not, because CI has no clone of core. The output names the tag and commit it
came from, and src/__tests__/core-data.test.ts holds the site to it.

What it reads, all at <tag> and without checking anything out:

- the batch executor's `_GATES`, in order: the gate path the home page draws.
  The order is core's precedence contract, so the page cannot reorder it.
- each gate's first docstring line, as core's own summary of it.
- the bounded reason codes a refusal carries (`_GATE_REASONS`, the tenant
  budget's own reasons) and the refusals raised past the gates.
- the approval states and the L7 verdict vocabulary.

With --python, it also runs <tag>'s own audit path on one refusal --
`ToolCallRefused` through the audit event handler into the LEEF and JSON lines
exporters -- and stores the two lines exactly as core writes them. The
interpreter needs core's dependencies (core's own `.venv/bin/python` will do).
The exporters' clock is fixed so the record matches the rows around it; every
other byte is the formatter's.
"""

import ast
import json
import os
import re
import subprocess
import sys
import tarfile
import tempfile
from io import BytesIO
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "core.json"
EXECUTOR = "src/mcp_hangar/server/tools/batch/executor.py"
ADMISSION = "src/mcp_hangar/server/tools/batch/tenant_admission.py"
APPROVALS = "src/mcp_hangar/approvals/models.py"
CONVENTIONS = "src/mcp_hangar/observability/conventions.py"

EMIT = r'''
from datetime import UTC, datetime
import mcp_hangar.compliance.jsonlines_exporter as jl
import mcp_hangar.compliance.leef_exporter as leef
from mcp_hangar.application.event_handlers.audit_event_handler import OTLPAuditEventHandler
from mcp_hangar.domain.events import ToolCallRefused

class Frozen(datetime):
    @classmethod
    def now(cls, tz=None):
        return datetime(2026, 10, 5, 15, 15, 7, 204000, tzinfo=UTC)

leef.datetime = Frozen
jl.datetime = Frozen
lines = []
event = ToolCallRefused(
    mcp_server_id="github", tool_name="delete_repository", correlation_id="call-01J9Z7K3",
    identity_context={"user_id": "svc:ci", "agent_id": None, "session_id": "sess-4f1a",
                      "tenant_id": "acme", "principal_type": "service_account", "roles": []},
    gate="tool_access", gate_reason="tool_not_in_access_policy",
    l7_verdict=None, l7_mode=None, l7_rule_kind=None, l7_policy_id=None,
    elapsed_ms=0.41, route_backend="github",
)
for exporter in (leef.LEEFExporter(output_fn=lines.append), jl.JSONLinesExporter(output_fn=lines.append)):
    OTLPAuditEventHandler(audit_exporter=exporter).handle(event)
print("\n".join(lines))
'''


def show(repo: str, tag: str, path: str) -> str:
    return subprocess.run(
        ["git", "-C", repo, "show", f"{tag}:{path}"], check=True, capture_output=True, text=True
    ).stdout


def gates(source: str) -> list[dict[str, str]]:
    tree = ast.parse(source)
    docs = {
        node.name: (ast.get_docstring(node) or "").split("\n\n")[0].replace("\n", " ").strip()
        for node in ast.walk(tree)
        if isinstance(node, ast.FunctionDef) and node.name.startswith("_gate_")
    }
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == "_GATES" for t in node.targets):
            names = [elt.attr for elt in node.value.elts]  # BatchExecutor._gate_x
            return [{"name": n.removeprefix("_gate_"), "doc": docs.get(n, "")} for n in names]
    raise SystemExit("_GATES not found")


def literal(source: str, name: str):
    for node in ast.parse(source).body:
        if isinstance(node, ast.Assign) and any(isinstance(t, ast.Name) and t.id == name for t in node.targets):
            return ast.literal_eval(node.value if not isinstance(node.value, ast.Call) else node.value.args[0])
    raise SystemExit(f"{name} not found")


def main() -> None:
    args = sys.argv[1:]
    python = None
    if "--python" in args:
        i = args.index("--python")
        python = args[i + 1]
        del args[i : i + 2]
    repo, tag = args
    commit = subprocess.run(
        ["git", "-C", repo, "rev-parse", f"{tag}^{{commit}}"], check=True, capture_output=True, text=True
    ).stdout.strip()

    executor = show(repo, tag, EXECUTOR)
    admission = show(repo, tag, ADMISSION)
    approvals = show(repo, tag, APPROVALS)
    conventions = show(repo, tag, CONVENTIONS)

    data = {
        "core": {"tag": tag, "commit": commit},
        "gates": gates(executor),
        "gateReasons": sorted(set(literal(executor, "_GATE_REASONS").values())),
        "tenantBudgetReasons": [
            literal(admission, n) for n in ("NO_BUDGET", "CONCURRENCY", "RATE")
        ],
        "refusedAtDispatch": sorted(literal(executor, "_REFUSED_AT_DISPATCH")),
        "approvalStates": re.findall(r'^\s+[A-Z]+ = "(\w+)"', approvals.split("class ApprovalState")[1].split("\n\n\n")[0], re.M),
        "l7Verdicts": re.findall(r"`(\w+)`", conventions.split('VERDICT = "hangar.l7.verdict"')[0].rsplit("#:", 1)[1]),
    }

    if python:
        with tempfile.TemporaryDirectory() as tmp:
            archive = subprocess.run(["git", "-C", repo, "archive", tag, "src"], check=True, capture_output=True).stdout
            tarfile.open(fileobj=BytesIO(archive)).extractall(tmp, filter="data")
            out = subprocess.run(
                [python, "-c", EMIT],
                check=True, capture_output=True, text=True,
                env={**os.environ, "PYTHONPATH": str(Path(tmp) / "src")},
            ).stdout.strip().splitlines()
        data["record"] = {"leef": out[0], "jsonl": out[1]}
    elif OUT.exists():
        data["record"] = json.loads(OUT.read_text()).get("record")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2) + "\n")
    print(f"wrote {OUT} from {tag} ({commit[:12]}): {len(data['gates'])} gates")


if __name__ == "__main__":
    main()
