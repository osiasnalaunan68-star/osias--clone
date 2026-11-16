// patch-highlights.js
// Ayusin ang Highlights (CMTA + CMO + CAO):
//  - long-press the text -> lalabas ang "Highlight" bar sa baba (hindi na natatakpan ng native menu)
//  - hindi na nawawala ang selection kapag pinindot ang button
//  - hindi na kailangan ng "arm" button; laging gumagana
//  - may Tip note na "Long-press the text to highlight"
//  - overlap-safe (hindi na nadodoble ang text), readable ang kulay sa dark mode
const fs = require("fs");

const RP = "frontend/src/components/ReaderParts.jsx";
const CB = "frontend/src/pages/ChapterBrowser.jsx";
const IB = "frontend/src/pages/IssuanceBrowser.jsx";

function must(cond, msg) {
  if (!cond) { console.error("\n❌ PATCH FAILED: " + msg + "\n   (walang binago)"); process.exit(1); }
}
function once(src, from, to, label) {
  const parts = src.split(from);
  must(parts.length === 2, label + " — anchor found " + (parts.length - 1) + "x (dapat 1x)");
  return parts.join(to);
}
function reOnce(src, re, to, label) {
  must(re.test(src), label + " — hindi nahanap");
  return src.replace(re, () => to);
}

// ───────────────── ReaderParts.jsx ─────────────────
let rp = fs.readFileSync(RP, "utf8");
must(!rp.includes("hlRegister"), "Na-patch na yata ang ReaderParts.jsx");

rp = once(
  rp,
  'import { useState, useEffect, useCallback, useRef } from "react";\n',
  'import { useState, useEffect, useCallback, useRef } from "react";\nimport { createPortal } from "react-dom";\n',
  "react import"
);

const NEW_HOOK = String.raw`export function useNodeHighlights(nodeId, shouldLoad) {
  const [highlights, setHighlights] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const hlRef = useRef([]);
  hlRef.current = highlights;
  useEffect(() => {
    if (!shouldLoad || !nodeId || loaded) return;
    const data = getHighlightsForNode(nodeId);
    hlRef.current = data;
    setHighlights(data);
    setLoaded(true);
  }, [shouldLoad, nodeId, loaded]);
  // Kapag nag-overlap / magkadikit ang bagong highlight sa luma, pinagsasama (walang doble)
  const addHighlightLocal = useCallback(async (start, end) => {
    try {
      let s = start, e = end;
      const keep = [];
      for (const h of hlRef.current) {
        if (h.end_offset >= s && h.start_offset <= e) {
          s = Math.min(s, h.start_offset);
          e = Math.max(e, h.end_offset);
          removeHighlight(h.id);
        } else keep.push(h);
      }
      const newHl = addHighlight(nodeId, s, e);
      const next = [...keep, newHl];
      hlRef.current = next;
      setHighlights(next);
    } catch (err) {
      console.error("Highlight failed:", err);
    }
  }, [nodeId]);
  const removeHighlightLocal = useCallback(async (hlId) => {
    try {
      removeHighlight(hlId);
      const next = hlRef.current.filter((h) => h.id !== hlId);
      hlRef.current = next;
      setHighlights(next);
    } catch (err) {
      console.error("Remove highlight failed:", err);
    }
  }, []);
  return { highlights, addHighlight: addHighlightLocal, removeHighlight: removeHighlightLocal };
}

`;
rp = reOnce(rp, /export function useNodeHighlights[\s\S]*?\n}\n\n(?=export function useNodeNotes)/, NEW_HOOK, "useNodeHighlights");

const NEW_CONTENT = String.raw`export function applyHighlights(text, highlights) {
  if (!highlights || highlights.length === 0) return [{ text, highlightId: null }];
  const sorted = [...highlights].sort((a, b) => a.start_offset - b.start_offset);
  const segments = [];
  let cursor = 0;
  for (const hl of sorted) {
    const s = Math.max(hl.start_offset, cursor);
    const e = Math.min(hl.end_offset, text.length);
    if (e <= s) continue;
    if (s > cursor) segments.push({ text: text.slice(cursor, s), highlightId: null });
    segments.push({ text: text.slice(s, e), highlightId: hl.id, color: hl.color });
    cursor = e;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlightId: null });
  return segments;
}

// ── Isang global na "selectionchange" listener para sa lahat ng paragraph ──
const hlRegistry = new Map();
let hlActive = null;
let hlPressing = false;
let hlPressTimer = null;
let hlBarCloser = null;

function hlHandleSelectionChange() {
  if (hlPressing) return; // pinipindot ang Highlight bar — wag galawin ang selection
  const sel = window.getSelection();
  let target = null;
  if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
    const n = sel.anchorNode;
    const startEl = n && (n.nodeType === 1 ? n : n.parentElement);
    const host = startEl && startEl.closest ? startEl.closest("[data-hl-content]") : null;
    if (host && hlRegistry.has(host)) target = host;
  }
  if (hlActive && hlActive !== target) {
    const prev = hlRegistry.get(hlActive);
    if (prev) prev(null);
  }
  hlActive = target;
  if (target) hlRegistry.get(target)(sel.getRangeAt(0));
}
function hlRegister(el, cb) {
  hlRegistry.set(el, cb);
  if (hlRegistry.size === 1) document.addEventListener("selectionchange", hlHandleSelectionChange);
  return () => {
    hlRegistry.delete(el);
    if (hlActive === el) hlActive = null;
    if (hlRegistry.size === 0) document.removeEventListener("selectionchange", hlHandleSelectionChange);
  };
}
function hlPress() {
  hlPressing = true;
  clearTimeout(hlPressTimer);
  hlPressTimer = setTimeout(() => { hlPressing = false; }, 1500);
}
function hlRelease() {
  hlPressing = false;
  clearTimeout(hlPressTimer);
}

// Fixed bar sa baba (sa taas ng bottom nav) — hindi natatakpan ng native Copy/Share menu o ng selection handles
function HighlightBar({ kind, onSave, onDelete, onCancel }) {
  const run = (fn) => () => { hlRelease(); fn(); };
  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 z-[100] flex justify-center px-3"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 76px)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        data-hl-bar="1"
        onMouseDown={(e) => e.preventDefault()}
        onPointerDown={hlPress}
        onPointerUp={hlRelease}
        onPointerCancel={hlRelease}
        className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-parchment-200 bg-parchment-50 p-1.5 shadow-xl shadow-slate-900/20 dark:border-navy-700 dark:bg-navy-800 dark:shadow-black/50"
      >
        {kind === "existing" ? (
          <>
            <button onClick={run(onDelete)} className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-red-600 active:bg-red-50 dark:text-red-400 dark:active:bg-red-950/40"><IconTrash className="h-4 w-4" /> Remove highlight</button>
            <button onClick={run(onCancel)} className="min-h-[44px] rounded-xl px-4 py-2 text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Close</button>
          </>
        ) : (
          <>
            <button onClick={run(onSave)} className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800 active:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:active:bg-amber-900/70"><IconHighlighter className="h-4 w-4" /> Highlight</button>
            <button onClick={run(onCancel)} className="min-h-[44px] rounded-xl px-4 py-2 text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Cancel</button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// Tip na makikita ng users sa taas ng reader
export function HighlightHint({ className = "" }) {
  return (
    <p className={"flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs leading-snug text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200 " + className}>
      <IconHighlighter className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span><b>To highlight:</b> long-press the text, drag to select, then tap <b>Highlight</b>. Tap a highlighted text to remove it.</span>
    </p>
  );
}

export function HighlightableContent({ nodeId, content, highlights, addHighlight, removeHighlight, className }) {
  const containerRef = useRef(null);
  const pendingRef = useRef(null);
  const [bar, setBar] = useState(null);

  const closeBar = useCallback(() => {
    pendingRef.current = null;
    setBar(null);
    if (hlBarCloser === closeBar) hlBarCloser = null;
  }, []);
  const openBar = useCallback((b) => {
    if (hlBarCloser && hlBarCloser !== closeBar) hlBarCloser();
    hlBarCloser = closeBar;
    setBar(b);
  }, [closeBar]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const unregister = hlRegister(el, (range) => {
      if (!range) {
        pendingRef.current = null;
        setBar((b) => (b && b.kind === "selection" ? null : b));
        return;
      }
      if (!range.toString().trim()) return;
      const offsetOf = (node, off) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        r.setEnd(node, off);
        return r.toString().length;
      };
      const total = el.textContent.length;
      const start = el.contains(range.startContainer) ? offsetOf(range.startContainer, range.startOffset) : 0;
      const end = el.contains(range.endContainer) ? offsetOf(range.endContainer, range.endOffset) : total;
      if (end <= start) return;
      pendingRef.current = { start, end };
      openBar({ kind: "selection" });
    });
    return () => {
      unregister();
      if (hlBarCloser === closeBar) hlBarCloser = null;
    };
  }, [openBar, closeBar]);

  const clearSelection = () => { const s = window.getSelection(); if (s) s.removeAllRanges(); };
  const handleMarkClick = (e, hlId) => {
    e.stopPropagation();
    pendingRef.current = null;
    openBar({ kind: "existing", hlId });
  };
  const confirmHighlight = () => {
    const p = pendingRef.current;
    if (p) addHighlight(p.start, p.end);
    closeBar();
    clearSelection();
  };
  const confirmDelete = () => {
    if (bar && bar.hlId != null) removeHighlight(bar.hlId);
    closeBar();
  };
  const cancel = () => { closeBar(); clearSelection(); };

  const segments = applyHighlights(content, highlights);
  return (
    <div className="relative">
      <div ref={containerRef} data-hl-content="1" className={className} style={{ WebkitUserSelect: "text", userSelect: "text" }}>
        {segments.map((seg, i) =>
          seg.highlightId ? (
            <mark key={i} style={{ backgroundColor: seg.color, color: "#0f172a" }} className="cursor-pointer rounded-sm px-0.5" onClick={(e) => handleMarkClick(e, seg.highlightId)}>{seg.text}</mark>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>
      {bar && <HighlightBar kind={bar.kind} onSave={confirmHighlight} onDelete={confirmDelete} onCancel={cancel} />}
    </div>
  );
}

`;
rp = reOnce(rp, /export function applyHighlights[\s\S]*?(?=export function NotePanel)/, NEW_CONTENT, "applyHighlights..HighlightableContent");
fs.writeFileSync(RP, rp);
console.log("✅ ReaderParts.jsx — bagong highlight engine");

// ───────────────── ChapterBrowser.jsx (CMTA) ─────────────────
let cb = fs.readFileSync(CB, "utf8");
must(!cb.includes("HighlightHint"), "Na-patch na yata ang ChapterBrowser.jsx");

// gamitin ang shared engine (isang fix lang para sa CMTA, CMO, CAO)
cb = reOnce(cb, /function useNodeHighlights[\s\S]*?\n}\n\n(?=function useNodeNotes)/, "", "local useNodeHighlights");
cb = reOnce(cb, /function applyHighlights[\s\S]*?(?=function NotePanel)/, "", "local HighlightableContent");
cb = once(
  cb,
  'import AccountButton from "../components/AccountButton";\n',
  'import AccountButton from "../components/AccountButton";\nimport { HighlightableContent, useNodeHighlights, HighlightHint } from "../components/ReaderParts";\n',
  "import ReaderParts"
);

// tanggalin ang lumang "Highlight" arm button sa Study mode (laging gumagana na)
cb = reOnce(
  cb,
  /\n\s*<button onClick=\{\(\) => setActiveHighlightNodeId\(isHighlighting \? null : node\.id\)\}[\s\S]*?<\/button>/,
  "",
  "study Highlight button"
);

// Tip note sa taas ng Study at Reading mode
cb = once(
  cb,
  '<div className="mx-auto max-w-3xl">\n                    {chapterTree.content &&',
  '<div className="mx-auto max-w-3xl">\n                    <HighlightHint className="mb-3" />\n                    {chapterTree.content &&',
  "study hint"
);
cb = once(
  cb,
  '{chapterTree.content && <p className="mb-4 font-serif',
  '<HighlightHint className="mb-3 font-sans" />\n                    {chapterTree.content && <p className="mb-4 font-serif',
  "reading hint"
);

// tutorial text
cb = once(
  cb,
  "Select any text to highlight it. Works in both Study and Reading mode",
  "Long-press any text, then tap Highlight. Works in both Study and Reading mode",
  "tutorial text"
);

must(!cb.includes("function HighlightableContent") && !cb.includes("function SelectionToolbar"), "may natira pang lumang highlight code");
fs.writeFileSync(CB, cb);
console.log("✅ ChapterBrowser.jsx — CMTA highlights");

// ───────────────── IssuanceBrowser.jsx (CMO / CAO) ─────────────────
let ib = fs.readFileSync(IB, "utf8");
must(!ib.includes("HighlightHint"), "Na-patch na yata ang IssuanceBrowser.jsx");

ib = once(
  ib,
  'import { HighlightableContent, NotePanel, useNodeHighlights, useNodeNotes } from "../components/ReaderParts";',
  'import { HighlightableContent, HighlightHint, NotePanel, useNodeHighlights, useNodeNotes } from "../components/ReaderParts";',
  "import"
);
ib = reOnce(
  ib,
  /\n\s*\{!reading && \(\n\s*<button\n\s*onClick=\{\(\) => setArmedId\(isArmed \? null : nodeId\)\}[\s\S]*?<\/button>\n\s*\)\}/,
  "",
  "CMO/CAO Highlight button"
);
ib = once(
  ib,
  "      {issuance.sections.map((sec) => {\n",
  '      <HighlightHint className="mb-3" />\n\n      {issuance.sections.map((sec) => {\n',
  "CMO/CAO hint"
);

fs.writeFileSync(IB, ib);
console.log("✅ IssuanceBrowser.jsx — CMO/CAO highlights");
console.log("\nTapos na. I-test: cd frontend && npm run dev");
