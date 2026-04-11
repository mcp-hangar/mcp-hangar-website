import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx", "src/vite-env.d.ts", "src/test/**"],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 85,
        lines: 90,
      },
    },
    onConsoleLog(log) {
      // Suppress expected React error boundary noise in tests
      if (log.includes("Error caught by boundary") ||
          log.includes("The above error") ||
          log.includes("recreate this component tree")) {
        return false;
      }
    },
  },
})
