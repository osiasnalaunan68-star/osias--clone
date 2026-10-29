import { useState, useCallback } from "react";
import {
  importIssuanceJson, getPreviewList, deletePreviewIssuance, clearPreview,
  exportIssuanceJson, exportManyJson, issuanceFileName,
  ISSUANCE_PROMPT, ISSUANCE_TEMPLATE, STATUS_META,
} from "../issuancesStore";

function download(name, text) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function IssuancePanel() {
  const [json, setJson] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const list = getPreviewList();

  const handleImport = useCallback(() => {
    setError(null);
    setSuccess(null);
    try {
      const res = importIssuanceJson(json);
      setSuccess(
        "✓ Imported " + res.map((r) => `${r.label} (${r.paragraphCount} paragraphs, ${r.aiCount} explained)`).join(", ") +
        ". Open ☰ → CMO / CAO to preview."
      );
      setJson("");
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }, [json]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(ISSUANCE_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Clipboard blocked. Long-press the text in the box below instead.");
    }
  };

  const handleDelete = (id, label) => {
    if (confirm(`Remove ${label} from the dev preview?`)) { deletePreviewIssuance(id); refresh(); }
  };
  const handleClear = () => {
    if (confirm("Remove ALL dev-preview CMOs / CAOs?")) { clearPreview(); refresh(); }
  };

  const btn = "min-h-[40px] rounded-lg border px-3 py-1.5 text-sm font-medium";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-base font-bold text-navy-900 dark:text-slate-100">CMO / CAO import</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Copy the AI prompt, paste it in ChatGPT / Gemini, then paste the official CMO/CAO text below it.</li>
          <li>Paste the JSON the AI gives you here (official paragraphs + Tagalog explanations in one go).</li>
          <li>Import, then check it in ☰ → CMO / CAO.</li>
          <li>Download the file and put it in <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">frontend/src/data/issuances/</code> so it ships to users.</li>
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={copyPrompt} className={`${btn} border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400`}>
            {copied ? "✓ Prompt copied" : "📋 Copy AI prompt"}
          </button>
          <button onClick={() => setJson(ISSUANCE_TEMPLATE)} className={`${btn} border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300`}>
            🧩 Insert template
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={10}
          placeholder="Paste JSON here — one CMO/CAO, or an array of many. Code fences are fine."
          style={{ fontSize: "16px" }}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-slate-800 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        {error && <p className="mt-2 rounded-lg bg-red-50 p-2.5 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">⚠️ {error}</p>}
        {success && <p className="mt-2 rounded-lg bg-emerald-50 p-2.5 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{success}</p>}
        <div className="mt-2 flex justify-end">
          <button onClick={handleImport} disabled={!json.trim()} className="min-h-[42px] rounded-lg bg-navy-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">
            Import
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Dev preview ({list.length})</h3>
          {list.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {["CMO", "CAO"].filter((t) => list.some((i) => i.type === t)).map((t) => (
                <button key={t} onClick={() => download(`${t.toLowerCase()}-all.json`, exportManyJson(t))} className={`${btn} border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300`}>
                  ⬇ All {t}
                </button>
              ))}
              <button onClick={handleClear} className={`${btn} border-red-200 text-red-600 dark:border-red-800 dark:text-red-400`}>Clear</button>
            </div>
          )}
        </div>
        {list.length === 0 && <p className="text-sm text-slate-400">Nothing imported yet.</p>}
        <ul className="space-y-2">
          {list.map((it) => (
            <li key={it.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900 dark:text-slate-100">
                    {it.label} <span className="text-xs font-normal text-slate-400">· {STATUS_META[it.status]?.label}</span>
                  </p>
                  {it.title && <p className="truncate text-sm text-slate-500 dark:text-slate-400">{it.title}</p>}
                  <p className="text-xs text-slate-400">{it.paragraphCount} paragraphs · 🤖 {it.aiCount} explained</p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <button onClick={() => download(issuanceFileName(it.id), exportIssuanceJson(it.id))} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">⬇ JSON</button>
                  <button onClick={() => handleDelete(it.id, it.label)} className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">✕</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
