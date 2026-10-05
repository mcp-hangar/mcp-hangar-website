import { describe, it, expect } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeTaskListLabels from "../lib/rehype-task-list-labels";

const render = async (md: string) =>
  String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeTaskListLabels)
      .use(rehypeStringify)
      .process(md)
  );

describe("rehype-task-list-labels", () => {
  it("names each checkbox with its item's text and keeps its state", async () => {
    const html = await render(
      "- [ ] TLS termination configured\n- [x] `auth.enabled: true` and `auth.allow_anonymous: false`"
    );
    expect(html).toContain(
      '<input type="checkbox" disabled aria-label="TLS termination configured">'
    );
    expect(html).toContain(
      '<input type="checkbox" checked disabled aria-label="auth.enabled: true and auth.allow_anonymous: false">'
    );
  });

  it("leaves nested items out of the parent's name", async () => {
    const html = await render(
      "- [ ] Parent step\n  - [ ] Child step\n  - [x] Other child"
    );
    expect(html).toContain('aria-label="Parent step"');
    expect(html).toContain('aria-label="Child step"');
    expect(html).toContain('aria-label="Other child"');
  });

  it("names the checkbox of a loose list, inside its paragraph", async () => {
    const html = await render("- [ ] First\n\n- [ ] Second\n");
    expect(html).toContain('aria-label="First"');
    expect(html).toContain('aria-label="Second"');
  });

  it("keeps a name the source already gave, and touches no other input", async () => {
    const html = await render(
      '<ul><li class="task-list-item"><input type="checkbox" aria-label="Given"> Text</li></ul>\n\n<input type="checkbox">'
    );
    expect(html).toContain('aria-label="Given"');
    expect(html).not.toContain('aria-label="Text"');
    expect(html.match(/aria-label/g)).toHaveLength(1);
  });
});
