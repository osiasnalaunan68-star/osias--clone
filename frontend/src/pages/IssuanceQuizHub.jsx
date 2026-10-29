import { useState, useMemo } from "react";
import IssuanceQuizModal from "../components/IssuanceQuiz";
import { listIssuanceQuizzes } from "../issuanceQuizStore";

// Quiz/Exam → "CMO / CAO" subject.
// Lists every CMO / CAO that has a quiz (name/title + number like "07-2027"), grouped by year.
// Tapping one opens that issuance's level picker (Level 1 / Level 2) right here, inline.
// The 📝 Quiz button inside each CMO / CAO page still works as before.

const TYPES = [
  { id: "CMO", label: "CMO", icon: "📜" },
  { id: "CAO", label: "CAO", icon: "📄" },
];

export default function IssuanceQuizHub({ onBack }) {
  const [type, setType] = useState("CMO");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null); // { id, label, title }
  const [collapsedYears, setCollapsedYears] = useState({});

  const items = useMemo(() => listIssuanceQuizzes(type), [type, selected]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => `${i.label} ${i.number} ${i.title} ${i.subject}`.toLowerCase().includes(s));
  }, [items, q]);

  const groups = useMemo(() => {
    const m = new Map();
    for (const it of filtered) {
      const y = it.year || "Undated";
      if (!m.has(y)) m.set(y, []);
      m.get(y).push(it);
    }
    return [...m.entries()];
  }, [filtered]);

  if (selected) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <IssuanceQuizModal
          embedded
          issuance={selected}
          backLabel={`← Back to ${type} list`}
          onClose={() => setSelected(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <button
        onClick={onBack}
        className="mb-3 flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800"
      >
        <span aria-hidden>←</span> Subjects
      </button>

      <div className="mb-3 flex gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setType(t.id); setQ(""); }}
            className={`min-h-[40px] flex-1 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              type === t.id
                ? "bg-navy-900 text-white shadow-sm dark:bg-navy-700"
                : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"
            }`}
          >
            <span aria-hidden>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-800">
        <span aria-hidden>🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${type} (number or title)`}
          style={{ fontSize: "16px" }}
          className="min-w-0 flex-1 border-none bg-transparent py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
        />
        {q && <button onClick={() => setQ("")} className="text-slate-400" aria-label="Clear">✕</button>}
      </div>

      {items.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-card dark:bg-slate-800 dark:text-slate-400">
          <p className="mb-1 text-2xl" aria-hidden>📝</p>
          <p className="font-medium">No {type} quizzes yet.</p>
        </div>
      )}
      {items.length > 0 && filtered.length === 0 && (
        <p className="p-3 text-center text-sm text-slate-400">No match for “{q}”.</p>
      )}

      {groups.map(([year, list]) => {
        const collapsed = !q && collapsedYears[year];
        return (
          <div key={year} className="mb-2">
            <button
              onClick={() => setCollapsedYears((p) => ({ ...p, [year]: !p[year] }))}
              className="flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-slate-100 dark:active:bg-slate-800"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-300">
                {year} <span className="font-normal text-slate-400">· {list.length}</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{collapsed ? "▸" : "▾"}</span>
            </button>
            {!collapsed && (
              <ul className="space-y-2">
                {list.map((it) => (
                  <li key={it.id}>
                    <button
                      onClick={() => setSelected({ id: it.id, label: it.label, title: it.title })}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-card active:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-navy-900 dark:text-slate-100">{it.label}</p>
                        {it.title && (
                          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{it.title}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          {[it.l1 > 0 && `🟢 L1: ${it.l1}`, it.l2 > 0 && `🔵 L2: ${it.l2}`].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-slate-300 dark:text-slate-600" aria-hidden>→</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
