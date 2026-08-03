import { useState, useEffect, useCallback } from "react";
import {
  getAllBatches, getBatchEntries, importSubjectQuizJson,
  renameBatch, deleteBatch, getExportAllJson,
  saveRawEntries, clearAllImports, getImportedCount,
} from "../subjectQuizStore";

function BatchCard({ subjectId, batch, onChanged }) {
  const [open, setOpen] = useState(false);
  const entries = open ? getBatchEntries(subjectId, batch.id) : [];

  const handleDelete = () => {
    if (confirm(`Delete the "${batch.label}" batch (${batch.itemIds.length} items)?`)) {
      deleteBatch(subjectId, batch.id);
      onChanged();
    }
  };
  const handleRename = () => {
    const next = prompt("Rename this batch:", batch.label);
    if (next !== null) { renameBatch(subjectId, batch.id, next); onChanged(); }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{open ? "▾" : "▸"} {batch.label}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{batch.itemIds.length} items · {new Date(batch.importedAt).toLocaleString()}</p>
        </button>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={handleRename} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">✏️</button>
          <button onClick={handleDelete} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">Delete</button>
        </div>
      </div>
      {open && (
        <div className="space-y-2">
          {entries.map((e) => (
            <div key={e.id} className="rounded-lg bg-slate-50 p-2.5 text-sm dark:bg-slate-900/40">
              <p className="font-semibold text-slate-700 dark:text-slate-200">#{e.id}: {e.question}</p>
              {e.choices && (
                <ul className="mt-1 space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {Object.entries(e.choices).map(([k, v]) => (
                    <li key={k} className={k === e.correct ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}>{k}. {v}</li>
                  ))}
                </ul>
              )}
              {!e.choices && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Answer: {e.correct}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImportForm({ subjectId, subjectLabel, onImported }) {
  const [json, setJson] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleImport = () => {
    setError(null); setSuccess(null);
    try {
      const { count, label } = importSubjectQuizJson(subjectId, json);
      setSuccess(`✓ Imported. "${label}" batch saved — ${count} total items ngayon para sa ${subjectLabel}.`);
      setJson("");
      onImported();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-3 shadow-card dark:border-navy-700 dark:bg-slate-800">
      <p className="mb-1 text-sm font-semibold text-navy-900 dark:text-slate-100">📥 Import {subjectLabel} Quiz JSON</p>
      <p className="mb-2 text-xs text-slate-400 dark:text-slate-500">
        Flat format, walang levels — isang entry per item number. Optional "_batch" label para
        ma-group ang import na ito (same "_batch" name = mag-me-merge, hindi mag-duduplicate).
      </p>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder={`{\n  "_batch": "Items 1-10",\n  "1": { "question": "...", "choices": {"A":"...","B":"...","C":"..."}, "correct": "A", "reason": "..." }\n}`}
        rows={9}
        style={{ fontSize: "16px" }}
        className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}
      <button onClick={handleImport} disabled={!json.trim()} className="mt-2 w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">Import</button>
    </div>
  );
}

function RawEditor({ subjectId, onChanged }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const openEditor = () => { setText(getExportAllJson(subjectId)); setOpen(true); setError(null); };
  const handleSave = () => {
    try {
      saveRawEntries(subjectId, text);
      setError(null); setSaved(true);
      onChanged();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <button onClick={() => (open ? setOpen(false) : openEditor())} className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        🔧 {open ? "Hide" : "Edit"} Raw Quiz JSON (advanced, lahat ng imported items)
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

export default function SubjectQuizPanel({ subjectId, subjectLabel }) {
  const [batches, setBatches] = useState([]);
  const [downloaded, setDownloaded] = useState(false);

  const refresh = useCallback(() => setBatches(getAllBatches(subjectId)), [subjectId]);
  useEffect(() => { refresh(); }, [refresh]);

  const handleExportAll = () => {
    const json = getExportAllJson(subjectId);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${subjectId}-export-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  const handleClearAll = () => {
    if (confirm(`Delete ALL ${getImportedCount(subjectId)} imported ${subjectLabel} items? Hindi na mababawi ito.`)) {
      clearAllImports(subjectId);
      refresh();
    }
  };

  return (
    <div className="space-y-4">
      <ImportForm subjectId={subjectId} subjectLabel={subjectLabel} onImported={refresh} />

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">📦 All Imported {subjectLabel} Items ({getImportedCount(subjectId)})</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportAll} className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">⬇️ Export All (download)</button>
          <button onClick={handleClearAll} className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 dark:border-red-800 dark:text-red-400">🗑 Delete All</button>
        </div>
        {downloaded && <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Downloaded JSON file.</p>}
      </div>

      <RawEditor subjectId={subjectId} onChanged={refresh} />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Imported Batches</p>
        {batches.length === 0 && <p className="text-sm italic text-slate-400 dark:text-slate-600">Wala pang imported na batch para sa {subjectLabel}.</p>}
        {batches.map((b) => <BatchCard key={b.id} subjectId={subjectId} batch={b} onChanged={refresh} />)}
      </div>
    </div>
  );
}
