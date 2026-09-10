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
        <span className={`text-sm font-semibold ${theme.text}`}>➕ Add Subject</span>
      </div>

      <div className={`rounded-2xl border p-4 ${theme.card}`}>
        <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Subject name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addToList()}
          placeholder="e.g. Science, Math, Anatomy…"
          className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-navy-500"
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
          className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 ${theme.accentBtn}`}
        >
          ➕ Idagdag sa listahan
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mt-4">
          <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Ihahanda ({pending.length})</p>
          <div className="space-y-2">
            {pending.map((s, idx) => (
              <div key={idx} className={`flex items-center gap-3 rounded-xl border p-3 ${theme.card}`}>
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: s.color }}>{s.icon}</span>
                <span className={`min-w-0 flex-1 truncate text-sm font-medium ${theme.text}`}>{s.name}</span>
                <button onClick={() => removeFromList(idx)} aria-label="Remove" className="flex-shrink-0 rounded-full px-2 py-1 text-sm text-red-500 active:bg-red-50 dark:active:bg-red-950/30">✕</button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={saveAll}
            className={`mt-3 w-full rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-colors ${theme.accentBtn}`}
          >
            💾 I-save Lahat ({pending.length})
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
    if (confirm(`Reset progress mo para sa ${subject.name}? Hindi mabubura ang mga tanong, mga sagot mo lang.`)) {
      resetCustomProgress(subject.id);
      onRefresh();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Burahin ang subject na "${subject.name}"? Mabubura rin lahat ng tanong dito. Hindi na ito mababawi.`)) {
      onDelete(subject.id);
    }
  };

  return (
    <div className={`overflow-hidden rounded-2xl border transition-all ${theme.card} ${expanded ? "col-span-2" : ""}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left active:opacity-80">
        <ProgressCircle progress={stats.percentAnswered} size={44} strokeWidth={5} color={subject.color} />
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: subject.color }}>{subject.icon}</span>
        <div className="min-w-0 flex-1">
          <p className={`truncate font-bold ${theme.text}`}>{subject.name}</p>
          <p className={`truncate text-xs ${theme.subtext}`}>{stats.total > 0 ? `${stats.answeredCount}/${stats.total} sagot na` : "Walang tanong pa"}</p>
        </div>
        <span className={`flex-shrink-0 transition-transform ${theme.subtext} ${expanded ? "rotate-180" : ""}`} aria-hidden>▾</span>
      </button>
      {expanded && (
        <div className="space-y-2 border-t border-black/5 p-4 dark:border-white/5">
          <button
            onClick={() => onPlay(subject)}
            disabled={stats.total === 0}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-40 ${theme.accentBtn}`}
          >
            {hasProgress ? "▶️ Continue" : "▶️ Start"}
          </button>
          <button onClick={() => onManage(subject)} className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${theme.outlineBtn}`}>
            ✏️ Add / Edit / Delete Questions
          </button>
          {hasProgress && (
            <button onClick={handleRestart} className={`w-full rounded-xl border px-4 py-2 text-xs font-medium transition-colors ${theme.dangerBtn}`}>
              ↺ Reset progress
            </button>
          )}
          <button onClick={handleDelete} className={`w-full rounded-xl border px-4 py-2 text-xs font-medium transition-colors ${theme.dangerBtn}`}>
            🗑️ Delete Subject
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

        <h1 className={`mb-1 text-xl font-bold ${theme.text}`}>🧩 Your Own Quiz</h1>
        <p className={`mb-4 text-sm ${theme.subtext}`}>Gumawa ng sarili mong subject at tanong — laging naka-save sa device mo.</p>

        <div className="mb-4 space-y-2">
          <OnOffToggle
            label="🎲 Random Choices"
            description="Random ang letra ng sagot at pagkakasunod ng tanong tuwing mag-quiz"
            checked={settings.randomChoices}
            onChange={(v) => updateSetting("randomChoices", v)}
          />
          <OnOffToggle
            label="⏱️ Timer"
            description="Magtatanong ng oras (per question o total) bago magsimula"
            checked={settings.timerEnabled}
            onChange={(v) => updateSetting("timerEnabled", v)}
          />
          <OnOffToggle
            label="🌸 Blossom Mode"
            description="Alternatibong light/floral na theme (default: dark)"
            checked={settings.blossomMode}
            onChange={(v) => updateSetting("blossomMode", v)}
          />
        </div>

        {subjects.length === 0 ? (
          <div className={`flex flex-col items-center gap-3 rounded-2xl border border-dashed p-8 text-center ${theme.card}`}>
            <span className="text-4xl" aria-hidden>🧩</span>
            <p className={`text-sm font-medium ${theme.text}`}>Wala ka pang sariling subject.</p>
            <button onClick={() => setSubView("add-subject")} className={`mt-1 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${theme.accentBtn}`}>
              ➕ Add Subject
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
              className={`mt-3 w-full rounded-2xl border-2 border-dashed px-4 py-4 text-sm font-semibold transition-colors ${theme.outlineBtn}`}
            >
              ➕ Add Subject
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
