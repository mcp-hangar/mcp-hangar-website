import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Helper to read built HTML files
const readDistFile = (filePath: string) => {
  const fullPath = path.join(process.cwd(), 'dist', filePath);
  return fs.readFileSync(fullPath, 'utf-8');
};

describe('Build Output', () => {
  it('should generate index.html with correct content', () => {
    const html = readDistFile('index.html');
    
    expect(html).toContain('mcp-hangar');
    
    expect(html).toContain('href="/docs/"');
    expect(html).toContain('href="/docs/blog/"');
    
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
    expect(html).toContain('Capabilities');
  });

  it('should render footer with copyright or open source text', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('MCP Hangar');
    expect(html).toContain('MIT License');
  });

  it('should render capability titles and descriptions', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('Governance');
    expect(html).toContain('Per-caller access policies');
  });

  it('should render features with icons', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('viewBox="0 0 24 24"');
  });

  it('should render step numbers, titles, and descriptions', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('Install the operator');
    expect(html).toContain('Apply an egress policy');
    expect(html).toContain('1');
  });

  it('should render step children', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('pip install mcp-hangar');
  });

  it('should render connector lines between steps', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('w-px');
    expect(html).toContain('bg-gradient-to-b');
  });

  it('should render icon SVGs correctly', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('svg');
    expect(html).toContain('stroke="currentColor"');
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
});
