// patch-cmta-search.js
// 1) CMTA search -> nasa sidebar (menu) na, keyword lang (walang filter), kapareho ng CMO/CAO
// 2) CMO/CAO reader: nasa ibabaw na ang number/label, nasa ilalim ang text (malawak)
const fs = require("fs");

const CB = "frontend/src/pages/ChapterBrowser.jsx";
const IB = "frontend/src/pages/IssuanceBrowser.jsx";

function must(cond, msg) {
  if (!cond) { console.error("\n❌ PATCH FAILED: " + msg + "\n   (walang binago sa file na ito)"); process.exit(1); }
}
function once(src, from, to, label) {
  const parts = src.split(from);
  must(parts.length === 2, label + " — anchor found " + (parts.length - 1) + "x (dapat 1x)");
  return parts.join(to);
}

// ───────────────── ChapterBrowser.jsx ─────────────────
let cb = fs.readFileSync(CB, "utf8");
must(!cb.includes("function SidebarSearch"), "Na-patch na yata ang ChapterBrowser.jsx");

const SIDEBAR_SEARCH = String.raw`// ── CMTA search sa sidebar (keyword lang, kapareho ng CMO / CAO) ──────
function SidebarSearch({ onOpen, children }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reqId = useRef(0);
  const term = q.trim();

  useEffect(() => {
    if (!term) { reqId.current++; setResults([]); setLoading(false); setError(null); return; }
    const id = ++reqId.current;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const data = await search(term, "all");
        if (id === reqId.current) { setResults(data); setError(null); }
      } catch (err) {
        if (id === reqId.current) { setResults([]); setError(err.message); }
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [term]);

  const pathOf = (item) => {
    const p = [];
    if (item.title_number) p.push("Title " + item.title_number);
    if (item.chapter_number) p.push("Ch. " + item.chapter_number);
    if (item.node_type === "section") p.push("Sec. " + item.node_number);
    return p.join(" · ");
  };

  const openResult = async (item) => {
    if (item.chapter_number) { onOpen(item.chapter_number, item.title_number, item.node_id); return; }
    try {
      const info = await getChapterForNode(item.node_id);
      if (info) onOpen(info.chapter_number, info.title_number, item.node_id);
      else alert("This item is not under any chapter. Please browse manually.");
    } catch (e) {
      console.error(e);
      alert("Could not locate the chapter for this item.");
    }
  };

  const ordered = [...results.filter((r) => r.exact_match), ...results.filter((r) => !r.exact_match)];

  return (
    <div className="p-3">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-parchment-200 bg-parchment px-3 dark:border-navy-700 dark:bg-navy-800">
        <span className="text-slate-400 dark:text-slate-500" aria-hidden><NavIcon name="search" className="h-4 w-4" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search RA 10863 (section, keyword)"
          style={{ fontSize: "16px" }}
          className="min-w-0 flex-1 border-none bg-transparent py-2 text-navy-900 placeholder:text-slate-400 focus:outline-none dark:text-parchment-50"
        />
        {q && <button onClick={() => setQ("")} className="text-slate-400" aria-label="Clear">✕</button>}
      </div>

      {!term ? children : (
        <div>
          {loading && <p className="p-3 text-center text-sm text-slate-400">Searching…</p>}
          {error && <p className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">{error}</p>}
          {!loading && !error && ordered.length === 0 && (
            <p className="p-3 text-center text-sm text-slate-400">No match for “{term}”.</p>
          )}
          {ordered.length > 0 && (
            <ul className="space-y-0.5">
              {ordered.map((item, idx) => (
                <li key={"sr-" + idx}>
                  <button
                    onClick={() => openResult(item)}
                    className="block min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 active:bg-parchment dark:text-slate-400 dark:active:bg-navy-800"
                  >
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">{item.node_type}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{pathOf(item)}</span>
                    </span>
                    <span className="mt-0.5 block font-semibold text-navy-900 dark:text-parchment-50">{item.title || item.node_number}</span>
                    {item.excerpt && (
                      <span
                        className="line-clamp-2 block text-xs text-slate-500 dark:text-slate-400"
                        dangerouslySetInnerHTML={{ __html: item.excerpt.replace(/\[/g, "<mark>").replace(/\]/g, "</mark>") }}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

`;

// 1. isingit ang SidebarSearch component
cb = once(cb, "function DarkModeToggle(", SIDEBAR_SEARCH + "function DarkModeToggle(", "DarkModeToggle anchor");

// 2. i-wrap ang CMTA chapter list ng SidebarSearch
cb = once(
  cb,
  '{source === "cmta" ? (\n            <div className="p-3">\n',
  '{source === "cmta" ? (\n            <SidebarSearch onOpen={loadChapter}>\n            <div>\n',
  "sidebar open anchor"
);
cb = once(
  cb,
  "            </div>\n            ) : (\n              <IssuanceSidebar",
  "            </div>\n            </SidebarSearch>\n            ) : (\n              <IssuanceSidebar",
  "sidebar close anchor"
);

// 3. tanggalin ang "Search" tab sa bottom nav (nasa sidebar na)
cb = once(cb, '    { id: "search", label: "Search", icon: "search" },\n', "", "bottom nav search item");

// 4. tutorial text
cb = once(cb, "Find anything instantly. Try a section number like", "Open the menu (☰) and use the search box at the top. Try a section number like", "tutorial text");

// 5. SearchView (demo na lang gumagamit): tanggalin ang filter
cb = once(cb, '  const [filter, setFilter] = useState("all");\n', "", "filter state");
cb = once(cb, "await search(query.trim(), filter);", 'await search(query.trim(), "all");', "search call");
cb = once(cb, "}, [query, filter]);", "}, [query]);", "search deps");
const chipsRe = /\s*<div className="flex flex-wrap gap-1\.5">\s*(?:<FilterChip[^\n]*\n\s*)+<\/div>/;
must(chipsRe.test(cb), "FilterChip block not found");
cb = cb.replace(chipsRe, "");
cb = once(
  cb,
  '<div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-navy-700">',
  '<div className="mt-2 flex justify-end border-t border-slate-100 pt-2 dark:border-navy-700">',
  "search button row"
);
const fcRe = /function FilterChip[\s\S]*?\n}\n\n(?=function SearchResultCard)/;
must(fcRe.test(cb), "FilterChip function not found");
cb = cb.replace(fcRe, "");
must(!cb.includes("FilterChip") && !cb.includes("setFilter"), "may natira pang filter code");

fs.writeFileSync(CB, cb);
console.log("✅ ChapterBrowser.jsx — search nasa sidebar na, walang filter");

// ───────────────── IssuanceBrowser.jsx ─────────────────
let ib = fs.readFileSync(IB, "utf8");
must(!ib.includes('className="flex flex-col gap-1" style={{ fontSize'), "Na-patch na yata ang IssuanceBrowser.jsx");

ib = once(ib, '<div className="flex gap-2" style={{ fontSize:', '<div className="flex flex-col gap-1" style={{ fontSize:', "paragraph row");
ib = once(
  ib,
  '${reading ? "font-serif leading-loose" : "leading-relaxed"}',
  '${reading ? "font-serif leading-snug" : "leading-relaxed"}',
  "label line-height"
);
ib = once(
  ib,
  '        <div className="min-w-0 flex-1">\n          <HighlightableContent',
  '        <div className="w-full min-w-0">\n          <HighlightableContent',
  "text wrapper"
);

fs.writeFileSync(IB, ib);
console.log("✅ IssuanceBrowser.jsx — nasa ilalim na ng number ang text (full width)");
console.log("\nTapos na. Run: cd frontend && npm run dev (or build) para i-test.");
