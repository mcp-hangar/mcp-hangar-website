import type { ThemeRegistrationRaw } from "@shikijs/types";

/**
 * The code theme: the neutral ramp, and nothing else.
 *
 * Every snippet on this site used to render in `github-dark`, which is a fine
 * theme and the wrong one here. `styles/tokens.css` spends a paragraph
 * establishing that colour is semantics -- three hues carry meaning because a
 * call ends in one of three verdicts, and nothing that is not a verdict gets a
 * hue -- and code blocks are the most common visual element the site has. A
 * purple keyword next to a green ALLOW chip teaches a reader that green is
 * decoration.
 *
 * So the hierarchy here is built out of lightness rather than hue:
 *
 *   --c-code-punct   punctuation, comments      the scaffolding
 *   --c-code-key     keys, properties, tags     what a thing is called
 *   --c-code-text    default, numbers           everything unclassified
 *   --c-code-value   strings, values, keywords  what a policy actually says
 *
 * The values are CSS custom properties, not hexes, so one highlighted block
 * follows the theme: Shiki writes `color:var(--c-code-key)` into the markup and
 * tokens.css decides what that is in light and in dark. code-theme.test.ts
 * resolves every one of them in both themes and holds them achromatic and above
 * 4.5:1 on the code background.
 */

const C = {
  bg: "var(--c-code-bg)",
  punct: "var(--c-code-punct)",
  key: "var(--c-code-key)",
  text: "var(--c-code-text)",
  value: "var(--c-code-value)",
} as const;

export const codeTheme: ThemeRegistrationRaw = {
  name: "hangar",
  type: "dark",
  colors: {
    "editor.background": C.bg,
    "editor.foreground": C.text,
  },
  settings: [
    {
      settings: { background: C.bg, foreground: C.text },
    },
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: C.punct, fontStyle: "italic" },
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
      settings: { foreground: C.punct },
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
      settings: { foreground: C.key },
    },
    {
      scope: ["variable", "variable.parameter", "entity.name.variable"],
      settings: { foreground: C.text },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: C.text },
    },
    {
      // What it says. A quoted string, a plain YAML scalar, a regexp.
      scope: ["string", "string.quoted", "string.unquoted", "string.regexp"],
      settings: { foreground: C.value },
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
      settings: { foreground: C.value },
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
      settings: { foreground: C.value },
    },
    {
      scope: ["markup.bold", "markup.heading"],
      settings: { foreground: C.value, fontStyle: "bold" },
    },
    {
      scope: ["markup.italic"],
      settings: { fontStyle: "italic" },
    },
  ],
};
