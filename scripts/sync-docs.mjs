#!/usr/bin/env node

/**
 * Docs Fetch Script
 *
 * Fetches documentation from the main mcp-hangar repository at BUILD TIME.
 * Files are NOT committed to this repo - they're fetched fresh each build.
 *
 * Usage:
 *   node scripts/sync-docs.mjs          # Fetch docs for build
 *   node scripts/sync-docs.mjs --clean  # Remove fetched docs
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const TEMP_DIR = join(ROOT_DIR, '.docs-temp');
const DOCS_DIR = join(ROOT_DIR, 'docs');
const OSS_DOCS_DIR = join(DOCS_DIR, 'oss');

const REPO_URL = 'https://github.com/mcp-hangar/mcp-hangar.git';
const BRANCH = 'main';

// Files maintained in THIS repo (website-specific content)
const LOCAL_FILES = [
  'index.md',
  '.vitepress/',
  'cloud/',
  'blog/',
  'oss/index.md',
];

// Files to skip from main repo (cause build issues)
const SKIP_FILES = [
  'copilot-instructions.md',  // Contains em-dash that breaks VitePress parser
];

// Mapping from source repo structure to website docs structure
// null dest = keep same structure, string = rename/move
const DOCS_MAPPING = {
  // Include entire docs folder, with some path transformations
  'docs/': {
    include: ['**/*.md'],
    exclude: ['**/README.md'],  // Skip READMEs, we have our own index
    flatten: false,
  },
  // Also include root-level docs
  'CHANGELOG.md': 'changelog.md',
  'SECURITY.md': 'security.md',
  'CODE_OF_CONDUCT.md': 'code-of-conduct.md',
  'UPGRADE.md': 'upgrade.md',
};

const isClean = process.argv.includes('--clean');
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

function log(msg) {
  console.log(`[fetch-docs] ${msg}`);
}

function verbose(msg) {
  if (isVerbose) console.log(`[fetch-docs]   ${msg}`);
}

function isLocalFile(relativePath) {
  return LOCAL_FILES.some(local => {
    const normalized = local.endsWith('/') ? local.slice(0, -1) : local;
    return relativePath === normalized || relativePath.startsWith(local);
  });
}

function shouldSkipFile(filename) {
  return SKIP_FILES.some(skip => filename === skip || filename.endsWith('/' + skip));
}

function transformMarkdown(content, sourcePath) {
  // Add source reference comment
  const sourceRef = `<!-- Source: https://github.com/mcp-hangar/mcp-hangar/blob/main/${sourcePath} -->\n\n`;

  // Fix relative links for VitePress
  content = content
    // Convert relative .md links
    .replace(/\]\(\.\/([^)]+)\.md\)/g, '](/$1)')
    .replace(/\]\(\.\.\/([^)]+)\.md\)/g, '](/$1)')
    // Keep absolute links as-is
    .replace(/\]\(\/docs\/([^)]+)\)/g, ']($1)');

  return sourceRef + content;
}

function copyDocsRecursive(srcDir, destDir, baseSrcPath = '') {
  if (!existsSync(srcDir)) return 0;

  let count = 0;
  const entries = readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name);
    const relativePath = join(baseSrcPath, entry.name);
    const destPath = join(destDir, entry.name);

    if (entry.isDirectory()) {
      // Skip hidden directories
      if (entry.name.startsWith('.')) continue;

      mkdirSync(destPath, { recursive: true });
      count += copyDocsRecursive(srcPath, destPath, relativePath);
    } else if (entry.name.endsWith('.md')) {
      // Skip files that cause build issues
      if (shouldSkipFile(entry.name)) {
        verbose(`Skipping problematic file: ${entry.name}`);
        continue;
      }

      // Skip if it's a local file we maintain
      const relativeToDocsDir = relativePath;
      if (isLocalFile(relativeToDocsDir)) {
        verbose(`Skipping local file: ${relativeToDocsDir}`);
        continue;
      }

      let content = readFileSync(srcPath, 'utf-8');
      content = transformMarkdown(content, `docs/${relativePath}`);

      mkdirSync(dirname(destPath), { recursive: true });
      writeFileSync(destPath, content);
      verbose(`Copied: ${relativePath}`);
      count++;
    }
  }

  return count;
}

function cleanFetchedDocs() {
  log('Cleaning fetched documentation...');

  // Remove fetched content inside docs/oss/ (except oss/index.md which is local)
  if (existsSync(OSS_DOCS_DIR)) {
    const entries = readdirSync(OSS_DOCS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(OSS_DOCS_DIR, entry.name);
      const relativePath = `oss/${entry.name}`;

      if (isLocalFile(relativePath)) {
        verbose(`Keeping local: ${relativePath}`);
        continue;
      }

      if (entry.isDirectory()) {
        rmSync(fullPath, { recursive: true });
        verbose(`Removed dir: ${relativePath}`);
      } else {
        rmSync(fullPath);
        verbose(`Removed: ${relativePath}`);
      }
    }
  }

  // Also remove legacy top-level fetched docs (from before the oss/ migration)
  if (existsSync(DOCS_DIR)) {
    const entries = readdirSync(DOCS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(DOCS_DIR, entry.name);

      if (isLocalFile(entry.name)) {
        verbose(`Keeping local: ${entry.name}`);
        continue;
      }

      if (entry.isDirectory()) {
        rmSync(fullPath, { recursive: true });
        verbose(`Removed dir: ${entry.name}`);
      } else {
        rmSync(fullPath);
        verbose(`Removed: ${entry.name}`);
      }
    }
  }

  // Remove temp directory
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true });
  }

  log('Clean complete');
}

async function fetchDocs() {
  log('Fetching documentation from main repository...');

  // Clean previous fetch
  if (existsSync(TEMP_DIR)) {
    rmSync(TEMP_DIR, { recursive: true });
  }

  // Shallow clone
  log(`Cloning ${REPO_URL} (branch: ${BRANCH})...`);
  execSync(`git clone --depth 1 --branch ${BRANCH} ${REPO_URL} ${TEMP_DIR}`, {
    encoding: 'utf-8',
    stdio: isVerbose ? 'inherit' : 'pipe',
  });

  // Copy docs into docs/oss/
  mkdirSync(OSS_DOCS_DIR, { recursive: true });
  const srcDocsDir = join(TEMP_DIR, 'docs');
  const count = copyDocsRecursive(srcDocsDir, OSS_DOCS_DIR);

  // Copy root-level markdown files mapped in DOCS_MAPPING
  const rootMappings = {
    'CHANGELOG.md': 'changelog.md',
    'SECURITY.md': 'security.md',
    'CODE_OF_CONDUCT.md': 'code-of-conduct.md',
    'UPGRADE.md': 'upgrade.md',
  };

  for (const [srcName, destName] of Object.entries(rootMappings)) {
    const srcPath = join(TEMP_DIR, srcName);
    if (existsSync(srcPath)) {
      let content = readFileSync(srcPath, 'utf-8');
      content = transformMarkdown(content, srcName);
      writeFileSync(join(OSS_DOCS_DIR, destName), content);
      verbose(`Copied: ${srcName} -> ${destName}`);
    }
  }

  // Cleanup temp
  rmSync(TEMP_DIR, { recursive: true });

  log(`\nFetch complete: ${count} files copied from main repo`);
  log('Local files preserved: ' + LOCAL_FILES.filter(f => !f.endsWith('/')).join(', '));
}

// Main
if (isClean) {
  cleanFetchedDocs();
} else {
  fetchDocs().catch(err => {
    console.error('[fetch-docs] Error:', err.message);
    process.exit(1);
  });
}
