#!/data/data/com.termux/files/usr/bin/bash
# ============================================================================
# "Your Own Quiz" feature — pag-apply sa iyong Customs Law quiz app
# ----------------------------------------------------------------------------
# Bagong feature LANG ito, hiwalay na files + 1 maliit na update sa QuizHub.jsx.
# Walang binago sa: firebase.js, authContext.jsx, quizStore.js, subjectQuizStore.js,
# data/subjects.js, o anumang built-in na quiz (RA10863 / CL / CDP / TL / PC).
#
# PAANO GAMITIN:
#   1. Sa Termux, mag-cd ka papunta sa ROOT ng repo mo (kung saan makikita
#      ang folder na "frontend"). Halimbawa:
#         cd ~/storage/downloads/customs-law-app   (o kung saan mo nilagay)
#   2. I-paste ang buong script na ito, pindutin Enter.
#   3. Susundan nito ng "npm run build" — patunayan munang tumatakbo ang
#      "npm run build" mo dati bago ito i-run kung ito ang unang beses mo.
#   4. Sa dulo, may commented-out na git push + firebase deploy — alisin
#      lang ang "#" sa unahan kung handa ka nang i-publish.
# ============================================================================
set -e

if [ ! -d "frontend/src/pages" ]; then
  echo "ERROR: Hindi makita ang frontend/src/pages — patakbuhin ito sa loob ng repo root mo (kung saan nakikita ang folder na 'frontend')."
  exit 1
fi

echo "== Sumusulat ng mga bagong file =="
echo "  -> customQuizStore.js (bagong storage layer)"
mkdir -p "frontend/src"
cat > frontend/src/customQuizStore.js << 'CQ_STORE_EOF'
// Storage para sa "🧩 Your own quiz" — mga subject na ginawa mismo ng user.
// Fully local (walang Firebase sync, walang seed data): bawat user, sariling
// device lang ang nakikita. Hiwalay talaga ang mga localStorage key dito sa
// frontend/src/quizStore.js (RA10863) at frontend/src/subjectQuizStore.js
// (CL/CDP/TL/PC) — kaya zero epekto sa mga built-in na quiz ng 100+ users.

const SUBJECTS_KEY = "customsLaw_customQuiz_subjects";
const SETTINGS_KEY = "customsLaw_customQuiz_settings";

function questionsKey(subjectId) {
  return `customsLaw_customQuiz_questions_${subjectId}`;
}
function progressKey(subjectId) {
  return `customsLaw_customQuiz_progress_${subjectId}`;
}

function safeParse(raw, fallback) {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch {
    return fallback;
  }
}

function genId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Settings (Random Choices / Timer / Blossom Mode toggles) ----------

const DEFAULT_SETTINGS = { randomChoices: false, timerEnabled: false, blossomMode: false };

export function getCustomQuizSettings() {
  return { ...DEFAULT_SETTINGS, ...safeParse(localStorage.getItem(SETTINGS_KEY), {}) };
}

export function saveCustomQuizSettings(patch) {
  const next = { ...getCustomQuizSettings(), ...patch };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

// ---------- Subjects ----------

export function getCustomSubjects() {
  const list = safeParse(localStorage.getItem(SUBJECTS_KEY), []);
  return Array.isArray(list) ? list : [];
}

function saveCustomSubjectsList(list) {
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(list));
}

export function getCustomSubjectById(id) {
  return getCustomSubjects().find((s) => s.id === id) || null;
}

// entries: [{ name, icon, color }, ...] — pwedeng isa isa, dalawa, o marami,
// isang localStorage write lang mangyayari (isang click ng "Save All").
export function addCustomSubjects(entries) {
  const list = getCustomSubjects();
  const now = new Date().toISOString();
  const created = [];
  for (const entry of entries || []) {
    const name = String(entry?.name || "").trim();
    if (!name) continue;
    const subject = {
      id: genId("cq"),
      name,
      icon: entry.icon || "📘",
      color: entry.color || "#8b5cf6",
      createdAt: now,
    };
    list.push(subject);
    created.push(subject);
  }
  if (created.length) saveCustomSubjectsList(list);
  return created;
}

export function updateCustomSubject(id, patch) {
  const list = getCustomSubjects();
  const idx = list.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  saveCustomSubjectsList(list);
  return list[idx];
}

export function deleteCustomSubject(id) {
  const list = getCustomSubjects().filter((s) => s.id !== id);
  saveCustomSubjectsList(list);
  try {
    localStorage.removeItem(questionsKey(id));
    localStorage.removeItem(progressKey(id));
  } catch {}
}

// ---------- Questions ----------

function loadQuestions(subjectId) {
  const parsed = safeParse(localStorage.getItem(questionsKey(subjectId)), {});
  return parsed && typeof parsed === "object" ? parsed : {};
}

function saveQuestions(subjectId, entries) {
  localStorage.setItem(questionsKey(subjectId), JSON.stringify(entries));
}

export function getCustomQuestions(subjectId) {
  return loadQuestions(subjectId);
}

function numericSort(a, b) {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function getSortedCustomQuestionIds(subjectId) {
  return Object.keys(loadQuestions(subjectId)).sort(numericSort);
}

// item: { question, choices: {A,B,...}, correct, reason }
export function addCustomQuestion(subjectId, item) {
  const entries = loadQuestions(subjectId);
  const nums = Object.keys(entries).map((id) => parseInt(id, 10)).filter((n) => !isNaN(n));
  const nextId = String((nums.length ? Math.max(...nums) : 0) + 1);
  entries[nextId] = item;
  saveQuestions(subjectId, entries);
  return nextId;
}

export function updateCustomQuestion(subjectId, questionId, patch) {
  const entries = loadQuestions(subjectId);
  if (!entries[questionId]) return;
  entries[questionId] = { ...entries[questionId], ...patch };
  saveQuestions(subjectId, entries);
}

export function deleteCustomQuestion(subjectId, questionId) {
  const entries = loadQuestions(subjectId);
  delete entries[questionId];
  saveQuestions(subjectId, entries);
}

// ---------- Progress (resume + play-session shuffle state) ----------

export function getCustomProgress(subjectId) {
  const parsed = safeParse(localStorage.getItem(progressKey(subjectId)), null);
  return parsed && typeof parsed === "object"
    ? {
        answers: parsed.answers || {},
        currentIndex: parsed.currentIndex || 0,
        order: parsed.order || null,
        choiceMaps: parsed.choiceMaps || null,
        timer: parsed.timer || null,
        lockedIds: Array.isArray(parsed.lockedIds) ? parsed.lockedIds : [],
        finished: !!parsed.finished,
      }
    : { answers: {}, currentIndex: 0, order: null, choiceMaps: null, timer: null, lockedIds: [], finished: false };
}

export function saveCustomProgress(subjectId, progress) {
  try {
    localStorage.setItem(progressKey(subjectId), JSON.stringify({ ...progress, updatedAt: new Date().toISOString() }));
  } catch {}
}

export function resetCustomProgress(subjectId) {
  try {
    localStorage.removeItem(progressKey(subjectId));
  } catch {}
}

export function getCustomSubjectStats(subjectId) {
  const entries = loadQuestions(subjectId);
  const itemIds = Object.keys(entries);
  const total = itemIds.length;
  const progress = getCustomProgress(subjectId);
  const answeredIds = Object.keys(progress.answers).filter((id) => entries[id]);
  const answeredCount = answeredIds.length;
  const correctCount = answeredIds.filter(
    (id) => String(progress.answers[id] ?? "").trim().toLowerCase() === String(entries[id].correct ?? "").trim().toLowerCase()
  ).length;
  return {
    total,
    answeredCount,
    correctCount,
    percentAnswered: total ? (answeredCount / total) * 100 : 0,
    percentCorrect: answeredCount ? (correctCount / answeredCount) * 100 : 0,
  };
}

// ---------- Shuffle helpers (Random Choices toggle) ----------

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Gumagawa ng bagong randomized na pagkakasunod-sunod ng mga tanong (numbering)
// + randomized na letra kung saan lalabas ang bawat choice, PERO hindi kailanman
// ginagalaw ang orihinal na naka-save na datos ng subject — sa isang play
// session lang ito ginagamit, at nakalagay sa "progress" para di na ulit
// mag-iiba pag nag-resume lang (fresh reshuffle lang kapag bagong simula).
export function buildShuffledSession(subjectId) {
  const entries = loadQuestions(subjectId);
  const order = shuffleArray(Object.keys(entries));
  const choiceMaps = {};
  for (const id of order) {
    const choices = entries[id]?.choices;
    if (choices && typeof choices === "object") {
      const keys = Object.keys(choices);
      const shuffledKeys = shuffleArray(keys);
      const map = {}; // displaySlot -> originalKey na ipapakita sa slot na 'yon
      keys.forEach((slot, i) => { map[slot] = shuffledKeys[i]; });
      choiceMaps[id] = map;
    }
  }
  return { order, choiceMaps };
}
CQ_STORE_EOF

echo "  -> components/CustomQuizShared.jsx (bagong shared UI)"
mkdir -p "frontend/src/components"
cat > frontend/src/components/CustomQuizShared.jsx << 'CQ_SHARED_EOF'
import { useEffect, useRef, useState } from "react";

// ---------- On/Off pill toggle (red = OFF, green = ON, may salitang ON/OFF) ----------

export function OnOffToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
        {description && <p className="truncate text-xs text-slate-400 dark:text-slate-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide text-white shadow-sm transition-colors active:scale-95 ${
          checked ? "bg-emerald-500 active:bg-emerald-600" : "bg-red-500 active:bg-red-600"
        }`}
      >
        {checked ? "ON" : "OFF"}
      </button>
    </div>
  );
}

// ---------- Icon (emoji) options ----------

export const EMOJI_OPTIONS = [
  "📘", "🔬", "🧮", "📐", "🌍", "💻", "🧪", "⚗️",
  "🩺", "⚖️", "🎨", "🎵", "🏛️", "🗣️", "💰", "📊",
  "🧬", "⚛️", "🌱", "🏗️", "✏️", "📖", "🖥️", "🔢",
];

// ---------- Color options ----------

export const COLOR_PALETTE = [
  { name: "Violet", value: "#8b5cf6" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Slate", value: "#64748b" },
];

export function IconPicker({ value, onChange }) {
  return (
    <div>
      <div className="grid grid-cols-8 gap-1.5">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-all ${
              value === emoji ? "bg-navy-900 ring-2 ring-navy-900 dark:bg-navy-700 dark:ring-navy-400" : "bg-slate-100 active:bg-slate-200 dark:bg-slate-700 dark:active:bg-slate-600"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={value}
        maxLength={4}
        onChange={(e) => onChange(e.target.value || "📘")}
        placeholder="O mag-type ng sarili mong emoji"
        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-navy-500"
      />
    </div>
  );
}

export function ColorPicker({ value, onChange }) {
  const isCustom = !COLOR_PALETTE.some((c) => c.value.toLowerCase() === String(value).toLowerCase());
  return (
    <div>
      <div className="grid grid-cols-8 gap-1.5">
        {COLOR_PALETTE.map((c) => (
          <button
            key={c.value}
            type="button"
            title={c.name}
            onClick={() => onChange(c.value)}
            style={{ backgroundColor: c.value }}
            className={`h-9 w-9 rounded-lg transition-all ${value === c.value ? "ring-2 ring-offset-2 ring-slate-900 dark:ring-offset-slate-900 dark:ring-slate-100" : ""}`}
          />
        ))}
        <label
          title="Custom color"
          style={{ backgroundColor: isCustom ? value : "transparent" }}
          className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-xs dark:border-slate-500 ${isCustom ? "ring-2 ring-offset-2 ring-slate-900 dark:ring-offset-slate-900 dark:ring-slate-100" : "bg-slate-50 dark:bg-slate-700"}`}
        >
          {!isCustom && "🎨"}
          <input type="color" value={isCustom ? value : "#8b5cf6"} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
        </label>
      </div>
    </div>
  );
}

// ---------- Blossom Mode theme helper ----------
// Naka-default sa dark/standard look ng app (sinusunod ang global dark: classes).
// Kapag naka-ON ang Blossom Mode, i-override ito ng maayang pink/floral light
// theme — pero SCOPED lang sa "Your own quiz" section. Hindi kailanman
// ginagalaw ang global dark mode setting ng buong app.
export function useCustomQuizTheme(blossomMode) {
  if (blossomMode) {
    return {
      blossom: true,
      page: "bg-gradient-to-b from-rose-50 via-pink-50 to-fuchsia-50",
      card: "border-rose-200 bg-white",
      cardAlt: "border-rose-200 bg-rose-50/60",
      text: "text-rose-950",
      subtext: "text-rose-400",
      accentBtn: "bg-rose-500 text-white shadow-sm active:bg-rose-600",
      outlineBtn: "border-rose-300 text-rose-600 active:bg-rose-100",
      dangerBtn: "border-rose-300 text-red-600 active:bg-red-50",
      chip: "bg-rose-100 text-rose-700",
      barTrack: "bg-rose-100",
      barFill: "bg-gradient-to-r from-fuchsia-400 to-rose-500",
    };
  }
  return {
    blossom: false,
    page: "bg-slate-50 dark:bg-slate-950",
    card: "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800",
    cardAlt: "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40",
    text: "text-navy-900 dark:text-slate-100",
    subtext: "text-slate-400 dark:text-slate-500",
    accentBtn: "bg-navy-900 text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600",
    outlineBtn: "border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700",
    dangerBtn: "border-red-200 text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400 dark:active:bg-red-950/30",
    chip: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    barTrack: "bg-slate-100 dark:bg-slate-700",
    barFill: "bg-gradient-to-r from-amber-400 to-navy-700 dark:from-amber-500 dark:to-navy-400",
  };
}

// ---------- Timer picker (asked once, right before a timed quiz starts) ----------

export const TOTAL_TIMER_MINUTES = [5, 10, 20, 45, 60];

export function TimerPickerModal({ theme, onPick, onCancel }) {
  return (
    <div className="fixed inset-0 z-[80] flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm">
      <div className={`w-full rounded-t-3xl border-t p-5 shadow-2xl ${theme.card}`}>
        <p className={`mb-1 text-lg font-bold ${theme.text}`}>⏱️ Timer</p>
        <p className={`mb-4 text-sm ${theme.subtext}`}>Piliin kung paano tatakbo ang oras para sa quiz na ito.</p>
        <button
          type="button"
          onClick={() => onPick({ mode: "perQuestion", seconds: 25 })}
          className={`mb-2 w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-colors ${theme.outlineBtn}`}
        >
          🔂 Bawat tanong — 25s kada tanong
        </button>
        <div className="mb-2 grid grid-cols-3 gap-2">
          {TOTAL_TIMER_MINUTES.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => onPick({ mode: "total", seconds: min * 60 })}
              className={`rounded-xl border-2 px-3 py-3 text-center text-sm font-semibold transition-colors ${theme.outlineBtn}`}
            >
              {min} min
            </button>
          ))}
        </div>
        <button type="button" onClick={onCancel} className={`mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-medium ${theme.subtext}`}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// Countdown na hango sa isang absolute deadline (timestamp ms) — hindi ito
// naliligaw kahit ma-throttle ng browser ang setInterval sa background tab.
export function useDeadlineCountdown(deadlineMs, onExpire) {
  const [remainingMs, setRemainingMs] = useState(() => (deadlineMs ? Math.max(0, deadlineMs - Date.now()) : 0));

  // Laging tumuturo sa PINAKABAGONG onExpire (na may updated answers/state
  // sa closure nito) — kahit hindi nag-re-run ang timer effect sa ibaba
  // dahil hindi nagbabago ang deadlineMs mismo habang tumatakbo ang quiz.
  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (!deadlineMs) {
      setRemainingMs(0);
      return;
    }
    let expired = false;
    let interval = null;
    const tick = () => {
      const left = Math.max(0, deadlineMs - Date.now());
      setRemainingMs(left);
      if (left <= 0 && !expired) {
        expired = true;
        if (interval) clearInterval(interval);
        onExpireRef.current && onExpireRef.current();
      }
    };
    tick();
    interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [deadlineMs]);

  return remainingMs;
}

export function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, "0")}`;
}
CQ_SHARED_EOF

echo "  -> pages/CustomQuizHub.jsx (bagong hub)"
mkdir -p "frontend/src/pages"
cat > frontend/src/pages/CustomQuizHub.jsx << 'CQ_HUB_EOF'
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
CQ_HUB_EOF

echo "  -> pages/CustomQuizManage.jsx (bagong add/edit/delete questions)"
mkdir -p "frontend/src/pages"
cat > frontend/src/pages/CustomQuizManage.jsx << 'CQ_MANAGE_EOF'
import { useMemo, useState } from "react";
import {
  getCustomQuestions, getSortedCustomQuestionIds,
  addCustomQuestion, updateCustomQuestion, deleteCustomQuestion,
} from "../customQuizStore";

const EMPTY_FORM = { question: "", A: "", B: "", C: "", D: "", correct: "A", reason: "" };

function QuestionForm({ theme, initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const filledChoiceKeys = ["A", "B", "C", "D"].filter((k) => form[k].trim());
  const canSave = form.question.trim() && filledChoiceKeys.length >= 2 && filledChoiceKeys.includes(form.correct);

  const handleSave = () => {
    if (!canSave) return;
    const choices = {};
    filledChoiceKeys.forEach((k) => { choices[k] = form[k].trim(); });
    onSave({ question: form.question.trim(), choices, correct: form.correct, reason: form.reason.trim() });
  };

  return (
    <div className={`mb-4 rounded-2xl border-2 p-4 shadow-md ${theme.card}`}>
      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Question</label>
      <textarea
        value={form.question}
        onChange={(e) => setField("question", e.target.value)}
        rows={2}
        placeholder="I-type ang tanong dito…"
        className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-navy-500"
      />

      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Choices (A at B required, C/D optional)</label>
      <div className="mb-3 space-y-2">
        {["A", "B", "C", "D"].map((k) => (
          <div key={k} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => form[k].trim() && setField("correct", k)}
              title={form[k].trim() ? "Markahan bilang tamang sagot" : ""}
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                form.correct === k && form[k].trim()
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              {k}
            </button>
            <input
              type="text"
              value={form[k]}
              onChange={(e) => setField(k, e.target.value)}
              placeholder={k === "A" || k === "B" ? `Choice ${k}` : `Choice ${k} (optional)`}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-navy-500"
            />
          </div>
        ))}
      </div>
      <p className={`mb-3 text-xs ${theme.subtext}`}>👆 I-tap ang letra para markahan bilang tamang sagot. Kasalukuyang tama: <strong>{form.correct}</strong></p>

      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Reason (bakit tama ang sagot)</label>
      <textarea
        value={form.reason}
        onChange={(e) => setField("reason", e.target.value)}
        rows={2}
        placeholder={`Kasi ang ${form.correct} ay…`}
        className="mb-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-navy-500"
      />

      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium ${theme.outlineBtn}`}>Cancel</button>
        <button type="button" onClick={handleSave} disabled={!canSave} className={`flex-[2] rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-40 ${theme.accentBtn}`}>💾 Save Question</button>
      </div>
    </div>
  );
}

function QuestionBox({ id, item, theme, onEdit, onDelete }) {
  const choiceKeys = Object.keys(item.choices || {});
  return (
    <div className={`rounded-2xl border-2 p-4 shadow-md ${theme.card}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className={`inline-flex h-6 min-w-6 flex-shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold ${theme.chip}`}>{id}</span>
        <div className="flex flex-shrink-0 gap-1">
          <button onClick={onEdit} aria-label="Edit" className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${theme.outlineBtn}`}>✏️ Edit</button>
          <button onClick={onDelete} aria-label="Delete" className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium ${theme.dangerBtn}`}>🗑️</button>
        </div>
      </div>
      <p className={`mb-2 text-sm font-medium ${theme.text}`}>{item.question}</p>
      <div className="mb-1 flex flex-wrap gap-1.5">
        {choiceKeys.map((k) => (
          <span key={k} className={`rounded-md px-2 py-0.5 text-xs ${k === item.correct ? "bg-emerald-100 font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" : theme.chip}`}>
            {k}. {item.choices[k]}
          </span>
        ))}
      </div>
      {item.reason && <p className={`mt-2 text-xs italic ${theme.subtext}`}>💡 {item.reason}</p>}
    </div>
  );
}

export default function CustomQuizManage({ subject, theme, onBack }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const entries = useMemo(() => getCustomQuestions(subject.id), [subject.id, refreshKey]);
  const ids = useMemo(() => getSortedCustomQuestionIds(subject.id), [subject.id, refreshKey]);

  const openAdd = () => { setEditingId(null); setFormOpen(true); };
  const openEdit = (id) => { setEditingId(id); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingId(null); };

  const handleSave = (data) => {
    if (editingId) {
      updateCustomQuestion(subject.id, editingId, data);
    } else {
      addCustomQuestion(subject.id, data);
    }
    setRefreshKey((k) => k + 1);
    closeForm();
  };

  const handleDelete = (id) => {
    if (!confirm(`Burahin ang tanong #${id}? Hindi na ito mababawi.`)) return;
    deleteCustomQuestion(subject.id, id);
    setRefreshKey((k) => k + 1);
  };

  const editingInitial = editingId
    ? (() => {
        const item = entries[editingId];
        return { question: item.question || "", A: item.choices?.A || "", B: item.choices?.B || "", C: item.choices?.C || "", D: item.choices?.D || "", correct: item.correct || "A", reason: item.reason || "" };
      })()
    : null;

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium ${theme.subtext}`}>← Back</button>
        <span className={`flex items-center gap-1.5 text-sm font-semibold ${theme.text}`}>
          <span style={{ backgroundColor: subject.color }} className="flex h-6 w-6 items-center justify-center rounded-full text-sm">{subject.icon}</span>
          {subject.name}
        </span>
      </div>

      {!formOpen && (
        <button onClick={openAdd} className={`mb-4 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${theme.accentBtn}`}>
          ➕ Magdagdag ng Tanong
        </button>
      )}

      {formOpen && <QuestionForm key={editingId || "new"} theme={theme} initial={editingInitial} onSave={handleSave} onCancel={closeForm} />}

      {ids.length === 0 ? (
        <p className={`rounded-xl border border-dashed p-6 text-center text-sm ${theme.card} ${theme.subtext}`}>Wala pang tanong. Simulan sa "➕ Magdagdag ng Tanong" sa itaas.</p>
      ) : (
        <div className="space-y-3">
          {ids.map((id) => (
            <QuestionBox key={id} id={id} item={entries[id]} theme={theme} onEdit={() => openEdit(id)} onDelete={() => handleDelete(id)} />
          ))}
        </div>
      )}
    </div>
  );
}
CQ_MANAGE_EOF

echo "  -> pages/CustomQuizPlay.jsx (bagong play view)"
mkdir -p "frontend/src/pages"
cat > frontend/src/pages/CustomQuizPlay.jsx << 'CQ_PLAY_EOF'
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
CQ_PLAY_EOF

echo "  -> pages/QuizHub.jsx (UPDATE — dinagdagan ng 'Your Own Quiz' button)"
mkdir -p "frontend/src/pages"
cat > frontend/src/pages/QuizHub.jsx << 'CQ_HUBPAGE_EOF'
import { useState, useMemo } from "react";
import QuizPage, { loadQuizData } from "./QuizPage";
import { SubjectQuizPlay } from "./SubjectDashboard";
import CustomQuizHub from "./CustomQuizHub";
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
            {["tl", "cdp", "pc"].map((id) => (
              <SubjectCard key={id} subjectId={id} expanded={expandedCard === id} onToggle={() => toggleCard(id)} onPlay={handlePlaySubject} />
            ))}
            <button
              onClick={() => setActiveView({ type: "custom-quiz" })}
              className="col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-all active:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700/50"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-600 text-lg" aria-hidden>🧩</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-navy-900 dark:text-slate-100">Your Own Quiz</p>
                <p className="truncate text-xs text-slate-400 dark:text-slate-500">Gumawa ng sarili mong subject at tanong</p>
              </div>
              <span className="flex-shrink-0 text-slate-300 dark:text-slate-600" aria-hidden>→</span>
            </button>
          </div>
        )}
        {activeView?.type === "subject-play" && (
          <div className="mx-auto max-w-2xl p-4">
            <SubjectQuizPlay subjectId={activeView.subjectId} subjectLabel={activeView.label} onBack={backToHub} />
          </div>
        )}
        {activeView?.type === "ra10863-titles" && <QuizPage />}
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
CQ_HUBPAGE_EOF

echo "== Tapos na ang pagsulat ng files =="
echo ""
echo "Susunod: i-build natin."
cd frontend
npm run build
cd ..
echo "== Build done — nasa docs/ folder na ang bagong build =="
echo ""
echo "Kapag OK na ang tingin mo (subukan muna sa browser/localhost kung kaya),"
echo "alisin ang '#' sa mga linyang ito para mag-push at mag-deploy:"
echo ""
echo "# git add -A"
echo "# git commit -m \"Add Your Own Quiz feature\""
echo "# git push"
echo "# firebase deploy"
