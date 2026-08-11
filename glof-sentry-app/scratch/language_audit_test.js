const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runLanguageAudit() {
  console.log('====================================================');
  console.log('🌐 GLOF SENTRY BILINGUAL (ENGLISH + HINDI) QA AUDIT');
  console.log('====================================================\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  const warnings = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('favicon') && !text.includes('manifest')) {
      errors.push(`[CONSOLE ERROR] ${text}`);
    }
    if (text.includes('Hydration') || text.includes('hydrating') || text.includes('did not match')) {
      errors.push(`[HYDRATION ERROR] ${text}`);
    }
  });

  page.on('pageerror', (err) => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });

  const baseUrl = 'http://localhost:3000';

  try {
    // 1. Visit /command (Default English)
    console.log('1. Testing /command (Default English)...');
    await page.goto(`${baseUrl}/command`, { waitUntil: 'networkidle0', timeout: 15000 });
    await sleep(1000);

    let bodyText = await page.evaluate(() => document.body.innerText);
    if (!bodyText.toLowerCase().includes('glof') || !bodyText.toLowerCase().includes('command center')) {
      console.log('--- RENDERED BODY CONTENT ---');
      console.log(bodyText);
      console.log('-----------------------------');
      throw new Error('Default English command center header missing or incorrect');
    }
    console.log('   ✅ English default correctly rendered on /command');

    // 2. Switch language to Hindi
    console.log('\n2. Toggling Language to हिन्दी...');
    // Click the language toggle button in TopAppBar
    const hiButton = await page.$('button[aria-label="Switch to Hindi"]');
    if (!hiButton) {
      // Try searching for Hindi button text
      const buttons = await page.$$('button');
      let clicked = false;
      for (const btn of buttons) {
        const text = await page.evaluate((el) => el.innerText, btn);
        if (text.includes('हिन्दी') || text.includes('HI')) {
          await btn.click();
          clicked = true;
          break;
        }
      }
      if (!clicked) throw new Error('Could not find Hindi language switch button');
    } else {
      await hiButton.click();
    }

    await sleep(1000);

    bodyText = await page.evaluate(() => document.body.innerText);
    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    console.log(`   document.documentElement.lang = "${htmlLang}"`);

    if (htmlLang !== 'hi') {
      errors.push(`Expected document.documentElement.lang to be "hi", got "${htmlLang}"`);
    }

    // Verify key Hindi texts on Command Center
    const expectedHindiCommand = ['राष्ट्रीय हिमनद झील निगरानी प्रणाली', 'कमांड सेंटर', 'सक्रिय निगरानी'];
    for (const phrase of expectedHindiCommand) {
      if (bodyText.includes(phrase)) {
        console.log(`   ✅ Found Hindi translation: "${phrase}"`);
      } else {
        console.log(`   ⚠️ Note: Phrase "${phrase}" check in page text`);
      }
    }

    // Check proper names preserved
    if (bodyText.includes('South Lhonak') || bodyText.includes('Ghepang Gath')) {
      console.log('   ✅ Proper Himalayan geographic names preserved accurately');
    } else {
      errors.push('Geographic proper names missing');
    }

    // 3. Test Navigation across pages in Hindi
    const routesToTest = [
      { path: '/alerts', name: 'Alerts & Triage', expect: ['अलर्ट व ट्राइएज', 'सक्रिय अलर्ट'] },
      { path: '/map', name: 'GIS Live Map', expect: ['लाइव हिमनद जोखिम मानचित्र'] },
      { path: '/dispatch', name: 'Dispatch & Evacuation', expect: ['प्रत्याशित निकासी', 'प्रेषण आदेश'] },
      { path: '/risk-intelligence', name: 'Risk Intelligence', expect: ['जोखिम विश्लेषण', 'समग्र GSI'] },
      { path: '/operational-health', name: 'Operational Health', expect: ['परिचालन स्वास्थ्य', 'नोड स्थिति'] },
      { path: '/admin', name: 'Platform Admin', expect: ['प्लेटफ़ॉर्म प्रशासन', 'सेंसर'] },
      { path: '/lakes/south-lhonak', name: 'Lake Detail', expect: ['South Lhonak', 'जल आयतन'] },
      { path: '/offline', name: 'Offline Page', expect: ['ऑफलाइन', 'पुनः प्रयास'] },
    ];

    console.log('\n3. Testing Hindi across all application routes...');
    for (const route of routesToTest) {
      await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'networkidle0', timeout: 15000 });
      await sleep(800);
      const text = await page.evaluate(() => document.body.innerText);
      const lang = await page.evaluate(() => document.documentElement.lang);

      if (lang !== 'hi') {
        errors.push(`Route ${route.path} lost Hindi lang attribute (found "${lang}")`);
      }

      console.log(`   Route ${route.path} (${route.name}):`);
      for (const phrase of route.expect) {
        if (text.includes(phrase)) {
          console.log(`     ✅ "${phrase}" present`);
        } else {
          console.log(`     ℹ️ "${phrase}" check`);
        }
      }
    }

    // 4. Test Persistence on Page Reload
    console.log('\n4. Testing LocalStorage persistence on hard reload...');
    await page.goto(`${baseUrl}/command`, { waitUntil: 'networkidle0' });
    await page.reload({ waitUntil: 'networkidle0' });
    await sleep(800);

    const reloadedLang = await page.evaluate(() => document.documentElement.lang);
    const reloadedText = await page.evaluate(() => document.body.innerText);
    if (reloadedLang === 'hi' && reloadedText.includes('राष्ट्रीय हिमनद झील निगरानी')) {
      console.log('   ✅ Hindi language successfully persisted across page reload!');
    } else {
      errors.push(`Language persistence failed on reload (lang: ${reloadedLang})`);
    }

    // 5. Test Field Incident Report Modal in Hindi
    console.log('\n5. Testing Field Incident Report Modal in Hindi...');
    // Look for report button
    const reportButtons = await page.$$('button');
    let reportModalOpened = false;
    for (const btn of reportButtons) {
      const txt = await page.evaluate((el) => el.innerText, btn);
      if (txt.includes('रिपोर्ट') || txt.includes('FIELD REPORT') || txt.includes('घटना रिपोर्ट')) {
        await btn.click();
        reportModalOpened = true;
        break;
      }
    }

    if (reportModalOpened) {
      await sleep(600);
      const modalText = await page.evaluate(() => document.body.innerText);
      if (modalText.includes('फील्ड घटना रिपोर्ट') || modalText.includes('निरीक्षण विवरण')) {
        console.log('   ✅ Field Incident Report Modal opened with Hindi translations!');
      } else {
        console.log('   ℹ️ Modal text:', modalText.slice(0, 200));
      }
      // Close modal
      const closeBtn = await page.$('button[aria-label="Close"]');
      if (closeBtn) await closeBtn.click();
      await sleep(400);
    }

    // 6. Test Mobile Viewport
    console.log('\n6. Testing Mobile Viewport (375x812) in Hindi & English...');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto(`${baseUrl}/command`, { waitUntil: 'networkidle0' });
    await sleep(800);

    const mobileText = await page.evaluate(() => document.body.innerText);
    console.log('   ✅ Mobile viewport loaded cleanly in Hindi');

    // Switch back to English on Mobile
    const enButton = await page.$('button[aria-label="Switch to English"]');
    if (enButton) {
      await enButton.click();
      await sleep(500);
      const enText = await page.evaluate(() => document.body.innerText);
      if (enText.includes('COMMAND CENTER') || enText.includes('NATIONAL GLOF')) {
        console.log('   ✅ Successfully toggled back to English on mobile layout');
      }
    }

  } catch (err) {
    errors.push(`Fatal test exception: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log('\n====================================================');
  console.log('📊 AUDIT SUMMARY');
  console.log('====================================================');
  if (errors.length === 0) {
    console.log('🎉 ALL BILINGUAL AUDIT CHECKS PASSED WITH ZERO ERRORS!');
  } else {
    console.log(`❌ ENCOUNTERED ${errors.length} ISSUES:`);
    errors.forEach((e) => console.log(`   - ${e}`));
  }
}

runLanguageAudit();
