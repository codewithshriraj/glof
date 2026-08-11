const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const URL_FILE = path.join(__dirname, 'public_staging_url.txt');

function startSSHTunnel() {
  console.log('[TUNNEL] Spawning SSH reverse tunnel to localhost.run...');
  
  const child = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ServerAliveCountMax=3',
    '-R', '80:localhost:3000',
    'nokey@localhost.run'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  let currentUrl = '';

  child.stdout.on('data', (data) => {
    const text = data.toString();
    console.log('[SSH OUT]:', text);
    const match = text.match(/https:\/\/[a-zA-Z0-9.-]+\.lhr\.life/);
    if (match) {
      currentUrl = match[0];
      console.log('====================================================');
      console.log('GLOF SENTRY PHASE 7 PUBLIC URL DISCOVERED:');
      console.log(currentUrl);
      console.log('====================================================');
      fs.writeFileSync(URL_FILE, currentUrl, 'utf-8');
    }
  });

  child.stderr.on('data', (data) => {
    console.log('[SSH ERR]:', data.toString());
  });

  child.on('close', (code) => {
    console.log(`[TUNNEL] SSH process exited with code ${code}. Re-establishing in 2s...`);
    setTimeout(startSSHTunnel, 2000);
  });

  child.on('error', (err) => {
    console.error('[TUNNEL] Spawn error:', err);
  });
}

startSSHTunnel();
