import { useState } from "react";
import { SUBJECTS } from "../data/subjects";
import QuizPage from "./QuizPage";
import SubjectDashboard from "./SubjectDashboard";

export default function QuizHub({ onExit }) {
  const [activeSubject, setActiveSubject] = useState("ra10863");

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-950" style={{ height: "100dvh" }}>
      <div className="safe-top sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-2 px-3 py-2">
          <button onClick={onExit} className="flex h-9 flex-shrink-0 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800">
            <span aria-hidden>←</span> Back
          </button>
          <div className="flex flex-1 gap-1 overflow-x-auto">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSubject(s.id)}
                className={`min-h-[36px] flex-shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  activeSubject === s.id
                    ? "bg-navy-900 text-white shadow-sm dark:bg-navy-700"
                    : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {activeSubject === "ra10863" ? (
          <QuizPage />
        ) : (
          <SubjectDashboard subjectId={activeSubject} subjectLabel={SUBJECTS.find((s) => s.id === activeSubject)?.label || activeSubject} />
        )}
      </div>
    </div>
  );
}
