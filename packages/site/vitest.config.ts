/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Astro's Vite config, so a test can render a component with the container
// API (record.test.ts) as well as import plain modules.
export default getViteConfig({
  test: {
    include: ["src/__tests__/**/*.test.ts"],
    // Node by default. Only `mermaid-diagrams` needs a DOM -- it parses built
    // HTML -- and it asks for jsdom itself. The project-wide jsdom environment
    // and the jest-dom matchers existed for `CodeBlock`, the site's only React
    // component, which nothing rendered.
    environment: "node",
    globals: true,
  },
});
