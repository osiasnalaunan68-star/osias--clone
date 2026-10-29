import { useState, useCallback } from "react";
import {
  importIssuanceQuizJson, getPreviewQuizList, deletePreviewQuiz, clearPreviewQuiz,
  exportIssuanceQuizJson, exportAllQuizJson, issuanceQuizFileName,
  ISSUANCE_QUIZ_PROMPT, ISSUANCE_QUIZ_TEMPLATE,
} from "../issuanceQuizStore";

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

export default function IssuanceQuizPanel() {
  const [json, setJson] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const list = getPreviewQuizList();

  const handleImport = useCallback(() => {
    setError(null);
    setSuccess(null);
    try {
      const res = importIssuanceQuizJson(json);
      const missing = res.filter((r) => !r.found).map((r) => r.label);
      setSuccess(
        "✓ Quiz imported: " + res.map((r) => `${r.label} (L1: ${r.l1}, L2: ${r.l2})`).join(", ") + "." +
        (missing.length
          ? ` ⚠ ${missing.join(", ")} not in your CMO / CAO list yet — the 📝 Quiz button will appear once it is imported.`
          : " Test it in 📝 Quiz/Exam → CMO / CAO (or ☰ → CMO / CAO → 📝 Quiz).")
      );
      setJson("");
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }, [json]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(ISSUANCE_QUIZ_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Clipboard blocked. Long-press the text in the box below instead.");
    }
  };

  const handleDelete = (id, label) => {
    if (confirm(`Remove the quiz of ${label} from the dev preview?`)) { deletePreviewQuiz(id); refresh(); }
  };
  const handleClear = () => {
    if (confirm("Remove ALL dev-preview CMO / CAO quizzes?")) { clearPreviewQuiz(); refresh(); }
  };

  const btn = "min-h-[40px] rounded-lg border px-3 py-1.5 text-sm font-medium";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-base font-bold text-navy-900 dark:text-slate-100">CMO / CAO quiz import</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Copy the quiz prompt, paste it in ChatGPT / Gemini, then paste the official CMO/CAO text below it.</li>
          <li>Paste the JSON here. Level 1 = definition / identification, Level 2 = real case. All A–D.</li>
          <li>The quiz attaches itself to the CMO/CAO with the same type + number. Import order doesn't matter.</li>
          <li>Check it in 📝 Quiz/Exam → CMO / CAO list (or ☰ → CMO / CAO → 📝 Quiz).</li>
          <li>Download the file and put it in <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">frontend/src/data/issuance-quizzes/</code> so it ships to users.</li>
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={copyPrompt} className={`${btn} border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400`}>
            {copied ? "✓ Prompt copied" : "📋 Copy AI prompt"}
          </button>
          <button onClick={() => setJson(ISSUANCE_QUIZ_TEMPLATE)} className={`${btn} border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300`}>
            🧩 Insert template
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={10}
          placeholder="Paste quiz JSON here — one CMO/CAO, or an array of many. Code fences are fine."
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
                <button key={t} onClick={() => download(`${t.toLowerCase()}-quizzes-all.json`, exportAllQuizJson(t))} className={`${btn} border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300`}>
                  ⬇ All {t}
                </button>
              ))}
              <button onClick={handleClear} className={`${btn} border-red-200 text-red-600 dark:border-red-800 dark:text-red-400`}>Clear</button>
            </div>
          )}
        </div>
        {list.length === 0 && <p className="text-sm text-slate-400">No quiz imported yet.</p>}
        <ul className="space-y-2">
          {list.map((it) => (
            <li key={it.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900 dark:text-slate-100">{it.label}</p>
                  <p className="text-xs text-slate-400">🟢 L1: {it.l1} questions · 🔵 L2: {it.l2} questions</p>
                  {!it.hasIssuance && <p className="text-xs text-amber-600 dark:text-amber-400">⚠ {it.label} isn't imported yet — no Quiz button until it is.</p>}
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <button onClick={() => download(issuanceQuizFileName(it.id), exportIssuanceQuizJson(it.id))} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">⬇ JSON</button>
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
