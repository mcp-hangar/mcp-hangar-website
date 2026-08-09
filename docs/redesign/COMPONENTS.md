# WS-2 — the identity kit

Shared components for the verdict system. If a page needs one of these shapes,
it imports the component; it does not roll a private variant. That rule is the
point of the workstream — the old homepage had four different card treatments
and two different primary buttons.

All of them read the WS-1 tokens (`verdict-allow`, `verdict-deny`,
`state-optin`) from `@theme` in `src/styles/global.css`. None of them hardcode a
hue.

---

## `VerdictChip`

The product in one element: a policy produced an answer, and the answer is
binary.

```astro
---
import VerdictChip from "../components/VerdictChip.astro";
---
<VerdictChip verdict="allow" />
<VerdictChip verdict="deny" code="-32021" />
<VerdictChip verdict="deny" code="-32021" size="sm" />
```

| prop | type | default | notes |
| --- | --- | --- | --- |
| `verdict` | `"allow" \| "deny"` | — | required |
| `code` | `string` | — | the wire code that carries the refusal |
| `size` | `"sm" \| "md"` | `"md"` | `sm` is for use inside `WireRecord` |
| `class` | `string` | `""` | |

**The text label is not optional.** Colour reads faster, but it is the second
encoding, not the first (C11) — the chip always renders the word `ALLOW` or
`DENY`. Do not add a variant that drops it.

Live example: the allow/deny pair in *Why enforcement, not detection* on the
homepage.

---

## `WireRecord`

One line of the audit trail, rendered the way it is written. The motif is that
everything on the wire looks like evidence.

```astro
---
import WireRecord from "../components/WireRecord.astro";
---
<WireRecord
  time="12:04:41"
  caller="team-research@corp"
  method="tools/call"
  target="github.create_issue"
  verdict="deny"
  code="-32021"
/>
```

| prop | type | default | notes |
| --- | --- | --- | --- |
| `caller` | `string` | — | **required** |
| `method` | `string` | — | required |
| `verdict` | `"allow" \| "deny"` | — | required |
| `time` | `string` | — | short wall-clock prefix |
| `target` | `string` | — | server or tool the call was aimed at |
| `code` | `string` | — | passed through to the chip |

`caller` is required on purpose: an unattributed verdict proves nothing, and
attribution is the thing the audit trail exists to carry. The record scrolls
inside its own container, so a long identity never makes the page scroll
sideways.

---

## `PolicySnippet`

A short policy shown as a *file* rather than a code sample — the filename tab is
the point. This is a thing you commit, not something you paste into a console.

```astro
---
import PolicySnippet from "../components/PolicySnippet.astro";
---
<PolicySnippet
  filename="gh-readonly.yaml"
  code={`apiVersion: mcp-hangar.io/v1alpha2
kind: MCPEgressPolicy
metadata:
  name: gh-readonly
spec:
  mode: Enforce
  tools:
    allow: ["github.get_*", "github.list_*"]`}
/>
```

| prop | type | default |
| --- | --- | --- |
| `filename` | `string` | — |
| `code` | `string` | — |
| `lang` | `"yaml" \| "json" \| "bash"` | `"yaml"` |

Highlighting goes through Astro's `Code` with the same `github-dark` Shiki theme
the docs use (`astro.config.mjs`), so a policy looks identical wherever it
appears. `lang` is narrowed deliberately — `Code` types its own `lang`, and a
bare `string` does not satisfy it.

Keep snippets to roughly a dozen lines. If one needs more, it is a cookbook
recipe, not a card illustration.

---

## `PipelineMotif`

The ordered gates a call meets, in one place, in three sizes. **The order is the
content** — top-to-bottom is real execution order, and egress is last because it
fires immediately before upstream I/O. A size that reordered the gates would be
lying about the product.

```astro
---
import PipelineMotif from "../components/PipelineMotif.astro";
---
<PipelineMotif size="full" />                    {/* the Learn hub seam */}
<PipelineMotif size="compact" />                 {/* homepage strip */}
<PipelineMotif size="mini" gates={["a", "f"]} /> {/* a use-case card */}
```

| prop | type | default |
| --- | --- | --- |
| `size` | `"full" \| "compact" \| "mini"` | `"full"` |
| `gates` | `string[]` | `[]` — for `mini`: which letters to light |

The nine gates live in one `GATES` array inside the component, so the three
sizes cannot drift apart. Gate letters (a–i) mean the same thing everywhere:

| | gate | kind |
| --- | --- | --- |
| a | Tool-access authz | gate |
| b | Tool-withdrawal check | gate |
| c | Tool-schema digest-pin verify | gate · opt-in |
| d | Circuit-breaker / health | reliability |
| e | Interceptor validators | off by default |
| f | Approval gate | gate |
| g | Concurrency / backpressure | reliability |
| h | Interceptor mutators — request | off by default |
| i | Egress L7 policy | gate · last before the wire |

### Two things worth knowing before you touch it

**Filtering stays on the page.** `full` emits `.ctl` buttons carrying
`data-filter`; the Learn hub's own script wires those to its card grid. That
behaviour is a relationship between the diagram and a grid the component cannot
see, so it is page behaviour, not component behaviour — the component would have
to reach into the page to own it.

**The styles had to move with the markup.** Astro scopes a page's `<style>` to
that page's elements. The moment the seam became a component, the hub's rules
stopped matching it and it rendered unstyled — so its CSS now lives in the
component, with the `.learn-hub` ancestor dropped from every selector (that class
belongs to the page, and a scoped selector naming it never matches). The custom
properties are deliberately *not* redefined: they inherit through the DOM inside
the hub, and the fallbacks cover use anywhere else. The page's now-dead copies
were removed.

Extraction was verified by diffing the built hub before and after: identical
apart from Astro's scoped-style ids and hashed CSS filenames.

## Facet colours: removed

The Learn hub used to give each page type a hue — teal / sky / violet / amber
for Concept / Tutorial / Deep dive / Visual. Those are gone.

They were the **third** copy of the same signal: every card already carries a
per-type icon *and* a text label, so the colour added no information while
putting four more hues in competition with the verdict palette. A page type is
not a verdict.

What replaced them: the type label is now mono, uppercase and tracked, so it
reads as a category at a glance without a hue. The filter chips lost their
colour swatches — four identical grey dots would have been noise.
