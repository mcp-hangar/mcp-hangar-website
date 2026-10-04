import { describe, expect, it } from "vitest";
import fs from "node:fs";
import matter from "gray-matter";
import { TIME_TO_VALUE } from "../config";

// The site states one duration for install -> first governed deny. The Learn
// tutorial's frontmatter cannot import config.ts, so this holds it to the
// constant: a title that says "60 seconds" beside a card that says "5 min" is
// the inconsistency the redesign audit found (claim C24).
describe("time to value", () => {
  const file = new URL(
    "../content/learn/from-install-to-a-governed-deny-locally.mdx",
    import.meta.url
  );
  const { data, content } = matter(fs.readFileSync(file, "utf8"));

  it("is the same number in the laptop tutorial's title, card and body", () => {
    expect(data.title).toContain(`in ${TIME_TO_VALUE.words}`);
    expect(data.time).toBe(TIME_TO_VALUE.short);
    expect(content).toContain(`in about ${TIME_TO_VALUE.words}`);
    expect(`${data.title}\n${content}`).not.toMatch(
      /60 seconds|about a minute|under 2 minutes|ten minutes/i
    );
  });
});
