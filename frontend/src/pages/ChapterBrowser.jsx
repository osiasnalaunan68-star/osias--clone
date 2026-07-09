import { useState, useEffect, useCallback, useRef, useMemo, useContext, createContext } from "react";

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
      .catch((err) => { if (!ignore) console.error("Failed to load highlights", err); });
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
    try {
      await fetch(`${API_BASE}/api/highlights/${hlId}`, { method: "DELETE" });
      setHighlights((prev) => prev.filter((h) => h.id !== hlId));
    } catch (e) { console.error(e); }
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
    <div style={{ position: "fixed", left: x, top: y, zIndex: 100 }} className="bg-white border shadow-lg rounded-lg px-2 py-2 flex gap-2 text-sm">
      {kind === "existing" ? (
        <>
          <button onClick={onDelete} className="text-red-600 px-2 py-1.5 min-h-[36px]">Remove highlight</button>
          <button onClick={onCancel} className="px-2 py-1.5 min-h-[36px]">Close</button>
        </>
      ) : (
        <>
          <button onClick={onSave} className="text-green-700 font-medium px-2 py-1.5 min-h-[36px]">Highlight</button>
          <button onClick={onCancel} className="px-2 py-1.5 min-h-[36px]">Cancel</button>
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
      setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 160)), y: rect.bottom + 8, kind: "selection" });
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [armed]);
  const handleMarkClick = (e, hlId) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 160)), y: rect.bottom + 8, kind: "existing", hlId });
    setPendingSelection(null);
  };
  const closeToolbar = () => { setToolbar(null); setPendingSelection(null); window.getSelection()?.removeAllRanges(); };
  const confirmHighlight = async () => { if (!pendingSelection) return; await addHighlight(pendingSelection.start, pendingSelection.end); closeToolbar(); };
  const confirmDelete = async () => { if (!toolbar?.hlId) return; await removeHighlight(toolbar.hlId); closeToolbar(); };
  const segments = applyHighlights(content, highlights);
  return (
    <div className="relative">
      <div ref={containerRef} className={`${className} ${armed ? "bg-yellow-50 outline outline-1 outline-dashed outline-yellow-400 rounded" : ""}`}>
        {segments.map((seg, i) =>
          seg.highlightId ? (
            <mark key={i} style={{ backgroundColor: seg.color }} className="cursor-pointer rounded-sm" onClick={(e) => handleMarkClick(e, seg.highlightId)}>{seg.text}</mark>
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
    <div className="mt-1" onClick={(e) => e.stopPropagation()}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ fontSize: "16px" }} className="w-full border rounded p-2 leading-relaxed" rows={Math.max(3, text.split("\n").length)} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button onClick={save} disabled={saving} className="text-sm px-3 py-2 min-h-[40px] bg-green-500 text-white rounded disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
        <button onClick={onCancel} className="text-sm px-3 py-2 min-h-[40px] bg-gray-200 rounded">Cancel</button>
      </div>
    </div>
  );
}

const STUDY_TYPE_STYLES = {
  chapter: "text-2xl font-bold text-blue-800 mb-1",
  section: "text-xl font-semibold text-gray-800 mb-0.5",
  paragraph: "text-lg text-gray-700",
  subparagraph: "text-base text-gray-600",
  item: "text-sm text-gray-500",
};

function StudyNodeRenderer({ node, level = 0, onRefresh }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const { activeHighlightNodeId, setActiveHighlightNodeId } = useHighlightUI();
  const isHighlighting = activeHighlightNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isExpandable = hasChildren || !!node.content;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, expanded);

  const toggle = (e) => { e.stopPropagation(); if (isExpandable) setExpanded((v) => !v); };

  return (
    <div style={{ marginLeft: `${Math.min(level, 6) * 0.9}rem` }} className="my-1">
      <div onClick={toggle} role="button" tabIndex={0} className="flex items-start gap-2 px-2 py-2 rounded hover:bg-gray-100 active:bg-gray-200 cursor-pointer touch-manipulation">
        <span className="text-sm text-gray-400 mt-1 flex-shrink-0 select-none w-4">{isExpandable ? (expanded ? "▼" : "▶") : ""}</span>
        <div className="min-w-0 flex-1">
          <span className={STUDY_TYPE_STYLES[node.node_type] || "text-sm"}>
            {node.node_type === "section" && `Section ${node.node_number}: `}
            {node.node_type === "chapter" && `Chapter ${node.node_number}: `}
            {node.title || node.node_number}
          </span>
          {expanded && node.content && (
            <div onClick={(e) => e.stopPropagation()}>
              {editing ? (
                <EditBox nodeId={node.id} initialContent={node.content} onSaved={() => { setEditing(false); onRefresh(); }} onCancel={() => setEditing(false)} />
              ) : (
                <>
                  <HighlightableContent nodeId={node.id} content={node.content} highlights={highlights} addHighlight={addHighlight} removeHighlight={removeHighlight} armed={isHighlighting} className="text-base text-gray-700 select-text p-2 rounded leading-relaxed" />
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => setEditing(true)} className="text-sm text-gray-600 border px-3 py-2 min-h-[40px] rounded active:bg-gray-100">✎ Edit</button>
                    <button onClick={() => setActiveHighlightNodeId(isHighlighting ? null : node.id)} className={`text-sm px-3 py-2 min-h-[40px] rounded border ${isHighlighting ? "bg-yellow-200 border-yellow-400" : "bg-green-100 border-green-300 active:bg-green-200"}`}>
                      {isHighlighting ? "Select text to highlight…" : "🖍 Highlight"}
                    </button>
                  </div>
                  {node.cross_references && node.cross_references.length > 0 && (
                    <div className="mt-2 text-sm" onClick={(e) => e.stopPropagation()}>
                      <span className="font-medium">See Also:</span>
                      <ul className="list-disc ml-4">
                        {node.cross_references.map((ref, idx) => (
                          <li key={idx}>
                            {ref.url ? (
                              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{ref.text}</a>
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
            <div className="flex flex-wrap gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
              {node.keywords.map((kw) => <span key={kw} className="bg-gray-200 text-gray-600 text-sm px-2 py-0.5 rounded-full">{kw}</span>)}
            </div>
          )}
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => <StudyNodeRenderer key={child.id} node={child} level={level + 1} onRefresh={onRefresh} />)}
        </div>
      )}
    </div>
  );
}

const READING_TYPE_STYLES = {
  chapter: "font-bold text-blue-900 mb-2",
  section: "font-semibold text-gray-900 mb-1",
  paragraph: "text-gray-800",
  subparagraph: "text-gray-800",
  item: "text-gray-700",
};

function ReadingNodeRenderer({ node, level = 0, fontScale }) {
  const hasChildren = node.children && node.children.length > 0;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, !!node.content);
  const headingSize = node.node_type === "chapter" ? 1.5 : node.node_type === "section" ? 1.25 : 1;
  return (
    <div style={{ marginLeft: `${Math.min(level, 4) * 0.6}rem` }} className="my-3">
      <div className={`font-serif ${READING_TYPE_STYLES[node.node_type] || "text-gray-800"}`} style={{ fontSize: `${headingSize * fontScale}rem` }}>
        {node.node_type === "section" && `Section ${node.node_number}. `}
        {node.node_type === "chapter" && `Chapter ${node.node_number}. `}
        {node.title || node.node_number}
      </div>
      {node.content && (
        <HighlightableContent nodeId={node.id} content={node.content} highlights={highlights} addHighlight={addHighlight} removeHighlight={removeHighlight} armed={true} className="font-serif text-gray-800 leading-loose select-text" />
      )}
      {node.cross_references && node.cross_references.length > 0 && (
        <div className="mt-2 text-sm font-sans">
          <span className="font-medium">See Also:</span>
          <ul className="list-disc ml-4">
            {node.cross_references.map((ref, idx) => (
              <li key={idx}>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{ref.text}</a>
                ) : (
                  <span>{ref.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {hasChildren && node.children.map((child) => <ReadingNodeRenderer key={child.id} node={child} level={level + 1} fontScale={fontScale} />)}
    </div>
  );
}

function ModeToggle({ mode, setMode }) {
  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1 text-sm flex-shrink-0" role="tablist" aria-label="View mode">
      <button role="tab" aria-selected={mode === "study"} onClick={() => setMode("study")} className={`px-3 py-1.5 rounded-full min-h-[36px] transition ${mode === "study" ? "bg-blue-600 text-white font-medium" : "text-gray-600"}`}>📘 Study</button>
      <button role="tab" aria-selected={mode === "reading"} onClick={() => setMode("reading")} className={`px-3 py-1.5 rounded-full min-h-[36px] transition ${mode === "reading" ? "bg-blue-600 text-white font-medium" : "text-gray-600"}`}>📖 Reading</button>
    </div>
  );
}

function FontStepper({ fontScale, setFontScale }) {
  const clamp = (v) => Math.min(1.6, Math.max(0.85, v));
  return (
    <div className="flex items-center gap-1 text-sm">
      <button onClick={() => setFontScale((s) => clamp(s - 0.1))} className="w-9 h-9 rounded-full border flex items-center justify-center active:bg-gray-100">A-</button>
      <button onClick={() => setFontScale((s) => clamp(s + 0.1))} className="w-9 h-9 rounded-full border flex items-center justify-center active:bg-gray-100">A+</button>
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
  return <div className="h-1 bg-gray-100 w-full"><div className="h-1 bg-blue-600 transition-all" style={{ width: `${pct}%` }} /></div>;
}

export default function ChapterBrowser() {
  const [titles, setTitles] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTitleNumber, setSelectedTitleNumber] = useState(null);
  const [chapterTree, setChapterTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 768);
  const [mode, setMode] = useState(() => typeof window === "undefined" ? "study" : localStorage.getItem(MODE_KEY) || "study");
  const [fontScale, setFontScale] = useState(() => { if (typeof window === "undefined") return 1; const saved = parseFloat(localStorage.getItem(FONT_KEY)); return Number.isFinite(saved) ? saved : 1; });
  const [activeHighlightNodeId, setActiveHighlightNodeId] = useState(null);
  const mainRef = useRef(null);

  useEffect(() => localStorage.setItem(MODE_KEY, mode), [mode]);
  useEffect(() => localStorage.setItem(FONT_KEY, String(fontScale)), [fontScale]);

  useEffect(() => {
    fetch(`${API_BASE}/api/titles`).then(r => r.json()).then(setTitles).catch(err => setError(err.message));
  }, []);

  const loadChapter = useCallback(async (chapterNumber, titleNumber = null) => {
    setLoading(true); setError(null);
    try {
      const url = titleNumber ? `${API_BASE}/api/chapter/${chapterNumber}?title_number=${encodeURIComponent(titleNumber)}` : `${API_BASE}/api/chapter/${chapterNumber}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Chapter not found");
      const data = await res.json();
      setChapterTree(data);
      setSelectedChapter(chapterNumber);
      setSelectedTitleNumber(titleNumber);
      setSidebarOpen(window.innerWidth >= 768);
      if (mainRef.current) mainRef.current.scrollTop = 0;
    } catch (err) { setError(err.message); setChapterTree(null); } finally { setLoading(false); }
  }, []);

  const refreshChapter = () => { if (selectedChapter) loadChapter(selectedChapter, selectedTitleNumber); };

  const highlightUIValue = useMemo(() => ({ activeHighlightNodeId, setActiveHighlightNodeId }), [activeHighlightNodeId]);

  return (
    <HighlightUIContext.Provider value={highlightUIValue}>
      <div className="flex h-screen relative overflow-hidden bg-white" style={{ height: "100dvh" }}>
        {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}
        <aside className={`w-72 max-w-[85vw] bg-white border-r overflow-y-auto overscroll-contain z-40 fixed md:static inset-y-0 left-0 transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <div className="p-4">
            <h2 className="text-xl font-bold text-blue-900 mb-4">RA 10863</h2>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {titles.map((titleGroup) => (
              <div key={titleGroup.title_number || "root"} className="mb-3">
                <h3 className="text-lg font-semibold text-blue-800 mb-1">{titleGroup.title_number ? `TITLE ${titleGroup.title_number}` : titleGroup.title_title}</h3>
                <ul className="space-y-1 ml-2">
                  {titleGroup.chapters.map((ch) => (
                    <li key={ch.id}>
                      <button onClick={() => loadChapter(ch.node_number, titleGroup.title_number)} className={`w-full text-left px-2 py-2 min-h-[44px] rounded text-base ${selectedChapter === ch.node_number && selectedTitleNumber === titleGroup.title_number ? "bg-blue-100 text-blue-900 font-medium" : "active:bg-gray-100 text-gray-700"}`}>
                        Ch. {ch.node_number}: {ch.title} <span className="text-sm text-gray-400 ml-1">({ch.section_count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="sticky top-0 z-20 bg-white border-b">
            <div className="flex items-center gap-2 px-3 py-2">
              <button onClick={() => setSidebarOpen(v => !v)} className="w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100 text-xl flex-shrink-0 touch-manipulation">{sidebarOpen ? "✕" : "☰"}</button>
              <span className="flex-1 min-w-0 truncate font-medium text-gray-800">{chapterTree ? chapterTree.title || `Chapter ${chapterTree.node_number}` : "RA 10863 Browser"}</span>
              <ModeToggle mode={mode} setMode={setMode} />
            </div>
            {mode === "reading" && <div className="flex items-center justify-end gap-2 px-3 pb-2"><FontStepper fontScale={fontScale} setFontScale={setFontScale} /></div>}
            {mode === "reading" && chapterTree && <ReadingProgressBar containerRef={mainRef} />}
          </div>
          <main ref={mainRef} className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-6 bg-gray-50">
            {loading && <p className="text-gray-500 italic text-base">Loading chapter…</p>}
            {!loading && !chapterTree && <div className="flex items-center justify-center h-full text-gray-400 text-lg text-center px-6">Select a chapter from the list to start {mode === "reading" ? "reading" : "studying"}.</div>}
            {chapterTree && mode === "study" && (
              <div>
                {chapterTree.content && <p className="text-gray-600 mb-4 text-base">{chapterTree.content}</p>}
                <div className="space-y-1">{chapterTree.children.map(section => <StudyNodeRenderer key={section.id} node={section} level={0} onRefresh={refreshChapter} />)}</div>
              </div>
            )}
            {chapterTree && mode === "reading" && (
              <div className="max-w-[65ch] mx-auto">
                {chapterTree.content && <p className="font-serif text-gray-700 mb-4" style={{ fontSize: `${1.05 * fontScale}rem` }}>{chapterTree.content}</p>}
                {chapterTree.children.map(section => <ReadingNodeRenderer key={section.id} node={section} level={0} fontScale={fontScale} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </HighlightUIContext.Provider>
  );
}
