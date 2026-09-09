import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import fg from "fast-glob";
import matter from "gray-matter";
import type { Loader } from "astro/loaders";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypeDocLinks from "../../lib/rehype-doc-links";
import rehypeMermaidPre from "../../lib/rehype-mermaid-pre";
import rehypeCollectHeadings from "../../lib/rehype-collect-headings";
import type { CollectedHeading } from "../../lib/rehype-collect-headings";
import { codeTheme } from "../../lib/code-theme";

async function createMarkdownProcessor(validIds: Set<string>) {
  return (
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeDocLinks, { validIds })
      // Section anchors, with the same slugger Astro uses for every other
      // collection, then the headings a contents rail is built from.
      .use(rehypeSlug)
      .use(rehypeCollectHeadings)
      .use(rehypeMermaidPre)
      .use(rehypeShiki, {
        theme: codeTheme,
      })
      .use(rehypeStringify)
  );
}

function assertWithinDirectory(directory: string, file: string): void {
  const relative = path.relative(directory, file);
  if (
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`Documentation path escapes source directory: ${file}`);
  }
}

export function ossDocsLoader(
  options: { directory?: string | URL } = {}
): Loader {
  return {
    name: "oss-docs-loader",
    load: async (context) => {
      const { store, logger, parseData } = context;

      const explicitDirectory =
        options.directory ?? process.env.MCP_HANGAR_DOCS_DIR;
      const require = createRequire(import.meta.url);
      let docsDir: string;
      if (explicitDirectory !== undefined) {
        docsDir = path.resolve(
          explicitDirectory instanceof URL
            ? fileURLToPath(explicitDirectory)
            : explicitDirectory
        );
      } else {
        try {
          docsDir = path.dirname(
            require.resolve("@mcp-hangar/docs/package.json")
          );
        } catch (cause) {
          throw new Error(
            "Cannot resolve @mcp-hangar/docs. Install dependencies or explicitly set MCP_HANGAR_DOCS_DIR.",
            { cause }
          );
        }
      }

      // Use canonical paths so symlinks cannot escape the selected source.
      docsDir = await fs.realpath(docsDir);
      logger.info(`Docs dir is: ${docsDir}`);
      const files = await fg("**/*.md", {
        cwd: docsDir,
        ignore: ["**/README.md", "index.md"],
        followSymbolicLinks: false,
      });
      if (files.length === 0) {
        throw new Error(`No documentation Markdown files found at ${docsDir}`);
      }
      // Stage the complete collection before updating the persistent store.
      const entries = [];

      logger.info(`Found ${files.length} files`);

      const validIds = new Set(files.map((file) => file.replace(/\.md$/, "")));
      const markdownProcessor = await createMarkdownProcessor(validIds);

      for (const file of files) {
        const filePath = await fs.realpath(path.join(docsDir, file));
        assertWithinDirectory(docsDir, filePath);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data, content: body } = matter(fileContent);

        const id = file.replace(/\.md$/, "");

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
          const snippetFile = path.resolve(docsDir, match[1]);
          assertWithinDirectory(docsDir, snippetFile);
          // Skip self-references (case-insensitive FS can resolve UPGRADE.md → upgrade.md)
          if (
            path.resolve(snippetFile).toLowerCase() ===
            path.resolve(filePath).toLowerCase()
          ) {
            resolvedBody = resolvedBody.replace(match[0], "");
            continue;
          }
          try {
            const realSnippetFile = await fs.realpath(snippetFile);
            assertWithinDirectory(docsDir, realSnippetFile);
            const snippetContent = await fs.readFile(realSnippetFile, "utf-8");
            resolvedBody = resolvedBody.replace(
              match[0],
              snippetContent.trim()
            );
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
            logger.warn(`Missing snippet ${match[1]} in ${file}`);
            // Preserve existing rendering for optional missing snippets.
            resolvedBody = resolvedBody.replace(match[0], "");
          }
        }

        const cleanBody = resolvedBody.replace(/^#\s+.+$/m, "").trim();
        const rendered = await markdownProcessor.process({
          value: cleanBody,
          data: { docId: id },
        });
        const html = String(rendered);
        const headings = (rendered.data.headings ?? []) as CollectedHeading[];

        entries.push({
          id,
          data: parsedData,
          body: resolvedBody,
          // `metadata.headings` is where Astro's own markdown puts them, so
          // `render(doc)` hands them back exactly as it does for blog and learn.
          rendered: { html, metadata: { headings } },
        });
      }
      const currentIds = new Set(entries.map((entry) => entry.id));
      for (const id of store.keys()) {
        if (!currentIds.has(id)) store.delete(id);
      }
      for (const entry of entries) store.set(entry);
    },
  };
}
