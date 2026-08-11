const fs = require('fs');
const path = require('path');

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, fileList);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const srcDir = path.join(__dirname, '../src');
const allFiles = scanDir(srcDir);

console.log(`Auditing ${allFiles.length} source files for hydration mismatch patterns...`);

let issues = 0;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(srcDir, file);

  // Check 1: localStorage or sessionStorage inside render
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if ((line.includes('localStorage') || line.includes('sessionStorage')) && !content.includes('useEffect')) {
      console.warn(`[WARN] ${relPath}:${idx + 1} uses storage outside useEffect: ${line.trim()}`);
      issues++;
    }
  });

  // Check 2: suppressHydrationWarning
  if (content.includes('suppressHydrationWarning') && !relPath.includes('layout.tsx')) {
    console.warn(`[WARN] ${relPath} contains suppressHydrationWarning! (Should be avoided)`);
    issues++;
  }
}

if (issues === 0) {
  console.log('[PASS] Zero illicit storage reads or illegal suppressHydrationWarning workarounds found!');
} else {
  console.log(`[INFO] Found ${issues} items to review.`);
}
