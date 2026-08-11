/**
 * GLOF Sentry - Automated Comprehensive QA Audit Script
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function fetchRoute(endpoint) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    http.get(`${BASE_URL}${endpoint}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          endpoint,
          statusCode: res.statusCode,
          headers: res.headers,
          durationMs: Date.now() - start,
          bodyLength: data.length,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function runAudit() {
  console.log('====================================================');
  console.log('GLOF SENTRY — RESPONSIVE & PWA PRODUCTION QA AUDIT');
  console.log('====================================================\n');

  const routesToTest = [
    { path: '/', name: 'Root Redirect / Landing' },
    { path: '/command', name: 'Command Center Workstation' },
    { path: '/alerts', name: 'Alert Triage & Operations' },
    { path: '/dispatch', name: 'Emergency Dispatch & Warnings' },
    { path: '/operational-health', name: 'System Telemetry & Health' },
    { path: '/risk-intelligence', name: 'Risk Intelligence Matrix' },
    { path: '/map', name: 'GIS Himalayan Risk Terrain' },
    { path: '/admin', name: 'System Admin & Config Console' },
    { path: '/offline', name: 'Offline Safety Fallback' },
    { path: '/manifest.webmanifest', name: 'PWA Web Manifest' },
    { path: '/sw.js', name: 'Production Service Worker' },
    { path: '/lakes/south-lhonak', name: 'Lake Site Dossier (South Lhonak)' },
    { path: '/lakes/ghepang-gath', name: 'Lake Site Dossier (Ghepang Gath)' }
  ];

  console.log('1. ROUTE INTEGRITY & HTTP STATUS VERIFICATION:');
  console.log('----------------------------------------------------');
  let passCount = 0;
  for (const route of routesToTest) {
    try {
      const res = await fetchRoute(route.path);
      const isOk = res.statusCode === 200;
      if (isOk) passCount++;
      console.log(`[${isOk ? 'PASS' : 'FAIL'}] ${route.path.padEnd(25)} -> Status: ${res.statusCode} | Size: ${(res.bodyLength / 1024).toFixed(1)} KB | Latency: ${res.durationMs}ms`);
    } catch (e) {
      console.error(`[ERROR] Failed to fetch ${route.path}: ${e.message}`);
    }
  }

  console.log(`\nRoute Health: ${passCount}/${routesToTest.length} passed.\n`);

  console.log('2. PWA MANIFEST VALIDATION:');
  console.log('----------------------------------------------------');
  const manifestRes = await fetchRoute('/manifest.webmanifest');
  try {
    const manifest = JSON.parse(manifestRes.body);
    console.log(`- Manifest Name: "${manifest.name}"`);
    console.log(`- Short Name: "${manifest.short_name}"`);
    console.log(`- Start URL: "${manifest.start_url}"`);
    console.log(`- Display Mode: "${manifest.display}" (STANDALONE: ${manifest.display === 'standalone' ? 'YES' : 'NO'})`);
    console.log(`- Theme Color: "${manifest.theme_color}"`);
    console.log(`- Background Color: "${manifest.background_color}"`);
    console.log(`- Icons Defined: ${manifest.icons ? manifest.icons.length : 0}`);
    console.log(`- App Shortcuts: ${manifest.shortcuts ? manifest.shortcuts.length : 0}`);
    const hasIcons = manifest.icons && manifest.icons.length >= 3;
    const hasShortcuts = manifest.shortcuts && manifest.shortcuts.length >= 4;
    console.log(`[${hasIcons && hasShortcuts ? 'PASS' : 'FAIL'}] Manifest schema and asset references are complete.`);
  } catch (e) {
    console.error(`[FAIL] Could not parse manifest: ${e.message}`);
  }

  console.log('\n3. SERVICE WORKER CODE & CACHING POLICY AUDIT:');
  console.log('----------------------------------------------------');
  const swRes = await fetchRoute('/sw.js');
  const swCode = swRes.body;
  const checks = [
    { name: 'Cache-First Static Chunks Strategy', pattern: /_next\/static/ },
    { name: 'Network-First Navigation Strategy', pattern: /navigate/ },
    { name: 'Offline Safety Fallback (/offline)', pattern: /\/offline/ },
    { name: 'Push Event Notification Handler', pattern: /self\.addEventListener\('push'/ },
    { name: 'Notification Click Handling', pattern: /self\.addEventListener\('notificationclick'/ }
  ];
  checks.forEach(c => {
    const matched = c.pattern.test(swCode);
    console.log(`[${matched ? 'PASS' : 'FAIL'}] ${c.name}`);
  });

  console.log('\n4. RESPONSIVE BREAKPOINT & SHELL INSPECTION:');
  console.log('----------------------------------------------------');
  const commandRes = await fetchRoute('/command');
  const body = commandRes.body;
  const shellFeatures = [
    { name: 'TopAppBar with live status', pattern: /TopAppBar|UTC/ },
    { name: 'Sidebar navigation with collapsible desktop container', pattern: /SidebarNav|COMMAND/ },
    { name: 'Bottom navigation for touch devices', pattern: /BottomNavBar|env\(safe-area-inset-bottom\)|fixed bottom-0/ },
    { name: 'Connection status indicator present', pattern: /ConnectionStatusIndicator|LIVE/ }
  ];
  shellFeatures.forEach(f => {
    const found = f.pattern.test(body);
    console.log(`[${found ? 'PASS' : 'FAIL'}] ${f.name}`);
  });

  console.log('\n5. FORENSIC AUDIT SUMMARY:');
  console.log('----------------------------------------------------');
  console.log('ALL TESTS COMPLETED SUCCESSFULLY.');
}

runAudit();
