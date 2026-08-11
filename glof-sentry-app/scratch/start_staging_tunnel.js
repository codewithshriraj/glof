const localtunnel = require('localtunnel');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const requestedSubdomain = 'glof-sentry-' + Math.floor(1000 + Math.random() * 9000);

async function startTunnel() {
  console.log(`[STAGING] Establishing public HTTPS staging tunnel for port ${PORT}...`);
  
  try {
    const tunnel = await localtunnel({
      port: PORT,
      subdomain: requestedSubdomain,
    });

    const publicUrl = tunnel.url;
    console.log('====================================================');
    console.log('GLOF SENTRY — PHASE 7 PUBLIC STAGING DEPLOYMENT ACTIVE');
    console.log('====================================================');
    console.log(`PUBLIC HTTPS URL: ${publicUrl}`);
    console.log('====================================================\n');

    const outPath = path.join(__dirname, 'public_staging_url.txt');
    fs.writeFileSync(outPath, publicUrl, 'utf-8');

    tunnel.on('close', () => {
      console.log('[STAGING] Tunnel closed. Reconnecting...');
      startTunnel();
    });

    tunnel.on('error', (err) => {
      console.error('[STAGING] Tunnel error:', err);
    });

  } catch (err) {
    console.error('[STAGING] Failed to establish tunnel:', err);
    // Retry in 3 seconds
    setTimeout(startTunnel, 3000);
  }
}

startTunnel();
