import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs/promises';
import fg from 'fast-glob';
import matter from 'gray-matter';
import type { Loader } from 'astro/loaders';

export function ossDocsLoader(): Loader {
  return {
    name: 'oss-docs-loader',
    load: async (context) => {
      const { store, logger, parseData } = context;

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
        ignore: ['**/README.md'],
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

        store.set({
          id,
          data: parsedData,
          body,
        });
      }
    }
  };
}
