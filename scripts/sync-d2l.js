import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const projectDataDir = path.join(projectRoot, 'data');
let customDataDir = null;

export function setDataDir(customPath) {
  if (customPath) {
    customDataDir = customPath;
    if (!fs.existsSync(customDataDir)) {
      fs.mkdirSync(customDataDir, { recursive: true });
    }
  }
}

function getDataPaths() {
  const targetDir = customDataDir || projectDataDir;
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  return {
    icsFilePath: path.join(targetDir, 'd2l_calendar.ics'),
    dbFilePath: path.join(targetDir, 'uwexplorer_db.json'),
    configFilePath: path.join(targetDir, 'config.json'),
  };
}

export function loadConfig() {
  const { configFilePath } = getDataPaths();
  if (fs.existsSync(configFilePath)) {
    try {
      return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    } catch (e) {}
  }
  return { d2lFeedUrl: '' };
}

export function saveConfig(cfg) {
  const { configFilePath } = getDataPaths();
  fs.writeFileSync(configFilePath, JSON.stringify(cfg, null, 2), 'utf8');
}

export function loadDB() {
  const { dbFilePath } = getDataPaths();
  const projDbPath = path.join(projectDataDir, 'uwexplorer_db.json');

  let db = null;
  if (fs.existsSync(dbFilePath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
    } catch (e) {}
  }

  // If persistent file doesn't exist or is empty, seed from project template
  if (!db || ((!db.courses || db.courses.length === 0) && (!db.schedule || db.schedule.length === 0))) {
    if (fs.existsSync(projDbPath)) {
      try {
        db = JSON.parse(fs.readFileSync(projDbPath, 'utf8'));
        saveDB(db); // Save seed copy into user data path
      } catch (e) {}
    }
  }

  return db || {
    courses: [],
    tasks: [],
    schedule: [],
    quickLinks: [],
    settings: {}
  };
}

export function saveDB(db) {
  const { dbFilePath } = getDataPaths();
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2), 'utf8');
}

/**
 * Downloads raw D2L .ics feed using Node.js native https (bypassing browser CORS & 403).
 */
export function downloadICSFeed(feedUrl) {
  return new Promise((resolve, reject) => {
    if (!feedUrl) {
      return reject(new Error('No D2L feed URL configured in data/config.json'));
    }

    let url = feedUrl.trim();
    if (url.startsWith('webcal://')) {
      url = 'https://' + url.substring(9);
    }

    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/calendar, text/plain, */*'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        return downloadICSFeed(res.headers.location).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP Download Status ${res.statusCode}`));
      }

      let rawData = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { rawData += chunk; });
      res.on('end', () => {
        if (rawData.includes('BEGIN:VCALENDAR') || rawData.includes('BEGIN:VEVENT')) {
          fs.writeFileSync(icsFilePath, rawData, 'utf8');
          
          // Update DB lastSyncedAt timestamp
          const db = loadDB();
          db.lastSyncedAt = new Date().toISOString();
          saveDB(db);

          resolve({
            success: true,
            filePath: icsFilePath,
            bytes: rawData.length,
            timestamp: db.lastSyncedAt
          });
        } else {
          reject(new Error('Downloaded file is not a valid iCal / .ics format.'));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// CLI Direct Execution Support
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cfg = loadConfig();
  console.log(`[UWexplorer Sync] Downloading live D2L feed from: ${cfg.d2lFeedUrl || 'None'}`);
  downloadICSFeed(cfg.d2lFeedUrl)
    .then((res) => console.log(`[UWexplorer Sync] Success! Saved ${res.bytes} bytes to ${res.filePath}`))
    .catch((err) => console.error(`[UWexplorer Sync] Error: ${err.message}`));
}
