import { fitTitle, h } from "./render";
import { VERDICT, ZINC, FONT, CARD } from "./tokens";

/**
 * One skeleton, five variants. Every card is flat zinc-950 — no gradient, no
 * glow — with the wordmark top-left, the domain bottom-right, and a mono
 * eyebrow naming the section. What changes between page types is the eyebrow,
 * its colour, and whether a verdict chip appears.
 *
 * Templates never invent copy: everything but the eyebrow comes from
 * frontmatter. The one hard-coded sentence is the homepage thesis, which is the
 * hero's own line, kept verbatim.
 */

const PAD = 72;

/** ALLOW / DENY, mono and bordered — the same object the site renders in HTML. */
function chip(verdict: "allow" | "deny", code?: string) {
    const tone = verdict === "allow"
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
        code ? h("div", { display: "flex", color: ZINC[400], letterSpacing: 0 }, code) : null,
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
        text,
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
        t.text,
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
            h("div", {
                display: "flex",
                width: 22,
                height: 22,
                borderRadius: 6,
                backgroundColor: VERDICT.allow,
            }),
            h(
                "div",
                {
                    display: "flex",
                    fontFamily: FONT.mono,
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: 5,
                    color: ZINC[300],
                },
                "MCP HANGAR",
            ),
        ),
        // body
        h("div", { display: "flex", flexDirection: "column", gap: 26 }, ...children),
        // footer
        h(
            "div",
            { display: "flex", alignItems: "flex-end", justifyContent: "space-between" },
            h("div", { display: "flex" }, foot ?? h("div", { display: "flex" })),
            h(
                "div",
                { display: "flex", fontFamily: FONT.mono, fontSize: 22, color: ZINC[500] },
                "mcp-hangar.io",
            ),
        ),
    );
}

/** An accent rule, used where a card has no chip to carry colour. */
function rule(color: string) {
    return h("div", { display: "flex", width: 120, height: 5, borderRadius: 3, backgroundColor: color });
}

export function homeCard() {
    return shell(
        [
            eyebrow("Policy enforcement plane for MCP", ZINC[500]),
            title("MCP is getting a registry, tasks, and interceptors. Nothing in the protocol enforces anything."),
        ],
        chip("deny", "-32021"),
    );
}

export function blogCard(opts: { title: string; date?: string; advisory?: boolean }) {
    const label = opts.advisory ? "Security advisory" : "Blog";
    return shell(
        [
            h(
                "div",
                { display: "flex", alignItems: "center", gap: 20 },
                eyebrow(label, opts.advisory ? VERDICT.denySoft : ZINC[500]),
                opts.date
                    ? h("div", { display: "flex", fontFamily: FONT.mono, fontSize: 22, color: ZINC[600] }, opts.date)
                    : null,
            ),
            title(opts.title),
        ],
        opts.advisory ? chip("deny") : undefined,
    );
}

export function securityCard(opts: { title: string; note?: string }) {
    return shell(
        [eyebrow("Security", VERDICT.denySoft), title(opts.title)],
        opts.note
            ? h(
                  "div",
                  { display: "flex", fontFamily: FONT.mono, fontSize: 24, color: ZINC[400] },
                  opts.note,
              )
            : chip("deny"),
    );
}

export function learnCard(opts: { title: string }) {
    return shell([eyebrow("Learn", ZINC[500]), title(opts.title), rule(VERDICT.allow)]);
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
                  { display: "flex", fontFamily: FONT.mono, fontSize: 22, color: ZINC[600] },
                  opts.subpath,
              )
            : undefined,
    );
}
