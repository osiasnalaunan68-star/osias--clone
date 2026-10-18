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
        placeholder="Or type your own emoji"
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
        <p className={`mb-4 text-sm ${theme.subtext}`}>Choose how the timer runs for this quiz.</p>
        <button
          type="button"
          onClick={() => onPick({ mode: "perQuestion", seconds: 25 })}
          className={`mb-2 w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-colors ${theme.outlineBtn}`}
        >
          🔂 Per question — 25s each
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
