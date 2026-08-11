const puppeteer = require('puppeteer');

const viewports = [
  { name: 'Mobile Compact (iPhone X / 12 Mini)', width: 375, height: 812, isMobile: true },
  { name: 'Mobile Standard (iPhone 13 / 14 / 15)', width: 390, height: 844, isMobile: true },
  { name: 'Mobile Large (iPhone Pro Max)', width: 430, height: 932, isMobile: true },
  { name: 'Tablet Portrait (iPad Mini / Air)', width: 768, height: 1024, isMobile: false },
  { name: 'Laptop (MacBook Air / HD)', width: 1280, height: 800, isMobile: false },
  { name: 'Desktop Workstation (FHD)', width: 1440, height: 900, isMobile: false },
];

async function runMultiViewportAudit() {
  console.log('====================================================');
  console.log('GLOF SENTRY — MULTI-VIEWPORT REAL BROWSER AUDIT');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  for (const vp of viewports) {
    console.log(`\n--- TESTING VIEWPORT: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile, hasTouch: vp.isMobile });
    
    // Test Map
    await page.goto('http://localhost:3000/map', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const mapCheck = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container');
      if (!container) return null;
      const rect = container.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        markers: document.querySelectorAll('.custom-lake-marker').length,
      };
    });

    assert(mapCheck !== null, `Leaflet initialized on ${vp.name}`);
    const expectedMinWidth = vp.isMobile ? vp.width : vp.width - 320;
    assert(mapCheck && mapCheck.width >= expectedMinWidth, `Map width is responsive (${mapCheck?.width}px >= ${expectedMinWidth}px)`);
    assert(mapCheck && mapCheck.height >= 350, `Map height is responsive (${mapCheck?.height}px)`);
    assert(mapCheck && mapCheck.markers === 4, `All 4 Glacial Lake markers rendered on ${vp.name} (Found: ${mapCheck?.markers})`);

    // Test Navigation controls
    if (vp.isMobile) {
      const hasHamburger = await page.$('button[aria-label="Open Navigation Menu"]') !== null;
      assert(hasHamburger, `Hamburger button visible on ${vp.name}`);
      const hasBottomNav = await page.$('nav.lg\\:hidden') !== null;
      assert(hasBottomNav, `Bottom navigation visible on ${vp.name}`);
    } else {
      const hasSidebar = await page.$('aside') !== null;
      assert(hasSidebar, `Desktop sidebar visible on ${vp.name}`);
    }
  }

  await browser.close();

  console.log('\n====================================================');
  console.log(`MULTI-VIEWPORT AUDIT SUMMARY: ${passed}/${total} assertions passed (${((passed / total) * 100).toFixed(0)}%)`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runMultiViewportAudit().catch(err => {
  console.error('Viewport test failed:', err);
  process.exit(1);
});
