import { useState, useMemo } from "react";
import { useAuth } from "../authContext";
import { isRaLevelUnlocked } from "../access";
import { QuizLevelButton, QuizPlayView, resetLevelProgress } from "./QuizShared";
import { QUIZ_LEVELS, getIssuanceQuiz, quizEntriesForLevel, issuanceQuizProgressKey } from "../issuanceQuizStore";

function readProgress(key) {
  try { return JSON.parse(localStorage.getItem(`quiz_progress_${key}`) || "{}") || {}; } catch { return {}; }
}

// Quiz for ONE CMO / CAO: level picker -> play view.
// Level 1 is free; Level 2 uses the same RA 10863 lock as the other quizzes.
// Two ways to show it:
//  - default: full-screen overlay (the 📝 Quiz button inside a CMO / CAO page)
//  - embedded: plain block, used inside Quiz/Exam -> CMO / CAO list (QuizHub already is a full-screen overlay)
export default function IssuanceQuizModal({ issuance, onClose, embedded = false, backLabel }) {
  const { profile } = useAuth();
  const [level, setLevel] = useState(null);
  const [, setTick] = useState(0);
  const quiz = getIssuanceQuiz(issuance.id);
  const progressKey = issuanceQuizProgressKey(issuance.id);
  const entries = useMemo(() => (level && quiz ? quizEntriesForLevel(quiz, level) : null), [quiz, level]);
  const progress = readProgress(progressKey);

  const handleReset = (l) => {
    if (confirm(`Reset your progress for ${l.label}?`)) {
      resetLevelProgress(progressKey, l.id);
      setTick((t) => t + 1);
    }
  };

  const closeLabel = backLabel || `← Back to ${issuance.label}`;

  const content = (
    <>
      {!quiz && <p className="py-10 text-center text-sm text-slate-400">No quiz for this issuance yet.</p>}

      {quiz && level && entries && (
        <QuizPlayView
          title={issuance.label}
          entries={entries}
          level={level}
          onBack={() => { setLevel(null); setTick((t) => t + 1); }}
          progressKey={progressKey}
          backLabel="← Levels"
        />
      )}

      {quiz && !level && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-bold text-navy-900 dark:text-slate-50">{issuance.label}</h2>
            {issuance.title && <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{issuance.title}</p>}
            <p className="mt-2 text-xs text-slate-400">
              {QUIZ_LEVELS.filter((l) => quiz[l.id].length > 0).map((l) => `${l.label.replace(/^\S+\s/, "")}: ${quiz[l.id].length} questions`).join(" · ")}
            </p>
          </div>
          {QUIZ_LEVELS.filter((l) => quiz[l.id].length > 0).map((l) => (
            <QuizLevelButton
              key={l.id}
              level={l}
              progress={progress[l.id] || 0}
              locked={!isRaLevelUnlocked(profile, l.id)}
              onClick={() => setLevel(l.id)}
              onReset={() => handleReset(l)}
            />
          ))}
        </div>
      )}
    </>
  );

  if (embedded) {
    return (
      <div>
        <button
          onClick={onClose}
          className="mb-3 flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800"
        >
          {closeLabel}
        </button>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[45] flex flex-col bg-slate-50 dark:bg-slate-950" style={{ height: "100dvh" }}>
      <div className="safe-top sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            onClick={onClose}
            className="flex h-9 flex-shrink-0 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800"
          >
            <span aria-hidden>←</span> Back to {issuance.label}
          </button>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">📝 Quiz</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-2xl p-4">{content}</div>
      </div>
    </div>
  );
}
