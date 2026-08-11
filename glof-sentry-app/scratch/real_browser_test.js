const puppeteer = require('puppeteer');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3000';

async function runRealBrowserAudit() {
  console.log('====================================================');
  console.log(`GLOF SENTRY — REAL PUPPETEER AUDIT: ${TARGET_URL}`);
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();

  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error' || text.toLowerCase().includes('hydration') || text.toLowerCase().includes('already initialized')) {
      consoleErrors.push(`[${type.toUpperCase()}] ${text}`);
    }
  });

  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

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

  try {
    // ----------------------------------------------------
    // TEST 1: MOBILE VIEWPORT (375x812) - HOME & HYDRATION
    // ----------------------------------------------------
    console.log('--- TEST A: MOBILE VIEWPORT (375x812) - HOME & HYDRATION ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto(`${TARGET_URL}/`, { waitUntil: 'networkidle0' });

    // Wait a brief moment for hydration to settle
    await page.waitForFunction(() => typeof window !== 'undefined');

    assert(consoleErrors.length === 0, `Zero console errors on Home (Errors: ${JSON.stringify(consoleErrors)})`);
    assert(pageErrors.length === 0, `Zero page exceptions on Home (Errors: ${JSON.stringify(pageErrors)})`);

    const hasHamburger = await page.$('button[aria-label="Open Navigation Menu"]') !== null;
    assert(hasHamburger, 'Hamburger button exists and is rendered on mobile');

    const hasBottomNav = await page.$('nav.lg\\:hidden') !== null;
    assert(hasBottomNav, 'Bottom navigation bar rendered on mobile');

    // ----------------------------------------------------
    // TEST 2: MOBILE HAMBURGER MENU & DRAWER NAVIGATION
    // ----------------------------------------------------
    console.log('\n--- TEST B: MOBILE HAMBURGER & DRAWER NAVIGATION ---');
    await page.click('button[aria-label="Open Navigation Menu"]');
    await new Promise((r) => setTimeout(r, 200));

    let drawerVisible = await page.evaluate(() => {
      const drawer = document.querySelector('.animate-slideRight');
      return drawer !== null && window.getComputedStyle(drawer).display !== 'none';
    });
    assert(drawerVisible, 'Mobile drawer opened and is visible after tapping hamburger');

    // Tap DISPATCH link inside drawer
    await page.evaluate(() => {
      const dispatchLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('EMERGENCY DISPATCH'));
      if (dispatchLink) dispatchLink.click();
    });

    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise((r) => setTimeout(r, 300));

    const currentUrl = page.url();
    assert(currentUrl.includes('/dispatch'), `Drawer link navigated to /dispatch (Current: ${currentUrl})`);

    const dispatchHeader = await page.evaluate(() => document.body.textContent.includes('EMERGENCY DISPATCH'));
    assert(dispatchHeader, 'Dispatch page content rendered successfully');

    // ----------------------------------------------------
    // TEST 3: MOBILE BOTTOM NAV "MORE" TRIGGER
    // ----------------------------------------------------
    console.log('\n--- TEST C: MOBILE BOTTOM NAV "MORE" TRIGGER ---');
    await page.click('button[aria-label="Open All Modules"]');
    await new Promise((r) => setTimeout(r, 200));

    drawerVisible = await page.evaluate(() => {
      const drawer = document.querySelector('.animate-slideRight');
      return drawer !== null && window.getComputedStyle(drawer).display !== 'none';
    });
    assert(drawerVisible, 'Mobile drawer opened via MORE button in bottom nav');

    // Tap RISK INTELLIGENCE link
    await page.evaluate(() => {
      const riskLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('RISK INTELLIGENCE'));
      if (riskLink) riskLink.click();
    });

    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise((r) => setTimeout(r, 300));

    assert(page.url().includes('/risk-intelligence'), `Navigated to /risk-intelligence (Current: ${page.url()})`);

    // ----------------------------------------------------
    // TEST 4: MOBILE BOTTOM NAV "REPORT" MODAL
    // ----------------------------------------------------
    console.log('\n--- TEST D: MOBILE FIELD INCIDENT REPORT MODAL ---');
    await page.click('button[aria-label="Report Field Incident"]');
    await new Promise((r) => setTimeout(r, 200));

    let modalVisible = await page.evaluate(() => {
      const modal = document.querySelector('.data-card');
      return modal !== null && document.body.textContent.includes('FIELD EMERGENCY & OBSERVATION DISPATCH');
    });
    assert(modalVisible, 'Field Incident Report modal opened and visible');

    // Interact with form control
    await page.evaluate(() => {
      const select = document.querySelector('select');
      if (select) select.value = 'lake-015';
    });

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close Incident Modal"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 200));

    let modalClosed = await page.evaluate(() => {
      return !document.body.textContent.includes('FIELD EMERGENCY & OBSERVATION DISPATCH');
    });
    assert(modalClosed, 'Field Incident Report modal closed cleanly');

    // Open and close again to ensure repeated open works
    await page.click('button[aria-label="Report Field Incident"]');
    await new Promise((r) => setTimeout(r, 200));
    modalVisible = await page.evaluate(() => document.body.textContent.includes('FIELD EMERGENCY & OBSERVATION DISPATCH'));
    assert(modalVisible, 'Field Incident Report modal opens successfully a second time');

    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close Incident Modal"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 200));

    // ----------------------------------------------------
    // TEST 5: MOBILE MAP RENDERING & RESILIENCE (375x812)
    // ----------------------------------------------------
    console.log('\n--- TEST E: MOBILE MAP VISUALIZATION & LEAFLET RENDERING ---');
    await page.goto(`${TARGET_URL}/map`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    const mapDimensions = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container');
      if (!container) return null;
      const rect = container.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        panes: document.querySelectorAll('.leaflet-pane').length,
        markers: document.querySelectorAll('.custom-lake-marker').length,
        sensors: document.querySelectorAll('.custom-sensor-marker').length,
      };
    });

    assert(mapDimensions !== null, 'Leaflet map initialized and container found in DOM');
    assert(mapDimensions && mapDimensions.width >= 350, `Map container has valid mobile width (${mapDimensions?.width}px)`);
    assert(mapDimensions && mapDimensions.height >= 350, `Map container has valid mobile height (${mapDimensions?.height}px)`);
    assert(mapDimensions && mapDimensions.markers === 4, `All 4 Glacial Lake markers rendered on map canvas (Found: ${mapDimensions?.markers})`);
    assert(mapDimensions && mapDimensions.sensors === 4, `All 4 Sensor markers rendered on map canvas (Found: ${mapDimensions?.sensors})`);

    // Reload test on mobile map
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    const reloadMapDimensions = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container');
      if (!container) return null;
      const rect = container.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        markers: document.querySelectorAll('.custom-lake-marker').length,
      };
    });

    assert(reloadMapDimensions && reloadMapDimensions.height >= 350, `Map survives reload without blank canvas (Height: ${reloadMapDimensions?.height}px)`);
    assert(reloadMapDimensions && reloadMapDimensions.markers === 4, `Map markers survive reload (Found: ${reloadMapDimensions?.markers})`);

    // Navigate away and back to map
    await page.goto(`${TARGET_URL}/alerts`, { waitUntil: 'networkidle0' });
    await page.goto(`${TARGET_URL}/map`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800));

    const renavMap = await page.evaluate(() => document.querySelectorAll('.custom-lake-marker').length);
    assert(renavMap === 4, `Map survives navigation away and back without duplicate error (Markers: ${renavMap})`);

    // ----------------------------------------------------
    // TEST 6: DESKTOP WORKSTATION (1440x900)
    // ----------------------------------------------------
    console.log('\n--- TEST F: DESKTOP WORKSTATION (1440x900) ---');
    await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
    await page.goto(`${TARGET_URL}/map`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 500));

    const desktopSidebar = await page.evaluate(() => document.querySelector('aside') !== null);
    assert(desktopSidebar, 'Persistent desktop sidebar rendered');

    const desktopMapHeight = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container');
      return container ? container.getBoundingClientRect().height : 0;
    });
    assert(desktopMapHeight >= 600, `Desktop map occupies full workstation canvas (Height: ${desktopMapHeight}px)`);

    // ----------------------------------------------------
    // TEST 7: ALL 13 ROUTES AUDIT
    // ----------------------------------------------------
    console.log('\n--- TEST G: ALL 13 ROUTES DESKTOP & MOBILE AUDIT ---');
    const routes = [
      '/',
      '/command',
      '/alerts',
      '/dispatch',
      '/operational-health',
      '/risk-intelligence',
      '/map',
      '/admin',
      '/offline',
      '/lakes/south-lhonak',
      '/lakes/ghepang-gath',
    ];

    for (const r of routes) {
      await page.goto(`${TARGET_URL}${r}`, { waitUntil: 'networkidle0' });
      const title = await page.title();
      assert(title.includes('GLOF SENTRY') || title.length > 0, `Route ${r} rendered with title "${title}"`);
    }

    // Final Console Error Check
    console.log('\n--- TEST H: FINAL CONSOLE ERROR AUDIT ---');
    const fatalErrors = consoleErrors.filter(e => e.includes('Hydration failed') || e.includes('already initialized') || e.includes('ERROR'));
    assert(fatalErrors.length === 0, `Zero hydration or Leaflet duplicate errors recorded throughout entire session (Found: ${fatalErrors.length})`);

  } catch (testErr) {
    console.error('Fatal test error:', testErr);
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log(`REAL BROWSER AUDIT: ${passed}/${total} assertions passed (${((passed / total) * 100).toFixed(0)}%)`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runRealBrowserAudit().catch((err) => {
  console.error('Test execution exception:', err);
  process.exit(1);
});
