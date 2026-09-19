import { app, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { loadDB, saveDB, loadConfig } from '../scripts/sync-d2l.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;
let server = null;

function startLocalServer() {
  return new Promise((resolve) => {
    server = createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
      }

      if (req.url === '/api/local-data' && req.method === 'GET') {
        const db = loadDB();
        const config = loadConfig();
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ db, config }));
      }

      if (req.url === '/api/save-db' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            saveDB(data);
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message }));
          }
        });
        return;
      }

      // Serve static frontend from dist
      const distDir = path.join(__dirname, '../dist');
      let reqUrl = req.url.split('?')[0];
      let filePath = path.join(distDir, reqUrl === '/' ? 'index.html' : reqUrl);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const mimeTypes = {
          '.html': 'text/html',
          '.js': 'text/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.svg': 'image/svg+xml',
          '.png': 'image/png',
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        return res.end(fs.readFileSync(filePath));
      } else if (fs.existsSync(path.join(distDir, 'index.html'))) {
        res.setHeader('Content-Type', 'text/html');
        return res.end(fs.readFileSync(path.join(distDir, 'index.html')));
      }

      res.statusCode = 404;
      res.end('Not Found');
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      console.log(`[Electron Server] Running on http://127.0.0.1:${port}`);
      resolve(port);
    });
  });
}

async function createWindow() {
  const port = await startLocalServer();

  mainWindow = new BrowserWindow({
    width: 1380,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  const isDev = process.env.NODE_ENV === 'development';
  const url = isDev ? 'http://localhost:5173' : `http://127.0.0.1:${port}`;

  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
