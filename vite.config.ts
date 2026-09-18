import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { downloadICSFeed, loadDB, saveDB, loadConfig, saveConfig } from './scripts/sync-d2l.js';

const dataDir = path.resolve(__dirname, 'data');
const icsFilePath = path.join(dataDir, 'd2l_calendar.ics');

function uwexplorerStoragePlugin() {
  return {
    name: 'uwexplorer-storage-plugin',
    configureServer(server) {
      // Endpoint 1: Get all local disk data (raw ICS file content + merged JSON DB)
      server.middlewares.use('/api/local-data', (req, res) => {
        if (req.method === 'GET') {
          const db = loadDB();
          const config = loadConfig();
          let icsText = '';
          if (fs.existsSync(icsFilePath)) {
            icsText = fs.readFileSync(icsFilePath, 'utf8');
          }

          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({
            icsText,
            db,
            config,
          }));
        }
      });

      // Endpoint 2: Save database to disk
      server.middlewares.use('/api/save-db', (req, res) => {
        if (req.method === 'POST') {
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
        }
      });

      // Endpoint 3: Save D2L feed URL configuration to disk
      server.middlewares.use('/api/save-config', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const config = JSON.parse(body);
              saveConfig(config);
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      });

      // Endpoint 4: Trigger Node.js backend download of D2L .ics feed (bypasses browser CORS & 403)
      server.middlewares.use('/api/trigger-sync', async (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = body ? JSON.parse(body) : {};
              const feedUrl = payload.d2lFeedUrl || loadConfig().d2lFeedUrl;

              if (payload.d2lFeedUrl) {
                saveConfig({ d2lFeedUrl: payload.d2lFeedUrl });
              }

              const result = await downloadICSFeed(feedUrl);
              const icsText = fs.readFileSync(icsFilePath, 'utf8');
              const db = loadDB();

              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({
                success: true,
                result,
                icsText,
                db
              }));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), uwexplorerStoragePlugin()],
});
