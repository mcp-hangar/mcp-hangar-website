import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const DIST = path.join(process.cwd(), 'dist');

// Helper to read built HTML files
const readDistFile = (filePath: string) => {
  const fullPath = path.join(DIST, filePath);
  return fs.readFileSync(fullPath, 'utf-8');
};

/** Every built page, for the assertions that have to hold site-wide. */
function* htmlFiles(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

describe('Build Output', () => {
  it('should generate index.html with correct content', () => {
    const html = readDistFile('index.html');
    
    expect(html).toContain('mcp-hangar');
    
    expect(html).toContain('href="/docs"');
    expect(html).toContain('href="/blog"');
    
    expect(html).toContain('id="features"');
  });

  it('should display OSS badge on index page', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('Open Source — MIT License');
  });

  it('should render the install command on index page', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('pip install mcp-hangar');
  });

  it('should render key sections', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('How it works');
    expect(html).toContain('What you do with it');
    expect(html).toContain('Runs as a fleet');
  });

  it('should render footer with copyright or open source text', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('MCP Hangar');
    expect(html).toContain('MIT License');
  });

  // The sixteen-tile capability grid is gone; four use-case cards replace it.
  it('should render the four use cases, not a capability grid', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('Govern who calls what');
    expect(html).toContain('Pin what tools claim to be');
    expect(html).toContain('Control where data goes');
    expect(html).toContain('Prove what happened');
    // The anchor two nav surfaces still point at has to survive the swap.
    expect(html).toContain('id="features"');
  });

  // The hero names the verdict and the category; it does not argue for either.
  it('should lead with the verdict and say what the product is', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('Every MCP tool call ends in a verdict.');
    expect(html).toContain('policy enforcement plane for MCP on Kubernetes');
  });

  // The ecosystem thesis is an argument, so it opens the argument section --
  // one below the hero. If it ever climbs back into the h1, this fails.
  it('should argue the ecosystem thesis below the hero, not in it', () => {
    const html = readDistFile('index.html');
    const verdict = html.indexOf('Every MCP tool call ends in a verdict.');
    const thesis = html.indexOf('Nothing in the protocol');

    expect(verdict).toBeGreaterThan(-1);
    expect(thesis).toBeGreaterThan(verdict);
    expect(html).toMatch(/Hangar is\s+the layer/);
    // It has to sit inside "Why enforcement, not detection", not float above it.
    expect(thesis).toBeGreaterThan(html.indexOf('Why enforcement, not detection'));
  });

  it('should lead with a real denial rather than an illustration', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('MCPEgressPolicy');       // the policy
    expect(html).toContain('github.create_issue');   // the call it refuses
    expect(html).toContain('-32021');                // the code on the wire
    expect(html).toContain('team-research@corp');    // attributed to a caller
  });

  it('should keep the egress version qualifier wherever egress is promised', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('v1.6.0+');
    expect(html).toContain('v0.14.0+');
  });

  it('should render features with icons', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('viewBox="0 0 24 24"');
  });

  // The step-by-step operator tutorial that used to run inline here now lives at
  // /learn/from-install-to-a-governed-deny. The landing page keeps the install
  // command and points at the three doors instead.
  it('should offer the three doors out of the landing page', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('Where to go next');
    expect(html).toContain('href="/learn"');
    expect(html).toContain('href="/docs/getting-started/quickstart"');
  });

  it('should render the install command in the start door', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('pip install mcp-hangar');
  });

  it('should link the async governance teaser to its Learn page', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('href="/learn/relay-with-governance"');
  });

  // Hardening was a full section, then a disclosure; it is one sentence now,
  // and the detail lives at /security.
  it('should reduce hardening to a sentence that points at /security', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('OWASP MCP Top 10');
    expect(html).toContain('href="/security"');
  });

  it('should render icon SVGs correctly', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('svg');
    expect(html).toContain('stroke="currentColor"');
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
  it('should link internal pages without a trailing slash, everywhere in dist', () => {
    const SLASHED = /href="\/(docs|learn|blog|security)(\/[^"]*)?\/"/g;

    const offenders = [...htmlFiles(DIST)]
      .map(file => ({
        page: path.relative(DIST, file),
        hits: [...new Set(fs.readFileSync(file, 'utf-8').match(SLASHED) ?? [])],
      }))
      .filter(f => f.hits.length > 0);

    expect(offenders).toEqual([]);
  });

  it('should generate privacy policy page', () => {
    const html = readDistFile('privacy/index.html');
    expect(html).toContain('Privacy Policy');
  });

  it('should generate terms page', () => {
    const html = readDistFile('terms/index.html');
    expect(html).toContain('Terms');
    expect(html).toContain('MIT');
  });

  it('should generate blog index page', () => {
    const html = readDistFile('blog/index.html');
    expect(html).toContain('mcp-hangar');
  });

  it('should NOT contain pricing or waitlist anywhere (regression check)', () => {
    const pagesToCheck = [
      'index.html',
      'privacy/index.html',
      'terms/index.html',
      'blog/index.html'
    ];

    for (const page of pagesToCheck) {
      const html = readDistFile(page).toLowerCase();
      expect(html).not.toContain('href="/pricing"');
      expect(html).not.toContain('waitlist');
    }
  });

  // TODO: axe-core a11y tests were originally planned but require serving
  // the built output and running a browser. Skipping for now as it is
  // too complex to set up without a browser automation tool in this environment.
  it.skip('should pass accessibility tests', () => {
    // a11y testing goes here
  });

  // --- SEO / LLM content layer smoke tests ---

  describe('SEO & LLM content layer', () => {
    it('should generate og-image.png in public output', () => {
      const filePath = path.join(process.cwd(), 'dist', 'og-image.png');
      expect(fs.existsSync(filePath)).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(1000); // Not an empty placeholder
    });

    it('should generate llms.txt with valid structure', () => {
      const content = readDistFile('llms.txt');
      expect(content).toMatch(/^# MCP Hangar/);
      expect(content).toContain('> MCP Hangar');
      expect(content).toContain('## Getting Started');
      expect(content).toContain('.md)');
    });

    it('should generate llms-full.txt with inlined content', () => {
      const content = readDistFile('llms-full.txt');
      expect(content).toMatch(/^# MCP Hangar/);
      expect(content.length).toBeGreaterThan(50000); // Full docs are large
      expect(content).toContain('## Getting Started');
      expect(content).toContain('```'); // Code blocks should be present
    });

    it('should generate .md endpoints for docs', () => {
      const md = readDistFile('docs/getting-started/quickstart.md');
      expect(md).toContain('# Quick Start');
      expect(md).toContain('Source: https://mcp-hangar.io/docs/getting-started/quickstart');
      expect(md).not.toContain('<nav');
      expect(md).not.toContain('<footer');
    });

    it('should include a Learn section in llms.txt with .md links', () => {
      const content = readDistFile('llms.txt');
      expect(content).toContain('## Learn');
      // Learn entries link to raw .md endpoints under /learn/
      expect(content).toMatch(/\]\(https:\/\/mcp-hangar\.io\/learn\/[^)]+\.md\)/);
    });

    it('should generate .md endpoints for learn entries', () => {
      const files = fs.readdirSync(path.join(process.cwd(), 'dist', 'learn'))
        .filter(f => f.endsWith('.md'));
      expect(files.length).toBeGreaterThan(0);
      const md = readDistFile(`learn/${files[0]}`);
      expect(md).toContain('Source: https://mcp-hangar.io/learn/');
      expect(md).not.toContain('<nav');
    });

    it('should generate .md endpoints for blog posts', () => {
      const files = fs.readdirSync(path.join(process.cwd(), 'dist', 'blog'))
        .filter(f => f.endsWith('.md'));
      expect(files.length).toBeGreaterThan(0);
      const md = readDistFile(`blog/${files[0]}`);
      expect(md).toContain('Source: https://mcp-hangar.io/blog/');
      expect(md).toContain('Author:');
    });

    it('should have no broken snippet directives in .md output', () => {
      const md = readDistFile('docs/upgrade.md');
      expect(md).not.toContain('--8<--');
    });

    it('should reference sitemap in robots.txt', () => {
      const robots = readDistFile('robots.txt');
      expect(robots).toContain('Sitemap:');
      expect(robots).toContain('mcp-hangar.io/sitemap');
    });

    it('should generate sitemap-index.xml with valid URLs', () => {
      const sitemap = readDistFile('sitemap-index.xml');
      expect(sitemap).toContain('https://mcp-hangar.io/');
      expect(sitemap).toContain('sitemap-0.xml');
    });

    it('should include JSON-LD structured data in homepage', () => {
      const html = readDistFile('index.html');
      expect(html).toContain('application/ld+json');
      expect(html).toContain('schema.org');
      expect(html).toContain('SoftwareApplication');
    });

    // The /security section is a content collection precisely so it gets the
    // same machine surface as every other content page: a `.md` twin at the
    // same path and a line in llms.txt. These assert that, not the prose.
    it('should list the security collection in the llms.txt Security section', () => {
      const content = readDistFile('llms.txt');
      expect(content).toContain('## Security');
      expect(content).toContain('https://mcp-hangar.io/security/cve-ledger.md');
      expect(content).toContain('https://mcp-hangar.io/security/owasp-mcp-top-10.md');
      // One Security heading, not two — the docs pages share it.
      expect(content.match(/^## Security$/gm)?.length).toBe(1);
    });

    it('should generate .md mirrors for the security pages', () => {
      for (const slug of ['cve-ledger', 'owasp-mcp-top-10']) {
        const md = readDistFile(`security/${slug}.md`);
        expect(md).toContain(`Source: https://mcp-hangar.io/security/${slug}`);
        expect(md).not.toContain('<nav');
        // MDX scaffolding must not leak into the machine surface.
        expect(md).not.toContain('import ');
        expect(md).not.toContain('<Callout');
      }
    });

    it('should give every CVE ledger entry a deep-linkable anchor', () => {
      const html = readDistFile('security/cve-ledger/index.html');
      expect(html).toContain('id="cve-2026-59950"');
    });

    it('should link both posture pages from the /security landing page', () => {
      const html = readDistFile('security/index.html');
      expect(html).toContain('href="/security/cve-ledger"');
      expect(html).toContain('href="/security/owasp-mcp-top-10"');
      // The advisory posts stay on the blog; the hub points at them.
      expect(html).toContain('href="/blog/2026-07-16-security-advisory-cve-2026-59950"');
    });

    it('should keep the OWASP page honest about scope and limits', () => {
      const html = readDistFile('security/owasp-mcp-top-10/index.html');
      expect(html).toContain('Out of scope by design');
      expect(html).toContain('it does not guess intent');
      // MCP04 and MCP09 stopped being "needs owner review" once the operator's
      // source settled them — but only into a narrower claim, and the page has
      // to keep saying where each one stops rather than rounding up to Covered.
      expect(html).toContain('misconfiguration, not concealment');
      expect(html).toContain('defaults to <code>warn</code>');
      expect(html).not.toContain('an unregistered server gets no traffic today');
    });

    it('all llms.txt links should have corresponding .md files', () => {
      const content = readDistFile('llms.txt');
      const links = content.match(/https:\/\/mcp-hangar\.io\/([^\s)]+\.md)/g) || [];
      expect(links.length).toBeGreaterThan(10);

      const missing: string[] = [];
      for (const link of links) {
        const localPath = link.replace('https://mcp-hangar.io/', '');
        const filePath = path.join(process.cwd(), 'dist', localPath);
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
  it('renders exactly one h1 on every article page', () => {
    const roots = ['learn', 'blog'];
    for (const root of roots) {
      const dir = path.join(process.cwd(), 'dist', root);
      const slugs = fs.readdirSync(dir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
      expect(slugs.length).toBeGreaterThan(0);
      for (const slug of slugs) {
        const html = readDistFile(path.join(root, slug, 'index.html'));
        expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
      }
    }
  });
});
