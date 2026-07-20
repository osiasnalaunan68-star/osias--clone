import { useState, useEffect, useCallback } from "react";
import {
  getAllBatches, getBatchEntries, importChapterJson, renameBatch,
  updateEntry, deleteEntry, deleteBatch,
  getExportAllJson, saveRawEntries, clearAllImports, getImportedCount,
} from "../devImportStore";

function EntryEditForm({ entry, onSave, onCancel }) {
  const [title, setTitle] = useState(entry.title || "");
  const [content, setContent] = useState(entry.content || "");
  const [prompt, setPrompt] = useState(entry.prompt || "");
  const save = () => onSave({ title, content, prompt });
  return (
    <div className="mt-2 space-y-2 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-800 dark:bg-amber-950/20">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={{ fontSize: "16px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" rows={6} style={{ fontSize: "16px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Prompt" rows={3} style={{ fontSize: "16px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400">Cancel</button>
        <button onClick={save} className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white">Save</button>
      </div>
    </div>
  );
}

function EntryRow({ nodeId, entry, onChanged }) {
  const [editing, setEditing] = useState(false);
  const label = entry._label || entry.title || nodeId;
  const handleSave = (fields) => { updateEntry(nodeId, fields); setEditing(false); onChanged(); };
  const handleDelete = () => { if (confirm(`Delete entry id ${nodeId}?`)) { deleteEntry(nodeId); onChanged(); } };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">#{nodeId} — {label}</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">{(entry.content || "").slice(0, 70)}...</p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={() => setEditing((v) => !v)} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">Edit</button>
          <button onClick={handleDelete} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">Delete</button>
        </div>
      </div>
      {editing && <EntryEditForm entry={entry} onSave={handleSave} onCancel={() => setEditing(false)} />}
    </div>
  );
}

function BatchCard({ batch, onChanged }) {
  const [open, setOpen] = useState(false);
  const entries = open ? getBatchEntries(batch.id) : [];
  const handleDeleteBatch = () => {
    if (confirm(`Delete the whole "${batch.label}" batch (${batch.nodeIds.length} entries)?`)) {
      deleteBatch(batch.id);
      onChanged();
    }
  };
  const handleRename = () => {
    const next = prompt("Rename this chapter label:", batch.label);
    if (next !== null) { renameBatch(batch.id, next); onChanged(); }
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{open ? "▾" : "▸"} {batch.label}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{batch.nodeIds.length} entries · {new Date(batch.importedAt).toLocaleString()}</p>
        </button>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={handleRename} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">✏️</button>
          <button onClick={handleDeleteBatch} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">Delete</button>
        </div>
      </div>
      {open && (
        <div className="mt-3 space-y-2">
          {entries.map((e) => <EntryRow key={e.id} nodeId={e.id} entry={e} onChanged={onChanged} />)}
        </div>
      )}
    </div>
  );
}

function ImportForm({ onImported }) {
  const [json, setJson] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleImport = () => {
    setError(null); setSuccess(null);
    try {
      const { count, label } = importChapterJson(json);
      setSuccess(`✓ Na-import ang ${count} entries bilang "${label}".`);
      setJson("");
      onImported();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-3 shadow-card dark:border-navy-700 dark:bg-slate-800">
      <p className="mb-1 text-sm font-semibold text-navy-900 dark:text-slate-100">📥 Import AI Context JSON</p>
      <p className="mb-2 text-xs text-slate-400 dark:text-slate-500">I-paste lang at Import — isang bagsakan. Optional: maglagay ng "_chapter" key sa JSON para may custom label.</p>
      <textarea value={json} onChange={(e) => setJson(e.target.value)} placeholder='{ "_chapter": "Chapter 1", "393": {...}, "193": {...} }' rows={9} style={{ fontSize: "16px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}
      <button onClick={handleImport} disabled={!json.trim()} className="mt-2 w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">Import</button>
    </div>
  );
}

function RawJsonEditor({ onChanged }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const openEditor = () => { setText(getExportAllJson()); setOpen(true); setError(null); };
  const handleSave = () => {
    try {
      saveRawEntries(text);
      setError(null); setSaved(true);
      onChanged();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <button onClick={() => (open ? setOpen(false) : openEditor())} className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        🔧 {open ? "Hide" : "Edit"} Raw JSON (advanced, buong imported data)
      </button>
      {open && (
        <div className="mt-2">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} style={{ fontSize: "13px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          {saved && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">✓ Saved.</p>}
          <button onClick={handleSave} className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white">Save Raw JSON</button>
        </div>
      )}
    </div>
  );
}

export default function DevPanel() {
  const [batches, setBatches] = useState([]);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(() => setBatches(getAllBatches()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const handleExportAll = async () => {
    try { await navigator.clipboard.writeText(getExportAllJson()); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClearAll = () => {
    if (confirm(`Delete ALL ${getImportedCount()} imported entries? Hindi na ito mababawi.`)) {
      clearAllImports();
      refresh();
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">🛠 Dev Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Import at pamahalaan ang AI-generated context. Naka-save ito sa device kahit tanggalin mo pa itong tab.</p>
      </div>
      <ImportForm onImported={refresh} />
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">📦 Buong Imported JSON ({getImportedCount()} entries)</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportAll} className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">📋 Export All (copy)</button>
          <button onClick={handleClearAll} className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 dark:border-red-800 dark:text-red-400">🗑 Delete All</button>
        </div>
        {copied && <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Na-copy! I-paste sa frontend/src/data/aiContext.json para permanente sa lahat ng users.</p>}
      </div>
      <RawJsonEditor onChanged={refresh} />
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Imported Chapters</p>
        {batches.length === 0 && <p className="text-sm italic text-slate-400 dark:text-slate-600">Wala pang na-import.</p>}
        {batches.map((b) => <BatchCard key={b.id} batch={b} onChanged={refresh} />)}
      </div>
    </div>
  );
}
