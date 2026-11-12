import type { APIRoute } from "astro";
import { COMPARE_TITLE, compareMarkdown } from "../lib/compare-markdown";

/** /compare as markdown, for the "every page has a .md" promise in llms.txt. */
export const GET: APIRoute = () =>
  new Response(
    `# ${COMPARE_TITLE}\n\nSource: https://mcp-hangar.io/compare\n\n---\n\n${compareMarkdown()}\n`,
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
