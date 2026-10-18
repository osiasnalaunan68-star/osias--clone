import { useMemo, useState } from "react";
import {
  getCustomQuestions, getSortedCustomQuestionIds,
  addCustomQuestion, updateCustomQuestion, deleteCustomQuestion,
} from "../customQuizStore";

const EMPTY_FORM = { question: "", A: "", B: "", C: "", D: "", correct: "A", reason: "" };

function QuestionForm({ theme, initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const filledChoiceKeys = ["A", "B", "C", "D"].filter((k) => form[k].trim());
  const canSave = form.question.trim() && filledChoiceKeys.length >= 2 && filledChoiceKeys.includes(form.correct);

  const handleSave = () => {
    if (!canSave) return;
    const choices = {};
    filledChoiceKeys.forEach((k) => { choices[k] = form[k].trim(); });
    onSave({ question: form.question.trim(), choices, correct: form.correct, reason: form.reason.trim() });
  };

  return (
    <div className={`mb-4 rounded-2xl border-2 p-4 shadow-md ${theme.card}`}>
      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Question</label>
      <textarea
        value={form.question}
        onChange={(e) => setField("question", e.target.value)}
        rows={2}
        placeholder="Type the question here…"
        className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-navy-500"
      />

      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Choices (A and B required, C/D optional)</label>
      <div className="mb-3 space-y-2">
        {["A", "B", "C", "D"].map((k) => (
          <div key={k} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => form[k].trim() && setField("correct", k)}
              title={form[k].trim() ? "Mark as the correct answer" : ""}
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                form.correct === k && form[k].trim()
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {k}
            </button>
            <input
              type="text"
              value={form[k]}
              onChange={(e) => setField(k, e.target.value)}
              placeholder={k === "A" || k === "B" ? `Choice ${k}` : `Choice ${k} (optional)`}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-navy-500"
            />
          </div>
        ))}
      </div>
      <p className={`mb-3 text-xs ${theme.subtext}`}>👆 Tap a letter to mark it as the correct answer. Currently correct: <strong>{form.correct}</strong></p>

      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Reason (why the answer is correct)</label>
      <textarea
        value={form.reason}
        onChange={(e) => setField("reason", e.target.value)}
        rows={2}
        placeholder={`Because ${form.correct} is…`}
        className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-navy-500"
      />

      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium ${theme.outlineBtn}`}>Cancel</button>
        <button type="button" onClick={handleSave} disabled={!canSave} className={`flex-[2] rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-40 ${theme.accentBtn}`}>💾 Save Question</button>
      </div>
    </div>
  );
}

function QuestionBox({ id, item, theme, onEdit, onDelete }) {
  const choiceKeys = Object.keys(item.choices || {});
  return (
    <div className={`rounded-2xl border-2 p-4 shadow-md ${theme.card}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className={`inline-flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold ${theme.chip}`}>{id}</span>
        <div className="flex flex-shrink-0 gap-1">
          <button onClick={onEdit} aria-label="Edit" className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${theme.outlineBtn}`}>✏️ Edit</button>
          <button onClick={onDelete} aria-label="Delete" className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${theme.dangerBtn}`}>🗑️</button>
        </div>
      </div>
      <p className={`mb-2 text-sm font-medium ${theme.text}`}>{item.question}</p>
      <div className="mb-1 flex flex-wrap gap-1.5">
        {choiceKeys.map((k) => (
          <span key={k} className={`rounded-md px-2 py-0.5 text-xs ${k === item.correct ? "bg-emerald-100 font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : theme.chip}`}>
            {k}. {item.choices[k]}
          </span>
        ))}
      </div>
      {item.reason && <p className={`mt-2 text-xs italic ${theme.subtext}`}>💡 {item.reason}</p>}
    </div>
  );
}

export default function CustomQuizManage({ subject, theme, onBack }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const entries = useMemo(() => getCustomQuestions(subject.id), [subject.id, refreshKey]);
  const ids = useMemo(() => getSortedCustomQuestionIds(subject.id), [subject.id, refreshKey]);

  const openAdd = () => { setEditingId(null); setFormOpen(true); };
  const openEdit = (id) => { setEditingId(id); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingId(null); };

  const handleSave = (data) => {
    if (editingId) {
      updateCustomQuestion(subject.id, editingId, data);
    } else {
      addCustomQuestion(subject.id, data);
    }
    setRefreshKey((k) => k + 1);
    closeForm();
  };

  const handleDelete = (id) => {
    if (!confirm(`Delete question #${id}? This cannot be undone.`)) return;
    deleteCustomQuestion(subject.id, id);
    setRefreshKey((k) => k + 1);
  };

  const editingInitial = editingId
    ? (() => {
        const item = entries[editingId];
        return { question: item.question || "", A: item.choices?.A || "", B: item.choices?.B || "", C: item.choices?.C || "", D: item.choices?.D || "", correct: item.correct || "A", reason: item.reason || "" };
      })()
    : null;

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${theme.subtext}`}>← Back</button>
        <span className={`flex items-center gap-1.5 text-sm font-semibold ${theme.text}`}>
          <span style={{ backgroundColor: subject.color }} className="flex h-6 w-6 items-center justify-center rounded-full text-sm">{subject.icon}</span>
          {subject.name}
        </span>
      </div>

      {!formOpen && (
        <button onClick={openAdd} className={`mb-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${theme.accentBtn}`}>
          ➕ Add Question
        </button>
      )}

      {formOpen && <QuestionForm key={editingId || "new"} theme={theme} initial={editingInitial} onSave={handleSave} onCancel={closeForm} />}

      {ids.length === 0 ? (
        <p className={`rounded-xl border border-dashed p-6 text-center text-sm ${theme.card} ${theme.subtext}`}>No questions yet. Start with "➕ Add Question" above.</p>
      ) : (
        <div className="space-y-3">
          {ids.map((id) => (
            <QuestionBox key={id} id={id} item={entries[id]} theme={theme} onEdit={() => openEdit(id)} onDelete={() => handleDelete(id)} />
          ))}
        </div>
      )}
    </div>
  );
}
