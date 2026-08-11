const http = require('http');
const fs = require('fs');
const path = require('path');

async function testFetch(url) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          duration: Date.now() - start,
          body: data,
          headers: res.headers,
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runE2ETests() {
  console.log('====================================================');
  console.log('GLOF SENTRY — END-TO-END UI & ROUTE VALIDATION');
  console.log('====================================================\n');

  const baseUrl = 'http://localhost:3000';
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

  // TEST 1: Map Route & Zero Blocking Overlay
  console.log('--- TARGET 1: MAP INITIALIZATION & RESILIENCE ---');
  const mapRes = await testFetch(`${baseUrl}/map`);
  assert(mapRes.status === 200, '/map returns HTTP 200 OK');
  assert(!mapRes.body.includes('CONNECTING HIMALAYAN GIS TERRAIN MESH'), 'Zero blocking "CONNECTING HIMALAYAN GIS TERRAIN MESH" in rendered markup');
  assert(!mapRes.body.includes('INITIALIZING HIMALAYAN GIS TERRAIN MESH'), 'Zero blocking "INITIALIZING HIMALAYAN GIS TERRAIN MESH" in rendered markup');
  assert(mapRes.body.includes('SEARCH SITE / COORDS') || mapRes.body.includes('GEOSPATIAL'), 'Map search and geospatial layer controls present');
  assert(mapRes.body.includes('BASIN JUMP') || mapRes.body.includes('SOUTH LHONAK'), 'Basin Jump presets present');

  // TEST 2: Command Center & Desktop View
  console.log('\n--- TARGET 2: COMMAND CENTER & DESKTOP SHELL ---');
  const cmdRes = await testFetch(`${baseUrl}/command`);
  assert(cmdRes.status === 200, '/command returns HTTP 200 OK');
  assert(cmdRes.body.includes('GLOF SENTRY'), 'Brand title rendered in header');
  assert(cmdRes.body.includes('NATIONAL GLOF RISK INDEX'), 'National GLOF Risk Index KPI rendered');
  assert(cmdRes.body.includes('ACTIVE ALERT SITES'), 'Active Alert Sites KPI rendered');
  assert(cmdRes.body.includes('LAKES UNDER HIGH WATCH'), 'Lakes Under High Watch KPI rendered');

  // TEST 3: Mobile Header & Hamburger Menu Markup
  console.log('\n--- TARGET 3: MOBILE TOP BAR & HAMBURGER ---');
  assert(cmdRes.body.includes('aria-label="Open Navigation Menu"'), 'TopAppBar hamburger button with aria-label rendered');
  assert(cmdRes.body.includes('material-symbols-outlined') && cmdRes.body.includes('menu'), 'Menu hamburger icon present');

  // TEST 4: Mobile Bottom Navigation & Touch Action Triggers
  console.log('\n--- TARGET 4: MOBILE BOTTOM NAVIGATION & ACTIONS ---');
  assert(cmdRes.body.includes('aria-label="Report Field Incident"'), 'Bottom navigation REPORT action button rendered');
  assert(cmdRes.body.includes('aria-label="Open All Modules"'), 'Bottom navigation MORE action button rendered');
  assert(cmdRes.body.includes('COMMAND') && cmdRes.body.includes('ALERTS') && cmdRes.body.includes('MAP'), 'Primary navigation items rendered');

  // TEST 5: Modal & Drawer Component Verification
  console.log('\n--- TARGET 5: OVERLAY & DRAWER INTEGRITY ---');
  const appShellFile = fs.readFileSync(path.join(__dirname, '../src/components/layout/AppShell.tsx'), 'utf-8');
  assert(appShellFile.includes('isDrawerOpen') && appShellFile.includes('isFieldReportOpen'), 'AppShell manages drawer and modal open state');
  const modalFile = fs.readFileSync(path.join(__dirname, '../src/components/field/FieldIncidentReportModal.tsx'), 'utf-8');
  assert(modalFile.includes('z-[100]'), 'Field incident modal configured with highest priority z-[100]');
  assert(modalFile.includes('onClick={onClose}'), 'Modal backdrop dismissal configured');
  const drawerFile = fs.readFileSync(path.join(__dirname, '../src/components/navigation/MobileDrawer.tsx'), 'utf-8');
  assert(drawerFile.includes('z-[90]'), 'Mobile drawer configured with z-[90]');
  assert(drawerFile.includes('setTimeout(onClose'), 'Mobile drawer navigation transition delay configured');

  // TEST 6: All Application Routes (13/13)
  console.log('\n--- TARGET 6: COMPLETE ROUTE MATRIX AUDIT ---');
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
    const res = await testFetch(`${baseUrl}${r}`);
    assert(res.status === 200, `Route ${r} -> HTTP 200 (Latency: ${res.duration}ms, Size: ${(res.body.length / 1024).toFixed(1)} KB)`);
  }

  console.log('\n====================================================');
  console.log(`E2E TEST SUMMARY: ${passed}/${total} assertions passed (${((passed / total) * 100).toFixed(0)}%)`);
  console.log('====================================================');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runE2ETests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
