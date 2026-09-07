import { preview } from "astro";
import { fileURLToPath } from "node:url";

// Keep the server attached to Playwright even in agent environments where
// the Astro CLI automatically starts a background process.
const server = await preview({
  root: fileURLToPath(new URL("../", import.meta.url)),
  server: { host: "127.0.0.1", port: 4321 },
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
