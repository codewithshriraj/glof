const fs = require('fs');
const path = require('path');

function scanDir(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.next' || f === '.git') continue;
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (/\.(tsx|ts|js|mjs|json|css|html|webmanifest)$/.test(f)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const rootDir = path.join(__dirname, '..');
const files = scanDir(rootDir);

console.log(`Scanning ${files.length} project files for LAN / localhost / insecure hardcoded references...`);

const patterns = [
  { name: 'Localhost / 127.0.0.1', regex: /(http:\/\/localhost|http:\/\/127\.0\.0\.1|localhost:\d+)/gi },
  { name: 'Local LAN IP (10.x / 192.168.x / 172.x)', regex: /(10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+)/gi },
  { name: 'Insecure HTTP tile/asset URLs', regex: /http:\/\/(?!localhost|127\.0\.0\.1)[^\s"']+/gi },
];

let matchesFound = 0;

for (const file of files) {
  const relPath = path.relative(rootDir, file);
  if (relPath.startsWith('scratch')) continue; // Skip test scripts

  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    for (const pat of patterns) {
      if (pat.regex.test(line)) {
        console.log(`[MATCH - ${pat.name}] ${relPath}:${idx + 1} -> ${line.trim()}`);
        matchesFound++;
      }
    }
  });
}

console.log(`\nScan complete. Total potential runtime LAN/HTTP references found in source code: ${matchesFound}`);
