import fs from "node:fs";
import path from "node:path";

/**
 * Build gate for per-page OG cards.
 *
 * Runs on the emitted HTML rather than on the resolver's own bookkeeping, so it
 * checks what actually ships: every indexable page must point `og:image` at a
 * card that exists in `dist` and is the expected size. A page that quietly took
 * the site-wide fallback fails the build here instead of being discovered
 * months later in someone's link preview.
 *
 * `noindex` pages are exempt — /og-preview is the contact sheet for these very
 * cards and has no business owning one.
 */

const EXPECTED = { width: 2400, height: 1260 };
const FALLBACK = "/og-image.png";

/** Width/height straight out of the IHDR chunk; avoids pulling in an image library. */
function pngSize(file) {
    const head = Buffer.alloc(24);
    const fd = fs.openSync(file, "r");
    try {
        if (fs.readSync(fd, head, 0, 24, 0) < 24) return null;
    } finally {
        fs.closeSync(fd);
    }
    if (head.toString("ascii", 1, 4) !== "PNG") return null;
    return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}

function* htmlFiles(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* htmlFiles(full);
        else if (entry.name.endsWith(".html")) yield full;
    }
}

export default function ogGate() {
    return {
        name: "og-gate",
        hooks: {
            "astro:build:done": ({ dir, logger }) => {
                const distDir = new URL(dir).pathname;
                const fellBack = [];
                const missing = [];
                const wrongSize = [];
                const cards = new Set();
                let checked = 0;

                for (const file of htmlFiles(distDir)) {
                    const html = fs.readFileSync(file, "utf-8");
                    if (/name="robots"[^>]*noindex/.test(html)) continue;

                    const page = "/" + path.relative(distDir, file).replace(/(^|\/)index\.html$/, "");
                    const match = html.match(/property="og:image"\s+content="([^"]+)"/);
                    if (!match) {
                        missing.push(`${page} (no og:image)`);
                        continue;
                    }
                    checked++;

                    const url = match[1].replace(/^https?:\/\/[^/]+/, "");
                    if (url === FALLBACK) {
                        fellBack.push(page);
                        continue;
                    }

                    const asset = path.join(distDir, url);
                    if (!fs.existsSync(asset)) {
                        missing.push(`${page} → ${url}`);
                        continue;
                    }
                    cards.add(url);

                    const size = pngSize(asset);
                    if (!size || size.width !== EXPECTED.width || size.height !== EXPECTED.height) {
                        wrongSize.push(`${url} is ${size ? `${size.width}×${size.height}` : "not a PNG"}`);
                    }
                }

                const problems = [
                    ...missing.map(m => `missing card: ${m}`),
                    ...fellBack.map(p => `fell back to ${FALLBACK}: ${p}`),
                    ...wrongSize.map(w => `wrong size: ${w}`),
                ];

                if (problems.length) {
                    throw new Error(
                        `OG gate failed on ${problems.length} page(s):\n  ` + problems.join("\n  "),
                    );
                }

                logger.info(
                    `${checked} pages, ${cards.size} distinct cards, ` +
                    `all ${EXPECTED.width}×${EXPECTED.height}, no fallback`,
                );
            },
        },
    };
}
