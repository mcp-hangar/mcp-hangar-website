import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import matter from "gray-matter";
import { MARKER } from "../../scripts/release-post.mjs";

const SRC = path.resolve(__dirname, "..");
const BLOG = path.join(SRC, "content/blog");

function* sources(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "__tests__") yield* sources(full);
    } else if (/\.(ts|mjs|astro)$/.test(entry.name)) yield full;
  }
}

describe("blog drafts", () => {
  it("are read through publishedPosts() only, so no route, feed or card builds one", () => {
    const direct = [...sources(SRC)]
      .filter((f) => !f.endsWith(path.join("lib", "blog.ts")))
      .filter((f) =>
        /getCollection\(\s*["']blog["']/.test(fs.readFileSync(f, "utf8"))
      )
      .map((f) => path.relative(SRC, f));
    expect(direct).toEqual([]);
  });

  it("carry their editor markers; a published post carries none", () => {
    const unfinished = fs
      .readdirSync(BLOG)
      .filter((f) => f.endsWith(".mdx"))
      .filter((f) => {
        const { data, content } = matter(
          fs.readFileSync(path.join(BLOG, f), "utf8")
        );
        return (
          !data.draft &&
          (content.includes(MARKER) || JSON.stringify(data).includes(MARKER))
        );
      });
    expect(unfinished).toEqual([]);
  });
});
