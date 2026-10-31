// patch-continue.js — Continue buttons para sa CMTA + CMO + CAO (home screen)
const fs = require("fs");
const path = require("path");

const base = fs.existsSync("frontend/src/pages/ChapterBrowser.jsx")
  ? "frontend/src"
  : fs.existsSync("src/pages/ChapterBrowser.jsx")
  ? "src"
  : null;
if (!base) {
  console.error("❌ Hindi makita ang ChapterBrowser.jsx. I-run ito sa project root (yung may codemagic.yaml).");
  process.exit(1);
}

const cbPath = path.join(base, "pages", "ChapterBrowser.jsx");
const storePath = path.join(base, "issuancesStore.js");
let cb = fs.readFileSync(cbPath, "utf8");
let store = fs.readFileSync(storePath, "utf8");

if (cb.includes("saveIssuanceProgress") || store.includes("saveIssuanceProgress")) {
  console.log("ℹ️ Na-patch na ito dati. Walang binago.");
  process.exit(0);
}

function fail(label) {
  console.error("❌ Hindi makita ang anchor: " + label + " (walang binago)");
  process.exit(1);
}

function swap(src, find, repl, label) {
  const i = src.indexOf(find);
  if (i === -1) fail(label);
  if (src.indexOf(find, i + 1) !== -1) fail(label + " (higit sa 1 match)");
  return src.slice(0, i) + repl + src.slice(i + find.length);
}

function swapRange(src, startMarker, endMarker, repl, keepEnd, label) {
  const s = src.indexOf(startMarker);
  if (s === -1) fail(label + " (start)");
  if (src.indexOf(startMarker, s + 1) !== -1) fail(label + " (start, higit sa 1)");
  const e = src.indexOf(endMarker, s);
  if (e === -1) fail(label + " (end)");
  const cut = keepEnd ? e : e + endMarker.length;
  return src.slice(0, s) + repl + src.slice(cut);
}

// ───────── 1) issuancesStore.js ─────────
store =
  store.replace(/\s*$/, "\n") +
  `
// ── Continue / resume progress para sa CMO at CAO ────────────────────
const ISSUANCE_PROGRESS_KEY = "customsLaw_issuanceProgress";

function readIssuanceProgressAll() {
  try { return JSON.parse(localStorage.getItem(ISSUANCE_PROGRESS_KEY) || "{}") || {}; } catch { return {}; }
}

// kind = "cmo" | "cao"  ->  { id, scrollTop, saved_at }
export function saveIssuanceProgress(kind, data) {
  try {
    const all = readIssuanceProgressAll();
    all[kind] = { ...(all[kind] || {}), ...data, saved_at: new Date().toISOString() };
    localStorage.setItem(ISSUANCE_PROGRESS_KEY, JSON.stringify(all));
  } catch {}
}

export function getIssuanceProgress(kind) {
  const p = readIssuanceProgressAll()[kind];
  if (!p || !p.id) return null;
  const iss = getIssuance(p.id);
  if (!iss || iss.type.toLowerCase() !== kind) return null;
  return p;
}
`;

// ───────── 2) ChapterBrowser.jsx ─────────
cb = swap(
  cb,
  'import { ISSUANCE_KINDS, getIssuance } from "../issuancesStore";',
  'import { ISSUANCE_KINDS, getIssuance, getIssuanceProgress, saveIssuanceProgress } from "../issuancesStore";',
  "import issuancesStore"
);

cb = swap(
  cb,
  'const [source, setSource] = useState(() => (demo ? "cmta" : localStorage.getItem(SOURCE_KEY) || "cmta"));',
  'const [source, setSource] = useState("cmta"); // laging home ang unang bukas; Continue buttons na ang bahala',
  "initial source"
);

const openBlock = `const openIssuance = useCallback((kind, id, scrollTo = 0) => {
    setSource(kind);
    setIssuanceId(id);
    setView("browse");
    setSidebarOpen(window.innerWidth >= 768);
    // i-save agad kung ano ang binuksan para may Continue kahit hindi pa nag-scroll
    saveIssuanceProgress(kind, { id, scrollTop: scrollTo });
    if (mainRef.current) mainRef.current.scrollTop = 0;
    if (scrollTo > 0) {
      const restore = () => { if (mainRef.current) mainRef.current.scrollTop = scrollTo; };
      setTimeout(restore, 150);
      setTimeout(restore, 450);
    }
  }, []);

  // ── Continue para sa CMO / CAO (kapareho ng CMTA) ──
  const [issuanceResume, setIssuanceResume] = useState(() => ({ cmo: getIssuanceProgress("cmo"), cao: getIssuanceProgress("cao") }));
  useEffect(() => {
    setIssuanceResume({ cmo: getIssuanceProgress("cmo"), cao: getIssuanceProgress("cao") });
  }, [source, view, issuanceId, chapterTree]);

  const resumeIssuance = useCallback((kind) => {
    const p = getIssuanceProgress(kind);
    if (p) { openIssuance(kind, p.id, p.scrollTop || 0); return; }
    // wala pang progress -> buksan ang listahan
    setSource(kind);
    setView("browse");
    setSidebarOpen(true);
  }, [openIssuance]);

  // auto-save kung saan huling nag-scroll sa CMO / CAO
  useEffect(() => {
    if (view !== "browse" || !isIssuance || !issuanceId) return;
    const cur = getIssuance(issuanceId);
    if (!cur || cur.type.toLowerCase() !== source) return;
    const el = mainRef.current;
    if (!el) return;
    let t = null;
    const persist = () => saveIssuanceProgress(source, { id: issuanceId, scrollTop: el.scrollTop });
    const onScroll = () => { clearTimeout(t); t = setTimeout(persist, 300); };
    const onHide = () => { if (document.visibilityState === "hidden") { clearTimeout(t); persist(); } };
    const onPageHide = () => { clearTimeout(t); persist(); };
    el.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [view, isIssuance, source, issuanceId]);`;

cb = swapRange(
  cb,
  "const openIssuance = useCallback((kind, id) => {",
  "}, []);",
  openBlock,
  false,
  "openIssuance"
);

const itemsBlock = `const homeContinueItems = [
    {
      id: "cmta", icon: "⚖️", label: "Continue CMTA", has: !!resumeAvailable,
      sub: resumeAvailable
        ? (resumeAvailable.title_number ? "Title " + resumeAvailable.title_number + " · " : "") + "Chapter " + resumeAvailable.chapter_number
        : "No progress yet — tap to pick a chapter",
      onClick: () => {
        if (resumeAvailable) resumeReading();
        else { setSource("cmta"); setSidebarOpen(true); }
      },
    },
    ...["cmo", "cao"].map((k) => {
      const meta = ISSUANCE_KINDS.find((x) => x.id === k);
      const p = issuanceResume[k];
      const iss = p ? getIssuance(p.id) : null;
      return {
        id: k,
        icon: meta ? meta.icon : "📜",
        label: "Continue " + (meta ? meta.label : k.toUpperCase()),
        has: !!iss,
        sub: iss ? iss.label + (iss.title ? " — " + iss.title : "") : "No progress yet — tap to pick a " + k.toUpperCase(),
        onClick: () => resumeIssuance(k),
      };
    }),
  ];

  const highlightUIValue = useMemo(`;

cb = swap(cb, "const highlightUIValue = useMemo(", itemsBlock, "highlightUIValue");

const homeJsx = `<div className="mb-2 w-full max-w-sm space-y-2">
                      {homeContinueItems.map((c) => (
                        <button
                          key={c.id}
                          onClick={c.onClick}
                          className={"flex w-full items-center gap-3 rounded-2xl border border-navy-200 bg-white p-4 text-left shadow-card active:bg-slate-50 dark:border-navy-700 dark:bg-slate-900 dark:active:bg-slate-800 " + (c.has ? "" : "opacity-70")}
                        >
                          <span className="text-2xl" aria-hidden>{c.icon}</span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-navy-900 dark:text-slate-100">{c.label}</span>
                            <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{c.sub}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                    `;

cb = swapRange(
  cb,
  "{resumeAvailable && (",
  '<span className="text-4xl">📖</span>',
  homeJsx,
  true,
  "home continue card"
);

// ───────── 3) isulat + backup ─────────
for (const p of [cbPath, storePath]) {
  if (!fs.existsSync(p + ".bak")) fs.copyFileSync(p, p + ".bak");
}
fs.writeFileSync(cbPath, cb);
fs.writeFileSync(storePath, store);

console.log("✅ Tapos na!");
console.log("   • " + cbPath + "  (backup: .bak)");
console.log("   • " + storePath + "  (backup: .bak)");
console.log("Susunod: cd frontend && npm run build   (o i-push na sa Codemagic)");
