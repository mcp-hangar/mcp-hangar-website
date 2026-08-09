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

## `PipelineMotif` — not in this PR

The ordered-gates diagram in `full` / `compact` / `mini` is the remaining WS-2
component, and it is a rebuild rather than a move: WS-0 measured the current
diagram at **20 `.ctl` divs, 281 lines of page-scoped CSS and a filter script,
inline in a 711-line page, with zero SVG**. Extracting it means moving markup,
stylesheet and behaviour together and then proving the Learn hub still filters
identically — which is its own review, not a footnote to three small
components.

Sizes it needs to end up with:

- `full` — the Learn hub's interactive version, on tokens
- `compact` — a horizontal strip for the homepage "how it works"
- `mini` — an inline marker lighting the gates a given use-case card covers

One visual language across all three: same gate letters (a–i), same
`state-optin` markers for anything off by default, same mono labels.

---

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
