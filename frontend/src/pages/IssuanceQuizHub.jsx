import { useState, useMemo } from "react";
import IssuanceQuizModal from "../components/IssuanceQuiz";
import { listIssuanceQuizzes } from "../issuanceQuizStore";

// Quiz/Exam → "CMO / CAO" subject.
// Lists every CMO / CAO that has a quiz (name/title + number like "07-2027"), grouped by year.
// Tapping one opens that issuance's level picker (Level 1 / Level 2) right here, inline.
// The Quiz button inside each CMO / CAO page still works as before.

const IconScroll = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" /><circle cx="7.6" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const IconFile = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 3h9l5 5v13H6Z" /><path d="M15 3v5h5" />
  </svg>
);
const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
  </svg>
);
const IconQuiz = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 12l2.5 2.5L16 9" />
  </svg>
);
const IconBack = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

const TYPES = [
  { id: "CMO", label: "CMO", Icon: IconScroll },
  { id: "CAO", label: "CAO", Icon: IconFile },
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
        className="mb-3 flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 active:bg-parchment dark:text-slate-300 dark:active:bg-navy-800"
      >
        <IconBack className="h-4 w-4" aria-hidden /> Subjects
      </button>

      <div className="mb-3 flex gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setType(t.id); setQ(""); }}
            className={`flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              type === t.id
                ? "bg-navy-900 text-white dark:bg-navy-700"
                : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"
            }`}
          >
            <t.Icon className="h-4 w-4" aria-hidden /> {t.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-parchment-200 bg-parchment-50 px-3 dark:border-navy-700 dark:bg-navy-800">
        <span className="text-slate-400 dark:text-slate-500" aria-hidden><IconSearch className="h-4 w-4" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${type} (number or title)`}
          style={{ fontSize: "16px" }}
          className="min-w-0 flex-1 border-none bg-transparent py-2 text-navy-900 placeholder:text-slate-400 focus:outline-none dark:text-parchment-50"
        />
        {q && <button onClick={() => setQ("")} className="text-slate-400" aria-label="Clear">✕</button>}
      </div>

      {items.length === 0 && (
        <div className="rounded-lg bg-parchment-50 p-6 text-center text-sm text-slate-500 dark:bg-navy-800 dark:text-slate-400">
          <IconQuiz className="mx-auto mb-1 h-7 w-7 text-slate-300 dark:text-slate-600" aria-hidden />
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
              className="flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-parchment dark:active:bg-navy-800"
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
                      className="flex w-full items-center gap-3 rounded-lg border border-parchment-200 bg-parchment-50 p-3.5 text-left active:bg-parchment dark:border-navy-700 dark:bg-navy-800 dark:active:bg-navy-700/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-navy-900 dark:text-parchment-50">{it.label}</p>
                        {it.title && (
                          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{it.title}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          {[it.l1 > 0 && `L1: ${it.l1}`, it.l2 > 0 && `L2: ${it.l2}`].filter(Boolean).join(" · ")}
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
