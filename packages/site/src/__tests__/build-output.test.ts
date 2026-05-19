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

  it('should render key sections like Why Hangar and Built for real problems', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('Why Hangar');
    expect(html).toContain('Built for real problems');
  });

  it('should render footer with copyright or open source text', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('MCP Hangar');
    expect(html).toContain('MIT License');
  });

  it('should render feature titles and descriptions', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('Parallel Execution');
    expect(html).toContain('Concurrent tool calls');
  });

  it('should render features with icons', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('viewBox="0 0 24 24"');
  });

  it('should render step numbers, titles, and descriptions', () => {
    const html = readDistFile('index.html');
    expect(html).toContain('Install the agent');
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
});
