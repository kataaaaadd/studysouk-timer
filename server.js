import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 3002;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || process.env.VITE_DISCORD_CLIENT_ID || '1572928085362479104';
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';

const BOT_ROOT_DIR = '/root/studysouk-bot';
const LIBRARY_CATALOG_FILE = path.join(__dirname, 'assets/data/library.json');

app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, _res, next) => {
  console.log(`[Timer Server] ${req.method} ${req.url}`);
  next();
});

// Forgive Discord URL mapping prefix mistakes
app.use((req, _res, next) => {
  if (req.url.startsWith('/%3F')) {
    const slash = req.url.indexOf('/', 1);
    req.url = slash === -1 ? '/' : req.url.slice(slash);
  }
  next();
});

// Discord OAuth token exchange endpoint
app.post('/api/token', async (req, res) => {
  try {
    const { code } = req.body ?? {};
    if (!code) return res.status(400).json({ error: 'missing code' });
    const r = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    res.json({ access_token: data.access_token });
  } catch (err) {
    console.error('[OAuth] Token exchange failed:', err);
    res.status(500).json({ error: 'token exchange failed' });
  }
});

// ===========================================================================
// StudySouk Maktaba & STEM Library API (149 Volumes)
// ===========================================================================
app.get('/api/library/books', (_req, res) => {
  try {
    if (fs.existsSync(LIBRARY_CATALOG_FILE)) {
      const data = JSON.parse(fs.readFileSync(LIBRARY_CATALOG_FILE, 'utf8'));
      return res.json(data);
    }
    return res.status(404).json({ error: 'Library catalog not found' });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
});

const resolvedBookPaths = new Map();

function findBookPdfOnDisk(book) {
  if (resolvedBookPaths.has(book.id)) {
    const cached = resolvedBookPaths.get(book.id);
    if (fs.existsSync(cached)) return cached;
  }

  // 1. Direct path in BOT_ROOT_DIR
  if (book.filepath) {
    const directPath = path.resolve(BOT_ROOT_DIR, book.filepath);
    if (fs.existsSync(directPath)) {
      resolvedBookPaths.set(book.id, directPath);
      return directPath;
    }
    // 2. Direct inside /root/studysouk-bot/library/
    const baseName = path.basename(book.filepath);
    const inLibRoot = path.resolve(BOT_ROOT_DIR, 'library', baseName);
    if (fs.existsSync(inLibRoot)) {
      resolvedBookPaths.set(book.id, inLibRoot);
      return inLibRoot;
    }
  }

  // 3. Search by filename recursively
  const targetName = book.filename || (book.filepath ? path.basename(book.filepath) : null);
  if (targetName) {
    const libRoot = path.resolve(BOT_ROOT_DIR, 'library');
    try {
      function searchDir(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            const found = searchDir(full);
            if (found) return found;
          } else if (entry.isFile() && (entry.name === targetName || entry.name.toLowerCase() === targetName.toLowerCase())) {
            return full;
          }
        }
        return null;
      }
      const found = searchDir(libRoot);
      if (found) {
        resolvedBookPaths.set(book.id, found);
        return found;
      }
    } catch (e) {
      console.warn(`[Library] Search error: ${e}`);
    }
  }

  return null;
}

app.get('/api/library/pdf/:id', (req, res) => {
  try {
    const bookId = Number(req.params.id);
    if (!fs.existsSync(LIBRARY_CATALOG_FILE)) {
      return res.status(404).send('Catalog not found');
    }

    const catalog = JSON.parse(fs.readFileSync(LIBRARY_CATALOG_FILE, 'utf8'));
    const book = catalog.find((b) => Number(b.id) === bookId);
    if (!book) {
      return res.status(404).send('Document introuvable dans le catalogue');
    }

    const pdfPath = findBookPdfOnDisk(book);
    if (!pdfPath) {
      return res.status(404).send('Fichier PDF introuvable sur le serveur');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(book.filename || path.basename(pdfPath))}"`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    return res.sendFile(pdfPath);
  } catch (err) {
    return res.status(500).send(`Erreur serveur: ${err}`);
  }
});

// Cache control: HTML is never cached so Discord iframe always gets freshest version
const HTML_NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

app.use(
  express.static(__dirname, {
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-store');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
      res.setHeader('X-Frame-Options', 'ALLOWALL');
    },
  })
);

app.get('/terms', (_req, res) => res.sendFile(path.join(__dirname, 'terms.html'), HTML_NO_STORE));
app.get('/privacy', (_req, res) => res.sendFile(path.join(__dirname, 'privacy.html'), HTML_NO_STORE));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'index.html'), HTML_NO_STORE));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`⏱️ StudySouk Timer Activity Server running independently on port ${PORT}`);
});
