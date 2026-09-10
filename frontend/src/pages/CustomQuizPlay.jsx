import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCustomQuestions, getSortedCustomQuestionIds, getCustomProgress, saveCustomProgress,
  resetCustomProgress, buildShuffledSession,
} from "../customQuizStore";
import { useDeadlineCountdown, formatSeconds } from "../components/CustomQuizShared";

function sameIdSet(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((id) => setA.has(id));
}

// Kinukuha isang beses lang (hindi na nagbabago habang naka-mount ang play
// session) kung anong pagkakasunod-sunod (order) at choice-mapping ang
// gagamitin, at kung fresh timer ba ito o walang timer.
function buildInitialSession(subject, naturalIds, randomChoices, timerChoice) {
  const progress = getCustomProgress(subject.id);
  let order = naturalIds;
  let choiceMaps = null;
  let currentIndex = progress.currentIndex || 0;
  const answers = progress.answers || {};
  let lockedIds = progress.lockedIds || [];

  if (randomChoices) {
    if (progress.order && sameIdSet(progress.order, naturalIds)) {
      order = progress.order;
      choiceMaps = progress.choiceMaps || {};
    } else {
      const built = buildShuffledSession(subject.id);
      order = built.order;
      choiceMaps = built.choiceMaps;
      currentIndex = 0;
    }
  }

  let timer = null;
  if (timerChoice) {
    // Bagong pag-click ng Play/Continue habang naka-ON ang Timer toggle =
    // sinasadyang (re)simula ng oras — kahit may laman na ang lumang timer.
    timer = timerChoice.mode === "total"
      ? { mode: "total", seconds: timerChoice.seconds, deadlineAt: Date.now() + timerChoice.seconds * 1000 }
      : { mode: "perQuestion", seconds: timerChoice.seconds, qDeadlines: {} };
    lockedIds = [];
  }

  const finished = !!progress.finished && !timerChoice;
  const session = { order, choiceMaps, currentIndex, answers, timer, lockedIds, finished };
  saveCustomProgress(subject.id, session);
  return session;
}

function ResultsView({ theme, entries, order, answers, subjectName, onRetry, onBack }) {
  const total = order.length;
  const correctCount = order.filter((id) => {
    const item = entries[id];
    const a = answers[id];
    return item && a !== undefined && a !== null && String(a).trim().toLowerCase() === String(item.correct).trim().toLowerCase();
  }).length;
  const answeredCount = order.filter((id) => answers[id] !== undefined && answers[id] !== null).length;
  const pct = total ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-md p-4">
      <div className={`rounded-2xl border p-6 text-center shadow-md ${theme.card}`}>
        <span className="text-4xl" aria-hidden>🎉</span>
        <h2 className={`mt-2 text-xl font-bold ${theme.text}`}>Tapos na — {subjectName}</h2>
        <p className={`mt-1 text-sm ${theme.subtext}`}>{answeredCount}/{total} sinagutan</p>
        <p className={`mt-4 text-4xl font-black ${theme.text}`}>{pct}%</p>
        <p className={`mb-6 text-sm ${theme.subtext}`}>{correctCount} sa {total} tama</p>
        <div className="space-y-2">
          <button onClick={onRetry} className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${theme.accentBtn}`}>🔁 Ulitin</button>
          <button onClick={onBack} className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${theme.outlineBtn}`}>← Bumalik sa Your Own Quiz</button>
        </div>
      </div>
    </div>
  );
}

export default function CustomQuizPlay({ subject, theme, randomChoices, timerChoice, onBack }) {
  const entries = useMemo(() => getCustomQuestions(subject.id), [subject.id]);
  const naturalIds = useMemo(() => getSortedCustomQuestionIds(subject.id), [subject.id]);

  const [session] = useState(() => buildInitialSession(subject, naturalIds, randomChoices, timerChoice));
  const [order, setOrder] = useState(session.order);
  const [choiceMaps, setChoiceMaps] = useState(session.choiceMaps || {});

  const [currentIndex, setCurrentIndex] = useState(session.currentIndex);
  const [answers, setAnswers] = useState(session.answers);
  const [timer, setTimer] = useState(session.timer);
  const [lockedIds, setLockedIds] = useState(session.lockedIds);
  const [finished, setFinished] = useState(session.finished);

  const total = order.length;
  const currentId = order[Math.min(currentIndex, Math.max(0, total - 1))] || null;
  const currentItem = currentId ? entries[currentId] : null;
  const currentMap = currentId ? choiceMaps[currentId] : null;
  const currentAnswer = currentId ? answers[currentId] : null;
  const isAnswered = currentAnswer !== undefined && currentAnswer !== null;
  const isLocked = currentId ? lockedIds.includes(currentId) : false;
  const isResolved = isAnswered || isLocked;

  const persist = useCallback((patch) => {
    saveCustomProgress(subject.id, { order, choiceMaps, currentIndex, answers, timer, lockedIds, finished, ...patch });
  }, [subject.id, order, choiceMaps, currentIndex, answers, timer, lockedIds, finished]);

  const finishQuiz = useCallback(() => {
    setFinished(true);
    persist({ finished: true });
  }, [persist]);

  const handleExpire = useCallback(() => {
    if (finished || !timer) return;
    if (timer.mode === "total") {
      finishQuiz();
    } else if (timer.mode === "perQuestion" && currentId && !isAnswered && !isLocked) {
      const nextLocked = [...lockedIds, currentId];
      setLockedIds(nextLocked);
      persist({ lockedIds: nextLocked });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished, timer, currentId, isAnswered, isLocked]);

  // Siguraduhing may deadline ang kasalukuyang tanong sa "bawat tanong" mode.
  useEffect(() => {
    if (!timer || timer.mode !== "perQuestion" || !currentId || isAnswered || isLocked) return;
    if (timer.qDeadlines[currentId]) return;
    const deadlineAt = Date.now() + timer.seconds * 1000;
    const nextTimer = { ...timer, qDeadlines: { ...timer.qDeadlines, [currentId]: deadlineAt } };
    setTimer(nextTimer);
    persist({ timer: nextTimer });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, isAnswered, isLocked, timer]);

  const deadlineMs = timer?.mode === "total" ? timer.deadlineAt : timer?.mode === "perQuestion" ? timer.qDeadlines[currentId] || null : null;
  const remainingMs = useDeadlineCountdown(finished ? null : deadlineMs, handleExpire);
  const remainingLow = remainingMs > 0 && remainingMs < (timer?.mode === "total" ? 30000 : 5000);

  const handleAnswer = (originalKey) => {
    if (!currentId || isResolved) return;
    const nextAnswers = { ...answers, [currentId]: originalKey };
    setAnswers(nextAnswers);
    persist({ answers: nextAnswers });
  };

  const goTo = (idx) => {
    const clamped = Math.max(0, Math.min(total - 1, idx));
    setCurrentIndex(clamped);
    persist({ currentIndex: clamped });
  };

  const goNext = () => {
    if (currentIndex >= total - 1) finishQuiz();
    else goTo(currentIndex + 1);
  };

  const handleRetry = () => {
    resetCustomProgress(subject.id);
    const fresh = buildInitialSession(subject, naturalIds, randomChoices, timerChoice || null);
    setOrder(fresh.order);
    setChoiceMaps(fresh.choiceMaps || {});
    setCurrentIndex(fresh.currentIndex);
    setAnswers(fresh.answers);
    setTimer(fresh.timer);
    setLockedIds(fresh.lockedIds);
    setFinished(false);
  };

  if (total === 0) {
    return (
      <div className="mx-auto max-w-2xl p-4 text-center">
        <p className={`text-sm ${theme.subtext}`}>Wala pang tanong sa subject na ito.</p>
        <button onClick={onBack} className={`mt-3 rounded-lg border px-4 py-2 text-sm ${theme.outlineBtn}`}>← Back</button>
      </div>
    );
  }

  if (finished) {
    return <ResultsView theme={theme} entries={entries} order={order} answers={answers} subjectName={subject.name} onRetry={handleRetry} onBack={onBack} />;
  }

  const answeredCount = order.filter((id) => answers[id] !== undefined && answers[id] !== null).length;
  const progressPct = total ? (answeredCount / total) * 100 : 0;

  const slotKeys = currentItem?.choices ? Object.keys(currentItem.choices) : [];

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={onBack} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${theme.subtext}`}>← Back</button>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${theme.text}`}>{subject.name}</span>
          <span className={`text-xs ${theme.subtext}`}>{currentIndex + 1} / {total}</span>
        </div>
      </div>

      {timer && !isResolved && (
        <div className={`mb-3 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${remainingLow ? "bg-red-500 text-white animate-pulse" : theme.chip}`}>
          ⏱️ {formatSeconds(remainingMs / 1000)} {timer.mode === "perQuestion" ? "· tanong na ito" : "· buong quiz"}
        </div>
      )}

      <div className={`mb-2 flex items-center justify-between text-xs ${theme.subtext}`}>
        <span>Progress: {Math.round(progressPct)}%</span>
      </div>
      <div className={`mb-3 h-1 w-full rounded-full ${theme.barTrack}`}>
        <div className={`h-1 rounded-full transition-all duration-300 ${theme.barFill}`} style={{ width: `${progressPct}%` }} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {order.map((id, idx) => {
          const a = answers[id];
          const answeredDot = a !== undefined && a !== null;
          const correctDot = answeredDot && String(a).trim().toLowerCase() === String(entries[id]?.correct).trim().toLowerCase();
          const lockedDot = lockedIds.includes(id) && !answeredDot;
          const dotColor = answeredDot ? (correctDot ? "bg-emerald-400" : "bg-red-400") : lockedDot ? "bg-amber-400" : "bg-slate-300 dark:bg-slate-600";
          return <button key={id} onClick={() => goTo(idx)} className={`h-3 w-3 rounded-full transition-all ${idx === currentIndex ? "scale-125" : ""} ${dotColor}`} title={`Tanong ${idx + 1}`} />;
        })}
      </div>

      <div className={`rounded-xl border p-6 shadow-md ${theme.card}`}>
        <p className={`mb-4 text-lg font-medium ${theme.text}`}>{currentItem?.question}</p>
        <div className="space-y-2">
          {slotKeys.map((slot) => {
            const originalKey = currentMap ? currentMap[slot] : slot;
            const label = currentItem.choices[originalKey] || "";
            const isSelected = currentAnswer === originalKey;
            const isCorrectChoice = isResolved && originalKey === currentItem.correct;
            const isWrongChoice = isAnswered && isSelected && originalKey !== currentItem.correct;
            const choiceClass = isResolved
              ? isCorrectChoice ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30"
                : isWrongChoice ? "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/30"
                : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800"
              : isSelected ? "border-navy-900 dark:border-navy-500"
                : "border-slate-200 bg-white hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-400";
            return (
              <button key={slot} onClick={() => handleAnswer(originalKey)} disabled={isResolved} className={`block w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors ${choiceClass} ${!isResolved && "cursor-pointer"} disabled:cursor-default`}>
                <span className="font-semibold">{slot}.</span> {label}
              </button>
            );
          })}
        </div>
        {isResolved && (
          <div className={`mt-4 rounded-lg p-4 ${isAnswered && !isWrongAnswer(currentAnswer, currentItem.correct) ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
            <p className={`font-medium ${theme.text}`}>
              {!isAnswered ? "⏰ Oras na — walang nasagot." : isWrongAnswer(currentAnswer, currentItem.correct) ? `❌ Mali. Ang tamang sagot ay: ${currentItem.correct}` : "✅ Tama!"}
            </p>
            {currentItem.reason && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{currentItem.reason}</p>}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0} className={`rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-40 ${theme.outlineBtn}`}>Previous</button>
        <button onClick={goNext} className={`rounded-lg px-5 py-2 text-sm font-semibold ${theme.accentBtn}`}>{currentIndex >= total - 1 ? "Finish" : "Next"}</button>
      </div>
    </div>
  );
}

function isWrongAnswer(answer, correct) {
  return String(answer ?? "").trim().toLowerCase() !== String(correct ?? "").trim().toLowerCase();
}
