import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeFocusablePre from "../lib/rehype-focusable-pre";

const render = async (md: string) =>
  String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeFocusablePre)
      .use(rehypeStringify)
      .process(md)
  );

describe("rehype-focusable-pre", () => {
  it("makes a fence with no language keyboard-scrollable", async () => {
    const html = await render("```\nINFO a very long log line\n```");
    expect(html).toContain('<pre tabindex="0">');
  });

  it("skips mermaid sources and keeps an existing tabindex", async () => {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "pre",
          properties: { className: ["mermaid"] },
          children: [],
        },
        {
          type: "element",
          tagName: "pre",
          properties: { tabIndex: -1 },
          children: [],
        },
      ],
    };
    rehypeFocusablePre()(tree);
    expect(tree.children[0].properties).not.toHaveProperty("tabIndex");
    expect(tree.children[1].properties.tabIndex).toBe(-1);
  });
});
