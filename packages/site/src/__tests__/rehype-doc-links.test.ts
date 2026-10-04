import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeDocLinks, { UnknownDocLinkError } from "../lib/rehype-doc-links";

const validIds = new Set([
  "guides/EGRESS_POLICY",
  "operations/RELEASE_COMPATIBILITY",
  "adr/ADR-014-x",
]);
// Files the docs repo has that the site does not publish.
const repoIds = new Set([
  ...validIds,
  "runbooks/RELEASE",
  "development/GIT_FLOW",
  "adr/README",
]);

async function render(markdown: string, docId: string) {
  const out = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeDocLinks, { validIds, repoIds })
    .use(rehypeStringify)
    .process({ value: markdown, data: { docId } });
  return String(out);
}

describe("rehype-doc-links", () => {
  it("rewrites a link to a published page into its site route", async () => {
    expect(
      await render("[x](EGRESS_POLICY.md#modes)", "guides/OTHER")
    ).toContain('href="/docs/guides/EGRESS_POLICY#modes"');
  });

  it("sends a link to an unpublished page to the file on GitHub", async () => {
    expect(
      await render(
        "[x](../runbooks/RELEASE.md)",
        "operations/RELEASE_COMPATIBILITY"
      )
    ).toContain(
      'href="https://github.com/mcp-hangar/docs/blob/main/runbooks/RELEASE.md"'
    );
    expect(
      await render("[x](../development/GIT_FLOW.md#a)", "guides/X")
    ).toContain(
      'href="https://github.com/mcp-hangar/docs/blob/main/development/GIT_FLOW.md#a"'
    );
  });

  it("sends the ADR README to the Decisions index", async () => {
    expect(await render("[ADRs](README.md)", "adr/ADR-014-x")).toContain(
      'href="/docs/adr"'
    );
  });

  // The 2026-10 audit found /docs/adr/README.md live on the site: an unknown
  // .md link used to pass through untouched. It now stops the build.
  it("fails the build on a .md link that names no file in the docs repo", async () => {
    await expect(render("[x](NOPE.md)", "guides/X")).rejects.toThrow(
      UnknownDocLinkError
    );
    await expect(render("[x](../../outside.md)", "guides/X")).rejects.toThrow(
      /no such file/
    );
  });

  it("leaves absolute, anchor and non-markdown links alone", async () => {
    const html = await render(
      "[a](https://example.com/x.md) [b](#here) [c](/docs/x) [d](diagram.png)",
      "guides/X"
    );
    expect(html).toContain('href="https://example.com/x.md"');
    expect(html).toContain('href="#here"');
    expect(html).toContain('href="/docs/x"');
    expect(html).toContain('href="diagram.png"');
  });
});
