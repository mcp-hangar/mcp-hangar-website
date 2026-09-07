import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import yml from "eslint-plugin-yml";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.pnpm-store/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/dist/**",
      "**/.astro/**",
      "**/*.mdx",
      "pnpm-lock.yaml",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...yml.configs["flat/recommended"],
  {
    files: ["**/*.test.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["**/*.{js,mjs,ts,tsx,astro}"],
    languageOptions: {
      globals: {
        process: "readonly",
        Buffer: "readonly",
        console: "readonly",
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        Response: "readonly",
        URL: "readonly",
        NodeJS: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
    },
  }
);
