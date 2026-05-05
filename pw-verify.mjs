import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/home/mapyr/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu']
});

// === HOMEPAGE PRICING TABLE VERIFICATION ===
console.log('=== HOMEPAGE PRICING TABLE ===');
const homePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await homePage.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
await homePage.screenshot({ path: '/tmp/screenshot-homepage-full.png', fullPage: true });

// Extract the pricing table content
const homeTable = await homePage.evaluate(() => {
  const tables = document.querySelectorAll('table');
  const results = [];
  for (const table of tables) {
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
      return Array.from(tr.querySelectorAll('td')).map(td => td.textContent?.trim());
    });
    results.push({ headers, rows });
  }
  return results;
});

for (const table of homeTable) {
  console.log('Headers:', JSON.stringify(table.headers));
  for (const row of table.rows) {
    console.log('  Row:', JSON.stringify(row));
  }
}

// Check NO Enterprise column exists
const hasEnterprise = await homePage.evaluate(() => {
  const ths = Array.from(document.querySelectorAll('th'));
  return ths.some(th => th.textContent?.includes('Enterprise'));
});
console.log(`\nEnterprise column present: ${hasEnterprise}`);

// Check Enterprise callout note exists
const enterpriseNote = await homePage.evaluate(() => {
  const body = document.body.innerText;
  const hasNote = body.includes('Pro with contracts');
  const hasMailto = !!document.querySelector('a[href="mailto:sales@mcp-hangar.io"]');
  return { hasNote, hasMailto };
});
console.log(`Enterprise callout note: ${enterpriseNote.hasNote}`);
console.log(`Enterprise mailto link: ${enterpriseNote.hasMailto}`);

// === PLANS PAGE TABLE VERIFICATION ===
console.log('\n=== PLANS PAGE TABLE ===');
const plansPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await plansPage.goto('http://localhost:5175/plans', { waitUntil: 'networkidle' });
await plansPage.screenshot({ path: '/tmp/screenshot-plans-full.png', fullPage: true });

const plansTable = await plansPage.evaluate(() => {
  const table = document.querySelector('table');
  if (!table) return null;
  const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim());
  const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
    return Array.from(tr.querySelectorAll('td')).map(td => td.textContent?.trim());
  });
  return { headers, rows };
});

if (plansTable) {
  console.log('Headers:', JSON.stringify(plansTable.headers));
  for (const row of plansTable.rows) {
    console.log('  Row:', JSON.stringify(row));
  }
}

// Check tier cards on /plans
const tierCards = await plansPage.evaluate(() => {
  const cards = document.querySelectorAll('h3');
  return Array.from(cards).map(h => h.textContent?.trim()).filter(Boolean);
});
console.log(`\nTier card headings: ${JSON.stringify(tierCards)}`);

// Check Enterprise is NOT a tier card, but IS a callout
const plansEnterprise = await plansPage.evaluate(() => {
  const body = document.body.innerText;
  const hasTierCard = Array.from(document.querySelectorAll('h3')).some(h => h.textContent?.trim() === 'Enterprise');
  const hasCallout = body.includes('Need paperwork on top of Pro?');
  return { hasTierCard, hasCallout };
});
console.log(`Enterprise as tier card: ${plansEnterprise.hasTierCard}`);
console.log(`Enterprise as callout: ${plansEnterprise.hasCallout}`);

// === CROSS-PAGE CONSISTENCY ===
console.log('\n=== CONSISTENCY CHECK ===');

// Both pages should have same column structure (3 tiers, no Enterprise column)
const homeColCount = homeTable[1]?.headers?.length ?? 0;  // pricing table is the 2nd table (after benchmarks)
const plansColCount = plansTable?.headers?.length ?? 0;
console.log(`Homepage pricing columns: ${homeColCount}`);
console.log(`Plans page pricing columns: ${plansColCount}`);

// === SCREENSHOTS OF KEY SECTIONS ===
// Scroll to pricing section on homepage and screenshot just that area
const pricingSection = await homePage.$('text=Open Source vs Cloud');
if (pricingSection) {
  await pricingSection.scrollIntoViewIfNeeded();
  await homePage.waitForTimeout(300);
  await homePage.screenshot({ path: '/tmp/screenshot-homepage-pricing.png' });
  console.log('\nScreenshot: /tmp/screenshot-homepage-pricing.png');
}

// Screenshot plans page tier cards
await plansPage.screenshot({ path: '/tmp/screenshot-plans-top.png' });
console.log('Screenshot: /tmp/screenshot-plans-top.png');

// === NAV LINKS ===
console.log('\n=== NAVIGATION ===');
for (const p of [homePage, plansPage]) {
  const navLinks = await p.evaluate(() => {
    const nav = document.querySelector('nav') || document.querySelector('header');
    if (!nav) return [];
    return Array.from(nav.querySelectorAll('a')).map(a => ({
      text: a.textContent?.trim(),
      href: a.getAttribute('href'),
    }));
  });
  console.log(`Page nav links: ${JSON.stringify(navLinks)}`);
}

// === CONSOLE ERRORS ===
console.log('\n=== CONSOLE ERRORS ===');
const errorPage = await browser.newPage();
const errors = [];
errorPage.on('pageerror', err => errors.push(err.message));
errorPage.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

for (const url of ['http://localhost:5175/', 'http://localhost:5175/plans', 'http://localhost:5175/waitlist']) {
  await errorPage.goto(url, { waitUntil: 'networkidle' });
  await errorPage.waitForTimeout(500);
}

if (errors.length) {
  console.log('ERRORS FOUND:');
  errors.forEach(e => console.log(`  - ${e}`));
} else {
  console.log('No console errors across homepage, plans, waitlist');
}

await browser.close();
console.log('\nDone.');
