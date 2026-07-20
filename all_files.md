## File: `./all_files.md`
```markdown
```

## File: `./docs/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>RA 10863 – Customs Modernization and Tariff Act</title>
    <link rel="manifest" href="./manifest.json" />
    <link rel="apple-touch-icon" href="./icons/icon-192.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚖️</text></svg>" />

    <script>
      // Apply saved dark-mode preference immediately, before first paint,
      // so there's no flash of light UI when dark mode is turned on.
      (function () {
        try {
          if (localStorage.getItem("customsLaw_darkMode") === "true") {
            document.documentElement.classList.add("dark");
          }
        } catch (e) {}
      })();
    </script>

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
              serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
            },
            colors: {
              navy: {
                950: '#0b1220',
                900: '#0f172a',
                800: '#152238',
                700: '#1e3a5f',
              },
              gold: {
                50: '#fdf8ec',
                100: '#faedc4',
                400: '#e0b94d',
                500: '#c9a227',
                600: '#a9841c',
              },
            },
            boxShadow: {
              card: '0 1px 2px 0 rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.08)',
            },
          },
        },
      };
    </script>
    <style>
      html { -webkit-tap-highlight-color: transparent; }
      body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      ::-moz-selection { background: #fde68a; }
      ::selection { background: #fde68a; }
      mark { background: #fde68a; padding: 0 2px; border-radius: 3px; color: #1e293b; font-weight: 600; }
      .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
      .safe-top { padding-top: env(safe-area-inset-top); }
      @media (min-width: 768px) {
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      }
      .dark ::-moz-selection { background: #92400e; }
      .dark ::selection { background: #92400e; }
      .dark ::-webkit-scrollbar-thumb { background: #475569; }
      .dark ::-webkit-scrollbar-thumb:hover { background: #64748b; }
    </style>
    <script type="module" crossorigin src="./assets/index-Cu1Nm48_.js"></script>
    <link rel="apple-touch-icon" href="icons/icon-192.png">
    <link rel="stylesheet" crossorigin href="./assets/index-D-97NAqP.css">
  </head>
  <body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div id="root"></div>
  <!-- iOS Add to Home Screen Banner -->
  <div id="ios-pwa-banner" style="display:none; position:fixed; bottom:10px; left:10px; right:10px; background:white; color:#1e293b; border-radius:12px; padding:14px; box-shadow:0 4px 20px rgba(0,0,0,0.3); z-index:9999; font-family:sans-serif; align-items:center; gap:10px; border:1px solid #e2e8f0;">
    <span style="font-size:24px;">📲</span>
    <div style="flex:1;">
      <strong style="font-size:15px;">Install this app</strong><br>
      <span style="font-size:13px; color:#64748b;">Tap <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px;">⬆️ Share</span> then <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px;">Add to Home Screen</span></span>
    </div>
    <button onclick="document.getElementById("ios-pwa-banner").style.display="none"" style="background:none; border:none; font-size:20px; color:#94a3b8; cursor:pointer;">✕</button>
  </div>
  <script>
    (function() {
      var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      var isStandalone = window.navigator.standalone;
      if (isIOS && !isStandalone) {
        document.getElementById("ios-pwa-banner").style.display = "flex";
      }
    })();
  </script>
  </body>
</html>
```

## File: `./docs/manifest.json`
```json
{
  "name": "RA 10863 - Customs Modernization and Tariff Act",
  "short_name": "CMTA Law",
  "description": "Study and reference companion for the Customs Modernization and Tariff Act (RA 10863) of the Philippines, with search, highlights, and offline support.",
  "id": "/",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

## File: `./docs/sw.js`
```javascript
// Minimal offline-support service worker.
// Strategy: try the network first (so data stays fresh when online),
// and fall back to cache when the request fails (offline / weak signal).
// Every successful GET response gets cached automatically, so chapters,
// search results, and app files you've already opened once will keep
// working with no internet connection.

const CACHE_NAME = "cmta-app-cache-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const shell = await caches.match("/");
          if (shell) return shell;
        }
        return Response.error();
      })
  );
});
```

## File: `./frontend/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <title>RA 10863 – Customs Modernization and Tariff Act</title>
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/icons/icon-192.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet" />

    <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
    <script>eruda.init();</script>

    <script>
      (function () {
        try {
          if (localStorage.getItem("customsLaw_darkMode") === "true") {
            document.documentElement.classList.add("dark");
          }
        } catch (e) {}
      })();
    </script>

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
              serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
            },
            colors: {
              navy: { 950: '#0b1220', 900: '#0f172a', 800: '#152238', 700: '#1e3a5f' },
              gold: { 50: '#fdf8ec', 100: '#faedc4', 400: '#e0b94d', 500: '#c9a227', 600: '#a9841c' },
            },
          },
        },
      };
    </script>
    <style>
      html { -webkit-tap-highlight-color: transparent; }
      body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      mark { background: #fde68a; padding: 0 2px; border-radius: 3px; color: #1e293b; font-weight: 600; }
      .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
      .safe-top { padding-top: env(safe-area-inset-top); }
    </style>
  </head>
  <body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## File: `./frontend/package.json`
```json
{
  "name": "customs-law-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "sql.js": "^1.14.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "vite": "^5.2.0"
  }
}
```

## File: `./frontend/postcss.config.js`
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## File: `./frontend/public/manifest.json`
```json
{
  "name": "RA 10863 - Customs Modernization and Tariff Act",
  "short_name": "CMTA Law",
  "description": "Study and reference companion for the Customs Modernization and Tariff Act (RA 10863) of the Philippines, with search, highlights, and offline support.",
  "id": "/",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

## File: `./frontend/public/sw.js`
```javascript
// Minimal offline-support service worker.
// Strategy: try the network first (so data stays fresh when online),
// and fall back to cache when the request fails (offline / weak signal).
// Every successful GET response gets cached automatically, so chapters,
// search results, and app files you've already opened once will keep
// working with no internet connection.

const CACHE_NAME = "cmta-app-cache-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const shell = await caches.match("/");
          if (shell) return shell;
        }
        return Response.error();
      })
  );
});
```

## File: `./frontend/src/db.js`
```javascript
import initSqlJs from 'sql.js/dist/sql-wasm.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let dbPromise = null;

async function loadDatabase() {
  const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
  const url = `${import.meta.env.BASE_URL}customs_law.db`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load customs_law.db (HTTP ${response.status})`);
  const arrayBuffer = await response.arrayBuffer();
  return new SQL.Database(new Uint8Array(arrayBuffer));
}

export function initDatabase() {
  if (!dbPromise) dbPromise = loadDatabase();
  return dbPromise;
}

export async function query(sql, params = []) {
  const database = await initDatabase();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows.length ? rows[0] : null;
}

function romanToInt(s) {
  if (!s) return 0;
  s = String(s).toUpperCase().trim();
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const cur = values[s[i]] || 0;
    total += cur < prev ? -cur : cur;
    prev = cur;
  }
  return total;
}

export async function getTitles() {
  const rows = await query(`
    SELECT 
      t.id AS title_id,
      t.node_number AS title_number,
      t.title AS title_title,
      c.id AS chapter_id,
      c.node_number AS chapter_number,
      c.title AS chapter_title,
      (SELECT COUNT(*) FROM legal_nodes s WHERE s.parent_id = c.id AND s.node_type = 'section') AS section_count
    FROM legal_nodes t
    LEFT JOIN legal_nodes c ON c.parent_id = t.id AND c.node_type = 'chapter'
    WHERE t.node_type = 'title'
    ORDER BY CAST(c.node_number AS INTEGER) ASC
  `);
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.title_id)) {
      map.set(row.title_id, {
        title_id: row.title_id,
        title_number: row.title_number,
        title_title: row.title_title,
        chapters: []
      });
    }
    if (row.chapter_id) {
      map.get(row.title_id).chapters.push({
        id: row.chapter_id,
        node_number: row.chapter_number,
        title: row.chapter_title,
        section_count: row.section_count
      });
    }
  }
  const rootRows = await query(`
    SELECT 
      c.id AS chapter_id,
      c.node_number AS chapter_number,
      c.title AS chapter_title,
      (SELECT COUNT(*) FROM legal_nodes s WHERE s.parent_id = c.id AND s.node_type = 'section') AS section_count
    FROM legal_nodes c
    WHERE c.node_type = 'chapter' AND c.parent_id IS NULL
    ORDER BY CAST(c.node_number AS INTEGER) ASC
  `);
  const result = Array.from(map.values()).sort(
    (a, b) => romanToInt(a.title_number) - romanToInt(b.title_number)
  );
  if (rootRows.length) {
    result.push({
      title_id: null,
      title_number: null,
      title_title: "Chapters (no title)",
      chapters: rootRows.map(r => ({
        id: r.chapter_id,
        node_number: r.chapter_number,
        title: r.chapter_title,
        section_count: r.section_count
      }))
    });
  }
  return result;
}

export async function getChapter(chapterNumber, titleNumber = null) {
  let whereClause = "node_type = 'chapter' AND node_number = ?";
  let params = [chapterNumber];
  if (titleNumber) {
    const titleRow = await queryOne("SELECT id FROM legal_nodes WHERE node_type = 'title' AND node_number = ?", [titleNumber]);
    if (!titleRow) return null;
    whereClause += " AND parent_id = ?";
    params.push(titleRow.id);
  } else {
    whereClause += " AND parent_id IS NULL";
  }
  const chapterRow = await queryOne(`SELECT * FROM legal_nodes WHERE ${whereClause}`, params);
  if (!chapterRow) return null;

  const sql = `
    WITH RECURSIVE subtree(id, parent_id, node_type, node_number, title, content, status, version, depth, sort_order) AS (
      SELECT id, parent_id, node_type, node_number, title, content, status, version, depth, sort_order
      FROM legal_nodes WHERE id = ?
      UNION ALL
      SELECT n.id, n.parent_id, n.node_type, n.node_number, n.title, n.content, n.status, n.version, n.depth, n.sort_order
      FROM legal_nodes n JOIN subtree s ON n.parent_id = s.id
    )
    SELECT * FROM subtree ORDER BY depth, sort_order
  `;
  const rows = await query(sql, [chapterRow.id]);
  const nodeMap = {};
  const root = { ...chapterRow, children: [] };
  nodeMap[chapterRow.id] = root;
  for (const row of rows) {
    if (row.id === chapterRow.id) continue;
    const parent = nodeMap[row.parent_id];
    if (!parent) continue;
    const node = { ...row, children: [] };
    parent.children.push(node);
    nodeMap[row.id] = node;
  }
  const ids = Object.keys(nodeMap);
  if (ids.length) {
    const keywordRows = await query(`SELECT node_id, keyword FROM node_keywords WHERE node_id IN (${ids.join(',')})`);
    for (const kw of keywordRows) {
      const node = nodeMap[kw.node_id];
      if (node) { if (!node.keywords) node.keywords = []; node.keywords.push(kw.keyword); }
    }
    const xrefRows = await query(`SELECT node_id, reference_text, url, display_text FROM node_cross_references WHERE node_id IN (${ids.join(',')})`);
    for (const xr of xrefRows) {
      const node = nodeMap[xr.node_id];
      if (node) { if (!node.cross_references) node.cross_references = []; node.cross_references.push({ text: xr.display_text || xr.reference_text, url: xr.url }); }
    }
    const noteRows = await query(`SELECT node_id, note_text FROM node_notes WHERE node_id IN (${ids.join(',')})`);
    for (const nt of noteRows) {
      const node = nodeMap[nt.node_id];
      if (node) { if (!node.notes) node.notes = []; node.notes.push(nt.note_text); }
    }
  }
  function buildNode(node) {
    return {
      id: node.id,
      uuid: node.uuid || '',
      node_type: node.node_type,
      node_number: node.node_number,
      title: node.title,
      content: node.content,
      status: node.status,
      version: node.version,
      keywords: node.keywords || [],
      cross_references: node.cross_references || [],
      notes: node.notes || [],
      children: (node.children || []).map(child => buildNode(child))
    };
  }
  return buildNode(root);
}

export async function search(queryText, filter = 'all', limit = 50) {
  const tokens = queryText.trim().split(/\s+/).filter(t => t.length > 0);
  if (!tokens.length) return [];
  const matchExpr = tokens.map(t => `"${t}"`).join(' ');
  let sql = `
    SELECT s.node_id, n.node_type, n.node_number, n.title, n.content,
           snippet(search_index, 4, '[', ']', '...', 20) AS excerpt,
           t_parent.node_number AS title_number, t_parent.title AS title_title,
           ch_parent.node_number AS chapter_number, ch_parent.title AS chapter_title,
           0 AS exact_match
    FROM search_index s
    JOIN legal_nodes n ON n.id = s.node_id
    LEFT JOIN legal_nodes ch_parent ON ch_parent.id = n.parent_id AND ch_parent.node_type = 'chapter'
    LEFT JOIN legal_nodes t_parent ON t_parent.id = ch_parent.parent_id AND t_parent.node_type = 'title'
    WHERE search_index MATCH ?
  `;
  const params = [matchExpr];
  if (filter !== 'all') { sql += " AND n.node_type = ?"; params.push(filter); }
  sql += " ORDER BY bm25(search_index, 12.0, 6.0, 1.0, 4.0) LIMIT ?";
  params.push(limit);
  try {
    return await query(sql, params);
  } catch (e) {
    let likeSql = `
      SELECT n.id AS node_id, n.node_type, n.node_number, n.title, n.content,
             substr(n.content, 1, 200) AS excerpt,
             t_parent.node_number AS title_number, t_parent.title AS title_title,
             ch_parent.node_number AS chapter_number, ch_parent.title AS chapter_title,
             0 AS exact_match
      FROM legal_nodes n
      LEFT JOIN legal_nodes ch_parent ON ch_parent.id = n.parent_id AND ch_parent.node_type = 'chapter'
      LEFT JOIN legal_nodes t_parent ON t_parent.id = ch_parent.parent_id AND t_parent.node_type = 'title'
      WHERE ${tokens.map(() => '(n.node_number LIKE ? OR n.title LIKE ? OR n.content LIKE ? OR n.node_type LIKE ?)').join(' AND ')}
    `;
    const likeParams = [];
    for (const token of tokens) {
      const like = `%${token}%`;
      likeParams.push(like, like, like, like);
    }
    if (filter !== 'all') { likeSql += " AND n.node_type = ?"; likeParams.push(filter); }
    likeSql += " ORDER BY n.node_type, CAST(n.node_number AS INTEGER) LIMIT ?";
    likeParams.push(limit);
    return await query(likeSql, likeParams);
  }
}

const HIGHLIGHTS_KEY = 'customsLaw_highlights';
export function getHighlightsForNode(nodeId) {
  try { const all = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY) || '{}'); return all[nodeId] || []; } catch { return []; }
}
export function addHighlight(nodeId, start, end, color = '#90EE90') {
  const all = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY) || '{}');
  if (!all[nodeId]) all[nodeId] = [];
  const newHl = { id: Date.now() + Math.random() * 1000, node_id: nodeId, start_offset: start, end_offset: end, color, created_at: new Date().toISOString() };
  all[nodeId].push(newHl);
  localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(all));
  return newHl;
}
export function removeHighlight(highlightId) {
  const all = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY) || '{}');
  for (const nodeId in all) {
    all[nodeId] = all[nodeId].filter(h => h.id !== highlightId);
    if (all[nodeId].length === 0) delete all[nodeId];
  }
  localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(all));
}

// ---------- Notes ----------
const NOTES_KEY = 'customsLaw_notes';

export function getNotesForNode(nodeId) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    return all[nodeId] || [];
  } catch {
    return [];
  }
}

export function addNote(nodeId, content) {
  const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  if (!all[nodeId]) all[nodeId] = [];
  const now = new Date().toISOString();
  const note = {
    id: Date.now() + Math.random() * 1000,
    node_id: nodeId,
    content,
    created_at: now,
    updated_at: now,
  };
  all[nodeId].push(note);
  localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  return note;
}

export function updateNote(nodeId, noteId, content) {
  const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  const list = all[nodeId] || [];
  const note = list.find((n) => n.id === noteId);
  if (note) {
    note.content = content;
    note.updated_at = new Date().toISOString();
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  }
  return note || null;
}

export function deleteNote(nodeId, noteId) {
  const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  if (!all[nodeId]) return;
  all[nodeId] = all[nodeId].filter((n) => n.id !== noteId);
  if (all[nodeId].length === 0) delete all[nodeId];
  localStorage.setItem(NOTES_KEY, JSON.stringify(all));
}

// ---------- Resume Reading / Study Progress ----------
const PROGRESS_KEY = 'customsLaw_lastPosition';

export function saveProgress(progress) {
  try {
    const existing = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    const merged = { ...existing, ...progress, saved_at: new Date().toISOString() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));
  } catch {}
}

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null');
  } catch {
    return null;
  }
}

// ---------- Tutorial ----------
const TUTORIAL_KEY = 'customsLaw_tutorialSeen';

export function hasTutorialBeenSeen() {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === 'true';
  } catch {
    return true;
  }
}

export function markTutorialSeen() {
  try {
    localStorage.setItem(TUTORIAL_KEY, 'true');
  } catch {}
}
```

## File: `./frontend/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## File: `./frontend/src/main.jsx`
```jsx
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import ChapterBrowser from "./pages/ChapterBrowser";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error(e, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, background: "#1e1e1e", color: "#ff6b6b", fontFamily: "monospace", whiteSpace: "pre-wrap", minHeight: "100vh" }}>
          <h1>⚠️ App Error</h1>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

window.addEventListener("unhandledrejection", (e) => {
  const msg = e.reason?.message || String(e.reason);
  document.body.innerHTML = `<div style="padding:20px;background:#1e1e1e;color:#ff6b6b;font-family:monospace;white-space:pre-wrap;">⚠️ ${msg}</div>`;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChapterBrowser />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
```

## File: `./frontend/src/pages/ChapterBrowser.jsx`
```jsx
import { useState, useEffect, useCallback, useRef, useMemo, useContext, createContext } from "react";
import {
  getTitles, getChapter, search,
  addHighlight, removeHighlight, getHighlightsForNode,
  getNotesForNode, addNote, updateNote, deleteNote,
  saveProgress, getProgress,
  hasTutorialBeenSeen, markTutorialSeen,
} from "../db";
import {
  getAiContext, IS_DEV, saveDevPreviewBatch, clearDevPreview,
  getDevPreviewRaw, buildTemplateForChapter, buildFullCopyPayload, AI_APPS, copyPromptAndOpen,
} from "../aiContext";
import DevPanel from "./DevPanel";

const MODE_KEY = "customsLaw_mode";
const FONT_KEY = "customsLaw_fontScale";
const DARK_KEY = "customsLaw_darkMode";

const HighlightUIContext = createContext(null);
function useHighlightUI() { return useContext(HighlightUIContext); }

function useNodeHighlights(nodeId, shouldLoad) {
  const [highlights, setHighlights] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!shouldLoad || !nodeId || loaded) return;
    const data = getHighlightsForNode(nodeId);
    setHighlights(data);
    setLoaded(true);
  }, [shouldLoad, nodeId, loaded]);
  const addHighlightLocal = useCallback(async (start, end) => {
    const newHl = addHighlight(nodeId, start, end);
    setHighlights(prev => [...prev, newHl]);
  }, [nodeId]);
  const removeHighlightLocal = useCallback(async (hlId) => {
    removeHighlight(hlId);
    setHighlights(prev => prev.filter(h => h.id !== hlId));
  }, []);
  return { highlights, addHighlight: addHighlightLocal, removeHighlight: removeHighlightLocal };
}

function useNodeNotes(nodeId, shouldLoad) {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!shouldLoad || !nodeId || loaded) return;
    setNotes(getNotesForNode(nodeId));
    setLoaded(true);
  }, [shouldLoad, nodeId, loaded]);
  const createNote = useCallback((content) => {
    const note = addNote(nodeId, content);
    setNotes((prev) => [...prev, note]);
    return note;
  }, [nodeId]);
  const editNote = useCallback((noteId, content) => {
    const note = updateNote(nodeId, noteId, content);
    setNotes((prev) => prev.map((n) => (n.id === noteId ? note : n)));
  }, [nodeId]);
  const removeNote = useCallback((noteId) => {
    deleteNote(nodeId, noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }, [nodeId]);
  return { notes, createNote, editNote, removeNote };
}

function formatNoteDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
      " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function applyHighlights(text, highlights) {
  if (!highlights || highlights.length === 0) return [{ text, highlightId: null }];
  const sorted = [...highlights].sort((a, b) => a.start_offset - b.start_offset);
  const segments = [];
  let cursor = 0;
  for (const hl of sorted) {
    if (hl.start_offset > cursor) segments.push({ text: text.slice(cursor, hl.start_offset), highlightId: null });
    segments.push({ text: text.slice(hl.start_offset, hl.end_offset), highlightId: hl.id, color: hl.color });
    cursor = hl.end_offset;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlightId: null });
  return segments;
}

function SelectionToolbar({ x, y, kind, onSave, onCancel, onDelete }) {
  return (
    <div style={{ position: "fixed", left: x, top: y, zIndex: 100 }} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1.5 shadow-lg shadow-slate-900/10 dark:border-slate-600 dark:bg-slate-800 dark:shadow-black/40">
      {kind === "existing" ? (
        <>
          <button onClick={onDelete} className="flex items-center gap-1 rounded-lg px-3 py-2 min-h-[40px] text-sm font-medium text-red-600 active:bg-red-50 dark:text-red-400 dark:active:bg-red-950/40">🗑 Remove highlight</button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Close</button>
        </>
      ) : (
        <>
          <button onClick={onSave} className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-2 min-h-[40px] text-sm font-semibold text-amber-800 active:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:active:bg-amber-900/70">🖍 Highlight</button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Cancel</button>
        </>
      )}
    </div>
  );
}

function HighlightableContent({ nodeId, content, highlights, addHighlight, removeHighlight, className, armed }) {
  const containerRef = useRef(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [toolbar, setToolbar] = useState(null);
  useEffect(() => {
    if (!armed) { setPendingSelection(null); setToolbar((t) => (t && t.kind === "existing" ? t : null)); return; }
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !containerRef.current || !containerRef.current.contains(sel.anchorNode)) {
        setPendingSelection(null); setToolbar((t) => (t && t.kind === "existing" ? t : null)); return;
      }
      const range = sel.getRangeAt(0);
      const preRange = document.createRange();
      preRange.selectNodeContents(containerRef.current);
      preRange.setEnd(range.startContainer, range.startOffset);
      const start = preRange.toString().length;
      const end = start + range.toString().length;
      if (start >= end) return;
      setPendingSelection({ start, end });
      const rect = range.getBoundingClientRect();
      setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 200)), y: rect.bottom + 8, kind: "selection" });
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [armed]);
  const handleMarkClick = (e, hlId) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 200)), y: rect.bottom + 8, kind: "existing", hlId });
    setPendingSelection(null);
  };
  const closeToolbar = () => { setToolbar(null); setPendingSelection(null); window.getSelection()?.removeAllRanges(); };
  const confirmHighlight = async () => { if (!pendingSelection) return; await addHighlight(pendingSelection.start, pendingSelection.end); closeToolbar(); };
  const confirmDelete = async () => { if (!toolbar?.hlId) return; await removeHighlight(toolbar.hlId); closeToolbar(); };
  const segments = applyHighlights(content, highlights);
  return (
    <div className="relative">
      <div ref={containerRef} className={`${className} ${armed ? "rounded-lg bg-amber-50/70 ring-1 ring-amber-300 dark:bg-amber-950/30 dark:ring-amber-700" : ""}`}>
        {segments.map((seg, i) =>
          seg.highlightId ? (
            <mark key={i} style={{ backgroundColor: seg.color }} className="cursor-pointer rounded-sm px-0.5" onClick={(e) => handleMarkClick(e, seg.highlightId)}>{seg.text}</mark>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>
      {toolbar && <SelectionToolbar x={toolbar.x} y={toolbar.y} kind={toolbar.kind} onSave={confirmHighlight} onDelete={confirmDelete} onCancel={closeToolbar} />}
    </div>
  );
}

function NotePanel({ notes, onCreate, onEdit, onDelete, onClose }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(notes.length === 0);

  const startEdit = (note) => { setEditingId(note.id); setDraft(note.content); setAdding(false); };
  const startAdd = () => { setAdding(true); setEditingId(null); setDraft(""); };
  const cancel = () => { setEditingId(null); setAdding(notes.length === 0); setDraft(""); };
  const save = () => {
    const text = draft.trim();
    if (!text) return;
    if (editingId) { onEdit(editingId, text); setEditingId(null); }
    else { onCreate(text); setAdding(false); }
    setDraft("");
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="mt-3 rounded-xl border border-sky-200 bg-sky-50/70 p-3 dark:border-sky-800 dark:bg-sky-950/30">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">📝 My Notes</span>
        <button onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700">Close</button>
      </div>
      {notes.length > 0 && !adding && !editingId && (
        <div className="mb-2 space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-slate-800">
              <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{n.content}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {n.updated_at !== n.created_at ? `Edited ${formatNoteDate(n.updated_at)}` : `Added ${formatNoteDate(n.created_at)}`}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(n)} className="text-xs font-semibold text-sky-700 dark:text-sky-400">Edit</button>
                  <button onClick={() => onDelete(n.id)} className="text-xs font-semibold text-red-600 dark:text-red-400">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {adding || editingId ? (
        <div>
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write your own explanation or reminder…"
            rows={3}
            style={{ fontSize: "16px" }}
            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button onClick={cancel} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700">Cancel</button>
            <button onClick={save} disabled={!draft.trim()} className="rounded-lg bg-sky-700 px-3 py-1.5 text-sm font-semibold text-white active:bg-sky-800 disabled:opacity-40 dark:bg-sky-600">
              {editingId ? "Save" : "Add Note"}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={startAdd} className="w-full rounded-lg border border-dashed border-sky-300 py-2 text-sm font-medium text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:text-sky-400 dark:active:bg-sky-900/40">
          + Add Note
        </button>
      )}
    </div>
  );
}

function AiContextModal({ node, onClose }) {
  const [entry, setEntry] = useState(() => getAiContext(node.id));
  const [copiedApp, setCopiedApp] = useState(null);
  const [devOpen, setDevOpen] = useState(false);
  const [devJson, setDevJson] = useState(() => (IS_DEV ? getDevPreviewRaw() : "{}"));
  const [devError, setDevError] = useState(null);

  const refresh = () => setEntry(getAiContext(node.id));

  const handleAskExternal = async (app) => {
    const prompt = entry?.prompt?.trim() ||
      `Explain "${node.title || node.node_number}" (${node.node_type} ${node.node_number || ""}) from RA 10863, the Philippine Customs Modernization and Tariff Act, in simple terms with an example.`;
    await copyPromptAndOpen(prompt, app.url);
    setCopiedApp(app.id);
    setTimeout(() => setCopiedApp(null), 2500);
  };

  const handleSaveDevJson = () => {
    try {
      saveDevPreviewBatch(devJson);
      setDevError(null);
      refresh();
    } catch (e) {
      setDevError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-3xl">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-navy-700 text-lg">🤖</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Osias 6.7</p>
              <p className="text-xl font-extrabold leading-tight text-slate-900 dark:text-slate-50">
                {entry?.title || `About ${node.node_type} ${node.node_number || ""}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100 dark:text-slate-500 dark:active:bg-slate-800">✕</button>
        </div>

        {entry?.content ? (
          <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 text-base leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">{entry.content}</p>
        ) : (
          <p className="rounded-2xl bg-slate-50 p-3 text-sm italic text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">Osias 6.7 hasn't explained this part yet.</p>
        )}

        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Still confused? Ask another AI</p>
          <div className="flex flex-wrap gap-2">
            {AI_APPS.map((app) => (
              <button key={app.id} onClick={() => handleAskExternal(app)} className="flex min-h-[42px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:active:bg-slate-700">
                <span aria-hidden>{app.icon}</span> {app.label}
              </button>
            ))}
          </div>
          {copiedApp && (
            <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              ✓ Prompt copied — paste it in {AI_APPS.find((a) => a.id === copiedApp)?.label} and send.
            </p>
          )}
        </div>

        {IS_DEV && (
          <div className="mt-4 rounded-2xl border border-dashed border-amber-300 p-3 dark:border-amber-700">
            <button onClick={() => setDevOpen((v) => !v)} className="w-full text-left text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              🛠 Dev only: {devOpen ? "Hide" : "Add / Preview AI context (JSON)"}
            </button>
            {devOpen && (
              <div className="mt-2">
                <textarea
                  value={devJson}
                  onChange={(e) => setDevJson(e.target.value)}
                  rows={8}
                  style={{ fontSize: "13px" }}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs text-slate-800 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200"
                />
                {devError && <p className="mt-1 text-xs text-red-500">{devError}</p>}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button onClick={handleSaveDevJson} className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white">Preview this JSON</button>
                  <button onClick={() => { clearDevPreview(); setDevJson("{}"); refresh(); }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300">Clear preview</button>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
                  This box only exists in npm run dev. It's stripped out of the production build automatically — it will not show on the live site.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const STUDY_TYPE_STYLES = {
  chapter: "text-xl sm:text-2xl font-bold text-navy-900 dark:text-slate-50",
  section: "text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200",
  paragraph: "text-base sm:text-lg text-slate-700 dark:text-slate-300",
  subparagraph: "text-base text-slate-600 dark:text-slate-400",
  item: "text-sm text-slate-500 dark:text-slate-500",
};

const STUDY_DEPTH_BORDERS = [
  "border-slate-200 dark:border-slate-700",
  "border-amber-200 dark:border-amber-800",
  "border-emerald-200 dark:border-emerald-800",
  "border-purple-200 dark:border-purple-800",
  "border-sky-200 dark:border-sky-800",
];

function StudyNodeRenderer({ node, level = 0, expandedSet = new Set(), scrollToId = null, collapseSignal = 0 }) {
  const nodeRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const aiEntry = useMemo(() => getAiContext(node.id), [node.id]);
  const { activeHighlightNodeId, setActiveHighlightNodeId } = useHighlightUI();
  const isHighlighting = activeHighlightNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isExpandable = hasChildren || !!node.content;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, expanded);
  const { notes, createNote, editNote, removeNote } = useNodeNotes(node.id, true);
  const prevCollapseSignal = useRef(collapseSignal);
  
  useEffect(() => { if (expandedSet.has(node.id)) setExpanded(true); }, [expandedSet, node.id]);
  useEffect(() => {
    if (collapseSignal !== prevCollapseSignal.current) {
      prevCollapseSignal.current = collapseSignal;
      setExpanded(false);
    }
  }, [collapseSignal]);
  useEffect(() => {
    if (scrollToId === node.id && nodeRef.current) {
      setTimeout(() => {
        nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nodeRef.current.classList.add("ring-2", "ring-amber-400", "bg-amber-50", "dark:bg-amber-900/40");
        setTimeout(() => nodeRef.current?.classList.remove("ring-2", "ring-amber-400", "bg-amber-50", "dark:bg-amber-900/40"), 2200);
      }, 120);
    }
  }, [scrollToId, node.id]);

  const toggle = (e) => { e.stopPropagation(); if (isExpandable) setExpanded((v) => !v); };

  return (
    <div ref={nodeRef} style={{ marginLeft: `${Math.min(level, 6) * 0.9}rem` }} className="my-1 rounded-xl transition-colors">
      <div onClick={toggle} role="button" tabIndex={0} aria-expanded={isExpandable ? expanded : undefined} className="flex items-start gap-2 rounded-xl px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer touch-manipulation dark:hover:bg-slate-800/60 dark:active:bg-slate-800">
        <span className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center select-none text-slate-400 transition-transform duration-200 dark:text-slate-600 ${expanded ? "rotate-90" : ""}`}>{isExpandable ? "▸" : ""}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {node.node_type === "chapter" && <span className="inline-block rounded-md bg-navy-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white dark:bg-navy-700">Chapter {node.node_number}</span>}
            {node.node_type === "section" && <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Sec. {node.node_number}</span>}
            <span className={STUDY_TYPE_STYLES[node.node_type] || "text-sm text-slate-700 dark:text-slate-300"}>{node.title || node.node_number}</span>
            {!expanded && notes.length > 0 && <span className="text-xs" title="Has notes">📝</span>}
            {!expanded && aiEntry && <span className="text-xs" title="AI explanation available">🤖</span>}
          </div>
          {expanded && node.content && (
            <div onClick={(e) => e.stopPropagation()} className="mt-2">
              <HighlightableContent nodeId={node.id} content={node.content} highlights={highlights} addHighlight={addHighlight} removeHighlight={removeHighlight} armed={isHighlighting} className="select-text rounded-lg p-2 text-base leading-relaxed text-slate-700 dark:text-slate-300" />
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <button onClick={() => setActiveHighlightNodeId(isHighlighting ? null : node.id)} className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${isHighlighting ? "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-900/40 dark:text-amber-300" : "border-emerald-200 bg-emerald-50 text-emerald-700 active:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:active:bg-emerald-950/50"}`}>{isHighlighting ? "Select text to highlight…" : "🖍 Highlight"}</button>
                <button onClick={() => setNotesOpen((v) => !v)} className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${notesOpen ? "border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-300" : "border-sky-200 bg-sky-50 text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/30 dark:text-sky-400 dark:active:bg-sky-950/50"}`}>
                  📝 {notes.length > 0 ? `Notes (${notes.length})` : "Add Note"}
                </button>
                <button onClick={() => setAiModalOpen(true)} className="min-h-[38px] rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400 dark:active:bg-purple-950/50">
                  🤖 Ask AI
                </button>
              </div>
              {notesOpen && (
                <NotePanel notes={notes} onCreate={createNote} onEdit={editNote} onDelete={removeNote} onClose={() => setNotesOpen(false)} />
              )}
              {aiModalOpen && <AiContextModal node={node} onClose={() => setAiModalOpen(false)} />}
              {node.cross_references && node.cross_references.length > 0 && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60" onClick={(e) => e.stopPropagation()}>
                  <span className="font-medium text-slate-700 dark:text-slate-300">See Also</span>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-400">
                    {node.cross_references.map((ref, idx) => (
                      <li key={idx}>{ref.url ? <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline decoration-navy-300 underline-offset-2 dark:text-amber-400 dark:decoration-amber-700">{ref.text}</a> : <span>{ref.text}</span>}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {expanded && node.keywords?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
              {node.keywords.map((kw) => <span key={kw} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">{kw}</span>)}
            </div>
          )}
        </div>
      </div>
      {expanded && hasChildren && (
        <div className={`ml-4 border-l-2 ${STUDY_DEPTH_BORDERS[(level + 1) % STUDY_DEPTH_BORDERS.length]}`}>
          {node.children.map((child) => <StudyNodeRenderer key={child.id} node={child} level={level + 1} expandedSet={expandedSet} scrollToId={scrollToId} collapseSignal={collapseSignal} />)}
        </div>
      )}
    </div>
  );
}

const READING_TYPE_STYLES = {
  chapter: "font-bold text-navy-900 dark:text-slate-50 mb-2",
  section: "font-semibold text-slate-900 dark:text-slate-100 mb-1",
  paragraph: "text-slate-800 dark:text-slate-300",
  subparagraph: "text-slate-800 dark:text-slate-300",
  item: "text-slate-700 dark:text-slate-400",
};

function ReadingNodeRenderer({ node, level = 0, fontScale, expandedSet = new Set(), scrollToId = null }) {
  const nodeRef = useRef(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const aiEntry = useMemo(() => getAiContext(node.id), [node.id]);
  const hasChildren = node.children && node.children.length > 0;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, !!node.content);
  const { notes, createNote, editNote, removeNote } = useNodeNotes(node.id, true);
  
  useEffect(() => {
    if (scrollToId === node.id && nodeRef.current) {
      setTimeout(() => {
        nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nodeRef.current.classList.add("bg-amber-50", "dark:bg-amber-900/40");
        setTimeout(() => nodeRef.current?.classList.remove("bg-amber-50", "dark:bg-amber-900/40"), 2200);
      }, 120);
    }
  }, [scrollToId, node.id]);

  const headingSize = node.node_type === "chapter" ? 1.6 : node.node_type === "section" ? 1.3 : 1;
  return (
    <div ref={nodeRef} style={{ marginLeft: `${Math.min(level, 4) * 0.6}rem` }} className="my-5 rounded-lg transition-colors">
      <div className={`font-serif ${READING_TYPE_STYLES[node.node_type] || "text-slate-800 dark:text-slate-200"}`} style={{ fontSize: `${headingSize * fontScale}rem` }}>
        {node.node_type === "section" && `Section ${node.node_number}. `}
        {node.node_type === "chapter" && `Chapter ${node.node_number}. `}
        {node.title || node.node_number}
        {notes.length > 0 && <span className="ml-1 align-middle text-sm" title="Has notes">📝</span>}
        {aiEntry && <span className="ml-1 align-middle text-sm" title="AI explanation available">🤖</span>}
      </div>
      {node.content && <HighlightableContent nodeId={node.id} content={node.content} highlights={highlights} addHighlight={addHighlight} removeHighlight={removeHighlight} armed={true} className="select-text font-serif leading-loose text-slate-800 dark:text-slate-300" />}
      {node.content && (
        <div className="mt-2 flex flex-wrap items-center gap-2 font-sans">
          <button onClick={() => setNotesOpen((v) => !v)} className={`min-h-[36px] rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${notesOpen ? "border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-300" : "border-sky-200 bg-sky-50 text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/30 dark:text-sky-400 dark:active:bg-sky-950/50"}`}>
            📝 {notes.length > 0 ? `Notes (${notes.length})` : "Add Note"}
          </button>
          <button onClick={() => setAiModalOpen(true)} className="min-h-[36px] rounded-lg border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400 dark:active:bg-purple-950/50">
            🤖 Ask AI
          </button>
        </div>
      )}
      {notesOpen && (
        <div className="font-sans">
          <NotePanel notes={notes} onCreate={createNote} onEdit={editNote} onDelete={removeNote} onClose={() => setNotesOpen(false)} />
        </div>
      )}
      {aiModalOpen && <AiContextModal node={node} onClose={() => setAiModalOpen(false)} />}
      {node.cross_references && node.cross_references.length > 0 && (
        <div className="mt-2 rounded-lg bg-slate-50 p-3 font-sans text-sm dark:bg-slate-800/60">
          <span className="font-medium text-slate-700 dark:text-slate-300">See Also</span>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-400">
            {node.cross_references.map((ref, idx) => (
              <li key={idx}>{ref.url ? <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline decoration-navy-300 underline-offset-2 dark:text-amber-400 dark:decoration-amber-700">{ref.text}</a> : <span>{ref.text}</span>}</li>
            ))}
          </ul>
        </div>
      )}
      {hasChildren && <div>{node.children.map((child) => <ReadingNodeRenderer key={child.id} node={child} level={level + 1} fontScale={fontScale} expandedSet={expandedSet} scrollToId={scrollToId} />)}</div>}
    </div>
  );
}

function ModeToggle({ mode, setMode }) {
  return (
    <div className="inline-flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800" role="tablist" aria-label="View mode">
      <button role="tab" aria-selected={mode === "study"} onClick={() => setMode("study")} className={`min-h-[34px] rounded-full px-2.5 py-1 transition-colors ${mode === "study" ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700" : "text-slate-500 dark:text-slate-400"}`}>
        <span aria-hidden>📘</span><span className="hidden sm:inline ml-1">Study</span>
      </button>
      <button role="tab" aria-selected={mode === "reading"} onClick={() => setMode("reading")} className={`min-h-[34px] rounded-full px-2.5 py-1 transition-colors ${mode === "reading" ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700" : "text-slate-500 dark:text-slate-400"}`}>
        <span aria-hidden>📖</span><span className="hidden sm:inline ml-1">Reading</span>
      </button>
    </div>
  );
}

function FontStepper({ fontScale, setFontScale }) {
  const clamp = (v) => Math.min(1.6, Math.max(0.85, v));
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <button onClick={() => setFontScale((s) => clamp(s - 0.1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700" aria-label="Decrease font size">A-</button>
      <span className="w-10 text-center text-xs text-slate-400 dark:text-slate-500">{Math.round(fontScale * 100)}%</span>
      <button onClick={() => setFontScale((s) => clamp(s + 0.1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700" aria-label="Increase font size">A+</button>
    </div>
  );
}

function ReadingProgressBar({ containerRef }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => { const max = el.scrollHeight - el.clientHeight; setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0); };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);
  return (
    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-navy-700 transition-all dark:from-amber-500 dark:to-navy-400" style={{ width: `${pct}%` }} />
    </div>
  );
}

function FilterChip({ label, value, active, onClick }) {
  return (
    <button onClick={() => onClick(value)} className={`min-h-[38px] rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${active ? "border-navy-900 bg-navy-900 text-white dark:border-navy-600 dark:bg-navy-700" : "border-slate-200 bg-white text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"}`}>{label}</button>
  );
}

function SearchResultCard({ item, onClick }) {
  const buildPath = () => {
    const parts = [];
    if (item.title_number) parts.push(`TITLE ${item.title_number}`);
    if (item.chapter_number) parts.push(`Ch. ${item.chapter_number}`);
    if (item.node_type === "section") parts.push(`Sec. ${item.node_number}`);
    return parts.join(" · ") || item.node_type.toUpperCase();
  };
  const typeColors = {
    title: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    chapter: "bg-navy-900 text-white dark:bg-navy-700",
    section: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    paragraph: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    subparagraph: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    item: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return (
    <button onClick={onClick} className={`block w-full rounded-2xl border bg-white p-4 text-left shadow-card transition active:scale-[0.99] active:bg-slate-50 dark:bg-slate-800 dark:active:bg-slate-700/70 ${item.exact_match ? "border-amber-400 ring-1 ring-amber-300 dark:border-amber-600 dark:ring-amber-700" : "border-slate-200 dark:border-slate-700"}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`rounded-md px-1.5 py-0.5 font-semibold uppercase tracking-wide ${typeColors[item.node_type] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{item.node_type}</span>
          <span className="text-slate-400 dark:text-slate-500">{buildPath()}</span>
        </div>
        {item.exact_match && <span className="flex-shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-950 dark:bg-amber-500 dark:text-amber-950">✓ Exact match</span>}
      </div>
      <div className="mt-1.5 text-base font-semibold text-slate-900 dark:text-slate-100">{item.title || item.node_number}</div>
      {item.excerpt && <div className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: item.excerpt.replace(/\[/g, "<mark>").replace(/\]/g, "</mark>") }} />}
      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-navy-700 dark:text-amber-400">Open <span aria-hidden>→</span></div>
    </button>
  );
}

function SearchView({ onNavigateChapter }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true); setError(null); setHasSearched(true);
    try {
      const data = await search(query.trim(), filter);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally { setLoading(false); }
  }, [query, filter]);

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };
  const clearQuery = () => { setQuery(""); setResults([]); setHasSearched(false); inputRef.current?.focus(); };
  const handleResultClick = (item) => { onNavigateChapter(item.chapter_number, item.title_number, item.node_number); };
  
  const exactResults = results.filter((r) => r.exact_match);
  const otherResults = results.filter((r) => !r.exact_match);
  
  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <span className="pl-1 text-lg text-slate-400 dark:text-slate-500" aria-hidden>🔍</span>
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder='Search e.g. "Section 102" or "smuggling"' className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500" style={{ fontSize: "16px" }} />
          {query && <button onClick={clearQuery} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100 dark:text-slate-500 dark:active:bg-slate-700" aria-label="Clear search">✕</button>}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-700">
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="All" value="all" active={filter === "all"} onClick={setFilter} />
            <FilterChip label="Title" value="title" active={filter === "title"} onClick={setFilter} />
            <FilterChip label="Chapter" value="chapter" active={filter === "chapter"} onClick={setFilter} />
            <FilterChip label="Section" value="section" active={filter === "section"} onClick={setFilter} />
          </div>
          <button onClick={handleSearch} disabled={loading || !query.trim()} className="min-h-[38px] flex-shrink-0 rounded-full bg-navy-900 px-5 py-1.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 disabled:opacity-40 dark:bg-navy-700 dark:active:bg-navy-600">{loading ? "Searching…" : "Search"}</button>
        </div>
      </div>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">{error}</p>}
      {loading && (
        <div className="mt-4 space-y-3">
          {[0,1,2].map(i => <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"><div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700"/><div className="mt-3 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700"/><div className="mt-2 h-3 w-full rounded bg-slate-100 dark:bg-slate-700/60"/></div>)}
        </div>
      )}
      {!loading && exactResults.length > 0 && <div className="mt-5 space-y-2">{exactResults.map((item, idx) => <SearchResultCard key={`exact-${idx}`} item={item} onClick={() => handleResultClick(item)} />)}</div>}
      {!loading && otherResults.length > 0 && <div className="mt-5">{exactResults.length > 0 && <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Related mentions</p>}<div className="space-y-2">{otherResults.map((item, idx) => <SearchResultCard key={`other-${idx}`} item={item} onClick={() => handleResultClick(item)} />)}</div></div>}
      {!loading && hasSearched && results.length === 0 && !error && <div className="mt-10 flex flex-col items-center gap-2 text-center text-slate-400 dark:text-slate-600"><span className="text-3xl">🔎</span><p className="text-base font-medium text-slate-500 dark:text-slate-400">No results for "{query}"</p><p className="text-sm">Try a section number (e.g. 102), a keyword, or a shorter phrase.</p></div>}
      {!hasSearched && !loading && <div className="mt-10 flex flex-col items-center gap-2 text-center text-slate-400 dark:text-slate-600"><span className="text-3xl">📚</span><p className="text-sm">Search the full text of RA 10863 — titles, chapters, sections, and definitions.</p></div>}
    </div>
  );
}

function DarkModeToggle({ enabled, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={enabled} onClick={() => onChange(!enabled)} className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${enabled ? "bg-navy-700" : "bg-slate-300"}`}>
      <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${enabled ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}

const TUTORIAL_STEPS = [
  { icon: "⚖️", title: "Welcome to RA 10863", body: "Your complete offline companion for the Customs Modernization and Tariff Act. Let's take a 60-second tour of what you can do." },
  { icon: "📚", title: "Browse the Law", body: "Tap the menu button (☰) to open the sidebar. Every Title, Chapter, and Section is organized in the correct legal order." },
  { icon: "📘", title: "Study Mode", body: "Expand one section at a time to focus on details. Use Expand All or Collapse All at the top to move through a whole chapter faster." },
  { icon: "📖", title: "Reading Mode", body: "A clean, book-style view for long reading sessions. Tap 🎯 Focus to hide the toolbar and read distraction-free." },
  { icon: "🖍️", title: "Highlights", body: "Select any text to highlight it. Works in both Study and Reading mode, and is saved automatically — even offline." },
  { icon: "📝", title: "Notes", body: "Tap \"Add Note\" under any section to write your own explanation. Edit or delete your notes anytime." },
  { icon: "🤖", title: "Ask AI", body: "Tap Ask AI under any section for an instant offline explanation from Osias 6.7 — or hand off to Meta AI, ChatGPT, or Gemini with one tap." },
  { icon: "🔍", title: "Search", body: "Find anything instantly. Try a section number like \"102\", or a keyword like \"smuggling\"." },
  { icon: "⏱️", title: "Resume Reading", body: "Close the app anytime — a \"Continue where you left off\" card will bring you right back to your spot." },
  { icon: "⚙️", title: "Settings", body: "Switch Dark Mode on or off, and replay this tour anytime from the Settings screen." },
];

function TutorialOverlay({ onFinish }) {
  const [step, setStep] = useState(0);
  const total = TUTORIAL_STEPS.length;
  const isLast = step === total - 1;
  const current = TUTORIAL_STEPS[step];

  const next = () => { if (isLast) onFinish(); else setStep((s) => s + 1); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-slate-900/70 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:max-w-md sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {TUTORIAL_STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-navy-900 dark:bg-slate-100" : "w-1.5 bg-slate-200 dark:bg-slate-700"}`} />
            ))}
          </div>
          <button onClick={onFinish} className="text-sm font-medium text-slate-400 active:text-slate-600 dark:text-slate-500 dark:active:text-slate-300">
            Skip
          </button>
        </div>
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 text-5xl" aria-hidden>{current.icon}</span>
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50">{current.title}</h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{current.body}</p>
        </div>
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button onClick={back} className="flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-800">
              Back
            </button>
          )}
          <button onClick={next} className="flex h-12 flex-[2] items-center justify-center rounded-xl bg-navy-900 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600">
            {isLast ? "Start Exploring" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsView({ darkMode, setDarkMode, onReplayTutorial }) {
  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-slate-50">Settings</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Customize your reading experience.</p>
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Appearance</h2>
        <div className="flex items-center justify-between gap-4 rounded-xl py-1">
          <div className="min-w-0"><p className="font-medium text-slate-800 dark:text-slate-100">🌙 Dark Mode</p><p className="text-sm text-slate-500 dark:text-slate-400">Easier on the eyes in low light.</p></div>
          <DarkModeToggle enabled={darkMode} onChange={setDarkMode} />
        </div>
      </section>
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Help</h2>
        <button onClick={onReplayTutorial} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 active:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:active:bg-slate-700">
          🔄 Replay Tutorial
        </button>
      </section>
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">About this App</h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">RA 10863 — Customs Modernization and Tariff Act. A study &amp; reading companion with search and highlights. Works fully offline.</p>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Version 1.0.0 (Offline)</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Developer</h2>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-white dark:bg-navy-700">O</div>
          <div className="min-w-0"><p className="font-semibold text-slate-800 dark:text-slate-100">Osias</p><p className="text-sm text-slate-500 dark:text-slate-400">App developer &amp; maintainer</p></div>
        </div>
        <a href="https://osiasnalaunan68-star.github.io/osias-personal-portfolio" target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600">🌐 View Developer Portfolio</a>
      </section>
    </div>
  );
}

function findNodeAndAncestors(node, targetNumber, ancestors = []) {
  if (node.node_number === targetNumber) return { found: true, ancestors };
  if (node.children) {
    for (const child of node.children) {
      const result = findNodeAndAncestors(child, targetNumber, [...ancestors, node.id]);
      if (result.found) return result;
    }
  }
  return { found: false };
}

function collectAllNodeIds(node, acc = []) {
  if (node.children && node.children.length > 0) {
    acc.push(node.id);
    for (const child of node.children) collectAllNodeIds(child, acc);
  } else if (node.content) {
    acc.push(node.id);
  }
  return acc;
}

export default function ChapterBrowser() {
  const [view, setView] = useState("browse");
  const [titles, setTitles] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTitleNumber, setSelectedTitleNumber] = useState(null);
  const [chapterTree, setChapterTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [mode, setMode] = useState(() => localStorage.getItem(MODE_KEY) || "study");
  const [fontScale, setFontScale] = useState(() => { const saved = parseFloat(localStorage.getItem(FONT_KEY)); return isNaN(saved) ? 1 : saved; });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(DARK_KEY) === "true");
  const [activeHighlightNodeId, setActiveHighlightNodeId] = useState(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState(new Set());
  const [scrollToNodeId, setScrollToNodeId] = useState(null);
  const [collapsedTitles, setCollapsedTitles] = useState({});
  const [studyCollapseSignal, setStudyCollapseSignal] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [resumeAvailable, setResumeAvailable] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const mainRef = useRef(null);
  const pendingScrollRestore = useRef(null);
  const scrollSaveTimeout = useRef(null);

  useEffect(() => localStorage.setItem(MODE_KEY, mode), [mode]);
  useEffect(() => localStorage.setItem(FONT_KEY, String(fontScale)), [fontScale]);
  useEffect(() => {
    localStorage.setItem(DARK_KEY, String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    getTitles()
      .then(setTitles)
      .catch((err) => {
        console.error("Failed to load titles:", err);
        setError(err.message);
      });
    const progress = getProgress();
    if (progress && progress.chapter_number) setResumeAvailable(progress);
    if (!hasTutorialBeenSeen()) {
      setShowTutorial(true);
    }
  }, []);

  const finishTutorial = useCallback(() => {
    markTutorialSeen();
    setShowTutorial(false);
  }, []);

  const replayTutorial = useCallback(() => {
    setShowTutorial(true);
  }, []);

  const loadChapter = useCallback(async (chapterNumber, titleNumber = null, focusSectionNumber = null) => {
    setLoading(true); setError(null);
    try {
      const data = await getChapter(chapterNumber, titleNumber);
      if (!data) throw new Error("Chapter not found");
      setChapterTree(data);
      setSelectedChapter(chapterNumber);
      setSelectedTitleNumber(titleNumber);
      setView("browse");
      setSidebarOpen(window.innerWidth >= 768);
      if (focusSectionNumber && data) {
        const { found, ancestors } = findNodeAndAncestors(data, focusSectionNumber);
        if (found) {
          setExpandedNodeIds(new Set(ancestors));
          let targetId = null;
          const walk = (node) => {
            if (node.node_number === focusSectionNumber && node.node_type === "section") { targetId = node.id; return true; }
            if (node.children) { for (const child of node.children) { if (walk(child)) return true; } }
            return false;
          };
          walk(data);
          setScrollToNodeId(targetId);
        }
      } else {
        setExpandedNodeIds(new Set());
        setScrollToNodeId(null);
      }
      if (pendingScrollRestore.current != null) {
        const targetScroll = pendingScrollRestore.current;
        pendingScrollRestore.current = null;
        setTimeout(() => { if (mainRef.current) mainRef.current.scrollTop = targetScroll; }, 180);
      } else if (mainRef.current) {
        mainRef.current.scrollTop = 0;
      }
    } catch (err) {
      setError(err.message);
      setChapterTree(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const resumeReading = useCallback(() => {
    if (!resumeAvailable) return;
    if (resumeAvailable.mode) setMode(resumeAvailable.mode);
    pendingScrollRestore.current = resumeAvailable.scrollTop || 0;
    loadChapter(resumeAvailable.chapter_number, resumeAvailable.title_number || null);
  }, [resumeAvailable, loadChapter]);

  useEffect(() => {
    if (!chapterTree || view !== "browse") return;
    const el = mainRef.current;
    if (!el) return;
    const persist = () => {
      saveProgress({
        title_number: selectedTitleNumber,
        chapter_number: selectedChapter,
        mode,
        scrollTop: el.scrollTop,
      });
    };
    const onScroll = () => {
      if (scrollSaveTimeout.current) clearTimeout(scrollSaveTimeout.current);
      scrollSaveTimeout.current = setTimeout(persist, 500);
    };
    persist();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (scrollSaveTimeout.current) clearTimeout(scrollSaveTimeout.current);
    };
  }, [chapterTree, selectedChapter, selectedTitleNumber, mode, view]);

  const toggleTitleCollapse = (key) => { setCollapsedTitles(prev => ({ ...prev, [key]: !prev[key] })); };
  
  const expandAllStudy = () => {
    if (!chapterTree) return;
    const ids = [];
    for (const section of chapterTree.children) collectAllNodeIds(section, ids);
    setExpandedNodeIds(new Set(ids));
  };
  
  const collapseAllStudy = () => {
    setExpandedNodeIds(new Set());
    setStudyCollapseSignal((v) => v + 1);
  };

  const handleCopyTemplate = async () => {
    if (!chapterTree) return;
    const payload = buildFullCopyPayload(chapterTree);
    try { await navigator.clipboard.writeText(payload); } catch {}
    alert("Copied! Master prompt + ID template + official CMTA source text — paste this straight into ChatGPT, Gemini, or Meta AI.");
  };
  
  const highlightUIValue = useMemo(() => ({ activeHighlightNodeId, setActiveHighlightNodeId }), [activeHighlightNodeId]);

  return (
    <HighlightUIContext.Provider value={highlightUIValue}>
      <div className="relative flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950" style={{ height: "100dvh" }}>
        {sidebarOpen && view === "browse" && <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] md:hidden" onClick={() => setSidebarOpen(false)} />}
        {view === "browse" && (
          <aside className={`safe-top fixed inset-y-0 left-0 z-40 w-[85vw] max-w-[320px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:static md:w-80 md:max-w-none md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex items-center gap-2"><span className="text-xl" aria-hidden>⚖️</span><div><h2 className="text-base font-bold leading-tight text-navy-900 dark:text-slate-50">RA 10863</h2><p className="text-xs text-slate-400 dark:text-slate-500">Customs Modernization &amp; Tariff Act</p></div></div>
            </div>
            <div className="p-3">
              {error && <p className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">{error}</p>}
              {titles.map((titleGroup) => {
                const key = titleGroup.title_number || "root";
                const collapsed = collapsedTitles[key];
                return (
                  <div key={key} className="mb-2">
                    <button onClick={() => toggleTitleCollapse(key)} className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-slate-50 dark:active:bg-slate-800">
                      <span className="text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-300">{titleGroup.title_number ? `Title ${titleGroup.title_number}` : titleGroup.title_title}</span>
                      <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">{collapsed ? "▸" : "▾"}</span>
                    </button>
                    {!collapsed && (
                      <ul className="ml-1 space-y-0.5 border-l border-slate-100 pl-2 dark:border-slate-800">
                        {titleGroup.chapters.map((ch) => {
                          const active = selectedChapter === ch.node_number && selectedTitleNumber === titleGroup.title_number;
                          return (
                            <li key={ch.id}>
                              <button onClick={() => loadChapter(ch.node_number, titleGroup.title_number)} className={`block min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${active ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700" : "text-slate-600 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800"}`}>
                                <span className="block truncate">Ch. {ch.node_number}: {ch.title}</span>
                                <span className={`text-xs ${active ? "text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>{ch.section_count} section{ch.section_count !== 1 ? "s" : ""}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="safe-top sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className={`flex items-center gap-1.5 px-2 transition-all duration-300 ${focusMode && mode === "reading" ? "max-h-0 overflow-hidden opacity-0 py-0" : "max-h-16 py-2 opacity-100"}`}>
              {view === "browse" && (
                <button onClick={() => setSidebarOpen((v) => !v)} className="flex h-9 w-9 flex-shrink-0 touch-manipulation items-center justify-center rounded-full text-lg text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800" aria-label="Toggle chapter list">
                  {sidebarOpen ? "✕" : "☰"}
                </button>
              )}
              <div className="flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800">
                <button onClick={() => setView("browse")} aria-label="Browse" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "browse" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                  <span aria-hidden>📚</span><span className="hidden sm:inline ml-1">Browse</span>
                </button>
                <button onClick={() => setView("search")} aria-label="Search" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "search" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                  <span aria-hidden>🔍</span><span className="hidden sm:inline ml-1">Search</span>
                </button>
                <button onClick={() => setView("settings")} aria-label="Settings" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "settings" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                  ⚙️
                </button>
                <button onClick={() => setView("dev")} aria-label="Dev Panel" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "dev" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                  🛠
                </button>
              </div>
              <span className="flex-1" />
              {view === "browse" && <ModeToggle mode={mode} setMode={setMode} />}
            </div>
            {view === "browse" && !(focusMode && mode === "reading") && (
              <div className="px-3 pb-2">
                <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {chapterTree ? chapterTree.title || `Chapter ${chapterTree.node_number}` : "Select a chapter"}
                </span>
              </div>
            )}
            {view === "browse" && mode === "reading" && (
              <div className="flex items-center justify-end gap-2 px-3 pb-2">
                <button onClick={() => setFocusMode((v) => !v)} className={`flex h-9 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors ${focusMode ? "border-navy-900 bg-navy-900 text-white dark:border-slate-200 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700"}`}>
                  🎯 <span className="hidden sm:inline">Focus</span>
                </button>
                <FontStepper fontScale={fontScale} setFontScale={setFontScale} />
              </div>
            )}
            {view === "browse" && mode === "reading" && chapterTree && <ReadingProgressBar containerRef={mainRef} />}
          </div>
          <main ref={mainRef} className="safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
            {error && (
              <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
                <p className="font-bold">⚠️ Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {view === "search" ? <SearchView onNavigateChapter={loadChapter} /> : view === "dev" ? <DevPanel /> : view === "settings" ? <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} onReplayTutorial={replayTutorial} /> : (
              <>
                {loading && (
                  <div className="mx-auto max-w-3xl space-y-3">
                    {[0,1,2].map(i => <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"/><div className="mt-3 h-3 w-full rounded bg-slate-100 dark:bg-slate-800"/><div className="mt-2 h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800"/></div>)}
                  </div>
                )}
                {!loading && !chapterTree && !error && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-400 dark:text-slate-600">
                    {resumeAvailable && (
                      <button onClick={resumeReading} className="mb-2 flex w-full max-w-sm items-center gap-3 rounded-2xl border border-navy-200 bg-white p-4 text-left shadow-card active:bg-slate-50 dark:border-navy-700 dark:bg-slate-900 dark:active:bg-slate-800">
                        <span className="text-2xl" aria-hidden>⏱️</span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-navy-900 dark:text-slate-100">Continue where you left off</span>
                          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                            {resumeAvailable.title_number ? `Title ${resumeAvailable.title_number} · ` : ""}Chapter {resumeAvailable.chapter_number}
                          </span>
                        </span>
                      </button>
                    )}
                    <span className="text-4xl">📖</span>
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-400">Select a chapter to start {mode === "reading" ? "reading" : "studying"}</p>
                    <p className="text-sm">Use the menu button or Search to find what you need.</p>
                  </div>
                )}
                {chapterTree && mode === "study" && (
                  <div className="mx-auto max-w-3xl">
                    {chapterTree.content && <p className="mb-4 rounded-xl bg-white p-4 text-base text-slate-600 shadow-card dark:bg-slate-900 dark:text-slate-300">{chapterTree.content}</p>}
                    <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
                      {IS_DEV && (
                        <button onClick={handleCopyTemplate} className="flex h-9 items-center gap-1.5 rounded-full border border-dashed border-amber-400 bg-amber-50 px-3 text-sm font-medium text-amber-700 active:bg-amber-100 dark:border-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
                          <span aria-hidden>🛠</span> Copy ID Template
                        </button>
                      )}
                      <button onClick={expandAllStudy} className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700">
                        <span aria-hidden>⤢</span> Expand All
                      </button>
                      <button onClick={collapseAllStudy} className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700">
                        <span aria-hidden>⤡</span> Collapse All
                      </button>
                    </div>
                    <div className="space-y-1">{chapterTree.children.map((section) => <StudyNodeRenderer key={section.id} node={section} level={0} expandedSet={expandedNodeIds} scrollToId={scrollToNodeId} collapseSignal={studyCollapseSignal} />)}</div>
                  </div>
                )}
                {chapterTree && mode === "reading" && (
                  <div className={`mx-auto transition-all duration-300 ${focusMode ? "max-w-[62ch]" : "max-w-[70ch]"}`}>
                    {chapterTree.content && <p className="mb-4 font-serif text-slate-700 dark:text-slate-300" style={{ fontSize: `${1.05 * fontScale}rem` }}>{chapterTree.content}</p>}
                    {chapterTree.children.map((section) => <ReadingNodeRenderer key={section.id} node={section} level={0} fontScale={fontScale} expandedSet={expandedNodeIds} scrollToId={scrollToNodeId} />)}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
        {focusMode && mode === "reading" && chapterTree && (
          <button
            onClick={() => setFocusMode(false)}
            className="fixed bottom-6 right-4 z-30 flex items-center gap-1.5 rounded-full bg-navy-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur active:bg-navy-800 dark:bg-slate-100/90 dark:text-navy-900"
          >
            <span aria-hidden>✕</span> Exit Focus
          </button>
        )}
        {showTutorial && <TutorialOverlay onFinish={finishTutorial} />}
      </div>
    </HighlightUIContext.Provider>
  );
}
```

## File: `./frontend/src/pages/DevPanel.jsx`
```jsx
import { useState, useEffect, useCallback } from "react";
import {
  getAllBatches, getBatchEntries, importChapterJson, renameBatch,
  updateEntry, deleteEntry, deleteBatch,
  getExportAllJson, saveRawEntries, clearAllImports, getImportedCount,
} from "../devImportStore";

function EntryEditForm({ entry, onSave, onCancel }) {
  const [title, setTitle] = useState(entry.title || "");
  const [content, setContent] = useState(entry.content || "");
  const [prompt, setPrompt] = useState(entry.prompt || "");
  const save = () => onSave({ title, content, prompt });
  return (
    <div className="mt-2 space-y-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-800 dark:bg-amber-950/20">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={{ fontSize: "16px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" rows={6} style={{ fontSize: "16px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Prompt" rows={3} style={{ fontSize: "16px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400">Cancel</button>
        <button onClick={save} className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white">Save</button>
      </div>
    </div>
  );
}

function EntryRow({ nodeId, entry, onChanged }) {
  const [editing, setEditing] = useState(false);
  const label = entry._label || entry.title || nodeId;
  const handleSave = (fields) => { updateEntry(nodeId, fields); setEditing(false); onChanged(); };
  const handleDelete = () => { if (confirm(`Delete entry id ${nodeId}?`)) { deleteEntry(nodeId); onChanged(); } };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">#{nodeId} — {label}</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">{(entry.content || "").slice(0, 70)}...</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={() => setEditing((v) => !v)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">Edit</button>
          <button onClick={handleDelete} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">Delete</button>
        </div>
      </div>
      {editing && <EntryEditForm entry={entry} onSave={handleSave} onCancel={() => setEditing(false)} />}
    </div>
  );
}

function BatchCard({ batch, onChanged }) {
  const [open, setOpen] = useState(false);
  const entries = open ? getBatchEntries(batch.id) : [];
  const handleDeleteBatch = () => {
    if (confirm(`Delete the whole "${batch.label}" batch (${batch.nodeIds.length} entries)?`)) {
      deleteBatch(batch.id);
      onChanged();
    }
  };
  const handleRename = () => {
    const next = prompt("Rename this chapter label:", batch.label);
    if (next !== null) { renameBatch(batch.id, next); onChanged(); }
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{open ? "▾" : "▸"} {batch.label}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{batch.nodeIds.length} entries · {new Date(batch.importedAt).toLocaleString()}</p>
        </button>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={handleRename} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">✏️</button>
          <button onClick={handleDeleteBatch} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">Delete</button>
        </div>
      </div>
      {open && (
        <div className="mt-3 space-y-2">
          {entries.map((e) => <EntryRow key={e.id} nodeId={e.id} entry={e} onChanged={onChanged} />)}
        </div>
      )}
    </div>
  );
}

function ImportForm({ onImported }) {
  const [json, setJson] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleImport = () => {
    setError(null); setSuccess(null);
    try {
      const { count, label } = importChapterJson(json);
      setSuccess(`✓ Na-import ang ${count} entries bilang "${label}".`);
      setJson("");
      onImported();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-3 shadow-card dark:border-navy-700 dark:bg-slate-800">
      <p className="mb-1 text-sm font-semibold text-navy-900 dark:text-slate-100">📥 Import AI Context JSON</p>
      <p className="mb-2 text-xs text-slate-400 dark:text-slate-500">I-paste lang at Import — isang bagsakan. Optional: maglagay ng "_chapter" key sa JSON para may custom label.</p>
      <textarea value={json} onChange={(e) => setJson(e.target.value)} placeholder='{ "_chapter": "Chapter 1", "393": {...}, "193": {...} }' rows={9} style={{ fontSize: "16px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}
      <button onClick={handleImport} disabled={!json.trim()} className="mt-2 w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">Import</button>
    </div>
  );
}

function RawJsonEditor({ onChanged }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const openEditor = () => { setText(getExportAllJson()); setOpen(true); setError(null); };
  const handleSave = () => {
    try {
      saveRawEntries(text);
      setError(null); setSaved(true);
      onChanged();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <button onClick={() => (open ? setOpen(false) : openEditor())} className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        🔧 {open ? "Hide" : "Edit"} Raw JSON (advanced, buong imported data)
      </button>
      {open && (
        <div className="mt-2">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} style={{ fontSize: "13px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          {saved && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">✓ Saved.</p>}
          <button onClick={handleSave} className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white">Save Raw JSON</button>
        </div>
      )}
    </div>
  );
}

export default function DevPanel() {
  const [batches, setBatches] = useState([]);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(() => setBatches(getAllBatches()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const handleExportAll = async () => {
    try { await navigator.clipboard.writeText(getExportAllJson()); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClearAll = () => {
    if (confirm(`Delete ALL ${getImportedCount()} imported entries? Hindi na ito mababawi.`)) {
      clearAllImports();
      refresh();
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">🛠 Dev Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Import at pamahalaan ang AI-generated context. Naka-save ito sa device kahit tanggalin mo pa itong tab.</p>
      </div>
      <ImportForm onImported={refresh} />
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">📦 Buong Imported JSON ({getImportedCount()} entries)</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportAll} className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">📋 Export All (copy)</button>
          <button onClick={handleClearAll} className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 dark:border-red-800 dark:text-red-400">🗑 Delete All</button>
        </div>
        {copied && <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Na-copy! I-paste sa frontend/src/data/aiContext.json para permanente sa lahat ng users.</p>}
      </div>
      <RawJsonEditor onChanged={refresh} />
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Imported Chapters</p>
        {batches.length === 0 && <p className="text-sm italic text-slate-400 dark:text-slate-600">Wala pang na-import.</p>}
        {batches.map((b) => <BatchCard key={b.id} batch={b} onChanged={refresh} />)}
      </div>
    </div>
  );
}
```

## File: `./frontend/src/data/aiContext.json`
```json
{
  "_example_do_not_use": {
    "title": "How to fill this in",
    "content": "Delete this entry. Real entries are keyed by the node's numeric id (as text), e.g. \"42\". Run the app with npm run dev, open a chapter, and tap the amber 'Copy ID Template' button to get the ids for that chapter pre-filled.",
    "prompt": "Not used."
  }
}
```

## File: `./frontend/src/aiContext.js`
```javascript
import aiContextData from "./data/aiContext.json";
import { getImportedEntry } from "./devImportStore";

// Osias 6.7 — bundled AI explanations, shipped fully offline with the app.
// Lookup order: (1) npm-run-dev preview [dev only], (2) permanently imported
// via the Dev Panel [localStorage, works even after Dev Panel is deleted],
// (3) the committed aiContext.json bundled at build time.

const DEV_PREVIEW_KEY = "customsLaw_aiContextDevPreview";
export const IS_DEV = import.meta.env.DEV;

function readDevPreview() {
  if (!IS_DEV) return {};
  try {
    return JSON.parse(localStorage.getItem(DEV_PREVIEW_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getAiContext(nodeId) {
  const key = String(nodeId);
  if (IS_DEV) {
    const preview = readDevPreview();
    if (preview[key]) return preview[key];
  }
  const imported = getImportedEntry(key);
  if (imported) return imported;
  return aiContextData[key] || null;
}

export function saveDevPreviewBatch(jsonText) {
  if (!IS_DEV) throw new Error("Preview is only available in npm run dev");
  const parsed = JSON.parse(jsonText);
  const merged = { ...readDevPreview(), ...parsed };
  localStorage.setItem(DEV_PREVIEW_KEY, JSON.stringify(merged));
  return merged;
}

export function clearDevPreview() {
  if (!IS_DEV) return;
  localStorage.removeItem(DEV_PREVIEW_KEY);
}

export function getDevPreviewRaw() {
  if (!IS_DEV) return "{}";
  return JSON.stringify(readDevPreview(), null, 2);
}

export const MASTER_PROMPT = `🧠 MASTER CONTENT GENERATION PROMPT
You are an expert Customs Broker, CMTA legal educator, instructional designer, and content writer for AHTN Navigator.
Your task is to generate a pre-written Study Guide for each Definition, Section, Chapter, or Provision of Republic Act No. 10863 (CMTA).
The Study Guide will be stored permanently in the application's database. It is NOT AI-generated at runtime. Every response must be written as if it were created by an experienced Customs law professor.

SOURCE OF TRUTH
The official text from the provided JSON file is the only legal source.
Never modify the official law. Never rewrite the official law. Never omit important legal meaning.
Never invent legal requirements. Never fabricate court cases or legal interpretations.
If additional information is unavailable, clearly state that instead of guessing.

TARGET AUDIENCE
Write for: First-year BSCA students, Customs Broker reviewees, and professionals who want a simple explanation.
The reader should feel like a professor is explaining the topic in plain language.

LANGUAGE
Primary language: Tagalog. Keep important legal terms in English when appropriate.
Use simple, conversational Tagalog. Avoid deep legal jargon unless you immediately explain it.

WRITING STYLE
The explanation should feel like a mentor talking to a student.
Do NOT sound like ChatGPT. Do NOT sound robotic. Do NOT simply repeat the law.
Instead: Explain. Teach. Simplify. Give context. Build understanding.

REQUIRED FORMAT
Generate the following sections in this exact order.

📖 Kahulugan
Start with a one-paragraph explanation in very simple Tagalog. The reader should immediately understand what the topic means.

🔍 Breakdown
Break the provision into its important parts. Explain each keyword separately (e.g. Imported Goods, Free Zone, Directly or Through Transit). Explain why each one matters.

💡 Simpleng Paliwanag
Pretend you're explaining the topic to your classmate one day before the exam. Avoid legal wording. Make it easy to remember.

📦 Halimbawa
Create one realistic Customs scenario. Use situations involving imports, exports, airport, seaport, customs officers, customs brokers, warehouses, PEZA, Clark, Subic, Free Zones. The example must directly relate to the law.

⭐ Bakit Mahalaga Ito?
Explain why the provision exists. Why should Customs students understand it? How is it applied in real life?

⚠️ Dapat Tandaan
List the most important reminders. Mention common misunderstandings if applicable.

🎯 Board Exam Tip
Give review advice. Help students remember the concept. Mention common board exam traps if appropriate. Never invent actual board exam questions.

❓ Madalas Malito ang Students
Write one realistic question students usually ask. Then answer it clearly.

🔗 Related Topics
List related Sections, Definitions, Chapters, Customs concepts, and Related laws (only if officially relevant).

🤖 Need More Explanation?
Generate a high-quality prompt that users can send to external AI. The prompt must ask the AI to: explain the topic simply, give practical Customs examples, explain why the law exists, mention related provisions, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions. This prompt will be automatically copied to the user's clipboard before opening Meta AI, ChatGPT, or Gemini.

IMPORTANT RULES
Every explanation must: preserve the legal meaning, never contradict CMTA, never hallucinate, never make assumptions, never create fake cases, never use unnecessary filler words, be educational, be easy to understand, and be consistent across the entire app.
The user should feel that every Study Guide was written by the same experienced Customs law professor.

For each id below, output valid JSON matching the ID TEMPLATE structure, filling in "title", "content", and "prompt" using the OFFICIAL CMTA SOURCE TEXT provided for that same id as your only source of truth.`;

function nodeLabel(node) {
  const type = node.node_type;
  const num = node.node_number || "";
  if (type === "chapter") return `Chapter ${num}`.trim();
  if (type === "section") return `Sec. ${num}`.trim();
  if (type === "title") return `Title ${num}`.trim();
  return `${type} ${num}`.trim();
}

export function buildTemplateForChapter(chapterTree) {
  const out = {};
  function walk(node) {
    if (node.content) {
      out[node.id] = {
        _label: `${node.node_type} ${node.node_number || ""} — ${(node.title || "").slice(0, 60)}`,
        title: "",
        content: "",
        prompt: "",
      };
    }
    (node.children || []).forEach(walk);
  }
  walk(chapterTree);
  return JSON.stringify(out, null, 2);
}

export function buildTopicTextForChapter(chapterTree) {
  const blocks = [];
  function walk(node) {
    if (node.content) {
      const lines = [`topic: [${node.id}]`, nodeLabel(node)];
      if (node.title) lines.push(node.title);
      lines.push(node.content);
      if (node.cross_references && node.cross_references.length) {
        lines.push("See Also");
        node.cross_references.forEach((ref) => {
          lines.push(ref.url ? `${ref.text} (${ref.url})` : ref.text);
        });
      }
      blocks.push(lines.join("\n"));
    }
    (node.children || []).forEach(walk);
  }
  walk(chapterTree);
  return blocks.join("\n\n");
}

export function buildFullCopyPayload(chapterTree) {
  const idTemplate = buildTemplateForChapter(chapterTree);
  const topics = buildTopicTextForChapter(chapterTree);
  return [
    MASTER_PROMPT,
    "",
    "🧩 ID TEMPLATE — fill title/content/prompt for each id below:",
    idTemplate,
    "",
    "📚 OFFICIAL CMTA SOURCE TEXT (per id, your only source of truth):",
    topics,
  ].join("\n");
}

export const AI_APPS = [
  { id: "meta", label: "Meta AI", icon: "💬", url: "https://m.me/MetaAI" },
  { id: "chatgpt", label: "ChatGPT", icon: "🟢", url: "https://chatgpt.com/" },
  { id: "gemini", label: "Gemini", icon: "✨", url: "https://gemini.google.com/app" },
];

export async function copyPromptAndOpen(prompt, appUrl) {
  try {
    await navigator.clipboard.writeText(prompt);
  } catch {
    // Clipboard can silently fail on some Android WebViews.
  }
  window.open(appUrl, "_blank", "noopener,noreferrer");
}
```

## File: `./frontend/src/devImportStore.js`
```javascript
// Dev Panel storage: lets Osias paste AI-generated JSON (per chapter) and
// have it saved permanently in localStorage — independent of IS_DEV, and
// independent of whether the Dev Panel UI itself still exists in the code.
// getAiContext() in aiContext.js reads from here so imported entries keep
// working even after the Dev Panel tab is deleted from the app later.
//
// Chapter label: optional. Add a top-level "_chapter" key in the pasted
// JSON (e.g. { "_chapter": "Chapter 1", "393": {...} }) to name the batch
// in one paste. Skip it and a timestamp label is auto-assigned instead —
// rename anytime from the batch list.

const STORE_KEY = "customsLaw_aiContextImports";

function emptyStore() {
  return { batches: {}, entries: {} };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return {
      batches: parsed.batches || {},
      entries: parsed.entries || {},
    };
  } catch {
    return emptyStore();
  }
}

function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function getImportedEntry(nodeId) {
  const store = loadStore();
  return store.entries[String(nodeId)] || null;
}

export function getAllBatches() {
  const store = loadStore();
  return Object.values(store.batches).sort((a, b) =>
    b.importedAt.localeCompare(a.importedAt)
  );
}

export function getBatchEntries(batchId) {
  const store = loadStore();
  const batch = store.batches[batchId];
  if (!batch) return [];
  return batch.nodeIds.map((id) => ({ id, ...(store.entries[id] || {}) }));
}

export function importChapterJson(jsonText) {
  const parsed = JSON.parse(jsonText);
  const rawLabel = parsed._chapter;
  if (parsed._chapter !== undefined) delete parsed._chapter;
  const ids = Object.keys(parsed);
  if (!ids.length) throw new Error("Walang laman ang JSON na na-paste.");
  const store = loadStore();
  for (const bId in store.batches) {
    store.batches[bId].nodeIds = store.batches[bId].nodeIds.filter(
      (id) => !ids.includes(id)
    );
  }
  for (const bId in store.batches) {
    if (store.batches[bId].nodeIds.length === 0) delete store.batches[bId];
  }
  const batchId = `b_${Date.now()}`;
  const fallback = `Import – ${new Date().toLocaleString("en-PH", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  })}`;
  const label = (rawLabel && String(rawLabel).trim()) || fallback;
  store.batches[batchId] = {
    id: batchId,
    label,
    importedAt: new Date().toISOString(),
    nodeIds: ids,
  };
  for (const id of ids) store.entries[id] = parsed[id];
  saveStore(store);
  return { batchId, count: ids.length, label };
}

export function renameBatch(batchId, newLabel) {
  const store = loadStore();
  if (!store.batches[batchId]) return;
  const trimmed = newLabel.trim();
  if (trimmed) store.batches[batchId].label = trimmed;
  saveStore(store);
}

export function updateEntry(nodeId, fields) {
  const store = loadStore();
  if (!store.entries[nodeId]) return;
  store.entries[nodeId] = { ...store.entries[nodeId], ...fields };
  saveStore(store);
}

export function deleteEntry(nodeId) {
  const store = loadStore();
  delete store.entries[nodeId];
  for (const bId in store.batches) {
    store.batches[bId].nodeIds = store.batches[bId].nodeIds.filter(
      (id) => id !== nodeId
    );
    if (store.batches[bId].nodeIds.length === 0) delete store.batches[bId];
  }
  saveStore(store);
}

export function deleteBatch(batchId) {
  const store = loadStore();
  const batch = store.batches[batchId];
  if (!batch) return;
  for (const id of batch.nodeIds) delete store.entries[id];
  delete store.batches[batchId];
  saveStore(store);
}

export function getExportAllJson() {
  const store = loadStore();
  return JSON.stringify(store.entries, null, 2);
}

export function saveRawEntries(jsonText) {
  const parsed = JSON.parse(jsonText);
  const store = loadStore();
  const newIds = Object.keys(parsed);
  for (const bId in store.batches) {
    store.batches[bId].nodeIds = store.batches[bId].nodeIds.filter((id) =>
      newIds.includes(id)
    );
    if (store.batches[bId].nodeIds.length === 0) delete store.batches[bId];
  }
  store.entries = parsed;
  saveStore(store);
}

export function clearAllImports() {
  saveStore(emptyStore());
}

export function getImportedCount() {
  return Object.keys(loadStore().entries).length;
}
```

## File: `./frontend/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## File: `./frontend/vite.config.js`
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
```

## File: `./sh.sh`
```bash
#!/bin/bash
# Output all code files as Markdown with language hints

OUTPUT="all_files.md"
> "$OUTPUT"  # Clear or create file

# List of file extensions to include (text-based code)
extensions=(
    "*.py" "*.js" "*.jsx" "*.ts" "*.tsx"
    "*.css" "*.scss" "*.html"
    "*.json" "*.yaml" "*.yml" "*.toml"
    "*.md" "*.txt"
    "*.sh" "*.bash"
    "*.sql"
    "*.xml" "*.xsd"
    "*.conf" "*.config" "*.ini"
)

# Build find command
find_cmd="find . -type f \( "
first=true
for ext in "${extensions[@]}"; do
    if [ "$first" = true ]; then
        find_cmd+="-name \"$ext\""
        first=false
    else
        find_cmd+=" -o -name \"$ext\""
    fi
done
find_cmd+=" \)"

# Exclude directories
exclude_dirs=(
    "*/node_modules/*"
    "*/__pycache__/*"
    "*/venv/*"
    "*/env/*"
    "*/docs/assets/*"
    "*/docs/icons/*"
    "*/.git/*"
    "*/dist/*"
    "*/build/*"
)
for dir in "${exclude_dirs[@]}"; do
    find_cmd+=" -not -path \"$dir\""
done

# Exclude specific files
find_cmd+=" -not -name \"package-lock.json\""
find_cmd+=" -not -name \"yarn.lock\""
find_cmd+=" -not -name \"*.db\""
find_cmd+=" -not -name \"*.wasm\""
find_cmd+=" -not -name \"*.png\""
find_cmd+=" -not -name \"*.jpg\""
find_cmd+=" -not -name \"*.jpeg\""
find_cmd+=" -not -name \"*.gif\""
find_cmd+=" -not -name \"*.ico\""
find_cmd+=" -not -name \"*.svg\""

# Process each file
eval $find_cmd | while read -r file; do
    # Determine language for code block based on extension
    lang="${file##*.}"
    case "$lang" in
        py) lang="python" ;;
        js) lang="javascript" ;;
        jsx) lang="jsx" ;;
        ts) lang="typescript" ;;
        tsx) lang="tsx" ;;
        css) lang="css" ;;
        scss) lang="scss" ;;
        html) lang="html" ;;
        json) lang="json" ;;
        yaml|yml) lang="yaml" ;;
        toml) lang="toml" ;;
        md) lang="markdown" ;;
        sh|bash) lang="bash" ;;
        sql) lang="sql" ;;
        xml) lang="xml" ;;
        conf|config|ini) lang="ini" ;;
        *) lang="" ;;
    esac

    # Write to markdown
    echo "## File: \`$file\`" >> "$OUTPUT"
    echo '```'"$lang" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
    echo '```' >> "$OUTPUT"
    echo >> "$OUTPUT"
done

echo "Done! Output written to $OUTPUT"
```

