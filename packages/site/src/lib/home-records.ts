import type { RecordRow } from "../components/Record.astro";

/**
 * The records on the home page. Every field name and code here is one core
 * writes (core-data.test.ts checks them against src/data/core.json); only the
 * times, the caller and the tool names are examples.
 */

/** The hero: one of each verdict, from four different places on the path. */
export const HERO_RECORD: RecordRow[] = [
  {
    time: "15:15:02",
    verdict: "allow",
    call: "github.get_issue",
    reason: "tenant_id=acme",
  },
  {
    time: "15:15:04",
    verdict: "hold",
    call: "github.create_issue",
    reason: "gate=approval state=pending",
  },
  {
    time: "15:15:07",
    verdict: "deny",
    call: "github.delete_repository",
    reason: "gate=tool_access reason=tool_not_in_access_policy",
  },
  {
    time: "15:15:09",
    verdict: "deny",
    call: "fetch.get",
    reason: "l7_verdict=deny l7_mode=enforce policy_id=sha256:9f2c41e0",
  },
];

/** What the config in "How a call is decided" produces, call by call. */
export const PATH_RECORD: RecordRow[] = [
  {
    time: "15:15:02",
    verdict: "allow",
    call: "github.get_issue",
    reason: "tenant_id=acme",
  },
  {
    time: "15:15:03",
    verdict: "allow",
    call: "github.list_issues",
    reason: "tenant_id=acme",
  },
  {
    time: "15:15:04",
    verdict: "hold",
    call: "github.create_issue",
    reason: "gate=approval state=pending",
  },
  {
    time: "15:15:07",
    verdict: "deny",
    call: "github.delete_repository",
    reason: "gate=tool_access reason=tool_not_in_access_policy",
  },
  {
    time: "15:15:11",
    verdict: "deny",
    call: "github.list_issues",
    reason: "gate=tenant_budget reason=rate",
  },
];
