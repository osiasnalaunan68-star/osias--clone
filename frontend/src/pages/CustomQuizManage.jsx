import { useMemo, useState } from "react";
import {
  getCustomQuestions, getSortedCustomQuestionIds,
  addCustomQuestion, updateCustomQuestion, deleteCustomQuestion,
} from "../customQuizStore";

const IconSave = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 4h11l3 3v13H5Z" /><path d="M8 4v5h7V4M8 13h8v7H8Z" />
  </svg>
);
const IconEdit = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </svg>
);
const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconPoint = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M7 11l5-7 5 7" /><path d="M12 4v13" /><path d="M8 20h8" />
  </svg>
);
const IconInfo = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8v.01" />
  </svg>
);

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
    <div className={`mb-4 rounded-lg border-2 p-4 ${theme.card}`}>
      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Question</label>
      <textarea
        value={form.question}
        onChange={(e) => setField("question", e.target.value)}
        rows={2}
        placeholder="Type the question here…"
        className="mb-3 w-full rounded-lg border border-parchment-200 bg-parchment-50 px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-parchment-50 dark:focus:ring-gold-500"
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
              className="flex-1 rounded-lg border border-parchment-200 bg-parchment-50 px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-parchment-50 dark:focus:ring-gold-500"
            />
          </div>
        ))}
      </div>
      <p className={`mb-3 flex items-center gap-1 text-xs ${theme.subtext}`}><IconPoint className="h-3.5 w-3.5 flex-shrink-0" /> Tap a letter to mark it as the correct answer. Currently correct: <strong>{form.correct}</strong></p>

      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Reason (why the answer is correct)</label>
      <textarea
        value={form.reason}
        onChange={(e) => setField("reason", e.target.value)}
        rows={2}
        placeholder={`Because ${form.correct} is…`}
        className="mb-4 w-full rounded-lg border border-parchment-200 bg-parchment-50 px-3 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-parchment-50 dark:focus:ring-gold-500"
      />

      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium ${theme.outlineBtn}`}>Cancel</button>
        <button type="button" onClick={handleSave} disabled={!canSave} className={`flex flex-[2] items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-40 ${theme.accentBtn}`}><IconSave className="h-4 w-4" /> Save Question</button>
      </div>
    </div>
  );
}

function QuestionBox({ id, item, theme, onEdit, onDelete }) {
  const choiceKeys = Object.keys(item.choices || {});
  return (
    <div className={`rounded-lg border-2 p-4 ${theme.card}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className={`inline-flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold ${theme.chip}`}>{id}</span>
        <div className="flex flex-shrink-0 gap-1">
          <button onClick={onEdit} aria-label="Edit" className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${theme.outlineBtn}`}><IconEdit className="h-3.5 w-3.5" /> Edit</button>
          <button onClick={onDelete} aria-label="Delete" className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${theme.dangerBtn}`}><IconTrash className="h-3.5 w-3.5" /></button>
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
      {item.reason && <p className={`mt-2 flex items-start gap-1 text-xs italic ${theme.subtext}`}><IconInfo className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {item.reason}</p>}
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
        <button onClick={openAdd} className={`mb-4 flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${theme.accentBtn}`}>
          <IconPlus className="h-4 w-4" /> Add Question
        </button>
      )}

      {formOpen && <QuestionForm key={editingId || "new"} theme={theme} initial={editingInitial} onSave={handleSave} onCancel={closeForm} />}

      {ids.length === 0 ? (
        <p className={`rounded-xl border border-dashed p-6 text-center text-sm ${theme.card} ${theme.subtext}`}>No questions yet. Start with "Add Question" above.</p>
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
