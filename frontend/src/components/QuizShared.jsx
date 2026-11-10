import { useState, useEffect } from "react";
import { saveLastQuizPosition } from "../quizStore";
import { useAuth } from "../authContext";
import { isRaLevelUnlocked } from "../access";

export function answersMatch(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

// lang = language of the questions: Level 1 is Filipino, Levels 2-5 are English.
export const LEVELS = [
  { id: "level1", label: "Level 1 — Easy", lang: "Filipino version", color: "green" },
  { id: "level2", label: "Level 2 — Normal", lang: "English version", color: "blue" },
  { id: "level3", label: "Level 3 — Medium", lang: "English version", color: "orange" },
  { id: "level4", label: "Level 4 — Medium Pro", lang: "English version", color: "purple" },
  { id: "level5", label: "Level 5 — Will Done", lang: "English version", color: "red" },
];

const LEVEL_STROKE = { green: "#22c55e", blue: "#3b82f6", orange: "#f97316", purple: "#a855f7", red: "#ef4444" };
const LEVEL_BORDER = {
  green: "border-emerald-400 hover:bg-emerald-50 dark:border-emerald-600 dark:hover:bg-emerald-950/30",
  blue: "border-blue-400 hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-950/30",
  orange: "border-orange-400 hover:bg-orange-50 dark:border-orange-600 dark:hover:bg-orange-950/30",
  purple: "border-purple-400 hover:bg-purple-50 dark:border-purple-600 dark:hover:bg-purple-950/30",
  red: "border-red-400 hover:bg-red-50 dark:border-red-600 dark:hover:bg-red-950/30",
};

const IconLock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="4.5" y="10.5" width="15" height="9" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);
const IconCheckCircle = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);
const IconXCircle = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </svg>
);

export function ProgressCircle({ progress, size = 60, strokeWidth = 6, color = "#22c55e" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle className="text-parchment-200 dark:text-navy-700" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" r={radius} cx={size / 2} cy={size / 2} className="transition-all duration-500" style={{ stroke: progress > 0 ? color : "transparent" }} />
      </svg>
      <span className="absolute text-sm font-semibold text-navy-900 dark:text-parchment-50">{Math.round(progress)}%</span>
    </div>
  );
}

// level: one of LEVELS above. progress: 0-100. onClick opens the level.
// onReset (optional): if passed AND progress > 0, shows a small "↺ Reset"
// button so the user can wipe just THIS level's saved answers without
// touching the other levels or the quiz questions themselves. Callers that
// don't pass onReset (e.g. the Dev Panel quiz preview) keep the old look.
export function QuizLevelButton({ level, progress, onClick, onReset, locked }) {
  const colorClass = locked
    ? "border-parchment-200 bg-parchment dark:border-navy-700 dark:bg-navy-800/60"
    : LEVEL_BORDER[level.color] || LEVEL_BORDER.green;
  return (
    <div className={`flex items-center gap-2 rounded-lg border-2 p-4 w-full transition-all ${colorClass}`}>
      <button onClick={onClick} className="flex min-w-0 flex-1 items-center gap-4 text-left">
        {locked ? (
          <span className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center text-slate-400 dark:text-slate-500" aria-hidden><IconLock className="h-7 w-7" /></span>
        ) : (
          <ProgressCircle progress={progress} color={LEVEL_STROKE[level.color] || LEVEL_STROKE.green} />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-900 dark:text-parchment-50">{level.label}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {level.lang} · {locked ? "Locked — unlock RA 10863" : progress > 0 ? `${Math.round(progress)}% completed` : "Not started"}
          </p>
        </div>
      </button>
      {onReset && progress > 0 && !locked && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onReset(); }}
          title="Reset the progress of this level"
          aria-label={`Reset progress — ${level.label}`}
          className="flex-shrink-0 whitespace-nowrap rounded-md border border-parchment-200 px-2.5 py-2 text-xs font-medium text-slate-500 active:bg-parchment dark:border-navy-700 dark:text-slate-400 dark:active:bg-navy-700"
        >
          ↺ Reset
        </button>
      )}
    </div>
  );
}

export function QuizQuestion({ level, questionData, onAnswer, answered, selected }) {
  const [inputValue, setInputValue] = useState("");
  const isLevel5 = level === "level5";
  const choices = questionData?.choices || {};
  const correct = questionData?.correct || "";
  const reason = questionData?.reason || "";
  const isRight = answersMatch(selected, correct);

  const handleChoiceClick = (choiceKey) => { if (!answered) onAnswer(choiceKey); };
  const handleInputSubmit = () => { if (!answered && inputValue.trim()) onAnswer(inputValue.trim()); };

  if (isLevel5) {
    return (
      <div className="space-y-4">
        <p className="font-display text-lg font-medium text-navy-900 dark:text-parchment-50">{questionData?.question || "No question available"}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Type your answer below:</p>
        <div className="flex gap-2">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()} disabled={answered} placeholder="Type your answer here..." className="flex-1 rounded-md border border-parchment-200 bg-parchment-50 px-4 py-2 text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-navy-700 dark:bg-navy-800 dark:text-parchment-50 dark:focus:ring-gold-500 disabled:opacity-50" />
          <button onClick={handleInputSubmit} disabled={answered || !inputValue.trim()} className="rounded-md bg-navy-900 px-6 py-2 text-sm font-semibold text-parchment-50 disabled:opacity-40 dark:bg-navy-700">Submit</button>
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

  const choiceKeys = ["A", "B", "C", "D"];
  return (
    <div className="space-y-4">
      <p className="font-display text-lg font-medium text-navy-900 dark:text-parchment-50">{questionData?.question || "No question available"}</p>
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
            <button key={key} onClick={() => handleChoiceClick(key)} disabled={answered} className={`block w-full rounded-lg border-2 px-4 py-3 text-left text-sm transition-colors ${choiceClass} ${!answered && "cursor-pointer"} disabled:cursor-default`}>
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

// Clears the saved progress + saved answers for ONE level of ONE quiz
// (progressKey = title string for RA10863, or batch id in Dev Panel).
// Mirrors the exact localStorage keys QuizPlayView below reads/writes, so
// after calling this, re-opening that level starts fresh at question 1
// with a clean 0% — the OTHER levels, and the quiz questions themselves,
// are never touched. Safe to call even if nothing was saved yet.
export function resetLevelProgress(progressKey, level) {
  if (!progressKey || !level) return;
  try {
    localStorage.removeItem(`quiz_answers_${progressKey}_${level}`);
  } catch {}
  try {
    const key = `quiz_progress_${progressKey}`;
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    if (saved && typeof saved === "object" && level in saved) {
      delete saved[level];
      localStorage.setItem(key, JSON.stringify(saved));
    }
  } catch {}
}

// progressKey identifies WHERE to save/read progress (localStorage key
// `quiz_progress_${progressKey}`). Pass a stable id — a batch id while
// testing in Dev Panel, or the title string once baked into quizData.json.
// Guard: Level 1 is free for everyone; Levels 2-5 need RA 10863 (CL).
// This also blocks the "Continue" shortcut from reopening a locked level.
export function QuizPlayView(props) {
  const { profile, setOverlayOpen, setIntentPlanId } = useAuth();
  if (!isRaLevelUnlocked(profile, props.level)) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="text-slate-400 dark:text-slate-500" aria-hidden><IconLock className="h-10 w-10" /></span>
        <p className="text-lg font-semibold text-navy-900 dark:text-parchment-50">This level is locked</p>
        <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
          Levels 2–5 are in English and unlock with RA 10863 (CMTA). Level 1 (Filipino version) stays free.
        </p>
        <button
          onClick={() => { setIntentPlanId("CL"); setOverlayOpen(true); }}
          className="rounded-md bg-navy-900 px-5 py-2.5 text-sm font-semibold text-parchment-50 active:bg-navy-800 dark:bg-navy-700"
        >
          Unlock RA 10863
        </button>
        <button onClick={props.onBack} className="text-sm text-slate-400">{props.backLabel || "← Back"}</button>
      </div>
    );
  }
  return <QuizPlayViewInner {...props} />;
}

function QuizPlayViewInner({ title, entries, level, onBack, progressKey, backLabel = "← Back" }) {
  const answerStorageKey = progressKey ? `quiz_answers_${progressKey}_${level}` : null;
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!answerStorageKey) return 0;
    try {
      const saved = JSON.parse(localStorage.getItem(answerStorageKey) || "null");
      return saved?.currentIndex || 0;
    } catch { return 0; }
  });
  const [answers, setAnswers] = useState(() => {
    if (!answerStorageKey) return {};
    try {
      const saved = JSON.parse(localStorage.getItem(answerStorageKey) || "null");
      return saved?.answers || {};
    } catch { return {}; }
  });
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  const nodeIds = Object.keys(entries);
  const totalQuestions = nodeIds.length;
  const currentId = nodeIds[Math.min(currentIndex, Math.max(0, totalQuestions - 1))] || null;
  const currentEntry = currentId ? entries[currentId] : null;
  const currentQuestion = currentEntry?.[level] || null;
  const currentAnswer = currentId ? answers[currentId] : null;
  const isAnswered = currentAnswer !== undefined && currentAnswer !== null;

  useEffect(() => {
    if (progressKey && !String(progressKey).startsWith("issuance-")) saveLastQuizPosition(progressKey, level);
  }, [progressKey, level]);

  useEffect(() => {
    if (!answerStorageKey) return;
    try {
      localStorage.setItem(answerStorageKey, JSON.stringify({ currentIndex, answers }));
    } catch {}
  }, [answerStorageKey, currentIndex, answers]);

  useEffect(() => {
    if (totalQuestions === 0) return;
    const answeredIds = Object.keys(answers).filter((id) => answers[id] !== undefined && answers[id] !== null);
    const progressPct = (answeredIds.length / totalQuestions) * 100;
    setProgress(progressPct);
    const correctCount = answeredIds.filter((id) => answersMatch(entries[id]?.[level]?.correct, answers[id])).length;
    setScore(totalQuestions ? (correctCount / totalQuestions) * 100 : 0);
    if (progressKey) {
      try {
        const key = `quiz_progress_${progressKey}`;
        const saved = JSON.parse(localStorage.getItem(key) || "{}");
        saved[level] = progressPct;
        localStorage.setItem(key, JSON.stringify(saved));
      } catch {}
    }
  }, [answers, totalQuestions, entries, level, progressKey]);

  const handleAnswer = (answer) => { if (currentId && !answers[currentId]) setAnswers((prev) => ({ ...prev, [currentId]: answer })); };
  const goToPrevious = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };
  const goToNext = () => { if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1); };
  const goToQuestion = (index) => setCurrentIndex(index);

  if (totalQuestions === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
        <p className="text-lg font-medium">No questions available for this level.</p>
        <p className="text-sm">Try importing quiz data first.</p>
      </div>
    );
  }

  const levelLabel = LEVELS.find((l) => l.id === level)?.label || level;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-parchment dark:text-slate-300 dark:hover:bg-navy-800">{backLabel}</button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{levelLabel}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{currentIndex + 1} / {totalQuestions}</span>
        </div>
      </div>

      {title && (
        <div className="mb-3 text-center">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{title}</span>
        </div>
      )}

      <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Progress: {Math.round(progress)}%</span>
        <span>Score: {Math.round(score)}%</span>
      </div>

      <div className="mb-3 h-1 w-full rounded-full bg-parchment-200 dark:bg-navy-700">
        <div className="h-1 rounded-full bg-navy-900 transition-all duration-300 dark:bg-gold-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {nodeIds.map((id, idx) => {
          const isAnsweredDot = answers[id] !== undefined && answers[id] !== null;
          const isActive = idx === currentIndex;
          const q = entries[id]?.[level];
          const isCorrect = answersMatch(answers[id], q?.correct);
          const dotColor = isAnsweredDot ? (isCorrect ? "bg-verdigris dark:bg-verdigris-300" : "bg-oxblood dark:bg-oxblood-300") : "bg-slate-300 dark:bg-slate-600";
          return <button key={id} onClick={() => goToQuestion(idx)} className={`h-3 w-3 rounded-full transition-all ${isActive ? "scale-125" : ""} ${dotColor}`} title={`Question ${idx + 1}`} />;
        })}
      </div>

      <div className="rounded-lg border border-parchment-200 bg-parchment-50 p-6 dark:border-navy-700 dark:bg-navy-800">
        <QuizQuestion key={currentId} level={level} questionData={currentQuestion} onAnswer={handleAnswer} answered={isAnswered} selected={currentAnswer} />
      </div>

      <div className="mt-4 flex justify-between">
        <button onClick={goToPrevious} disabled={currentIndex === 0} className="rounded-lg border border-parchment-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-navy-700 dark:text-slate-300">Previous</button>
        <button onClick={goToNext} disabled={currentIndex === totalQuestions - 1} className="rounded-lg border border-parchment-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-navy-700 dark:text-slate-300">Next</button>
      </div>

      <div className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">{Math.round(progress)}% complete · {Math.round(score)}% score</div>
    </div>
  );
}
