const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const urlFile = path.join(__dirname, 'public_staging_url.txt');
const PUBLIC_URL = fs.existsSync(urlFile) ? fs.readFileSync(urlFile, 'utf-8').trim() : 'https://83b57b530f7da0.lhr.life';

async function runRemotePublicStagingAudit() {
  console.log('====================================================');
  console.log('GLOF SENTRY — PUBLIC HTTPS REMOTE STAGING TEST');
  console.log(`TARGET PUBLIC ENDPOINT: ${PUBLIC_URL}`);
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
    // TEST 1: MOBILE REMOTE ACCESS & HYDRATION (375x812)
    // ----------------------------------------------------
    console.log('--- TEST 1: MOBILE HTTPS ACCESSIBILITY (375x812) ---');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    const homeRes = await page.goto(`${PUBLIC_URL}/command`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    assert(homeRes.status() === 200, `Public root returns HTTP 200 OK (${homeRes.status()})`);
    
    await page.waitForSelector('button[aria-label="Open Navigation Menu"]', { visible: true, timeout: 10000 });
    await new Promise(r => setTimeout(r, 600));

    assert(consoleErrors.length === 0, `Zero console errors over public HTTPS (Errors: ${JSON.stringify(consoleErrors)})`);
    assert(pageErrors.length === 0, `Zero page exceptions over public HTTPS (Errors: ${JSON.stringify(pageErrors)})`);

    const hasHamburger = await page.$('button[aria-label="Open Navigation Menu"]') !== null;
    assert(hasHamburger, 'TopAppBar hamburger button rendered on mobile');

    const hasBottomNav = await page.$('nav.lg\\:hidden') !== null;
    assert(hasBottomNav, 'Bottom navigation bar rendered on mobile');

    // ----------------------------------------------------
    // TEST 2: MOBILE DRAWER & ROUTE NAVIGATION OVER HTTPS
    // ----------------------------------------------------
    console.log('\n--- TEST 2: MOBILE DRAWER & ROUTE TRANSITIONS ---');
    await page.click('button[aria-label="Open Navigation Menu"]');
    await new Promise((r) => setTimeout(r, 200));

    const drawerVisible = await page.evaluate(() => {
      const drawer = document.querySelector('.animate-slideRight');
      return drawer !== null && window.getComputedStyle(drawer).display !== 'none';
    });
    assert(drawerVisible, 'Mobile drawer opened over public HTTPS');

    // Click EMERGENCY DISPATCH link
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/dispatch"]');
      if (link) link.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    assert(page.url().includes('/dispatch'), `Navigated to /dispatch over public HTTPS (Current: ${page.url()})`);

    // ----------------------------------------------------
    // TEST 3: MOBILE "MORE" DRAWER ACTION
    // ----------------------------------------------------
    console.log('\n--- TEST 3: MOBILE MORE ACTION ---');
    await page.click('button[aria-label="Open All Modules"]');
    await new Promise((r) => setTimeout(r, 400));

    const moreDrawerVisible = await page.evaluate(() => {
      const drawer = document.querySelector('.animate-slideRight');
      return drawer !== null && window.getComputedStyle(drawer).display !== 'none';
    });
    assert(moreDrawerVisible, 'Mobile drawer opened via bottom nav MORE button');

    // Click RISK INTELLIGENCE link
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/risk-intelligence"]');
      if (link) link.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    assert(page.url().includes('/risk-intelligence'), `Navigated to /risk-intelligence (Current: ${page.url()})`);

    // ----------------------------------------------------
    // TEST 4: MOBILE "REPORT" MODAL ACTION
    // ----------------------------------------------------
    console.log('\n--- TEST 4: MOBILE FIELD INCIDENT REPORT MODAL ---');
    await page.click('button[aria-label="Report Field Incident"]');
    await new Promise((r) => setTimeout(r, 200));

    let modalVisible = await page.evaluate(() => {
      return document.body.textContent.includes('FIELD EMERGENCY & OBSERVATION DISPATCH');
    });
    assert(modalVisible, 'Field Incident modal opened over public HTTPS');

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close Incident Modal"]');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 200));

    let modalClosed = await page.evaluate(() => {
      return !document.body.textContent.includes('FIELD EMERGENCY & OBSERVATION DISPATCH');
    });
    assert(modalClosed, 'Field Incident modal closed cleanly');

    // ----------------------------------------------------
    // TEST 5: MOBILE GIS MAP OVER HTTPS (375x812)
    // ----------------------------------------------------
    console.log('\n--- TEST 5: REMOTE MOBILE GIS MAP RENDERING ---');
    const mapRes = await page.goto(`${PUBLIC_URL}/map`, { waitUntil: 'networkidle0', timeout: 30000 });
    assert(mapRes.status() === 200, `Map route returns HTTP 200 OK (${mapRes.status()})`);
    await new Promise((r) => setTimeout(r, 800));

    const mapCheck = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container');
      if (!container) return null;
      const rect = container.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        markers: document.querySelectorAll('.custom-lake-marker').length,
        sensors: document.querySelectorAll('.custom-sensor-marker').length,
      };
    });

    assert(mapCheck !== null, 'Leaflet map initialized over public HTTPS');
    assert(mapCheck && mapCheck.width >= 350, `Map width is responsive (${mapCheck?.width}px)`);
    assert(mapCheck && mapCheck.height >= 350, `Map height is responsive (${mapCheck?.height}px)`);
    assert(mapCheck && mapCheck.markers === 4, `All 4 Glacial Lake markers rendered over HTTPS (Found: ${mapCheck?.markers})`);
    assert(mapCheck && mapCheck.sensors === 4, `All 4 IoT Sensor markers rendered over HTTPS (Found: ${mapCheck?.sensors})`);

    // Reload test
    await page.reload({ waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));

    const mapReloadCheck = await page.evaluate(() => {
      const container = document.querySelector('.leaflet-container');
      return container ? container.querySelectorAll('.custom-lake-marker').length : 0;
    });
    assert(mapReloadCheck === 4, `Map survives reload over public HTTPS (Markers: ${mapReloadCheck})`);

    // ----------------------------------------------------
    // TEST 6: DESKTOP WORKSTATION (1440x900)
    // ----------------------------------------------------
    console.log('\n--- TEST 6: DESKTOP WORKSTATION OVER HTTPS (1440x900) ---');
    await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
    await page.goto(`${PUBLIC_URL}/map`, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 500));

    const hasSidebar = await page.evaluate(() => document.querySelector('aside') !== null);
    assert(hasSidebar, 'Desktop sidebar rendered over public HTTPS');

    // ----------------------------------------------------
    // TEST 7: ALL 13 ROUTES MATRIX OVER HTTPS
    // ----------------------------------------------------
    console.log('\n--- TEST 7: ALL 13 ROUTES OVER PUBLIC HTTPS ---');
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
      '/manifest.webmanifest',
      '/sw.js',
      '/lakes/south-lhonak',
      '/lakes/ghepang-gath',
    ];

    for (const r of routes) {
      const res = await page.goto(`${PUBLIC_URL}${r}`, { waitUntil: 'networkidle0', timeout: 30000 });
      assert(res.status() === 200, `Public route ${r} -> HTTP 200 OK`);
    }

    // Final Console Error Check
    console.log('\n--- TEST 8: FINAL ZERO ERROR AUDIT ---');
    const fatalErrors = consoleErrors.filter(e => e.includes('Hydration failed') || e.includes('already initialized') || e.includes('ERROR'));
    assert(fatalErrors.length === 0, `Zero hydration, duplicate Leaflet, or fatal console errors over public HTTPS (Found: ${fatalErrors.length})`);

  } catch (err) {
    console.error('Remote public staging audit exception:', err);
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log(`REMOTE PUBLIC STAGING AUDIT SUMMARY: ${passed}/${total} assertions passed (${((passed / total) * 100).toFixed(0)}%)`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runRemotePublicStagingAudit().catch(err => {
  console.error('Remote test failed:', err);
  process.exit(1);
});
