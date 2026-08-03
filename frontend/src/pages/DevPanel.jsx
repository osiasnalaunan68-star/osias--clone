import { useState } from "react";
import QuizPanel from "./QuizPanel";
import SubjectQuizPanel from "./SubjectQuizPanel";
import { FLAT_SUBJECTS } from "../data/subjects";

const TABS = [{ id: "ra10863", label: "RA10863" }, ...FLAT_SUBJECTS.map((s) => ({ id: s.id, label: s.label }))];

export default function DevPanel() {
  const [tab, setTab] = useState("ra10863");

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">🛠 Dev Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quiz question import &amp; preview only. This panel is stripped out of production
          builds automatically (it only renders when running{" "}
          <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">npm run dev</code>),
          so it never ships to real users on GitHub Pages.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-[36px] rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-navy-900 text-white shadow-sm dark:bg-navy-700"
                : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ra10863" ? (
        <QuizPanel />
      ) : (
        <SubjectQuizPanel subjectId={tab} subjectLabel={TABS.find((t) => t.id === tab)?.label || tab} />
      )}
    </div>
  );
}
