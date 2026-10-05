import fs from "node:fs";
import path from "node:path";

import { fitTitle, h, img } from "./render";
import { CARD, FONT, INK, VERDICT } from "./tokens";
import { CATEGORY, HEADLINE } from "../config";

/**
 * The gate, read from the vendored brand mark rather than drawn here.
 *
 * The card used to put a green rounded square where the mark goes -- a shape
 * this brand does not have, on the one asset that represents the site
 * everywhere it is shared. Satori takes an `<img>`, so the mark travels as a
 * data URI: no re-drawing, no second copy of the geometry, and `brand.test.ts`
 * keeps it equal to what `pnpm brand:sync` pulled.
 */
const GATE_URI = `data:image/svg+xml;base64,${fs
  .readFileSync(path.join(process.cwd(), "brand/marks/gate-brand.svg"))
  .toString("base64")}`;

/**
 * One skeleton, five variants, in direction A: paper ground, ink type, one
 * hairline rule, and the verdict record as the motif. Every card has the
 * gate and the wordmark top-left, a mono line naming the section, the title in
 * Schibsted 800, and a footer row. The home card's footer is a record row;
 * the others carry the page's context in mono, with the domain at the right.
 *
 * Templates never invent copy: everything but the section line comes from
 * frontmatter. The one hard-coded sentence is the homepage h1, kept verbatim.
 */

const PAD = 72;

type Verdict = "allow" | "deny" | "hold";

/** The verdict word on its tint, lowercase and mono: the object the site renders in HTML. */
function chip(verdict: Verdict) {
  return h(
    "div",
    {
      display: "flex",
      fontFamily: FONT.mono,
      fontSize: 26,
      fontWeight: 500,
      padding: "4px 14px",
      borderRadius: 4,
      color: VERDICT[verdict],
      backgroundColor: VERDICT[`${verdict}-tint`],
    },
    verdict
  );
}

/** One line of the record: time, verdict, call and reason. */
function recordRow(
  time: string,
  verdict: Verdict,
  call: string,
  reason: string
) {
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      gap: 18,
      width: CARD.width - PAD * 2,
      padding: "16px 20px",
      backgroundColor: INK.panel,
      border: `2px solid ${INK.rule}`,
      borderRadius: 8,
      fontFamily: FONT.mono,
      fontSize: 24,
    },
    h("div", { display: "flex", color: INK["ink-3"] }, time),
    chip(verdict),
    h("div", { display: "flex", color: INK.ink }, call),
    h("div", { display: "flex", color: INK["ink-3"] }, reason)
  );
}

function eyebrow(text: string, color: string = INK["ink-3"]) {
  return h(
    "div",
    { display: "flex", fontFamily: FONT.mono, fontSize: 26, color },
    text
  );
}

function title(text: string) {
  const t = fitTitle(text);
  return h(
    "div",
    {
      display: "flex",
      fontFamily: FONT.display,
      fontWeight: 800,
      fontSize: t.fontSize,
      lineHeight: t.lineHeight,
      letterSpacing: -t.fontSize * 0.03,
      color: INK.ink,
      maxWidth: CARD.width - PAD * 2,
    },
    t.text
  );
}

function mono(text: string) {
  return h(
    "div",
    {
      display: "flex",
      fontFamily: FONT.mono,
      fontSize: 24,
      color: INK["ink-3"],
    },
    text
  );
}

/** The frame every card shares. `foot` replaces the left of the footer row. */
function shell(children: unknown[], foot?: unknown, record?: unknown) {
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: CARD.width,
      height: CARD.height,
      backgroundColor: INK.ground,
      padding: PAD,
      fontFamily: FONT.mono,
    },
    // wordmark
    h(
      "div",
      { display: "flex", alignItems: "center", gap: 16 },
      img(GATE_URI, { display: "flex", width: 36, height: 36 }),
      h(
        "div",
        {
          display: "flex",
          fontFamily: FONT.display,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: -0.5,
          color: INK.ink,
        },
        "MCP Hangar"
      )
    ),
    // body
    h(
      "div",
      { display: "flex", flexDirection: "column", gap: 22 },
      ...children
    ),
    // footer: a record row, or a ruled line of context and the domain
    record ??
      h(
        "div",
        {
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderTop: `2px solid ${INK.rule}`,
          paddingTop: 22,
        },
        h("div", { display: "flex" }, foot ?? h("div", { display: "flex" })),
        mono("mcp-hangar.io")
      )
  );
}

export function homeCard() {
  // The hero as a shared link: the headline, and one of the records the
  // page shows beside it -- a real code core emits.
  return shell(
    [eyebrow(CATEGORY), title(HEADLINE)],
    undefined,
    recordRow(
      "15:15:07",
      "deny",
      "github.delete_repository",
      "tool_not_in_access_policy"
    )
  );
}

export function blogCard(opts: {
  title: string;
  date?: string;
  advisory?: boolean;
}) {
  const label = opts.advisory ? "security advisory" : "blog";
  return shell(
    [eyebrow(opts.date ? `${label} · ${opts.date}` : label), title(opts.title)],
    opts.advisory ? chip("deny") : undefined
  );
}

export function securityCard(opts: { title: string; note?: string }) {
  return shell(
    [eyebrow("security"), title(opts.title)],
    opts.note ? mono(opts.note) : undefined
  );
}

export function learnCard(opts: { title: string }) {
  return shell([eyebrow("learn"), title(opts.title)]);
}

/**
 * The one that has to survive ~100 pages of unpredictable titles: everything is
 * neutral, and the subpath carries the context a bare title would lose.
 */
export function docsCard(opts: { title: string; subpath?: string }) {
  return shell(
    [eyebrow("docs"), title(opts.title)],
    opts.subpath ? mono(opts.subpath) : undefined
  );
}
