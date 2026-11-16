import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Unique ID per build. The app compares its own ID with /version.json
// on the server to know if a newer version was deployed.
const BUILD_ID = String(Date.now());

function emitVersionFile() {
  return {
    name: 'emit-version-json',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ id: BUILD_ID }) });
    },
  };
}

// Gumagawa ng precache.json (listahan ng LAHAT ng files sa build) at nilalagay ang
// build id sa sw.js, para laging na-iinstall ulit ang service worker kada deploy.
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
        fs.writeFileSync(swPath, fs.readFileSync(swPath, 'utf8').replace(/__BUILD_ID__/g, BUILD_ID));
      }
    },
  };
}

export default defineConfig({
  base: './',
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [react(), emitVersionFile(), precachePlugin()],
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
});
