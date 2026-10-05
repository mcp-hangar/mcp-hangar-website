import core from "../data/core.json";

/**
 * The gate path the home page draws, in core's order.
 *
 * The order and the names come from `src/data/core.json`, which
 * `scripts/core-data.py` extracts from the batch executor's `_GATES` at the
 * advertised tag -- core's precedence contract, not a list typed here. This
 * file only says, in a reader's words, what each gate asks. A gate core adds
 * without an entry here fails core-data.test.ts, so the page cannot quietly
 * fall behind the product again (audit critique #1).
 *
 * `decision` gates apply a policy someone wrote. `machinery` gates keep the
 * call honest -- timeouts, routing, health, cold starts -- and can refuse it
 * too, but nobody configures what they say.
 */
type Kind = "decision" | "machinery";

const STAGES: Record<
  string,
  { label: string; asks: string; kind: Kind; codes: string[] }
> = {
  cancelled_before_execution: {
    label: "Cancelled",
    asks: "Was the batch cancelled before this call ran?",
    kind: "machinery",
    codes: ["cancelled"],
  },
  global_timeout: {
    label: "Timeout",
    asks: "Is the batch's time budget already spent?",
    kind: "machinery",
    codes: ["batch_timeout"],
  },
  resolve_target: {
    label: "Route",
    asks: "Which server answers: this one, or a member of its group?",
    kind: "machinery",
    codes: ["server_not_found", "no_available_member"],
  },
  tool_access: {
    label: "Tool access",
    asks: "Is this tool exposed to this caller at all?",
    kind: "decision",
    codes: ["tool_not_in_access_policy"],
  },
  withdrawal: {
    label: "Withdrawal",
    asks: "Has the tool been withdrawn for this tenant?",
    kind: "decision",
    codes: ["tool_withdrawn"],
  },
  digest_pin: {
    label: "Digest pin",
    asks: "Is the tool still the one you approved, byte for byte?",
    kind: "decision",
    codes: ["digest_mismatch"],
  },
  circuit_breaker: {
    label: "Health",
    asks: "Is the server failing often enough to stop sending it calls?",
    kind: "machinery",
    codes: ["circuit_open"],
  },
  validators: {
    label: "Validators",
    asks: "Do the interceptor validators pass? They fail closed.",
    kind: "decision",
    codes: ["validator_denied"],
  },
  tenant_budget: {
    label: "Tenant budget",
    asks: "Does the caller's tenant have a budget, a free slot, and rate left?",
    kind: "decision",
    codes: ["no_budget", "concurrency", "rate"],
  },
  approval: {
    label: "Approval",
    asks: "Does a person have to say yes first? The call holds until they do.",
    kind: "decision",
    codes: ["approval_denied", "approval_timeout"],
  },
  cold_start: {
    label: "Cold start",
    asks: "Start a stopped server once, however many calls are waiting.",
    kind: "machinery",
    codes: ["start_failed"],
  },
  deferred_digest_pin: {
    label: "Pin, after start",
    asks: "The pin check a cold start made possible.",
    kind: "decision",
    codes: ["digest_mismatch"],
  },
  cancelled_after_cold_start: {
    label: "Cancelled",
    asks: "Was the batch cancelled while the server started?",
    kind: "machinery",
    codes: ["cancelled"],
  },
};

export const CORE = core.core;

export const GATES = core.gates.map((g) => {
  const stage = STAGES[g.name];
  if (!stage)
    throw new Error(`core gate ${g.name} has no entry in lib/gate-path.ts`);
  return { name: g.name, ...stage };
});

export const STAGE_NAMES = Object.keys(STAGES);

/**
 * What can still stop a call after every gate has let it through. Core is
 * explicit that these are not gates (ADR-029 s5, `observability/conventions`):
 * the rate limit is command-bus middleware, the L7 egress policy is evaluated
 * by the server aggregate inside the invocation, and the response cap cuts a
 * result rather than refusing a call. So the page labels them apart.
 */
export const AFTER_GATES = [
  {
    label: "Rate limit",
    asks: "Has this caller spent its command-bus budget?",
    codes: ["RateLimitExceeded"],
  },
  {
    label: "Egress policy (L7)",
    asks: "Inside the invocation, just before any outbound I/O: may this call, with these arguments and headers, leave?",
    codes: ["l7_verdict=deny", "l7_verdict=require_approval"],
  },
  {
    label: "Response size",
    asks: "Is the result over the cap? It is cut, and the cut is marked, with a continuation to fetch the rest.",
    codes: ["truncated"],
  },
] as const;
