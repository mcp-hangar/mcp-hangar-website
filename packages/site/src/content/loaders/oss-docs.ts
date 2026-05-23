import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs/promises';
import fg from 'fast-glob';
import matter from 'gray-matter';
import type { Loader } from 'astro/loaders';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';

async function createMarkdownProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeShiki, {
      theme: 'github-dark',
    })
    .use(rehypeStringify);
}

export function ossDocsLoader(): Loader {
  return {
    name: 'oss-docs-loader',
    load: async (context) => {
      const { store, logger, parseData } = context;
      const markdownProcessor = await createMarkdownProcessor();

      let docsDir: string;
      const require = createRequire(import.meta.url);
      try {
        const pkgPath = require.resolve('@mcp-hangar/docs/package.json');
        docsDir = path.dirname(pkgPath);
      } catch (err) {
        logger.warn('Could not resolve @mcp-hangar/docs, falling back to local docs repo');
        docsDir = path.resolve(new URL('../../../../../../docs', import.meta.url).pathname);
      }

      logger.info(`Docs dir is: ${docsDir}`);

      try {
        await fs.access(docsDir);
      } catch (err) {
        logger.error(`Docs directory not found at ${docsDir}`);
        return;
      }

      const files = await fg('**/*.md', {
        cwd: docsDir,
        ignore: ['**/README.md', 'index.md'],
      });
      
      logger.info(`Found ${files.length} files`);

      for (const file of files) {
        const filePath = path.join(docsDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content: body } = matter(fileContent);

        const id = file.replace(/\.md$/, '');

        if (!data.title) {
          const titleMatch = body.match(/^#\s+(.+)$/m);
          data.title = titleMatch ? titleMatch[1].trim() : id;
        }

        const parsedData = await parseData({ id, data });

        // Resolve pymdownx.snippets includes (--8<-- "file") if the target exists
        let resolvedBody = body;
        const snippetPattern = /^--8<--\s+"([^"]+)"$/gm;
        let match;
        while ((match = snippetPattern.exec(body)) !== null) {
          const snippetFile = path.join(docsDir, match[1]);
          // Skip self-references (case-insensitive FS can resolve UPGRADE.md → upgrade.md)
          if (path.resolve(snippetFile).toLowerCase() === path.resolve(filePath).toLowerCase()) {
            resolvedBody = resolvedBody.replace(match[0], '');
            continue;
          }
          try {
            const snippetContent = await fs.readFile(snippetFile, 'utf-8');
            resolvedBody = resolvedBody.replace(match[0], snippetContent.trim());
          } catch {
            // Target file doesn't exist — remove the directive
            resolvedBody = resolvedBody.replace(match[0], '');
          }
        }

        const cleanBody = resolvedBody.replace(/^#\s+.+$/m, '').trim();
        const rendered = await markdownProcessor.process(cleanBody);
        const html = String(rendered);

        store.set({
          id,
          data: parsedData,
          body: resolvedBody,
          rendered: { html },
        });
      }
    }
  };
}
