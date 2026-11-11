import { useState, useEffect, useCallback, useMemo } from "react";
import { ProgressCircle, answersMatch } from "../components/QuizShared";
import { useAuth } from "../authContext";
import {
  getAllEntries, getSortedItemIds, getSubjectStats,
  getSubjectProgress, saveSubjectProgress, resetSubjectProgress,
} from "../subjectQuizStore";
import { isClUnlocked, isSubjectUnlocked } from "../access";

const IconLock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="4.5" y="10.5" width="15" height="9" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);
const IconCheckCircle = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);
const IconXCircle = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" />
  </svg>
);
const IconPlay = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M7 5.3v13.4a1 1 0 0 0 1.5.86l11-6.7a1 1 0 0 0 0-1.72l-11-6.7A1 1 0 0 0 7 5.3Z" />
  </svg>
);

// First N items (by sorted order) na libre bawat subject — lahat ng lagpas dito
// ay naka-lock hanggang mag-subscribe. Tugma sa pricing table sa handoff doc.
// CL ang eksepsyon: CL_TRIAL_DAYS na FULL access trial (hindi item-count based) tapos
// naka-lock LAHAT ng item hanggang bumili ng CL (presyo sa PLANS) — tingnan ang isClUnlocked().
const FREE_LIMITS = { cdp: 10, tl: 10, pc: 10, tcp: 10 };

function isItemUnlocked(idx, subjectId, profile) {
  if (subjectId === "cl") return isClUnlocked(profile);
  const freeLimit = FREE_LIMITS[subjectId] ?? Infinity;
  if (idx < freeLimit) return true;
  // Subscriptions can expire; legacy lifetime subjects (no expiry) stay unlocked.
  return isSubjectUnlocked(profile, subjectId.toUpperCase());
}

function LockedPrompt({ subjectLabel, onUnlock }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="text-slate-400 dark:text-slate-500" aria-hidden><IconLock className="h-9 w-9" /></span>
      <p className="text-lg font-semibold text-navy-900 dark:text-parchment-50">This item is locked</p>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
        Subscribe to unlock the remaining {subjectLabel} items.
      </p>
      <button
        onClick={onUnlock}
        className="mt-2 rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600"
      >
        View Subscription
      </button>
    </div>
  );
}

function FlatQuizQuestion({ item, onAnswer, answered, selected }) {
  const [inputValue, setInputValue] = useState("");
  const choices = item?.choices && typeof item.choices === "object" ? item.choices : null;
  const correct = item?.correct || "";
  const reason = item?.reason || "";
  const isRight = answersMatch(selected, correct);

  if (!choices) {
    const handleSubmit = () => { if (!answered && inputValue.trim()) onAnswer(inputValue.trim()); };
    return (
      <div className="space-y-4">
        <p className="font-display text-lg font-medium text-navy-900 dark:text-parchment-50">{item?.question || "No question available"}</p>
        <div className="flex gap-2">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} disabled={answered} placeholder="Type your answer here…" className="flex-1 rounded-md border border-parchment-200 bg-parchment-50 px-4 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-navy-700 dark:bg-navy-800 dark:text-parchment-50 dark:focus:ring-gold-500 disabled:opacity-50" />
          <button onClick={handleSubmit} disabled={answered || !inputValue.trim()} className="rounded-md bg-navy-900 px-6 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">Submit</button>
        </div>
        {answered && (
          <div className={`mt-4 flex items-start gap-2 rounded-md p-4 ${isRight ? "bg-verdigris/10 dark:bg-verdigris/20" : "bg-oxblood/10 dark:bg-oxblood/20"}`}>
            {isRight ? <IconCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-verdigris dark:text-verdigris-300" /> : <IconXCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-oxblood dark:text-oxblood-300" />}
            <div>
              <p className={`font-medium ${isRight ? "text-verdigris dark:text-verdigris-300" : "text-oxblood dark:text-oxblood-300"}`}>{isRight ? "Correct!" : `Incorrect. The correct answer is: ${correct}`}</p>
              {reason && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reason}</p>}
            </div>
          </div>
        )}
      </div>
    );
  }

  const choiceKeys = Object.keys(choices);
  return (
    <div className="space-y-4">
      <p className="font-display text-lg font-medium text-navy-900 dark:text-parchment-50">{item?.question || "No question available"}</p>
      <div className="space-y-2">
        {choiceKeys.map((key) => {
          const label = choices[key] || "";
          const isSelected = selected === key;
          const isCorrect = answered && key === correct;
          const isWrong = answered && isSelected && key !== correct;
          const choiceClass = answered
            ? isCorrect ? "border-verdigris bg-verdigris/10 dark:border-verdigris/70 dark:bg-verdigris/20"
              : isWrong ? "border-oxblood bg-oxblood/10 dark:border-oxblood/70 dark:bg-oxblood/20"
              : "border-parchment-200 bg-parchment-50 dark:border-navy-700 dark:bg-navy-800"
            : isSelected ? "border-seal dark:border-gold-400"
              : "border-parchment-200 bg-parchment-50 hover:border-navy-700 dark:border-navy-700 dark:bg-navy-800 dark:hover:border-slate-500";
          return (
            <button key={key} onClick={() => !answered && onAnswer(key)} disabled={answered} className={`block w-full rounded-lg border-2 px-4 py-3 text-left text-sm transition-colors ${choiceClass} ${!answered && "cursor-pointer"} disabled:cursor-default`}>
              <span className="font-semibold">{key}.</span> {label}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-4 flex items-start gap-2 rounded-md p-4 ${isRight ? "bg-verdigris/10 dark:bg-verdigris/20" : "bg-oxblood/10 dark:bg-oxblood/20"}`}>
          {isRight ? <IconCheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-verdigris dark:text-verdigris-300" /> : <IconXCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-oxblood dark:text-oxblood-300" />}
          <div>
            <p className={`font-medium ${isRight ? "text-verdigris dark:text-verdigris-300" : "text-oxblood dark:text-oxblood-300"}`}>{isRight ? "Correct!" : `Incorrect. The correct answer is: ${correct}`}</p>
            {reason && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reason}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function SubjectQuizPlay({ subjectId, subjectLabel, onBack }) {
  const { profile, setOverlayOpen } = useAuth();
  const entries = useMemo(() => getAllEntries(subjectId), [subjectId]);
  const itemIds = useMemo(() => getSortedItemIds(subjectId), [subjectId]);
  const initialProgress = useMemo(() => getSubjectProgress(subjectId), [subjectId]);

  const [currentIndex, setCurrentIndex] = useState(() => Math.min(initialProgress.currentIndex || 0, Math.max(0, itemIds.length - 1)));
  const [answers, setAnswers] = useState(initialProgress.answers || {});

  const total = itemIds.length;
  const currentId = itemIds[currentIndex] || null;
  const currentItem = currentId ? entries[currentId] : null;
  const currentAnswer = currentId ? answers[currentId] : null;
  const isAnswered = currentAnswer !== undefined && currentAnswer !== null;
  const currentLocked = currentId ? !isItemUnlocked(currentIndex, subjectId, profile) : false;

  const persist = useCallback((nextAnswers, nextIndex) => {
    saveSubjectProgress(subjectId, { answers: nextAnswers, currentIndex: nextIndex });
  }, [subjectId]);

  const handleAnswer = (value) => {
    if (!currentId || currentLocked || answers[currentId] !== undefined) return;
    const nextAnswers = { ...answers, [currentId]: value };
    setAnswers(nextAnswers);
    persist(nextAnswers, currentIndex);
  };

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(total - 1, idx));
    setCurrentIndex(clamped);
    persist(answers, clamped);
  };

  const answeredCount = Object.keys(answers).filter((id) => entries[id]).length;
  const correctCount = Object.keys(answers).filter((id) => entries[id] && answersMatch(answers[id], entries[id].correct)).length;
  const progressPct = total ? (answeredCount / total) * 100 : 0;
  const scorePct = answeredCount ? (correctCount / answeredCount) * 100 : 0;

  if (total === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
        <p className="text-lg font-medium">No questions available yet.</p>
        <button onClick={onBack} className="mt-3 rounded-lg border border-parchment-200 px-4 py-2 text-sm dark:border-navy-700">← Back</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-parchment dark:text-slate-300 dark:hover:bg-navy-800">← Back</button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{subjectLabel}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{currentIndex + 1} / {total}</span>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Progress: {Math.round(progressPct)}%</span>
        <span>Score: {Math.round(scorePct)}%</span>
      </div>
      <div className="mb-3 h-1 w-full rounded-full bg-parchment-200 dark:bg-navy-700">
        <div className="h-1 rounded-full bg-navy-900 transition-all duration-300 dark:bg-gold-500" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {itemIds.map((id, idx) => {
          const isAnsweredDot = answers[id] !== undefined && answers[id] !== null;
          const isActive = idx === currentIndex;
          const isCorrect = entries[id] && answersMatch(answers[id], entries[id].correct);
          const locked = !isItemUnlocked(idx, subjectId, profile);
          const dotColor = isAnsweredDot
            ? (isCorrect ? "bg-verdigris dark:bg-verdigris-300" : "bg-oxblood dark:bg-oxblood-300")
            : locked ? "bg-slate-200 dark:bg-slate-700" : "bg-slate-300 dark:bg-slate-600";
          return (
            <button
              key={id}
              onClick={() => goTo(idx)}
              className={`h-3 w-3 rounded-full transition-all ${isActive ? "scale-125" : ""} ${dotColor} ${locked && !isAnsweredDot ? "opacity-50" : ""}`}
              title={locked ? `Item ${id} (locked)` : `Item ${id}`}
            />
          );
        })}
      </div>

      <div className="rounded-lg border border-parchment-200 bg-parchment-50 p-6 dark:border-navy-700 dark:bg-navy-800">
        {currentLocked ? (
          <LockedPrompt subjectLabel={subjectLabel} onUnlock={() => setOverlayOpen(true)} />
        ) : (
          <FlatQuizQuestion key={currentId} item={currentItem} onAnswer={handleAnswer} answered={isAnswered} selected={currentAnswer} />
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0} className="rounded-lg border border-parchment-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-navy-700 dark:text-slate-300">Previous</button>
        <button onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === total - 1} className="rounded-lg border border-parchment-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-navy-700 dark:text-slate-300">Next</button>
      </div>
    </div>
  );
}

export default function SubjectDashboard({ subjectId, subjectLabel }) {
  const [playing, setPlaying] = useState(false);
  const [stats, setStats] = useState(() => getSubjectStats(subjectId));
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { setStats(getSubjectStats(subjectId)); }, [subjectId, refreshKey, playing]);

  const handleExitPlay = () => {
    setPlaying(false);
    setRefreshKey((k) => k + 1);
  };

  const handleReset = () => {
    if (confirm(`Reset your progress for ${subjectLabel}? Imported questions are kept — only your answers are cleared.`)) {
      resetSubjectProgress(subjectId);
      setRefreshKey((k) => k + 1);
    }
  };

  if (playing) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <SubjectQuizPlay subjectId={subjectId} subjectLabel={subjectLabel} onBack={handleExitPlay} />
      </div>
    );
  }

  const hasProgress = stats.answeredCount > 0;

  return (
    <div className="mx-auto max-w-md p-4">
      <div className="rounded-lg border border-parchment-200 bg-parchment-50 p-6 text-center dark:border-navy-700 dark:bg-navy-800">
        <h2 className="mb-1 text-xl font-bold text-navy-900 dark:text-parchment-50">{subjectLabel}</h2>
        <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
          {stats.total > 0 ? `${stats.total} question${stats.total !== 1 ? "s" : ""} available` : "No questions imported yet"}
        </p>

        <div className="mb-6 flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <ProgressCircle progress={stats.percentAnswered} size={84} strokeWidth={8} color="#22c55e" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Answered<br/>({stats.answeredCount}/{stats.total})</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProgressCircle progress={stats.percentCorrect} size={84} strokeWidth={8} color="#22c55e" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Correct<br/>({stats.correctCount}/{stats.answeredCount})</span>
          </div>
        </div>

        {stats.total === 0 ? (
          <p className="rounded-lg bg-parchment p-3 text-sm text-slate-400 dark:bg-navy-900/40 dark:text-slate-500">Import {subjectLabel} questions in the Dev Panel first.</p>
        ) : (
          <div className="space-y-2">
            <button onClick={() => setPlaying(true)} className="flex w-full items-center justify-center gap-1.5 rounded-md bg-navy-900 px-4 py-3 text-sm font-semibold text-white active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600">
              <IconPlay className="h-4 w-4" /> {hasProgress ? "Continue" : "Start"}
            </button>
            {hasProgress && (
              <button onClick={handleReset} className="w-full rounded-md border border-red-200 px-4 py-2 text-xs font-medium text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400 dark:active:bg-red-950/30">
                Reset progress
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
