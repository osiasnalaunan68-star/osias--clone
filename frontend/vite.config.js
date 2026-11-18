import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// Unique ID per build. The app compares its own ID with /version.json
// on the server to know if a newer version was deployed.
const BUILD_ID = String(Date.now());

// Hash ng laman ng public/customs_law.db. Nagbabago lang kapag nagbago ang DB,
// kaya awtomatikong nare-refresh ang offline copy (walang manual na bump).
const DB_FILE = path.join(HERE, 'public', 'customs_law.db');
const DB_HASH = fs.existsSync(DB_FILE)
  ? crypto.createHash('sha1').update(fs.readFileSync(DB_FILE)).digest('hex').slice(0, 10)
  : 'nodb';

function emitVersionFile() {
  return {
    name: 'emit-version-json',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ id: BUILD_ID }) });
    },
  };
}

// Gumagawa ng precache.json (listahan ng LAHAT ng files sa build) at nilalagay ang
// build id at db hash sa sw.js, para laging na-iinstall ulit ang service worker kada deploy.
function precachePlugin() {
  let outDir;
  return {
    name: 'precache-manifest',
    apply: 'build',
    configResolved(c) { outDir = path.resolve(c.root, c.build.outDir); },
    closeBundle() {
      const skip = new Set(['sw.js', 'version.json', 'precache.json', '404.html']);
      const files = [];
      (function walk(dir, rel) {
        for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
          const r = rel ? rel + '/' + e.name : e.name;
          if (e.isDirectory()) walk(path.join(dir, e.name), r);
          else if (!skip.has(r) && !r.endsWith('.map') && !e.name.startsWith('.')) files.push(r);
        }
      })(outDir, '');
      fs.writeFileSync(path.join(outDir, 'precache.json'), JSON.stringify({ id: BUILD_ID, files: ['./', ...files] }));
      const swPath = path.join(outDir, 'sw.js');
      if (fs.existsSync(swPath)) {
        fs.writeFileSync(
          swPath,
          fs.readFileSync(swPath, 'utf8').replace(/__BUILD_ID__/g, BUILD_ID).replace(/__DB_HASH__/g, DB_HASH)
        );
      }
    },
  };
}

export default defineConfig({
  base: './',
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID), __DB_HASH__: JSON.stringify(DB_HASH) },
  plugins: [react(), emitVersionFile(), precachePlugin()],
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
});
