// Shared reader pieces (highlight, notes). Copied from ChapterBrowser.jsx so the CMTA screen stays untouched.
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  addHighlight, removeHighlight, getHighlightsForNode,
  getNotesForNode, addNote, updateNote, deleteNote,
} from "../db";

const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </svg>
);
const IconHighlighter = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 21v-3.5L14.5 6a2.1 2.1 0 0 1 3 3L6 21H3Z" /><path d="M13 7l4 4" />
  </svg>
);
const IconNote = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

export function useNodeHighlights(nodeId, shouldLoad) {
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

export function useNodeNotes(nodeId, shouldLoad) {
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

export function formatNoteDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
      " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function applyHighlights(text, highlights) {
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

export function NotePanel({ notes, onCreate, onEdit, onDelete, onClose }) {
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
        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400"><IconNote className="h-3.5 w-3.5" /> My Notes</span>
        <button onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700">Close</button>
      </div>
      {notes.length > 0 && !adding && !editingId && (
        <div className="mb-2 space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg bg-parchment-50 p-2.5 dark:bg-navy-800">
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
            className="w-full rounded-lg border border-parchment-200 bg-parchment-50 p-2.5 text-sm text-navy-900 focus:outline-none dark:border-navy-700 dark:bg-navy-900 dark:text-parchment-50"
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
