import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const DIST = path.join(process.cwd(), "dist");

// Helper to read built HTML files
const readDistFile = (filePath: string) => {
  const fullPath = path.join(DIST, filePath);
  return fs.readFileSync(fullPath, "utf-8");
};

/** Every built page, for the assertions that have to hold site-wide. */
function* htmlFiles(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

describe("Build Output", () => {
  it("should generate index.html with correct content", () => {
    const html = readDistFile("index.html");
    expect(html).toContain('href="/docs"');
    expect(html).toContain('href="/blog"');
    expect(html).toContain('id="how-a-call-is-decided"');
  });

  it("should state the version and the licence on the index page", () => {
    const html = readDistFile("index.html");
    expect(html).toMatch(/v\d+\.\d+\.\d+ · open source · MIT/);
  });

  it("should render the install command on index page", () => {
    const html = readDistFile("index.html");
    expect(html).toContain("pip install mcp-hangar");
  });

  // Four sections (redesign stage 2): the verdict, the path, the record, start.
  it("should render the four home sections, in order", () => {
    const html = readDistFile("index.html");
    const at = [
      "Every MCP tool call ends in a verdict.",
      "How a call is decided",
      "What you can prove afterwards",
      "Install it, understand it, or look it up",
    ].map((t) => html.indexOf(t));
    for (const i of at) expect(i).toBeGreaterThan(-1);
    expect([...at].sort((x, y) => x - y)).toEqual(at);
    expect(html.match(/<h2[\s>]/g)).toHaveLength(3);
  });

  it("should render footer with copyright or open source text", () => {
    const html = readDistFile("index.html");
    expect(html).toContain("MCP Hangar");
    expect(html).toContain("MIT License");
  });

  // The hero names the verdict and the category; it does not argue for either.
  it("should lead with the verdict and say what the product is", () => {
    const html = readDistFile("index.html");
    expect(html).toContain("Every MCP tool call ends in a verdict.");
    expect(html).toContain(
      "Hangar is the runtime security and governance layer between your agents and your MCP servers"
    );
    // Kubernetes is one place it runs, not the premise (redesign D2).
    expect(html).toContain("Runs on a laptop, a VM, or Kubernetes.");
    expect(html).not.toContain("on Kubernetes.</p>");
    expect(html).not.toMatch(/Kubernetes-native/);
  });

  // One self-description everywhere a machine or a link preview reads it.
  it("should describe the product the same way in meta, OG, JSON-LD and llms.txt", () => {
    const html = readDistFile("index.html");
    const lead =
      "MCP Hangar is the runtime security and governance layer between your agents and your MCP servers";
    expect(html).toMatch(
      new RegExp(`<meta name="description" content="${lead}`)
    );
    expect(html).toMatch(
      new RegExp(`<meta property="og:description" content="${lead}`)
    );
    expect(html).toContain(
      "<title>MCP Hangar | Runtime security and governance for MCP</title>"
    );
    const ld = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      ),
    ].map((m) => JSON.parse(m[1]));
    expect(
      ld.find((b) => b["@type"] === "SoftwareApplication")?.description
    ).toContain(lead);
    for (const file of ["llms.txt", "llms-full.txt"]) {
      const content = readDistFile(file);
      expect(content, file).toContain(`> ${lead}`);
      const factsAt = content.indexOf("## Key facts");
      const head = content.slice(0, content.indexOf("\n## ", factsAt + 1));
      expect(head, file).not.toMatch(
        /Kubernetes-native|no anomaly detection|control plane/i
      );
    }
    expect(html).not.toMatch(/policy enforcement plane for MCP on Kubernetes/);
  });

  // The proof is a record, not an illustration: real reason codes in the
  // hero, the gate path drawn from core, and an exported line core wrote.
  it("should lead with records rather than an illustration", () => {
    const html = readDistFile("index.html");
    expect(html).toContain("tool_not_in_access_policy");
    expect(html).toContain("gate=approval state=pending");
    expect(html).toMatch(/l7_verdict=deny/);
    expect(html).toContain("LEEF:2.0|MCP Hangar|");
    expect(html).toContain("ToolInvocationDenied");
    // One record per verdict word, never colour alone.
    for (const v of ["allow", "hold", "deny"]) {
      expect(html).toMatch(new RegExp(`class="verdict[^"]*"[^>]*>\\s*${v}`));
    }
  });

  it("should draw every gate core runs, the tenant budget and timeout included", () => {
    const html = readDistFile("index.html");
    for (const label of ["Tenant budget", "Timeout", "Approval", "Digest pin"])
      expect(html).toContain(label);
    for (const label of ["Rate limit", "Egress policy (L7)", "Response size"])
      expect(html).toContain(label);
    expect(html).toMatch(/Generated from <code[^>]*>_GATES<\/code> in core v/);
  });

  // The recording is gone from home: a GIF whose first frame was setup noise,
  // downloaded alongside its own still (audit 4.5).
  it("should load no recording on the home page", () => {
    const html = readDistFile("index.html");
    expect(html).not.toContain("governed-deny.gif");
    expect(html).not.toContain("governed-deny.png");
  });

  // Copy that the redesign audit found wrong, against core v2.24.0.
  it("should not repeat the claims the audit corrected", () => {
    const home = readDistFile("index.html");
    // C7: a threshold-counting security handler does run; it never decides.
    expect(home).not.toContain("No anomaly scores to tune");
    expect(home).toContain("Nothing on the verdict path is scored or learned.");
    // C35: the approval gate does hold a call for a person.
    for (const page of [
      "costs-and-boundaries",
      "mid-flight-consent",
      "relay-with-governance",
      "govern-an-async-task-end-to-end",
      "enforcement-plane-vs-api-gateway",
    ]) {
      const html = readDistFile(`learn/${page}/index.html`);
      expect(html, page).not.toMatch(/prompts a person\s+and waits|not a hold/);
    }
    // Per-node release stamps on the /learn map read as legacy.
    expect(readDistFile("learn/index.html")).not.toMatch(
      /operator v0\.13\.0|· v1\.6\.0|1\.6\.x line/
    );
  });

  it("should offer the three doors out of the landing page", () => {
    const html = readDistFile("index.html");
    expect(html).toContain('href="/learn"');
    expect(html).toContain('href="/security"');
    expect(html).toContain('href="/docs/getting-started/quickstart"');
  });

  /**
   * The canonical URL on this site has no trailing slash — `vercel.json` sets
   * `trailingSlash: false`, the sitemap `serialize` strips it, and every
   * canonical and og:url is emitted slash-less. So a slashed internal link is
   * not a style question: Vercel answers it with a 308 and the visitor pays a
   * round-trip before the page they clicked starts loading.
   *
   * Applied once, this drifts back the first time someone adds a component.
   * Asserted over the whole of dist/, it cannot: the build goes red instead of
   * waiting for the next audit. `href="/"` is exempt — the root is the one
   * path whose canonical form is a slash.
   */
  it("should link internal pages without a trailing slash, everywhere in dist", () => {
    const SLASHED = /href="\/(docs|learn|blog|security)(\/[^"]*)?\/"/g;

    const offenders = [...htmlFiles(DIST)]
      .map((file) => ({
        page: path.relative(DIST, file),
        hits: [...new Set(fs.readFileSync(file, "utf-8").match(SLASHED) ?? [])],
      }))
      .filter((f) => f.hits.length > 0);

    expect(offenders).toEqual([]);
  });

  it("should generate privacy policy page", () => {
    const html = readDistFile("privacy/index.html");
    expect(html).toContain("Privacy Policy");
  });

  it("should generate terms page", () => {
    const html = readDistFile("terms/index.html");
    expect(html).toContain("Terms");
    expect(html).toContain("MIT");
  });

  it("should generate blog index page", () => {
    const html = readDistFile("blog/index.html");
    expect(html).toContain("mcp-hangar");
  });

  it("should NOT contain pricing or waitlist anywhere (regression check)", () => {
    const pagesToCheck = [
      "index.html",
      "privacy/index.html",
      "terms/index.html",
      "blog/index.html",
    ];

    for (const page of pagesToCheck) {
      const html = readDistFile(page).toLowerCase();
      expect(html).not.toContain('href="/pricing"');
      expect(html).not.toContain("waitlist");
    }
  });

  // TODO: axe-core a11y tests were originally planned but require serving
  // the built output and running a browser. Skipping for now as it is
  // too complex to set up without a browser automation tool in this environment.
  it.skip("should pass accessibility tests", () => {
    // a11y testing goes here
  });

  // --- SEO / LLM content layer smoke tests ---

  describe("SEO & LLM content layer", () => {
    it("should generate og-image.png in public output", () => {
      const filePath = path.join(process.cwd(), "dist", "og-image.png");
      expect(fs.existsSync(filePath)).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(1000); // Not an empty placeholder
    });

    it("should generate llms.txt with valid structure", () => {
      const content = readDistFile("llms.txt");
      expect(content).toMatch(/^# MCP Hangar/);
      expect(content).toContain("> MCP Hangar");
      expect(content).toContain("## Getting Started");
      expect(content).toContain(".md)");
    });

    it("should generate llms-full.txt with inlined content", () => {
      const content = readDistFile("llms-full.txt");
      expect(content).toMatch(/^# MCP Hangar/);
      expect(content.length).toBeGreaterThan(50000); // Full docs are large
      expect(content).toContain("## Getting Started");
      expect(content).toContain("```"); // Code blocks should be present
    });

    it("should generate .md endpoints for docs", () => {
      const md = readDistFile("docs/getting-started/quickstart.md");
      expect(md).toContain("# Quick Start");
      expect(md).toContain(
        "Source: https://mcp-hangar.io/docs/getting-started/quickstart"
      );
      expect(md).not.toContain("<nav");
      expect(md).not.toContain("<footer");
    });

    it("should include a Learn section in llms.txt with .md links", () => {
      const content = readDistFile("llms.txt");
      expect(content).toContain("## Learn");
      // Learn entries link to raw .md endpoints under /learn/
      expect(content).toMatch(
        /\]\(https:\/\/mcp-hangar\.io\/learn\/[^)]+\.md\)/
      );
    });

    it("should generate .md endpoints for learn entries", () => {
      const files = fs
        .readdirSync(path.join(process.cwd(), "dist", "learn"))
        .filter((f) => f.endsWith(".md"));
      expect(files.length).toBeGreaterThan(0);
      const md = readDistFile(`learn/${files[0]}`);
      expect(md).toContain("Source: https://mcp-hangar.io/learn/");
      expect(md).not.toContain("<nav");
    });

    // The request path draws its stages as components, so the stage names live
    // in attributes rather than in the MDX prose. Without the unwrapper
    // promoting them, the markdown twin is a run of unlabelled paragraphs.
    it("should keep stage names in the request-path .md twin", () => {
      const md = readDistFile("learn/the-request-path.md");
      expect(md).toContain("**Identity.**");
      expect(md).toContain("**Egress policy (L7).**");
      expect(md).not.toContain("<PathStage");
      expect(md).not.toContain("PathStage>");
    });

    it("should generate .md endpoints for blog posts", () => {
      const files = fs
        .readdirSync(path.join(process.cwd(), "dist", "blog"))
        .filter((f) => f.endsWith(".md"));
      expect(files.length).toBeGreaterThan(0);
      const md = readDistFile(`blog/${files[0]}`);
      expect(md).toContain("Source: https://mcp-hangar.io/blog/");
      expect(md).toContain("Author:");
    });

    it("should have no broken snippet directives in .md output", () => {
      const md = readDistFile("docs/upgrade.md");
      expect(md).not.toContain("--8<--");
    });

    it("should reference sitemap in robots.txt", () => {
      const robots = readDistFile("robots.txt");
      expect(robots).toContain("Sitemap:");
      expect(robots).toContain("mcp-hangar.io/sitemap");
    });

    it("should generate sitemap-index.xml with valid URLs", () => {
      const sitemap = readDistFile("sitemap-index.xml");
      expect(sitemap).toContain("https://mcp-hangar.io/");
      expect(sitemap).toContain("sitemap-0.xml");
    });

    it("should include JSON-LD structured data in homepage", () => {
      const html = readDistFile("index.html");
      expect(html).toContain("application/ld+json");
      expect(html).toContain("schema.org");
      expect(html).toContain("SoftwareApplication");
    });

    // The product block is read by machines only, so nothing else catches a
    // claim in it drifting from what core ships. OTLP is a trace and audit-span
    // export, not a SIEM format, and there is no native Windows install.
    it("should state only the SIEM formats and platforms that ship", () => {
      const html = readDistFile("index.html");
      const blocks = [
        ...html.matchAll(
          /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
        ),
      ].map((m) => JSON.parse(m[1]));
      const app = blocks.find((b) => b["@type"] === "SoftwareApplication");
      expect(app).toBeDefined();
      const siem = /SIEM export \(([^)]*)\)/.exec(app.description)?.[1];
      expect(siem).toBe("CEF, LEEF 2.0, JSON lines, RFC 5424 syslog");
      expect(app.operatingSystem).not.toMatch(/windows/i);

      for (const file of ["llms.txt", "llms-full.txt"]) {
        const content = readDistFile(file);
        expect(content, file).toMatch(
          /^- Audit export: SIEM export in CEF, LEEF 2\.0, JSON lines and RFC 5424 syslog; OTLP is a separate/m
        );
        expect(content, file).toContain("Windows only through WSL");
      }
    });

    // The /security section is a content collection precisely so it gets the
    // same machine surface as every other content page: a `.md` twin at the
    // same path and a line in llms.txt. These assert that, not the prose.
    it("should list the security collection in the llms.txt Security section", () => {
      const content = readDistFile("llms.txt");
      expect(content).toContain("## Security");
      expect(content).toContain("https://mcp-hangar.io/security/cve-ledger.md");
      expect(content).toContain(
        "https://mcp-hangar.io/security/owasp-mcp-top-10.md"
      );
      // One Security heading, not two — the docs pages share it.
      expect(content.match(/^## Security$/gm)?.length).toBe(1);
    });

    it("should generate .md mirrors for the security pages", () => {
      for (const slug of ["cve-ledger", "owasp-mcp-top-10"]) {
        const md = readDistFile(`security/${slug}.md`);
        expect(md).toContain(`Source: https://mcp-hangar.io/security/${slug}`);
        expect(md).not.toContain("<nav");
        // MDX scaffolding must not leak into the machine surface.
        expect(md).not.toContain("import ");
        expect(md).not.toContain("<Callout");
      }
    });

    it("should give every CVE ledger entry a deep-linkable anchor", () => {
      const html = readDistFile("security/cve-ledger/index.html");
      expect(html).toContain('id="cve-2026-59950"');
    });

    it("should link both posture pages from the /security landing page", () => {
      const html = readDistFile("security/index.html");
      expect(html).toContain('href="/security/cve-ledger"');
      expect(html).toContain('href="/security/owasp-mcp-top-10"');
      // The advisory posts stay on the blog; the hub points at them.
      expect(html).toContain(
        'href="/blog/2026-07-16-security-advisory-cve-2026-59950"'
      );
    });

    it("should keep the OWASP page honest about scope and limits", () => {
      const html = readDistFile("security/owasp-mcp-top-10/index.html");
      expect(html).toContain("Out of scope by design");
      expect(html).toContain("it does not guess intent");
      // MCP04 and MCP09 stopped being "needs owner review" once the operator's
      // source settled them — but only into a narrower claim, and the page has
      // to keep saying where each one stops rather than rounding up to Covered.
      expect(html).toContain("misconfiguration, not concealment");
      expect(html).toContain("defaults to <code>warn</code>");
      expect(html).not.toContain(
        "an unregistered server gets no traffic today"
      );
    });

    it("all llms.txt links should have corresponding .md files", () => {
      const content = readDistFile("llms.txt");
      const links =
        content.match(/https:\/\/mcp-hangar\.io\/([^\s)]+\.md)/g) || [];
      expect(links.length).toBeGreaterThan(10);

      const missing: string[] = [];
      for (const link of links) {
        const localPath = link.replace("https://mcp-hangar.io/", "");
        const filePath = path.join(process.cwd(), "dist", localPath);
        if (!fs.existsSync(filePath)) {
          missing.push(localPath);
        }
      }
      expect(missing).toEqual([]);
    });
  });

  // WS-7 removed the CSS rule that hid a duplicate <h1>. Learn reuses the same
  // .blog-content wrapper as the blog, so stripping the heading from only one
  // of them left fourteen Learn pages rendering two — caught by the WS-8 gate,
  // not by looking at a blog post. One heading, everywhere, asserted.
  it("renders exactly one h1 on every article page", () => {
    const roots = ["learn", "blog"];
    for (const root of roots) {
      const dir = path.join(process.cwd(), "dist", root);
      const slugs = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
      expect(slugs.length).toBeGreaterThan(0);
      for (const slug of slugs) {
        const html = readDistFile(path.join(root, slug, "index.html"));
        expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
      }
    }
  });
});

describe("Sitemap route integrity", () => {
  it("every sitemap page resolves to built HTML", () => {
    const urls = [
      ...readDistFile("sitemap-0.xml").matchAll(/<loc>([^<]+)<\/loc>/g),
    ].map((match) => new URL(match[1]));
    expect(urls.length).toBeGreaterThan(10);
    const missing = urls.filter((url) => {
      const pathname = decodeURIComponent(url.pathname).replace(/^\//, "");
      return (
        !fs.existsSync(path.join(DIST, pathname, "index.html")) &&
        !fs.existsSync(path.join(DIST, `${pathname}.html`))
      );
    });
    expect(missing.map((url) => url.pathname)).toEqual([]);
  });
});

describe("Documentation section anchors", () => {
  /** Every built docs article, minus the listing page and the .md mirrors. */
  const docsPages = [...htmlFiles(path.join(DIST, "docs"))].filter(
    (file) => path.dirname(file) !== path.join(DIST, "docs")
  );

  it("builds a meaningful number of docs pages", () => {
    expect(docsPages.length).toBeGreaterThan(50);
  });

  // The docs collection runs its own unified pipeline rather than Astro's, and
  // for a long time that pipeline had no slugger: not one heading across the
  // documentation carried an `id`, so no section of it could be linked to. The
  // failure is silent -- the pages build, they read fine, and every deep link
  // anyone had ever shared pointed at the top of the page.
  it("gives every docs heading an id", () => {
    const naked: string[] = [];
    for (const file of docsPages) {
      const html = fs.readFileSync(file, "utf-8");
      const headings = html.match(/<h[23](?![\w-])[^>]*>/g) ?? [];
      if (headings.some((h) => !/\sid="/.test(h))) {
        naked.push(path.relative(DIST, file));
      }
    }
    expect(naked).toEqual([]);
  });

  it("renders a contents rail on pages with sections", () => {
    const withToc = docsPages.filter((file) =>
      fs.readFileSync(file, "utf-8").includes("docs-toc")
    );
    expect(withToc.length).toBeGreaterThan(docsPages.length * 0.8);
  });
});

// /security and the CVE ledger list core's published GitHub advisories from
// src/data/security-advisories.json. Before that, a hand-kept list said "every
// advisory is published in full on the blog" and showed one, after ten had
// been published on GitHub.
describe("Security advisories", () => {
  const { advisories } = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "src/data/security-advisories.json"),
      "utf-8"
    )
  ) as { advisories: { ghsaId: string; url: string }[] };

  it("lists every published advisory on /security and on the CVE ledger", () => {
    for (const page of [
      "security/index.html",
      "security/cve-ledger/index.html",
    ]) {
      const html = readDistFile(page);
      for (const a of advisories) {
        expect(html, `${page} ${a.ghsaId}`).toContain(`href="${a.url}"`);
      }
    }
  });

  it("keeps the blog write-ups and drops the claim that the blog holds them all", () => {
    const html = readDistFile("security/index.html");
    expect(html).toContain("/blog/2026-07-16-security-advisory-cve-2026-59950");
    expect(html).not.toContain(
      "Every advisory is published in full on the blog"
    );
  });

  it("gives machines the list as markdown in the ledger's .md twin", () => {
    const md = readDistFile("security/cve-ledger.md");
    for (const a of advisories) expect(md).toContain(`[${a.ghsaId}](${a.url})`);
    expect(md).not.toContain("<AdvisoryList");
  });
});

// Pagefind runs after `astro build` (package.json `build`) and indexes only
// what carries data-pagefind-body: the article on docs, Learn, blog and
// security pages.
describe("Search", () => {
  const countHtml = (dir: string) =>
    [...htmlFiles(path.join(DIST, dir))].filter(
      (f) => path.dirname(f) !== path.join(DIST, dir)
    ).length;

  it("builds a static index of exactly the content pages", () => {
    const entry = JSON.parse(readDistFile("pagefind/pagefind-entry.json"));
    expect(fs.existsSync(path.join(DIST, "pagefind/pagefind-ui.js"))).toBe(
      true
    );
    // The Decisions index (docs/adr) is a listing, like /docs itself, and
    // carries no data-pagefind-body.
    const expected =
      countHtml("docs") -
      Number(fs.existsSync(path.join(DIST, "docs/adr/index.html"))) +
      countHtml("learn") +
      countHtml("blog") +
      countHtml("security");
    expect(entry.languages.en.page_count).toBe(expected);
  });

  it("marks only article bodies for indexing", () => {
    expect(readDistFile("index.html")).not.toContain("data-pagefind-body");
    expect(readDistFile("docs/index.html")).not.toContain("data-pagefind-body");
    expect(
      readDistFile("docs/getting-started/quickstart/index.html")
    ).toContain('data-pagefind-filter="section:Docs"');
  });

  it("offers search from the nav and the docs sidebar, and keeps /search out of the index", () => {
    expect(readDistFile("index.html")).toContain('href="/search"');
    expect(readDistFile("docs/getting-started/quickstart/index.html")).toMatch(
      /<form action="\/search" method="get" role="search"/
    );
    const search = readDistFile("search/index.html");
    expect(search).toContain('<meta name="robots" content="noindex, nofollow"');
    expect(search).toContain('src="/pagefind/pagefind-ui.js"');
    expect(readDistFile("sitemap-0.xml")).not.toContain("/search");
  });
});

// One duration for install -> first governed deny (config TIME_TO_VALUE),
// everywhere the site states one. It used to be four.
describe("Time to value", () => {
  it("states the same duration on the home page, /docs and the Learn tutorial", () => {
    const pages = {
      home: readDistFile("index.html"),
      docs: readDistFile("docs/index.html"),
      learn: readDistFile("learn/index.html"),
      tutorial: readDistFile(
        "learn/from-install-to-a-governed-deny-locally/index.html"
      ),
    };
    expect(pages.home).toContain("five minutes, start to refusal");
    expect(pages.docs).toContain("in about five minutes");
    expect(pages.tutorial).toContain("in five minutes (no cluster)");
    for (const [name, html] of Object.entries(pages)) {
      expect(html, name).not.toMatch(/in 60 seconds|under 2 minutes/);
    }
  });
});

// Redesign D3: the docs site publishes product docs. Contributor and process
// pages stay on GitHub (lib/docs-publication), and ADRs are a separate
// Decisions section rather than 29 entries in the docs sidebar.
describe("Docs curation", () => {
  const exists = (p: string) => fs.existsSync(path.join(DIST, p));

  it("builds no page, .md twin or OG card for a contributor page", () => {
    for (const id of [
      "development/GIT_FLOW",
      "development/EPIC_PLAYBOOK",
      "development/CONTRIBUTING",
      "runbooks/RELEASE",
      "testing/approval-gate-manual-testing",
      "CONTRIBUTING",
    ]) {
      expect(exists(`docs/${id}/index.html`), id).toBe(false);
      expect(exists(`docs/${id}.md`), `${id}.md`).toBe(false);
      expect(exists(`og/docs/${id}.png`), `og ${id}`).toBe(false);
    }
    expect(exists("docs/development")).toBe(false);
    for (const file of ["llms.txt", "llms-full.txt", "sitemap-0.xml"]) {
      expect(readDistFile(file), file).not.toMatch(
        /\/docs\/(development\/|runbooks\/RELEASE|testing\/|CONTRIBUTING)/
      );
    }
  });

  it("lists every ADR with its number and status on the Decisions index", () => {
    const html = readDistFile("docs/adr/index.html");
    const adrs = fs
      .readdirSync(path.join(DIST, "docs/adr"), { withFileTypes: true })
      .filter((e) => e.isDirectory() && e.name.startsWith("ADR-"))
      .map((e) => e.name);
    expect(adrs.length).toBeGreaterThan(20);
    for (const id of adrs) {
      expect(html, id).toContain(`href="/docs/adr/${id}"`);
      expect(html, id).toContain(id.slice(0, 7)); // "ADR-014"
    }
    expect(html).toMatch(/>\s*Accepted/);
    expect(html).toMatch(/>\s*Superseded/);
    expect(html).not.toContain("Unknown");
  });

  it("keeps ADRs out of the docs sections and in their own Decisions group", () => {
    const html = readDistFile("docs/getting-started/quickstart/index.html");
    const sidebar = html.slice(
      html.indexOf('aria-label="Documentation"'),
      html.indexOf("</aside>")
    );
    const decisionsAt = sidebar.search(/<span[^>]*>Decisions<\/span>/);
    expect(decisionsAt).toBeGreaterThan(-1);
    // Every ADR link sits after the Decisions heading.
    expect(sidebar.indexOf('href="/docs/adr/')).toBeGreaterThan(decisionsAt);
    for (const title of [
      "Start",
      "Guides",
      "Cookbook",
      "Reference",
      "Operate",
      "Security",
    ]) {
      expect(sidebar, title).toMatch(new RegExp(`<span[^>]*>${title}</span>`));
    }
    expect(sidebar).not.toMatch(/<span[^>]*>(Development|ADRs)<\/span>/);
  });

  it("curates the /docs index into the sidebar's sections, with no emoji", () => {
    const html = readDistFile("docs/index.html");
    for (const title of [
      "Start",
      "Guides",
      "Cookbook",
      "Reference",
      "Operate",
      "Security",
    ]) {
      expect(html, title).toMatch(new RegExp(`>\\s*${title}\\s*</h2>`));
    }
    expect(html).toContain('href="/docs/adr"');
    expect(html).not.toMatch(/\p{Extended_Pictographic}/u);
    // Every link the index offers is a page that was built.
    const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
    for (const [, href] of main.matchAll(/href="(\/docs[^"#]*)"/g)) {
      const file =
        href === "/docs" ? "docs/index.html" : `${href.slice(1)}/index.html`;
      expect(exists(file), href).toBe(true);
    }
  });

  it("links Contributing to GitHub, not to a docs page", () => {
    const html = readDistFile("index.html");
    expect(html).toContain(
      'href="https://github.com/mcp-hangar/mcp-hangar/blob/main/CONTRIBUTING.md"'
    );
    expect(html).not.toContain('href="/docs/development/CONTRIBUTING"');
  });

  it("leaves no relative .md link in any built docs page", () => {
    const offenders: string[] = [];
    for (const file of htmlFiles(path.join(DIST, "docs"))) {
      const html = fs.readFileSync(file, "utf-8");
      for (const [, href] of html.matchAll(/<a [^>]*href="([^"]+)"/g)) {
        if (/^(?!https?:|mailto:)[^#]*\.md(#|$)/.test(href)) {
          offenders.push(`${path.relative(DIST, file)} -> ${href}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
