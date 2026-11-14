import { useMemo, useState } from "react";
import { ProgressCircle } from "../components/QuizShared";
import {
  OnOffToggle, IconPicker, ColorPicker, useCustomQuizTheme, TimerPickerModal,
} from "../components/CustomQuizShared";
import {
  getCustomSubjects, addCustomSubjects, deleteCustomSubject,
  getCustomSubjectStats, resetCustomProgress, getCustomQuizSettings, saveCustomQuizSettings,
} from "../customQuizStore";
import CustomQuizManage from "./CustomQuizManage";
import CustomQuizPlay from "./CustomQuizPlay";

const IconLayers = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="M3 13l9 5 9-5" />
  </svg>
);
const IconDice = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" /><circle cx="8.3" cy="8.3" r="1" fill="currentColor" stroke="none" /><circle cx="15.7" cy="8.3" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="8.3" cy="15.7" r="1" fill="currentColor" stroke="none" /><circle cx="15.7" cy="15.7" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const IconClock = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" />
  </svg>
);
const IconPlus = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const IconSave = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 4h11l3 3v13H5Z" /><path d="M8 4v5h7V4M8 13h8v7H8Z" />
  </svg>
);
const IconPlay = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...p}>
    <path d="M7 5.3v13.4a1 1 0 0 0 1.5.86l11-6.7a1 1 0 0 0 0-1.72l-11-6.7A1 1 0 0 0 7 5.3Z" />
  </svg>
);
const IconEdit = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconTrash = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" /><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </svg>
);

// ---------- Add Subject ----------

function AddSubjectView({ theme, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📘");
  const [color, setColor] = useState("#8b5cf6");
  const [pending, setPending] = useState([]);

  const addToList = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPending((prev) => [...prev, { name: trimmed, icon, color }]);
    setName("");
  };

  const removeFromList = (idx) => setPending((prev) => prev.filter((_, i) => i !== idx));

  const saveAll = () => {
    if (pending.length === 0) return;
    onSave(pending);
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onCancel} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${theme.subtext}`}>← Back</button>
        <span className={`flex items-center gap-1.5 text-sm font-semibold ${theme.text}`}><IconPlus className="h-4 w-4" /> Add Subject</span>
      </div>

      <div className={`rounded-lg border p-4 ${theme.card}`}>
        <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Subject name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addToList()}
          placeholder="e.g. Science, Math, Anatomy…"
          className="mb-4 w-full rounded-lg border border-parchment-200 bg-parchment-50 px-3 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-navy-700 dark:bg-navy-900 dark:text-parchment-50 dark:focus:ring-gold-500"
        />

        <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Icon</label>
        <div className="mb-4">
          <IconPicker value={icon} onChange={setIcon} />
        </div>

        <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Color</label>
        <div className="mb-4">
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <button
          type="button"
          onClick={addToList}
          disabled={!name.trim()}
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 ${theme.accentBtn}`}
        >
          <IconPlus className="h-4 w-4" /> Add to list
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mt-4">
          <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Ready to save ({pending.length})</p>
          <div className="space-y-2">
            {pending.map((s, idx) => (
              <div key={idx} className={`flex items-center gap-3 rounded-lg border p-3 ${theme.card}`}>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: s.color }}>{s.icon}</span>
                <span className={`min-w-0 flex-1 truncate text-sm font-medium ${theme.text}`}>{s.name}</span>
                <button onClick={() => removeFromList(idx)} aria-label="Remove" className="flex-shrink-0 rounded-full px-2 py-1 text-sm text-red-500 active:bg-red-50 dark:active:bg-red-950/30">✕</button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={saveAll}
            className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${theme.accentBtn}`}
          >
            <IconSave className="h-4 w-4" /> Save All ({pending.length})
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Subject card ----------

function CustomSubjectCard({ subject, expanded, onToggle, onPlay, onManage, onDelete, onRefresh, refreshKey, theme }) {
  const stats = useMemo(() => getCustomSubjectStats(subject.id), [subject.id, refreshKey]);
  const hasProgress = stats.answeredCount > 0;

  const handleRestart = (e) => {
    e.stopPropagation();
    if (confirm(`Reset your progress for ${subject.name}? Questions are kept — only your answers are cleared.`)) {
      resetCustomProgress(subject.id);
      onRefresh();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Delete the subject "${subject.name}"? All its questions will be deleted too. This cannot be undone.`)) {
      onDelete(subject.id);
    }
  };

  return (
    <div className={`overflow-hidden rounded-lg border transition-all ${theme.card} ${expanded ? "col-span-2" : ""}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left active:opacity-80">
        <ProgressCircle progress={stats.percentAnswered} size={44} strokeWidth={5} color={subject.color} />
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: subject.color }}>{subject.icon}</span>
        <div className="min-w-0 flex-1">
          <p className={`truncate font-bold ${theme.text}`}>{subject.name}</p>
          <p className={`truncate text-xs ${theme.subtext}`}>{stats.total > 0 ? `${stats.answeredCount}/${stats.total} answered` : "No questions yet"}</p>
        </div>
        <span className={`flex-shrink-0 transition-transform ${theme.subtext} ${expanded ? "rotate-180" : ""}`} aria-hidden>▾</span>
      </button>
      {expanded && (
        <div className="space-y-2 border-t border-black/5 p-4 dark:border-white/5">
          <button
            onClick={() => onPlay(subject)}
            disabled={stats.total === 0}
            className={`flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-40 ${theme.accentBtn}`}
          >
            <IconPlay className="h-4 w-4" /> {hasProgress ? "Continue" : "Start"}
          </button>
          <button onClick={() => onManage(subject)} className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${theme.outlineBtn}`}>
            <IconEdit className="h-4 w-4" /> Add / Edit / Delete Questions
          </button>
          {hasProgress && (
            <button onClick={handleRestart} className={`w-full rounded-xl border px-4 py-2 text-xs font-medium transition-colors ${theme.dangerBtn}`}>
              ↺ Reset progress
            </button>
          )}
          <button onClick={handleDelete} className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-medium transition-colors ${theme.dangerBtn}`}>
            <IconTrash className="h-3.5 w-3.5" /> Delete Subject
          </button>
        </div>
      )}
    </div>
  );
}

// ---------- Main hub ----------

export default function CustomQuizHub({ onBack }) {
  const [subView, setSubView] = useState("hub");
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [settings, setSettings] = useState(() => getCustomQuizSettings());
  const [timerPromptSubject, setTimerPromptSubject] = useState(null);
  const [playTimerChoice, setPlayTimerChoice] = useState(null);

  const subjects = useMemo(() => getCustomSubjects(), [refreshKey]);
  const theme = useCustomQuizTheme(settings.blossomMode);

  const updateSetting = (key, value) => {
    const next = saveCustomQuizSettings({ [key]: value });
    setSettings(next);
  };

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const handleSaveSubjects = (entries) => {
    addCustomSubjects(entries);
    setRefreshKey((k) => k + 1);
    setSubView("hub");
  };

  const handleDeleteSubject = (id) => {
    deleteCustomSubject(id);
    setExpandedId(null);
    setRefreshKey((k) => k + 1);
  };

  const handleManage = (subject) => {
    setActiveSubject(subject);
    setSubView("manage");
  };

  const startPlay = (subject, timerChoice) => {
    setActiveSubject(subject);
    setPlayTimerChoice(timerChoice);
    setSubView("play");
  };

  const handlePlay = (subject) => {
    if (settings.timerEnabled) {
      setTimerPromptSubject(subject);
    } else {
      startPlay(subject, null);
    }
  };

  const backToHub = () => {
    setSubView("hub");
    setActiveSubject(null);
    setPlayTimerChoice(null);
    setRefreshKey((k) => k + 1);
  };

  if (subView === "add-subject") {
    return (
      <div className={`min-h-[100dvh] ${theme.page}`}>
        <AddSubjectView theme={theme} onSave={handleSaveSubjects} onCancel={() => setSubView("hub")} />
      </div>
    );
  }

  if (subView === "manage" && activeSubject) {
    return (
      <div className={`min-h-[100dvh] ${theme.page}`}>
        <CustomQuizManage subject={activeSubject} theme={theme} onBack={backToHub} />
      </div>
    );
  }

  if (subView === "play" && activeSubject) {
    return (
      <div className={`min-h-[100dvh] ${theme.page}`}>
        <CustomQuizPlay
          subject={activeSubject}
          theme={theme}
          randomChoices={settings.randomChoices}
          timerChoice={playTimerChoice}
          onBack={backToHub}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-[100dvh] ${theme.page}`}>
      <div className="mx-auto max-w-2xl p-4">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={onBack} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${theme.subtext}`}>← Back to Subjects</button>
        </div>

        <h1 className={`mb-1 flex items-center gap-1.5 text-xl font-bold ${theme.text}`}><IconLayers className="h-5 w-5" /> Your Own Quiz</h1>
        <p className={`mb-4 text-sm ${theme.subtext}`}>Create your own subjects and questions — always saved on your device.</p>

        <div className="mb-4 space-y-2">
          <OnOffToggle
            label={<span className="flex items-center gap-1.5"><IconDice className="h-4 w-4" /> Random Choices</span>}
            description="Randomizes the answer letters and question order every time you take the quiz"
            checked={settings.randomChoices}
            onChange={(v) => updateSetting("randomChoices", v)}
          />
          <OnOffToggle
            label={<span className="flex items-center gap-1.5"><IconClock className="h-4 w-4" /> Timer</span>}
            description="Asks for a time limit (per question or total) before you start"
            checked={settings.timerEnabled}
            onChange={(v) => updateSetting("timerEnabled", v)}
          />
          <OnOffToggle
            label="🌸 Blossom Mode"
            description="Alternative light/floral theme (default: dark)"
            checked={settings.blossomMode}
            onChange={(v) => updateSetting("blossomMode", v)}
          />
        </div>

        {subjects.length === 0 ? (
          <div className={`flex flex-col items-center gap-3 rounded-lg border border-dashed p-8 text-center ${theme.card}`}>
            <IconLayers className={`h-9 w-9 ${theme.subtext}`} aria-hidden />
            <p className={`text-sm font-medium ${theme.text}`}>You don't have any subjects yet.</p>
            <button onClick={() => setSubView("add-subject")} className={`mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${theme.accentBtn}`}>
              <IconPlus className="h-4 w-4" /> Add Subject
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((s) => (
                <CustomSubjectCard
                  key={s.id}
                  subject={s}
                  expanded={expandedId === s.id}
                  onToggle={() => toggleExpand(s.id)}
                  onPlay={handlePlay}
                  onManage={handleManage}
                  onDelete={handleDeleteSubject}
                  onRefresh={() => setRefreshKey((k) => k + 1)}
                  refreshKey={refreshKey}
                  theme={theme}
                />
              ))}
            </div>
            <button
              onClick={() => setSubView("add-subject")}
              className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-4 text-sm font-semibold transition-colors ${theme.outlineBtn}`}
            >
              <IconPlus className="h-4 w-4" /> Add Subject
            </button>
          </>
        )}
      </div>

      {timerPromptSubject && (
        <TimerPickerModal
          theme={theme}
          onPick={(choice) => { startPlay(timerPromptSubject, choice); setTimerPromptSubject(null); }}
          onCancel={() => setTimerPromptSubject(null)}
        />
      )}
    </div>
  );
}
