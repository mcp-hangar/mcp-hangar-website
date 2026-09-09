import type { ThemeRegistrationRaw } from "@shikijs/types";

/**
 * The code theme: zinc, and nothing else.
 *
 * Every snippet on this site used to render in `github-dark`, which is a fine
 * theme and the wrong one here. `global.css` spends a paragraph establishing
 * that colour is semantics — two hues carry meaning because the product is a
 * binary verdict, and nothing that is not a verdict gets a hue — and then every
 * code block on the site, which is the most common visual element it has,
 * arrived carrying five borrowed ones. A purple keyword next to a green ALLOW
 * chip teaches a reader that green is decoration.
 *
 * So the hierarchy here is built out of lightness rather than hue, on the zinc
 * ramp the rest of the site is built from:
 *
 *   zinc-400   punctuation, comments      the scaffolding
 *   zinc-300   keys, properties, tags     what a thing is called
 *   zinc-200   default, numbers           everything unclassified
 *   zinc-100   strings, values            what a policy actually says
 *   zinc-50    keywords, bold             the words the language reserves
 *
 * That ordering is deliberate for the language this site mostly shows: in a
 * policy the values are the decision, so `["github.get_*"]` outranks the
 * `allow:` that introduces it.
 *
 * The dimmest colour used is zinc-400, at 7.3:1 on zinc-950. zinc-500 reads as
 * the natural choice for a comment and lands at 4.1:1, under the floor.
 */

/** Tailwind's zinc, the same values `og/tokens.ts` mirrors. */
const ZINC = {
  950: "#09090b",
  400: "#a1a1aa",
  300: "#d4d4d8",
  200: "#e4e4e7",
  100: "#f4f4f5",
  50: "#fafafa",
} as const;

export const codeTheme: ThemeRegistrationRaw = {
  name: "hangar",
  type: "dark",
  colors: {
    "editor.background": ZINC[950],
    "editor.foreground": ZINC[200],
  },
  settings: [
    {
      settings: { background: ZINC[950], foreground: ZINC[200] },
    },
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: ZINC[400], fontStyle: "italic" },
    },
    {
      scope: [
        "punctuation",
        "punctuation.separator",
        "punctuation.definition",
        "punctuation.terminator",
        "meta.brace",
        "keyword.operator",
      ],
      settings: { foreground: ZINC[400] },
    },
    {
      // What a thing is called: a YAML key, a JSON property, an XML tag, an
      // object member.
      scope: [
        "entity.name.tag",
        "support.type.property-name",
        "meta.object-literal.key",
        "variable.other.member",
        "variable.other.property",
      ],
      settings: { foreground: ZINC[300] },
    },
    {
      scope: ["variable", "variable.parameter", "entity.name.variable"],
      settings: { foreground: ZINC[200] },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: ZINC[200] },
    },
    {
      // What it says. A quoted string, a plain YAML scalar, a regexp.
      scope: ["string", "string.quoted", "string.unquoted", "string.regexp"],
      settings: { foreground: ZINC[100] },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "entity.name.type",
        "entity.name.class",
        "support.class",
        "support.type",
      ],
      settings: { foreground: ZINC[100] },
    },
    {
      // The words the language reserves.
      scope: [
        "keyword",
        "keyword.control",
        "storage",
        "storage.type",
        "storage.modifier",
      ],
      settings: { foreground: ZINC[50] },
    },
    {
      scope: ["markup.bold", "markup.heading"],
      settings: { foreground: ZINC[50], fontStyle: "bold" },
    },
    {
      scope: ["markup.italic"],
      settings: { fontStyle: "italic" },
    },
  ],
};
