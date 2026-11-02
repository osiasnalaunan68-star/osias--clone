const fs = require("fs");
const path = require("path");

const root = fs.existsSync("frontend/src/pages/ChapterBrowser.jsx") ? "frontend"
  : fs.existsSync("src/pages/ChapterBrowser.jsx") ? "." : null;
if (!root) { console.error("❌ Hindi makita ang frontend. I-run sa project root."); process.exit(1); }
const P = (...a) => path.join(root, ...a);

if (fs.existsSync(P("src", "updateCheck.js"))) {
  console.log("ℹ️ Na-patch na ito dati. Walang binago.");
  process.exit(0);
}

function fail(m) { console.error("❌ " + m + " (walang binago)"); process.exit(1); }
function read(p) { if (!fs.existsSync(p)) fail("Hindi makita ang file: " + p); return fs.readFileSync(p, "utf8"); }
function swap(src, find, repl, label) {
  const i = src.indexOf(find);
  if (i === -1) fail("Hindi makita ang anchor: " + label);
  if (src.indexOf(find, i + 1) !== -1) fail("Higit sa 1 match: " + label);
  return src.slice(0, i) + repl + src.slice(i + find.length);
}
function swapRange(src, startMarker, endMarker, repl, label) {
  const s = src.indexOf(startMarker);
  if (s === -1) fail("Hindi makita (start): " + label);
  if (src.indexOf(startMarker, s + 1) !== -1) fail("Higit sa 1 match (start): " + label);
  const e = src.indexOf(endMarker, s);
  if (e === -1) fail("Hindi makita (end): " + label);
  return src.slice(0, s) + repl + src.slice(e);
}

// ───────── read lahat muna (kapag may mali, walang masusulat) ─────────
const swPath = P("public", "sw.js");
const vitePath = P("vite.config.js");
const gatePath = P("src", "components", "AccessGate.jsx");
const installPath = P("src", "pages", "InstallView.jsx");
const cbPath = P("src", "pages", "ChapterBrowser.jsx");

let sw = read(swPath);
let gate = read(gatePath);
let install = read(installPath);
let cb = read(cbPath);
read(vitePath);

// ───────── 1) vite.config.js (overwrite, may backup) ─────────
const viteNew = String.raw`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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

export default defineConfig({
  base: './',
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [react(), emitVersionFile()],
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
});
`;

// ───────── 2) src/updateCheck.js (bagong file) ─────────
const updateCheck = String.raw`// Detects when a newer build was deployed (compares __BUILD_ID__ with /version.json).
import { useEffect, useState } from "react";
import { isNativeApp } from "./pwaInstall";

/* global __BUILD_ID__ */
export const BUILD_ID = typeof __BUILD_ID__ !== "undefined" ? __BUILD_ID__ : "dev";

let remoteId = null;
let lastCheck = 0;
let inflight = null;
const subs = new Set();
const notify = () => subs.forEach((f) => f());

export function getRemoteId() { return remoteId; }
export function isUpdateAvailable() { return !!remoteId && remoteId !== BUILD_ID; }

async function fetchRemoteId() {
  try {
    const res = await fetch(import.meta.env.BASE_URL + "version.json?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.id ? String(data.id) : null;
  } catch (_) {
    return null;
  }
}

// force = true ignores the 60-second throttle.
export function checkForUpdate(force) {
  if (import.meta.env.DEV || isNativeApp()) return Promise.resolve(false);
  if (inflight) return inflight;
  if (!force && Date.now() - lastCheck < 60000) return Promise.resolve(isUpdateAvailable());
  inflight = fetchRemoteId().then((id) => {
    lastCheck = Date.now();
    inflight = null;
    if (id) { remoteId = id; notify(); }
    return isUpdateAvailable();
  });
  return inflight;
}

// Removes the stale page files (index.html etc.) but keeps the big offline
// files (/assets/, .wasm, .db, fonts), then reloads. Needs internet.
export async function applyUpdate() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      for (const k of keys) {
        const cache = await caches.open(k);
        const reqs = await cache.keys();
        await Promise.all(reqs.map((r) => {
          const u = new URL(r.url);
          const keep = u.origin !== location.origin || u.pathname.includes("/assets/") || /\.(wasm|db)$/.test(u.pathname);
          return keep ? null : cache.delete(r);
        }));
      }
    }
  } catch (_) {}
  try {
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : null;
    if (reg) await reg.update();
  } catch (_) {}
  location.reload();
  return true;
}

export function useUpdateAvailable() {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((n) => n + 1);
    subs.add(f);
    checkForUpdate(false);
    return () => { subs.delete(f); };
  }, []);
  return isUpdateAvailable();
}

// Re-check when the app opens, comes back to the front, or gets internet again.
if (typeof window !== "undefined") {
  const recheck = () => { if (document.visibilityState !== "hidden") checkForUpdate(false); };
  document.addEventListener("visibilitychange", recheck);
  window.addEventListener("online", recheck);
  window.addEventListener("focus", recheck);
  setInterval(recheck, 30 * 60 * 1000);
  setTimeout(recheck, 1500);
}
`;

// ───────── 3) sw.js ─────────
sw = swap(sw, "function fetchAndCache(request) {", "function fetchAndCache(request, init) {", "sw fetchAndCache signature");
sw = swap(sw, "return fetch(request).then((response) => {", "return fetch(request, init).then((response) => {", "sw fetch call");
sw = swap(
  sw,
  "  const sameOrigin = url.origin === self.location.origin;",
  '  const sameOrigin = url.origin === self.location.origin;\n  if (sameOrigin && url.pathname.endsWith("/version.json")) return; // always straight to the network',
  "sw version.json bypass"
);
sw = swap(
  sw,
  "const network = fetchAndCache(request);",
  'const network = fetchAndCache(request, { cache: "no-cache" }); // skip the 10-min HTTP cache of GitHub Pages',
  "sw network-first no-cache"
);

// ───────── 4) AccessGate.jsx (banner) ─────────
gate = swap(
  gate,
  'import { PROMO_PLAN } from "../payments";',
  'import { PROMO_PLAN } from "../payments";\nimport { useUpdateAvailable, getRemoteId, applyUpdate } from "../updateCheck";',
  "AccessGate import"
);

const banner = String.raw`// ── "New version available" banner (dismissible, comes back next app open) ──
function UpdateBanner() {
  const available = useUpdateAvailable();
  const [busy, setBusy] = useState(false);
  const [, setTick] = useState(0);
  if (!available) return null;
  const KEY = "cuble_update_dismiss";
  let dismissed = false;
  try { dismissed = sessionStorage.getItem(KEY) === getRemoteId(); } catch (_) {}
  if (dismissed) return null;
  const hide = () => { try { sessionStorage.setItem(KEY, String(getRemoteId())); } catch (_) {} setTick((n) => n + 1); };
  const go = async () => { setBusy(true); const ok = await applyUpdate(); if (!ok) setBusy(false); };
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[65] flex justify-center px-3" style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}>
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-2 rounded-2xl border border-gold-500 bg-navy-900 py-2 pl-4 pr-2 text-white shadow-xl dark:bg-slate-800">
        <span className="min-w-0 flex-1 text-xs font-semibold leading-snug">🆕 New version available. Update to get the latest fixes.</span>
        <button onClick={go} disabled={busy} className="flex-shrink-0 rounded-full bg-gold-500 px-3 py-1.5 text-xs font-bold text-navy-900 active:bg-gold-600 disabled:opacity-60">{busy ? "Updating…" : "Update now"}</button>
        <button onClick={hide} aria-label="Dismiss" className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm opacity-70 active:opacity-100">✕</button>
      </div>
    </div>
  );
}

`;
gate = swap(gate, "export default function AccessGate() {", banner + "export default function AccessGate() {", "AccessGate export");
gate = swap(gate, "<OfflinePill />", "<OfflinePill />\n      <UpdateBanner />", "AccessGate render");

// ───────── 5) InstallView.jsx ─────────
install = swap(
  install,
  'import { useInstallInfo, promptInstall, detectPlatform } from "../pwaInstall";',
  'import { useInstallInfo, promptInstall, detectPlatform } from "../pwaInstall";\nimport { useUpdateAvailable, checkForUpdate, getRemoteId, applyUpdate } from "../updateCheck";',
  "InstallView import"
);
install = swap(
  install,
  '  const [upd, setUpd] = useState("");',
  '  const [upd, setUpd] = useState("");\n  const updateAvailable = useUpdateAvailable();',
  "InstallView state"
);
install = swapRange(
  install,
  "  const checkUpdate = async () => {",
  "  const done = justInstalled || added;",
  String.raw`  const checkUpdate = async () => {
    setUpd("checking");
    try {
      const available = await checkForUpdate(true);
      if (!getRemoteId()) { setUpd("error"); return; }
      if (!available) { setUpd("latest"); return; }
      setUpd("reloading");
      setTimeout(() => applyUpdate(), 400);
    } catch (_) {
      setUpd("error");
    }
  };

`,
  "InstallView checkUpdate"
);
install = swap(
  install,
  '{upd === "checking" ? "Checking…" : upd === "reloading" ? "Updating… the app will reload" : "🔄 Check for updates"}',
  '{upd === "checking" ? "Checking…" : upd === "reloading" ? "Updating… the app will reload" : "🔄 Check for updates"}',
  "InstallView button label"
);
install = swap(
  install,
  '{upd === "error" && <p className="mt-2 text-xs text-red-600 dark:text-red-400">Could not check. Please connect to the internet and try again.</p>}',
  '{upd === "error" && <p className="mt-2 text-xs text-red-600 dark:text-red-400">Could not check. Please connect to the internet and try again.</p>}\n        {upd === "latest" && <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">✅ You are on the latest version.</p>}',
  "InstallView status text"
);
install = swap(
  install,
  "{body}",
  String.raw`<section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
        <p className="text-sm font-bold text-amber-800 dark:text-amber-300">🔄 Reminder: check for updates every time you open the app</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">New questions, fixes, and features do not always show up right away. Tap <b>Check for updates</b> below each time you open the app, or tap <b>Update now</b> when the "New version available" banner appears at the top.</p>
        {updateAvailable && (
          <button onClick={() => { applyUpdate(); }} className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-bold text-white active:bg-navy-800 dark:bg-navy-700">🆕 New version available — Update now</button>
        )}
      </section>

      {body}`,
  "InstallView body"
);

// ───────── 6) ChapterBrowser.jsx (dot sa Update tab) ─────────
cb = swap(
  cb,
  'import { useInstallInfo, isNativeApp } from "../pwaInstall";',
  'import { useInstallInfo, isNativeApp } from "../pwaInstall";\nimport { useUpdateAvailable } from "../updateCheck";',
  "ChapterBrowser import"
);
cb = swap(
  cb,
  "const install = useInstallInfo();",
  "const install = useInstallInfo();\n  const updateAvailable = useUpdateAvailable();",
  "BottomNav hook"
);
cb = swap(
  cb,
  '{it.id === "update" && install.canInstall && !install.justInstalled && !install.standalone && (',
  '{it.id === "update" && (updateAvailable || (install.canInstall && !install.justInstalled && !install.standalone)) && (',
  "BottomNav dot"
);

// ───────── isulat lahat + backups ─────────
for (const p of [swPath, vitePath, gatePath, installPath, cbPath]) {
  if (!fs.existsSync(p + ".bak")) fs.copyFileSync(p, p + ".bak");
}
fs.writeFileSync(swPath, sw);
fs.writeFileSync(vitePath, viteNew);
fs.writeFileSync(P("src", "updateCheck.js"), updateCheck);
fs.writeFileSync(gatePath, gate);
fs.writeFileSync(installPath, install);
fs.writeFileSync(cbPath, cb);

console.log("✅ Tapos na! Update banner + reminder + auto-detect.");
console.log("   • vite.config.js, public/sw.js, AccessGate.jsx, InstallView.jsx, ChapterBrowser.jsx (may .bak)");
console.log("   • bago: src/updateCheck.js");
console.log("Susunod: cd frontend && npm run build, tapos i-commit/push ang docs/ (kasama ang version.json)");
