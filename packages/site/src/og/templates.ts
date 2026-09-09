import fs from "node:fs";
import path from "node:path";

import { fitTitle, h, img } from "./render";
import { VERDICT, ZINC, FONT, CARD } from "./tokens";

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
 * One skeleton, five variants. Every card is flat zinc-950 — no gradient, no
 * glow — with the wordmark top-left, the domain bottom-right, and a mono
 * eyebrow naming the section. What changes between page types is the eyebrow,
 * its colour, and whether a verdict chip appears.
 *
 * Templates never invent copy: everything but the eyebrow comes from
 * frontmatter. The one hard-coded sentence is the homepage h1, kept verbatim —
 * if the hero's line changes, this one changes with it.
 */

const PAD = 72;

/** ALLOW / DENY, mono and bordered — the same object the site renders in HTML. */
function chip(verdict: "allow" | "deny", code?: string) {
  const tone =
    verdict === "allow"
      ? { fg: VERDICT.allowSoft, border: VERDICT.allow }
      : { fg: VERDICT.denySoft, border: VERDICT.deny };
  return h(
    "div",
    {
      display: "flex",
      alignItems: "center",
      gap: 14,
      border: `2px solid ${tone.border}`,
      borderRadius: 12,
      padding: "10px 20px",
      fontFamily: FONT.mono,
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: 2,
      color: tone.fg,
    },
    h("div", { display: "flex" }, verdict.toUpperCase()),
    code
      ? h("div", { display: "flex", color: ZINC[400], letterSpacing: 0 }, code)
      : null
  );
}

function eyebrow(text: string, color: string) {
  return h(
    "div",
    {
      display: "flex",
      fontFamily: FONT.mono,
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: 4,
      textTransform: "uppercase",
      color,
    },
    text
  );
}

function title(text: string) {
  const t = fitTitle(text);
  return h(
    "div",
    {
      display: "flex",
      fontFamily: FONT.sans,
      fontWeight: 700,
      fontSize: t.fontSize,
      lineHeight: t.lineHeight,
      letterSpacing: -1,
      color: ZINC[50],
      maxWidth: CARD.width - PAD * 2,
    },
    t.text
  );
}

/** The frame every card shares. `foot` is an optional extra row above the domain. */
function shell(children: unknown[], foot?: unknown) {
  return h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: CARD.width,
      height: CARD.height,
      backgroundColor: ZINC[950],
      padding: PAD,
      fontFamily: FONT.sans,
    },
    // wordmark
    h(
      "div",
      { display: "flex", alignItems: "center", gap: 16 },
      img(GATE_URI, { display: "flex", width: 30, height: 30 }),
      h(
        "div",
        {
          display: "flex",
          fontFamily: FONT.mono,
          fontSize: 22,
          fontWeight: 600,
          // BRAND.md: display tracking is 0.14em. It was a flat 5px here,
          // which is 0.23em -- the display lockup, spelled wrong.
          letterSpacing: 22 * 0.14,
          color: ZINC[300],
        },
        "MCP HANGAR"
      )
    ),
    // body
    h(
      "div",
      { display: "flex", flexDirection: "column", gap: 26 },
      ...children
    ),
    // footer
    h(
      "div",
      {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
      },
      h("div", { display: "flex" }, foot ?? h("div", { display: "flex" })),
      h(
        "div",
        {
          display: "flex",
          fontFamily: FONT.mono,
          fontSize: 22,
          color: ZINC[500],
        },
        "mcp-hangar.io"
      )
    )
  );
}

/** An accent rule, used where a card has no chip to carry colour. */
function rule(color: string) {
  return h("div", {
    display: "flex",
    width: 120,
    height: 5,
    borderRadius: 3,
    backgroundColor: color,
  });
}

export function homeCard() {
  return shell(
    [
      // The card is the hero as a shared link, so it carries the same
      // spine word — and the DENY chip below turns it into an example.
      eyebrow("Policy enforcement plane for MCP on Kubernetes", ZINC[500]),
      title("Every MCP tool call ends in a verdict."),
    ],
    chip("deny", "isError: true")
  );
}

export function blogCard(opts: {
  title: string;
  date?: string;
  advisory?: boolean;
}) {
  const label = opts.advisory ? "Security advisory" : "Blog";
  return shell(
    [
      h(
        "div",
        { display: "flex", alignItems: "center", gap: 20 },
        eyebrow(label, opts.advisory ? VERDICT.denySoft : ZINC[500]),
        opts.date
          ? h(
              "div",
              {
                display: "flex",
                fontFamily: FONT.mono,
                fontSize: 22,
                color: ZINC[600],
              },
              opts.date
            )
          : null
      ),
      title(opts.title),
    ],
    opts.advisory ? chip("deny") : undefined
  );
}

export function securityCard(opts: { title: string; note?: string }) {
  return shell(
    [eyebrow("Security", VERDICT.denySoft), title(opts.title)],
    opts.note
      ? h(
          "div",
          {
            display: "flex",
            fontFamily: FONT.mono,
            fontSize: 24,
            color: ZINC[400],
          },
          opts.note
        )
      : chip("deny")
  );
}

export function learnCard(opts: { title: string }) {
  return shell([
    eyebrow("Learn", ZINC[500]),
    title(opts.title),
    rule(VERDICT.allow),
  ]);
}

/**
 * The one that has to survive ~100 pages of unpredictable titles: everything is
 * neutral, and the subpath carries the context a bare title would lose.
 */
export function docsCard(opts: { title: string; subpath?: string }) {
  return shell(
    [eyebrow("Docs", ZINC[500]), title(opts.title)],
    opts.subpath
      ? h(
          "div",
          {
            display: "flex",
            fontFamily: FONT.mono,
            fontSize: 22,
            color: ZINC[600],
          },
          opts.subpath
        )
      : undefined
  );
}
