// Shared reader pieces (highlight, notes). Copied from ChapterBrowser.jsx so the CMTA screen stays untouched.
import { useState, useEffect, useCallback, useRef } from "react";
import {
  addHighlight, removeHighlight, getHighlightsForNode,
  getNotesForNode, addNote, updateNote, deleteNote,
} from "../db";

export function useNodeHighlights(nodeId, shouldLoad) {
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
    if (hl.start_offset > cursor) segments.push({ text: text.slice(cursor, hl.start_offset), highlightId: null });
    segments.push({ text: text.slice(hl.start_offset, hl.end_offset), highlightId: hl.id, color: hl.color });
    cursor = hl.end_offset;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlightId: null });
  return segments;
}

export function SelectionToolbar({ x, y, kind, onSave, onCancel, onDelete }) {
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

export function HighlightableContent({ nodeId, content, highlights, addHighlight, removeHighlight, className, armed }) {
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
