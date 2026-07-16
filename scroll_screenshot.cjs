const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

// Helper to HTTP GET
function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

// Helper to delay
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  // Kill any existing chrome
  try { execSync('pkill -f "remote-debugging-port=9222"'); } catch(e){}
  await sleep(1000);

  // Start Chrome headless
  console.log('Starting Google Chrome in headless mode with debugging port...');
  const chrome = spawn('google-chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--no-sandbox',
    '--disable-gpu',
    '--window-size=1440,900',
    'about:blank'
  ]);

  chrome.on('error', (err) => {
    console.error('Failed to start Chrome:', err);
  });

  // Wait for Chrome to start
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
    } catch (e) {
      console.log('Waiting for Chrome to be ready...');
    }
  }

  if (!list || list.length === 0) {
    console.error('Chrome page debug target is empty or unreachable.');
    chrome.kill();
    process.exit(1);
  }

  const target = list[0];
  console.log('Connecting to WebSocket URL:', target.webSocketDebuggerUrl);

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  ws.on('open', () => {
    console.log('WS connection opened.');
  });

  ws.on('error', (err) => {
    console.error('WS error:', err);
  });

  ws.on('message', (data) => {
    try {
      const text = data.toString();
      // Only log short messages
      if (text.length < 500) {
        console.log('WS received:', text);
      } else {
        console.log('WS received large message length:', text.length);
      }
      const msg = JSON.parse(text);
      if (pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) {
          console.error(`Method id ${msg.id} failed:`, msg.error);
          reject(msg.error);
        } else {
          resolve(msg.result);
        }
      }
    } catch (e) {
      console.error('Error in message parsing/handling:', e);
    }
  });

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      const payload = JSON.stringify({ id: msgId, method, params });
      console.log('WS sending:', payload);
      ws.send(payload);
    });
  }

  await new Promise(r => ws.on('open', r));
  console.log('Connected to CDP!');

  // Enable Page domain
  await send('Page.enable');
  await send('Runtime.enable');

  // Navigate to localhost:5173
  console.log('Navigating to http://localhost:5173/ ...');
  await send('Page.navigate', { url: 'http://localhost:5173/' });

  // Wait for page load
  await sleep(4000);

  // Capture hero (Scroll position 0)
  console.log('Capturing Hero Section...');
  let screenshot = await send('Page.captureScreenshot');
  console.log('Hero screenshot captured, saving...');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/hero.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Hero screenshot saved!');

  // Scroll to About section and capture
  console.log('Scrolling to About section...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo(0, 850);
      }
    })()`
  });
  await sleep(1500); // wait for scroll/animations
  console.log('Capturing About Section...');
  screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/about.png', Buffer.from(screenshot.data, 'base64'));
  console.log('About screenshot saved!');

  // Scroll to Projects section and capture
  console.log('Scrolling to Projects section...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo(0, 1750);
      }
    })()`
  });
  await sleep(1500);
  console.log('Capturing Projects Section...');
  screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/projects.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Projects screenshot saved!');

  // Scroll to Events section and capture
  console.log('Scrolling to Events section...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('events');
      if (el) {
        el.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo(0, 2600);
      }
    })()`
  });
  await sleep(1500);
  console.log('Capturing Events Section...');
  screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/events.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Events screenshot saved!');

  // Scroll to Contact section and capture
  console.log('Scrolling to Contact section...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('contact');
      if (el) {
        el.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo(0, 3500);
      }
    })()`
  });
  await sleep(1500);
  console.log('Capturing Contact Section...');
  screenshot = await send('Page.captureScreenshot');
  fs.writeFileSync('/home/mevlec/portfolio/test-porto/dist/contact.png', Buffer.from(screenshot.data, 'base64'));
  console.log('Contact screenshot saved!');

  console.log('All screenshots saved!');
  ws.close();
  chrome.kill();
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
