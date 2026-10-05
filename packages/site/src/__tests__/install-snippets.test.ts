import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// `curl ... install.sh | bash` runs the installer in a child process, so it
// cannot put `mcp-hangar` on the PATH of the shell the reader pasted into.
// A snippet that installs and then calls `mcp-hangar` in the same block has to
// export the bin dir first, or its next line exits 127 (#302). This holds every
// snippet the site renders to that: its own MDX and the docs it pins.

const require = createRequire(import.meta.url);
const contentDir = fileURLToPath(new URL("../content", import.meta.url));
const docsDir = path.dirname(require.resolve("@mcp-hangar/docs/package.json"));

function walk(dir: string, ext: RegExp): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory())
      return entry.name === "node_modules" ? [] : walk(full, ext);
    return ext.test(entry.name) ? [full] : [];
  });
}

function codeBlocks(source: string): string[] {
  return [...source.matchAll(/^\s*(```|~~~)[^\n]*\n([\s\S]*?)^\s*\1/gm)].map(
    (m) => m[2]
  );
}

/** Why a block fails as written in a fresh shell, or null if it does not. */
export function brokenInstall(block: string): string | null {
  const lines = block.split("\n");
  const at = lines.findIndex((line) => /install\.sh\s*\|\s*(ba)?sh/.test(line));
  if (at === -1) return null;
  if (/&&\s*mcp-hangar\b/.test(lines[at]))
    return "chains mcp-hangar onto the installer";
  for (const line of lines.slice(at + 1)) {
    if (/^\s*(export PATH=|set -gx PATH )/.test(line)) return null;
    if (/^\s*mcp-hangar\b/.test(line))
      return "calls mcp-hangar before putting it on PATH";
  }
  return null;
}

describe("install snippets", () => {
  it("recognises the broken shapes", () => {
    expect(
      brokenInstall(
        "curl -sSL https://mcp-hangar.io/install.sh | bash && mcp-hangar init -y"
      )
    ).toMatch(/chains/);
    expect(
      brokenInstall(
        "curl -sSL https://mcp-hangar.io/install.sh | bash\nmcp-hangar serve"
      )
    ).toMatch(/before/);
    expect(
      brokenInstall(
        'curl -sSL https://mcp-hangar.io/install.sh | bash\nexport PATH="$HOME/.mcp-hangar/bin:$PATH"\nmcp-hangar serve'
      )
    ).toBeNull();
    expect(
      brokenInstall("curl -sSL https://mcp-hangar.io/install.sh | bash")
    ).toBeNull();
  });

  const files = [...walk(contentDir, /\.mdx?$/), ...walk(docsDir, /\.md$/)];

  it("finds the snippets it is meant to check", () => {
    const withInstaller = files.filter((f) =>
      fs.readFileSync(f, "utf8").includes("install.sh | bash")
    );
    expect(withInstaller.length).toBeGreaterThan(1);
  });

  it("never calls mcp-hangar in the installing shell before exporting PATH", () => {
    const broken = files.flatMap((file) =>
      codeBlocks(fs.readFileSync(file, "utf8")).flatMap((block) => {
        const why = brokenInstall(block);
        return why ? [`${path.relative(process.cwd(), file)}: ${why}`] : [];
      })
    );
    expect(broken).toEqual([]);
  });
});
