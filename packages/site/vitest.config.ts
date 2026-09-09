import { defineConfig } from "vitest/config";

export default defineConfig({
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
