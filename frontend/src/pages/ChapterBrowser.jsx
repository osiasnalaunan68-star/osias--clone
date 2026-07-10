import { useState, useEffect, useCallback, useRef, useMemo, useContext, createContext } from "react";
import { searchCMTA } from "../api/customsLawApi";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const MODE_KEY = "customsLaw_mode";
const FONT_KEY = "customsLaw_fontScale";

const HighlightUIContext = createContext(null);
function useHighlightUI() { return useContext(HighlightUIContext); }

function useNodeHighlights(nodeId, shouldLoad) {
  const [highlights, setHighlights] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!shouldLoad || !nodeId || loaded) return;
    let ignore = false;
    fetch(`${API_BASE}/api/highlights/node/${nodeId}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => { if (!ignore) { setHighlights(data); setLoaded(true); } })
      .catch(console.error);
    return () => { ignore = true; };
  }, [shouldLoad, nodeId, loaded]);
  const addHighlight = useCallback(async (start, end) => {
    try {
      const res = await fetch(`${API_BASE}/api/highlights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_id: nodeId, start_offset: start, end_offset: end, color: "#90EE90" }),
      });
      if (res.ok) { const newHl = await res.json(); setHighlights((prev) => [...prev, newHl]); }
    } catch (e) { console.error(e); }
  }, [nodeId]);
  const removeHighlight = useCallback(async (hlId) => {
    try { await fetch(`${API_BASE}/api/highlights/${hlId}`, { method: "DELETE" }); setHighlights((prev) => prev.filter((h) => h.id !== hlId)); } catch (e) { console.error(e); }
  }, []);
  return { highlights, addHighlight, removeHighlight };
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
    <div style={{ position: "fixed", left: x, top: y, zIndex: 100 }} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1.5 shadow-lg shadow-slate-900/10">
      {kind === "existing" ? (
        <>
          <button onClick={onDelete} className="flex items-center gap-1 rounded-lg px-3 py-2 min-h-[40px] text-sm font-medium text-red-600 active:bg-red-50">
            🗑 Remove highlight
          </button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100">Close</button>
        </>
      ) : (
        <>
          <button onClick={onSave} className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-2 min-h-[40px] text-sm font-semibold text-amber-800 active:bg-amber-200">
            🖍 Highlight
          </button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100">Cancel</button>
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
      <div ref={containerRef} className={`${className} ${armed ? "rounded-lg bg-amber-50/70 ring-1 ring-amber-300" : ""}`}>
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

function EditBox({ nodeId, initialContent, onSaved, onCancel }) {
  const [text, setText] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const save = async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/nodes/${nodeId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: text }) });
      if (!res.ok) throw new Error("Save failed");
      onSaved();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };
  return (
    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ fontSize: "16px" }}
        className="w-full rounded-xl border border-slate-300 p-3 leading-relaxed shadow-inner focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/20"
        rows={Math.max(3, text.split("\n").length)}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <div className="mt-2 flex gap-2">
        <button onClick={save} disabled={saving} className="min-h-[40px] rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm active:bg-emerald-700 disabled:opacity-50">
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button onClick={onCancel} className="min-h-[40px] rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 active:bg-slate-200">Cancel</button>
      </div>
    </div>
  );
}

const STUDY_TYPE_STYLES = {
  chapter: "text-xl sm:text-2xl font-bold text-navy-900",
  section: "text-lg sm:text-xl font-semibold text-slate-800",
  paragraph: "text-base sm:text-lg text-slate-700",
  subparagraph: "text-base text-slate-600",
  item: "text-sm text-slate-500",
};

function StudyNodeRenderer({ node, level = 0, onRefresh, expandedSet = new Set(), scrollToId = null }) {
  const nodeRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const { activeHighlightNodeId, setActiveHighlightNodeId } = useHighlightUI();
  const isHighlighting = activeHighlightNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isExpandable = hasChildren || !!node.content;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, expanded);

  useEffect(() => {
    if (expandedSet.has(node.id)) setExpanded(true);
  }, [expandedSet, node.id]);

  useEffect(() => {
    if (scrollToId === node.id && nodeRef.current) {
      setTimeout(() => {
        nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nodeRef.current.classList.add("ring-2", "ring-amber-400", "bg-amber-50");
        setTimeout(() => nodeRef.current?.classList.remove("ring-2", "ring-amber-400", "bg-amber-50"), 2200);
      }, 120);
    }
  }, [scrollToId, node.id]);

  const toggle = (e) => { e.stopPropagation(); if (isExpandable) setExpanded((v) => !v); };

  return (
    <div ref={nodeRef} style={{ marginLeft: `${Math.min(level, 6) * 0.9}rem` }} className="my-1 rounded-xl transition-colors">
      <div onClick={toggle} role="button" tabIndex={0} className="flex items-start gap-2 rounded-xl px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer touch-manipulation">
        <span className="mt-1 w-4 flex-shrink-0 select-none text-sm text-slate-400">{isExpandable ? (expanded ? "▾" : "▸") : ""}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {node.node_type === "chapter" && (
              <span className="inline-block rounded-md bg-navy-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                Chapter {node.node_number}
              </span>
            )}
            {node.node_type === "section" && (
              <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800">
                Sec. {node.node_number}
              </span>
            )}
            <span className={STUDY_TYPE_STYLES[node.node_type] || "text-sm text-slate-700"}>{node.title || node.node_number}</span>
          </div>

          {expanded && node.content && (
            <div onClick={(e) => e.stopPropagation()} className="mt-2">
              {editing ? (
                <EditBox nodeId={node.id} initialContent={node.content} onSaved={() => { setEditing(false); onRefresh(); }} onCancel={() => setEditing(false)} />
              ) : (
                <>
                  <HighlightableContent
                    nodeId={node.id}
                    content={node.content}
                    highlights={highlights}
                    addHighlight={addHighlight}
                    removeHighlight={removeHighlight}
                    armed={isHighlighting}
                    className="select-text rounded-lg p-2 text-base leading-relaxed text-slate-700"
                  />
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <button onClick={() => setEditing(true)} className="min-h-[38px] rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 active:bg-slate-100">
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => setActiveHighlightNodeId(isHighlighting ? null : node.id)}
                      className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                        isHighlighting ? "border-amber-400 bg-amber-100 text-amber-800" : "border-emerald-200 bg-emerald-50 text-emerald-700 active:bg-emerald-100"
                      }`}
                    >
                      {isHighlighting ? "Select text to highlight…" : "🖍 Highlight"}
                    </button>
                  </div>
                  {node.cross_references && node.cross_references.length > 0 && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm" onClick={(e) => e.stopPropagation()}>
                      <span className="font-medium text-slate-700">See Also</span>
                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600">
                        {node.cross_references.map((ref, idx) => (
                          <li key={idx}>
                            {ref.url ? (
                              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline decoration-navy-300 underline-offset-2">{ref.text}</a>
                            ) : (
                              <span>{ref.text}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {expanded && node.keywords?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
              {node.keywords.map((kw) => <span key={kw} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{kw}</span>)}
            </div>
          )}
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="ml-4 border-l border-slate-100">
          {node.children.map((child) => (
            <StudyNodeRenderer key={child.id} node={child} level={level + 1} onRefresh={onRefresh} expandedSet={expandedSet} scrollToId={scrollToId} />
          ))}
        </div>
      )}
    </div>
  );
}

const READING_TYPE_STYLES = {
  chapter: "font-bold text-navy-900 mb-2",
  section: "font-semibold text-slate-900 mb-1",
  paragraph: "text-slate-800",
  subparagraph: "text-slate-800",
  item: "text-slate-700",
};

function ReadingNodeRenderer({ node, level = 0, fontScale, expandedSet = new Set(), scrollToId = null }) {
  const nodeRef = useRef(null);
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, !!node.content);

  useEffect(() => {
    if (expandedSet.has(node.id)) setExpanded(true);
  }, [expandedSet, node.id]);

  useEffect(() => {
    if (scrollToId === node.id && nodeRef.current) {
      setTimeout(() => {
        nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nodeRef.current.classList.add("bg-amber-50");
        setTimeout(() => nodeRef.current?.classList.remove("bg-amber-50"), 2200);
      }, 120);
    }
  }, [scrollToId, node.id]);

  const toggle = (e) => { e.stopPropagation(); if (hasChildren) setExpanded((v) => !v); };
  const headingSize = node.node_type === "chapter" ? 1.6 : node.node_type === "section" ? 1.3 : 1;

  return (
    <div ref={nodeRef} style={{ marginLeft: `${Math.min(level, 4) * 0.6}rem` }} className="my-4 rounded-lg transition-colors">
      <div onClick={toggle} className={`font-serif ${READING_TYPE_STYLES[node.node_type] || "text-slate-800"} ${hasChildren ? "cursor-pointer" : ""}`} style={{ fontSize: `${headingSize * fontScale}rem` }}>
        {node.node_type === "section" && `Section ${node.node_number}. `}
        {node.node_type === "chapter" && `Chapter ${node.node_number}. `}
        {node.title || node.node_number}
      </div>
      {node.content && (
        <HighlightableContent nodeId={node.id} content={node.content} highlights={highlights} addHighlight={addHighlight} removeHighlight={removeHighlight} armed={true} className="select-text font-serif leading-loose text-slate-800" />
      )}
      {node.cross_references && node.cross_references.length > 0 && (
        <div className="mt-2 rounded-lg bg-slate-50 p-3 font-sans text-sm">
          <span className="font-medium text-slate-700">See Also</span>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600">
            {node.cross_references.map((ref, idx) => (
              <li key={idx}>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline decoration-navy-300 underline-offset-2">{ref.text}</a>
                ) : (
                  <span>{ref.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {expanded && hasChildren && (
        <div>{node.children.map((child) => <ReadingNodeRenderer key={child.id} node={child} level={level + 1} fontScale={fontScale} expandedSet={expandedSet} scrollToId={scrollToId} />)}</div>
      )}
    </div>
  );
}

function ModeToggle({ mode, setMode }) {
  return (
    <div className="inline-flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm" role="tablist" aria-label="View mode">
      <button role="tab" aria-selected={mode === "study"} onClick={() => setMode("study")} className={`min-h-[36px] rounded-full px-3 py-1.5 transition-colors ${mode === "study" ? "bg-navy-900 font-medium text-white shadow-sm" : "text-slate-500"}`}>📘 Study</button>
      <button role="tab" aria-selected={mode === "reading"} onClick={() => setMode("reading")} className={`min-h-[36px] rounded-full px-3 py-1.5 transition-colors ${mode === "reading" ? "bg-navy-900 font-medium text-white shadow-sm" : "text-slate-500"}`}>📖 Reading</button>
    </div>
  );
}

function FontStepper({ fontScale, setFontScale }) {
  const clamp = (v) => Math.min(1.6, Math.max(0.85, v));
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <button onClick={() => setFontScale((s) => clamp(s - 0.1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100" aria-label="Decrease font size">A-</button>
      <span className="w-10 text-center text-xs text-slate-400">{Math.round(fontScale * 100)}%</span>
      <button onClick={() => setFontScale((s) => clamp(s + 0.1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100" aria-label="Increase font size">A+</button>
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
    <div className="h-1 w-full bg-slate-100">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-navy-700 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

function FilterChip({ label, value, active, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`min-h-[38px] rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "border-navy-900 bg-navy-900 text-white" : "border-slate-200 bg-white text-slate-600 active:bg-slate-100"
      }`}
    >
      {label}
    </button>
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
    title: "bg-purple-100 text-purple-700",
    chapter: "bg-navy-900 text-white",
    section: "bg-amber-100 text-amber-800",
    paragraph: "bg-slate-100 text-slate-600",
    subparagraph: "bg-slate-100 text-slate-600",
    item: "bg-slate-100 text-slate-600",
  };
  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-2xl border bg-white p-4 text-left shadow-card transition active:scale-[0.99] active:bg-slate-50 ${
        item.exact_match ? "border-amber-400 ring-1 ring-amber-300" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`rounded-md px-1.5 py-0.5 font-semibold uppercase tracking-wide ${typeColors[item.node_type] || "bg-slate-100 text-slate-600"}`}>
            {item.node_type}
          </span>
          <span className="text-slate-400">{buildPath()}</span>
        </div>
        {item.exact_match && (
          <span className="flex-shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-950">✓ Exact match</span>
        )}
      </div>
      <div className="mt-1.5 text-base font-semibold text-slate-900">{item.title || item.node_number}</div>
      {item.excerpt && (
        <div className="mt-1 text-sm leading-relaxed text-slate-500" dangerouslySetInnerHTML={{ __html: item.excerpt.replace(/\[/g, "<mark>").replace(/\]/g, "</mark>") }} />
      )}
      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-navy-700">Open <span aria-hidden>→</span></div>
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
      const data = await searchCMTA(query.trim(), filter);
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
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card">
        <div className="flex items-center gap-2">
          <span className="pl-1 text-lg text-slate-400" aria-hidden>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Search e.g. "Section 102" or "smuggling"'
            className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
            style={{ fontSize: "16px" }}
          />
          {query && (
            <button onClick={clearQuery} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100" aria-label="Clear search">✕</button>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2">
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="All" value="all" active={filter === "all"} onClick={setFilter} />
            <FilterChip label="Title" value="title" active={filter === "title"} onClick={setFilter} />
            <FilterChip label="Chapter" value="chapter" active={filter === "chapter"} onClick={setFilter} />
            <FilterChip label="Section" value="section" active={filter === "section"} onClick={setFilter} />
          </div>
          <button onClick={handleSearch} disabled={loading || !query.trim()} className="min-h-[38px] flex-shrink-0 rounded-full bg-navy-900 px-5 py-1.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 disabled:opacity-40">
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {loading && (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
              <div className="h-3 w-1/3 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-2/3 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {!loading && exactResults.length > 0 && (
        <div className="mt-5 space-y-2">
          {exactResults.map((item, idx) => <SearchResultCard key={`exact-${idx}`} item={item} onClick={() => handleResultClick(item)} />)}
        </div>
      )}

      {!loading && otherResults.length > 0 && (
        <div className="mt-5">
          {exactResults.length > 0 && <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Related mentions</p>}
          <div className="space-y-2">
            {otherResults.map((item, idx) => <SearchResultCard key={`other-${idx}`} item={item} onClick={() => handleResultClick(item)} />)}
          </div>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && !error && (
        <div className="mt-10 flex flex-col items-center gap-2 text-center text-slate-400">
          <span className="text-3xl">🔎</span>
          <p className="text-base font-medium text-slate-500">No results for "{query}"</p>
          <p className="text-sm">Try a section number (e.g. 102), a keyword, or a shorter phrase.</p>
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="mt-10 flex flex-col items-center gap-2 text-center text-slate-400">
          <span className="text-3xl">📚</span>
          <p className="text-sm">Search the full text of RA 10863 — titles, chapters, sections, and definitions.</p>
        </div>
      )}
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

export default function ChapterBrowser() {
  const [view, setView] = useState("browse");
  const [titles, setTitles] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTitleNumber, setSelectedTitleNumber] = useState(null);
  const [chapterTree, setChapterTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 768);
  const [mode, setMode] = useState(() => (typeof window === "undefined" ? "study" : localStorage.getItem(MODE_KEY) || "study"));
  const [fontScale, setFontScale] = useState(() => { if (typeof window === "undefined") return 1; const saved = parseFloat(localStorage.getItem(FONT_KEY)); return Number.isFinite(saved) ? saved : 1; });
  const [activeHighlightNodeId, setActiveHighlightNodeId] = useState(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState(new Set());
  const [scrollToNodeId, setScrollToNodeId] = useState(null);
  const [collapsedTitles, setCollapsedTitles] = useState({});
  const mainRef = useRef(null);

  useEffect(() => localStorage.setItem(MODE_KEY, mode), [mode]);
  useEffect(() => localStorage.setItem(FONT_KEY, String(fontScale)), [fontScale]);

  useEffect(() => {
    fetch(`${API_BASE}/api/titles`).then((r) => r.json()).then(setTitles).catch((err) => setError(err.message));
  }, []);

  const loadChapter = useCallback(async (chapterNumber, titleNumber = null, focusSectionNumber = null) => {
    setLoading(true); setError(null);
    try {
      const url = titleNumber
        ? `${API_BASE}/api/chapter/${chapterNumber}?title_number=${encodeURIComponent(titleNumber)}`
        : `${API_BASE}/api/chapter/${chapterNumber}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Chapter not found");
      const data = await res.json();
      setChapterTree(data);
      setSelectedChapter(chapterNumber);
      setSelectedTitleNumber(titleNumber);
      setView("browse");
      setSidebarOpen(window.innerWidth >= 768);
      if (mainRef.current) mainRef.current.scrollTop = 0;

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
    } catch (err) {
      setError(err.message);
      setChapterTree(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshChapter = () => { if (selectedChapter) loadChapter(selectedChapter, selectedTitleNumber); };
  const toggleTitleCollapse = (key) => { setCollapsedTitles((prev) => ({ ...prev, [key]: !prev[key] })); };
  const highlightUIValue = useMemo(() => ({ activeHighlightNodeId, setActiveHighlightNodeId }), [activeHighlightNodeId]);

  return (
    <HighlightUIContext.Provider value={highlightUIValue}>
      <div className="relative flex h-screen overflow-hidden bg-slate-50" style={{ height: "100dvh" }}>
        {sidebarOpen && view === "browse" && (
          <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {view === "browse" && (
          <aside
            className={`safe-top fixed inset-y-0 left-0 z-40 w-[85vw] max-w-[320px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white transition-transform duration-200 md:static md:w-80 md:max-w-none md:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>⚖️</span>
                <div>
                  <h2 className="text-base font-bold leading-tight text-navy-900">RA 10863</h2>
                  <p className="text-xs text-slate-400">Customs Modernization &amp; Tariff Act</p>
                </div>
              </div>
            </div>
            <div className="p-3">
              {error && <p className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-600">{error}</p>}
              {titles.map((titleGroup) => {
                const key = titleGroup.title_number || "root";
                const collapsed = collapsedTitles[key];
                return (
                  <div key={key} className="mb-2">
                    <button onClick={() => toggleTitleCollapse(key)} className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-slate-50">
                      <span className="text-sm font-bold uppercase tracking-wide text-navy-800">
                        {titleGroup.title_number ? `Title ${titleGroup.title_number}` : titleGroup.title_title}
                      </span>
                      <span className="flex-shrink-0 text-xs text-slate-400">{collapsed ? "▸" : "▾"}</span>
                    </button>
                    {!collapsed && (
                      <ul className="ml-1 space-y-0.5 border-l border-slate-100 pl-2">
                        {titleGroup.chapters.map((ch) => {
                          const active = selectedChapter === ch.node_number && selectedTitleNumber === titleGroup.title_number;
                          return (
                            <li key={ch.id}>
                              <button
                                onClick={() => loadChapter(ch.node_number, titleGroup.title_number)}
                                className={`block min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                  active ? "bg-navy-900 font-medium text-white shadow-sm" : "text-slate-600 active:bg-slate-100"
                                }`}
                              >
                                <span className="block truncate">Ch. {ch.node_number}: {ch.title}</span>
                                <span className={`text-xs ${active ? "text-slate-300" : "text-slate-400"}`}>{ch.section_count} section{ch.section_count !== 1 ? "s" : ""}</span>
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
          <div className="safe-top sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center gap-2 px-3 py-2">
              {view === "browse" && (
                <button onClick={() => setSidebarOpen((v) => !v)} className="flex h-10 w-10 flex-shrink-0 touch-manipulation items-center justify-center rounded-full text-lg text-slate-600 active:bg-slate-100" aria-label="Toggle chapter list">
                  {sidebarOpen ? "✕" : "☰"}
                </button>
              )}
              <div className="flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm">
                <button onClick={() => setView("browse")} className={`min-h-[36px] rounded-full px-3 py-1.5 font-medium transition-colors ${view === "browse" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500"}`}>Browse</button>
                <button onClick={() => setView("search")} className={`min-h-[36px] rounded-full px-3 py-1.5 font-medium transition-colors ${view === "search" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500"}`}>Search</button>
              </div>
              {view === "browse" && (
                <>
                  <span className="min-w-0 flex-1 truncate px-1 text-sm font-semibold text-slate-800 sm:text-base">
                    {chapterTree ? chapterTree.title || `Chapter ${chapterTree.node_number}` : "Select a chapter"}
                  </span>
                  <ModeToggle mode={mode} setMode={setMode} />
                </>
              )}
              {view === "search" && <span className="flex-1" />}
            </div>
            {view === "browse" && mode === "reading" && (
              <div className="flex items-center justify-end gap-2 px-3 pb-2">
                <FontStepper fontScale={fontScale} setFontScale={setFontScale} />
              </div>
            )}
            {view === "browse" && mode === "reading" && chapterTree && <ReadingProgressBar containerRef={mainRef} />}
          </div>

          <main ref={mainRef} className="safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 md:p-6">
            {view === "search" ? (
              <SearchView onNavigateChapter={loadChapter} />
            ) : (
              <>
                {loading && (
                  <div className="mx-auto max-w-3xl space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="h-4 w-1/2 rounded bg-slate-200" />
                        <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                        <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
                      </div>
                    ))}
                  </div>
                )}
                {!loading && !chapterTree && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-slate-400">
                    <span className="text-4xl">📖</span>
                    <p className="text-lg font-medium text-slate-500">Select a chapter to start {mode === "reading" ? "reading" : "studying"}</p>
                    <p className="text-sm">Use the menu button or Search to find what you need.</p>
                  </div>
                )}
                {chapterTree && mode === "study" && (
                  <div className="mx-auto max-w-3xl">
                    {chapterTree.content && <p className="mb-4 rounded-xl bg-white p-4 text-base text-slate-600 shadow-card">{chapterTree.content}</p>}
                    <div className="space-y-1">
                      {chapterTree.children.map((section) => (
                        <StudyNodeRenderer key={section.id} node={section} level={0} onRefresh={refreshChapter} expandedSet={expandedNodeIds} scrollToId={scrollToNodeId} />
                      ))}
                    </div>
                  </div>
                )}
                {chapterTree && mode === "reading" && (
                  <div className="mx-auto max-w-[70ch]">
                    {chapterTree.content && <p className="mb-4 font-serif text-slate-700" style={{ fontSize: `${1.05 * fontScale}rem` }}>{chapterTree.content}</p>}
                    {chapterTree.children.map((section) => (
                      <ReadingNodeRenderer key={section.id} node={section} level={0} fontScale={fontScale} expandedSet={expandedNodeIds} scrollToId={scrollToNodeId} />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </HighlightUIContext.Provider>
  );
}
