import { useState, useMemo } from "react";
import QuizPage, { loadQuizData } from "./QuizPage";
import { SubjectQuizPlay } from "./SubjectDashboard";
import CustomQuizHub from "./CustomQuizHub";
import IssuanceQuizHub from "./IssuanceQuizHub";
import { ProgressCircle, QuizPlayView } from "../components/QuizShared";
import { useAuth } from "../authContext";
import { PROMO_PLAN } from "../payments";
import { isRaLevelUnlocked } from "../access";
import { getSubjectStats, resetSubjectProgress } from "../subjectQuizStore";
import { getLastQuizPosition } from "../quizStore";

const SUBJECT_LABELS = {
  cl: "Customs Law",
  tl: "Tariff Law",
  cdp: "Customs Documentation & Procedures",
  pc: "Practical Computations",
  tcp: "Tariff Commission Primer",
};

// Subjects that are temporarily closed while being fixed.
// To re-open a subject later, just delete its line here.
const DISABLED_SUBJECTS = {};

const IconWrench = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 4.9L4 16.5V20h3.5l5.3-5.3a4 4 0 0 0 4.9-5.4l-2.6 2.6-2-2z" />
  </svg>
);
const IconScroll = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" />
    <circle cx="7.6" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const IconPlay = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M7 5.3v13.4a1 1 0 0 0 1.5.86l11-6.7a1 1 0 0 0 0-1.72l-11-6.7A1 1 0 0 0 7 5.3Z" />
  </svg>
);
const IconBookOpen = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}>
    <path d="M3 5c3-1.4 6-1.4 9 0M12 5c3-1.4 6-1.4 9 0M3 5v13c3-1.4 6-1.4 9 0M12 5v13c3-1.4 6-1.4 9 0" />
  </svg>
);
const IconScale = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
);
const IconArrowRight = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const IconChevronDown = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
const IconLayers = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="M3 13l9 5 9-5" />
  </svg>
);
const IconLock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="4.5" y="10.5" width="15" height="9" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);
const IconBack = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
const IconQuiz = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
    <path d="M8 12l2.5 2.5L16 9" />
  </svg>
);

function DisabledSubjectCard({ subjectId, expanded, onToggle, onOpenIssuance, showIssuanceTip }) {
  const label = SUBJECT_LABELS[subjectId];
  const info = DISABLED_SUBJECTS[subjectId];

  return (
    <div className={`overflow-hidden rounded-lg border border-amber-300/70 bg-parchment-50 transition-all dark:border-amber-700/50 dark:bg-navy-800 ${expanded ? "col-span-2" : ""}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left active:bg-parchment dark:active:bg-navy-700/50">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" aria-hidden><IconWrench className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-navy-900 dark:text-parchment-50">{label}</p>
          <p className="truncate text-xs font-medium text-amber-600 dark:text-amber-400">{info.title}</p>
        </div>
        <IconChevronDown className={`h-4 w-4 flex-shrink-0 text-slate-300 transition-transform dark:text-slate-600 ${expanded ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {expanded && (
        <div className="space-y-3 border-t border-amber-200/60 p-4 dark:border-navy-700">
          <p className="text-sm text-slate-600 dark:text-slate-300">{info.message}</p>
          {showIssuanceTip && (
            <>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                In the meantime, we recommend practicing with <span className="font-semibold">CMO / CAO</span> instead.
              </p>
              <button
                onClick={onOpenIssuance}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 text-sm font-semibold text-parchment-50 active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600"
              >
                <IconScroll className="h-4 w-4" /> Go to CMO / CAO
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SubjectCard({ subjectId, expanded, onToggle, onPlay }) {
  const label = SUBJECT_LABELS[subjectId];
  const [refreshKey, setRefreshKey] = useState(0);
  const stats = useMemo(() => getSubjectStats(subjectId), [subjectId, refreshKey]);
  const hasProgress = stats.answeredCount > 0;

  const handleRestart = () => {
    if (confirm(`Reset your progress for ${label}? Questions are kept — only your answers are cleared.`)) {
      resetSubjectProgress(subjectId);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <div className={`overflow-hidden rounded-lg border border-parchment-200 bg-parchment-50 transition-all dark:border-navy-700 dark:bg-navy-800 ${expanded ? "col-span-2" : ""}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left active:bg-parchment dark:active:bg-navy-700/50">
        <ProgressCircle progress={stats.percentAnswered} size={44} strokeWidth={5} color="#22c55e" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-navy-900 dark:text-parchment-50">{label}</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">
            {stats.total > 0 ? `${stats.answeredCount}/${stats.total} answered` : "No questions"}
          </p>
        </div>
        <IconChevronDown className={`h-4 w-4 flex-shrink-0 text-slate-300 transition-transform dark:text-slate-600 ${expanded ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {expanded && (
        <div className="space-y-2 border-t border-parchment-200 p-4 dark:border-navy-700">
          <button
            onClick={() => onPlay(subjectId, label)}
            disabled={stats.total === 0}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 text-sm font-semibold text-parchment-50 active:bg-navy-800 disabled:opacity-40 dark:bg-navy-700 dark:active:bg-navy-600"
          >
            <IconPlay className="h-4 w-4" /> {hasProgress ? "Continue" : "Start"}
          </button>
          {hasProgress && (
            <button onClick={handleRestart} className="w-full rounded-md border border-red-200 px-4 py-2 text-xs font-medium text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400 dark:active:bg-red-950/30">
              Restart progress
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function IssuanceQuizCard({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="col-span-2 flex items-center gap-3 rounded-lg border border-parchment-200 bg-parchment-50 p-4 text-left transition-all active:bg-parchment dark:border-navy-700 dark:bg-navy-800 dark:active:bg-navy-700/50"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-seal/50 text-seal dark:border-gold-500/50 dark:text-gold-400" aria-hidden><IconScroll className="h-5 w-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-navy-900 dark:text-parchment-50">CMO / CAO</p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">Pick a CMO or CAO by number or title</p>
      </div>
      <IconArrowRight className="h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600" aria-hidden />
    </button>
  );
}

function RA10863Card({ expanded, onToggle, onContinue, onSelectTitle }) {
  return (
    <div className="col-span-2 overflow-hidden rounded-lg border border-seal/60 bg-parchment-50 transition-all dark:border-gold-500/50 dark:bg-navy-800">
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left active:bg-parchment dark:active:bg-navy-700/50">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-seal text-seal dark:border-gold-400 dark:text-gold-400" aria-hidden><IconScale className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-navy-900 dark:text-parchment-50">RA 10863</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">5 levels · Level 1 Filipino · Levels 2–5 English</p>
        </div>
        <IconChevronDown className={`h-4 w-4 flex-shrink-0 text-slate-300 transition-transform dark:text-slate-600 ${expanded ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {expanded && (
        <div className="space-y-2 border-t border-parchment-200 p-4 dark:border-navy-700">
          <button onClick={onContinue} className="flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-4 py-3 text-sm font-semibold text-parchment-50 active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600">
            <IconPlay className="h-4 w-4" /> Continue
          </button>
          <button onClick={onSelectTitle} className="flex w-full items-center justify-center gap-2 rounded-md border border-parchment-200 px-4 py-2.5 text-sm font-medium text-slate-600 active:bg-parchment dark:border-slate-600 dark:text-slate-300 dark:active:bg-navy-700">
            <IconBookOpen className="h-4 w-4" /> Select a Title
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuizHub({ onExit, limited = false }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [activeView, setActiveView] = useState(null);
  const { profile, setOverlayOpen, setIntentPlanId } = useAuth();

  const toggleCard = (id) => setExpandedCard((prev) => (prev === id ? null : id));
  const backToHub = () => setActiveView(null);

  const handlePlaySubject = (subjectId, label) => {
    // Safety net: never open a subject that is under maintenance.
    if (DISABLED_SUBJECTS[subjectId]) return;
    setActiveView({ type: "subject-play", subjectId, label });
  };

  const handleContinueRA10863 = () => {
    const last = getLastQuizPosition();
    // "Continue" must not reopen a locked level (Levels 2-5 need RA 10863).
    if (last?.title && last?.level && isRaLevelUnlocked(profile, last.level)) {
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
    <div className="font-ui fixed inset-0 z-50 flex flex-col bg-parchment dark:bg-navy-950" style={{ height: "100dvh" }}>
      <div className="safe-top sticky top-0 z-10 border-b border-parchment-200 bg-parchment-50/95 backdrop-blur dark:border-navy-800 dark:bg-navy-900/95">
        <div className="flex items-center gap-2 px-3 py-2">
          <button onClick={activeView ? backToHub : onExit} className="flex h-9 flex-shrink-0 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 active:bg-parchment dark:text-slate-300 dark:active:bg-navy-800">
            <IconBack className="h-4 w-4" aria-hidden /> {activeView ? "Back to Subjects" : "Back"}
          </button>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400"><IconQuiz className="h-4 w-4" aria-hidden /> Quiz / Exam</span>
        </div>
      </div>
      {limited && (
        <div className="flex items-center justify-between gap-3 border-b border-seal/40 bg-gold-50 px-4 py-2 dark:border-gold-500/40 dark:bg-navy-900">
          <p className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300"><IconLock className="h-3.5 w-3.5 flex-shrink-0 text-seal dark:text-gold-400" aria-hidden /> Free preview: RA 10863 Level 1 + first 10 items per subject.</p>
          <button
            onClick={() => { setIntentPlanId(PROMO_PLAN.id); setOverlayOpen(true); }}
            className="flex-shrink-0 rounded-full bg-navy-900 px-3 py-1.5 text-xs font-bold text-parchment-50 active:bg-navy-800 dark:bg-navy-700"
          >
            Unlock all · ₱{PROMO_PLAN.price}
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {!activeView && (
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 p-4">
            <RA10863Card
              expanded={expandedCard === "ra10863"}
              onToggle={() => toggleCard("ra10863")}
              onContinue={handleContinueRA10863}
              onSelectTitle={() => setActiveView({ type: "ra10863-titles" })}
            />
            {!limited && <IssuanceQuizCard onOpen={() => setActiveView({ type: "issuance-quiz" })} />}
            {["tl", "cdp", "pc", "tcp"].map((id) =>
              DISABLED_SUBJECTS[id] ? (
                <DisabledSubjectCard
                  key={id}
                  subjectId={id}
                  expanded={expandedCard === id}
                  onToggle={() => toggleCard(id)}
                  onOpenIssuance={() => setActiveView({ type: "issuance-quiz" })}
                  showIssuanceTip={!limited}
                />
              ) : (
                <SubjectCard key={id} subjectId={id} expanded={expandedCard === id} onToggle={() => toggleCard(id)} onPlay={handlePlaySubject} />
              )
            )}
            <button
              onClick={() => setActiveView({ type: "custom-quiz" })}
              className="col-span-2 flex items-center gap-3 rounded-lg border border-parchment-200 bg-parchment-50 p-4 text-left transition-all active:bg-parchment dark:border-navy-700 dark:bg-navy-800 dark:active:bg-navy-700/50"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-parchment-200 text-navy-700 dark:border-navy-700 dark:text-parchment-50" aria-hidden><IconLayers className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-navy-900 dark:text-parchment-50">Your Own Quiz</p>
                <p className="truncate text-xs text-slate-400 dark:text-slate-500">Create your own subjects and questions</p>
              </div>
              <IconArrowRight className="h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600" aria-hidden />
            </button>
          </div>
        )}
        {activeView?.type === "subject-play" && (
          <div className="mx-auto max-w-2xl p-4">
            <SubjectQuizPlay subjectId={activeView.subjectId} subjectLabel={activeView.label} onBack={backToHub} />
          </div>
        )}
        {activeView?.type === "ra10863-titles" && <QuizPage />}
        {activeView?.type === "issuance-quiz" && <IssuanceQuizHub onBack={backToHub} />}
        {activeView?.type === "custom-quiz" && <CustomQuizHub onBack={backToHub} />}
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
