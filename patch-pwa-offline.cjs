// patch-pwa-offline.js — i-precache LAHAT ng files para gumana ang PWA offline
const fs = require("fs");

const VITE = "frontend/vite.config.js";
const SW = "frontend/public/sw.js";

function must(cond, msg) {
  if (!cond) { console.error("\n❌ PATCH FAILED: " + msg + "\n   (walang binago)"); process.exit(1); }
}
function once(src, from, to, label) {
  const parts = src.split(from);
  must(parts.length === 2, label + " — anchor found " + (parts.length - 1) + "x (dapat 1x)");
  return parts.join(to);
}
must(fs.existsSync(VITE) && fs.existsSync(SW), "Hindi makita ang frontend/. I-run sa project root.");

let vite = fs.readFileSync(VITE, "utf8");
let sw = fs.readFileSync(SW, "utf8");
must(!vite.includes("precachePlugin") && !sw.includes("precacheAll"), "Na-patch na yata ito.");

// ───────── vite.config.js ─────────
vite = once(vite, "import react from '@vitejs/plugin-react';\n",
  "import react from '@vitejs/plugin-react';\nimport fs from 'fs';\nimport path from 'path';\n", "vite imports");

const PLUGIN = `// Gumagawa ng precache.json (listahan ng LAHAT ng files sa build) at nilalagay ang
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

`;
vite = once(vite, "export default defineConfig({", PLUGIN + "export default defineConfig({", "plugin");
vite = once(vite, "plugins: [react(), emitVersionFile()],", "plugins: [react(), emitVersionFile(), precachePlugin()],", "plugins list");

// ───────── sw.js ─────────
sw = once(sw, "const NETWORK_TIMEOUT_MS = 4000;\n", `const NETWORK_TIMEOUT_MS = 4000;
// Pinapalitan ng vite build ng unique id -> nagbabago ang sw.js kada deploy -> uulit ang precache.
const SW_BUILD = "__BUILD_ID__";

// I-download ang LAHAT ng files ng app (galing sa precache.json) para offline-ready agad.
async function precacheAll() {
  const scope = self.registration.scope;
  if (/^https?:\\/\\/localhost(:\\d+)?\\//.test(scope)) return; // APK / dev: bundled na
  try {
    const res = await fetch(new URL("precache.json", scope), { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const cache = await caches.open(CACHE_NAME);
    const files = data.files || [];
    const one = async (f) => {
      const url = new URL(f, scope).href;
      const big = f.includes("assets/") || /\\.(wasm|db)$/.test(f);
      if (big && (await cache.match(url))) return; // hashed/malaki: nandito na
      try {
        const r = await fetch(url, { cache: "no-cache" });
        if (r.ok && !isHtmlForAsset({ url }, r)) await cache.put(url, r);
      } catch (_) {}
    };
    for (let i = 0; i < files.length; i += 6) await Promise.all(files.slice(i, i + 6).map(one));
  } catch (_) {}
}
`, "sw header");

sw = once(sw, `self.addEventListener("install", () => {
  self.skipWaiting();
});`, `self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(precacheAll());
});`, "install");

sw = once(sw, `async function offlineFallback(request) {
  const cached = await caches.match(request);`, `async function offlineFallback(request) {
  const cached = await caches.match(request, { ignoreSearch: true });`, "offlineFallback");

sw = once(sw, "const shell = await caches.match(self.registration.scope);",
  "const shell = (await caches.match(self.registration.scope)) || (await caches.match(self.registration.scope + \"index.html\"));", "shell");

fs.writeFileSync(VITE, vite);
fs.writeFileSync(SW, sw);
console.log("✅ vite.config.js — precache.json + build id sa sw.js");
console.log("✅ sw.js — precache lahat ng files sa install");
