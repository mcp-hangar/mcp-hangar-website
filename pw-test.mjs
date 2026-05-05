import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/home/mapyr/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});

const pages = [
  { url: 'http://localhost:5175/', name: 'homepage' },
  { url: 'http://localhost:5175/plans', name: 'plans' },
  { url: 'http://localhost:5175/waitlist', name: 'waitlist' },
  { url: 'http://localhost:5175/privacy', name: 'privacy' },
  { url: 'http://localhost:5175/terms', name: 'terms' },
];

for (const p of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(p.url, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `/tmp/screenshot-${p.name}.png`, fullPage: true });
  
  // Check for console errors
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  
  // Check all links
  const links = await page.$$eval('a[href]', els => els.map(a => ({
    text: a.textContent?.trim().slice(0, 50),
    href: a.getAttribute('href'),
  })));
  
  const title = await page.title();
  console.log(`\n=== ${p.name.toUpperCase()} ===`);
  console.log(`URL: ${p.url}`);
  console.log(`Title: ${title}`);
  console.log(`Links: ${links.length}`);
  if (errors.length) console.log(`ERRORS: ${JSON.stringify(errors)}`);
  
  // Check for broken internal links  
  const internalLinks = links.filter(l => l.href && (l.href.startsWith('/') || l.href.startsWith('http://localhost')));
  console.log(`Internal links: ${internalLinks.length}`);
  
  await page.close();
}

// Now check all internal links for 200 status
const page = await browser.newPage();
const allInternalPaths = new Set();

for (const p of pages) {
  await page.goto(p.url, { waitUntil: 'networkidle' });
  const hrefs = await page.$$eval('a[href]', els => els.map(a => a.getAttribute('href')).filter(Boolean));
  for (const h of hrefs) {
    if (h.startsWith('/') && !h.startsWith('//')) allInternalPaths.add(h);
  }
}

console.log(`\n=== LINK CHECK ===`);
console.log(`Unique internal paths: ${allInternalPaths.size}`);

let broken = 0;
for (const path of allInternalPaths) {
  try {
    const resp = await page.goto(`http://localhost:5175${path}`, { waitUntil: 'domcontentloaded', timeout: 5000 });
    const status = resp?.status() ?? 0;
    if (status >= 400) {
      console.log(`  BROKEN [${status}]: ${path}`);
      broken++;
    }
  } catch (e) {
    console.log(`  ERROR: ${path} - ${e.message?.slice(0, 80)}`);
    broken++;
  }
}

console.log(`\nBroken links: ${broken}`);
await browser.close();
