const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  try { execSync('pkill -f "remote-debugging-port=9222"'); } catch(e){}
  await sleep(1000);

  console.log('Starting Chrome in mobile viewport...');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=390,844',
    '--user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"',
    'about:blank'
  ]);

  chrome.on('error', (err) => {
    console.error('Failed to start Chrome:', err);
  });

  let list;
  for (let i = 0; i < 10; i++) {
    await sleep(1000);
    try {
      list = await getJSON('http://localhost:9222/json/list');
      if (list && list.length > 0) {
        const pageTarget = list.find(t => t.type === 'page');
        if (pageTarget) {
          list = [pageTarget];
          break;
        }
      }
    } catch (e) {}
  }

  if (!list || list.length === 0) {
    console.error('Chrome debug target unreachable.');
    chrome.kill();
    process.exit(1);
  }

  const target = list[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    } catch (e) {}
  });

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise(r => ws.on('open', r));

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await sleep(3000);

  // Capture hero
  let screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/mobile_hero.png', Buffer.from(screenshot.data, 'base64'));

  // Scroll to About
  await send('Runtime.evaluate', { expression: `document.getElementById('about')?.scrollIntoView()` });
  await sleep(1500);
  screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/mobile_about.png', Buffer.from(screenshot.data, 'base64'));

  // Scroll to Projects
  await send('Runtime.evaluate', { expression: `document.getElementById('projects')?.scrollIntoView()` });
  await sleep(1500);
  screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/mobile_projects.png', Buffer.from(screenshot.data, 'base64'));

  // Scroll to Events
  await send('Runtime.evaluate', { expression: `document.getElementById('events')?.scrollIntoView()` });
  await sleep(1500);
  screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/mobile_events.png', Buffer.from(screenshot.data, 'base64'));

  // Scroll to Contact
  await send('Runtime.evaluate', { expression: `document.getElementById('contact')?.scrollIntoView()` });
  await sleep(1500);
  screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/mobile_contact.png', Buffer.from(screenshot.data, 'base64'));

  console.log('Mobile screenshots captured successfully!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
