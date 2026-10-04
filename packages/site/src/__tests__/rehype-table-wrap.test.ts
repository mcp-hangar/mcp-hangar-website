import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeTableWrap from "../lib/rehype-table-wrap";

const render = async (md: string) =>
  String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeTableWrap)
      .use(rehypeStringify)
      .process(md)
  );

describe("rehype-table-wrap", () => {
  it("wraps a markdown table in a focusable, named scroll region", async () => {
    const html = await render(
      "| Key | Type | Default |\n| --- | --- | --- |\n| `allow_list` | list | [] |"
    );
    expect(html).toMatch(
      /^<div class="table-wrap" tabindex="0" role="region" aria-label="Table: Key, Type, Default"><table>/
    );
    expect(html.trimEnd()).toMatch(/<\/table><\/div>$/);
  });

  it("wraps every table once, and leaves other content alone", async () => {
    const table = "| A |\n| - |\n| 1 |";
    const html = await render(`${table}\n\nText\n\n${table}`);
    expect(html.match(/class="table-wrap"/g)).toHaveLength(2);
    expect(html).toContain("<p>Text</p>");
  });

  it("does not wrap a table twice when run again", async () => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeTableWrap)
      .use(rehypeTableWrap)
      .use(rehypeStringify);
    const html = String(await processor.process("| A |\n| - |\n| 1 |"));
    expect(html.match(/class="table-wrap"/g)).toHaveLength(1);
  });
});
