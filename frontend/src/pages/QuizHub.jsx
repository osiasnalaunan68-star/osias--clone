import { useState, useMemo } from "react";
import QuizPage, { loadQuizData } from "./QuizPage";
import { SubjectQuizPlay } from "./SubjectDashboard";
import { ProgressCircle, QuizPlayView } from "../components/QuizShared";
import { getSubjectStats, resetSubjectProgress } from "../subjectQuizStore";
import { getLastQuizPosition } from "../quizStore";

const SUBJECT_LABELS = {
  cl: "Customs Law",
  tl: "Tariff Law",
  cdp: "Customs Documentation & Procedures",
  pc: "Practical Computations",
};

function SubjectCard({ subjectId, expanded, onToggle, onPlay }) {
  const label = SUBJECT_LABELS[subjectId];
  const [refreshKey, setRefreshKey] = useState(0);
  const stats = useMemo(() => getSubjectStats(subjectId), [subjectId, refreshKey]);
  const hasProgress = stats.answeredCount > 0;

  const handleRestart = () => {
    if (confirm(`Reset progress mo para sa ${label}? Hindi mabubura ang mga tanong, mga sagot mo lang.`)) {
      resetSubjectProgress(subjectId);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all dark:border-slate-700 dark:bg-slate-800 ${expanded ? "col-span-2" : ""}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left active:bg-slate-50 dark:active:bg-slate-700/50">
        <ProgressCircle progress={stats.percentAnswered} size={44} strokeWidth={5} color="#22c55e" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-navy-900 dark:text-slate-100">{label}</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">
            {stats.total > 0 ? `${stats.answeredCount}/${stats.total} sagot na` : "Walang tanong"}
          </p>
        </div>
        <span className={`flex-shrink-0 text-slate-300 transition-transform dark:text-slate-600 ${expanded ? "rotate-180" : ""}`} aria-hidden>▾</span>
      </button>
      {expanded && (
        <div className="space-y-2 border-t border-slate-100 p-4 dark:border-slate-700">
          <button
            onClick={() => onPlay(subjectId, label)}
            disabled={stats.total === 0}
            className="w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white shadow-sm active:bg-navy-800 disabled:opacity-40 dark:bg-navy-700 dark:active:bg-navy-600"
          >
            {hasProgress ? "▶️ Continue" : "▶️ Start"}
          </button>
          {hasProgress && (
            <button onClick={handleRestart} className="w-full rounded-xl border border-red-200 px-4 py-2 text-xs font-medium text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400 dark:active:bg-red-950/30">
              Restart progress
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function RA10863Card({ expanded, onToggle, onContinue, onSelectTitle }) {
  return (
    <div className="col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all dark:border-slate-700 dark:bg-slate-800">
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left active:bg-slate-50 dark:active:bg-slate-700/50">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-navy-700 text-lg" aria-hidden>⚖️</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-navy-900 dark:text-slate-100">RA 10863</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">5 levels · lahat ng titles</p>
        </div>
        <span className={`flex-shrink-0 text-slate-300 transition-transform dark:text-slate-600 ${expanded ? "rotate-180" : ""}`} aria-hidden>▾</span>
      </button>
      {expanded && (
        <div className="space-y-2 border-t border-slate-100 p-4 dark:border-slate-700">
          <button onClick={onContinue} className="w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600">
            ▶️ Continue
          </button>
          <button onClick={onSelectTitle} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700">
            📚 Select a Title
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuizHub({ onExit }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeView, setActiveView] = useState(null);

  const toggleCard = (id) => setExpandedCard((prev) => (prev === id ? null : id));
  const backToHub = () => setActiveView(null);

  const handlePlaySubject = (subjectId, label) => {
    setActiveView({ type: "subject-play", subjectId, label });
  };

  const handleContinueRA10863 = () => {
    const last = getLastQuizPosition();
    if (last?.title && last?.level) {
      const titles = loadQuizData();
      const match = titles.find((t) => t.title === last.title);
      if (match) {
        setActiveView({ type: "ra10863-play", title: last.title, data: match.data, level: last.level });
        return;
      }
    }
    setActiveView({ type: "ra10863-titles" });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50 dark:bg-slate-950" style={{ height: "100dvh" }}>
      <div className="safe-top sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-2 px-3 py-2">
          <button onClick={activeView ? backToHub : onExit} className="flex h-9 flex-shrink-0 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800">
            <span aria-hidden>←</span> {activeView ? "Back to Subjects" : "Back"}
          </button>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">📝 Quiz / Exam</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {!activeView && (
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 p-4">
            <RA10863Card
              expanded={expandedCard === "ra10863"}
              onToggle={() => toggleCard("ra10863")}
              onContinue={handleContinueRA10863}
              onSelectTitle={() => setActiveView({ type: "ra10863-titles" })}
            />
            {["cl", "tl", "cdp", "pc"].map((id) => (
              <SubjectCard key={id} subjectId={id} expanded={expandedCard === id} onToggle={() => toggleCard(id)} onPlay={handlePlaySubject} />
            ))}
          </div>
        )}
        {activeView?.type === "subject-play" && (
          <div className="mx-auto max-w-2xl p-4">
            <SubjectQuizPlay subjectId={activeView.subjectId} subjectLabel={activeView.label} onBack={backToHub} />
          </div>
        )}
        {activeView?.type === "ra10863-titles" && <QuizPage />}
        {activeView?.type === "ra10863-play" && (
          <div className="mx-auto max-w-2xl p-4">
            <QuizPlayView
              title={activeView.title}
              entries={activeView.data}
              level={activeView.level}
              onBack={backToHub}
              progressKey={activeView.title}
              backLabel="← Back to Subjects"
            />
          </div>
        )}
      </div>
    </div>
  );
}
