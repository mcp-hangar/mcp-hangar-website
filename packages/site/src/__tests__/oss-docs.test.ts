// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { LoaderContext } from "astro/loaders";
import { ossDocsLoader } from "../content/loaders/oss-docs";

const directories: string[] = [];
async function fixture() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "hangar-docs-"));
  directories.push(directory);
  return directory;
}
function context() {
  const entries = new Map<
    string,
    { id: string; body: string; rendered: { html: string } }
  >();
  const ctx = {
    store: {
      keys: () => entries.keys(),
      delete: (id: string) => entries.delete(id),
      set: (entry: { id: string; body: string; rendered: { html: string } }) =>
        entries.set(entry.id, entry),
    },
    logger: { info: vi.fn(), warn: vi.fn() },
    parseData: vi.fn(async ({ data }) => data),
  };
  return { entries, ctx: ctx as unknown as LoaderContext };
}
afterEach(async () => {
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => fs.rm(directory, { recursive: true, force: true }))
  );
});

describe("documentation loader", () => {
  it("fails on a missing or empty source instead of producing incomplete documentation", async () => {
    const directory = await fixture();
    const { ctx } = context();
    await expect(
      ossDocsLoader({ directory: path.join(directory, "missing") }).load(ctx)
    ).rejects.toThrow();
    await expect(ossDocsLoader({ directory }).load(ctx)).rejects.toThrow(
      "No documentation"
    );
  });

  it("supports file URLs with spaces and removes deleted documents on reload", async () => {
    const directory = path.join(await fixture(), "docs with spaces");
    await fs.mkdir(directory);
    await fs.writeFile(path.join(directory, "first.md"), "# First\n\nHello");
    await fs.writeFile(
      path.join(directory, "second.md"),
      "# Second\n\nGoodbye"
    );
    const { ctx, entries } = context();
    const loader = ossDocsLoader({ directory: pathToFileURL(directory) });
    await loader.load(ctx);
    expect(entries.get("first")?.rendered.html).toContain("<p>Hello</p>");
    await fs.unlink(path.join(directory, "second.md"));
    await loader.load(ctx);
    expect([...entries.keys()]).toEqual(["first"]);
  });

  it("resolves snippets while preserving handling of missing files and self references", async () => {
    const directory = await fixture();
    await fs.writeFile(path.join(directory, "snippet.txt"), "Included text");
    await fs.writeFile(
      path.join(directory, "page.md"),
      '# Page\n\n--8<-- "snippet.txt"\n\n--8<-- "missing.txt"\n\n--8<-- "page.md"'
    );
    const { ctx, entries } = context();
    await ossDocsLoader({ directory }).load(ctx);
    expect(entries.get("page")?.body).toContain("Included text");
    expect(entries.get("page")?.body).not.toContain("--8<--");
    expect(ctx.logger.warn).toHaveBeenCalledWith(
      "Missing snippet missing.txt in page.md"
    );
  });

  it.each(["../outside.txt", "/etc/passwd"])(
    "rejects escaped snippet paths: %s",
    async (snippet) => {
      const directory = await fixture();
      await fs.writeFile(
        path.join(directory, "page.md"),
        `# Page\n\n--8<-- "${snippet}"`
      );
      const { ctx, entries } = context();
      await expect(ossDocsLoader({ directory }).load(ctx)).rejects.toThrow(
        "escapes source directory"
      );
      expect(entries.size).toBe(0);
    }
  );

  it("rejects snippets symlinked outside the source", async () => {
    const parent = await fixture();
    const directory = path.join(parent, "docs");
    await fs.mkdir(directory);
    await fs.writeFile(path.join(parent, "outside.txt"), "outside");
    await fs.symlink(
      path.join(parent, "outside.txt"),
      path.join(directory, "snippet.txt")
    );
    await fs.writeFile(
      path.join(directory, "page.md"),
      '# Page\n\n--8<-- "snippet.txt"'
    );
    const { ctx } = context();
    await expect(ossDocsLoader({ directory }).load(ctx)).rejects.toThrow(
      "escapes source directory"
    );
  });

  it("leaves the previous store intact when a later document fails validation", async () => {
    const directory = await fixture();
    await fs.writeFile(path.join(directory, "a.md"), "# A\n\nOriginal");
    const { ctx, entries } = context();
    const loader = ossDocsLoader({ directory });
    await loader.load(ctx);
    await fs.writeFile(path.join(directory, "a.md"), "# A\n\nChanged");
    await fs.writeFile(
      path.join(directory, "b.md"),
      '# B\n\n--8<-- "../outside.txt"'
    );
    await expect(loader.load(ctx)).rejects.toThrow();
    expect(entries.get("a")?.body).toContain("Original");
  });
});
