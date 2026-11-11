import { useState, useEffect } from "react";
import staticQuizData from "../data/quizData.json";
import { getFlattenedEntries } from "../quizStore";
import { LEVELS, QuizLevelButton, QuizPlayView, resetLevelProgress } from "../components/QuizShared";
import { useAuth } from "../authContext";
import { isRaLevelUnlocked } from "../access";

const IconQuiz = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M8 12l2.5 2.5L16 9" />
  </svg>
);
const IconRefresh = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 11a9 9 0 0 1 15.3-5.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 13a9 9 0 0 1-15.3 5.7L3 16" /><path d="M3 21v-5h5" />
  </svg>
);
const IconWrench = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 4.9L4 16.5V20h3.5l5.3-5.3a4 4 0 0 0 4.9-5.4l-2.6 2.6-2-2z" />
  </svg>
);

// Helper to extract Roman numeral from title string like "Title I – ..."
function extractTitleNumber(title) {
  const match = title.match(/^Title\s+([IVXLCDM]+)/i);
  return match ? match[1] : "";
}
function romanToInt(s) {
  if (!s) return 0;
  const map = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0, prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const cur = map[s[i]] || 0;
    total += cur < prev ? -cur : cur;
    prev = cur;
  }
  return total;
}


function groupByTitle(flatEntries) {
  const titleGroups = {};
  Object.keys(flatEntries).forEach((id) => {
    const entry = flatEntries[id];
    const title = entry._title || "Untitled";
    if (!titleGroups[title]) titleGroups[title] = {};
    const cleanEntry = { ...entry };
    delete cleanEntry._title;
    titleGroups[title][id] = cleanEntry;
  });
  return Object.keys(titleGroups).map((title) => ({ title, data: titleGroups[title] }));
}

// Live in-browser imports (Dev Panel → Quiz tab) take priority so you can
// preview immediately. Once a batch is finished, export it and merge into
// src/data/quizData.json so it ships with the app and works fully offline
// for every user — same pattern as aiContext.json.
export function loadQuizData() {
  try {
    const flat = getFlattenedEntries();
    if (Object.keys(flat).length > 0) return groupByTitle(flat);
  } catch (e) {
    console.warn("Failed to load quiz data from local imports:", e);
  }
  if (staticQuizData && Object.keys(staticQuizData).length > 0) {
    return groupByTitle(staticQuizData);
  }
  return [];
}

function QuizTitleCard({ title, data, onSelectLevel }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState({});
  const [totalQuestions, setTotalQuestions] = useState({});
  const { profile, setOverlayOpen, setIntentPlanId } = useAuth();

  useEffect(() => {
    const ids = Object.keys(data);
    const counts = {};
    LEVELS.forEach((level) => {
      counts[level.id] = ids.filter((id) => data[id] && data[id][level.id]).length;
    });
    setTotalQuestions(counts);
  }, [data]);

  useEffect(() => {
    const storageKey = `quiz_progress_${title}`;
    try {
      setProgress(JSON.parse(localStorage.getItem(storageKey) || "{}"));
    } catch {
      setProgress({});
    }
  }, [title]);

  const handleLevelSelect = (levelId) => {
    if (!isRaLevelUnlocked(profile, levelId)) {
      setIntentPlanId("CL");
      setOverlayOpen(true);
      return;
    }
    const ids = Object.keys(data).filter((id) => data[id] && data[id][levelId]);
    if (ids.length === 0) {
      alert(`No questions available for ${LEVELS.find((l) => l.id === levelId)?.label}.`);
      return;
    }
    onSelectLevel(title, data, levelId);
  };

  // Reset lang ang progress ng ISANG level ng ISANG title. Hindi nagagalaw
  // ang mga tanong (data) o ang progress ng ibang levels/titles.
  const handleResetLevel = (levelId) => {
    const levelLabel = LEVELS.find((l) => l.id === levelId)?.label || levelId;
    const ok = confirm(`Reset your progress for "${levelLabel}" in ${title}?\n\nIt will start again from Question 1. The questions are kept — only your answers here will be cleared.`);
    if (!ok) return;
    resetLevelProgress(title, levelId);
    setProgress((prev) => {
      const next = { ...prev };
      delete next[levelId];
      return next;
    });
  };

  const total = Object.values(totalQuestions).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-lg border border-parchment-200 bg-parchment-50 p-4 dark:border-navy-700 dark:bg-navy-800">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-navy-900 dark:text-parchment-50">{open ? "▾" : "▸"} {title}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{Object.keys(data).length} provisions · {total} total questions</p>
        </button>
      </div>
      {open && (
        <div className="space-y-2">
          {LEVELS.map((level) => {
            if (!totalQuestions[level.id]) return null;
            return (
              <QuizLevelButton
                key={level.id}
                level={level}
                progress={progress[level.id] || 0}
                locked={!isRaLevelUnlocked(profile, level.id)}
                onClick={() => handleLevelSelect(level.id)}
                onReset={() => handleResetLevel(level.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [titles, setTitles] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { const loaded = loadQuizData(); loaded.sort((a,b) => romanToInt(extractTitleNumber(a.title)) - romanToInt(extractTitleNumber(b.title))); setTitles(loaded); }, [refreshKey]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "customsLaw_quizImports") setRefreshKey((prev) => prev + 1);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSelectLevel = (title, data, levelId) => {
    setSelectedTitle(title); setSelectedData(data); setSelectedLevel(levelId);
  };
  const handleBack = () => { setSelectedTitle(null); setSelectedData(null); setSelectedLevel(null); };

  if (selectedTitle && selectedData && selectedLevel) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <QuizPlayView title={selectedTitle} entries={selectedData} level={selectedLevel} onBack={handleBack} progressKey={selectedTitle} backLabel={`← Back to ${selectedTitle}`} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-navy-900 dark:text-parchment-50"><IconQuiz className="h-6 w-6" /> Quiz / Exam</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Test your knowledge with 5 levels of difficulty — from Easy to Will Done.</p>
          <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">Note: Level 1 is the Filipino version (free). Levels 2–5 are the English version.</p>
        </div>
        <button onClick={() => setRefreshKey((prev) => prev + 1)} className="flex items-center gap-1.5 rounded-lg border border-parchment-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-parchment dark:border-navy-700 dark:text-slate-300 dark:hover:bg-navy-700" title="Refresh quiz data from imported files"><IconRefresh className="h-4 w-4" /> Refresh</button>
      </div>

      {titles.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
          <p className="text-lg font-medium">No quiz data available</p>
          <p className="text-sm mt-2">Import quiz data from <strong className="inline-flex items-center gap-1">Dev Panel (<IconWrench className="h-3.5 w-3.5" />) → Quiz tab</strong>.</p>
          <p className="text-sm mt-1">After importing, click <strong>Refresh</strong> or reload the page.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {titles.map(({ title, data }) => <QuizTitleCard key={title} title={title} data={data} onSelectLevel={handleSelectLevel} />)}
        </div>
      )}
    </div>
  );
}
