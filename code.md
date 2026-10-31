## File: ./codemagic.yaml
```
workflows:
  ra10863-android:
    name: RA10863 Android APK
    max_build_duration: 30
    environment:
      node: 22
      java: 21
      android_signing:
        - ra10863_keystore
    scripts:
      - name: Install dependencies
        script: |
          cd frontend
          npm install
      - name: Build web assets
        script: |
          cd frontend
          npm run build
      - name: Add Capacitor Android platform (if missing)
        script: |
          cd frontend
          if [ ! -d android ]; then
            npx cap add android
          fi
      - name: Add Firebase Android config
        script: |
          cd frontend
          cp google-services.json android/app/google-services.json
      - name: Sync Capacitor Android
        script: |
          cd frontend
          npx cap sync android
      - name: Install capacitor-assets and generate app icon
        script: |
          cd frontend
          npm install @capacitor/assets --save-dev
          npx capacitor-assets generate --android
      - name: Build release APK
        script: |
          cd frontend/android
          chmod +x gradlew
          ./gradlew assembleRelease
          echo "--- Searching for build output ---"
          find app/build/outputs -type f 2>/dev/null || echo "outputs dir missing"
      - name: Print APK signing SHA-1
        script: |
          APK=$(find frontend/android/app/build/outputs -name "*.apk" | head -1)
          APKSIGNER=$(find "$ANDROID_HOME/build-tools" -name apksigner | sort | tail -1)
          "$APKSIGNER" verify --print-certs "$APK" | grep -E "SHA-1|SHA-256" || true
    artifacts:
      - frontend/android/app/build/outputs/**/*.apk
      - frontend/android/app/build/outputs/**/output-metadata.json
    publishing:
      email:
        recipients:
          - osiasnalaunan68@gmail.com
        notify:
          success: true
          failure: true
```

## File: ./frontend/index.html
```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <title>RA 10863 – Customs Modernization and Tariff Act</title>
    <link rel="manifest" href="%BASE_URL%manifest.json" />
    <link rel="icon" type="image/x-icon" href="%BASE_URL%favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="%BASE_URL%icons/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="%BASE_URL%icons/favicon-16.png" />
    <link rel="apple-touch-icon" href="%BASE_URL%icons/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet" />

    <script>
      (function () {
        try {
          if (localStorage.getItem("customsLaw_darkMode") === "true") {
            document.documentElement.classList.add("dark");
          }
        } catch (e) {}
      })();
    </script>

    <style>
      html { -webkit-tap-highlight-color: transparent; }
      body { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
      mark { background: #fde68a; padding: 0 2px; border-radius: 3px; color: #1e293b; font-weight: 600; }
      .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
      .safe-top { padding-top: env(safe-area-inset-top); }
    </style>
  </head>
  <body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## File: ./frontend/postcss.config.js
```
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## File: ./frontend/public/sw.js
```
// Service worker — network-first, with a short timeout for this app's own files.
// On a weak or "connected but not really" network, a normal fetch can hang forever and the app
// freezes on the loading screen. Now, if a cached copy exists, it is used after NETWORK_TIMEOUT_MS.
const CACHE_NAME = "cmta-app-cache-v3";
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    if (response && (response.ok || response.type === "opaque")) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
    }
    return response;
  });
}

async function offlineFallback(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  if (request.mode === "navigate") {
    const shell = await caches.match(self.registration.scope);
    if (shell) return shell;
  }
  return Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const sameOrigin = new URL(request.url).origin === self.location.origin;

  event.respondWith(
    (async () => {
      // Cross-origin (fonts, Firebase): old behavior, no timeout, so stale API data is never served.
      if (!sameOrigin) return fetchAndCache(request).catch(() => offlineFallback(request));

      const network = fetchAndCache(request);
      network.catch(() => {}); // avoid an unhandled rejection if the timeout wins the race
      const cached = await caches.match(request);
      if (!cached) return network.catch(() => offlineFallback(request));

      const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS));
      try {
        const fresh = await Promise.race([network, timeout]);
        if (fresh) return fresh;
      } catch (_) {}
      return cached;
    })()
  );
});
```

## File: ./frontend/src/aiContext.js
```
import aiContextData from "./data/aiContext.json";

// Osias 6.7 — bundled AI explanations, shipped fully offline with the app.
// Lookup order: (1) npm-run-dev preview [dev only], (2) the committed aiContext.json bundled at build time.

const DEV_PREVIEW_KEY = "customsLaw_aiContextDevPreview";
export const IS_DEV = import.meta.env.DEV;

function readDevPreview() {
  if (!IS_DEV) return {};
  try {
    return JSON.parse(localStorage.getItem(DEV_PREVIEW_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getAiContext(nodeId) {
  const key = String(nodeId);
  if (IS_DEV) {
    const preview = readDevPreview();
    if (preview[key]) return preview[key];
  }
  return aiContextData[key] || null;
}

export function saveDevPreviewBatch(jsonText) {
  if (!IS_DEV) throw new Error("Preview is only available in npm run dev");
  const parsed = JSON.parse(jsonText);
  const merged = { ...readDevPreview(), ...parsed };
  localStorage.setItem(DEV_PREVIEW_KEY, JSON.stringify(merged));
  return merged;
}

export function clearDevPreview() {
  if (!IS_DEV) return;
  localStorage.removeItem(DEV_PREVIEW_KEY);
}

export function getDevPreviewRaw() {
  if (!IS_DEV) return "{}";
  return JSON.stringify(readDevPreview(), null, 2);
}

export const MASTER_PROMPT = `🧠 MASTER CONTENT GENERATION PROMPT
You are an expert Customs Broker, CMTA legal educator, instructional designer, and content writer for AHTN Navigator.
Your task is to generate a pre-written Study Guide for each Definition, Section, Chapter, or Provision of Republic Act No. 10863 (CMTA).
The Study Guide will be stored permanently in the application's database. It is NOT AI-generated at runtime. Every response must be written as if it were created by an experienced Customs law professor.

SOURCE OF TRUTH
The official text from the provided JSON file is the only legal source.
Never modify the official law. Never rewrite the official law. Never omit important legal meaning.
Never invent legal requirements. Never fabricate court cases or legal interpretations.
If additional information is unavailable, clearly state that instead of guessing.

TARGET AUDIENCE
Write for: First-year BSCA students, Customs Broker reviewees, and professionals who want a simple explanation.
The reader should feel like a professor is explaining the topic in plain language.

LANGUAGE
Primary language: Tagalog. Keep important legal terms in English when appropriate.
Use simple, conversational Tagalog. Avoid deep legal jargon unless you immediately explain it.

WRITING STYLE
The explanation should feel like a mentor talking to a student.
Do NOT sound like ChatGPT. Do NOT sound robotic. Do NOT simply repeat the law.
Instead: Explain. Teach. Simplify. Give context. Build understanding.

REQUIRED FORMAT
Generate the following sections in this exact order.

📖 Kahulugan
Start with a one-paragraph explanation in very simple Tagalog. The reader should immediately understand what the topic means.

🔍 Breakdown
Break the provision into its important parts. Explain each keyword separately (e.g. Imported Goods, Free Zone, Directly or Through Transit). Explain why each one matters.

💡 Simpleng Paliwanag
Pretend you're explaining the topic to your classmate one day before the exam. Avoid legal wording. Make it easy to remember.

📦 Halimbawa
Create one realistic Customs scenario. Use situations involving imports, exports, airport, seaport, customs officers, customs brokers, warehouses, PEZA, Clark, Subic, Free Zones. The example must directly relate to the law.

⭐ Bakit Mahalaga Ito?
Explain why the provision exists. Why should Customs students understand it? How is it applied in real life?

⚠️ Dapat Tandaan
List the most important reminders. Mention common misunderstandings if applicable.

🎯 Board Exam Tip
Give review advice. Help students remember the concept. Mention common board exam traps if appropriate. Never invent actual board exam questions.

❓ Madalas Malito ang Students
Write one realistic question students usually ask. Then answer it clearly.

🔗 Related Topics
List related Sections, Definitions, Chapters, Customs concepts, and Related laws (only if officially relevant).

🤖 Need More Explanation?
Generate a high-quality prompt that users can send to external AI. The prompt must ask the AI to: explain the topic simply, give practical Customs examples, explain why the law exists, mention related provisions, mention relevant CAOs/CMOs if applicable, provide board exam insights, and clarify common misconceptions. This prompt will be automatically copied to the user's clipboard before opening Meta AI, ChatGPT, or Gemini.

IMPORTANT RULES
Every explanation must: preserve the legal meaning, never contradict CMTA, never hallucinate, never make assumptions, never create fake cases, never use unnecessary filler words, be educational, be easy to understand, and be consistent across the entire app.
The user should feel that every Study Guide was written by the same experienced Customs law professor.

For each id below, output valid JSON matching the ID TEMPLATE structure, filling in "title", "content", and "prompt" using the OFFICIAL CMTA SOURCE TEXT provided for that same id as your only source of truth.`;

function nodeLabel(node) {
  const type = node.node_type;
  const num = node.node_number || "";
  if (type === "chapter") return `Chapter ${num}`.trim();
  if (type === "section") return `Sec. ${num}`.trim();
  if (type === "title") return `Title ${num}`.trim();
  return `${type} ${num}`.trim();
}

export function buildTemplateForChapter(chapterTree) {
  const out = {};
  function walk(node) {
    if (node.content) {
      out[node.id] = {
        _label: `${node.node_type} ${node.node_number || ""} — ${(node.title || "").slice(0, 60)}`,
        title: "",
        content: "",
        prompt: "",
      };
    }
    (node.children || []).forEach(walk);
  }
  walk(chapterTree);
  return JSON.stringify(out, null, 2);
}

export function buildTopicTextForChapter(chapterTree) {
  const blocks = [];
  function walk(node) {
    if (node.content) {
      const lines = [`topic: [${node.id}]`, nodeLabel(node)];
      if (node.title) lines.push(node.title);
      lines.push(node.content);
      if (node.cross_references && node.cross_references.length) {
        lines.push("See Also");
        node.cross_references.forEach((ref) => {
          lines.push(ref.url ? `${ref.text} (${ref.url})` : ref.text);
        });
      }
      blocks.push(lines.join("\n"));
    }
    (node.children || []).forEach(walk);
  }
  walk(chapterTree);
  return blocks.join("\n\n");
}

export function buildFullCopyPayload(chapterTree) {
  const idTemplate = buildTemplateForChapter(chapterTree);
  const topics = buildTopicTextForChapter(chapterTree);
  return [
    MASTER_PROMPT,
    "",
    "🧩 ID TEMPLATE — fill title/content/prompt for each id below:",
    idTemplate,
    "",
    "📚 OFFICIAL CMTA SOURCE TEXT (per id, your only source of truth):",
    topics,
  ].join("\n");
}

export const AI_APPS = [
  { id: "meta", label: "Meta AI", icon: "💬", url: "https://m.me/MetaAI" },
  { id: "chatgpt", label: "ChatGPT", icon: "🟢", url: "https://chatgpt.com/" },
  { id: "gemini", label: "Gemini", icon: "✨", url: "https://gemini.google.com/app" },
];

export async function copyPromptAndOpen(prompt, appUrl) {
  try {
    await navigator.clipboard.writeText(prompt);
  } catch {
    // Clipboard can silently fail on some Android WebViews.
  }
  window.open(appUrl, "_blank", "noopener,noreferrer");
}```

## File: ./frontend/src/components/QuizShared.jsx
```
import { useState, useEffect } from "react";
import { saveLastQuizPosition } from "../quizStore";
import { useAuth } from "../authContext";
import { isRaLevelUnlocked } from "../access";

export function answersMatch(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

// lang = language of the questions: Level 1 is Filipino, Levels 2-5 are English.
export const LEVELS = [
  { id: "level1", label: "🟢 Level 1 — Easy", lang: "Filipino version", color: "green" },
  { id: "level2", label: "🔵 Level 2 — Normal", lang: "English version", color: "blue" },
  { id: "level3", label: "🟠 Level 3 — Medium", lang: "English version", color: "orange" },
  { id: "level4", label: "🟣 Level 4 — Medium Pro", lang: "English version", color: "purple" },
  { id: "level5", label: "🔴 Level 5 — Will Done", lang: "English version", color: "red" },
];

const LEVEL_STROKE = { green: "#22c55e", blue: "#3b82f6", orange: "#f97316", purple: "#a855f7", red: "#ef4444" };
const LEVEL_BORDER = {
  green: "border-emerald-400 hover:bg-emerald-50 dark:border-emerald-600 dark:hover:bg-emerald-950/30",
  blue: "border-blue-400 hover:bg-blue-50 dark:border-blue-600 dark:hover:bg-blue-950/30",
  orange: "border-orange-400 hover:bg-orange-50 dark:border-orange-600 dark:hover:bg-orange-950/30",
  purple: "border-purple-400 hover:bg-purple-50 dark:border-purple-600 dark:hover:bg-purple-950/30",
  red: "border-red-400 hover:bg-red-50 dark:border-red-600 dark:hover:bg-red-950/30",
};

export function ProgressCircle({ progress, size = 60, strokeWidth = 6, color = "#22c55e" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle className="text-slate-200 dark:text-slate-700" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <circle stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" r={radius} cx={size / 2} cy={size / 2} className="transition-all duration-500" style={{ stroke: progress > 0 ? color : "transparent" }} />
      </svg>
      <span className="absolute text-sm font-semibold text-slate-700 dark:text-slate-200">{Math.round(progress)}%</span>
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
    ? "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/60"
    : LEVEL_BORDER[level.color] || LEVEL_BORDER.green;
  return (
    <div className={`flex items-center gap-2 rounded-xl border-2 p-4 w-full transition-all ${colorClass}`}>
      <button onClick={onClick} className="flex min-w-0 flex-1 items-center gap-4 text-left">
        {locked ? (
          <span className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center text-3xl" aria-hidden>🔒</span>
        ) : (
          <ProgressCircle progress={progress} color={LEVEL_STROKE[level.color] || LEVEL_STROKE.green} />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 dark:text-slate-100">{level.label}</p>
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
          className="flex-shrink-0 whitespace-nowrap rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-500 active:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:active:bg-slate-700"
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

  const handleChoiceClick = (choiceKey) => { if (!answered) onAnswer(choiceKey); };
  const handleInputSubmit = () => { if (!answered && inputValue.trim()) onAnswer(inputValue.trim()); };

  if (isLevel5) {
    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{questionData?.question || "No question available"}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Type your answer below:</p>
        <div className="flex gap-2">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()} disabled={answered} placeholder="Type your answer here..." className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-navy-500 disabled:opacity-50" />
          <button onClick={handleInputSubmit} disabled={answered || !inputValue.trim()} className="rounded-lg bg-navy-900 px-6 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">Submit</button>
        </div>
        {answered && (
          <div className={`mt-4 rounded-lg p-4 ${answersMatch(selected, correct) ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
            <p className="font-medium text-slate-800 dark:text-slate-100">{answersMatch(selected, correct) ? "✅ Correct!" : `❌ Incorrect. The correct answer is: ${correct}`}</p>
            {reason && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reason}</p>}
          </div>
        )}
      </div>
    );
  }

  const choiceKeys = ["A", "B", "C", "D"];
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{questionData?.question || "No question available"}</p>
      <div className="space-y-2">
        {choiceKeys.map((key) => {
          const label = choices[key] || "";
          const isSelected = selected === key;
          const isCorrect = answered && key === correct;
          const isWrong = answered && isSelected && key !== correct;
          const choiceClass = answered
            ? isCorrect ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30"
              : isWrong ? "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/30"
              : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800"
            : isSelected ? "border-navy-900 dark:border-navy-500"
              : "border-slate-200 bg-white hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-400";
          return (
            <button key={key} onClick={() => handleChoiceClick(key)} disabled={answered} className={`block w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors ${choiceClass} ${!answered && "cursor-pointer"} disabled:cursor-default`}>
              <span className="font-semibold">{key}.</span> {label}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-4 rounded-lg p-4 ${answersMatch(selected, correct) ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
          <p className="font-medium text-slate-800 dark:text-slate-100">{answersMatch(selected, correct) ? "✅ Correct!" : `❌ Incorrect. The correct answer is: ${correct}`}</p>
          {reason && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reason}</p>}
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
        <span className="text-4xl" aria-hidden>🔒</span>
        <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">This level is locked</p>
        <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
          Levels 2–5 are in English and unlock with RA 10863 (CMTA). Level 1 (Filipino version) stays free.
        </p>
        <button
          onClick={() => { setIntentPlanId("CL"); setOverlayOpen(true); }}
          className="rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white active:bg-navy-800 dark:bg-navy-700"
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
        <button onClick={onBack} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{backLabel}</button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{levelLabel}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{currentIndex + 1} / {totalQuestions}</span>
        </div>
      </div>

      {title && (
        <div className="mb-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{title}</span>
        </div>
      )}

      <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Progress: {Math.round(progress)}%</span>
        <span>Score: {Math.round(score)}%</span>
      </div>

      <div className="mb-3 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-1 rounded-full bg-gradient-to-r from-amber-400 to-navy-700 transition-all duration-300 dark:from-amber-500 dark:to-navy-400" style={{ width: `${progress}%` }} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {nodeIds.map((id, idx) => {
          const isAnsweredDot = answers[id] !== undefined && answers[id] !== null;
          const isActive = idx === currentIndex;
          const q = entries[id]?.[level];
          const isCorrect = answersMatch(answers[id], q?.correct);
          const dotColor = isAnsweredDot ? (isCorrect ? "bg-emerald-400 dark:bg-emerald-500" : "bg-red-400 dark:bg-red-500") : "bg-slate-300 dark:bg-slate-600";
          return <button key={id} onClick={() => goToQuestion(idx)} className={`h-3 w-3 rounded-full transition-all ${isActive ? "scale-125" : ""} ${dotColor}`} title={`Question ${idx + 1}`} />;
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <QuizQuestion key={currentId} level={level} questionData={currentQuestion} onAnswer={handleAnswer} answered={isAnswered} selected={currentAnswer} />
      </div>

      <div className="mt-4 flex justify-between">
        <button onClick={goToPrevious} disabled={currentIndex === 0} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300">Previous</button>
        <button onClick={goToNext} disabled={currentIndex === totalQuestions - 1} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300">Next</button>
      </div>

      <div className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">{Math.round(progress)}% complete · {Math.round(score)}% score</div>
    </div>
  );
}
```

## File: ./frontend/src/components/AccountOverlay.jsx
```
import { useState, useEffect } from "react";
import { useAuth } from "../authContext";
import { PLANS, PAYMENT_METHODS, PROMO_MODE, PROMO_PLAN, generateReferenceCode, submitPendingPurchase } from "../payments";
import { ACCESS_PLANS, TRIAL_DAYS, DAY_MS, THREE_SUBJECT_BONUS, countActiveSubjects, getSubjectInfo, getClTrialInfo, formatTimeLeft, formatDateShort } from "../access";

const SUBJECT_LABELS = { CL: "RA 10863 (CMTA)", TL: "Tariff Law", CDP: "Customs Documentation & Procedures", PC: "Practical Computations", TCP: "Tariff Commission Primer" };

function formatDate(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export default function AccountOverlay() {
  const {
    user, profile, loading, needsFullName, deviceLimitReached, currentDeviceId,
    overlayOpen, setOverlayOpen, authError, signingIn,
    signInWithGoogle, signOutUser, completeFullName, removeDevice,
    profileError, access, intentPlanId, setIntentPlanId,
  } = useAuth();
  const [nameInput, setNameInput] = useState("");

  // Phase 3 — plan-selection + payment flow state.
  // step: "profile" | "payment-method" | "qr"
  const [step, setStep] = useState("profile");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [referenceCode, setReferenceCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset ang payment flow tuwing magsasara ang overlay, para hindi
  // ma-stuck ang susunod na pagbukas sa gitna ng isang lumang flow.
  useEffect(() => {
    if (!overlayOpen) {
      setStep("profile");
      setSelectedPlan(null);
      setSelectedMethod(null);
      setReferenceCode(null);
      setSubmitted(false);
      setSubmitting(false);
    }
  }, [overlayOpen]);

  // Galing sa Paywall: diretso sa payment method ng napiling plan.
  useEffect(() => {
    if (!overlayOpen || !intentPlanId || !user || !profile) return;
    const plan = [...PLANS, ...ACCESS_PLANS, PROMO_PLAN].find((p) => p.id === intentPlanId);
    setIntentPlanId(null);
    if (!plan) return;
    setSelectedPlan(plan);
    setSelectedMethod(null);
    setSubmitted(false);
    setReferenceCode(generateReferenceCode(plan.id));
    setStep("payment-method");
  }, [overlayOpen, intentPlanId, user, profile]);

  if (!overlayOpen) return null;

  const startPurchase = (plan) => {
    setSelectedPlan(plan);
    setSelectedMethod(null);
    setSubmitted(false);
    setReferenceCode(generateReferenceCode(plan.id));
    setStep("payment-method");
  };

  const selectMethod = (methodId) => {
    setSelectedMethod(methodId);
    setStep("qr");
  };

  const backToProfile = () => {
    setStep("profile");
    setSelectedPlan(null);
    setSelectedMethod(null);
    setSubmitted(false);
  };

  const backToMethods = () => {
    setStep("payment-method");
    setSelectedMethod(null);
    setSubmitted(false);
  };

  const confirmPaid = async () => {
    if (!user || !selectedPlan || !selectedMethod || !referenceCode) return;
    setSubmitting(true);
    try {
      await submitPendingPurchase(user.uid, {
        planId: selectedPlan.id,
        subjects: selectedPlan.subjects,
        price: selectedPlan.price,
        method: selectedMethod,
        referenceCode,
      });
      setSubmitted(true);
    } catch (err) {
      console.warn("submitPendingPurchase failed:", err);
      alert("Could not submit. Please try again:\n" + (err?.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const ownedCount = countActiveSubjects(profile);
  const bonusDone = !!profile?.bonuses?.threeSubjects;
  const clTrial = getClTrialInfo(profile);
  const bundlePlan = PLANS.find((p) => p.id === "BUNDLE");
  const allInPlan = PLANS.find((p) => p.id === "ALL");
  const bundleOwned = !!bundlePlan && bundlePlan.subjects.every((c) => getSubjectInfo(profile, c).active);
  // The all-in bundle only makes sense if TCP is not active and the 4-subject bundle is not fully owned.
  const showAllIn = !!allInPlan && !getSubjectInfo(profile, "TCP").active && !bundleOwned;
  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || null;
  const planNote = selectedPlan
    ? selectedPlan.kind === "promo"
      ? "All Access · everything unlocked · valid for " + selectedPlan.days + " days"
      : selectedPlan.kind === "access"
      ? selectedPlan.months + (selectedPlan.months === 1 ? " month" : " months") + " of App Access"
      : "Valid for " + selectedPlan.months + " months · includes " + selectedPlan.months + " months of App Access"
    : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={() => setOverlayOpen(false)}
    >
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-slate-800 sm:max-w-sm sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && <p className="py-8 text-center text-slate-400">Loading...</p>}

        {!loading && !user && (
          <div className="space-y-4 py-4 text-center">
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">
              Sign in with Google to start your {TRIAL_DAYS}-day free trial
            </p>
            <button
              onClick={signInWithGoogle}
              disabled={signingIn}
              className="w-full rounded-xl bg-navy-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-navy-700"
            >
              {signingIn ? "Waiting for Google..." : "Sign in with Google"}
            </button>
            {authError && <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>}
            <button onClick={() => setOverlayOpen(false)} className="text-sm text-slate-400">Cancel</button>
          </div>
        )}

        {!loading && user && deviceLimitReached && (
          <div className="space-y-3 py-2">
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">
              This Google account is already signed in on 2 devices
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Remove one device below to use it here.
            </p>
            <div className="space-y-2">
              {(profile?.devices || []).map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{d.label}</p>
                    <p className="text-xs text-slate-400">Last active: {formatDate(d.lastActive)}</p>
                  </div>
                  <button
                    onClick={() => removeDevice(d.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button onClick={signOutUser} className="w-full text-sm text-slate-400">Sign out</button>
          </div>
        )}

        {!loading && user && !deviceLimitReached && needsFullName && (
          <div className="space-y-3 py-2">
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">What is your full name?</p>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              disabled={!nameInput.trim()}
              onClick={() => completeFullName(nameInput.trim())}
              className="w-full rounded-xl bg-navy-900 px-4 py-3 font-medium text-white disabled:opacity-40 dark:bg-navy-700"
            >
              Done
            </button>
          </div>
        )}

        {!loading && user && !deviceLimitReached && !needsFullName && step === "profile" && (
          <div className="space-y-4 py-2">
            {profileError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                ⚠️ Your account could not be saved to the server. Error: {profileError}
              </div>
            )}
            <div className="flex items-center gap-3">
              {profile?.photoURL && (
                <img src={profile.photoURL} alt="" className="h-14 w-14 rounded-full object-cover" />
              )}
              <div>
                <p className="font-semibold text-navy-900 dark:text-slate-100">{profile?.fullName}</p>
                <p className="text-xs text-slate-400">{profile?.email}</p>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Practice Questions</p>
              <div className="space-y-1.5">
                {Object.keys(SUBJECT_LABELS).map((code) => {
                  const plan = PLANS.find((p) => p.id === code);
                  const info = getSubjectInfo(profile, code);
                  let status;
                  if (info.active) status = info.lifetime ? "♾️ Lifetime access" : "Active until " + formatDateShort(info.expiresAt) + " · " + formatTimeLeft(info.msLeft) + " left";
                  else if (info.owned) status = "⏳ Expired on " + formatDateShort(info.expiresAt);
                  else if (code === "CL") status = clTrial.active ? "🎁 Trial: " + formatTimeLeft(clTrial.msLeft) + " left" : "Level 1 free · Levels 2–5 locked";
                  else status = "First 10 items free";
                  const canRenew = !PROMO_MODE && (!info.active || (!info.lifetime && info.msLeft < 14 * DAY_MS));
                  return (
                    <div key={code} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900/40">
                      <span className="min-w-0 pr-2">
                        <span className="block text-slate-600 dark:text-slate-300">{SUBJECT_LABELS[code]}</span>
                        <span className={"block text-[11px] " + (info.active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400")}>{status}</span>
                      </span>
                      {canRenew ? (
                        <button
                          onClick={() => startPurchase(plan)}
                          className="flex-shrink-0 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white active:bg-navy-800 dark:bg-navy-700"
                        >
                          {info.owned ? "Renew" : "Subscribe"} ₱{plan.price}
                          <span className="block text-[10px] font-normal opacity-80">{plan.months} months</span>
                        </button>
                      ) : (
                        info.active ? (
                          <span className="flex-shrink-0 font-medium text-emerald-600 dark:text-emerald-400">Unlocked</span>
                        ) : (
                          <span className="flex-shrink-0 text-xs font-medium text-slate-400">🔒 Locked</span>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
              <p className={(PROMO_MODE ? "hidden " : "") + "mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900/40 dark:text-slate-400"}>
                🎯 Own {THREE_SUBJECT_BONUS.count} active subjects = +{THREE_SUBJECT_BONUS.months} months App Access ({Math.min(ownedCount, THREE_SUBJECT_BONUS.count)}/{THREE_SUBJECT_BONUS.count}){bonusDone ? " · ✅ claimed" : ""}
                <br />
                Each subject lasts 3 months (RA 10863: 4 months) with the same length of App Access. Renew early and your remaining days are kept.
              </p>
              {PROMO_MODE && (
                <button
                  onClick={() => startPurchase(PROMO_PLAN)}
                  className="mt-2 w-full rounded-xl border-2 border-gold-500 bg-navy-900 px-3 py-3 text-center text-white active:bg-navy-800 dark:bg-navy-700"
                >
                  <span className="block text-sm font-extrabold">🔥 {PROMO_PLAN.label} — ₱{PROMO_PLAN.price}</span>
                  <span className="mt-1 block text-[11px] font-normal opacity-90">{PROMO_PLAN.tagline}</span>
                  <span className="mt-1 block text-[11px] font-normal opacity-90">Unlocks EVERYTHING: RA 10863 (all 5 levels) · CDP · TL · PC · TCP + full App Access</span>
                  <span className="mt-1 block text-[11px] font-semibold text-gold-400">⏳ Valid for {PROMO_PLAN.days} days only</span>
                </button>
              )}
              {!PROMO_MODE && !bundleOwned && bundlePlan && (
                <button
                  onClick={() => startPurchase(bundlePlan)}
                  className="mt-2 w-full rounded-lg border-2 border-gold-500 bg-gold-50 px-3 py-2 text-xs font-semibold text-navy-900 active:bg-gold-100 dark:border-gold-400 dark:bg-slate-900/40 dark:text-gold-400"
                >
                  🎁 {bundlePlan.label} ₱{bundlePlan.price} · {bundlePlan.months} months
                  <span className="mt-0.5 block text-[11px] font-normal opacity-80">RA 10863 · CDP · TL · PC · includes {bundlePlan.bonusMonths} months App Access</span>
                </button>
              )}
              {!PROMO_MODE && showAllIn && (
                <button
                  onClick={() => startPurchase(allInPlan)}
                  className="mt-2 w-full rounded-lg border-2 border-gold-500 bg-navy-900 px-3 py-2 text-xs font-semibold text-white active:bg-navy-800 dark:bg-navy-700"
                >
                  👑 {allInPlan.label} ₱{allInPlan.price} · {allInPlan.months} months
                  <span className="mt-0.5 block text-[11px] font-normal opacity-80">RA 10863 · CDP · TL · PC · TCP · includes {allInPlan.bonusMonths} months App Access</span>
                </button>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">App Access</p>
              <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
                {access?.state === "admin" && <span>👑 Admin</span>}
                {access?.state === "member" && <span>✅ Access active (practice subscriber)</span>}
                {access?.state === "paid" && <span>✅ Active until {formatDateShort(access.app.expiresAt)} ({formatTimeLeft(access.msLeft)} left)</span>}
                {access?.state === "trial" && <span>🎁 Free trial: {formatTimeLeft(access.msLeft)} left</span>}
                {(access?.state === "expired" || access?.state === "loading") && <span>⏳ Your trial has ended. {PROMO_MODE ? "Get the Promo bundle above." : "Choose a plan below."}</span>}
              </div>
              {(profile?.pendingAccess || []).length > 0 && (
                <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                  ⏳ App Access payment pending ({profile.pendingAccess[profile.pendingAccess.length - 1].referenceCode}) — waiting for confirmation.
                </p>
              )}
              {(profile?.pendingPurchases || []).length > 0 && (
                <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300">
                  ⏳ Practice payment pending ({profile.pendingPurchases[profile.pendingPurchases.length - 1].referenceCode}) — waiting for confirmation.
                </p>
              )}
              {!PROMO_MODE && access && access.state !== "admin" && access.state !== "member" && (
                <div className="grid grid-cols-3 gap-1.5">
                  {ACCESS_PLANS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => startPurchase(p)}
                      className="rounded-lg border border-slate-200 px-2 py-2 text-center text-xs font-semibold text-navy-900 active:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:active:bg-slate-700"
                    >
                      {p.months} {p.months === 1 ? "month" : "months"}
                      <span className="block text-sm font-bold">₱{p.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Devices ({(profile?.devices || []).length}/2)
              </p>
              <div className="space-y-1.5">
                {(profile?.devices || []).map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-900/40">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        {d.label} {d.id === currentDeviceId && <span className="text-emerald-600 dark:text-emerald-400">(this device)</span>}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(d.lastActive)}</p>
                    </div>
                    <button
                      onClick={() => removeDevice(d.id)}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-600 dark:border-red-800 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={signOutUser}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-300"
            >
              Sign out
            </button>
            <button onClick={() => setOverlayOpen(false)} className="w-full text-sm text-slate-400">Close</button>
          </div>
        )}

        {!loading && user && !deviceLimitReached && !needsFullName && step === "payment-method" && selectedPlan && (
          <div className="space-y-4 py-2">
            <button onClick={backToProfile} className="text-sm text-slate-400">← Back</button>
            <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-900/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPlan.label}</p>
              <p className="text-2xl font-bold text-navy-900 dark:text-slate-100">₱{selectedPlan.price}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{planNote}</p>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Choose a payment method:</p>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMethod(m.id)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 active:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:active:bg-slate-900/40"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && user && !deviceLimitReached && !needsFullName && step === "qr" && selectedPlan && activeMethod && (
          <div className="space-y-4 py-2">
            {!submitted ? (
              <>
                <button onClick={backToMethods} className="text-sm text-slate-400">← Back</button>
                <div className="rounded-xl border-2 border-red-500 bg-red-50 p-3 text-center dark:border-red-400 dark:bg-red-950/30">
                  <p className="text-sm font-bold leading-snug text-red-700 dark:text-red-300">
                    ⚠️ Ilagay sa note ang iyong email address para makita namin na ikaw talaga ang nag-avail, and wait for our confirmation.
                  </p>
                  {profile?.email && (
                    <p className="mt-1 break-all text-xs font-semibold text-slate-700 dark:text-slate-200">📧 {profile.email}</p>
                  )}
                </div>
                <img
                  src={activeMethod.qr}
                  alt={`${activeMethod.label} QR code`}
                  className="mx-auto w-full max-w-[280px] rounded-xl border border-slate-100 dark:border-slate-700"
                />
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Reference Code — write it in the payment note</p>
                  <p className="text-xl font-bold tracking-widest text-navy-900 dark:text-amber-400">{referenceCode}</p>
                </div>
                <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  1. Scan the QR code with your {activeMethod.label} app.<br />
                  2. Pay ₱{selectedPlan.price} and write your email address + the reference code in the note/message.<br />
                  3. Tap "I've paid" below.
                </p>
                <button
                  onClick={confirmPaid}
                  disabled={submitting}
                  className="w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-navy-700"
                >
                  {submitting ? "Submitting..." : "✅ I've paid"}
                </button>
              </>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <span className="text-4xl" aria-hidden>⏳</span>
                <p className="font-semibold text-navy-900 dark:text-slate-100">Your purchase is pending</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  It will be confirmed manually within a few hours. Reference code: <span className="font-semibold">{referenceCode}</span>
                </p>
                <button
                  onClick={backToProfile}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-300"
                >
                  Back to Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

## File: ./frontend/src/components/AccountButton.jsx
```
import { useState } from "react";
import { useAuth } from "../authContext";

// Framed "Profile" button: the avatar and the word "Profile" sit inside one bordered box,
// so users can tell at a glance that it is tappable (a bare Google photo looks like decoration).
export default function AccountButton() {
  const { profile, setOverlayOpen } = useAuth();
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = !!profile?.photoURL && !imgFailed;
  return (
    <button
      onClick={() => setOverlayOpen(true)}
      aria-label="Open profile"
      className="flex h-11 w-11 flex-shrink-0 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-xl border border-slate-300 bg-white shadow-sm active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:active:bg-slate-700"
    >
      {showPhoto ? (
        <img
          src={profile.photoURL}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="h-5 w-5 rounded-full object-cover"
        />
      ) : (
        <span className="text-sm leading-5" aria-hidden>👤</span>
      )}
      <span className="text-[9px] font-semibold leading-none text-slate-600 dark:text-slate-300">Profile</span>
    </button>
  );
}
```

## File: ./frontend/src/components/AccessGate.jsx
```
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../authContext";
import ChapterBrowser from "../pages/ChapterBrowser";
import { ACCESS_PLANS, TRIAL_DAYS, DAY_MS, formatTimeLeft } from "../access";
import { PLANS, PROMO_MODE, PROMO_PLAN } from "../payments";

const DEMO_SECONDS = 60;

// Tutorial + About for signed-out users. Each feature has a demo:
// tap Start to try it for 1 minute, then return here.
const STEPS = [
  { icon: "⚖️", title: "Welcome to RA 10863", body: "Your offline companion for the Customs Modernization and Tariff Act (CMTA) — the law, notes, AI explanations, and practice questions for the CuBLE." },
  { icon: "📚", title: "Browse the Law", body: "Open the menu (☰). Every Title, Chapter, and Section is arranged in the correct order.", demo: { view: "browse", mode: "study" } },
  { icon: "📘", title: "Study Mode", body: "One section at a time, so you can stay focused. Use Expand All / Collapse All to move through a whole chapter quickly.", demo: { view: "browse", mode: "study" } },
  { icon: "📖", title: "Reading Mode", body: "A book-style view for long reading sessions. Tap 🎯 Focus to hide the toolbar.", demo: { view: "browse", mode: "reading" } },
  { icon: "🖍️", title: "Highlights", body: "Select any text to highlight it. Highlights save automatically and work offline.", demo: { view: "browse", mode: "study" } },
  { icon: "📝", title: "Notes", body: "Tap \"Add Note\" under any section to write your own explanation.", demo: { view: "browse", mode: "study" } },
  { icon: "🤖", title: "Ask AI", body: "Instant offline explanations from Osias 6.7 for every section.", demo: { view: "browse", mode: "study" } },
  { icon: "🔍", title: "Search", body: "Find anything fast. Try \"102\" or \"smuggling\".", demo: { view: "search", mode: null } },
  { icon: "✍️", title: "Practice Quiz / Exam", body: "Try the practice questions. RA 10863 Level 1 (Filipino version) is free, and so are the first 10 items of each other subject. Levels 2–5 are in English.", demo: { view: "quiz", mode: null } },
  { icon: "🎁", title: TRIAL_DAYS + "-Day Free Trial", body: "Sign in with Google to start " + TRIAL_DAYS + " days of free access to the whole app. After that, choose a plan to continue." },
];

function Splash({ text }) {
  return (
    <div className="safe-top flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center dark:bg-slate-950">
      <span className="text-4xl" aria-hidden>⚖️</span>
      <div
        className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-navy-900 dark:border-slate-700 dark:border-t-gold-400"
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{text}</p>
      <p className="max-w-xs rounded-xl bg-white/80 px-4 py-3 text-xs leading-relaxed text-slate-500 shadow-sm dark:bg-slate-900/70 dark:text-slate-400">
        💡 Tip: If loading takes too long, turn Airplane Mode on, then off, and reopen the app for a faster reload.
      </p>
    </div>
  );
}

// ── Demo: 1 minuto bawat Start ───────────────────────────────────────
function DemoShell({ feature, onEnd }) {
  const { overlayOpen, setOverlayOpen } = useAuth();
  const [left, setLeft] = useState(DEMO_SECONDS);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;

  useEffect(() => {
    const endAt = Date.now() + DEMO_SECONDS * 1000;
    const id = setInterval(() => {
      const s = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setLeft(s);
      if (s <= 0) {
        clearInterval(id);
        endRef.current();
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");

  return (
    <>
      <ChapterBrowser initialView={feature.view} initialMode={feature.mode} demo />
      {!overlayOpen && (
        <div className="safe-bottom fixed bottom-3 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-full bg-navy-900/95 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur dark:bg-slate-100/95 dark:text-navy-900">
          <span aria-hidden>⏱</span>
          <span>Demo {mm}:{ss}</span>
          <button onClick={() => setOverlayOpen(true)} className="rounded-full bg-gold-500 px-2.5 py-1 text-[11px] text-navy-900 active:bg-gold-600">Sign in</button>
          <button onClick={onEnd} className="rounded-full border border-white/40 px-2.5 py-1 text-[11px] dark:border-navy-900/40">Exit</button>
        </div>
      )}
    </>
  );
}

// ── Guest: About + Tutorial + Login ──────────────────────────────────
function GuestWelcome({ step, setStep, onStartDemo }) {
  const { signInWithGoogle, signingIn, authError } = useAuth();
  const total = STEPS.length;
  const cur = STEPS[step];
  const isLast = step === total - 1;

  return (
    <div className="safe-top safe-bottom flex min-h-[100dvh] flex-col bg-slate-50 dark:bg-slate-950">
      <div className="px-5 pb-2 pt-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">RA 10863 · CMTA</p>
        <h1 className="text-xl font-bold text-navy-900 dark:text-slate-50">CuBLE Review App</h1>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-5 py-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setStep(i)} aria-label={"Step " + (i + 1)} className={"h-1.5 rounded-full transition-all duration-300 " + (i === step ? "w-6 bg-navy-900 dark:bg-slate-100" : "w-1.5 bg-slate-200 dark:bg-slate-700")} />
            ))}
          </div>
          <span className="mb-3 block text-5xl" aria-hidden>{cur.icon}</span>
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50">{cur.title}</h2>
          <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{cur.body}</p>

          {cur.demo && (
            <button onClick={() => onStartDemo(cur.demo)} className="mb-4 w-full rounded-xl border-2 border-gold-500 bg-gold-50 px-4 py-2.5 text-sm font-semibold text-navy-900 active:bg-gold-100 dark:border-gold-400 dark:bg-slate-800 dark:text-gold-400">
              ▶ Start — try it for 1 minute
            </button>
          )}

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-800">Back</button>
            )}
            <button onClick={() => setStep(isLast ? 0 : step + 1)} className="flex h-11 flex-[2] items-center justify-center rounded-xl bg-navy-900 text-sm font-semibold text-white active:bg-navy-800 dark:bg-navy-700">
              {isLast ? "🔄 Replay Tutorial" : "Next"}
            </button>
          </div>
        </div>
      </main>

      <div className="border-t border-slate-200 bg-white/90 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        {authError && <p className="mb-2 text-center text-xs text-red-600 dark:text-red-400">{authError}</p>}
        <button onClick={signInWithGoogle} disabled={signingIn} className="mx-auto flex h-12 w-full max-w-md items-center justify-center rounded-xl bg-gold-500 text-sm font-bold text-navy-900 shadow-sm active:bg-gold-600 disabled:opacity-50">
          {signingIn ? "Waiting for Google..." : "🎁 Login with Google — start your " + TRIAL_DAYS + "-day free trial"}
        </button>
      </div>
    </div>
  );
}

// ── Paywall: tapos na ang trial, plans lang ang makikita ─────────────
function Paywall() {
  const { user, profile, signOutUser, setOverlayOpen, setIntentPlanId } = useAuth();
  const pending = profile?.pendingAccess || [];

  const choose = (plan) => {
    setIntentPlanId(plan.id);
    setOverlayOpen(true);
  };

  return (
    <div className="safe-top safe-bottom flex min-h-[100dvh] flex-col items-center bg-slate-50 px-5 py-6 dark:bg-slate-950">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <span className="text-4xl" aria-hidden>⏳</span>
          <h1 className="mt-2 text-xl font-bold text-navy-900 dark:text-slate-50">Your free trial has ended</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{PROMO_MODE ? "Get the All Access promo to continue. It is the only plan available right now." : "Choose an App Access plan to continue."} {user?.email}</p>
        </div>

        {pending.length > 0 && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-center text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
            ⏳ You have a pending payment ({pending[pending.length - 1].referenceCode}). Please wait for confirmation.
          </div>
        )}

        <div className="space-y-2">
          {PROMO_MODE && (
            <button onClick={() => choose(PROMO_PLAN)} className="w-full rounded-2xl border-2 border-gold-500 bg-gold-50 px-4 py-4 text-left active:opacity-80 dark:border-gold-400 dark:bg-slate-900">
              <span className="flex items-center justify-between gap-3">
                <span>
                  <span className="block text-base font-extrabold text-navy-900 dark:text-slate-100">🔥 {PROMO_PLAN.label}</span>
                  <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">{PROMO_PLAN.tagline}</span>
                  <span className="mt-1 block text-xs text-slate-600 dark:text-slate-300">Unlocks everything: RA 10863 (all levels) · CDP · TL · PC · TCP + full App Access</span>
                  <span className="mt-1 block text-xs font-semibold text-gold-600 dark:text-gold-400">⏳ Valid for {PROMO_PLAN.days} days only</span>
                </span>
                <span className="text-3xl font-extrabold text-navy-900 dark:text-slate-50">₱{PROMO_PLAN.price}</span>
              </span>
            </button>
          )}
          {(PROMO_MODE ? [] : ACCESS_PLANS).map((p) => {
            const best = p.months === 8;
            return (
              <button key={p.id} onClick={() => choose(p)} className={"flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left active:opacity-80 " + (best ? "border-gold-500 bg-gold-50 dark:border-gold-400 dark:bg-slate-900" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900")}>
                <span>
                  <span className="block text-base font-bold text-navy-900 dark:text-slate-100">{p.months} {p.months === 1 ? "Month" : "Months"}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">₱{(p.price / p.months).toFixed(0)}/month{best ? " · Best value" : ""}</span>
                </span>
                <span className="text-2xl font-extrabold text-navy-900 dark:text-slate-50">₱{p.price}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className={(PROMO_MODE ? "hidden " : "") + "px-1 text-xs font-semibold uppercase tracking-wide text-slate-400"}>Bundle — practice questions + App Access</p>
          {(PROMO_MODE ? [] : PLANS.filter((p) => p.bonusMonths)).map((p) => (
            <button key={p.id} onClick={() => choose(p)} className="flex w-full items-center justify-between rounded-2xl border-2 border-gold-500 bg-gold-50 px-4 py-3 text-left active:opacity-80 dark:border-gold-400 dark:bg-slate-900">
              <span>
                <span className="block text-base font-bold text-navy-900 dark:text-slate-100">{p.label}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">{p.subjects.map((c) => (c === "CL" ? "RA 10863" : c)).join(" · ")} · {p.months} months + {p.bonusMonths} months App Access</span>
              </span>
              <span className="text-2xl font-extrabold text-navy-900 dark:text-slate-50">₱{p.price}</span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400">Pay via GCash · Maya · MariBank. Payments are confirmed manually by the admin.</p>
        <button onClick={signOutUser} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-300">Sign out</button>
      </div>
    </div>
  );
}

// ── Maliit na pill: natitirang oras ──────────────────────────────────
function AccessPill({ access }) {
  const { overlayOpen, setOverlayOpen } = useAuth();
  if (overlayOpen) return null;
  let label = null;
  if (access.state === "trial") label = "🎁 Free trial · " + formatTimeLeft(access.msLeft) + " left";
  else if (access.state === "paid" && access.msLeft < 7 * DAY_MS) label = "⏳ Access · " + formatTimeLeft(access.msLeft) + " left";
  if (!label) return null;
  return (
    <button onClick={() => setOverlayOpen(true)} className="safe-bottom fixed bottom-3 left-3 z-40 rounded-full bg-navy-900/90 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg backdrop-blur active:bg-navy-800 dark:bg-slate-100/90 dark:text-navy-900">
      {label}
    </button>
  );
}

export default function AccessGate() {
  const { user, profile, loading, signingIn, needsFullName, deviceLimitReached, access, overlayOpen, setOverlayOpen } = useAuth();
  const [demo, setDemo] = useState(null);
  const [guestStep, setGuestStep] = useState(0);

  // Kapag kulang ang setup (pangalan / device limit), buksan ang account overlay.
  useEffect(() => {
    if (user && (needsFullName || deviceLimitReached) && !overlayOpen) setOverlayOpen(true);
  }, [user, needsFullName, deviceLimitReached, overlayOpen, setOverlayOpen]);

  if (loading || signingIn) return <Splash text="Loading…" />;

  if (!user) {
    if (demo) return <DemoShell key={demo.key} feature={demo.feature} onEnd={() => setDemo(null)} />;
    return <GuestWelcome step={guestStep} setStep={setGuestStep} onStartDemo={(feature) => setDemo({ feature, key: Date.now() })} />;
  }

  if (!profile || needsFullName || deviceLimitReached) return <Splash text="Finishing your account setup…" />;
  if (access.state === "loading") return <Splash text="Checking your trial…" />;
  if (access.state === "expired") return <Paywall />;

  return (
    <>
      <ChapterBrowser />
      <AccessPill access={access} />
    </>
  );
}
```

## File: ./frontend/src/components/ReaderParts.jsx
```
// Shared reader pieces (highlight, notes). Copied from ChapterBrowser.jsx so the CMTA screen stays untouched.
import { useState, useEffect, useCallback, useRef } from "react";
import {
  addHighlight, removeHighlight, getHighlightsForNode,
  getNotesForNode, addNote, updateNote, deleteNote,
} from "../db";

export function useNodeHighlights(nodeId, shouldLoad) {
  const [highlights, setHighlights] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!shouldLoad || !nodeId || loaded) return;
    const data = getHighlightsForNode(nodeId);
    setHighlights(data);
    setLoaded(true);
  }, [shouldLoad, nodeId, loaded]);
  const addHighlightLocal = useCallback(async (start, end) => {
    const newHl = addHighlight(nodeId, start, end);
    setHighlights(prev => [...prev, newHl]);
  }, [nodeId]);
  const removeHighlightLocal = useCallback(async (hlId) => {
    removeHighlight(hlId);
    setHighlights(prev => prev.filter(h => h.id !== hlId));
  }, []);
  return { highlights, addHighlight: addHighlightLocal, removeHighlight: removeHighlightLocal };
}

export function useNodeNotes(nodeId, shouldLoad) {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!shouldLoad || !nodeId || loaded) return;
    setNotes(getNotesForNode(nodeId));
    setLoaded(true);
  }, [shouldLoad, nodeId, loaded]);
  const createNote = useCallback((content) => {
    const note = addNote(nodeId, content);
    setNotes((prev) => [...prev, note]);
    return note;
  }, [nodeId]);
  const editNote = useCallback((noteId, content) => {
    const note = updateNote(nodeId, noteId, content);
    setNotes((prev) => prev.map((n) => (n.id === noteId ? note : n)));
  }, [nodeId]);
  const removeNote = useCallback((noteId) => {
    deleteNote(nodeId, noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }, [nodeId]);
  return { notes, createNote, editNote, removeNote };
}

export function formatNoteDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
      " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

export function applyHighlights(text, highlights) {
  if (!highlights || highlights.length === 0) return [{ text, highlightId: null }];
  const sorted = [...highlights].sort((a, b) => a.start_offset - b.start_offset);
  const segments = [];
  let cursor = 0;
  for (const hl of sorted) {
    if (hl.start_offset > cursor) segments.push({ text: text.slice(cursor, hl.start_offset), highlightId: null });
    segments.push({ text: text.slice(hl.start_offset, hl.end_offset), highlightId: hl.id, color: hl.color });
    cursor = hl.end_offset;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlightId: null });
  return segments;
}

export function SelectionToolbar({ x, y, kind, onSave, onCancel, onDelete }) {
  return (
    <div style={{ position: "fixed", left: x, top: y, zIndex: 100 }} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1.5 shadow-lg shadow-slate-900/10 dark:border-slate-600 dark:bg-slate-800 dark:shadow-black/40">
      {kind === "existing" ? (
        <>
          <button onClick={onDelete} className="flex items-center gap-1 rounded-lg px-3 py-2 min-h-[40px] text-sm font-medium text-red-600 active:bg-red-50 dark:text-red-400 dark:active:bg-red-950/40">🗑 Remove highlight</button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Close</button>
        </>
      ) : (
        <>
          <button onClick={onSave} className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-2 min-h-[40px] text-sm font-semibold text-amber-800 active:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:active:bg-amber-900/70">🖍 Highlight</button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Cancel</button>
        </>
      )}
    </div>
  );
}

export function HighlightableContent({ nodeId, content, highlights, addHighlight, removeHighlight, className, armed }) {
  const containerRef = useRef(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [toolbar, setToolbar] = useState(null);
  useEffect(() => {
    if (!armed) { setPendingSelection(null); setToolbar((t) => (t && t.kind === "existing" ? t : null)); return; }
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !containerRef.current || !containerRef.current.contains(sel.anchorNode)) {
        setPendingSelection(null); setToolbar((t) => (t && t.kind === "existing" ? t : null)); return;
      }
      const range = sel.getRangeAt(0);
      const preRange = document.createRange();
      preRange.selectNodeContents(containerRef.current);
      preRange.setEnd(range.startContainer, range.startOffset);
      const start = preRange.toString().length;
      const end = start + range.toString().length;
      if (start >= end) return;
      setPendingSelection({ start, end });
      const rect = range.getBoundingClientRect();
      setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 200)), y: rect.bottom + 8, kind: "selection" });
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [armed]);
  const handleMarkClick = (e, hlId) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 200)), y: rect.bottom + 8, kind: "existing", hlId });
    setPendingSelection(null);
  };
  const closeToolbar = () => { setToolbar(null); setPendingSelection(null); window.getSelection()?.removeAllRanges(); };
  const confirmHighlight = async () => { if (!pendingSelection) return; await addHighlight(pendingSelection.start, pendingSelection.end); closeToolbar(); };
  const confirmDelete = async () => { if (!toolbar?.hlId) return; await removeHighlight(toolbar.hlId); closeToolbar(); };
  const segments = applyHighlights(content, highlights);
  return (
    <div className="relative">
      <div ref={containerRef} className={`${className} ${armed ? "rounded-lg bg-amber-50/70 ring-1 ring-amber-300 dark:bg-amber-950/30 dark:ring-amber-700" : ""}`}>
        {segments.map((seg, i) =>
          seg.highlightId ? (
            <mark key={i} style={{ backgroundColor: seg.color }} className="cursor-pointer rounded-sm px-0.5" onClick={(e) => handleMarkClick(e, seg.highlightId)}>{seg.text}</mark>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>
      {toolbar && <SelectionToolbar x={toolbar.x} y={toolbar.y} kind={toolbar.kind} onSave={confirmHighlight} onDelete={confirmDelete} onCancel={closeToolbar} />}
    </div>
  );
}

export function NotePanel({ notes, onCreate, onEdit, onDelete, onClose }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(notes.length === 0);

  const startEdit = (note) => { setEditingId(note.id); setDraft(note.content); setAdding(false); };
  const startAdd = () => { setAdding(true); setEditingId(null); setDraft(""); };
  const cancel = () => { setEditingId(null); setAdding(notes.length === 0); setDraft(""); };
  const save = () => {
    const text = draft.trim();
    if (!text) return;
    if (editingId) { onEdit(editingId, text); setEditingId(null); }
    else { onCreate(text); setAdding(false); }
    setDraft("");
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="mt-3 rounded-xl border border-sky-200 bg-sky-50/70 p-3 dark:border-sky-800 dark:bg-sky-950/30">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">📝 My Notes</span>
        <button onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700">Close</button>
      </div>
      {notes.length > 0 && !adding && !editingId && (
        <div className="mb-2 space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-slate-800">
              <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{n.content}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {n.updated_at !== n.created_at ? `Edited ${formatNoteDate(n.updated_at)}` : `Added ${formatNoteDate(n.created_at)}`}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(n)} className="text-xs font-semibold text-sky-700 dark:text-sky-400">Edit</button>
                  <button onClick={() => onDelete(n.id)} className="text-xs font-semibold text-red-600 dark:text-red-400">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {adding || editingId ? (
        <div>
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write your own explanation or reminder…"
            rows={3}
            style={{ fontSize: "16px" }}
            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button onClick={cancel} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700">Cancel</button>
            <button onClick={save} disabled={!draft.trim()} className="rounded-lg bg-sky-700 px-3 py-1.5 text-sm font-semibold text-white active:bg-sky-800 disabled:opacity-40 dark:bg-sky-600">
              {editingId ? "Save" : "Add Note"}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={startAdd} className="w-full rounded-lg border border-dashed border-sky-300 py-2 text-sm font-medium text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:text-sky-400 dark:active:bg-sky-900/40">
          + Add Note
        </button>
      )}
    </div>
  );
}
```

## File: ./frontend/src/components/CustomQuizShared.jsx
```
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
```

## File: ./frontend/src/components/IssuanceQuiz.jsx
```
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
```

## File: ./frontend/src/data/subjects.js
```
// Central list of exam subjects shown sa Quiz/Exam (📝) hub.
// "ra10863" ay gumagamit pa rin ng existing per-title quiz system
// (frontend/src/pages/QuizPage.jsx) — HINDI ito ginalaw.
// Ang CL / CDP / TL / PC ay flat (walang title, walang level) na quiz,
// backed by frontend/src/subjectQuizStore.js.

export const SUBJECTS = [
  { id: "ra10863", label: "RA10863", kind: "titled" },
  { id: "cl", label: "CL", kind: "flat" },
  { id: "cdp", label: "CDP", kind: "flat" },
  { id: "tl", label: "TL", kind: "flat" },
  { id: "pc", label: "PC", kind: "flat" },
  { id: "tcp", label: "TCP", kind: "flat" },
];

export const FLAT_SUBJECTS = SUBJECTS.filter((s) => s.kind === "flat");

export function getSubjectById(id) {
  return SUBJECTS.find((s) => s.id === id) || null;
}
```

## File: ./frontend/src/db.js
```
import initSqlJs from 'sql.js/dist/sql-wasm.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

let dbPromise = null;

async function loadDatabase() {
  const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
  const url = `${import.meta.env.BASE_URL}customs_law.db`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load customs_law.db (HTTP ${response.status})`);
  const arrayBuffer = await response.arrayBuffer();
  return new SQL.Database(new Uint8Array(arrayBuffer));
}

export function initDatabase() {
  if (!dbPromise) dbPromise = loadDatabase();
  return dbPromise;
}

export async function query(sql, params = []) {
  const database = await initDatabase();
  const stmt = database.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows.length ? rows[0] : null;
}

function romanToInt(s) {
  if (!s) return 0;
  s = String(s).toUpperCase().trim();
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  let prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const cur = values[s[i]] || 0;
    total += cur < prev ? -cur : cur;
    prev = cur;
  }
  return total;
}

export async function getTitles() {
  const rows = await query(`
    SELECT 
      t.id AS title_id,
      t.node_number AS title_number,
      t.title AS title_title,
      c.id AS chapter_id,
      c.node_number AS chapter_number,
      c.title AS chapter_title,
      (SELECT COUNT(*) FROM legal_nodes s WHERE s.parent_id = c.id AND s.node_type = 'section') AS section_count
    FROM legal_nodes t
    LEFT JOIN legal_nodes c ON c.parent_id = t.id AND c.node_type = 'chapter'
    WHERE t.node_type = 'title'
    ORDER BY CAST(c.node_number AS INTEGER) ASC
  `);
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.title_id)) {
      map.set(row.title_id, {
        title_id: row.title_id,
        title_number: row.title_number,
        title_title: row.title_title,
        chapters: []
      });
    }
    if (row.chapter_id) {
      map.get(row.title_id).chapters.push({
        id: row.chapter_id,
        node_number: row.chapter_number,
        title: row.chapter_title,
        section_count: row.section_count
      });
    }
  }
  const rootRows = await query(`
    SELECT 
      c.id AS chapter_id,
      c.node_number AS chapter_number,
      c.title AS chapter_title,
      (SELECT COUNT(*) FROM legal_nodes s WHERE s.parent_id = c.id AND s.node_type = 'section') AS section_count
    FROM legal_nodes c
    WHERE c.node_type = 'chapter' AND c.parent_id IS NULL
    ORDER BY CAST(c.node_number AS INTEGER) ASC
  `);
  const result = Array.from(map.values()).sort(
    (a, b) => romanToInt(a.title_number) - romanToInt(b.title_number)
  );
  if (rootRows.length) {
    result.push({
      title_id: null,
      title_number: null,
      title_title: "Chapters (no title)",
      chapters: rootRows.map(r => ({
        id: r.chapter_id,
        node_number: r.chapter_number,
        title: r.chapter_title,
        section_count: r.section_count
      }))
    });
  }
  return result;
}

export async function getChapter(chapterNumber, titleNumber = null) {
  let whereClause = "node_type = 'chapter' AND node_number = ?";
  let params = [chapterNumber];
  if (titleNumber) {
    const titleRow = await queryOne("SELECT id FROM legal_nodes WHERE node_type = 'title' AND node_number = ?", [titleNumber]);
    if (!titleRow) return null;
    whereClause += " AND parent_id = ?";
    params.push(titleRow.id);
  } else {
    whereClause += " AND parent_id IS NULL";
  }
  const chapterRow = await queryOne(`SELECT * FROM legal_nodes WHERE ${whereClause}`, params);
  if (!chapterRow) return null;

  const sql = `
    WITH RECURSIVE subtree(id, parent_id, node_type, node_number, title, content, status, version, depth, sort_order) AS (
      SELECT id, parent_id, node_type, node_number, title, content, status, version, depth, sort_order
      FROM legal_nodes WHERE id = ?
      UNION ALL
      SELECT n.id, n.parent_id, n.node_type, n.node_number, n.title, n.content, n.status, n.version, n.depth, n.sort_order
      FROM legal_nodes n JOIN subtree s ON n.parent_id = s.id
    )
    SELECT * FROM subtree ORDER BY depth, sort_order
  `;
  const rows = await query(sql, [chapterRow.id]);
  const nodeMap = {};
  const root = { ...chapterRow, children: [] };
  nodeMap[chapterRow.id] = root;
  for (const row of rows) {
    if (row.id === chapterRow.id) continue;
    const parent = nodeMap[row.parent_id];
    if (!parent) continue;
    const node = { ...row, children: [] };
    parent.children.push(node);
    nodeMap[row.id] = node;
  }
  const ids = Object.keys(nodeMap);
  if (ids.length) {
    const keywordRows = await query(`SELECT node_id, keyword FROM node_keywords WHERE node_id IN (${ids.join(',')})`);
    for (const kw of keywordRows) {
      const node = nodeMap[kw.node_id];
      if (node) { if (!node.keywords) node.keywords = []; node.keywords.push(kw.keyword); }
    }
    const xrefRows = await query(`SELECT node_id, reference_text, url, display_text FROM node_cross_references WHERE node_id IN (${ids.join(',')})`);
    for (const xr of xrefRows) {
      const node = nodeMap[xr.node_id];
      if (node) { if (!node.cross_references) node.cross_references = []; node.cross_references.push({ text: xr.display_text || xr.reference_text, url: xr.url }); }
    }
    const noteRows = await query(`SELECT node_id, note_text FROM node_notes WHERE node_id IN (${ids.join(',')})`);
    for (const nt of noteRows) {
      const node = nodeMap[nt.node_id];
      if (node) { if (!node.notes) node.notes = []; node.notes.push(nt.note_text); }
    }
  }
  function buildNode(node) {
    const label = node.title ? `${node.node_type} ${node.node_number} — ${node.title}` : `${node.node_type} ${node.node_number}`;
    return {
      id: node.id,
      uuid: node.uuid || '',
      node_type: node.node_type,
      node_number: node.node_number,
      title: node.title,
      _label: label,
      content: node.content,
      status: node.status,
      version: node.version,
      keywords: node.keywords || [],
      cross_references: node.cross_references || [],
      notes: node.notes || [],
      children: (node.children || []).map(child => buildNode(child))
    };
  }
  return buildNode(root);
}

export async function getTitleTree(titleNumber) {
  const titleRow = await queryOne(
    "SELECT * FROM legal_nodes WHERE node_type = 'title' AND node_number = ?",
    [titleNumber]
  );
  if (!titleRow) return null;

  const sql = `
    WITH RECURSIVE subtree(id, parent_id, node_type, node_number, title, content, depth, sort_order) AS (
      SELECT id, parent_id, node_type, node_number, title, content, depth, sort_order
      FROM legal_nodes WHERE id = ?
      UNION ALL
      SELECT n.id, n.parent_id, n.node_type, n.node_number, n.title, n.content, n.depth, n.sort_order
      FROM legal_nodes n JOIN subtree s ON n.parent_id = s.id
    )
    SELECT * FROM subtree ORDER BY depth, sort_order
  `;
  const rows = await query(sql, [titleRow.id]);
  const nodeMap = {};
  const root = { ...titleRow, children: [] };
  nodeMap[titleRow.id] = root;
  for (const row of rows) {
    if (row.id === titleRow.id) continue;
    const parent = nodeMap[row.parent_id];
    if (!parent) continue;
    const node = { ...row, children: [] };
    parent.children.push(node);
    nodeMap[row.id] = node;
  }
  function buildNode(node) {
    return {
      id: node.id,
      node_type: node.node_type,
      node_number: node.node_number,
      title: node.title,
      content: node.content,
      children: (node.children || []).map(buildNode)
    };
  }
  return buildNode(root);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildExcerpt(content, tokens, radius = 90) {
  if (!content) return '';
  const lower = content.toLowerCase();
  let matchIndex = -1;
  let matchLen = 0;
  for (const token of tokens) {
    const idx = lower.indexOf(token.toLowerCase());
    if (idx !== -1 && (matchIndex === -1 || idx < matchIndex)) {
      matchIndex = idx;
      matchLen = token.length;
    }
  }
  let start = 0;
  let end = Math.min(content.length, 200);
  if (matchIndex !== -1) {
    start = Math.max(0, matchIndex - radius);
    end = Math.min(content.length, matchIndex + matchLen + radius);
  }
  let excerpt = content.slice(start, end);
  if (start > 0) excerpt = `…${excerpt}`;
  if (end < content.length) excerpt = `${excerpt}…`;

  const sortedTokens = [...tokens].sort((a, b) => b.length - a.length);
  for (const token of sortedTokens) {
    if (!token) continue;
    const re = new RegExp(`(${escapeRegExp(token)})`, 'gi');
    excerpt = excerpt.replace(re, '[$1]');
  }
  return excerpt;
}

export async function search(queryText, filter = 'all', limit = 50) {
  const trimmedQuery = queryText.trim();
  const tokens = trimmedQuery.split(/\s+/).filter(t => t.length > 0);
  if (!tokens.length) return [];

  const likeConditions = tokens.map(() =>
    '(n.node_number LIKE ? OR n.title LIKE ? OR n.content LIKE ?)'
  ).join(' OR ');

  const likeParams = [];
  for (const token of tokens) {
    const like = `%${token}%`;
    likeParams.push(like, like, like);
  }

  let sql = `
    SELECT
      n.id AS node_id,
      n.node_type,
      n.node_number,
      n.title,
      n.content,
      t_parent.node_number AS title_number,
      t_parent.title AS title_title,
      ch_parent.node_number AS chapter_number,
      ch_parent.title AS chapter_title
    FROM legal_nodes n
    LEFT JOIN legal_nodes ch_parent ON ch_parent.id = n.parent_id AND ch_parent.node_type = 'chapter'
    LEFT JOIN legal_nodes t_parent ON t_parent.id = ch_parent.parent_id AND t_parent.node_type = 'title'
    WHERE ${likeConditions}
  `;

  if (filter !== 'all') {
    sql += " AND n.node_type = ?";
    likeParams.push(filter);
  }

  sql += " ORDER BY n.node_type, CAST(n.node_number AS INTEGER)";

  const rows = await query(sql, likeParams);
  const lowerQuery = trimmedQuery.toLowerCase();

  const withMeta = rows.map((row) => {
    const haystacks = [row.node_number, row.title, row.content]
      .filter(Boolean)
      .map((s) => String(s).toLowerCase());
    const exact_match = haystacks.some((h) => h.includes(lowerQuery)) ? 1 : 0;
    return {
      ...row,
      excerpt: buildExcerpt(row.content || '', tokens),
      exact_match,
    };
  });

  withMeta.sort((a, b) => b.exact_match - a.exact_match);
  return withMeta.slice(0, limit);
}

export async function getChapterForNode(nodeId) {
  const sql = `
    WITH RECURSIVE ancestors(id, parent_id, node_type, node_number) AS (
      SELECT id, parent_id, node_type, node_number
      FROM legal_nodes
      WHERE id = ?
      UNION ALL
      SELECT n.id, n.parent_id, n.node_type, n.node_number
      FROM legal_nodes n
      JOIN ancestors a ON n.id = a.parent_id
    )
    SELECT node_type, node_number, id
    FROM ancestors
    WHERE node_type = 'chapter'
    LIMIT 1
  `;
  const result = await queryOne(sql, [nodeId]);
  if (!result) return null;

  const titleSql = `
    SELECT t.node_number AS title_number
    FROM legal_nodes t
    WHERE t.id = (
      SELECT parent_id FROM legal_nodes WHERE id = ? AND node_type = 'chapter'
    )
    AND t.node_type = 'title'
  `;
  const titleRow = await queryOne(titleSql, [result.id]);
  return {
    chapter_number: result.node_number,
    title_number: titleRow ? titleRow.title_number : null
  };
}

const HIGHLIGHTS_KEY = 'customsLaw_highlights';
export function getHighlightsForNode(nodeId) {
  try { const all = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY) || '{}'); return all[nodeId] || []; } catch { return []; }
}
export function addHighlight(nodeId, start, end, color = '#90EE90') {
  const all = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY) || '{}');
  if (!all[nodeId]) all[nodeId] = [];
  const newHl = { id: Date.now() + Math.random() * 1000, node_id: nodeId, start_offset: start, end_offset: end, color, created_at: new Date().toISOString() };
  all[nodeId].push(newHl);
  localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(all));
  return newHl;
}
export function removeHighlight(highlightId) {
  const all = JSON.parse(localStorage.getItem(HIGHLIGHTS_KEY) || '{}');
  for (const nodeId in all) {
    all[nodeId] = all[nodeId].filter(h => h.id !== highlightId);
    if (all[nodeId].length === 0) delete all[nodeId];
  }
  localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(all));
}

const NOTES_KEY = 'customsLaw_notes';

export function getNotesForNode(nodeId) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    return all[nodeId] || [];
  } catch {
    return [];
  }
}

export function addNote(nodeId, content) {
  const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  if (!all[nodeId]) all[nodeId] = [];
  const now = new Date().toISOString();
  const note = {
    id: Date.now() + Math.random() * 1000,
    node_id: nodeId,
    content,
    created_at: now,
    updated_at: now,
  };
  all[nodeId].push(note);
  localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  return note;
}

export function updateNote(nodeId, noteId, content) {
  const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  const list = all[nodeId] || [];
  const note = list.find((n) => n.id === noteId);
  if (note) {
    note.content = content;
    note.updated_at = new Date().toISOString();
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  }
  return note || null;
}

export function deleteNote(nodeId, noteId) {
  const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
  if (!all[nodeId]) return;
  all[nodeId] = all[nodeId].filter((n) => n.id !== noteId);
  if (all[nodeId].length === 0) delete all[nodeId];
  localStorage.setItem(NOTES_KEY, JSON.stringify(all));
}

const PROGRESS_KEY = 'customsLaw_lastPosition';

export function saveProgress(progress) {
  try {
    const existing = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    const merged = { ...existing, ...progress, saved_at: new Date().toISOString() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));
  } catch {}
}

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null');
  } catch {
    return null;
  }
}

const TUTORIAL_KEY = 'customsLaw_tutorialSeen';

export function hasTutorialBeenSeen() {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === 'true';
  } catch {
    return true;
  }
}

export function markTutorialSeen() {
  try {
    localStorage.setItem(TUTORIAL_KEY, 'true');
  } catch {}
}
```

## File: ./frontend/src/env.js
```
// Single source of truth for "is this a local dev build" checks (e.g. to hide
// the Dev Panel from the production build shipped to GitHub Pages). Vite
// replaces import.meta.env.DEV with a literal `false` in production builds,
// so anything gated behind IS_DEV never renders for real users.
export const IS_DEV = import.meta.env.DEV;
```

## File: ./frontend/src/index.css
```
@tailwind base;
@tailwind components;
@tailwind utilities;


/* ui-modern ------------------------------------------------------------ */
@layer base {
  html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
  ::selection { background: rgba(201, 162, 39, 0.28); }
  :focus-visible { outline: 2px solid #c9a227; outline-offset: 2px; border-radius: 8px; }
  button, [role="button"], a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
  button { transition: transform 120ms ease, background-color 150ms ease, color 150ms ease, border-color 150ms ease; }
  button:not(:disabled):active { transform: scale(0.975); }
  * { scrollbar-width: thin; scrollbar-color: rgba(100, 116, 139, 0.35) transparent; }
  *::-webkit-scrollbar { width: 6px; height: 6px; }
  *::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.35); border-radius: 999px; }
}

/* room for the bottom navigation bar */
.has-bottom-nav { padding-bottom: calc(5.5rem + env(safe-area-inset-bottom)) !important; }

/* soft page-enter animation for whatever is inside <main> */
@keyframes ui-fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
main > * { animation: ui-fade-up 260ms ease-out both; }
@media (prefers-reduced-motion: reduce) {
  main > * { animation: none; }
  button { transition: none; }
  button:not(:disabled):active { transform: none; }
}
```

## File: ./frontend/src/main.jsx
```
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import AccessGate from "./components/AccessGate";
import { seedDefaultQuizzes } from "./subjectQuizStore";
import { AuthProvider } from "./authContext";
import AccountOverlay from "./components/AccountOverlay";

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error(e, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, background: "#1e1e1e", color: "#ff6b6b", fontFamily: "monospace", whiteSpace: "pre-wrap", minHeight: "100vh" }}>
          <h1>⚠️ App Error</h1>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

window.addEventListener("unhandledrejection", (e) => {
  const msg = e.reason?.message || String(e.reason);
  document.body.innerHTML = `<div style="padding:20px;background:#1e1e1e;color:#ff6b6b;font-family:monospace;white-space:pre-wrap;">⚠️ ${msg}</div>`;
});

// Seed CL / CDP / TL / PC default quizzes (from src/data/defaultQuizzes/*.json)
// into localStorage kapag walang laman pa. Kailangan ito para may laman
// ang mga subject sa ANY bagong browser/origin — kasama ang GitHub Pages,
// na may sarili at hiwalay na localStorage kumpara sa localhost.
seedDefaultQuizzes();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AccessGate />
        <AccountOverlay />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}
```

## File: ./frontend/src/pages/ChapterBrowser.jsx
```
import { useState, useEffect, useCallback, useRef, useMemo, useContext, createContext } from "react";
import {
  getTitles, getChapter, getTitleTree, search,
  addHighlight, removeHighlight, getHighlightsForNode,
  getNotesForNode, addNote, updateNote, deleteNote,
  saveProgress, getProgress,
  hasTutorialBeenSeen, markTutorialSeen,
  getChapterForNode,
} from "../db";
import {
  getAiContext, AI_APPS, copyPromptAndOpen,
} from "../aiContext";
import { IS_DEV } from "../env";
import { copyQuizPromptForTitle } from "../quizContext";
import DevPanel from "./DevPanel";
import QuizPage from "./QuizPage";
import QuizHub from "./QuizHub";
import AccountButton from "../components/AccountButton";
import AdminPanel from "./AdminPanel";
import { useAuth } from "../authContext";
import { IssuanceSidebar, IssuanceReader } from "./IssuanceBrowser";
import { ISSUANCE_KINDS, getIssuance } from "../issuancesStore";

// Enrich nodes with hierarchy information for composite key lookup

// Enrich nodes with hierarchy information for composite key lookup
function enrichNodesWithHierarchy(nodes) {
  let currentSection = null;
  let currentParagraph = null;
  let currentSubparagraph = null;

  function traverse(node) {
    const label = node._label || node.title || "";

    if (node.node_type === "section") {
      currentSection = node.node_number;
      currentParagraph = null;
      currentSubparagraph = null;
    } else if (node.node_type === "paragraph") {
      const match = label.match(/paragraph \(([^)]+)\)/);
      if (match) {
        currentParagraph = match[1];
      } else {
        currentParagraph = node.node_number;
      }
      currentSubparagraph = null;
    } else if (node.node_type === "subparagraph") {
      const match = label.match(/subparagraph \(([^)]+)\)/);
      if (match) {
        currentSubparagraph = match[1];
      } else {
        currentSubparagraph = node.node_number;
      }
    } else if (node.node_type === "item") {
      // Item: we can store item number separately if needed
      // For now, we don't need to track item_number separately
      // because getCompositeKey uses node.node_number for items if item_number not set
    }
    node.section_number = currentSection;
    node.paragraph_number = currentParagraph;
    node.subparagraph_number = currentSubparagraph;

    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }
  return nodes;
}



const MODE_KEY = "customsLaw_mode";
const SOURCE_KEY = "customsLaw_source";
const ISSUANCE_KEY = "customsLaw_issuanceId";
const FONT_KEY = "customsLaw_fontScale";
const DARK_KEY = "customsLaw_darkMode";

const HighlightUIContext = createContext(null);
function useHighlightUI() { return useContext(HighlightUIContext); }

function useNodeHighlights(nodeId, shouldLoad) {
  const [highlights, setHighlights] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!shouldLoad || !nodeId || loaded) return;
    const data = getHighlightsForNode(nodeId);
    setHighlights(data);
    setLoaded(true);
  }, [shouldLoad, nodeId, loaded]);
  const addHighlightLocal = useCallback(async (start, end) => {
    const newHl = addHighlight(nodeId, start, end);
    setHighlights(prev => [...prev, newHl]);
  }, [nodeId]);
  const removeHighlightLocal = useCallback(async (hlId) => {
    removeHighlight(hlId);
    setHighlights(prev => prev.filter(h => h.id !== hlId));
  }, []);
  return { highlights, addHighlight: addHighlightLocal, removeHighlight: removeHighlightLocal };
}

function useNodeNotes(nodeId, shouldLoad) {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!shouldLoad || !nodeId || loaded) return;
    setNotes(getNotesForNode(nodeId));
    setLoaded(true);
  }, [shouldLoad, nodeId, loaded]);
  const createNote = useCallback((content) => {
    const note = addNote(nodeId, content);
    setNotes((prev) => [...prev, note]);
    return note;
  }, [nodeId]);
  const editNote = useCallback((noteId, content) => {
    const note = updateNote(nodeId, noteId, content);
    setNotes((prev) => prev.map((n) => (n.id === noteId ? note : n)));
  }, [nodeId]);
  const removeNote = useCallback((noteId) => {
    deleteNote(nodeId, noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  }, [nodeId]);
  return { notes, createNote, editNote, removeNote };
}

function formatNoteDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
      " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function applyHighlights(text, highlights) {
  if (!highlights || highlights.length === 0) return [{ text, highlightId: null }];
  const sorted = [...highlights].sort((a, b) => a.start_offset - b.start_offset);
  const segments = [];
  let cursor = 0;
  for (const hl of sorted) {
    if (hl.start_offset > cursor) segments.push({ text: text.slice(cursor, hl.start_offset), highlightId: null });
    segments.push({ text: text.slice(hl.start_offset, hl.end_offset), highlightId: hl.id, color: hl.color });
    cursor = hl.end_offset;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlightId: null });
  return segments;
}

function SelectionToolbar({ x, y, kind, onSave, onCancel, onDelete }) {
  return (
    <div style={{ position: "fixed", left: x, top: y, zIndex: 100 }} className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-1.5 py-1.5 shadow-lg shadow-slate-900/10 dark:border-slate-600 dark:bg-slate-800 dark:shadow-black/40">
      {kind === "existing" ? (
        <>
          <button onClick={onDelete} className="flex items-center gap-1 rounded-lg px-3 py-2 min-h-[40px] text-sm font-medium text-red-600 active:bg-red-50 dark:text-red-400 dark:active:bg-red-950/40">🗑 Remove highlight</button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Close</button>
        </>
      ) : (
        <>
          <button onClick={onSave} className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-2 min-h-[40px] text-sm font-semibold text-amber-800 active:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:active:bg-amber-900/70">🖍 Highlight</button>
          <button onClick={onCancel} className="rounded-lg px-3 py-2 min-h-[40px] text-sm text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-700">Cancel</button>
        </>
      )}
    </div>
  );
}

function HighlightableContent({ nodeId, content, highlights, addHighlight, removeHighlight, className, armed }) {
  const containerRef = useRef(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [toolbar, setToolbar] = useState(null);
  useEffect(() => {
    if (!armed) { setPendingSelection(null); setToolbar((t) => (t && t.kind === "existing" ? t : null)); return; }
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !containerRef.current || !containerRef.current.contains(sel.anchorNode)) {
        setPendingSelection(null); setToolbar((t) => (t && t.kind === "existing" ? t : null)); return;
      }
      const range = sel.getRangeAt(0);
      const preRange = document.createRange();
      preRange.selectNodeContents(containerRef.current);
      preRange.setEnd(range.startContainer, range.startOffset);
      const start = preRange.toString().length;
      const end = start + range.toString().length;
      if (start >= end) return;
      setPendingSelection({ start, end });
      const rect = range.getBoundingClientRect();
      setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 200)), y: rect.bottom + 8, kind: "selection" });
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [armed]);
  const handleMarkClick = (e, hlId) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setToolbar({ x: Math.max(8, Math.min(rect.left, window.innerWidth - 200)), y: rect.bottom + 8, kind: "existing", hlId });
    setPendingSelection(null);
  };
  const closeToolbar = () => { setToolbar(null); setPendingSelection(null); window.getSelection()?.removeAllRanges(); };
  const confirmHighlight = async () => { if (!pendingSelection) return; await addHighlight(pendingSelection.start, pendingSelection.end); closeToolbar(); };
  const confirmDelete = async () => { if (!toolbar?.hlId) return; await removeHighlight(toolbar.hlId); closeToolbar(); };
  const segments = applyHighlights(content, highlights);
  return (
    <div className="relative">
      <div ref={containerRef} className={`${className} ${armed ? "rounded-lg bg-amber-50/70 ring-1 ring-amber-300 dark:bg-amber-950/30 dark:ring-amber-700" : ""}`}>
        {segments.map((seg, i) =>
          seg.highlightId ? (
            <mark key={i} style={{ backgroundColor: seg.color }} className="cursor-pointer rounded-sm px-0.5" onClick={(e) => handleMarkClick(e, seg.highlightId)}>{seg.text}</mark>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>
      {toolbar && <SelectionToolbar x={toolbar.x} y={toolbar.y} kind={toolbar.kind} onSave={confirmHighlight} onDelete={confirmDelete} onCancel={closeToolbar} />}
    </div>
  );
}

function NotePanel({ notes, onCreate, onEdit, onDelete, onClose }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(notes.length === 0);

  const startEdit = (note) => { setEditingId(note.id); setDraft(note.content); setAdding(false); };
  const startAdd = () => { setAdding(true); setEditingId(null); setDraft(""); };
  const cancel = () => { setEditingId(null); setAdding(notes.length === 0); setDraft(""); };
  const save = () => {
    const text = draft.trim();
    if (!text) return;
    if (editingId) { onEdit(editingId, text); setEditingId(null); }
    else { onCreate(text); setAdding(false); }
    setDraft("");
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="mt-3 rounded-xl border border-sky-200 bg-sky-50/70 p-3 dark:border-sky-800 dark:bg-sky-950/30">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-400">📝 My Notes</span>
        <button onClick={onClose} className="rounded-lg px-2 py-1 text-xs font-medium text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700">Close</button>
      </div>
      {notes.length > 0 && !adding && !editingId && (
        <div className="mb-2 space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-lg bg-white p-2.5 shadow-sm dark:bg-slate-800">
              <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{n.content}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {n.updated_at !== n.created_at ? `Edited ${formatNoteDate(n.updated_at)}` : `Added ${formatNoteDate(n.created_at)}`}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(n)} className="text-xs font-semibold text-sky-700 dark:text-sky-400">Edit</button>
                  <button onClick={() => onDelete(n.id)} className="text-xs font-semibold text-red-600 dark:text-red-400">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {adding || editingId ? (
        <div>
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write your own explanation or reminder…"
            rows={3}
            style={{ fontSize: "16px" }}
            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm text-slate-800 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button onClick={cancel} className="rounded-lg px-3 py-1.5 text-sm text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700">Cancel</button>
            <button onClick={save} disabled={!draft.trim()} className="rounded-lg bg-sky-700 px-3 py-1.5 text-sm font-semibold text-white active:bg-sky-800 disabled:opacity-40 dark:bg-sky-600">
              {editingId ? "Save" : "Add Note"}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={startAdd} className="w-full rounded-lg border border-dashed border-sky-300 py-2 text-sm font-medium text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:text-sky-400 dark:active:bg-sky-900/40">
          + Add Note
        </button>
      )}
    </div>
  );
}

function AiContextModal({ node, onClose }) {
  // FIX: recompute when node changes instead of using useState once
  const entry = useMemo(() => getAiContext(node.id), [
    node?.id,
    node?.section_number,
    node?.paragraph_number,
    node?.subparagraph_number,
    node?.title
  ]);
  const [copiedApp, setCopiedApp] = useState(null);

  const handleAskExternal = async (app) => {
    const prompt = entry?.prompt?.trim() ||
      `Explain "${node.title || node.node_number}" (${node.node_type} ${node.node_number || ""}) from RA 10863, the Philippine Customs Modernization and Tariff Act, in simple terms with an example.`;
    await copyPromptAndOpen(prompt, app.url);
    setCopiedApp(app.id);
    setTimeout(() => setCopiedApp(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-3xl">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-navy-700 text-lg">🤖</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Osias 6.7</p>
              <p className="text-xl font-extrabold leading-tight text-slate-900 dark:text-slate-50">
                {entry?.title || `About ${node.node_type} ${node.node_number || ""}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100 dark:text-slate-500 dark:active:bg-slate-800">✕</button>
        </div>

        {entry?.content ? (
          <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 text-base leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">{entry.content}</p>
        ) : (
          <p className="rounded-2xl bg-slate-50 p-3 text-sm italic text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">Osias 6.7 hasn't explained this part yet.</p>
        )}

        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Still confused? Ask another AI</p>
          <div className="flex flex-wrap gap-2">
            {AI_APPS.map((app) => (
              <button key={app.id} onClick={() => handleAskExternal(app)} className="flex min-h-[42px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:active:bg-slate-700">
                <span aria-hidden>{app.icon}</span> {app.label}
              </button>
            ))}
          </div>
          {copiedApp && (
            <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              ✓ Prompt copied — paste it in {AI_APPS.find((a) => a.id === copiedApp)?.label} and send.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
const STUDY_TYPE_STYLES = {
  chapter: "text-xl sm:text-2xl font-bold text-navy-900 dark:text-slate-50",
  section: "text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200",
  paragraph: "text-base sm:text-lg text-slate-700 dark:text-slate-300",
  subparagraph: "text-base text-slate-600 dark:text-slate-400",
  item: "text-sm text-slate-500 dark:text-slate-500",
};

const STUDY_DEPTH_BORDERS = [
  "border-slate-200 dark:border-slate-700",
  "border-amber-200 dark:border-amber-800",
  "border-emerald-200 dark:border-emerald-800",
  "border-purple-200 dark:border-purple-800",
  "border-sky-200 dark:border-sky-800",
];

function StudyNodeRenderer({ node, level = 0, expandedSet = new Set(), scrollToId = null, collapseSignal = 0 }) {
  const nodeRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const aiEntry = useMemo(() => getAiContext(node.id), [node.id]);
  const { activeHighlightNodeId, setActiveHighlightNodeId, setLastViewedNodeId } = useHighlightUI();
  const isHighlighting = activeHighlightNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;
  const isExpandable = hasChildren || !!node.content;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, expanded);
  const { notes, createNote, editNote, removeNote } = useNodeNotes(node.id, true);
  const prevCollapseSignal = useRef(collapseSignal);
  
  useEffect(() => { if (expandedSet.has(node.id)) setExpanded(true); }, [expandedSet, node.id]);
  useEffect(() => {
    if (collapseSignal !== prevCollapseSignal.current) {
      prevCollapseSignal.current = collapseSignal;
      setExpanded(false);
    }
  }, [collapseSignal]);
  useEffect(() => {
    if (scrollToId === node.id && nodeRef.current) {
      setTimeout(() => {
        nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nodeRef.current.classList.add("ring-2", "ring-amber-400", "bg-amber-50", "dark:bg-amber-900/40");
        setTimeout(() => nodeRef.current?.classList.remove("ring-2", "ring-amber-400", "bg-amber-50", "dark:bg-amber-900/40"), 2200);
      }, 120);
    }
  }, [scrollToId, node.id]);

  const toggle = (e) => {
    e.stopPropagation();
    if (!isExpandable) return;
    setExpanded((v) => {
      const next = !v;
      if (next && node.content && setLastViewedNodeId) setLastViewedNodeId(node.id);
      return next;
    });
  };

  return (
    <div ref={nodeRef} style={{ marginLeft: `${Math.min(level, 6) * 0.9}rem` }} className="my-1 rounded-xl transition-colors">
      <div onClick={toggle} role="button" tabIndex={0} aria-expanded={isExpandable ? expanded : undefined} className="flex items-start gap-2 rounded-xl px-3 py-2.5 hover:bg-slate-50 active:bg-slate-100 cursor-pointer touch-manipulation dark:hover:bg-slate-800/60 dark:active:bg-slate-800">
        <span className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center select-none text-slate-400 transition-transform duration-200 dark:text-slate-600 ${expanded ? "rotate-90" : ""}`}>{isExpandable ? "▸" : ""}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {node.node_type === "chapter" && <span className="inline-block rounded-md bg-navy-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white dark:bg-navy-700">Chapter {node.node_number}</span>}
            {node.node_type === "section" && <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Sec. {node.node_number}</span>}
            <span className={STUDY_TYPE_STYLES[node.node_type] || "text-sm text-slate-700 dark:text-slate-300"}>{node.title || node.node_number}</span>
            {!expanded && notes.length > 0 && <span className="text-xs" title="Has notes">📝</span>}
            {!expanded && aiEntry && <span className="text-xs" title="AI explanation available">🤖</span>}
          </div>
          {expanded && node.content && (
            <div onClick={(e) => e.stopPropagation()} className="mt-2">
              <HighlightableContent nodeId={node.id} content={node.content} highlights={highlights} addHighlight={addHighlight} removeHighlight={removeHighlight} armed={isHighlighting} className="select-text rounded-lg p-2 text-base leading-relaxed text-slate-700 dark:text-slate-300" />
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <button onClick={() => setActiveHighlightNodeId(isHighlighting ? null : node.id)} className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${isHighlighting ? "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-900/40 dark:text-amber-300" : "border-emerald-200 bg-emerald-50 text-emerald-700 active:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:active:bg-emerald-950/50"}`}>{isHighlighting ? "Select text to highlight…" : "🖍 Highlight"}</button>
                <button onClick={() => setNotesOpen((v) => !v)} className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${notesOpen ? "border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-300" : "border-sky-200 bg-sky-50 text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/30 dark:text-sky-400 dark:active:bg-sky-950/50"}`}>
                  📝 {notes.length > 0 ? `Notes (${notes.length})` : "Add Note"}
                </button>
                <button onClick={() => setAiModalOpen(true)} className="min-h-[38px] rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400 dark:active:bg-purple-950/50">
                  🤖 Ask AI
                </button>
              </div>
              {notesOpen && (
                <NotePanel notes={notes} onCreate={createNote} onEdit={editNote} onDelete={removeNote} onClose={() => setNotesOpen(false)} />
              )}
              {aiModalOpen && <AiContextModal node={node} onClose={() => setAiModalOpen(false)} />}
              {node.cross_references && node.cross_references.length > 0 && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/60" onClick={(e) => e.stopPropagation()}>
                  <span className="font-medium text-slate-700 dark:text-slate-300">See Also</span>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-400">
                    {node.cross_references.map((ref, idx) => (
                      <li key={idx}>{ref.url ? <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline decoration-navy-300 underline-offset-2 dark:text-amber-400 dark:decoration-amber-700">{ref.text}</a> : <span>{ref.text}</span>}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {expanded && node.keywords?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1" onClick={(e) => e.stopPropagation()}>
              {node.keywords.map((kw) => <span key={kw} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">{kw}</span>)}
            </div>
          )}
        </div>
      </div>
      {expanded && hasChildren && (
        <div className={`ml-4 border-l-2 ${STUDY_DEPTH_BORDERS[(level + 1) % STUDY_DEPTH_BORDERS.length]}`}>
          {node.children.map((child) => <StudyNodeRenderer key={child.id} node={child} level={level + 1} expandedSet={expandedSet} scrollToId={scrollToId} collapseSignal={collapseSignal} />)}
        </div>
      )}
    </div>
  );
}

const READING_TYPE_STYLES = {
  chapter: "font-bold text-navy-900 dark:text-slate-50 mb-2",
  section: "font-semibold text-slate-900 dark:text-slate-100 mb-1",
  paragraph: "text-slate-800 dark:text-slate-300",
  subparagraph: "text-slate-800 dark:text-slate-300",
  item: "text-slate-700 dark:text-slate-400",
};

function ReadingNodeRenderer({ node, level = 0, fontScale, expandedSet = new Set(), scrollToId = null }) {
  const nodeRef = useRef(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  // FIX: recompute when any relevant node field changes, not just node.id
  const aiEntry = useMemo(() => getAiContext(node.id), [
    node?.id,
    node?.section_number,
    node?.paragraph_number,
    node?.subparagraph_number,
    node?.title
  ]);
  const hasChildren = node.children && node.children.length > 0;
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(node.id, !!node.content);
  const { notes, createNote, editNote, removeNote } = useNodeNotes(node.id, true);
  
  useEffect(() => {
    if (scrollToId === node.id && nodeRef.current) {
      setTimeout(() => {
        nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        nodeRef.current.classList.add("bg-amber-50", "dark:bg-amber-900/40");
        setTimeout(() => nodeRef.current?.classList.remove("bg-amber-50", "dark:bg-amber-900/40"), 2200);
      }, 120);
    }
  }, [scrollToId, node.id]);

  const headingSize = node.node_type === "chapter" ? 1.6 : node.node_type === "section" ? 1.3 : 1;
  return (
    <div ref={nodeRef} style={{ marginLeft: `${Math.min(level, 4) * 0.6}rem` }} className="my-5 rounded-lg transition-colors">
      <div className={`font-serif ${READING_TYPE_STYLES[node.node_type] || "text-slate-800 dark:text-slate-200"}`} style={{ fontSize: `${headingSize * fontScale}rem` }}>
        {node.node_type === "section" && `Section ${node.node_number}. `}
        {node.node_type === "chapter" && `Chapter ${node.node_number}. `}
        {node.title || node.node_number}
        {notes.length > 0 && <span className="ml-1 align-middle text-sm" title="Has notes">📝</span>}
        {aiEntry && <span className="ml-1 align-middle text-sm" title="AI explanation available">🤖</span>}
      </div>
      {node.content && <HighlightableContent nodeId={node.id} content={node.content} highlights={highlights} addHighlight={addHighlight} removeHighlight={removeHighlight} armed={true} className="select-text font-serif leading-loose text-slate-800 dark:text-slate-300" />}
      {node.content && (
        <div className="mt-2 flex flex-wrap items-center gap-2 font-sans">
          <button onClick={() => setNotesOpen((v) => !v)} className={`min-h-[36px] rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${notesOpen ? "border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-300" : "border-sky-200 bg-sky-50 text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/30 dark:text-sky-400 dark:active:bg-sky-950/50"}`}>
            📝 {notes.length > 0 ? `Notes (${notes.length})` : "Add Note"}
          </button>
          <button onClick={() => setAiModalOpen(true)} className="min-h-[36px] rounded-lg border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400 dark:active:bg-purple-950/50">
            🤖 Ask AI
          </button>
        </div>
      )}
      {notesOpen && (
        <div className="font-sans">
          <NotePanel notes={notes} onCreate={createNote} onEdit={editNote} onDelete={removeNote} onClose={() => setNotesOpen(false)} />
        </div>
      )}
      {aiModalOpen && <AiContextModal node={node} onClose={() => setAiModalOpen(false)} />}
      {node.cross_references && node.cross_references.length > 0 && (
        <div className="mt-2 rounded-lg bg-slate-50 p-3 font-sans text-sm dark:bg-slate-800/60">
          <span className="font-medium text-slate-700 dark:text-slate-300">See Also</span>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600 dark:text-slate-400">
            {node.cross_references.map((ref, idx) => (
              <li key={idx}>{ref.url ? <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-navy-700 underline decoration-navy-300 underline-offset-2 dark:text-amber-400 dark:decoration-amber-700">{ref.text}</a> : <span>{ref.text}</span>}</li>
            ))}
          </ul>
        </div>
      )}
      {hasChildren && <div>{node.children.map((child) => <ReadingNodeRenderer key={child.id} node={child} level={level + 1} fontScale={fontScale} expandedSet={expandedSet} scrollToId={scrollToId} />)}</div>}
    </div>
  );
}

function ModeToggle({ mode, setMode }) {
  return (
    <div className="inline-flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800" role="tablist" aria-label="View mode">
      <button role="tab" aria-selected={mode === "study"} onClick={() => setMode("study")} className={`min-h-[34px] rounded-full px-2.5 py-1 transition-colors ${mode === "study" ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700" : "text-slate-500 dark:text-slate-400"}`}>
        <span aria-hidden>📘</span><span className="hidden sm:inline ml-1">Study</span>
      </button>
      <button role="tab" aria-selected={mode === "reading"} onClick={() => setMode("reading")} className={`min-h-[34px] rounded-full px-2.5 py-1 transition-colors ${mode === "reading" ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700" : "text-slate-500 dark:text-slate-400"}`}>
        <span aria-hidden>📖</span><span className="hidden sm:inline ml-1">Reading</span>
      </button>
    </div>
  );
}

function FontStepper({ fontScale, setFontScale }) {
  const clamp = (v) => Math.min(1.6, Math.max(0.85, v));
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <button onClick={() => setFontScale((s) => clamp(s - 0.1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700" aria-label="Decrease font size">A-</button>
      <span className="w-10 text-center text-xs text-slate-400 dark:text-slate-500">{Math.round(fontScale * 100)}%</span>
      <button onClick={() => setFontScale((s) => clamp(s + 0.1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700" aria-label="Increase font size">A+</button>
    </div>
  );
}

function ReadingProgressBar({ containerRef }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => { const max = el.scrollHeight - el.clientHeight; setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0); };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);
  return (
    <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-navy-700 transition-all dark:from-amber-500 dark:to-navy-400" style={{ width: `${pct}%` }} />
    </div>
  );
}

function FilterChip({ label, value, active, onClick }) {
  return (
    <button onClick={() => onClick(value)} className={`min-h-[38px] rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${active ? "border-navy-900 bg-navy-900 text-white dark:border-navy-600 dark:bg-navy-700" : "border-slate-200 bg-white text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"}`}>{label}</button>
  );
}

function SearchResultCard({ item, onClick }) {
  const buildPath = () => {
    const parts = [];
    if (item.title_number) parts.push(`TITLE ${item.title_number}`);
    if (item.chapter_number) parts.push(`Ch. ${item.chapter_number}`);
    if (item.node_type === "section") parts.push(`Sec. ${item.node_number}`);
    return parts.join(" · ") || item.node_type.toUpperCase();
  };
  const typeColors = {
    title: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    chapter: "bg-navy-900 text-white dark:bg-navy-700",
    section: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    paragraph: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    subparagraph: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
    item: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return (
    <button onClick={onClick} className={`block w-full rounded-2xl border bg-white p-4 text-left shadow-card transition active:scale-[0.99] active:bg-slate-50 dark:bg-slate-800 dark:active:bg-slate-700/70 ${item.exact_match ? "border-amber-400 ring-1 ring-amber-300 dark:border-amber-600 dark:ring-amber-700" : "border-slate-200 dark:border-slate-700"}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`rounded-md px-1.5 py-0.5 font-semibold uppercase tracking-wide ${typeColors[item.node_type] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>{item.node_type}</span>
          <span className="text-slate-400 dark:text-slate-500">{buildPath()}</span>
        </div>
        {item.exact_match && <span className="flex-shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-950 dark:bg-amber-500 dark:text-amber-950">✓ Exact match</span>}
      </div>
      <div className="mt-1.5 text-base font-semibold text-slate-900 dark:text-slate-100">{item.title || item.node_number}</div>
      {item.excerpt && <div className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: item.excerpt.replace(/\[/g, "<mark>").replace(/\]/g, "</mark>") }} />}
      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-navy-700 dark:text-amber-400">Open <span aria-hidden>→</span></div>
    </button>
  );
}

function SearchView({ onNavigateChapter }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true); setError(null); setHasSearched(true);
    try {
      const data = await search(query.trim(), filter);
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally { setLoading(false); }
  }, [query, filter]);

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSearch(); };
  const clearQuery = () => { setQuery(""); setResults([]); setHasSearched(false); inputRef.current?.focus(); };
  
  const handleResultClick = async (item) => {
    if (item.chapter_number) {
      onNavigateChapter(item.chapter_number, item.title_number, item.node_id);
    } else {
      try {
        const chapterInfo = await getChapterForNode(item.node_id);
        if (chapterInfo) {
          onNavigateChapter(chapterInfo.chapter_number, chapterInfo.title_number, item.node_id);
        } else {
          alert('This item is not under any chapter. Please browse manually.');
        }
      } catch (e) {
        alert('Could not locate the chapter for this item.');
        console.error(e);
      }
    }
  };
  
  const exactResults = results.filter((r) => r.exact_match);
  const otherResults = results.filter((r) => !r.exact_match);
  
  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <span className="pl-1 text-lg text-slate-400 dark:text-slate-500" aria-hidden>🔍</span>
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder='Search e.g. "Section 102" or "smuggling"' className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500" style={{ fontSize: "16px" }} />
          {query && <button onClick={clearQuery} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100 dark:text-slate-500 dark:active:bg-slate-700" aria-label="Clear search">✕</button>}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 dark:border-slate-700">
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="All" value="all" active={filter === "all"} onClick={setFilter} />
            <FilterChip label="Title" value="title" active={filter === "title"} onClick={setFilter} />
            <FilterChip label="Chapter" value="chapter" active={filter === "chapter"} onClick={setFilter} />
            <FilterChip label="Section" value="section" active={filter === "section"} onClick={setFilter} />
          </div>
          <button onClick={handleSearch} disabled={loading || !query.trim()} className="min-h-[38px] flex-shrink-0 rounded-full bg-navy-900 px-5 py-1.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 disabled:opacity-40 dark:bg-navy-700 dark:active:bg-navy-600">{loading ? "Searching…" : "Search"}</button>
        </div>
      </div>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">{error}</p>}
      {loading && (
        <div className="mt-4 space-y-3">
          {[0,1,2].map(i => <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"><div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700"/><div className="mt-3 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-700"/><div className="mt-2 h-3 w-full rounded bg-slate-100 dark:bg-slate-700/60"/></div>)}
        </div>
      )}
      {!loading && exactResults.length > 0 && <div className="mt-5 space-y-2">{exactResults.map((item, idx) => <SearchResultCard key={`exact-${idx}`} item={item} onClick={() => handleResultClick(item)} />)}</div>}
      {!loading && otherResults.length > 0 && <div className="mt-5">{exactResults.length > 0 && <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Related mentions</p>}<div className="space-y-2">{otherResults.map((item, idx) => <SearchResultCard key={`other-${idx}`} item={item} onClick={() => handleResultClick(item)} />)}</div></div>}
      {!loading && hasSearched && results.length === 0 && !error && <div className="mt-10 flex flex-col items-center gap-2 text-center text-slate-400 dark:text-slate-600"><span className="text-3xl">🔎</span><p className="text-base font-medium text-slate-500 dark:text-slate-400">No results for "{query}"</p><p className="text-sm">Try a section number (e.g. 102), a keyword, or a shorter phrase.</p></div>}
      {!hasSearched && !loading && <div className="mt-10 flex flex-col items-center gap-2 text-center text-slate-400 dark:text-slate-600"><span className="text-3xl">📚</span><p className="text-sm">Search the full text of RA 10863 — titles, chapters, sections, and definitions.</p></div>}
    </div>
  );
}

function DarkModeToggle({ enabled, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={enabled} onClick={() => onChange(!enabled)} className={`relative inline-flex h-8 w-14 flex-shrink-0 items-center rounded-full transition-colors duration-300 ${enabled ? "bg-navy-700" : "bg-slate-300"}`}>
      <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${enabled ? "translate-x-7" : "translate-x-1"}`} />
    </button>
  );
}

const TUTORIAL_STEPS = [
  { icon: "⚖️", title: "Welcome to RA 10863", body: "Your complete offline companion for the Customs Modernization and Tariff Act. Let's take a 60-second tour of what you can do." },
  { icon: "📚", title: "Browse the Law", body: "Tap the menu button (☰) to open the sidebar. Every Title, Chapter, and Section is organized in the correct legal order." },
  { icon: "📘", title: "Study Mode", body: "Expand one section at a time to focus on details. Use Expand All or Collapse All at the top to move through a whole chapter faster." },
  { icon: "📖", title: "Reading Mode", body: "A clean, book-style view for long reading sessions. Tap 🎯 Focus to hide the toolbar and read distraction-free." },
  { icon: "🖍️", title: "Highlights", body: "Select any text to highlight it. Works in both Study and Reading mode, and is saved automatically — even offline." },
  { icon: "📝", title: "Notes", body: "Tap \"Add Note\" under any section to write your own explanation. Edit or delete your notes anytime." },
  { icon: "🤖", title: "Ask AI", body: "Tap Ask AI under any section for an instant offline explanation from Osias 6.7 — or hand off to Meta AI, ChatGPT, or Gemini with one tap." },
  { icon: "🔍", title: "Search", body: "Find anything instantly. Try a section number like \"102\", or a keyword like \"smuggling\"." },
  { icon: "⏱️", title: "Resume Reading", body: "Close the app anytime — a \"Continue where you left off\" card will bring you right back to your spot." },
  { icon: "⚙️", title: "Settings", body: "Switch Dark Mode on or off, and replay this tour anytime from the Settings screen." },
];

function TutorialOverlay({ onFinish }) {
  const [step, setStep] = useState(0);
  const total = TUTORIAL_STEPS.length;
  const isLast = step === total - 1;
  const current = TUTORIAL_STEPS[step];

  const next = () => { if (isLast) onFinish(); else setStep((s) => s + 1); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-slate-900/70 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="w-full rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:max-w-md sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {TUTORIAL_STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-navy-900 dark:bg-slate-100" : "w-1.5 bg-slate-200 dark:bg-slate-700"}`} />
            ))}
          </div>
          <button onClick={onFinish} className="text-sm font-medium text-slate-400 active:text-slate-600 dark:text-slate-500 dark:active:text-slate-300">
            Skip
          </button>
        </div>
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 text-5xl" aria-hidden>{current.icon}</span>
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-50">{current.title}</h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{current.body}</p>
        </div>
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button onClick={back} className="flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-800">
              Back
            </button>
          )}
          <button onClick={next} className="flex h-12 flex-[2] items-center justify-center rounded-xl bg-navy-900 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600">
            {isLast ? "Start Exploring" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsView({ darkMode, setDarkMode, onReplayTutorial }) {
  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="mb-1 text-2xl font-bold text-slate-900 dark:text-slate-50">Settings</h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Customize your reading experience.</p>
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Appearance</h2>
        <div className="flex items-center justify-between gap-4 rounded-xl py-1">
          <div className="min-w-0"><p className="font-medium text-slate-800 dark:text-slate-100">🌙 Dark Mode</p><p className="text-sm text-slate-500 dark:text-slate-400">Easier on the eyes in low light.</p></div>
          <DarkModeToggle enabled={darkMode} onChange={setDarkMode} />
        </div>
      </section>
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Help</h2>
        <button onClick={onReplayTutorial} className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 active:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:active:bg-slate-700">
          🔄 Replay Tutorial
        </button>
      </section>
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">About this App</h2>
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">RA 10863 — Customs Modernization and Tariff Act. A study &amp; reading companion with search and highlights. Works fully offline.</p>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Version 1.0.0 (Offline)</p>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Developer</h2>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-white dark:bg-navy-700">O</div>
          <div className="min-w-0"><p className="font-semibold text-slate-800 dark:text-slate-100">Osias</p><p className="text-sm text-slate-500 dark:text-slate-400">App developer &amp; maintainer</p></div>
        </div>
        <a href="https://osiasnalaunan68-star.github.io/osias-personal-portfolio" target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600">🌐 View Developer Portfolio</a>
      </section>
    </div>
  );
}

function findNodeByIdAndAncestors(node, targetId, ancestors = []) {
  if (node.id === targetId) return { found: true, ancestors, node };
  if (node.children) {
    for (const child of node.children) {
      const result = findNodeByIdAndAncestors(child, targetId, [...ancestors, node.id]);
      if (result.found) return result;
    }
  }
  return { found: false };
}

function collectAllNodeIds(node, acc = []) {
  if (node.children && node.children.length > 0) {
    acc.push(node.id);
    for (const child of node.children) collectAllNodeIds(child, acc);
  } else if (node.content) {
    acc.push(node.id);
  }
  return acc;
}

// ── ui-modern: icons + bottom navigation ─────────────────────────────
const NAV_ICONS = {
  book: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  quiz: <><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></>,
  settings: <><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></>,
  crown: <><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" /><path d="M5 20h14" /></>,
  wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
  menu: <><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></>,
  x: <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>,
};

function NavIcon({ name, className = "h-[22px] w-[22px]" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {NAV_ICONS[name]}
    </svg>
  );
}

const VIEW_TITLES = { browse: "RA 10863", search: "Search", quiz: "Quiz", settings: "Settings", admin: "Admin", dev: "Dev Panel" };

function BottomNav({ view, setView, showAdmin, showDev }) {
  const items = [
    { id: "browse", label: "Library", icon: "book" },
    { id: "search", label: "Search", icon: "search" },
    { id: "quiz", label: "Quiz", icon: "quiz" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  if (showAdmin) items.push({ id: "admin", label: "Admin", icon: "crown" });
  if (showDev) items.push({ id: "dev", label: "Dev", icon: "wrench" });
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-[35] border-t border-slate-200/80 bg-white/85 shadow-nav backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-xl items-stretch justify-around px-2 py-1.5">
        {items.map((it) => {
          const active = view === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setView(it.id)}
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
              className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-1"
            >
              <span className={"flex h-8 w-14 items-center justify-center rounded-full transition-colors duration-200 " + (active ? "bg-navy-900/10 text-navy-900 dark:bg-gold-500/20 dark:text-gold-400" : "text-slate-500 dark:text-slate-400")}>
                <NavIcon name={it.icon} />
              </span>
              <span className={"max-w-full truncate text-[11px] leading-tight " + (active ? "font-semibold text-navy-900 dark:text-gold-400" : "font-medium text-slate-500 dark:text-slate-400")}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function ChapterBrowser({ initialView = "browse", initialMode = null, demo = false } = {}) {
  const { profile } = useAuth();
  const [view, setView] = useState(initialView);
  const [titles, setTitles] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTitleNumber, setSelectedTitleNumber] = useState(null);
  const [chapterTree, setChapterTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [mode, setMode] = useState(() => initialMode || localStorage.getItem(MODE_KEY) || "study");
  const [fontScale, setFontScale] = useState(() => { const saved = parseFloat(localStorage.getItem(FONT_KEY)); return isNaN(saved) ? 1 : saved; });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(DARK_KEY) === "true");
  const [activeHighlightNodeId, setActiveHighlightNodeId] = useState(null);
  const [lastViewedNodeId, setLastViewedNodeId] = useState(null);
  const [expandedNodeIds, setExpandedNodeIds] = useState(new Set());
  const [scrollToNodeId, setScrollToNodeId] = useState(null);
  const [collapsedTitles, setCollapsedTitles] = useState({});
  const [studyCollapseSignal, setStudyCollapseSignal] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [resumeAvailable, setResumeAvailable] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  // Source = which library is open: "cmta" (existing), "cmo" or "cao"
  const [source, setSource] = useState(() => (demo ? "cmta" : localStorage.getItem(SOURCE_KEY) || "cmta"));
  const [issuanceId, setIssuanceId] = useState(() => localStorage.getItem(ISSUANCE_KEY) || null);
  const mainRef = useRef(null);
  const pendingScrollRestore = useRef(null);
  const scrollSaveTimeout = useRef(null);

  useEffect(() => { if (!demo) localStorage.setItem(SOURCE_KEY, source); }, [source, demo]);
  useEffect(() => { if (issuanceId) localStorage.setItem(ISSUANCE_KEY, issuanceId); }, [issuanceId]);
  const isIssuance = source !== "cmta";
  const currentIssuance = isIssuance && issuanceId ? getIssuance(issuanceId) : null;
  const issuanceTitle = currentIssuance && currentIssuance.type.toLowerCase() === source
    ? `${currentIssuance.label}${currentIssuance.title ? " — " + currentIssuance.title : ""}`
    : (ISSUANCE_KINDS.find((k) => k.id === source)?.full || "");
  const openIssuance = useCallback((kind, id) => {
    setSource(kind);
    setIssuanceId(id);
    setView("browse");
    setSidebarOpen(window.innerWidth >= 768);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, []);

  useEffect(() => localStorage.setItem(MODE_KEY, mode), [mode]);
  useEffect(() => localStorage.setItem(FONT_KEY, String(fontScale)), [fontScale]);
  useEffect(() => {
    localStorage.setItem(DARK_KEY, String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    getTitles()
      .then(setTitles)
      .catch((err) => {
        console.error("Failed to load titles:", err);
        setError(err.message);
      });
    const progress = getProgress();
    if (progress && progress.chapter_number) setResumeAvailable(progress);
    if (!demo && !hasTutorialBeenSeen()) {
      setShowTutorial(true);
    }
  }, []);

  const finishTutorial = useCallback(() => {
    markTutorialSeen();
    setShowTutorial(false);
  }, []);

  const replayTutorial = useCallback(() => {
    setShowTutorial(true);
  }, []);

  const loadChapter = useCallback(async (chapterNumber, titleNumber = null, targetNodeId = null) => {
    setLoading(true); setError(null);
    try {
      const data = await getChapter(chapterNumber, titleNumber);
    if (data && data.children) {
      enrichNodesWithHierarchy(data.children);
    }
      if (!data) throw new Error("Chapter not found");
      setChapterTree(data);
      setSelectedChapter(chapterNumber);
      setSelectedTitleNumber(titleNumber);
      setSource("cmta");
      setView("browse");
      setSidebarOpen(window.innerWidth >= 768);
      if (targetNodeId && data) {
        const { found, ancestors, node: foundNode } = findNodeByIdAndAncestors(data, targetNodeId);
        if (found) {
          setExpandedNodeIds(new Set([...ancestors, foundNode.id]));
          setScrollToNodeId(foundNode.id);
        } else {
          setExpandedNodeIds(new Set());
          setScrollToNodeId(null);
        }
      } else {
        setExpandedNodeIds(new Set());
        setScrollToNodeId(null);
      }
      if (pendingScrollRestore.current != null) {
        const targetScroll = pendingScrollRestore.current;
        pendingScrollRestore.current = null;
        setTimeout(() => { if (mainRef.current) mainRef.current.scrollTop = targetScroll; }, 180);
      } else if (mainRef.current) {
        mainRef.current.scrollTop = 0;
      }
    } catch (err) {
      setError(err.message);
      setChapterTree(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const resumeReading = useCallback(() => {
    if (!resumeAvailable) return;
    if (resumeAvailable.mode) setMode(resumeAvailable.mode);
    if (resumeAvailable.mode === "study" && resumeAvailable.studyNodeId) {
      loadChapter(resumeAvailable.chapter_number, resumeAvailable.title_number || null, resumeAvailable.studyNodeId);
    } else {
      pendingScrollRestore.current = resumeAvailable.scrollTop || 0;
      loadChapter(resumeAvailable.chapter_number, resumeAvailable.title_number || null);
    }
  }, [resumeAvailable, loadChapter]);

  useEffect(() => {
    if (!chapterTree || view !== "browse") return;
    const el = mainRef.current;
    if (!el) return;
    const persist = () => {
      saveProgress({
        title_number: selectedTitleNumber,
        chapter_number: selectedChapter,
        mode,
        scrollTop: el.scrollTop,
        studyNodeId: mode === "study" ? lastViewedNodeId : null,
      });
    };
    const onScroll = () => {
      if (scrollSaveTimeout.current) clearTimeout(scrollSaveTimeout.current);
      scrollSaveTimeout.current = setTimeout(persist, 500);
    };
    persist();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (scrollSaveTimeout.current) clearTimeout(scrollSaveTimeout.current);
    };
  }, [chapterTree, selectedChapter, selectedTitleNumber, mode, view, lastViewedNodeId]);

  const toggleTitleCollapse = (key) => { setCollapsedTitles(prev => ({ ...prev, [key]: !prev[key] })); };
  
  const expandAllStudy = () => {
    if (!chapterTree) return;
    const ids = [];
    for (const section of chapterTree.children) collectAllNodeIds(section, ids);
    setExpandedNodeIds(new Set(ids));
  };
  
  const collapseAllStudy = () => {
    setExpandedNodeIds(new Set());
    setStudyCollapseSignal((v) => v + 1);
  };

  // 🔽 BINAGO: i-download bilang .txt file sa halip na clipboard
  const handleCopyQuizTemplate = useCallback(async (titleNumber) => {
    try {
      const tree = await getTitleTree(titleNumber);
      if (!tree) { alert("Could not load this title."); return; }
      const payload = copyQuizPromptForTitle(tree);
      // Gumawa ng .txt file at i-download
      const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quiz-prompt-Title-${titleNumber}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      // Ipakita ang confirmation message
      alert(`✅ The quiz-generation prompt for Title ${titleNumber} was downloaded as a .txt file.

📝 INSTRUCTIONS FOR AI:
1. Act like a professor designing a CuBLE exam.
2. SELECTIVELY choose the most important and testable provisions.
3. There is NO fixed number of questions — generate as many as educationally appropriate.
4. Use web search (if available) to verify CuBLE exam patterns and frequently tested topics.
5. Focus on QUALITY over QUANTITY — board-exam relevant questions only.

⚠️ IMPORTANT: The AI will SKIP minor, procedural, or repetitive provisions.`);
    } catch (err) {
      alert("Failed to build quiz template: " + err.message);
    }
  }, []);

  const highlightUIValue = useMemo(() => ({ activeHighlightNodeId, setActiveHighlightNodeId, setLastViewedNodeId }), [activeHighlightNodeId, setLastViewedNodeId]);

  return (
    <HighlightUIContext.Provider value={highlightUIValue}>
      <div className="relative flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950" style={{ height: "100dvh" }}>
        {sidebarOpen && view === "browse" && <div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] md:hidden" onClick={() => setSidebarOpen(false)} />}
        {view === "browse" && (
          <aside className={`safe-top fixed inset-y-0 left-0 z-40 w-[85vw] max-w-[320px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:static md:w-80 md:max-w-none md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex items-center gap-2"><span className="text-xl" aria-hidden>⚖️</span><div><h2 className="text-base font-bold leading-tight text-navy-900 dark:text-slate-50">RA 10863</h2><p className="text-xs text-slate-400 dark:text-slate-500">Customs Modernization &amp; Tariff Act</p></div></div>
              <div className="mt-3 flex rounded-xl bg-slate-100 p-1 text-sm dark:bg-slate-800" role="tablist" aria-label="Library">
                {ISSUANCE_KINDS.map((k) => (
                  <button key={k.id} role="tab" aria-selected={source === k.id} onClick={() => setSource(k.id)} className={`min-h-[36px] flex-1 rounded-lg px-2 py-1 font-semibold transition-colors ${source === k.id ? "bg-navy-900 text-white shadow-sm dark:bg-navy-700" : "text-slate-500 dark:text-slate-400"}`}>
                    <span aria-hidden>{k.icon}</span> {k.label}
                  </button>
                ))}
              </div>
            </div>
            {source === "cmta" ? (
            <div className="p-3">
              {error && <p className="mb-2 rounded-lg bg-red-50 p-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">{error}</p>}
              {titles.map((titleGroup) => {
                const key = titleGroup.title_number || "root";
                const collapsed = collapsedTitles[key];
                return (
                  <div key={key} className="mb-2">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleTitleCollapse(key)} className="flex min-h-[40px] flex-1 items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-slate-50 dark:active:bg-slate-800">
                        <span className="text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-300">{titleGroup.title_number ? `Title ${titleGroup.title_number}` : titleGroup.title_title}</span>
                        <span className="flex-shrink-0 text-xs text-slate-400 dark:text-slate-500">{collapsed ? "▸" : "▾"}</span>
                      </button>
                      {IS_DEV && titleGroup.title_number && (
                        <button
                          onClick={() => handleCopyQuizTemplate(titleGroup.title_number)}
                          title="Download Quiz Template as .txt"
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-dashed border-purple-400 text-sm text-purple-700 active:bg-purple-100 dark:border-purple-600 dark:text-purple-400"
                        >
                          📝
                        </button>
                      )}
                    </div>
                    {!collapsed && (
                      <ul className="ml-1 space-y-0.5 border-l border-slate-100 pl-2 dark:border-slate-800">
                        {titleGroup.chapters.map((ch) => {
                          const active = selectedChapter === ch.node_number && selectedTitleNumber === titleGroup.title_number;
                          return (
                            <li key={ch.id}>
                              <button onClick={() => loadChapter(ch.node_number, titleGroup.title_number)} className={`block min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${active ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700" : "text-slate-600 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800"}`}>
                                <span className="block truncate">Ch. {ch.node_number}: {ch.title}</span>
                                <span className={`text-xs ${active ? "text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>{ch.section_count} section{ch.section_count !== 1 ? "s" : ""}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
            ) : (
              <IssuanceSidebar kind={source} selectedId={issuanceId} onSelect={(id) => openIssuance(source, id)} />
            )}
          </aside>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="safe-top sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className={`flex items-center gap-1.5 px-2 transition-all duration-300 ${focusMode && mode === "reading" ? "max-h-0 overflow-hidden opacity-0 py-0" : "max-h-16 py-2 opacity-100"}`}>
              {view === "browse" && (
                <button onClick={() => setSidebarOpen((v) => !v)} className="flex h-9 w-9 flex-shrink-0 touch-manipulation items-center justify-center rounded-full text-lg text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800" aria-label="Toggle chapter list">
                  <NavIcon name={sidebarOpen ? "x" : "menu"} className="h-5 w-5" />
                </button>
              )}
              <div className="flex min-w-0 items-center gap-2 pl-1">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-navy-900 text-base text-white shadow-sm dark:bg-gold-500 dark:text-navy-950" aria-hidden>⚖️</span>
                <span className="truncate text-[15px] font-bold tracking-tight text-navy-900 dark:text-slate-50">{VIEW_TITLES[view] || "RA 10863"}</span>
              </div>
              <span className="flex-1" />
              <AccountButton />
              {view === "browse" && <ModeToggle mode={mode} setMode={setMode} />}
            </div>
            {view === "browse" && !(focusMode && mode === "reading") && (
              <div className="px-3 pb-2">
                <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {isIssuance ? issuanceTitle : chapterTree ? chapterTree.title || `Chapter ${chapterTree.node_number}` : "Select a chapter"}
                </span>
              </div>
            )}
            {view === "browse" && mode === "reading" && (
              <div className="flex items-center justify-end gap-2 px-3 pb-2">
                <button onClick={() => setFocusMode((v) => !v)} className={`flex h-9 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors ${focusMode ? "border-navy-900 bg-navy-900 text-white dark:border-slate-200 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700"}`}>
                  🎯 <span className="hidden sm:inline">Focus</span>
                </button>
                <FontStepper fontScale={fontScale} setFontScale={setFontScale} />
              </div>
            )}
            {view === "browse" && mode === "reading" && (chapterTree || (isIssuance && issuanceId)) && <ReadingProgressBar containerRef={mainRef} />}
          </div>
          <main ref={mainRef} className="has-bottom-nav safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
            {error && (
              <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
                <p className="font-bold">⚠️ Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {view === "search" ? <SearchView onNavigateChapter={loadChapter} /> : view === "dev" && IS_DEV ? <DevPanel /> : view === "admin" && profile?.isAdmin ? <AdminPanel /> : view === "quiz" ? null : view === "settings" ? <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} onReplayTutorial={replayTutorial} /> : isIssuance ? (
              <IssuanceReader kind={source} issuanceId={issuanceId} mode={mode} fontScale={fontScale} focusMode={focusMode} onOpenIssuance={(hit) => openIssuance(hit.type.toLowerCase(), hit.id)} />
            ) : (
              <>
                {loading && (
                  <div className="mx-auto max-w-3xl space-y-3">
                    {[0,1,2].map(i => <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"><div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"/><div className="mt-3 h-3 w-full rounded bg-slate-100 dark:bg-slate-800"/><div className="mt-2 h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800"/></div>)}
                  </div>
                )}
                {!loading && !chapterTree && !error && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-400 dark:text-slate-600">
                    {resumeAvailable && (
                      <button onClick={resumeReading} className="mb-2 flex w-full max-w-sm items-center gap-3 rounded-2xl border border-navy-200 bg-white p-4 text-left shadow-card active:bg-slate-50 dark:border-navy-700 dark:bg-slate-900 dark:active:bg-slate-800">
                        <span className="text-2xl" aria-hidden>⏱️</span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-navy-900 dark:text-slate-100">Continue where you left off</span>
                          <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                            {resumeAvailable.title_number ? `Title ${resumeAvailable.title_number} · ` : ""}Chapter {resumeAvailable.chapter_number}
                          </span>
                        </span>
                      </button>
                    )}
                    <span className="text-4xl">📖</span>
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-400">Select a chapter to start {mode === "reading" ? "reading" : "studying"}</p>
                    <p className="text-sm">Use the menu button or Search to find what you need.</p>
                  </div>
                )}
                {chapterTree && mode === "study" && (
                  <div className="mx-auto max-w-3xl">
                    {chapterTree.content && <p className="mb-4 rounded-xl bg-white p-4 text-base text-slate-600 shadow-card dark:bg-slate-900 dark:text-slate-300">{chapterTree.content}</p>}
                    <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
                      <button onClick={expandAllStudy} className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700">
                        <span aria-hidden>⤢</span> Expand All
                      </button>
                      <button onClick={collapseAllStudy} className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700">
                        <span aria-hidden>⤡</span> Collapse All
                      </button>
                    </div>
                    <div className="space-y-1">{chapterTree.children.map((section) => <StudyNodeRenderer key={section.id} node={section} level={0} expandedSet={expandedNodeIds} scrollToId={scrollToNodeId} collapseSignal={studyCollapseSignal} />)}</div>
                  </div>
                )}
                {chapterTree && mode === "reading" && (
                  <div className={`mx-auto transition-all duration-300 ${focusMode ? "max-w-[62ch]" : "max-w-[70ch]"}`}>
                    {chapterTree.content && <p className="mb-4 font-serif text-slate-700 dark:text-slate-300" style={{ fontSize: `${1.05 * fontScale}rem` }}>{chapterTree.content}</p>}
                    {chapterTree.children.map((section) => <ReadingNodeRenderer key={section.id} node={section} level={0} fontScale={fontScale} expandedSet={expandedNodeIds} scrollToId={scrollToNodeId} />)}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
        {focusMode && mode === "reading" && (chapterTree || (isIssuance && issuanceId)) && (
          <button
            onClick={() => setFocusMode(false)}
            className="fixed bottom-6 right-4 z-30 flex items-center gap-1.5 rounded-full bg-navy-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur active:bg-navy-800 dark:bg-slate-100/90 dark:text-navy-900"
          >
            <span aria-hidden>✕</span> Exit Focus
          </button>
        )}
        {!(focusMode && mode === "reading") && <BottomNav view={view} setView={setView} showAdmin={!!profile?.isAdmin} showDev={IS_DEV} />}
        {view === "quiz" && <QuizHub onExit={() => setView("browse")} />}
        {showTutorial && <TutorialOverlay onFinish={finishTutorial} />}
      </div>
    </HighlightUIContext.Provider>
  );
}
```

## File: ./frontend/src/pages/DevPanel.jsx
```
import { useState } from "react";
import QuizPanel from "./QuizPanel";
import IssuancePanel from "./IssuancePanel";
import IssuanceQuizPanel from "./IssuanceQuizPanel";

// Subject imports (CL/CDP/TL/PC/TCP) are removed from the Dev Panel for now.
// To add a tab later: add an entry to TABS and a matching render below.
const TABS = [
  { id: "ra10863", label: "RA10863" },
  { id: "issuances", label: "CMO / CAO" },
  { id: "issuance-quiz", label: "CMO/CAO Quiz" },
];

export default function DevPanel() {
  const [tab, setTab] = useState("ra10863");

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">🛠 Dev Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quiz question import &amp; preview only. This panel is stripped out of production
          builds automatically (it only renders when running{" "}
          <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">npm run dev</code>),
          so it never ships to real users on GitHub Pages.
        </p>
      </div>

      {TABS.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`min-h-[36px] rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                tab === t.id
                  ? "bg-navy-900 text-white shadow-sm dark:bg-navy-700"
                  : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {tab === "ra10863" && <QuizPanel />}
      {tab === "issuances" && <IssuancePanel />}
      {tab === "issuance-quiz" && <IssuanceQuizPanel />}
    </div>
  );
}
```

## File: ./frontend/src/pages/QuizPage.jsx
```
import { useState, useEffect } from "react";
import staticQuizData from "../data/quizData.json";
import { getFlattenedEntries } from "../quizStore";
import { LEVELS, QuizLevelButton, QuizPlayView, resetLevelProgress } from "../components/QuizShared";
import { useAuth } from "../authContext";
import { isRaLevelUnlocked } from "../access";

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
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{open ? "▾" : "▸"} {title}</p>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">📝 Quiz / Exam</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Test your knowledge with 5 levels of difficulty — from Easy to Will Done.</p>
          <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-400">Note: Level 1 is the Filipino version (free). Levels 2–5 are the English version.</p>
        </div>
        <button onClick={() => setRefreshKey((prev) => prev + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800" title="Refresh quiz data from imported files">🔄 Refresh</button>
      </div>

      {titles.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
          <p className="text-lg font-medium">No quiz data available</p>
          <p className="text-sm mt-2">Import quiz data from <strong>Dev Panel (🛠) → Quiz tab</strong>.</p>
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
```

## File: ./frontend/src/pages/QuizPanel.jsx
```
import { useState, useEffect, useCallback } from "react";
import {
  getAllQuizBatches, getQuizBatchEntries, importQuizJson,
  renameQuizBatch, deleteQuizBatch, getQuizExportAllJson,
  saveRawQuizEntries, clearAllQuizImports, getQuizImportedCount,
} from "../quizStore";
import { LEVELS, QuizLevelButton, QuizPlayView } from "../components/QuizShared";

function QuizBatchCard({ batch, onChanged }) {
  const [open, setOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const storageKey = `quiz_progress_${batch.id}`;
    try {
      setProgress(JSON.parse(localStorage.getItem(storageKey) || "{}"));
    } catch {
      setProgress({});
    }
  }, [batch.id, selectedLevel]);

  const entries = open ? getQuizBatchEntries(batch.id) : [];
  const nodeIds = entries.map((e) => e.id);
  const entriesById = Object.fromEntries(entries.map((e) => [e.id, e]));

  const handleLevelSelect = (levelId) => {
    if (nodeIds.length === 0) { alert("No quiz entries found for this batch."); return; }
    setSelectedLevel(levelId);
  };
  const handleBack = () => setSelectedLevel(null);

  const handleDeleteBatch = () => {
    if (confirm(`Delete the whole "${batch.label}" batch (${batch.nodeIds.length} entries)?`)) {
      deleteQuizBatch(batch.id);
      onChanged();
    }
  };
  const handleRename = () => {
    const next = prompt("Rename this quiz batch:", batch.label);
    if (next !== null) { renameQuizBatch(batch.id, next); onChanged(); }
  };

  if (selectedLevel) {
    return (
      <QuizPlayView
        title={batch.label}
        entries={entriesById}
        level={selectedLevel}
        onBack={handleBack}
        progressKey={batch.id}
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex items-center justify-between gap-2">
        <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{open ? "▾" : "▸"} {batch.label}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{batch.nodeIds.length} questions · {new Date(batch.importedAt).toLocaleString()}</p>
        </button>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={handleRename} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">✏️</button>
          <button onClick={handleDeleteBatch} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">Delete</button>
        </div>
      </div>
      {open && (
        <div className="space-y-2">
          {LEVELS.map((level) => (
            <QuizLevelButton key={level.id} level={level} progress={progress[level.id] || 0} onClick={() => handleLevelSelect(level.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ImportQuizForm({ onImported }) {
  const [json, setJson] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleImport = () => {
    setError(null); setSuccess(null);
    try {
      const { count, label } = importQuizJson(json);
      setSuccess(`✓ Imported ${count} questions as "${label}".`);
      setJson("");
      onImported();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-3 shadow-card dark:border-navy-700 dark:bg-slate-800">
      <p className="mb-1 text-sm font-semibold text-navy-900 dark:text-slate-100">📥 Import Quiz JSON</p>
      <p className="mb-2 text-xs text-slate-400 dark:text-slate-500">Paste the AI-generated quiz JSON and Import — one title per batch. Optional: add "_title" for a custom label (importing the same "_title" again merges into that batch).</p>
      <textarea value={json} onChange={(e) => setJson(e.target.value)} placeholder='{ "_title": "Title II", "4821": { "level1": {...}, "level2": {...}, ... } }' rows={9} style={{ fontSize: "16px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}
      <button onClick={handleImport} disabled={!json.trim()} className="mt-2 w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">Import</button>
    </div>
  );
}

function RawQuizEditor({ onChanged }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const openEditor = () => { setText(getQuizExportAllJson()); setOpen(true); setError(null); };
  const handleSave = () => {
    try {
      saveRawQuizEntries(text);
      setError(null); setSaved(true);
      onChanged();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <button onClick={() => (open ? setOpen(false) : openEditor())} className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        🔧 {open ? "Hide" : "Edit"} Raw Quiz JSON (advanced, all imported data)
      </button>
      {open && (
        <div className="mt-2">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} style={{ fontSize: "13px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          {saved && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">✓ Saved.</p>}
          <button onClick={handleSave} className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white">Save Raw JSON</button>
        </div>
      )}
    </div>
  );
}

export default function QuizPanel() {
  const [batches, setBatches] = useState([]);
  const [downloaded, setDownloaded] = useState(false);

  const refresh = useCallback(() => setBatches(getAllQuizBatches()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const handleExportAll = () => {
    const json = getQuizExportAllJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-export-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  const handleClearAll = () => {
    if (confirm(`Delete ALL ${getQuizImportedCount()} imported quiz entries? This cannot be undone.`)) {
      clearAllQuizImports();
      refresh();
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">📝 Quiz Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Import, manage, and test-drive quizzes generated from CMTA provisions.</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          When a batch is finished, use <strong>Export All</strong> and merge the JSON into
          <code className="mx-1 rounded bg-slate-100 px-1 dark:bg-slate-700">frontend/src/data/quizData.json</code>
          so it ships with the app and works offline for all users — the same way the AI explanations work.
        </p>
      </div>

      <ImportQuizForm onImported={refresh} />

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">📦 All Imported Quizzes ({getQuizImportedCount()} questions)</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportAll} className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">⬇️ Export All (download)</button>
          <button onClick={handleClearAll} className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 dark:border-red-800 dark:text-red-400">🗑 Delete All</button>
        </div>
        {downloaded && <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Downloaded JSON file.</p>}
      </div>

      <RawQuizEditor onChanged={refresh} />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Imported Quiz Batches</p>
        {batches.length === 0 && <p className="text-sm italic text-slate-400 dark:text-slate-600">No quiz batches imported yet.</p>}
        {batches.map((b) => <QuizBatchCard key={b.id} batch={b} onChanged={refresh} />)}
      </div>
    </div>
  );
}
```

## File: ./frontend/src/pages/SubjectDashboard.jsx
```
import { useState, useEffect, useCallback, useMemo } from "react";
import { ProgressCircle, answersMatch } from "../components/QuizShared";
import { useAuth } from "../authContext";
import {
  getAllEntries, getSortedItemIds, getSubjectStats,
  getSubjectProgress, saveSubjectProgress, resetSubjectProgress,
} from "../subjectQuizStore";
import { isClUnlocked, isSubjectUnlocked } from "../access";

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
      <span className="text-4xl" aria-hidden>🔒</span>
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">This item is locked</p>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
        Subscribe to unlock the remaining {subjectLabel} items.
      </p>
      <button
        onClick={onUnlock}
        className="mt-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600"
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

  if (!choices) {
    const handleSubmit = () => { if (!answered && inputValue.trim()) onAnswer(inputValue.trim()); };
    return (
      <div className="space-y-4">
        <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{item?.question || "No question available"}</p>
        <div className="flex gap-2">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} disabled={answered} placeholder="Type your answer here…" className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-navy-500 disabled:opacity-50" />
          <button onClick={handleSubmit} disabled={answered || !inputValue.trim()} className="rounded-lg bg-navy-900 px-6 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">Submit</button>
        </div>
        {answered && (
          <div className={`mt-4 rounded-lg p-4 ${answersMatch(selected, correct) ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
            <p className="font-medium text-slate-800 dark:text-slate-100">{answersMatch(selected, correct) ? "✅ Correct!" : `❌ Incorrect. The correct answer is: ${correct}`}</p>
            {reason && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reason}</p>}
          </div>
        )}
      </div>
    );
  }

  const choiceKeys = Object.keys(choices);
  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-slate-800 dark:text-slate-100">{item?.question || "No question available"}</p>
      <div className="space-y-2">
        {choiceKeys.map((key) => {
          const label = choices[key] || "";
          const isSelected = selected === key;
          const isCorrect = answered && key === correct;
          const isWrong = answered && isSelected && key !== correct;
          const choiceClass = answered
            ? isCorrect ? "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/30"
              : isWrong ? "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/30"
              : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800"
            : isSelected ? "border-navy-900 dark:border-navy-500"
              : "border-slate-200 bg-white hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-400";
          return (
            <button key={key} onClick={() => !answered && onAnswer(key)} disabled={answered} className={`block w-full rounded-xl border-2 px-4 py-3 text-left text-sm transition-colors ${choiceClass} ${!answered && "cursor-pointer"} disabled:cursor-default`}>
              <span className="font-semibold">{key}.</span> {label}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`mt-4 rounded-lg p-4 ${answersMatch(selected, correct) ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/30"}`}>
          <p className="font-medium text-slate-800 dark:text-slate-100">{answersMatch(selected, correct) ? "✅ Correct!" : `❌ Incorrect. The correct answer is: ${correct}`}</p>
          {reason && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reason}</p>}
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
        <button onClick={onBack} className="mt-3 rounded-lg border border-slate-200 px-4 py-2 text-sm dark:border-slate-600">← Back</button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">← Back</button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{subjectLabel}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{currentIndex + 1} / {total}</span>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Progress: {Math.round(progressPct)}%</span>
        <span>Score: {Math.round(scorePct)}%</span>
      </div>
      <div className="mb-3 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-700">
        <div className="h-1 rounded-full bg-gradient-to-r from-amber-400 to-navy-700 transition-all duration-300 dark:from-amber-500 dark:to-navy-400" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {itemIds.map((id, idx) => {
          const isAnsweredDot = answers[id] !== undefined && answers[id] !== null;
          const isActive = idx === currentIndex;
          const isCorrect = entries[id] && answersMatch(answers[id], entries[id].correct);
          const locked = !isItemUnlocked(idx, subjectId, profile);
          const dotColor = isAnsweredDot
            ? (isCorrect ? "bg-emerald-400 dark:bg-emerald-500" : "bg-red-400 dark:bg-red-500")
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

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
        {currentLocked ? (
          <LockedPrompt subjectLabel={subjectLabel} onUnlock={() => setOverlayOpen(true)} />
        ) : (
          <FlatQuizQuestion key={currentId} item={currentItem} onAnswer={handleAnswer} answered={isAnswered} selected={currentAnswer} />
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300">Previous</button>
        <button onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === total - 1} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 disabled:opacity-40 dark:border-slate-600 dark:text-slate-300">Next</button>
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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="mb-1 text-xl font-bold text-slate-900 dark:text-slate-50">{subjectLabel}</h2>
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
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-400 dark:bg-slate-900/40 dark:text-slate-500">Import {subjectLabel} questions in the Dev Panel first.</p>
        ) : (
          <div className="space-y-2">
            <button onClick={() => setPlaying(true)} className="w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600">
              {hasProgress ? "▶️ Continue" : "▶️ Start"}
            </button>
            {hasProgress && (
              <button onClick={handleReset} className="w-full rounded-xl border border-red-200 px-4 py-2 text-xs font-medium text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400 dark:active:bg-red-950/30">
                Reset progress
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

## File: ./frontend/src/pages/QuizHub.jsx
```
import { useState, useMemo } from "react";
import QuizPage, { loadQuizData } from "./QuizPage";
import { SubjectQuizPlay } from "./SubjectDashboard";
import CustomQuizHub from "./CustomQuizHub";
import IssuanceQuizHub from "./IssuanceQuizHub";
import { ProgressCircle, QuizPlayView } from "../components/QuizShared";
import { useAuth } from "../authContext";
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
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all dark:border-slate-700 dark:bg-slate-800 ${expanded ? "col-span-2" : ""}`}>
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left active:bg-slate-50 dark:active:bg-slate-700/50">
        <ProgressCircle progress={stats.percentAnswered} size={44} strokeWidth={5} color="#22c55e" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-navy-900 dark:text-slate-100">{label}</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">
            {stats.total > 0 ? `${stats.answeredCount}/${stats.total} answered` : "No questions"}
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

function IssuanceQuizCard({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-all active:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700/50"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-navy-700 text-lg" aria-hidden>📜</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-navy-900 dark:text-slate-100">CMO / CAO</p>
        <p className="truncate text-xs text-slate-400 dark:text-slate-500">Pick a CMO or CAO by number or title</p>
      </div>
      <span className="flex-shrink-0 text-slate-300 dark:text-slate-600" aria-hidden>→</span>
    </button>
  );
}

function RA10863Card({ expanded, onToggle, onContinue, onSelectTitle }) {
  return (
    <div className="col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all dark:border-slate-700 dark:bg-slate-800">
      <button onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left active:bg-slate-50 dark:active:bg-slate-700/50">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-navy-700 text-lg" aria-hidden>⚖️</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-navy-900 dark:text-slate-100">RA 10863</p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">5 levels · Level 1 Filipino · Levels 2–5 English</p>
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
  const { profile } = useAuth();

  const toggleCard = (id) => setExpandedCard((prev) => (prev === id ? null : id));
  const backToHub = () => setActiveView(null);

  const handlePlaySubject = (subjectId, label) => {
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
            <IssuanceQuizCard onOpen={() => setActiveView({ type: "issuance-quiz" })} />
            {["tl", "cdp", "pc", "tcp"].map((id) => (
              <SubjectCard key={id} subjectId={id} expanded={expandedCard === id} onToggle={() => toggleCard(id)} onPlay={handlePlaySubject} />
            ))}
            <button
              onClick={() => setActiveView({ type: "custom-quiz" })}
              className="col-span-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-all active:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700/50"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-600 text-lg" aria-hidden>🧩</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-navy-900 dark:text-slate-100">Your Own Quiz</p>
                <p className="truncate text-xs text-slate-400 dark:text-slate-500">Create your own subjects and questions</p>
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
```

## File: ./frontend/src/pages/SubjectQuizPanel.jsx
```
import { useState, useEffect, useCallback } from "react";
import {
  getAllBatches, getBatchEntries, importSubjectQuizJson,
  renameBatch, deleteBatch, getExportAllJson,
  saveRawEntries, clearAllImports, getImportedCount,
} from "../subjectQuizStore";

function BatchCard({ subjectId, batch, onChanged }) {
  const [open, setOpen] = useState(false);
  const entries = open ? getBatchEntries(subjectId, batch.id) : [];

  const handleDelete = () => {
    if (confirm(`Delete the "${batch.label}" batch (${batch.itemIds.length} items)?`)) {
      deleteBatch(subjectId, batch.id);
      onChanged();
    }
  };
  const handleRename = () => {
    const next = prompt("Rename this batch:", batch.label);
    if (next !== null) { renameBatch(subjectId, batch.id, next); onChanged(); }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
          <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{open ? "▾" : "▸"} {batch.label}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">{batch.itemIds.length} items · {new Date(batch.importedAt).toLocaleString()}</p>
        </button>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={handleRename} className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">✏️</button>
          <button onClick={handleDelete} className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">Delete</button>
        </div>
      </div>
      {open && (
        <div className="space-y-2">
          {entries.map((e) => (
            <div key={e.id} className="rounded-lg bg-slate-50 p-2.5 text-sm dark:bg-slate-900/40">
              <p className="font-semibold text-slate-700 dark:text-slate-200">#{e.id}: {e.question}</p>
              {e.choices && (
                <ul className="mt-1 space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {Object.entries(e.choices).map(([k, v]) => (
                    <li key={k} className={k === e.correct ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""}>{k}. {v}</li>
                  ))}
                </ul>
              )}
              {!e.choices && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Answer: {e.correct}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImportForm({ subjectId, subjectLabel, onImported }) {
  const [json, setJson] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleImport = () => {
    setError(null); setSuccess(null);
    try {
      const { count, label } = importSubjectQuizJson(subjectId, json);
      setSuccess(`✓ Imported. "${label}" batch saved — ${count} total items now for ${subjectLabel}.`);
      setJson("");
      onImported();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-3 shadow-card dark:border-navy-700 dark:bg-slate-800">
      <p className="mb-1 text-sm font-semibold text-navy-900 dark:text-slate-100">📥 Import {subjectLabel} Quiz JSON</p>
      <p className="mb-2 text-xs text-slate-400 dark:text-slate-500">
        Flat format, no levels — one entry per item number. Optional "_batch" label to
        group this import (same "_batch" name = merges, no duplicates).
      </p>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        placeholder={`{\n  "_batch": "Items 1-10",\n  "1": { "question": "...", "choices": {"A":"...","B":"...","C":"..."}, "correct": "A", "reason": "..." }\n}`}
        rows={9}
        style={{ fontSize: "16px" }}
        className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      />
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{success}</p>}
      <button onClick={handleImport} disabled={!json.trim()} className="mt-2 w-full rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">Import</button>
    </div>
  );
}

function RawEditor({ subjectId, onChanged }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const openEditor = () => { setText(getExportAllJson(subjectId)); setOpen(true); setError(null); };
  const handleSave = () => {
    try {
      saveRawEntries(subjectId, text);
      setError(null); setSaved(true);
      onChanged();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { setError(e.message); }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <button onClick={() => (open ? setOpen(false) : openEditor())} className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        🔧 {open ? "Hide" : "Edit"} Raw Quiz JSON (advanced, all imported items)
      </button>
      {open && (
        <div className="mt-2">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} style={{ fontSize: "13px" }} className="w-full rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          {saved && <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">✓ Saved.</p>}
          <button onClick={handleSave} className="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white">Save Raw JSON</button>
        </div>
      )}
    </div>
  );
}

export default function SubjectQuizPanel({ subjectId, subjectLabel }) {
  const [batches, setBatches] = useState([]);
  const [downloaded, setDownloaded] = useState(false);

  const refresh = useCallback(() => setBatches(getAllBatches(subjectId)), [subjectId]);
  useEffect(() => { refresh(); }, [refresh]);

  const handleExportAll = () => {
    const json = getExportAllJson(subjectId);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-${subjectId}-export-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  const handleClearAll = () => {
    if (confirm(`Delete ALL ${getImportedCount(subjectId)} imported ${subjectLabel} items? This cannot be undone.`)) {
      clearAllImports(subjectId);
      refresh();
    }
  };

  return (
    <div className="space-y-4">
      <ImportForm subjectId={subjectId} subjectLabel={subjectLabel} onImported={refresh} />

      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-100">📦 All Imported {subjectLabel} Items ({getImportedCount(subjectId)})</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportAll} className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">⬇️ Export All (download)</button>
          <button onClick={handleClearAll} className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-600 dark:border-red-800 dark:text-red-400">🗑 Delete All</button>
        </div>
        {downloaded && <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ Downloaded JSON file.</p>}
      </div>

      <RawEditor subjectId={subjectId} onChanged={refresh} />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Imported Batches</p>
        {batches.length === 0 && <p className="text-sm italic text-slate-400 dark:text-slate-600">No imported batches yet for {subjectLabel}.</p>}
        {batches.map((b) => <BatchCard key={b.id} subjectId={subjectId} batch={b} onChanged={refresh} />)}
      </div>
    </div>
  );
}
```

## File: ./frontend/src/pages/AdminPanel.jsx
```
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, deleteField, Timestamp, runTransaction } from "firebase/firestore";
import { db } from "../firebase";
import AdminOverview from "./AdminOverview";
import { PLANS, PAYMENT_METHODS, CL_PRICE, PROMO_PLAN } from "../payments";
import {
  ACCESS_PLANS, TRIAL_DAYS, DAY_MS, serverNow, getTrialInfo, getAppAccessInfo,
  getAccess, addMonths, formatTimeLeft, formatDateShort,
  stackAccess, computeGrant, computePromoGrant, getSubjectInfo, SUBJECT_TERM_MONTHS,
} from "../access";

const SUBJECT_CODES = ["CL", "CDP", "TL", "PC", "TCP"];
const SUBJECT_LABELS = {
  CL: "RA 10863 (CMTA)",
  ...Object.fromEntries(
    PLANS.filter((p) => p.id !== "BUNDLE" && p.id !== "ALL").map((p) => [p.id, p.label])
  ),
};
const METHOD_LABELS = Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, m.label]));
const ALL_PLAN_LABELS = Object.fromEntries([...PLANS, ...ACCESS_PLANS, PROMO_PLAN].map((p) => [p.id, p.label]));

const TRIAGE = {
  pending: { label: "Pending", dot: "bg-amber-500", chip: "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400" },
  none: { label: "None", dot: "bg-slate-400", chip: "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400" },
  subscribed: { label: "Subscribed", dot: "bg-emerald-500", chip: "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400" },
};

const STATE_UI = {
  admin: { label: "Admin", cls: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" },
  paid: { label: "App Access", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
  member: { label: "Practice buyer", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
  trial: { label: "On trial", cls: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300" },
  expired: { label: "Expired", cls: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300" },
  none: { label: "No trial yet", cls: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400" },
};

function formatDateTime(ts) {
  try {
    return new Date(ts).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function defaultTriage(userData) {
  if (userData.triageStatus) return userData.triageStatus;
  return (userData.pendingPurchases || []).length > 0 ? "pending" : "none";
}

// "none" = wala pang trial (hindi pa nagbubukas ng app mula nang ma-update).
function accessKey(u) {
  const a = getAccess(u);
  if (a.state === "expired" && !a.trial.exists) return "none";
  return a.state;
}

// RA 10863 (CL) status: "paid" = active (lifetime or not expired), "expired", or "none".
function clAccessKey(u) {
  const s = getSubjectInfo(u, "CL");
  if (!s.owned) return "none";
  return s.active ? "paid" : "expired";
}

function StateChip({ u }) {
  const key = accessKey(u);
  const a = getAccess(u);
  const ui = STATE_UI[key];
  let extra = "";
  if (key === "trial") extra = " · " + formatTimeLeft(a.msLeft);
  if (key === "paid") extra = " · " + formatTimeLeft(a.msLeft);
  return <span className={"rounded-full px-2 py-0.5 text-[11px] font-semibold " + ui.cls}>{ui.label}{extra}</span>;
}

export default function AdminPanel() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [busyKey, setBusyKey] = useState(null);
  const [tab, setTab] = useState("overview");
  const [trialFilter, setTrialFilter] = useState("all");
  const [clFilter, setClFilter] = useState("all");
  const [migMsg, setMigMsg] = useState("");

  const loadUsers = async () => {
    setError(null);
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
      list.sort((a, b) => (a.fullName || a.email || "").localeCompare(b.fullName || b.email || ""));
      setUsers(list);
    } catch (err) {
      console.warn("AdminPanel load failed:", err);
      setError(err?.message || String(err));
      setUsers([]);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      (u.fullName || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q)
    );
  }, [users, query]);

  const patchUser = (uid, patch) => {
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...patch } : u)));
  };

  // Isang lugar para sa lahat ng write: busy state + error alert + local patch.
  const run = async (key, u, payload, localPatch) => {
    setBusyKey(key);
    try {
      await updateDoc(doc(db, "users", u.uid), payload);
      patchUser(u.uid, localPatch);
    } catch (err) {
      console.warn("admin write failed:", err);
      alert("Something went wrong. Please try again:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  // ── Practice questions ──────────────────────────────────────────────
  // Manual unlock/remove. Unlocking grants the standard term (3 months, 4 for CL) from now;
  // removing clears the subject flag and its expiry.
  const toggleSubject = async (u, code) => {
    const owned = !!u.subscriptions?.[code];
    const key = u.uid + ":" + code;
    if (owned) {
      if (!window.confirm("Remove " + code + " from " + (u.fullName || u.email) + "?")) return;
      const exp = { ...(u.subscriptionExpiry || {}) };
      delete exp[code];
      await run(
        key, u,
        { ["subscriptions." + code]: false, ["subscriptionExpiry." + code]: deleteField() },
        { subscriptions: { ...u.subscriptions, [code]: false }, subscriptionExpiry: exp }
      );
      return;
    }
    const months = SUBJECT_TERM_MONTHS[code] || 3;
    if (!window.confirm("Unlock " + code + " for " + months + " months for " + (u.fullName || u.email) + "?")) return;
    const expiresAt = addMonths(serverNow(), months);
    const remaining = (u.pendingPurchases || []).filter((p) => !(p.subjects || []).includes(code));
    await run(
      key, u,
      { ["subscriptions." + code]: true, ["subscriptionExpiry." + code]: expiresAt, pendingPurchases: remaining },
      { subscriptions: { ...u.subscriptions, [code]: true }, subscriptionExpiry: { ...(u.subscriptionExpiry || {}), [code]: expiresAt }, pendingPurchases: remaining }
    );
  };

  // Admin extension: +N months on an expiring subject. Lifetime subjects are never touched.
  const extendSubject = async (u, code, months) => {
    const s = getSubjectInfo(u, code);
    if (!s.owned || s.lifetime) return;
    const expiresAt = addMonths(s.active ? s.expiresAt : serverNow(), months);
    await run(
      u.uid + ":" + code, u,
      { ["subscriptionExpiry." + code]: expiresAt },
      { subscriptionExpiry: { ...(u.subscriptionExpiry || {}), [code]: expiresAt } }
    );
  };

  const setTriage = (u, status) =>
    run(u.uid + ":triage", u, { triageStatus: status }, { triageStatus: status });

  const approvePractice = async (u, p) => {
    const plan = PLANS.find((x) => x.id === p.plan) || (p.plan === PROMO_PLAN.id ? PROMO_PLAN : undefined);
    const diff = plan && plan.price !== p.price ? "⚠️ Price mismatch: the user paid ₱" + p.price + " but the plan is now ₱" + plan.price + " (older app version). " : "";
    if (!window.confirm(diff + "Approve " + (ALL_PLAN_LABELS[p.plan] || p.plan) + " ₱" + p.price + " for " + (u.fullName || u.email) + "?")) return;
    const ref = doc(db, "users", u.uid);
    setBusyKey(u.uid + ":pp:" + p.referenceCode);
    try {
      // One atomic transaction: it reads the latest doc, so a grant can never be doubled.
      const res = await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error("User document no longer exists.");
        const d = snap.data();
        const done = (d.paymentHistory || []).some((h) => h.referenceCode === p.referenceCode);
        const pending = (d.pendingPurchases || []).some((x) => x.referenceCode === p.referenceCode);
        if (done || !pending) return null;
        const now = serverNow();
        const subjects = p.subjects || (plan ? plan.subjects : []);
        const term = plan ? plan.months : (subjects.length === 1 ? (SUBJECT_TERM_MONTHS[subjects[0]] || 3) : 6);
        const isPromo = !!plan && plan.kind === "promo";
        const g = isPromo ? computePromoGrant(d, plan, now) : computeGrant(d, { subjects, months: term }, now);
        const remaining = (d.pendingPurchases || []).filter((x) => x.referenceCode !== p.referenceCode);
        const upd = {
          pendingPurchases: remaining,
          triageStatus: "subscribed",
          paymentHistory: arrayUnion({ kind: "practice", plan: p.plan, price: p.price, method: p.method, referenceCode: p.referenceCode, approvedAt: now, months: term, ...(isPromo ? { days: plan.days } : {}) }),
        };
        const subsPatch = {};
        const expPatch = { ...(d.subscriptionExpiry || {}) };
        subjects.forEach((c) => { upd["subscriptions." + c] = true; subsPatch[c] = true; });
        Object.keys(g.subjectExpiry).forEach((c) => {
          upd["subscriptionExpiry." + c] = g.subjectExpiry[c];
          expPatch[c] = g.subjectExpiry[c];
        });
        const patch = {
          pendingPurchases: remaining,
          triageStatus: "subscribed",
          subscriptions: { ...(d.subscriptions || {}), ...subsPatch },
          subscriptionExpiry: expPatch,
        };
        if (g.appExpiresAt) {
          upd.appAccess = { plan: p.plan, expiresAt: g.appExpiresAt };
          upd.appAccessHistory = arrayUnion({ plan: p.plan, price: 0, referenceCode: p.referenceCode, method: "practice-purchase", approvedAt: now, expiresAt: g.appExpiresAt, months: term + g.bonusMonths, ...(isPromo ? { days: plan.days } : {}) });
          patch.appAccess = upd.appAccess;
        }
        if (g.bonusFlag) {
          upd["bonuses.threeSubjects"] = now;
          patch.bonuses = { ...(d.bonuses || {}), threeSubjects: now };
        }
        tx.update(ref, upd);
        return patch;
      });
      if (res) patchUser(u.uid, res);
      else { alert("Already approved or no longer pending (ref " + p.referenceCode + "). Nothing was changed."); await loadUsers(); }
    } catch (err) {
      console.warn("approvePractice failed:", err);
      alert("Something went wrong. Please try again:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  const rejectPractice = async (u, p) => {
    if (!window.confirm("Remove this pending request (ref " + p.referenceCode + ")?")) return;
    const remaining = (u.pendingPurchases || []).filter((x) => x.referenceCode !== p.referenceCode);
    await run(u.uid + ":pp:" + p.referenceCode, u, { pendingPurchases: remaining }, { pendingPurchases: remaining });
  };

  // ── App Access (buwanang plan) ──────────────────────────────────────
  // Kapag may active pa, dinadagdag sa dulo ng natitirang oras (hindi nasasayang).
  const grantAccess = async (u, plan, pendingItem) => {
    const now = serverNow();
    const expiresAt = stackAccess(u, plan.months, now);
    const appAccess = { plan: plan.id, expiresAt };
    const payload = {
      appAccess,
      appAccessHistory: arrayUnion({ plan: plan.id, price: plan.price, referenceCode: pendingItem ? pendingItem.referenceCode : "MANUAL", method: pendingItem ? pendingItem.method : "manual", approvedAt: now, expiresAt }),
    };
    const patch = { appAccess };
    if (pendingItem) {
      const remaining = (u.pendingAccess || []).filter((x) => x.referenceCode !== pendingItem.referenceCode);
      payload.pendingAccess = remaining;
      patch.pendingAccess = remaining;
    }
    await run(u.uid + ":acc", u, payload, patch);
  };

  const approveAccess = async (u, p) => {
    const plan = ACCESS_PLANS.find((x) => x.id === p.plan);
    if (!plan) { alert("Unknown plan: " + p.plan); return; }
    const diff = plan.price !== p.price ? "⚠️ Price mismatch: the user paid ₱" + p.price + " but the plan is now ₱" + plan.price + ". " : "";
    if (!window.confirm(diff + "Approve " + plan.months + " month(s) (₱" + plan.price + ") for " + (u.fullName || u.email) + "?")) return;
    await grantAccess(u, plan, p);
  };

  const manualGrant = async (u, plan) => {
    if (!window.confirm("Give " + (u.fullName || u.email) + " " + plan.months + " month(s) of App Access?")) return;
    await grantAccess(u, plan, null);
  };

  const removeAccess = async (u) => {
    if (!window.confirm("Remove App Access for " + (u.fullName || u.email) + "?")) return;
    await run(u.uid + ":acc", u, { appAccess: deleteField() }, { appAccess: undefined });
  };

  const rejectAccess = async (u, p) => {
    if (!window.confirm("Remove this pending request (ref " + p.referenceCode + ")?")) return;
    const remaining = (u.pendingAccess || []).filter((x) => x.referenceCode !== p.referenceCode);
    await run(u.uid + ":acc:" + p.referenceCode, u, { pendingAccess: remaining }, { pendingAccess: remaining });
  };

  // ── Trial CRUD ──────────────────────────────────────────────────────
  // Laging nire-reset ang startedAt sa "ngayon" at inaayos ang `days` para
  // tama ang natitirang oras. Oras ng server (serverNow), hindi ng phone.
  const writeTrial = (u, days) => {
    const startedAt = serverNow();
    return run(u.uid + ":trial", u, { trial: { startedAt: Timestamp.fromMillis(startedAt), days } }, { trial: { startedAt, days } });
  };

  const grantTrial = (u) => {
    if (!window.confirm("Restart the " + TRIAL_DAYS + "-day trial for " + (u.fullName || u.email) + " from now?")) return;
    return writeTrial(u, TRIAL_DAYS);
  };

  const extendTrial = (u, extraDays) => {
    const left = getTrialInfo(u).msLeft / DAY_MS;
    return writeTrial(u, left + extraDays);
  };

  const endTrial = (u) => {
    if (!window.confirm("End the trial for " + (u.fullName || u.email) + " now?")) return;
    return writeTrial(u, 0);
  };

  // (The RA 10863 free trial is retired. Level 1 is free for everyone instead.)

  // ── Derived lists ───────────────────────────────────────────────────
  const practicePending = useMemo(() => {
    const rows = [];
    filtered.forEach((u) => (u.pendingPurchases || []).forEach((p) => rows.push({ u, p })));
    return rows.sort((a, b) => (a.p.requestedAt || 0) - (b.p.requestedAt || 0));
  }, [filtered]);

  const accessPending = useMemo(() => {
    const rows = [];
    filtered.forEach((u) => (u.pendingAccess || []).forEach((p) => rows.push({ u, p })));
    return rows.sort((a, b) => (a.p.requestedAt || 0) - (b.p.requestedAt || 0));
  }, [filtered]);

  const activeSubscribers = useMemo(
    () =>
      filtered
        .filter((u) => getAppAccessInfo(u).exists)
        .sort((a, b) => getAppAccessInfo(a).expiresAt - getAppAccessInfo(b).expiresAt),
    [filtered, users]
  );

  const trialRows = useMemo(() => {
    return filtered.filter((u) => {
      const k = accessKey(u);
      if (trialFilter === "all") return true;
      if (trialFilter === "trial") return k === "trial";
      if (trialFilter === "expired") return k === "expired";
      if (trialFilter === "none") return k === "none";
      if (trialFilter === "paid") return k === "paid" || k === "member" || k === "admin";
      return true;
    });
  }, [filtered, trialFilter, users]);

  const clRows = useMemo(() => {
    return filtered.filter((u) => {
      const k = clAccessKey(u);
      if (clFilter === "all") return true;
      return k === clFilter;
    });
  }, [filtered, clFilter, users]);

  const rawPracticeCount = (users || []).reduce((n, u) => n + (u.pendingPurchases || []).length, 0);
  const rawAccessCount = (users || []).reduce((n, u) => n + (u.pendingAccess || []).length, 0);

  // Users whose App Access or any subject ends within 7 days.
  // Computed from the users already loaded, so it costs no extra Firestore reads.
  const expiringRows = useMemo(() => {
    const now = serverNow();
    const rows = [];
    filtered.forEach((u) => {
      if (u.isAdmin) return;
      const items = [];
      const app = getAppAccessInfo(u, now);
      if (app.active && app.msLeft <= 7 * DAY_MS) items.push({ label: "App Access", endsAt: app.expiresAt });
      SUBJECT_CODES.forEach((c) => {
        const s = getSubjectInfo(u, c, now);
        if (s.active && !s.lifetime && s.msLeft <= 7 * DAY_MS) items.push({ label: c, endsAt: s.expiresAt });
      });
      if (items.length) rows.push({ u, items, soonest: Math.min(...items.map((i) => i.endsAt)) });
    });
    return rows.sort((a, b) => a.soonest - b.soonest);
  }, [filtered, users]);

  const copyReminder = async (u, items) => {
    const first = (u.fullName || "there").split(" ")[0];
    const parts = items.map((i) => i.label + " (" + formatDateShort(i.endsAt) + ")").join(", ");
    const text = "Hi " + first + "! Your CuBLE access is ending soon: " + parts + ". You can renew anytime from your Profile. If you renew early, your remaining days are kept. Thank you!";
    try {
      await navigator.clipboard.writeText(text);
      alert("Reminder copied. Paste it into Messenger or SMS.");
    } catch (_) {
      window.prompt("Copy this message:", text);
    }
  };

  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "users", label: "👥 Users" },
    { id: "practice", label: "💳 Practice", count: rawPracticeCount },
    { id: "access", label: "⏱ Access", count: rawAccessCount },
    { id: "expiring", label: "⏳ Expiring", count: expiringRows.length },
    { id: "trial", label: "🎁 Trial" },
    { id: "cl", label: "📜 RA 10863" },
  ];

  const btn = "min-h-[34px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ";
  const btnGhost = btn + "border border-slate-200 text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700";
  const btnGreen = btn + "bg-emerald-600 text-white active:bg-emerald-700";
  const btnRed = btn + "border border-red-200 text-red-600 active:bg-red-50 dark:border-red-800 dark:text-red-400";

  const PendingCard = ({ u, p, onApprove, onReject, approveLabel }) => (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
      <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
      <p className="truncate text-xs text-slate-400">{u.email}</p>
      <p className="mt-2 text-sm font-semibold text-navy-900 dark:text-amber-300">
        {ALL_PLAN_LABELS[p.plan] || p.plan} · ₱{p.price} · {METHOD_LABELS[p.method] || p.method}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">Ref: {p.referenceCode} · {formatDateTime(p.requestedAt)}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={onApprove} disabled={!!busyKey} className={btnGreen}>{approveLabel}</button>
        <button onClick={onReject} disabled={!!busyKey} className={btnRed}>✕ Reject</button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-slate-50">👑 Admin Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Practice Questions and App Access have separate pending lists, and Trial has its own panel.
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={"flex-shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors " + (tab === t.id ? "border-navy-900 bg-navy-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300")}
          >
            {t.label}
            {t.count > 0 && <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{t.count}</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or email..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          onClick={loadUsers}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-500 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:active:bg-slate-700"
          aria-label="Refresh"
        >
          ⟳
        </button>
      </div>

      {users === null && <p className="py-8 text-center text-slate-400">Loading users...</p>}

      {tab === "overview" && users !== null && !error && <AdminOverview users={users} />}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          <p className="font-bold">⚠️ Unable to load users</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* ───────────── USERS ───────────── */}


      {tab === "users" && users !== null && !error && (
        <div className="space-y-3">
          {filtered.length === 0 && <p className="py-8 text-center text-slate-400">No users found.</p>}
          {filtered.map((u) => {
            const triage = defaultTriage(u);
            const t = TRIAGE[triage] || TRIAGE.none;
            const app = getAppAccessInfo(u);
            return (
              <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={"flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold " + t.chip}>
                    <span className={"h-2 w-2 rounded-full " + t.dot} aria-hidden />
                    {t.label}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {SUBJECT_CODES.map((code) => {
                    const si = getSubjectInfo(u, code);
                    const busy = busyKey === u.uid + ":" + code;
                    const tone = si.active
                      ? "bg-emerald-600 text-white active:bg-emerald-700 "
                      : si.owned
                        ? "bg-amber-100 text-amber-800 active:bg-amber-200 dark:bg-amber-950/40 dark:text-amber-300 "
                        : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-900/40 dark:text-slate-300 ";
                    return (
                      <button
                        key={code}
                        onClick={() => toggleSubject(u, code)}
                        disabled={busy}
                        title={SUBJECT_LABELS[code]}
                        className={btn + tone}
                      >
                        {code} {si.active ? (si.lifetime ? "∞" : "✓") : si.owned ? "⏳" : "✕"}
                      </button>
                    );
                  })}
                </div>

                {SUBJECT_CODES.some((c) => u.subscriptions?.[c]) && (
                  <div className="mt-2 space-y-1">
                    {SUBJECT_CODES.filter((c) => u.subscriptions?.[c]).map((c) => {
                      const si = getSubjectInfo(u, c);
                      return (
                        <div key={c} className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{c} · {si.lifetime ? "Lifetime" : (si.active ? "until " : "expired ") + formatDateShort(si.expiresAt)}</span>
                          {!si.lifetime && (
                            <button onClick={() => extendSubject(u, c, 1)} disabled={busyKey === u.uid + ":" + c} className={btnGhost}>+1 mo</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-3 flex gap-1.5">
                  {Object.entries(TRIAGE).map(([status, cfg]) => (
                    <button
                      key={status}
                      onClick={() => setTriage(u, status)}
                      disabled={busyKey === u.uid + ":triage"}
                      className={"flex-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors disabled:opacity-50 " + (triage === status ? cfg.chip + " bg-slate-50 dark:bg-slate-900/40" : "border-slate-200 text-slate-400 dark:border-slate-700")}
                    >
                      {cfg.label}
                    </button>
                  ))}
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-700">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">App Access</p>
                    <StateChip u={u} />
                  </div>
                  {app.exists && (
                    <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                      {app.active ? "Until " : "Ended on "}{formatDateShort(app.expiresAt)}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {ACCESS_PLANS.map((p) => (
                      <button key={p.id} onClick={() => manualGrant(u, p)} disabled={busyKey === u.uid + ":acc"} className={btnGhost}>+{p.months} mo</button>
                    ))}
                    {app.exists && <button onClick={() => removeAccess(u)} disabled={busyKey === u.uid + ":acc"} className={btnRed}>Remove</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── PRACTICE PENDING ───────────── */}
      {tab === "practice" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-navy-900 dark:text-slate-100">💳 Pending — Practice Questions ({practicePending.length})</p>
          {practicePending.length === 0 && <p className="py-8 text-center text-slate-400">No pending practice payments. 🎉</p>}
          {practicePending.map(({ u, p }) => (
            <PendingCard
              key={u.uid + p.referenceCode}
              u={u}
              p={p}
              approveLabel="✅ Approve"
              onApprove={() => approvePractice(u, p)}
              onReject={() => rejectPractice(u, p)}
            />
          ))}
        </div>
      )}

      {/* ───────────── ACCESS PENDING ───────────── */}
      {tab === "access" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-navy-900 dark:text-slate-100">⏱ Pending — App Access ({accessPending.length})</p>
          {accessPending.length === 0 && <p className="py-6 text-center text-slate-400">No pending App Access payments. 🎉</p>}
          {accessPending.map(({ u, p }) => {
            const plan = ACCESS_PLANS.find((x) => x.id === p.plan);
            return (
              <PendingCard
                key={u.uid + p.referenceCode}
                u={u}
                p={p}
                approveLabel={"✅ Approve " + (plan ? plan.months + " mo" : "")}
                onApprove={() => approveAccess(u, p)}
                onReject={() => rejectAccess(u, p)}
              />
            );
          })}

          <p className="pt-3 text-sm font-semibold text-navy-900 dark:text-slate-100">Active App Access ({activeSubscribers.length})</p>
          {activeSubscribers.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No one has App Access yet.</p>}
          {activeSubscribers.map((u) => {
            const app = getAppAccessInfo(u);
            return (
              <div key={u.uid} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || u.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {app.active ? formatTimeLeft(app.msLeft) + " left · until " : "Ended on "}{formatDateShort(app.expiresAt)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-1.5">
                  <button onClick={() => manualGrant(u, ACCESS_PLANS[0])} disabled={busyKey === u.uid + ":acc"} className={btnGhost}>+1 mo</button>
                  <button onClick={() => removeAccess(u)} disabled={busyKey === u.uid + ":acc"} className={btnRed}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── TRIAL CRUD ───────────── */}
      {tab === "trial" && users !== null && !error && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {[["all", "All"], ["trial", "On trial"], ["expired", "Expired"], ["none", "No trial yet"], ["paid", "Paid/Member"]].map(([id, label]) => (
              <button key={id} onClick={() => setTrialFilter(id)} className={"rounded-full border px-3 py-1 text-xs font-semibold " + (trialFilter === id ? "border-navy-900 bg-navy-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400")}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">{trialRows.length} user(s)</p>

          {trialRows.map((u) => {
            const tr = getTrialInfo(u);
            return (
              <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <StateChip u={u} />
                </div>
                {tr.exists && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {tr.active ? "Trial until " : "Trial ended on "}{formatDateTime(tr.endsAt)}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <button onClick={() => grantTrial(u)} disabled={busyKey === u.uid + ":trial"} className={btnGreen}>{tr.exists ? "↺ Restart " + TRIAL_DAYS + "d" : "＋ Grant " + TRIAL_DAYS + "d"}</button>
                  <button onClick={() => extendTrial(u, 1)} disabled={busyKey === u.uid + ":trial"} className={btnGhost}>+1 day</button>
                  <button onClick={() => extendTrial(u, 3)} disabled={busyKey === u.uid + ":trial"} className={btnGhost}>+3 days</button>
                  {tr.exists && tr.active && <button onClick={() => endTrial(u)} disabled={busyKey === u.uid + ":trial"} className={btnRed}>End</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── RA 10863 (CL) + EXPIRING ───────────── */}
      {tab === "cl" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Level 1 is free for everyone. Levels 2–5 unlock with RA 10863 (₱{CL_PRICE}, 4 months). Old lifetime owners stay unlocked.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[["all", "All"], ["paid", "Unlocked"], ["expired", "Expired"], ["none", "Not purchased"]].map(([id, label]) => (
              <button key={id} onClick={() => setClFilter(id)} className={"rounded-full border px-3 py-1 text-xs font-semibold " + (clFilter === id ? "border-navy-900 bg-navy-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-navy-900" : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400")}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400">{clRows.length} user(s)</p>

          {clRows.map((u) => {
            const cs = getSubjectInfo(u, "CL");
            return (
              <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
                    <p className="truncate text-xs text-slate-400">{u.email}</p>
                  </div>
                  <span className={"rounded-full px-2 py-0.5 text-[11px] font-semibold " + (cs.active ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300" : cs.owned ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400")}>
                    {cs.active ? (cs.lifetime ? "♾️ Lifetime" : "👑 Active") : cs.owned ? "⏳ Expired" : "Not purchased"}
                  </span>
                </div>
                {cs.owned && !cs.lifetime && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    {cs.active ? "Active until " : "Expired on "}{formatDateTime(cs.expiresAt)}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {!cs.owned && <button onClick={() => toggleSubject(u, "CL")} disabled={busyKey === u.uid + ":CL"} className={btnGhost + " border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300"}>👑 Unlock CL (4 mo)</button>}
                  {cs.owned && !cs.lifetime && <button onClick={() => extendSubject(u, "CL", 1)} disabled={busyKey === u.uid + ":CL"} className={btnGhost}>+1 mo</button>}
                  {cs.owned && <button onClick={() => toggleSubject(u, "CL")} disabled={busyKey === u.uid + ":CL"} className={btnRed}>Remove</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── EXPIRING SOON ───────────── */}
      {tab === "expiring" && users !== null && !error && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            App Access or subjects ending within 7 days. Tap “Copy reminder” and paste it into Messenger or SMS.
          </p>
          {expiringRows.length === 0 && <p className="py-8 text-center text-slate-400">Nobody is expiring in the next 7 days. 🎉</p>}
          {expiringRows.map(({ u, items }) => (
            <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
              <p className="truncate text-sm font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(no name)"}</p>
              <p className="truncate text-xs text-slate-400">{u.email}</p>
              <ul className="mt-2 space-y-0.5 text-xs text-slate-500 dark:text-slate-400">
                {items.map((i) => (
                  <li key={i.label}>{i.label} · ends {formatDateShort(i.endsAt)} ({formatTimeLeft(i.endsAt - serverNow())} left)</li>
                ))}
              </ul>
              <button onClick={() => copyReminder(u, items)} className={btnGreen + " mt-2"}>📋 Copy reminder</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## File: ./frontend/src/pages/AdminOverview.jsx
```
import { useMemo, useState } from "react";
import { PLANS } from "../payments";
import { getAccess, serverNow, toMs, DAY_MS, getSubjectInfo } from "../access";

// Admin Overview — read-only dashboard. Walang bagong Firestore read/write:
// kino-compute lang mula sa `users` array na na-load na ng AdminPanel.
// Share mode = para sa screenshot (FB post). Naka-mask ang email, nakatago
// ang pending payments, at (optional) ang revenue.

const APP_NAME = "CuBLE";
const SUBJECT_CODES = ["CL", "TL", "CDP", "PC", "TCP"];
const CHART_DAYS = 14;

const STATUS_ROWS = [
  { key: "paid", label: "Paid access", light: "bg-gold-500", dark: "dark:bg-gold-400" },
  { key: "trial", label: "On free trial", light: "bg-navy-700", dark: "dark:bg-sky-400" },
  { key: "expired", label: "Trial or access ended", light: "bg-slate-400", dark: "dark:bg-slate-500" },
  { key: "none", label: "No trial yet", light: "bg-slate-300", dark: "dark:bg-slate-600" },
];

// os****68@gmail.com — unang 2 + huling 2 ng pangalan sa email, kita ang domain.
export function maskEmail(email) {
  if (!email || email.indexOf("@") < 1) return email || "";
  const at = email.lastIndexOf("@");
  const local = email.slice(0, at);
  const domain = email.slice(at);
  if (local.length <= 4) return local.slice(0, 1) + "****" + domain;
  return local.slice(0, 2) + "****" + local.slice(-2) + domain;
}

function accessKey(u) {
  const a = getAccess(u);
  if (a.state === "expired" && !a.trial.exists) return "none";
  return a.state;
}

function dayKey(d) {
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}

function shortDate(ms) {
  try {
    return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch (_) {
    return "";
  }
}

function compute(users) {
  const now = serverNow();
  const members = users.filter((u) => !u.isAdmin);

  const days = [];
  const dayIndex = {};
  for (let i = CHART_DAYS - 1; i >= 0; i--) {
    const d = new Date(now - i * DAY_MS);
    dayIndex[dayKey(d)] = days.length;
    days.push({ ms: d.getTime(), count: 0 });
  }

  const status = { paid: 0, trial: 0, expired: 0, none: 0 };
  const subjects = {};
  SUBJECT_CODES.forEach((c) => { subjects[c] = 0; });

  let active7 = 0, new7 = 0, new30 = 0, revenue = 0, payers = 0;

  members.forEach((u) => {
    const seen = toMs(u.lastSeenAt);
    if (seen && now - seen <= 7 * DAY_MS) active7++;

    const created = toMs(u.createdAt);
    if (created) {
      const age = now - created;
      if (age <= 7 * DAY_MS) new7++;
      if (age <= 30 * DAY_MS) new30++;
      const k = dayKey(new Date(created));
      if (k in dayIndex) days[dayIndex[k]].count++;
    }

    const key = accessKey(u);
    if (key === "paid" || key === "member") status.paid++;
    else if (key === "trial") status.trial++;
    else if (key === "expired") status.expired++;
    else status.none++;

    // Count only ACTIVE subjects (expired ones no longer count as subscribed).
    SUBJECT_CODES.forEach((c) => { if (getSubjectInfo(u, c, now).active) subjects[c]++; });

    // Revenue: bayad lang (price > 0). Hindi kasama ang manual grant / migration.
    let spent = 0;
    [].concat(u.paymentHistory || [], u.appAccessHistory || []).forEach((h) => {
      const p = Number(h && h.price) || 0;
      if (p > 0 && h.method !== "manual") spent += p;
    });
    if (spent > 0) { revenue += spent; payers++; }
  });

  const recent = members
    .map((u) => ({ u, created: toMs(u.createdAt) }))
    .filter((r) => r.created)
    .sort((a, b) => b.created - a.created)
    .slice(0, 5);

  const pendingPractice = users.reduce((n, u) => n + (u.pendingPurchases || []).length, 0);
  const pendingAccess = users.reduce((n, u) => n + (u.pendingAccess || []).length, 0);

  return {
    now, total: members.length, active7, new7, new30, status, subjects,
    days, revenue, payers, recent, pendingPractice, pendingAccess,
  };
}

function Bar({ label, sub, value, max, barClass, trackClass, labelClass }) {
  const pct = max > 0 && value > 0 ? Math.max(3, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
        <span className={"min-w-0 truncate " + labelClass}>
          {label}
          {sub && <span className="ml-1.5 text-xs opacity-60">{sub}</span>}
        </span>
        <span className="flex-shrink-0 font-semibold tabular-nums">{value}</span>
      </div>
      <div className={"h-2.5 w-full overflow-hidden rounded-full " + trackClass}>
        <div className={"h-full rounded-full " + barClass} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

export default function AdminOverview({ users }) {
  const [share, setShare] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const s = useMemo(() => compute(users), [users]);

  // Sa share mode, light theme lang (malinis sa screenshot kahit dark ang app).
  const t = (light, dark) => (share ? light : light + " " + dark);

  const revenueVisible = !share || showRevenue;
  const maxStatus = Math.max(1, ...Object.values(s.status));
  const maxSubject = Math.max(1, ...Object.values(s.subjects));
  const maxDay = Math.max(1, ...s.days.map((d) => d.count));
  const payRate = s.total > 0 ? Math.round((s.payers / s.total) * 100) : 0;

  const track = t("bg-slate-100", "dark:bg-slate-700");
  const labelCls = t("text-slate-700", "dark:text-slate-300");
  const barNavy = t("bg-navy-700", "dark:bg-sky-400");
  const muted = t("text-slate-500", "dark:text-slate-400");
  const asOf = new Date(s.now).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });

  const switchBtn = (on) =>
    "relative h-6 w-11 flex-shrink-0 rounded-full transition-colors " +
    (on ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600");
  const switchKnob = (on) =>
    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all " + (on ? "left-[22px]" : "left-0.5");

  return (
    <div className="space-y-3">
      {/* Controls (labas ng card — hindi kasama sa screenshot) */}
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy-900 dark:text-slate-100">Share mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {share
                ? "Emails are masked and pending items are hidden. Screenshot the card below."
                : "Off: full names, emails, and pending items are visible (for you only)."}
            </p>
          </div>
          <button onClick={() => setShare(!share)} className={switchBtn(share)} role="switch" aria-checked={share} aria-label="Share mode">
            <span className={switchKnob(share)} />
          </button>
        </div>
        {share && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-300">Show revenue</p>
            <button onClick={() => setShowRevenue(!showRevenue)} className={switchBtn(showRevenue)} role="switch" aria-checked={showRevenue} aria-label="Show revenue">
              <span className={switchKnob(showRevenue)} />
            </button>
          </div>
        )}
      </div>

      {/* Report card (ito ang i-screenshot) */}
      <div className={"overflow-hidden rounded-2xl border " + t("border-slate-200 bg-white text-slate-900", "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100")}>
        <div className="h-1.5 bg-gold-500" />
        <div className="space-y-6 p-5">
          <div>
            <h2 className={"font-serif text-xl font-bold " + t("text-navy-900", "dark:text-slate-50")}>{APP_NAME} user overview</h2>
            <p className={"text-xs " + muted}>As of {asOf}</p>
          </div>

          {/* Headline numbers */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            {[
              ["Total users", s.total],
              ["Active in 7 days", s.active7],
              ["New this week", s.new7],
              ["New in 30 days", s.new30],
            ].map(([label, value]) => (
              <div key={label}>
                <p className={"font-serif text-3xl font-bold tabular-nums " + t("text-navy-900", "dark:text-slate-50")}>{value}</p>
                <p className={"text-sm " + muted}>{label}</p>
              </div>
            ))}
          </div>

          {/* Access status */}
          <div className="space-y-3">
            <p className={"text-sm font-semibold " + t("text-navy-900", "dark:text-slate-100")}>Access status</p>
            {STATUS_ROWS.map((r) => (
              <Bar
                key={r.key}
                label={r.label}
                value={s.status[r.key]}
                max={maxStatus}
                barClass={t(r.light, r.dark)}
                trackClass={track}
                labelClass={labelCls}
              />
            ))}
          </div>

          {/* Subscribers per subject */}
          <div className="space-y-3">
            <p className={"text-sm font-semibold " + t("text-navy-900", "dark:text-slate-100")}>Practice subscribers per subject</p>
            {SUBJECT_CODES.map((code) => {
              const plan = PLANS.find((p) => p.id === code);
              return (
                <Bar
                  key={code}
                  label={code}
                  sub={plan ? plan.label : ""}
                  value={s.subjects[code]}
                  max={maxSubject}
                  barClass={barNavy}
                  trackClass={track}
                  labelClass={labelCls + " font-medium"}
                />
              );
            })}
          </div>

          {/* Sign-ups growth */}
          <div>
            <p className={"mb-3 text-sm font-semibold " + t("text-navy-900", "dark:text-slate-100")}>New sign-ups, last {CHART_DAYS} days</p>
            <div className="flex h-24 items-end gap-1">
              {s.days.map((d) => (
                <div key={d.ms} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-0.5">
                  {d.count > 0 && <span className={"text-[10px] font-semibold tabular-nums " + muted}>{d.count}</span>}
                  <div
                    className={"w-full rounded-t " + (d.count > 0 ? barNavy : t("bg-slate-200", "dark:bg-slate-700"))}
                    style={{ height: d.count > 0 ? Math.max(6, Math.round((d.count / maxDay) * 100)) + "%" : "3px" }}
                  />
                </div>
              ))}
            </div>
            <div className={"mt-1.5 flex justify-between text-[11px] " + muted}>
              <span>{shortDate(s.days[0].ms)}</span>
              <span>{shortDate(s.days[s.days.length - 1].ms)}</span>
            </div>
          </div>

          {/* Revenue (optional sa share mode) */}
          {revenueVisible && (
            <div className={"rounded-xl border p-4 " + t("border-gold-100 bg-gold-50", "dark:border-slate-700 dark:bg-slate-800")}>
              <p className={"text-sm " + muted}>Estimated revenue</p>
              <p className={"font-serif text-3xl font-bold tabular-nums " + t("text-navy-900", "dark:text-slate-50")}>
                ₱{s.revenue.toLocaleString()}
              </p>
              <p className={"mt-1 text-xs " + muted}>
                {s.payers} paying user{s.payers === 1 ? "" : "s"} · {payRate}% of all users
              </p>
            </div>
          )}

          {/* Recent sign-ups */}
          {s.recent.length > 0 && (
            <div>
              <p className={"mb-2 text-sm font-semibold " + t("text-navy-900", "dark:text-slate-100")}>Recent sign-ups</p>
              <ul className={"divide-y " + t("divide-slate-100", "dark:divide-slate-700")}>
                {s.recent.map(({ u, created }) => (
                  <li key={u.uid} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.fullName || "(no name)"}</p>
                      <p className={"truncate text-xs " + muted}>{share ? maskEmail(u.email) : u.email}</p>
                    </div>
                    <span className={"flex-shrink-0 text-xs " + muted}>{shortDate(created)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pending — admin lang, hindi lalabas sa share mode */}
          {!share && (s.pendingPractice > 0 || s.pendingAccess > 0) && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
              ⏳ Pending approvals: {s.pendingPractice} practice · {s.pendingAccess} access
            </div>
          )}

          <p className={"border-t pt-3 text-[11px] " + t("border-slate-100 text-slate-400", "dark:border-slate-700 dark:text-slate-500")}>
            Counts come from the app's actual user records. Admin accounts are excluded.
          </p>
        </div>
      </div>
    </div>
  );
}
```

## File: ./frontend/src/pages/CustomQuizHub.jsx
```
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
          ➕ Add to list
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mt-4">
          <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Ready to save ({pending.length})</p>
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
            💾 Save All ({pending.length})
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
    <div className={`overflow-hidden rounded-2xl border transition-all ${theme.card} ${expanded ? "col-span-2" : ""}`}>
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
        <p className={`mb-4 text-sm ${theme.subtext}`}>Create your own subjects and questions — always saved on your device.</p>

        <div className="mb-4 space-y-2">
          <OnOffToggle
            label="🎲 Random Choices"
            description="Randomizes the answer letters and question order every time you take the quiz"
            checked={settings.randomChoices}
            onChange={(v) => updateSetting("randomChoices", v)}
          />
          <OnOffToggle
            label="⏱️ Timer"
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
          <div className={`flex flex-col items-center gap-3 rounded-2xl border border-dashed p-8 text-center ${theme.card}`}>
            <span className="text-4xl" aria-hidden>🧩</span>
            <p className={`text-sm font-medium ${theme.text}`}>You don't have any subjects yet.</p>
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
```

## File: ./frontend/src/pages/CustomQuizManage.jsx
```
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
        placeholder="Type the question here…"
        className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-navy-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-navy-500"
      />

      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Choices (A and B required, C/D optional)</label>
      <div className="mb-3 space-y-2">
        {["A", "B", "C", "D"].map((k) => (
          <div key={k} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => form[k].trim() && setField("correct", k)}
              title={form[k].trim() ? "Mark as the correct answer" : ""}
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
      <p className={`mb-3 text-xs ${theme.subtext}`}>👆 Tap a letter to mark it as the correct answer. Currently correct: <strong>{form.correct}</strong></p>

      <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${theme.subtext}`}>Reason (why the answer is correct)</label>
      <textarea
        value={form.reason}
        onChange={(e) => setField("reason", e.target.value)}
        rows={2}
        placeholder={`Because ${form.correct} is…`}
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
    if (!confirm(`Delete question #${id}? This cannot be undone.`)) return;
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
          ➕ Add Question
        </button>
      )}

      {formOpen && <QuestionForm key={editingId || "new"} theme={theme} initial={editingInitial} onSave={handleSave} onCancel={closeForm} />}

      {ids.length === 0 ? (
        <p className={`rounded-xl border border-dashed p-6 text-center text-sm ${theme.card} ${theme.subtext}`}>No questions yet. Start with "➕ Add Question" above.</p>
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
```

## File: ./frontend/src/pages/CustomQuizPlay.jsx
```
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
        <h2 className={`mt-2 text-xl font-bold ${theme.text}`}>Finished — {subjectName}</h2>
        <p className={`mt-1 text-sm ${theme.subtext}`}>{answeredCount}/{total} answered</p>
        <p className={`mt-4 text-4xl font-black ${theme.text}`}>{pct}%</p>
        <p className={`mb-6 text-sm ${theme.subtext}`}>{correctCount} of {total} correct</p>
        <div className="space-y-2">
          <button onClick={onRetry} className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${theme.accentBtn}`}>🔁 Retry</button>
          <button onClick={onBack} className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${theme.outlineBtn}`}>← Back to Your Own Quiz</button>
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
        <p className={`text-sm ${theme.subtext}`}>No questions in this subject yet.</p>
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
          ⏱️ {formatSeconds(remainingMs / 1000)} {timer.mode === "perQuestion" ? "· this question" : "· whole quiz"}
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
          return <button key={id} onClick={() => goTo(idx)} className={`h-3 w-3 rounded-full transition-all ${idx === currentIndex ? "scale-125" : ""} ${dotColor}`} title={`Question ${idx + 1}`} />;
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
              {!isAnswered ? "⏰ Time's up — no answer." : isWrongAnswer(currentAnswer, currentItem.correct) ? `❌ Incorrect. The correct answer is: ${currentItem.correct}` : "✅ Correct!"}
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
```

## File: ./frontend/src/pages/IssuanceBrowser.jsx
```
import { useState, useEffect, useMemo } from "react";
import { AI_APPS, copyPromptAndOpen } from "../aiContext";
import { HighlightableContent, NotePanel, useNodeHighlights, useNodeNotes } from "../components/ReaderParts";
import { IS_DEV } from "../env";
import { ISSUANCE_KINDS, STATUS_META, listIssuances, getIssuance, resolveIssuanceRef } from "../issuancesStore";
import { getIssuanceQuiz } from "../issuanceQuizStore";
import IssuanceQuizModal from "../components/IssuanceQuiz";

const INDENT_CLASS = ["ml-0", "ml-4", "ml-8", "ml-12", "ml-16"];

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.in_force;
  return <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${m.cls}`}>{m.label}</span>;
}

function sectionText(sec) {
  return [sec.heading, ...sec.paragraphs.map((p) => (p.label ? p.label + " " : "") + p.text)].filter(Boolean).join("\n");
}
function fullText(iss) {
  return iss.sections.map(sectionText).join("\n\n");
}

// ── Sidebar: list of CMOs / CAOs, grouped by year ────────────────────
export function IssuanceSidebar({ kind, selectedId, onSelect }) {
  const meta = ISSUANCE_KINDS.find((k) => k.id === kind);
  const [q, setQ] = useState("");
  const [collapsedYears, setCollapsedYears] = useState({});
  const items = useMemo(() => listIssuances(kind), [kind]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => `${i.label} ${i.title} ${i.subject} ${i.keywords.join(" ")}`.toLowerCase().includes(s));
  }, [items, q]);

  const groups = useMemo(() => {
    const m = new Map();
    for (const it of filtered) {
      const y = it.year || "Undated";
      if (!m.has(y)) m.set(y, []);
      m.get(y).push(it);
    }
    return [...m.entries()];
  }, [filtered]);

  return (
    <div className="p-3">
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-800">
        <span aria-hidden>🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${meta?.label || ""} (number, title, topic)`}
          style={{ fontSize: "16px" }}
          className="min-w-0 flex-1 border-none bg-transparent py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
        />
        {q && <button onClick={() => setQ("")} className="text-slate-400" aria-label="Clear">✕</button>}
      </div>

      {items.length === 0 && (
        <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <p className="mb-1 text-2xl" aria-hidden>{meta?.icon}</p>
          <p className="font-medium">No {meta?.label}s yet.</p>
          {IS_DEV && <p className="mt-1 text-xs">Import one in the 🛠 Dev Panel → CMO / CAO tab.</p>}
        </div>
      )}
      {items.length > 0 && filtered.length === 0 && (
        <p className="p-3 text-center text-sm text-slate-400">No match for “{q}”.</p>
      )}

      {groups.map(([year, list]) => {
        const collapsed = !q && collapsedYears[year];
        return (
          <div key={year} className="mb-2">
            <button
              onClick={() => setCollapsedYears((p) => ({ ...p, [year]: !p[year] }))}
              className="flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-slate-50 dark:active:bg-slate-800"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-300">
                {year} <span className="font-normal text-slate-400">· {list.length}</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{collapsed ? "▸" : "▾"}</span>
            </button>
            {!collapsed && (
              <ul className="ml-1 space-y-0.5 border-l border-slate-100 pl-2 dark:border-slate-800">
                {list.map((it) => {
                  const active = selectedId === it.id;
                  return (
                    <li key={it.id}>
                      <button
                        onClick={() => onSelect(it.id)}
                        className={`block min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? "bg-navy-900 font-medium text-white shadow-sm dark:bg-navy-700"
                            : "text-slate-600 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="font-semibold">{it.label}</span>
                          {it.status !== "in_force" && (
                            <span className="text-[10px] uppercase tracking-wide opacity-70">{STATUS_META[it.status]?.label}</span>
                          )}
                          {it.hasAi && <span className="text-xs" title="AI explanation available">🤖</span>}
                        </span>
                        {it.title && (
                          <span className={`line-clamp-2 text-xs ${active ? "text-slate-300" : "text-slate-400 dark:text-slate-500"}`}>
                            {it.title}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Ask AI modal (same look as the CMTA one) ─────────────────────────
function IssuanceAiModal({ target, onClose }) {
  const { title, ref, text, entry } = target;
  const [copiedApp, setCopiedApp] = useState(null);

  const ask = async (app) => {
    const base =
      entry?.prompt?.trim() ||
      `Explain this provision of ${ref} (Philippine Bureau of Customs) in simple terms, with a practical customs example, why it exists, related provisions, and common board-exam traps.`;
    const prompt = `${base}\n\nOfficial text — ${ref}:\n"""\n${text}\n"""`;
    await copyPromptAndOpen(prompt, app.url);
    setCopiedApp(app.id);
    setTimeout(() => setCopiedApp(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-3xl">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-navy-700 text-lg">🤖</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Osias 6.7</p>
              <p className="text-xl font-extrabold leading-tight text-slate-900 dark:text-slate-50">{entry?.title || title}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-slate-100 dark:text-slate-500 dark:active:bg-slate-800">✕</button>
        </div>

        {entry?.content ? (
          <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-3 text-base leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">{entry.content}</p>
        ) : (
          <p className="rounded-2xl bg-slate-50 p-3 text-sm italic text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">Osias 6.7 hasn't explained this part yet.</p>
        )}

        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Still confused? Ask another AI</p>
          <div className="flex flex-wrap gap-2">
            {AI_APPS.map((app) => (
              <button key={app.id} onClick={() => ask(app)} className="flex min-h-[42px] items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:active:bg-slate-700">
                <span aria-hidden>{app.icon}</span> {app.label}
              </button>
            ))}
          </div>
          {copiedApp && (
            <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              ✓ Prompt + official text copied — paste it in {AI_APPS.find((a) => a.id === copiedApp)?.label} and send.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── One paragraph: full text + Highlight / Note / Ask AI ─────────────
function ParagraphBlock({ issuance, section, para, reading, fontScale, armedId, setArmedId, onAsk }) {
  const nodeId = `${issuance.id}:${section.id}:${para.id}`;
  const [notesOpen, setNotesOpen] = useState(false);
  const { highlights, addHighlight, removeHighlight } = useNodeHighlights(nodeId, true);
  const { notes, createNote, editNote, removeNote } = useNodeNotes(nodeId, true);
  const isArmed = armedId === nodeId;
  const armed = reading || isArmed;

  const askAi = () =>
    onAsk(
      `${issuance.label}${section.heading ? " — " + section.heading : ""}`,
      (para.label ? para.label + " " : "") + para.text,
      para.ai
    );

  const noteBtn = (
    <button
      onClick={() => setNotesOpen((v) => !v)}
      className={`min-h-[36px] rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${
        notesOpen
          ? "border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-300"
          : "border-sky-200 bg-sky-50 text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/30 dark:text-sky-400 dark:active:bg-sky-950/50"
      }`}
    >
      📝 {notes.length > 0 ? `Notes (${notes.length})` : "Add Note"}
    </button>
  );
  const aiBtn = (
    <button
      onClick={askAi}
      className="min-h-[36px] rounded-lg border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400 dark:active:bg-purple-950/50"
    >
      🤖 Ask AI
    </button>
  );

  return (
    <div className={`${INDENT_CLASS[para.indent] || "ml-0"} ${reading ? "my-4" : "rounded-xl bg-slate-50/70 p-3 dark:bg-slate-800/40"}`}>
      <div className="flex gap-2" style={{ fontSize: `${fontScale}rem` }}>
        {para.label && (
          <span className={`flex-shrink-0 select-none font-semibold tabular-nums text-slate-500 dark:text-slate-400 ${reading ? "font-serif leading-loose" : "leading-relaxed"}`}>
            {para.label}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <HighlightableContent
            nodeId={nodeId}
            content={para.text}
            highlights={highlights}
            addHighlight={addHighlight}
            removeHighlight={removeHighlight}
            armed={armed}
            className={
              reading
                ? "select-text whitespace-pre-wrap font-serif leading-loose text-slate-800 dark:text-slate-300"
                : "select-text whitespace-pre-wrap rounded-lg leading-relaxed text-slate-700 dark:text-slate-300"
            }
          />
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-2 font-sans">
        {!reading && (
          <button
            onClick={() => setArmedId(isArmed ? null : nodeId)}
            className={`min-h-[36px] rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${
              isArmed
                ? "border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-600 dark:bg-amber-900/40 dark:text-amber-300"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 active:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:active:bg-emerald-950/50"
            }`}
          >
            {isArmed ? "Select text to highlight…" : "🖍 Highlight"}
          </button>
        )}
        {noteBtn}
        {aiBtn}
        {para.ai && <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400" title="AI explanation available">✓ explained</span>}
      </div>

      {notesOpen && (
        <div className="font-sans">
          <NotePanel notes={notes} onCreate={createNote} onEdit={editNote} onDelete={removeNote} onClose={() => setNotesOpen(false)} />
        </div>
      )}
    </div>
  );
}

function RefChips({ title, refs, onOpen }) {
  if (!refs.length) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
      <span className="font-semibold text-slate-500 dark:text-slate-400">{title}</span>
      {refs.map((r, i) => {
        const hit = resolveIssuanceRef(r);
        return hit ? (
          <button key={i} onClick={() => onOpen(hit)} className="rounded-full border border-navy-200 bg-white px-2.5 py-1 font-medium text-navy-800 active:bg-slate-100 dark:border-navy-700 dark:bg-slate-800 dark:text-amber-400">
            {r} →
          </button>
        ) : (
          <span key={i} className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{r}</span>
        );
      })}
    </div>
  );
}

// ── Main area: the selected CMO / CAO ────────────────────────────────
export function IssuanceReader({ kind, issuanceId, mode, fontScale, focusMode, onOpenIssuance }) {
  const meta = ISSUANCE_KINDS.find((k) => k.id === kind);
  const issuance = useMemo(() => {
    const i = issuanceId ? getIssuance(issuanceId) : null;
    return i && i.type.toLowerCase() === kind ? i : null;
  }, [issuanceId, kind]);
  const [armedId, setArmedId] = useState(null);
  const [aiTarget, setAiTarget] = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [quizOpen, setQuizOpen] = useState(false);

  useEffect(() => {
    setArmedId(null);
    setAiTarget(null);
    setCollapsed({});
    setQuizOpen(false);
  }, [issuanceId, kind]);

  if (!issuance) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center text-slate-400 dark:text-slate-600">
        <span className="text-4xl">{meta?.icon || "📜"}</span>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">Select a {meta?.label} to start {mode === "reading" ? "reading" : "studying"}</p>
        <p className="text-sm">Use the menu button (☰) to see the list.</p>
      </div>
    );
  }

  const reading = mode === "reading";
  const openAi = (title, text, entry) => setAiTarget({ title, ref: issuance.label, text, entry });
  const wrap = reading
    ? `mx-auto transition-all duration-300 ${focusMode ? "max-w-[62ch]" : "max-w-[70ch]"}`
    : "mx-auto max-w-3xl";
  const allCollapsed = issuance.sections.every((s) => !s.heading || collapsed[s.id]);

  return (
    <div className={wrap}>
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-navy-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white dark:bg-navy-700">{issuance.type}</span>
          <StatusBadge status={issuance.status} />
          {issuance.source === "preview" && <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[11px] font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">DEV PREVIEW</span>}
        </div>
        <h1 className="mt-2 text-xl font-bold text-navy-900 dark:text-slate-50">{issuance.label}</h1>
        {issuance.title && <p className="mt-1 text-base font-semibold text-slate-700 dark:text-slate-200">{issuance.title}</p>}
        {issuance.subject && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{issuance.subject}</p>}
        {(issuance.date_issued || issuance.effectivity) && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {issuance.date_issued && <span>📅 Issued: {issuance.date_issued}</span>}
            {issuance.date_issued && issuance.effectivity && <span> · </span>}
            {issuance.effectivity && <span>Effectivity: {issuance.effectivity}</span>}
          </p>
        )}
        <RefChips title="Amends / revokes" refs={issuance.amends} onOpen={onOpenIssuance} />
        <RefChips title="Amended by" refs={issuance.amended_by} onOpen={onOpenIssuance} />
        <RefChips title="Related" refs={issuance.related} onOpen={onOpenIssuance} />
        {issuance.keywords.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {issuance.keywords.map((k) => <span key={k} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">{k}</span>)}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => openAi(`About ${issuance.label}`, fullText(issuance), issuance.ai)}
            className="min-h-[38px] rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
          >
            🤖 Ask AI — overview
          </button>
          {getIssuanceQuiz(issuance.id) && (
            <button
              onClick={() => setQuizOpen(true)}
              className="min-h-[38px] rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 active:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
            >
              📝 Quiz
            </button>
          )}
          {!reading && (
            <>
              <button onClick={() => setCollapsed({})} className="h-[38px] rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">⤢ Expand All</button>
              <button
                onClick={() => setCollapsed(Object.fromEntries(issuance.sections.map((s) => [s.id, true])))}
                disabled={allCollapsed}
                className="h-[38px] rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 active:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                ⤡ Collapse All
              </button>
            </>
          )}
        </div>
      </div>

      {issuance.sections.map((sec) => {
        const open = !sec.heading || !collapsed[sec.id];
        const paras = sec.paragraphs.map((p) => (
          <ParagraphBlock
            key={`${issuance.id}:${sec.id}:${p.id}`}
            issuance={issuance}
            section={sec}
            para={p}
            reading={reading}
            fontScale={reading ? fontScale : Math.max(1, fontScale)}
            armedId={armedId}
            setArmedId={setArmedId}
            onAsk={openAi}
          />
        ));
        const secAi = sec.ai && (
          <button
            onClick={() => openAi(`${issuance.label} — ${sec.heading}`, sectionText(sec), sec.ai)}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base active:bg-slate-100 dark:active:bg-slate-800"
            aria-label="Ask AI about this section"
          >
            🤖
          </button>
        );

        if (reading) {
          return (
            <section key={sec.id} className="mb-6">
              {sec.heading && (
                <div className="flex items-start gap-2">
                  <h2 className="flex-1 font-serif font-bold text-navy-900 dark:text-slate-50" style={{ fontSize: `${1.3 * fontScale}rem` }}>{sec.heading}</h2>
                  {secAi}
                </div>
              )}
              {paras}
            </section>
          );
        }
        return (
          <section key={sec.id} className="mb-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-900">
            {sec.heading && (
              <div className="flex items-start gap-1">
                <button onClick={() => setCollapsed((p) => ({ ...p, [sec.id]: !p[sec.id] }))} aria-expanded={open} className="flex min-h-[40px] flex-1 items-start gap-2 text-left">
                  <span className={`mt-1 select-none text-slate-400 transition-transform duration-200 dark:text-slate-600 ${open ? "rotate-90" : ""}`}>▸</span>
                  <span className="text-base font-bold text-navy-900 dark:text-slate-50 sm:text-lg">{sec.heading}</span>
                </button>
                {secAi}
              </div>
            )}
            {open && <div className="mt-2 space-y-2">{paras}</div>}
          </section>
        );
      })}

      {aiTarget && <IssuanceAiModal target={aiTarget} onClose={() => setAiTarget(null)} />}
      {quizOpen && <IssuanceQuizModal issuance={issuance} onClose={() => setQuizOpen(false)} />}
    </div>
  );
}
```

## File: ./frontend/src/pages/IssuancePanel.jsx
```
import { useState, useCallback } from "react";
import {
  importIssuanceJson, getPreviewList, deletePreviewIssuance, clearPreview,
  exportIssuanceJson, exportManyJson, issuanceFileName,
  ISSUANCE_PROMPT, ISSUANCE_TEMPLATE, STATUS_META,
} from "../issuancesStore";

function download(name, text) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function IssuancePanel() {
  const [json, setJson] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const list = getPreviewList();

  const handleImport = useCallback(() => {
    setError(null);
    setSuccess(null);
    try {
      const res = importIssuanceJson(json);
      setSuccess(
        "✓ Imported " + res.map((r) => `${r.label} (${r.paragraphCount} paragraphs, ${r.aiCount} explained)`).join(", ") +
        ". Open ☰ → CMO / CAO to preview."
      );
      setJson("");
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }, [json]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(ISSUANCE_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Clipboard blocked. Long-press the text in the box below instead.");
    }
  };

  const handleDelete = (id, label) => {
    if (confirm(`Remove ${label} from the dev preview?`)) { deletePreviewIssuance(id); refresh(); }
  };
  const handleClear = () => {
    if (confirm("Remove ALL dev-preview CMOs / CAOs?")) { clearPreview(); refresh(); }
  };

  const btn = "min-h-[40px] rounded-lg border px-3 py-1.5 text-sm font-medium";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-base font-bold text-navy-900 dark:text-slate-100">CMO / CAO import</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Copy the AI prompt, paste it in ChatGPT / Gemini, then paste the official CMO/CAO text below it.</li>
          <li>Paste the JSON the AI gives you here (official paragraphs + Tagalog explanations in one go).</li>
          <li>Import, then check it in ☰ → CMO / CAO.</li>
          <li>Download the file and put it in <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">frontend/src/data/issuances/</code> so it ships to users.</li>
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={copyPrompt} className={`${btn} border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400`}>
            {copied ? "✓ Prompt copied" : "📋 Copy AI prompt"}
          </button>
          <button onClick={() => setJson(ISSUANCE_TEMPLATE)} className={`${btn} border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300`}>
            🧩 Insert template
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={10}
          placeholder="Paste JSON here — one CMO/CAO, or an array of many. Code fences are fine."
          style={{ fontSize: "16px" }}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-slate-800 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        {error && <p className="mt-2 rounded-lg bg-red-50 p-2.5 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">⚠️ {error}</p>}
        {success && <p className="mt-2 rounded-lg bg-emerald-50 p-2.5 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{success}</p>}
        <div className="mt-2 flex justify-end">
          <button onClick={handleImport} disabled={!json.trim()} className="min-h-[42px] rounded-lg bg-navy-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">
            Import
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Dev preview ({list.length})</h3>
          {list.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {["CMO", "CAO"].filter((t) => list.some((i) => i.type === t)).map((t) => (
                <button key={t} onClick={() => download(`${t.toLowerCase()}-all.json`, exportManyJson(t))} className={`${btn} border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300`}>
                  ⬇ All {t}
                </button>
              ))}
              <button onClick={handleClear} className={`${btn} border-red-200 text-red-600 dark:border-red-800 dark:text-red-400`}>Clear</button>
            </div>
          )}
        </div>
        {list.length === 0 && <p className="text-sm text-slate-400">Nothing imported yet.</p>}
        <ul className="space-y-2">
          {list.map((it) => (
            <li key={it.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900 dark:text-slate-100">
                    {it.label} <span className="text-xs font-normal text-slate-400">· {STATUS_META[it.status]?.label}</span>
                  </p>
                  {it.title && <p className="truncate text-sm text-slate-500 dark:text-slate-400">{it.title}</p>}
                  <p className="text-xs text-slate-400">{it.paragraphCount} paragraphs · 🤖 {it.aiCount} explained</p>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <button onClick={() => download(issuanceFileName(it.id), exportIssuanceJson(it.id))} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">⬇ JSON</button>
                  <button onClick={() => handleDelete(it.id, it.label)} className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">✕</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## File: ./frontend/src/pages/IssuanceQuizPanel.jsx
```
import { useState, useCallback } from "react";
import {
  importIssuanceQuizJson, getPreviewQuizList, deletePreviewQuiz, clearPreviewQuiz,
  exportIssuanceQuizJson, exportAllQuizJson, issuanceQuizFileName,
  ISSUANCE_QUIZ_PROMPT, ISSUANCE_QUIZ_TEMPLATE,
} from "../issuanceQuizStore";

function download(name, text) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function IssuanceQuizPanel() {
  const [json, setJson] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const list = getPreviewQuizList();

  const handleImport = useCallback(() => {
    setError(null);
    setSuccess(null);
    try {
      const res = importIssuanceQuizJson(json);
      const missing = res.filter((r) => !r.found).map((r) => r.label);
      setSuccess(
        "✓ Quiz imported: " + res.map((r) => `${r.label} (L1: ${r.l1}, L2: ${r.l2})`).join(", ") + "." +
        (missing.length
          ? ` ⚠ ${missing.join(", ")} not in your CMO / CAO list yet — the 📝 Quiz button will appear once it is imported.`
          : " Test it in 📝 Quiz/Exam → CMO / CAO (or ☰ → CMO / CAO → 📝 Quiz).")
      );
      setJson("");
      refresh();
    } catch (e) {
      setError(e.message);
    }
  }, [json]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(ISSUANCE_QUIZ_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Clipboard blocked. Long-press the text in the box below instead.");
    }
  };

  const handleDelete = (id, label) => {
    if (confirm(`Remove the quiz of ${label} from the dev preview?`)) { deletePreviewQuiz(id); refresh(); }
  };
  const handleClear = () => {
    if (confirm("Remove ALL dev-preview CMO / CAO quizzes?")) { clearPreviewQuiz(); refresh(); }
  };

  const btn = "min-h-[40px] rounded-lg border px-3 py-1.5 text-sm font-medium";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-base font-bold text-navy-900 dark:text-slate-100">CMO / CAO quiz import</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Copy the quiz prompt, paste it in ChatGPT / Gemini, then paste the official CMO/CAO text below it.</li>
          <li>Paste the JSON here. Level 1 = definition / identification, Level 2 = real case. All A–D.</li>
          <li>The quiz attaches itself to the CMO/CAO with the same type + number. Import order doesn't matter.</li>
          <li>Check it in 📝 Quiz/Exam → CMO / CAO list (or ☰ → CMO / CAO → 📝 Quiz).</li>
          <li>Download the file and put it in <code className="rounded bg-slate-100 px-1 dark:bg-slate-700">frontend/src/data/issuance-quizzes/</code> so it ships to users.</li>
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={copyPrompt} className={`${btn} border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400`}>
            {copied ? "✓ Prompt copied" : "📋 Copy AI prompt"}
          </button>
          <button onClick={() => setJson(ISSUANCE_QUIZ_TEMPLATE)} className={`${btn} border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300`}>
            🧩 Insert template
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={10}
          placeholder="Paste quiz JSON here — one CMO/CAO, or an array of many. Code fences are fine."
          style={{ fontSize: "16px" }}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-slate-800 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        />
        {error && <p className="mt-2 rounded-lg bg-red-50 p-2.5 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">⚠️ {error}</p>}
        {success && <p className="mt-2 rounded-lg bg-emerald-50 p-2.5 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{success}</p>}
        <div className="mt-2 flex justify-end">
          <button onClick={handleImport} disabled={!json.trim()} className="min-h-[42px] rounded-lg bg-navy-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-navy-700">
            Import
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Dev preview ({list.length})</h3>
          {list.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {["CMO", "CAO"].filter((t) => list.some((i) => i.type === t)).map((t) => (
                <button key={t} onClick={() => download(`${t.toLowerCase()}-quizzes-all.json`, exportAllQuizJson(t))} className={`${btn} border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300`}>
                  ⬇ All {t}
                </button>
              ))}
              <button onClick={handleClear} className={`${btn} border-red-200 text-red-600 dark:border-red-800 dark:text-red-400`}>Clear</button>
            </div>
          )}
        </div>
        {list.length === 0 && <p className="text-sm text-slate-400">No quiz imported yet.</p>}
        <ul className="space-y-2">
          {list.map((it) => (
            <li key={it.id} className="rounded-xl border border-slate-100 p-3 dark:border-slate-700">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-navy-900 dark:text-slate-100">{it.label}</p>
                  <p className="text-xs text-slate-400">🟢 L1: {it.l1} questions · 🔵 L2: {it.l2} questions</p>
                  {!it.hasIssuance && <p className="text-xs text-amber-600 dark:text-amber-400">⚠ {it.label} isn't imported yet — no Quiz button until it is.</p>}
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <button onClick={() => download(issuanceQuizFileName(it.id), exportIssuanceQuizJson(it.id))} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300">⬇ JSON</button>
                  <button onClick={() => handleDelete(it.id, it.label)} className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 dark:border-red-800 dark:text-red-400">✕</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

## File: ./frontend/src/pages/IssuanceQuizHub.jsx
```
import { useState, useMemo } from "react";
import IssuanceQuizModal from "../components/IssuanceQuiz";
import { listIssuanceQuizzes } from "../issuanceQuizStore";

// Quiz/Exam → "CMO / CAO" subject.
// Lists every CMO / CAO that has a quiz (name/title + number like "07-2027"), grouped by year.
// Tapping one opens that issuance's level picker (Level 1 / Level 2) right here, inline.
// The 📝 Quiz button inside each CMO / CAO page still works as before.

const TYPES = [
  { id: "CMO", label: "CMO", icon: "📜" },
  { id: "CAO", label: "CAO", icon: "📄" },
];

export default function IssuanceQuizHub({ onBack }) {
  const [type, setType] = useState("CMO");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null); // { id, label, title }
  const [collapsedYears, setCollapsedYears] = useState({});

  const items = useMemo(() => listIssuanceQuizzes(type), [type, selected]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => `${i.label} ${i.number} ${i.title} ${i.subject}`.toLowerCase().includes(s));
  }, [items, q]);

  const groups = useMemo(() => {
    const m = new Map();
    for (const it of filtered) {
      const y = it.year || "Undated";
      if (!m.has(y)) m.set(y, []);
      m.get(y).push(it);
    }
    return [...m.entries()];
  }, [filtered]);

  if (selected) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <IssuanceQuizModal
          embedded
          issuance={selected}
          backLabel={`← Back to ${type} list`}
          onClose={() => setSelected(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <button
        onClick={onBack}
        className="mb-3 flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800"
      >
        <span aria-hidden>←</span> Subjects
      </button>

      <div className="mb-3 flex gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setType(t.id); setQ(""); }}
            className={`min-h-[40px] flex-1 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              type === t.id
                ? "bg-navy-900 text-white shadow-sm dark:bg-navy-700"
                : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:active:bg-slate-700"
            }`}
          >
            <span aria-hidden>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-800">
        <span aria-hidden>🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${type} (number or title)`}
          style={{ fontSize: "16px" }}
          className="min-w-0 flex-1 border-none bg-transparent py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
        />
        {q && <button onClick={() => setQ("")} className="text-slate-400" aria-label="Clear">✕</button>}
      </div>

      {items.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-card dark:bg-slate-800 dark:text-slate-400">
          <p className="mb-1 text-2xl" aria-hidden>📝</p>
          <p className="font-medium">No {type} quizzes yet.</p>
        </div>
      )}
      {items.length > 0 && filtered.length === 0 && (
        <p className="p-3 text-center text-sm text-slate-400">No match for “{q}”.</p>
      )}

      {groups.map(([year, list]) => {
        const collapsed = !q && collapsedYears[year];
        return (
          <div key={year} className="mb-2">
            <button
              onClick={() => setCollapsedYears((p) => ({ ...p, [year]: !p[year] }))}
              className="flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-slate-100 dark:active:bg-slate-800"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-300">
                {year} <span className="font-normal text-slate-400">· {list.length}</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{collapsed ? "▸" : "▾"}</span>
            </button>
            {!collapsed && (
              <ul className="space-y-2">
                {list.map((it) => (
                  <li key={it.id}>
                    <button
                      onClick={() => setSelected({ id: it.id, label: it.label, title: it.title })}
                      className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-card active:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700/50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-navy-900 dark:text-slate-100">{it.label}</p>
                        {it.title && (
                          <p className="mt-0.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{it.title}</p>
                        )}
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          {[it.l1 > 0 && `🟢 L1: ${it.l1}`, it.l2 > 0 && `🔵 L2: ${it.l2}`].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-slate-300 dark:text-slate-600" aria-hidden>→</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

## File: ./frontend/src/quizContext.js
```
// Quiz generation — builds the "Copy Quiz Template" clipboard payload for one Title.
// The prompt instructs the AI to SELECTIVELY generate quiz questions for the most
// important and testable provisions, like a professor curating an exam.
//
// Flow: tap the 📝 button next to a Title in the sidebar -> this builds a
// prompt containing instructions + the full text of every node in that
// title, each tagged with its unique ID -> paste into an AI -> paste the
// AI's JSON answer into Dev Panel -> Import Quiz JSON.

function flattenForQuiz(node, lines = []) {
  const label = `${(node.node_type || "").toUpperCase()} ${node.node_number || ""}`.trim();
  const heading = node.title ? `${label} — ${node.title}` : label;
  if (node.content) {
    lines.push(`[ID: ${node.id}] ${heading}`);
    lines.push(node.content.trim());
    lines.push("");
  } else if (node.title) {
    lines.push(`[ID: ${node.id}] ${heading}`);
    lines.push("");
  }
  if (node.children) {
    for (const child of node.children) flattenForQuiz(child, lines);
  }
  return lines;
}

function collectQuizIds(node, ids = []) {
  if (node.content) ids.push(node.id);
  if (node.children) {
    for (const child of node.children) collectQuizIds(child, ids);
  }
  return ids;
}

export const QUIZ_MASTER_PROMPT = `🧠 QUIZ GENERATION — SELECTIVE & CUBLE-ALIGNED (CMTA RA 10863)

You are an expert Customs law professor and CuBLE exam developer. Your task is to create a high-quality, selective 5-level quiz system for a Philippine law-study app covering RA 10863, the Customs Modernization and Tariff Act (CMTA).

🎯 TARGET AUDIENCE: BSCA students and Customs Broker Licensure Examination (CuBLE) reviewees.
🔍 SOURCE: The official CMTA text provided below. Do NOT invent facts not stated in the text.
🌐 WEB SEARCH: You MAY use web search (if available) to verify CuBLE exam patterns, frequently tested topics, and board exam trends — but your answers must ALWAYS be based on the actual CMTA text provided.

---
📋 SELECTION RULE — YOU ARE THE PROFESSOR

You are given a list of IDs and their full text below.

Your task is to SELECTIVELY generate quiz questions for the MOST IMPORTANT and TESTABLE provisions — just like a professor would when designing a board exam review.

DO NOT generate a question for every single ID.
DO NOT force questions for repetitive, minor, or purely procedural provisions.

CHOOSE the provisions that are:
- Frequently tested in CuBLE (e.g., definitions, penalties, procedures, exceptions)
- Core principles (Declaration of Policy, Definition of Terms, Importation rules)
- Thresholds, percentages, deadlines (e.g., 15 days, 30 days, 100% ad valorem)
- Key distinctions (Abatement vs Refund, Entry vs Admission, Outright vs Technical Smuggling)
- Practical application scenarios (seizure, forfeiture, assessment, protest)
- Board exam favorite topics (Flexible Clause, AEO, Rules of Origin, Valuation Methods)
- Unique or landmark provisions

SKIP provisions that are:
- Purely procedural or administrative (e.g., reporting requirements, record-keeping)
- Repetitive or redundant across multiple sections
- Too minor or rarely tested in board exams
- Already covered by a more important provision

The number of questions you generate should be based on the educational importance and testability of the provisions — there is no fixed minimum or maximum. Focus on quality over quantity. A good exam covers the most critical topics without being exhaustive.

IMPORTANT: Whichever IDs you choose to cover for THIS Title, reuse that SAME set of IDs across every level (1 through 5) if you are asked to generate more than one level later for this Title. This keeps every level's question count consistent.

---
📋 CRITICAL: THE "_title" FIELD MUST STAY IDENTICAL ACROSS ALL 5 LEVELS

This app merges quiz batches by matching the "_title" string EXACTLY (case-insensitive, whitespace-trimmed only — no other normalization). If Level 1, Level 2, Level 3, Level 4, and Level 5 are generated as separate outputs for the SAME Title, every single output MUST use the exact same "_title" value. Do NOT append "Level 1", "Batch 2", "Easy", "Normal", etc. to it, and do NOT reword it between levels. Otherwise the app creates separate, duplicate-looking groups instead of one merged quiz set with all 5 level buttons working correctly.

Derive the "_title" from the Title heading found at the top of the FULL TEXT section below (e.g. a line like "TITLE I — PRELIMINARY PROVISIONS" becomes "_title": "Title I – Preliminary Provisions"). If the person tells you to use a specific exact "_title" string, use that instead — it takes priority, since it guarantees the string matches whatever was used for the other levels of this same Title.

---
📋 OUTPUT FORMAT

If asked to generate ONE level at a time (most common), output ONLY that level, nested under each selected ID:

{
  "_title": "Title I – Preliminary Provisions",
  "<selectedID>": {
    "level1": {
      "question": "...",
      "choices": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct": "A",
      "reason": "..."
    }
  }
}

If asked to generate ALL 5 levels at once, nest every level under the same ID instead:

{
  "_title": "Title I – Preliminary Provisions",
  "<selectedID>": {
    "level1": { "question": "...", "choices": {...}, "correct": "A", "reason": "..." },
    "level2": { "question": "...", "choices": {...}, "correct": "B", "reason": "..." },
    "level3": { "question": "...", "choices": {...}, "correct": "C", "reason": "..." },
    "level4": { "question": "...", "choices": {...}, "correct": "D", "reason": "..." },
    "level5": { "question": "...", "correct": "The exact answer text", "reason": "..." }
  }
}

Note: Level 5 never has a "choices" field — it is identification-only.

Output ONLY the JSON object. No markdown code fences, no extra commentary before or after it.

---
📋 CRITICAL: THE "reason" FIELD MUST BE PLAIN TEXT — NO MARKDOWN

The app displays "reason" inside a plain paragraph tag with no markdown rendering whatsoever. Do NOT use any of the following inside "reason":
- Bold markers (**text**)
- Blockquote markers (>)
- Headers (#)
- Emoji section icons (book, lightbulb, checkmark, etc.)
- Forced line breaks

Instead, write "reason" as ONE flat, well-punctuated paragraph, 3-4 sentences max, following this structure:

"Correct answer: [letter]. Section [X]([paragraph letter if any]) of the CMTA states: '[exact verbatim wording from the source text].' [1-2 sentence tip explaining the key distinction, common trap, or why the other choices are wrong.]"

Rules:
- Quote the EXACT wording from the source text, inside straight single or double quotes — never paraphrase the legal text itself.
- No icons, no markdown symbols, no forced line breaks — everything flows as normal prose.
- Level 1 reasons are written in Tagalog, but the quoted legal text itself stays in English inside quotes.
- Levels 2-5 reasons are written fully in English.

EXAMPLE (Level 2): "reason": "Correct answer: C. Section 101 of the CMTA states the State's policy is to 'efficiently facilitate international trade,' not restrict it, while also aiming to 'prevent and curtail any form of customs fraud and illegal acts.' Choice C reverses this intent, which contradicts the law's actual goal of facilitation with fraud control."

EXAMPLE (Level 1): "reason": "Tamang sagot: C. Ayon sa Section 101, layunin ng estado na 'efficiently facilitate international trade' o padaliin ang international trade, hindi ito paghigpitan. Mali ang choice C dahil sinasabi nitong dapat limitahan ang import."

---
🎯 LEVEL GUIDE:

🟢 LEVEL 1 — EASY (Tagalog Foundation)
- Language: Tagalog
- Purpose: Build foundation before transitioning to English.
- Question Types: Definition of Terms, True or False (presented as 4 choices), Best Answer, Simple Scenario-Based Questions.
- Example (True or False): "Ang Bureau of Customs ay nasa ilalim ng Department of Finance." Choices: A. True, B. False, C. Partially True, D. Cannot be Determined
- Keep it simple. Focus on basic understanding.

🔵 LEVEL 2 — NORMAL (English Foundation)
- Language: English
- Purpose: Introduce students to the official legal language used in the CMTA and CuBLE.
- Question Types: Definition of Terms, Focus on customs terminology, legal definitions, basic concepts, section identification.
- Keep it straightforward. Test memory and recognition.

🟠 LEVEL 3 — MEDIUM (Legal Analysis)
- Language: English
- Purpose: Develop analytical thinking similar to actual board exam questions.
- Question Types: Best Answer, Focus: Interpretation, Exceptions, Comparing provisions, Applying legal principles.
- Require deeper understanding, not just rote memorization.

🟣 LEVEL 4 — MEDIUM PRO (Real-World Application)
- Language: English
- Purpose: Train students to apply CMTA provisions in realistic customs situations.
- Question Types: Scenario-Based Questions
- Scenarios include: Importation, Exportation, Customs valuation, Tariff classification, Seizure and forfeiture, Customs procedures, Realistic business transactions.
- Make the scenarios practical and relatable to actual customs operations in the Philippines (seaports, airports, PEZA, Clark, Subic, Free Zones).

🔴 LEVEL 5 — WILL DONE (Hard / Mastery Mode)
- Language: English
- Purpose: Measure true mastery without relying on answer choices.
- Question Types: Identification — user manually types the answer.
- Question Types: Definition of Terms, Best Answer, Scenario-Based Questions, Mixed Board-Style Questions.
- The correct answer should be a single, clear, unambiguous term or short phrase.
- The app will handle case-insensitive matching, so the correct answer must be spelled correctly.
- No choices — this tests recall, not recognition.

---
📋 BOARD EXAM INSIGHTS (Use web search if available)

If you have web search capability, use it to verify:
- Which CMTA topics are frequently tested in the CuBLE (Customs Broker Licensure Examination)
- Common board exam question patterns (e.g., "Which is NOT a valid...," "Except...," "What is the correct...,")
- Frequently asked definitions, percentages, deadlines, and distinctions
- Real board exam trends from recent years

Your questions should mimic actual CuBLE question quality and difficulty.

---
📋 IMPORTANT REMINDERS

- DO NOT generate questions for every ID — be selective.
- Choose IDs that are testable, important, and board-exam relevant.
- Use web search (if available) to verify CuBLE exam patterns.
- Your JSON must only include the IDs you selected.
- Skip IDs that are repetitive, procedural, or minor.
- Focus on quality over quantity — there is no fixed number of questions.
- Keep the exact same "_title" across every level you generate for this Title.
- The "reason" field must be plain flat prose — no markdown, no icons, no line breaks.

---
📋 IDs available (you choose which to cover — do not feel obligated to cover all):

IDs to cover: `;

export function copyQuizPromptForTitle(titleTree) {
  const fullText = flattenForQuiz(titleTree).join("\n");
  const ids = collectQuizIds(titleTree);

  return `${QUIZ_MASTER_PROMPT} ${ids.join(", ")}

=== FULL TEXT (use this as your source of truth) ===
${fullText}`;
}

// Legacy export — kept for backward compatibility
export function buildQuizPromptForTitle(titleTree) {
  return copyQuizPromptForTitle(titleTree);
}
```

## File: ./frontend/src/quizStore.js
```
// Quiz storage: lets you paste AI-generated quiz JSON (per title/level) and have
// it saved permanently in localStorage. When importing multiple batches with
// the same _title, entries are MERGED instead of overwritten.
//
// Title label: optional. Add a top-level "_title" key in the pasted JSON
// (e.g. { "_title": "CMTA Title I - Level 1 Batch", "393": {...} }) to name the batch.
// Importing Level 2 with the same _title will merge with Level 1.
// Matching is case-insensitive and ignores leading/trailing spaces, so
// "Title I" and "title i " will merge into the same batch instead of
// silently creating a duplicate one.

const STORE_KEY = "customsLaw_quizImports";

function emptyStore() {
  return { batches: {}, entries: {} };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return {
      batches: parsed.batches || {},
      entries: parsed.entries || {}
    };
  } catch {
    return emptyStore();
  }
}

function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function normalizeLabel(label) {
  return String(label || "").trim().toLowerCase();
}

export function getImportedQuizEntry(nodeId) {
  const store = loadStore();
  return store.entries[String(nodeId)] || null;
}

export function getAllQuizBatches() {
  const store = loadStore();
  return Object.values(store.batches).sort((a, b) => b.importedAt.localeCompare(a.importedAt));
}

export function getQuizBatchEntries(batchId) {
  const store = loadStore();
  const batch = store.batches[batchId];
  if (!batch) return [];
  return batch.nodeIds.map((id) => ({ id, ...(store.entries[id] || {}) }));
}

// Flattens batches + entries into { id: { _title, level1, level2, ... } } —
// the SAME shape used by the shipped frontend/src/data/quizData.json static
// file. This is the fix for the "everything shows up as Untitled" bug: the
// title now travels with each question instead of only living on the batch,
// so the live import preview and the final baked-in file always agree.
export function getFlattenedEntries() {
  const store = loadStore();
  const flat = {};
  for (const batch of Object.values(store.batches)) {
    for (const id of batch.nodeIds) {
      if (store.entries[id]) {
        flat[id] = { _title: batch.label, ...store.entries[id] };
      }
    }
  }
  return flat;
}

export function importQuizJson(jsonText) {
  const parsed = JSON.parse(jsonText);
  const rawLabel = parsed._title;
  if (parsed._title !== undefined) delete parsed._title;
  const ids = Object.keys(parsed);
  if (!ids.length) throw new Error("The pasted JSON is empty.");

  const store = loadStore();

  let existingBatchId = null;
  const label = (rawLabel && String(rawLabel).trim()) || null;

  if (label) {
    const normalized = normalizeLabel(label);
    for (const [bId, batch] of Object.entries(store.batches)) {
      if (normalizeLabel(batch.label) === normalized) {
        existingBatchId = bId;
        break;
      }
    }
  }

  for (const id of ids) {
    const existing = store.entries[id];
    store.entries[id] = existing ? { ...existing, ...parsed[id] } : parsed[id];
  }

  if (existingBatchId) {
    const batch = store.batches[existingBatchId];
    const existingIds = new Set(batch.nodeIds);
    for (const id of ids) {
      if (!existingIds.has(id)) batch.nodeIds.push(id);
    }
    batch.importedAt = new Date().toISOString();
  } else {
    const batchId = `qb_${Date.now()}`;
    const fallback = `Import – ${new Date().toLocaleString("en-PH", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    })}`;
    store.batches[batchId] = {
      id: batchId,
      label: label || fallback,
      importedAt: new Date().toISOString(),
      nodeIds: ids
    };
  }

  saveStore(store);

  const count = Object.keys(store.entries).length;
  return { count, label: label || "New batch" };
}

export function renameQuizBatch(batchId, newLabel) {
  const store = loadStore();
  if (!store.batches[batchId]) return;
  const trimmed = newLabel.trim();
  if (trimmed) store.batches[batchId].label = trimmed;
  saveStore(store);
}

export function updateQuizEntry(nodeId, fields) {
  const store = loadStore();
  if (!store.entries[nodeId]) return;
  store.entries[nodeId] = { ...store.entries[nodeId], ...fields };
  saveStore(store);
}

export function deleteQuizEntry(nodeId) {
  const store = loadStore();
  delete store.entries[nodeId];
  for (const bId in store.batches) {
    store.batches[bId].nodeIds = store.batches[bId].nodeIds.filter((id) => id !== nodeId);
    if (store.batches[bId].nodeIds.length === 0) delete store.batches[bId];
  }
  saveStore(store);
}

export function deleteQuizBatch(batchId) {
  const store = loadStore();
  const batch = store.batches[batchId];
  if (!batch) return;
  for (const id of batch.nodeIds) {
    let usedElsewhere = false;
    for (const [bId, b] of Object.entries(store.batches)) {
      if (bId !== batchId && b.nodeIds.includes(id)) { usedElsewhere = true; break; }
    }
    if (!usedElsewhere) delete store.entries[id];
  }
  delete store.batches[batchId];
  saveStore(store);
}

export function getQuizExportAllJson() {
  return JSON.stringify(getFlattenedEntries(), null, 2);
}

export function saveRawQuizEntries(jsonText) {
  const parsed = JSON.parse(jsonText);
  const store = loadStore();
  for (const id of Object.keys(parsed)) {
    const existing = store.entries[id];
    store.entries[id] = existing ? { ...existing, ...parsed[id] } : parsed[id];
  }
  saveStore(store);
}

export function clearAllQuizImports() {
  saveStore(emptyStore());
}

export function getQuizImportedCount() {
  return Object.keys(loadStore().entries).length;
}

const LAST_POSITION_KEY = "customsLaw_quizLastPosition";

export function saveLastQuizPosition(title, level) {
  try {
    localStorage.setItem(LAST_POSITION_KEY, JSON.stringify({ title, level, updatedAt: new Date().toISOString() }));
  } catch {}
}

export function getLastQuizPosition() {
  try {
    return JSON.parse(localStorage.getItem(LAST_POSITION_KEY) || "null");
  } catch {
    return null;
  }
}
```

## File: ./frontend/src/subjectQuizStore.js
```
// Generic, per-subject quiz storage para sa CL / CDP / TL / PC.
// Bawat subject ay may sariling localStorage key — hiwalay talaga sa
// frontend/src/quizStore.js (RA10863), kaya walang epekto doon.
//
// Content format (flat — walang titles, walang levels):
//   {
//     "_batch": "Items 1-10",   // optional label ng import na ito
//     "1": { "question": "...", "choices": {"A":"...","B":"...","C":"..."}, "correct": "A", "reason": "..." },
//     "2": { ... }
//   }
//
// Walang limit sa bilang ng batches/items. Kung same "_batch" label ang
// gamit mo ulit, doon lang siya mag-me-merge — kung iba, bagong batch.

function contentKey(subjectId) {
  return `customsLaw_subjectQuiz_${subjectId}`;
}
function progressKey(subjectId) {
  return `customsLaw_subjectProgress_${subjectId}`;
}

function emptyStore() {
  return { batches: {}, entries: {} };
}

function loadStore(subjectId) {
  try {
    const raw = localStorage.getItem(contentKey(subjectId));
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    return { batches: parsed.batches || {}, entries: parsed.entries || {} };
  } catch {
    return emptyStore();
  }
}

function saveStore(subjectId, store) {
  localStorage.setItem(contentKey(subjectId), JSON.stringify(store));
}

function normalizeLabel(label) {
  return String(label || "").trim().toLowerCase();
}

function numericSort(a, b) {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

export function getAllEntries(subjectId) {
  return loadStore(subjectId).entries;
}

export function getSortedItemIds(subjectId) {
  const entries = getAllEntries(subjectId);
  return Object.keys(entries).sort(numericSort);
}

export function getAllBatches(subjectId) {
  const store = loadStore(subjectId);
  return Object.values(store.batches).sort((a, b) => b.importedAt.localeCompare(a.importedAt));
}

export function getBatchEntries(subjectId, batchId) {
  const store = loadStore(subjectId);
  const batch = store.batches[batchId];
  if (!batch) return [];
  return batch.itemIds.map((id) => ({ id, ...(store.entries[id] || {}) }));
}

export function getImportedCount(subjectId) {
  return Object.keys(loadStore(subjectId).entries).length;
}

// Mag-import ng isang flat batch para sa isang subject. Returns { count, label, skipped }.
export function importSubjectQuizJson(subjectId, jsonText) {
  const parsed = JSON.parse(jsonText);
  const rawLabel = parsed._batch;
  if (parsed._batch !== undefined) delete parsed._batch;
  if (parsed._title !== undefined) delete parsed._title; // fallback kung "_title" ang nagamit mo dati

  // Huwag ibagsak ang BUONG batch dahil lang sa iilang sirang item —
  // i-skip na lang ang mga invalid, at ituloy ang pag-import ng mga valid.
  const skipped = [];
  for (const id of Object.keys(parsed)) {
    const item = parsed[id];
    const invalid =
      !item || typeof item !== "object" ||
      !item.question || typeof item.question !== "string" || !item.question.trim() ||
      !item.correct || typeof item.correct !== "string" || !item.correct.trim();
    if (invalid) {
      skipped.push(id);
      delete parsed[id];
    }
  }

  const ids = Object.keys(parsed);
  if (!ids.length) {
    throw new Error(
      skipped.length
        ? `Nothing imported: all ${skipped.length} items are missing a "question" or "correct" answer (IDs: ${skipped.slice(0, 10).join(", ")}${skipped.length > 10 ? "…" : ""}).`
        : "The pasted JSON is empty."
    );
  }

  const store = loadStore(subjectId);

  let existingBatchId = null;
  const label = (rawLabel && String(rawLabel).trim()) || null;
  if (label) {
    const normalized = normalizeLabel(label);
    for (const [bId, batch] of Object.entries(store.batches)) {
      if (normalizeLabel(batch.label) === normalized) { existingBatchId = bId; break; }
    }
  }

  for (const id of ids) {
    const existing = store.entries[id];
    store.entries[id] = existing ? { ...existing, ...parsed[id] } : parsed[id];
  }

  if (existingBatchId) {
    const batch = store.batches[existingBatchId];
    const existingIds = new Set(batch.itemIds);
    for (const id of ids) { if (!existingIds.has(id)) batch.itemIds.push(id); }
    batch.importedAt = new Date().toISOString();
  } else {
    const sorted = [...ids].sort(numericSort);
    const batchId = `sb_${Date.now()}`;
    const fallback = `Items ${sorted[0]}–${sorted[sorted.length - 1]}`;
    store.batches[batchId] = {
      id: batchId,
      label: label || fallback,
      importedAt: new Date().toISOString(),
      itemIds: ids,
    };
  }

  saveStore(subjectId, store);
  if (skipped.length) {
    console.warn(`[${subjectId}] Skipped ${skipped.length} invalid item(s) during import:`, skipped);
  }
  return { count: Object.keys(store.entries).length, label: label || "New batch", skipped };
}

export function renameBatch(subjectId, batchId, newLabel) {
  const store = loadStore(subjectId);
  if (!store.batches[batchId]) return;
  const trimmed = newLabel.trim();
  if (trimmed) store.batches[batchId].label = trimmed;
  saveStore(subjectId, store);
}

export function deleteBatch(subjectId, batchId) {
  const store = loadStore(subjectId);
  const batch = store.batches[batchId];
  if (!batch) return;
  for (const id of batch.itemIds) {
    let usedElsewhere = false;
    for (const [bId, b] of Object.entries(store.batches)) {
      if (bId !== batchId && b.itemIds.includes(id)) { usedElsewhere = true; break; }
    }
    if (!usedElsewhere) delete store.entries[id];
  }
  delete store.batches[batchId];
  saveStore(subjectId, store);
}

export function deleteItem(subjectId, itemId) {
  const store = loadStore(subjectId);
  delete store.entries[itemId];
  for (const bId in store.batches) {
    store.batches[bId].itemIds = store.batches[bId].itemIds.filter((id) => id !== itemId);
    if (store.batches[bId].itemIds.length === 0) delete store.batches[bId];
  }
  saveStore(subjectId, store);
}

export function getExportAllJson(subjectId) {
  return JSON.stringify(getAllEntries(subjectId), null, 2);
}

export function saveRawEntries(subjectId, jsonText) {
  const parsed = JSON.parse(jsonText);
  const store = loadStore(subjectId);
  for (const id of Object.keys(parsed)) {
    const existing = store.entries[id];
    store.entries[id] = existing ? { ...existing, ...parsed[id] } : parsed[id];
  }
  saveStore(subjectId, store);
}

export function clearAllImports(subjectId) {
  saveStore(subjectId, emptyStore());
}

// ---------- Progress (resume kung saan huling nag-stop) ----------

export function getSubjectProgress(subjectId) {
  try {
    const raw = localStorage.getItem(progressKey(subjectId));
    if (!raw) return { answers: {}, currentIndex: 0 };
    const parsed = JSON.parse(raw);
    return { answers: parsed.answers || {}, currentIndex: parsed.currentIndex || 0 };
  } catch {
    return { answers: {}, currentIndex: 0 };
  }
}

export function saveSubjectProgress(subjectId, progress) {
  try {
    const payload = { ...progress, updatedAt: new Date().toISOString() };
    localStorage.setItem(progressKey(subjectId), JSON.stringify(payload));
  } catch {}
}

export function resetSubjectProgress(subjectId) {
  localStorage.removeItem(progressKey(subjectId));
}

// Stats para sa dalawang progress circle sa dashboard.
export function getSubjectStats(subjectId) {
  const entries = getAllEntries(subjectId);
  const itemIds = Object.keys(entries);
  const total = itemIds.length;
  const progress = getSubjectProgress(subjectId);
  const answeredIds = Object.keys(progress.answers).filter((id) => entries[id]);
  const answeredCount = answeredIds.length;
  const correctCount = answeredIds.filter((id) => progress.answers[id] === entries[id].correct).length;
  return {
    total,
    answeredCount,
    correctCount,
    percentAnswered: total ? (answeredCount / total) * 100 : 0,
    percentCorrect: answeredCount ? (correctCount / answeredCount) * 100 : 0,
  };
}

// ============================================================
// DEFAULT SEED — auto-import from JSON files if empty
// ============================================================
import defaultCL from './data/defaultQuizzes/cl.json';
import defaultCDP from './data/defaultQuizzes/cdp.json';
import defaultTL from './data/defaultQuizzes/tl.json';
import defaultPC from './data/defaultQuizzes/pc.json';
import defaultTCP from './data/defaultQuizzes/tcp.json';

const defaultDataMap = {
  cl: defaultCL,
  cdp: defaultCDP,
  tl: defaultTL,
  pc: defaultPC,
  tcp: defaultTCP,
};

export function seedDefaultQuizzes() {
  for (const [subjectId, data] of Object.entries(defaultDataMap)) {
    const existing = getAllEntries(subjectId);
    if (Object.keys(existing).length === 0) {
      try {
        const jsonString = JSON.stringify(data);
        const result = importSubjectQuizJson(subjectId, jsonString);
        const skippedNote = result.skipped.length ? `, skipped ${result.skipped.length} invalid: ${result.skipped.join(", ")}` : "";
        console.log(`✅ Seeded default quiz for ${subjectId} (${result.count} items${skippedNote})`);
      } catch (e) {
        console.warn(`Failed to seed ${subjectId}:`, e);
      }
    }
  }
}
```

## File: ./frontend/src/firebase.js
```
// Firebase setup — Google Sign-In + Firestore (user profile at subscriptions)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARhpqrQM2WysnLDYNi7zHAm7gnsJt4X5I",
  authDomain: "ra10863.firebaseapp.com",
  projectId: "ra10863",
  storageBucket: "ra10863.firebasestorage.app",
  messagingSenderId: "160101866737",
  appId: "1:160101866737:web:3fce8b9e40a9139b211d50",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Local IndexedDB cache para may bumabalik pang datos (profile, subscriptions)
// kahit walang internet — kailangan lalo na sa APK offline-first na app.
enableIndexedDbPersistence(db).catch((err) => {
  console.warn("Firestore offline persistence not enabled:", err.code || err);
});
```

## File: ./frontend/src/authContext.jsx
```
import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  signInWithRedirect, signInWithPopup, getRedirectResult, onAuthStateChanged, signOut,
  setPersistence, indexedDBLocalPersistence, signInWithCredential, GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot, runTransaction, getDocFromServer } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { setServerClock, persistClock, getAccess, hasAnyPractice, TRIAL_DAYS } from "./access";

const DEVICE_ID_KEY = "cuble_deviceId";
const PENDING_SIGNIN_KEY = "cuble_pendingSignIn";
const PROFILE_CACHE_KEY = "cuble_profileCache_";

function makeId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return "dev-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = makeId();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function guessDeviceLabel() {
  const ua = navigator.userAgent || "";
  if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
    return "CuBLE App (Android)";
  }
  if (/Android/i.test(ua)) return "Android · Chrome";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS · Safari";
  return "Desktop · Browser";
}

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsFullName, setNeedsFullName] = useState(false);
  const [deviceLimitReached, setDeviceLimitReached] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(() => localStorage.getItem(PENDING_SIGNIN_KEY) === "1");
  const [authError, setAuthError] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [signingIn, setSigningIn] = useState(() => localStorage.getItem(PENDING_SIGNIN_KEY) === "1");
  const currentDeviceId = getOrCreateDeviceId();

  // ── Trial / App Access (oras ng server, real-time) ──────────────────
  const [serverData, setServerData] = useState(null);
  const [clockReady, setClockReady] = useState(false);
  const [tick, setTick] = useState(0);
  const [intentPlanId, setIntentPlanId] = useState(null);
  const initDoneFor = useRef(null);
  const uid = user ? user.uid : null;

  useEffect(() => {
    if (!uid) {
      setServerData(null);
      setClockReady(false);
      initDoneFor.current = null;
      return;
    }
    const ref = doc(db, "users", uid);
    const unsub = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      (snap) => {
        if (!snap.exists()) return;
        setServerData(snap.data());
        // Hintayin ang totoong datos ng server (hindi cache) bago gumawa ng trial.
        if (snap.metadata.fromCache || snap.metadata.hasPendingWrites || initDoneFor.current === uid) return;
        initDoneFor.current = uid;
        (async () => {
          let applied = true;
          try {
            await runTransaction(db, async (tx) => {
              const s = await tx.get(ref);
              if (!s.exists()) { applied = false; return; }
              const d = s.data();
              const upd = { lastSeenAt: serverTimestamp() };
              // Isang beses lang ang trial bawat account; hindi na ulit kapag meron na
              // o kapag may bayad na practice subject na.
              if (!d.trial && !hasAnyPractice(d)) {
                upd.trial = { startedAt: serverTimestamp(), days: TRIAL_DAYS };
              }
              // The separate RA 10863 (CL) trial is retired: Level 1 is free for everyone now.
              tx.update(ref, upd);
            });
            if (!applied) { initDoneFor.current = null; return; }
            const fresh = await getDocFromServer(ref);
            const ls = fresh.data() && fresh.data().lastSeenAt;
            if (ls && ls.toMillis) setServerClock(ls.toMillis());
          } catch (e) {
            console.warn("trial/clock sync failed:", e);
          }
          setClockReady(true);
        })();
      },
      (err) => {
        console.warn("profile listener error:", err);
        setClockReady(true);
      }
    );
    const fallback = setTimeout(() => setClockReady(true), 6000);
    return () => { unsub(); clearTimeout(fallback); };
  }, [uid]);

  useEffect(() => {
    const id = setInterval(() => { setTick((t) => t + 1); persistClock(); }, 15000);
    return () => clearInterval(id);
  }, []);

  // Ang server data ang masusunod para sa access fields (real-time kapag nag-approve si admin).
  const mergedProfile = useMemo(() => {
    if (!profile || !serverData) return profile;
    const pick = {};
    ["subscriptions", "subscriptionExpiry", "appAccess", "trial", "clTrial", "createdAt", "pendingPurchases", "pendingAccess", "isAdmin", "bonuses"].forEach((k) => {
      pick[k] = serverData[k];
    });
    if (!pick.subscriptions) pick.subscriptions = profile.subscriptions;
    return { ...profile, ...pick };
  }, [profile, serverData]);

  const access = getAccess(mergedProfile, { clockReady });

  const syncProfile = useCallback(async (fbUser) => {
    setProfileError(null);
    try {
    const ref = doc(db, "users", fbUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const fresh = {
        email: fbUser.email || "",
        displayName: fbUser.displayName || "",
        photoURL: fbUser.photoURL || "",
        fullName: null,
        createdAt: serverTimestamp(),
        devices: [{ id: currentDeviceId, label: guessDeviceLabel(), lastActive: Date.now() }],
        subscriptions: { CL: false, TL: false, CDP: false, PC: false, TCP: false },
      };
      await setDoc(ref, fresh);
      setProfile(fresh);
      try { localStorage.setItem(PROFILE_CACHE_KEY + fbUser.uid, JSON.stringify(fresh)); } catch (_) {}
      setNeedsFullName(true);
      setDeviceLimitReached(false);
      return;
    }

    const data = snap.data();
    try { localStorage.setItem(PROFILE_CACHE_KEY + fbUser.uid, JSON.stringify(data)); } catch (_) {}
    const devices = data.devices || [];
    const already = devices.find((d) => d.id === currentDeviceId);

    if (already) {
      const updated = devices.map((d) =>
        d.id === currentDeviceId ? { ...d, lastActive: Date.now() } : d
      );
      await updateDoc(ref, { devices: updated });
      setProfile({ ...data, devices: updated });
      setDeviceLimitReached(false);
    } else if (devices.length < 2) {
      const updated = [...devices, { id: currentDeviceId, label: guessDeviceLabel(), lastActive: Date.now() }];
      await updateDoc(ref, { devices: updated });
      setProfile({ ...data, devices: updated });
      setDeviceLimitReached(false);
    } else {
      setProfile(data);
      setDeviceLimitReached(true);
    }
    setNeedsFullName(!data.fullName);
    } catch (err) {
      console.warn("syncProfile failed:", err);
      setProfileError((err && err.code ? err.code : "error") + (err && err.message ? " — " + err.message : ""));
      let restored = false;
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY + fbUser.uid);
        if (cached) { setProfile(JSON.parse(cached)); restored = true; }
      } catch (_) {}
      if (!restored) {
        // Fallback: gamitin ang Google account info para hindi blangko ang profile.
        setProfile({
          email: fbUser.email || "",
          displayName: fbUser.displayName || "",
          photoURL: fbUser.photoURL || "",
          fullName: fbUser.displayName || fbUser.email || "",
          devices: [{ id: currentDeviceId, label: guessDeviceLabel(), lastActive: Date.now() }],
          subscriptions: { CL: false, TL: false, CDP: false, PC: false, TCP: false },
          _localOnly: true,
        });
        setNeedsFullName(false);
      }
      setDeviceLimitReached(false);
    }
  }, [currentDeviceId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        let hasCached = false;
        try {
          const cached = localStorage.getItem(PROFILE_CACHE_KEY + fbUser.uid);
          if (cached) {
            const parsedCached = JSON.parse(cached);
            setProfile(parsedCached);
            setNeedsFullName(!parsedCached.fullName);
            hasCached = true;
          }
        } catch (_) {}
        if (hasCached) {
          setLoading(false);
          syncProfile(fbUser);
        } else {
          await syncProfile(fbUser);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setProfileError(null);
        setNeedsFullName(false);
        setDeviceLimitReached(false);
        setLoading(false);
      }
    });
    return unsub;
  }, [syncProfile]);

  // Catch the result of signInWithRedirect after the page navigates back.
  useEffect(() => {
    const wasPending = localStorage.getItem(PENDING_SIGNIN_KEY) === "1";
    getRedirectResult(auth)
      .catch((err) => {
        console.warn("getRedirectResult error:", err);
        const code = err?.code || "unknown-error";
        const msg = err?.message || "";
        setAuthError(`[${code}] ${msg || "Sign-in could not be completed. Please try again."}`);
      })
      .finally(() => {
        if (wasPending) {
          localStorage.removeItem(PENDING_SIGNIN_KEY);
          setSigningIn(false);
        }
      });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    setSigningIn(true);
    localStorage.setItem(PENDING_SIGNIN_KEY, "1");
    try {
      await setPersistence(auth, indexedDBLocalPersistence);
    } catch (persistErr) {
      console.warn("setPersistence failed:", persistErr);
    }
    const isNative = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
    try {
      if (isNative) {
        // APK: native Google Sign-In — pareho pa rin ang Firebase project + Google account,
        // kaya pareho rin ang uid; hindi maaapektuhan ang subscriptions/trial ng existing users.
        const result = await FirebaseAuthentication.signInWithGoogle();
        const idToken = result.credential && result.credential.idToken;
        if (!idToken) throw new Error("No idToken from native Google Sign-In.");
        await signInWithCredential(auth, GoogleAuthProvider.credential(idToken));
        localStorage.removeItem(PENDING_SIGNIN_KEY);
        setSigningIn(false);
      } else {
        const isLocalDev = ["localhost", "127.0.0.1"].includes(window.location.hostname);
        if (isLocalDev) {
          // Dev only: redirect sign-in loops here because the Firebase handler is another origin.
          await signInWithPopup(auth, googleProvider);
          localStorage.removeItem(PENDING_SIGNIN_KEY);
          setSigningIn(false);
        } else {
          await signInWithRedirect(auth, googleProvider);
        }
        // Page navigates away here — code after this line generally won't run.
      }
    } catch (err) {
      console.warn("Google sign-in error:", err);
      const code = err?.code || "unknown-error";
      const msg = err?.message || "";
      setAuthError(`[${code}] ${msg || "Sign-in could not be completed. Please try again."}`);
      setSigningIn(false);
      localStorage.removeItem(PENDING_SIGNIN_KEY);
    }
  }, []);

  const signOutUser = useCallback(() => signOut(auth), []);

  const completeFullName = useCallback(async (fullName) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), { fullName });
    setProfile((p) => ({ ...p, fullName }));
    setNeedsFullName(false);
  }, [user]);

  const removeDevice = useCallback(async (deviceId) => {
    if (!user || !profile) return;
    const ref = doc(db, "users", user.uid);
    const updated = (profile.devices || []).filter((d) => d.id !== deviceId);
    await updateDoc(ref, { devices: updated });
    setProfile((p) => ({ ...p, devices: updated }));

    if (deviceId === currentDeviceId) {
      await signOut(auth);
      return;
    }
    if (deviceLimitReached) {
      await syncProfile(user);
    }
  }, [user, profile, currentDeviceId, deviceLimitReached, syncProfile]);

  const value = {
    user, profile: mergedProfile, loading, needsFullName, deviceLimitReached, currentDeviceId,
    access, clockReady, tick, intentPlanId, setIntentPlanId,
    overlayOpen, setOverlayOpen, authError, profileError, signingIn,
    signInWithGoogle, signOutUser, completeFullName, removeDevice,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
```

## File: ./frontend/src/payments.js
```
// Payment plans, payment method list, reference-code generator, and the Firestore
// write for the manual GCash / Maya / MariBank subscription flow.
//
// `months`      = how long the subject(s) stay unlocked after approval.
// `bonusMonths` = bundles only (shown in the UI as "+ N months App Access").
//                 App Access for every plan is granted by computeGrant() in access.js.

import gcashQr from "./assets/payment/gcash-qr.png";
import mayaQr from "./assets/payment/maya-qr.png";
import maribankQr from "./assets/payment/maribank-qr.png";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "./firebase";
import { ACCESS_PLANS } from "./access";

export const PLANS = [
  { id: "CL", label: "RA 10863 (CMTA)", price: 199, months: 4, subjects: ["CL"] },
  { id: "TL", label: "Tariff Law", price: 120, months: 3, subjects: ["TL"] },
  { id: "CDP", label: "Customs Documentation & Procedures", price: 120, months: 3, subjects: ["CDP"] },
  { id: "PC", label: "Practical Computations", price: 120, months: 3, subjects: ["PC"] },
  { id: "TCP", label: "Tariff Commission Primer", price: 229, months: 3, subjects: ["TCP"] },
  { id: "BUNDLE", label: "Normal Bundle", price: 380, months: 6, subjects: ["CL", "TL", "CDP", "PC"], bonusMonths: 6 },
  { id: "ALL", label: "Sulit Bundle", price: 450, months: 6, subjects: ["CL", "TL", "CDP", "PC", "TCP"], bonusMonths: 6 },
];

// ── PROMO MODE ───────────────────────────────────────────────────────
// true  = ang makikita lang ng user ay ang PROMO bundle (lahat ng lumang plan = "ghost":
//         buo pa ang logic, pero hindi na ma-avail ng bagong bibili).
// false = bumalik sa dating subscription plans.
// Hindi naaapektuhan ang kasalukuyang subscribers (walang binabago sa data nila).
export const PROMO_MODE = true;
export const PROMO_PRICE = 100;
export const PROMO_DAYS = 30;
export const PROMO_PLAN = {
  id: "PROMO",
  kind: "promo",
  label: "All Access Promo",
  tagline: "One promo, everything unlocked. This is the only plan available right now.",
  price: PROMO_PRICE,
  days: PROMO_DAYS,
  months: 0,
  subjects: ["CL", "TL", "CDP", "PC", "TCP"],
};

// Price of RA 10863 (CL). The name is kept so existing imports keep working,
// but CL is no longer lifetime — it now expires after 4 months.
export const CL_LIFETIME_PRICE = PLANS.find((p) => p.id === "CL").price;
export const CL_PRICE = CL_LIFETIME_PRICE;

export const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", qr: gcashQr },
  { id: "maya", label: "Maya", qr: mayaQr },
  { id: "maribank", label: "MariBank", qr: maribankQr },
];

// No 0/O/1/I so codes are not confused when written in the payment note.
const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReferenceCode(planId) {
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `${planId}-${suffix}`;
}

// setDoc + merge: if the user doc does not exist yet this creates it (with
// email/name) so the purchase still shows up in the Admin Panel.
// serverTimestamp() is not allowed inside arrayUnion, so Date.now() is used.
export async function submitPendingPurchase(uid, { planId, subjects, price, method, referenceCode }) {
  const ref = doc(db, "users", uid);
  const u = auth.currentUser;
  // App Access plans (M1/M3/M8) have their own pending list.
  const field = ACCESS_PLANS.some((p) => p.id === planId) ? "pendingAccess" : "pendingPurchases";
  await setDoc(
    ref,
    {
      email: (u && u.email) || "",
      displayName: (u && u.displayName) || "",
      photoURL: (u && u.photoURL) || "",
      [field]: arrayUnion({
        plan: planId,
        subjects,
        price,
        method,
        referenceCode,
        requestedAt: Date.now(),
      }),
    },
    { merge: true }
  );
}
```

## File: ./frontend/src/access.js
```
// access.js — server clock, 3-day trial, App Access plans, and per-subject expiry.
// Pure functions only (no React) so they can be used anywhere.
//
// TWO SEPARATE THINGS:
//  1) APP ACCESS      -> can the user open the app (trial / paid months)
//  2) PRACTICE ACCESS -> `subscriptions` (CL/TL/CDP/PC/TCP) + `subscriptionExpiry`.
//     A subject flag with NO expiry is a legacy "lifetime" subscription and never expires.

export const TRIAL_DAYS = 3;
export const DAY_MS = 24 * 60 * 60 * 1000;

// true  = anyone with a paid practice subject always has app access.
// false = everyone (except admin) needs a trial / App Access.
export const PRACTICE_BUYERS_KEEP_APP_ACCESS = false;

export const ACCESS_PLANS = [
  { id: "M1", kind: "access", months: 1, label: "App Access — 1 Month", price: 50, subjects: [] },
  { id: "M3", kind: "access", months: 3, label: "App Access — 3 Months", price: 139, subjects: [] },
  { id: "M8", kind: "access", months: 8, label: "App Access — 8 Months", price: 380, subjects: [] },
];

// ── Server clock ─────────────────────────────────────────────────────
// We do not trust the phone's clock. When online we read the Firestore server
// time and save the offset. Time never goes backwards (maxSeen), so rolling the
// phone clock back while offline cannot extend access.
const OFFSET_KEY = "cuble_clockOffset";
const MAXSEEN_KEY = "cuble_clockMaxSeen";

let offset = 0;
let maxSeen = 0;
try {
  offset = Number(localStorage.getItem(OFFSET_KEY)) || 0;
  maxSeen = Number(localStorage.getItem(MAXSEEN_KEY)) || 0;
} catch (_) {}

export function persistClock() {
  try {
    localStorage.setItem(OFFSET_KEY, String(offset));
    localStorage.setItem(MAXSEEN_KEY, String(maxSeen));
  } catch (_) {}
}

// Call this once the real server time (ms) is known.
export function setServerClock(serverMs) {
  offset = serverMs - Date.now();
  maxSeen = serverMs;
  persistClock();
}

export function serverNow() {
  const est = Date.now() + offset;
  if (est > maxSeen) maxSeen = est;
  return maxSeen;
}

// ── Helpers ──────────────────────────────────────────────────────────
// Accepts ms number, Firestore Timestamp, or {seconds,nanoseconds}
// (the shape a Timestamp has after coming back from the localStorage cache).
export function toMs(v) {
  if (v == null) return null;
  if (typeof v === "number") return v;
  if (typeof v.toMillis === "function") return v.toMillis();
  if (typeof v.seconds === "number") return v.seconds * 1000 + Math.floor((v.nanoseconds || 0) / 1e6);
  if (v instanceof Date) return v.getTime();
  return null;
}

export function hasAnyPractice(profile) {
  return Object.values((profile && profile.subscriptions) || {}).some(Boolean);
}

export function addMonths(ms, months) {
  const d = new Date(ms);
  d.setMonth(d.getMonth() + months);
  return d.getTime();
}

export function formatTimeLeft(ms) {
  if (!ms || ms <= 0) return "Expired";
  const d = Math.floor(ms / DAY_MS);
  const h = Math.floor((ms % DAY_MS) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (d > 0) return d + "d " + h + "h";
  if (h > 0) return h + "h " + m + "m";
  return Math.max(1, m) + "m";
}

export function formatDateShort(ms) {
  try {
    return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch (_) {
    return "";
  }
}

// ── Trial / App Access info ──────────────────────────────────────────
// trial = { startedAt: Timestamp(server), days: number }
export function getTrialInfo(profile, now = serverNow()) {
  const t = profile && profile.trial;
  let start = t ? toMs(t.startedAt) : null;
  let days = t ? (Number(t.days) || 0) : 0;
  let fromCreated = false;
  // Fallback: no trial field -> the account's createdAt starts the trial.
  if (start == null) { start = toMs(profile && profile.createdAt); days = TRIAL_DAYS; fromCreated = true; }
  if (start == null) return { exists: false, active: false, endsAt: null, msLeft: 0 };
  const endsAt = start + days * DAY_MS;
  if (fromCreated && endsAt <= now) return { exists: false, active: false, endsAt: null, msLeft: 0 };
  const msLeft = Math.max(0, endsAt - now);
  return { exists: true, active: msLeft > 0, endsAt, msLeft };
}

// appAccess = { plan: "M1"|"M3"|"M8"|..., expiresAt: ms }
export function getAppAccessInfo(profile, now = serverNow()) {
  const a = profile && profile.appAccess;
  const exp = toMs(a && a.expiresAt);
  if (!a || exp == null) return { exists: false, active: false, plan: null, expiresAt: null, msLeft: 0 };
  const msLeft = Math.max(0, exp - now);
  return { exists: true, active: msLeft > 0, plan: a.plan || null, expiresAt: exp, msLeft };
}

// state: "none" | "loading" | "admin" | "paid" | "member" | "trial" | "expired"
export function getAccess(profile, opts) {
  const clockReady = !opts || opts.clockReady !== false;
  const now = serverNow();
  if (!profile) return { state: "none", trial: getTrialInfo(null, now), app: getAppAccessInfo(null, now), msLeft: 0 };
  const trial = getTrialInfo(profile, now);
  const app = getAppAccessInfo(profile, now);
  if (profile.isAdmin) return { state: "admin", trial, app, msLeft: 0 };
  if (app.active) return { state: "paid", trial, app, msLeft: app.msLeft };
  if (PRACTICE_BUYERS_KEEP_APP_ACCESS && hasAnyPractice(profile)) return { state: "member", trial, app, msLeft: 0 };
  if (trial.active) return { state: "trial", trial, app, msLeft: trial.msLeft };
  if (!trial.exists && !clockReady) return { state: "loading", trial, app, msLeft: 0 };
  return { state: "expired", trial, app, msLeft: 0 };
}

// ── Legacy RA 10863 (CL) free trial ───────────────────────────────────
// The CL trial is retired: new signups get Level 1 for free instead.
// Only trials that STARTED BEFORE the cutoff below are still honored, so users
// who are mid-trial when this update ships do not lose it. Older app versions
// may still create a clTrial for new signups — those are ignored.
// >>> Set the cutoff to the day you deploy this update. <<<
export const CL_TRIAL_DAYS = 3;
export const CL_TRIAL_HONOR_BEFORE_MS = Date.UTC(2026, 9, 21); // 2026-10-21 00:00 UTC (covers an Oct 20 deploy)

export function getClTrialInfo(profile, now = serverNow()) {
  const none = { exists: false, active: false, endsAt: null, msLeft: 0 };
  const t = profile && profile.clTrial;
  const start = t ? toMs(t.startedAt) : null;
  if (start == null || start >= CL_TRIAL_HONOR_BEFORE_MS) return none;
  const days = Number(t.days) || 0;
  const endsAt = start + days * DAY_MS;
  const msLeft = Math.max(0, endsAt - now);
  return { exists: true, active: msLeft > 0, endsAt, msLeft };
}

// ── Per-subject expiry ────────────────────────────────────────────────
// subscriptions       = { CL: true, ... }
// subscriptionExpiry  = { CL: ms, ... }
// Flag true + NO expiry entry = legacy lifetime (grandfathered, never expires).
export const SUBJECT_CODES = ["CL", "TL", "CDP", "PC", "TCP"];
export const SUBJECT_TERM_MONTHS = { CL: 4, TL: 3, CDP: 3, PC: 3, TCP: 3 };

// lifetime: true -> expiresAt is null and msLeft is 0 (ignore msLeft, check `lifetime` first).
export function getSubjectInfo(profile, code, now = serverNow()) {
  const owned = !!(profile && profile.subscriptions && profile.subscriptions[code]);
  if (!owned) return { owned: false, active: false, lifetime: false, expiresAt: null, msLeft: 0 };
  const exp = toMs(profile.subscriptionExpiry && profile.subscriptionExpiry[code]);
  if (exp == null) return { owned: true, active: true, lifetime: true, expiresAt: null, msLeft: 0 };
  const msLeft = Math.max(0, exp - now);
  return { owned: true, active: msLeft > 0, lifetime: false, expiresAt: exp, msLeft };
}

export function isSubjectUnlocked(profile, code, now = serverNow()) {
  if (!profile) return false;
  if (profile.isAdmin) return true;
  return getSubjectInfo(profile, code, now).active;
}

export function countActiveSubjects(profile, now = serverNow()) {
  return SUBJECT_CODES.filter((c) => getSubjectInfo(profile, c, now).active).length;
}

// RA 10863 5-level quiz: Level 1 is free for everyone; Levels 2-5 need CL.
export function isClUnlocked(profile, now = serverNow()) {
  if (!profile) return false;
  if (profile.isAdmin) return true;
  if (getSubjectInfo(profile, "CL", now).active) return true;
  return getClTrialInfo(profile, now).active;
}

export function isRaLevelUnlocked(profile, levelId, now = serverNow()) {
  if (levelId === "level1") return true;
  return isClUnlocked(profile, now);
}

// ── Bonus / stacking ─────────────────────────────────────────────────
export const THREE_SUBJECT_BONUS = { count: 3, months: 3 };
// Old one-time migration (already ran). Kept only so existing imports keep working.
export const MIGRATION = { months3: 3, months12: 2, trialDays: TRIAL_DAYS };

export function countSubjects(subs) {
  return Object.values(subs || {}).filter(Boolean).length;
}

// Used by App Access plans (M1/M3/M8) and manual grants: adds to the end of the
// remaining time if still active, otherwise from now.
export function stackAccess(profile, months, now = serverNow()) {
  const cur = getAppAccessInfo(profile, now);
  return addMonths(cur.active ? cur.expiresAt : now, months);
}

// LEGACY (old lifetime flow). Kept so the current AdminPanel still compiles
// until it is switched to computeGrant().
export function planAward(profile, plan) {
  const owned = (profile && profile.subscriptions) || {};
  const next = { ...owned };
  (plan.subjects || []).forEach((c) => { next[c] = true; });
  const reached = countSubjects(owned) < THREE_SUBJECT_BONUS.count && countSubjects(next) >= THREE_SUBJECT_BONUS.count;
  const consumed = !!(profile && profile.bonuses && profile.bonuses.threeSubjects);
  const flag = reached && !consumed;
  let months = plan.bonusMonths || 0;
  if (flag && !plan.bonusMonths && (plan.subjects || []).length === 1) months += THREE_SUBJECT_BONUS.months;
  return { months, flag };
}

// NEW purchase flow (expiring subjects).
// plan = { subjects: [...], months: term in months, ... }
// Rules:
//  - Each purchased subject expires `months` after now, or after its current expiry
//    if still active (renewing early never loses days).
//  - Legacy lifetime subjects are never converted or shortened.
//  - App Access does NOT stack across subjects: it runs to the latest of
//    (current App Access end, latest purchased subject end).
//  - 3-subject bonus: counts ACTIVE subjects only, once per account, +3 months of
//    App Access only when a SINGLE-subject purchase is what reaches 3.
// Returns { termMonths, subjectExpiry: {CODE: ms}, appExpiresAt: ms|null, bonusFlag, bonusMonths }
export function computeGrant(profile, plan, now = serverNow()) {
  const term = plan.months || 0;
  const subjects = plan.subjects || [];
  const subjectExpiry = {};
  let latest = 0;

  subjects.forEach((code) => {
    const info = getSubjectInfo(profile, code, now);
    const base = info.active && !info.lifetime ? info.expiresAt : now;
    const end = addMonths(base, term);
    if (end > latest) latest = end;
    if (info.lifetime) return;
    subjectExpiry[code] = end;
  });

  const activeBefore = SUBJECT_CODES.filter((c) => getSubjectInfo(profile, c, now).active);
  const activeAfter = new Set(activeBefore.concat(subjects));
  const reached = activeBefore.length < THREE_SUBJECT_BONUS.count && activeAfter.size >= THREE_SUBJECT_BONUS.count;
  const consumed = !!(profile && profile.bonuses && profile.bonuses.threeSubjects);
  const bonusFlag = reached && !consumed;
  const bonusMonths = bonusFlag && subjects.length === 1 ? THREE_SUBJECT_BONUS.months : 0;

  if (subjects.length === 0 || term <= 0) {
    return { termMonths: term, subjectExpiry, appExpiresAt: null, bonusFlag: false, bonusMonths: 0 };
  }

  const cur = getAppAccessInfo(profile, now);
  let appEnd = Math.max(cur.active ? cur.expiresAt : 0, latest);
  if (bonusMonths > 0) appEnd = addMonths(appEnd, bonusMonths);
  const changed = !cur.active || appEnd > cur.expiresAt;

  return { termMonths: term, subjectExpiry, appExpiresAt: changed ? appEnd : null, bonusFlag, bonusMonths };
}


// ── PROMO "All Access" (days-based, hindi months) ─────────────────────
// - Bawat subject: +days. Kung active pa, idinadagdag sa dulo ng natitirang oras (walang nasasayang).
// - Legacy lifetime subjects: hindi ginagalaw.
// - App Access: idinadagdag din sa dulo kung active pa, kung hindi, mula ngayon.
// - Walang 3-subject bonus dito.
export function computePromoGrant(profile, plan, now = serverNow()) {
  const days = plan.days || 30;
  const span = days * DAY_MS;
  const subjectExpiry = {};
  (plan.subjects || []).forEach((code) => {
    const info = getSubjectInfo(profile, code, now);
    if (info.lifetime) return;
    const base = info.active ? info.expiresAt : now;
    subjectExpiry[code] = base + span;
  });
  const cur = getAppAccessInfo(profile, now);
  const appBase = cur.active ? cur.expiresAt : now;
  return { days, subjectExpiry, appExpiresAt: appBase + span, bonusFlag: false, bonusMonths: 0 };
}
```

## File: ./frontend/src/customQuizStore.js
```
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
```

## File: ./frontend/src/issuancesStore.js
```
import { IS_DEV } from "./env";

// CMO / CAO store. Same idea as aiContext.json for the CMTA:
//  (1) shipped data  = every .json inside src/data/issuances/ (bundled at build time)
//  (2) dev preview   = what you import in the Dev Panel (localStorage, npm run dev only)
// One JSON = official text (paragraphs) + Tagalog AI explanations, together.

const bundledModules = import.meta.glob("./data/issuances/*.json", { eager: true });
const DEV_KEY = "customsLaw_issuancesDevPreview";
const MAX_INDENT = 4;

export const ISSUANCE_KINDS = [
  { id: "cmta", label: "CMTA", icon: "⚖️", full: "Customs Modernization & Tariff Act" },
  { id: "cmo", label: "CMO", icon: "📜", full: "Customs Memorandum Orders" },
  { id: "cao", label: "CAO", icon: "📄", full: "Customs Administrative Orders" },
];

export const STATUS_META = {
  in_force: { label: "In force", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
  amended: { label: "Amended", cls: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  superseded: { label: "Superseded", cls: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
  revoked: { label: "Revoked", cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

const str = (v) => (v == null ? "" : String(v).trim());
const strList = (v) => (Array.isArray(v) ? v.map(str).filter(Boolean) : str(v) ? [str(v)] : []);
const slug = (s) => str(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const safeId = (s) => str(s).replace(/[^\w-]+/g, "_");

function normalizeAi(raw) {
  if (raw == null) return null;
  if (typeof raw === "string") return str(raw) ? { title: "", content: str(raw), prompt: "" } : null;
  if (typeof raw !== "object") return null;
  const ai = { title: str(raw.title), content: str(raw.content), prompt: str(raw.prompt) };
  return ai.title || ai.content || ai.prompt ? ai : null;
}

export function normalizeIssuance(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Each issuance must be a JSON object.");
  const type = str(raw.type).toUpperCase();
  if (type !== "CMO" && type !== "CAO") {
    throw new Error(`"type" must be "CMO" or "CAO" (got "${raw.type ?? ""}").`);
  }
  const number = str(raw.number)
    .replace(/^(CMO|CAO)\b\s*(NO\.?|NUMBER)?\s*/i, "")
    .replace(/\s+/g, "");
  if (!number) throw new Error(`${type}: missing "number" (example: "01-2020").`);
  const label = `${type} ${number}`;
  const id = `${type.toLowerCase()}-${slug(number)}`;

  let rawSections = Array.isArray(raw.sections) ? raw.sections : null;
  if (!rawSections && Array.isArray(raw.paragraphs)) rawSections = [{ paragraphs: raw.paragraphs }];
  if (!rawSections || !rawSections.length) {
    throw new Error(`${label}: needs a "sections" array (or a flat "paragraphs" array).`);
  }

  const usedSections = new Set();
  const sections = rawSections.map((rs, si) => {
    if (!rs || typeof rs !== "object") throw new Error(`${label}: section ${si + 1} must be an object.`);
    let sid = safeId(rs.id) || `s${si + 1}`;
    while (usedSections.has(sid)) sid += `_${si}`;
    usedSections.add(sid);

    const usedParas = new Set();
    const rawParas = Array.isArray(rs.paragraphs) ? rs.paragraphs : [];
    const paragraphs = rawParas.map((rp, pi) => {
      const obj = typeof rp === "string" ? { text: rp } : rp;
      if (!obj || typeof obj !== "object") {
        throw new Error(`${label}: section ${si + 1}, paragraph ${pi + 1} must be a string or an object.`);
      }
      const text = str(obj.text);
      if (!text) throw new Error(`${label}: section ${si + 1}, paragraph ${pi + 1} has no "text".`);
      let pid = safeId(obj.id) || `p${pi + 1}`;
      while (usedParas.has(pid)) pid += `_${pi}`;
      usedParas.add(pid);
      const indent = Math.max(0, Math.min(MAX_INDENT, parseInt(obj.indent, 10) || 0));
      return { id: pid, label: str(obj.label), indent, text, ai: normalizeAi(obj.ai) };
    });
    return { id: sid, heading: str(rs.heading), ai: normalizeAi(rs.ai), paragraphs };
  });

  const paragraphCount = sections.reduce((n, s) => n + s.paragraphs.length, 0);
  if (!paragraphCount) throw new Error(`${label}: no paragraphs found.`);
  const aiCount = sections.reduce((n, s) => n + s.paragraphs.filter((p) => p.ai).length, 0);

  const date_issued = str(raw.date_issued);
  const year = (number.match(/(\d{4})$/) || date_issued.match(/(\d{4})/) || [])[1] || "";
  const statusKey = str(raw.status).toLowerCase().replace(/[\s-]+/g, "_");

  return {
    id, type, number, label, year,
    title: str(raw.title),
    subject: str(raw.subject),
    date_issued,
    effectivity: str(raw.effectivity),
    status: STATUS_META[statusKey] ? statusKey : "in_force",
    amends: strList(raw.amends),
    amended_by: strList(raw.amended_by),
    related: strList(raw.related),
    keywords: strList(raw.keywords),
    ai: normalizeAi(raw.ai),
    sections, paragraphCount, aiCount,
  };
}

// The same shape you import = the same shape you export (round-trip safe).
function toExportShape(n) {
  const o = { type: n.type, number: n.number, title: n.title };
  if (n.subject) o.subject = n.subject;
  if (n.date_issued) o.date_issued = n.date_issued;
  if (n.effectivity) o.effectivity = n.effectivity;
  o.status = n.status;
  if (n.amends.length) o.amends = n.amends;
  if (n.amended_by.length) o.amended_by = n.amended_by;
  if (n.related.length) o.related = n.related;
  if (n.keywords.length) o.keywords = n.keywords;
  if (n.ai) o.ai = n.ai;
  o.sections = n.sections.map((s) => {
    const so = { id: s.id };
    if (s.heading) so.heading = s.heading;
    if (s.ai) so.ai = s.ai;
    so.paragraphs = s.paragraphs.map((p) => {
      const po = { id: p.id };
      if (p.label) po.label = p.label;
      if (p.indent) po.indent = p.indent;
      po.text = p.text;
      if (p.ai) po.ai = p.ai;
      return po;
    });
    return so;
  });
  return o;
}

function toItems(data) {
  return Array.isArray(data) ? data : Array.isArray(data?.issuances) ? data.issuances : [data];
}

// ── shipped (bundled) ────────────────────────────────────────────────
let bundledCache = null;
function getBundled() {
  if (bundledCache) return bundledCache;
  const out = {};
  for (const [path, mod] of Object.entries(bundledModules)) {
    for (const raw of toItems(mod.default ?? mod)) {
      try {
        const n = normalizeIssuance(raw);
        out[n.id] = { ...n, source: "bundled" };
      } catch (e) {
        console.warn(`[issuances] Skipped ${path}: ${e.message}`);
      }
    }
  }
  bundledCache = out;
  return out;
}

// ── dev preview (localStorage, dev only) ─────────────────────────────
function readPreviewText() {
  if (!IS_DEV) return "{}";
  try { return localStorage.getItem(DEV_KEY) || "{}"; } catch { return "{}"; }
}
function readPreviewRaw() {
  try { return JSON.parse(readPreviewText()); } catch { return {}; }
}
let previewCache = { text: null, value: {} };
function getPreview() {
  const text = readPreviewText();
  if (previewCache.text === text) return previewCache.value;
  const out = {};
  for (const raw of Object.values(readPreviewRaw())) {
    try {
      const n = normalizeIssuance(raw);
      out[n.id] = { ...n, source: "preview" };
    } catch { /* ignore broken preview entries */ }
  }
  previewCache = { text, value: out };
  return out;
}
function writePreviewRaw(obj) {
  localStorage.setItem(DEV_KEY, JSON.stringify(obj));
}

function getAll() {
  return { ...getBundled(), ...getPreview() };
}

// ── public read API ──────────────────────────────────────────────────
function toSummary(i) {
  return {
    id: i.id, type: i.type, number: i.number, label: i.label, year: i.year,
    title: i.title, subject: i.subject, status: i.status, keywords: i.keywords,
    paragraphCount: i.paragraphCount, aiCount: i.aiCount,
    hasAi: i.aiCount > 0 || !!i.ai, source: i.source,
  };
}

function compare(a, b) {
  if (a.year !== b.year) {
    if (!a.year) return 1;
    if (!b.year) return -1;
    return b.year.localeCompare(a.year); // newest year first
  }
  return (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0); // 01, 02, 03...
}

export function listIssuances(kind) {
  const t = String(kind).toUpperCase();
  return Object.values(getAll()).filter((i) => i.type === t).map(toSummary).sort(compare);
}

export function getIssuance(id) {
  return getAll()[id] || null;
}

// "CMO 12-2016", "CMO No. 12-2016", "CAO 05-2019"  ->  summary or null
export function resolveIssuanceRef(text) {
  const m = String(text || "").match(/\b(CMO|CAO)\s*(?:NO\.?\s*)?(\d{1,3}\s*-\s*\d{4})/i);
  if (!m) return null;
  const i = getAll()[`${m[1].toLowerCase()}-${slug(m[2])}`];
  return i ? toSummary(i) : null;
}

// ── dev import / export ──────────────────────────────────────────────
function stripFences(text) {
  return String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

export function importIssuanceJson(text) {
  if (!IS_DEV) throw new Error("Import is only available in npm run dev.");
  let data;
  try { data = JSON.parse(stripFences(text)); } catch (e) { throw new Error("Invalid JSON: " + e.message); }
  const items = toItems(data);
  if (!items.length) throw new Error("The JSON is empty.");
  const normalized = items.map(normalizeIssuance); // throws before anything is saved
  const store = readPreviewRaw();
  for (const n of normalized) store[n.id] = toExportShape(n);
  writePreviewRaw(store);
  return normalized.map((n) => ({ id: n.id, label: n.label, paragraphCount: n.paragraphCount, aiCount: n.aiCount }));
}

export function getPreviewList() {
  return Object.values(getPreview()).map(toSummary).sort((a, b) => a.type.localeCompare(b.type) || compare(a, b));
}

export function deletePreviewIssuance(id) {
  const store = readPreviewRaw();
  delete store[id];
  writePreviewRaw(store);
}

export function clearPreview() {
  if (IS_DEV) localStorage.removeItem(DEV_KEY);
}

export function exportIssuanceJson(id) {
  const n = getIssuance(id);
  return n ? JSON.stringify(toExportShape(n), null, 2) : "";
}

export function exportManyJson(kind) {
  const t = String(kind).toUpperCase();
  const all = Object.values(getPreview()).filter((i) => i.type === t).sort(compare);
  return JSON.stringify(all.map(toExportShape), null, 2);
}

export function issuanceFileName(id) {
  return `${id}.json`;
}

// ── template + prompt ────────────────────────────────────────────────
export const ISSUANCE_TEMPLATE = JSON.stringify(
  {
    type: "CMO",
    number: "00-2099",
    title: "[SAMPLE] Replace everything in this template",
    subject: "One-line topic of the order",
    date_issued: "January 1, 2099",
    effectivity: "15 days after publication",
    status: "in_force",
    amends: [],
    related: ["CMTA Sec. 102"],
    keywords: ["sample", "template"],
    ai: {
      title: "Overview ng CMO 00-2099",
      content: "📖 Kahulugan\n[Tagalog explanation here]\n\n💡 Simpleng Paliwanag\n[Tagalog explanation here]",
      prompt: "Explain this Customs Memorandum Order simply, with practical customs examples.",
    },
    sections: [
      {
        id: "s1",
        heading: "I. OBJECTIVE",
        paragraphs: [
          { id: "p1", label: "1.", text: "[Official paragraph text, copied exactly from the document.]" },
        ],
      },
      {
        id: "s2",
        heading: "II. PROCEDURE",
        paragraphs: [
          {
            id: "p1",
            label: "2.1",
            text: "[Official paragraph text.]",
            ai: {
              title: "Procedure",
              content: "📖 Kahulugan\n[Tagalog]\n\n⚠️ Dapat Tandaan\n[Tagalog]",
              prompt: "Explain this procedure step by step with an example at the airport or seaport.",
            },
          },
          { id: "p2", label: "a.", indent: 1, text: "[Sub-paragraph text, nested one level.]" },
        ],
      },
    ],
  },
  null,
  2
);

export const ISSUANCE_PROMPT = String.raw`🧠 CMO / CAO → STUDY-JSON GENERATION PROMPT
You are an expert Philippine Customs Broker, customs-law educator, and content writer for the CMTA study app.
Convert the OFFICIAL TEXT of ONE Customs Memorandum Order (CMO) or Customs Administrative Order (CAO) — pasted at the very bottom — into ONE valid JSON object the app can import directly. The official text and the Tagalog study guides must come out TOGETHER in this single JSON.

OUTPUT RULES
- Output ONLY the JSON. No markdown fences, no commentary before or after.
- The official text is the only legal source. Copy it VERBATIM (same wording, numbering, punctuation). Never paraphrase, shorten, reorder, or "fix" it. Never invent provisions.
- Keep the same paragraph structure as the original document: one entry per paragraph / numbered item, in the original order.
- "label" = the numbering exactly as printed (e.g. "1.", "2.1", "a.", "(i)"). Do NOT repeat the label inside "text".
- "indent" = nesting depth 0–4 (0 = main paragraph, 1 = sub-item, 2 = sub-sub-item).
- Group paragraphs under the document's own headings (e.g. "I. OBJECTIVE", "Section 3. Scope") using "sections". If there are no headings, use one section without "heading".
- Tables or lists inside a paragraph: write them as plain text, one row/item per line, using the two characters backslash-n as the line break. Never put real line breaks inside a JSON string.

FIELDS
Top level: type ("CMO" or "CAO"), number (e.g. "01-2020"), title, subject (one-line topic), date_issued (as printed), effectivity (as printed), status ("in_force", "amended", "superseded" or "revoked" — only if the pasted text says so, otherwise "in_force"), amends (array, e.g. ["CMO 12-2016"]), related (array of related CMTA sections / orders, e.g. ["CMTA Sec. 102", "CAO 05-2019"]), keywords (array), ai (overview study guide), sections (array).
Section: id ("s1", "s2", ...), heading, paragraphs (array), ai (optional).
Paragraph: id ("p1", "p2", ... unique inside its section), label, indent, text, ai (optional).
ai object: { "title": "...", "content": "...", "prompt": "..." }

AI STUDY GUIDE RULES (every "ai" object)
- Language: simple, conversational Tagalog, like a mentor teaching a student. Keep legal terms in English. Do not sound robotic. Do not just repeat the text. Never contradict the CMTA. Never invent cases, penalties, deadlines or requirements that are not in the text.
- Top-level "ai" (overview) uses the full format, in this order: 📖 Kahulugan · 🔍 Breakdown · 💡 Simpleng Paliwanag · 📦 Halimbawa (one realistic customs scenario) · ⭐ Bakit Mahalaga Ito? · ⚠️ Dapat Tandaan · 🎯 Board Exam Tip · ❓ Madalas Malito ang Students (one question + answer) · 🔗 Related Topics.
- Paragraph / section "ai": every paragraph gets an "ai" object -- wala nang pure skip, maliban na lang kung puro bare heading label with zero text. Pumili ng tamang tier:
  - Substantive (rules, requirements, procedures, deadlines, penalties, definitions) -> short format: 📖 Kahulugan · 💡 Simpleng Paliwanag · ⚠️ Dapat Tandaan (📦 Halimbawa kung kailangan talaga).
  - Boilerplate / scope items / intro clauses / procedural connectors (effectivity, repealing clause, dissemination, "This Order covers:", atbp.) -> huwag nang iwanan sa English lang. Gumamit ng mini Tanong-Sagot breakdown (1-2 exchanges lang), hindi flat paraphrase:

    Tanong: [simpleng tanong na natural itatanong ng estudyante tungkol dito]
    Sagot: [1-2 pangungusap, plain Tagalog, parang kaklase mong nagpapaliwanag]

  Dapat conversational at madaling basahin ang Q&A na ito -- huwag word-for-word na salin lang ng English.
- "title": short topic label. "content": the Tagalog guide with the emoji headings above, separated by blank lines (use backslash-n backslash-n).
- "prompt": a ready-to-send prompt for an external AI (ChatGPT / Gemini / Meta AI) asking it to explain this part simply, give practical customs examples, explain why it exists, mention related provisions, and clarify common misconceptions. Do NOT paste the official text into "prompt" — the app appends it automatically.

SHAPE EXAMPLE (structure only — replace all content)
{"type":"CMO","number":"01-2020","title":"...","status":"in_force","ai":{"title":"...","content":"...","prompt":"..."},"sections":[{"id":"s1","heading":"I. OBJECTIVE","paragraphs":[{"id":"p1","label":"1.","text":"...","ai":{"title":"...","content":"...","prompt":"..."}},{"id":"p2","label":"a.","indent":1,"text":"..."}]}]}

OFFICIAL TEXT (the only source of truth):
`;
```

## File: ./frontend/src/issuanceQuizStore.js
```
import { IS_DEV } from "./env";
import { getIssuance } from "./issuancesStore";

// CMO / CAO QUIZ store (separate from the CMO/CAO text on purpose).
//  (1) shipped data = every .json inside src/data/issuance-quizzes/ (bundled at build time)
//  (2) dev preview  = what you import in Dev Panel -> "CMO/CAO Quiz" (localStorage, npm run dev only)
// A quiz is linked to its CMO/CAO by type + number (same id as issuancesStore, e.g. "cmo-01-2020"),
// so the order you import them in does not matter.

const bundledModules = import.meta.glob("./data/issuance-quizzes/*.json", { eager: true });
const DEV_KEY = "customsLaw_issuanceQuizDevPreview";
const LETTERS = ["A", "B", "C", "D"];

// Level 1 is free for everyone, Level 2 follows the same RA 10863 lock as the other quizzes
// (that lock lives in QuizPlayView / isRaLevelUnlocked, nothing to do here).
export const QUIZ_LEVELS = [
  { id: "level1", label: "🟢 Level 1 — Definition", lang: "Filipino · identification", color: "green" },
  { id: "level2", label: "🔵 Level 2 — Real Case", lang: "English · case / problem solving", color: "blue" },
];

const str = (v) => (v == null ? "" : String(v).trim());
const slug = (s) => str(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function normalizeChoices(raw, where) {
  const out = {};
  if (Array.isArray(raw)) {
    if (raw.length !== 4) throw new Error(`${where}: "choices" must have exactly 4 items (A, B, C, D).`);
    raw.forEach((c, i) => { out[LETTERS[i]] = str(c).replace(/^\(?[A-Da-d][.):]\s+/, ""); });
  } else if (raw && typeof raw === "object") {
    for (const L of LETTERS) out[L] = str(raw[L] ?? raw[L.toLowerCase()]);
  } else {
    throw new Error(`${where}: missing "choices" (needs A, B, C and D).`);
  }
  const missing = LETTERS.filter((L) => !out[L]);
  if (missing.length) throw new Error(`${where}: missing choice ${missing.join(", ")}. Each question needs choices A, B, C and D.`);
  return out;
}

function normalizeCorrect(v, choices, where) {
  const s = str(v);
  const m = s.match(/^\(?([A-Da-d])\)?(?:[.):]|$)/);
  if (m) return m[1].toUpperCase();
  const byText = LETTERS.find((L) => choices[L].toLowerCase() === s.toLowerCase());
  if (byText && s) return byText;
  throw new Error(`${where}: "correct" must be one letter A, B, C or D (got "${s}").`);
}

function normalizeQuestion(q, where) {
  if (!q || typeof q !== "object") throw new Error(`${where}: must be an object.`);
  const question = str(q.question);
  if (!question) throw new Error(`${where}: missing "question".`);
  const choices = normalizeChoices(q.choices, where);
  const correct = normalizeCorrect(q.correct, choices, where);
  return { question, choices, correct, reason: str(q.reason) };
}

function normalizeLevel(raw, levelId, label) {
  if (raw == null) return [];
  if (!Array.isArray(raw)) throw new Error(`${label}: "${levelId}" must be an array of questions.`);
  const n = levelId === "level1" ? 1 : 2;
  return raw.map((q, i) => normalizeQuestion(q, `${label} Level ${n}, question ${i + 1}`));
}

export function normalizeQuiz(raw) {
  if (!raw || typeof raw !== "object") throw new Error("Each quiz must be a JSON object.");
  const type = str(raw.type).toUpperCase();
  if (type !== "CMO" && type !== "CAO") throw new Error(`"type" must be "CMO" or "CAO" (got "${raw.type ?? ""}").`);
  const number = str(raw.number)
    .replace(/^(CMO|CAO)\b\s*(NO\.?|NUMBER)?\s*/i, "")
    .replace(/\s+/g, "");
  if (!number) throw new Error(`${type}: missing "number" (example: "01-2020").`);
  const label = `${type} ${number}`;
  const id = `${type.toLowerCase()}-${slug(number)}`;
  const level1 = normalizeLevel(raw.level1, "level1", label);
  const level2 = normalizeLevel(raw.level2, "level2", label);
  if (!level1.length && !level2.length) throw new Error(`${label}: needs a "level1" and/or "level2" array with questions.`);
  return { id, type, number, label, level1, level2 };
}

function toExportShape(n) {
  return { type: n.type, number: n.number, level1: n.level1, level2: n.level2 };
}

function toItems(data) {
  return Array.isArray(data) ? data : Array.isArray(data?.quizzes) ? data.quizzes : [data];
}

// ── shipped (bundled) ────────────────────────────────────────────────
let bundledCache = null;
function getBundled() {
  if (bundledCache) return bundledCache;
  const out = {};
  for (const [path, mod] of Object.entries(bundledModules)) {
    for (const raw of toItems(mod.default ?? mod)) {
      try {
        const n = normalizeQuiz(raw);
        out[n.id] = { ...n, source: "bundled" };
      } catch (e) {
        console.warn(`[issuance-quiz] Skipped ${path}: ${e.message}`);
      }
    }
  }
  bundledCache = out;
  return out;
}

// ── dev preview (localStorage, dev only) ─────────────────────────────
function readPreviewText() {
  if (!IS_DEV) return "{}";
  try { return localStorage.getItem(DEV_KEY) || "{}"; } catch { return "{}"; }
}
function readPreviewRaw() {
  try { return JSON.parse(readPreviewText()); } catch { return {}; }
}
let previewCache = { text: null, value: {} };
function getPreview() {
  const text = readPreviewText();
  if (previewCache.text === text) return previewCache.value;
  const out = {};
  for (const raw of Object.values(readPreviewRaw())) {
    try {
      const n = normalizeQuiz(raw);
      out[n.id] = { ...n, source: "preview" };
    } catch { /* ignore broken preview entries */ }
  }
  previewCache = { text, value: out };
  return out;
}
function writePreviewRaw(obj) {
  localStorage.setItem(DEV_KEY, JSON.stringify(obj));
}
function getAll() {
  return { ...getBundled(), ...getPreview() };
}

// ── public read API ──────────────────────────────────────────────────
// Returns the quiz for one CMO/CAO id (e.g. "cmo-01-2020") or null when it has none.
export function getIssuanceQuiz(issuanceId) {
  const q = getAll()[issuanceId];
  return q && (q.level1.length || q.level2.length) ? q : null;
}

// All CMO / CAO that have a quiz (bundled + dev preview) for the Quiz/Exam list.
// type = "CMO" | "CAO". Title/subject come from the CMO/CAO text when it is imported.
export function listIssuanceQuizzes(type) {
  const t = String(type).toUpperCase();
  return Object.values(getAll())
    .filter((q) => q.type === t && (q.level1.length || q.level2.length))
    .map((q) => {
      const iss = getIssuance(q.id);
      return {
        id: q.id, type: q.type, number: q.number, label: q.label,
        year: yearOf(q.number),
        title: (iss && iss.title) || "",
        subject: (iss && iss.subject) || "",
        l1: q.level1.length, l2: q.level2.length,
      };
    })
    .sort(compare);
}

// QuizPlayView wants { questionId: { [levelId]: question } }
export function quizEntriesForLevel(quiz, levelId) {
  const out = {};
  ((quiz && quiz[levelId]) || []).forEach((q, i) => {
    out[`q${i + 1}`] = { [levelId]: { question: q.question, choices: q.choices, correct: q.correct, reason: q.reason } };
  });
  return out;
}

export const issuanceQuizProgressKey = (issuanceId) => `issuance-${issuanceId}`;

// ── dev import / export ──────────────────────────────────────────────
function stripFences(text) {
  return String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

// A level that is NOT in the pasted JSON is left untouched, so you can import Level 1 now and Level 2 later.
export function importIssuanceQuizJson(text) {
  if (!IS_DEV) throw new Error("Import is only available in npm run dev.");
  let data;
  try { data = JSON.parse(stripFences(text)); } catch (e) { throw new Error("Invalid JSON: " + e.message); }
  const items = toItems(data);
  if (!items.length) throw new Error("The JSON is empty.");
  const normalized = items.map(normalizeQuiz); // throws before anything is saved
  const store = readPreviewRaw();
  const results = [];
  for (const n of normalized) {
    const prev = store[n.id] || {};
    const merged = {
      type: n.type,
      number: n.number,
      level1: n.level1.length ? n.level1 : prev.level1 || [],
      level2: n.level2.length ? n.level2 : prev.level2 || [],
    };
    store[n.id] = merged;
    results.push({
      id: n.id, label: n.label,
      l1: merged.level1.length, l2: merged.level2.length,
      found: !!getIssuance(n.id),
    });
  }
  writePreviewRaw(store);
  return results;
}

function yearOf(number) {
  return (String(number).match(/(\d{4})$/) || [])[1] || "";
}
function compare(a, b) {
  const ya = yearOf(a.number), yb = yearOf(b.number);
  if (ya !== yb) {
    if (!ya) return 1;
    if (!yb) return -1;
    return yb.localeCompare(ya);
  }
  return (parseInt(a.number, 10) || 0) - (parseInt(b.number, 10) || 0);
}

export function getPreviewQuizList() {
  return Object.values(getPreview())
    .map((q) => ({
      id: q.id, type: q.type, number: q.number, label: q.label,
      l1: q.level1.length, l2: q.level2.length,
      hasIssuance: !!getIssuance(q.id),
    }))
    .sort((a, b) => a.type.localeCompare(b.type) || compare(a, b));
}

export function deletePreviewQuiz(id) {
  const store = readPreviewRaw();
  delete store[id];
  writePreviewRaw(store);
}

export function clearPreviewQuiz() {
  if (IS_DEV) localStorage.removeItem(DEV_KEY);
}

export function exportIssuanceQuizJson(id) {
  const q = getAll()[id];
  return q ? JSON.stringify(toExportShape(q), null, 2) : "";
}

export function exportAllQuizJson(kind) {
  const t = String(kind).toUpperCase();
  const all = Object.values(getPreview()).filter((q) => q.type === t).sort(compare);
  return JSON.stringify(all.map(toExportShape), null, 2);
}

export function issuanceQuizFileName(id) {
  return `${id}-quiz.json`;
}

// ── template + prompt ────────────────────────────────────────────────
export const ISSUANCE_QUIZ_TEMPLATE = JSON.stringify(
  {
    type: "CMO",
    number: "00-2099",
    level1: [
      {
        question: "[Level 1] Ano ang tawag sa ... ayon sa CMO na ito?",
        choices: { A: "Choice A", B: "Choice B", C: "Choice C", D: "Choice D" },
        correct: "B",
        reason: "Paliwanag kung bakit B ang tama, kasama ang section/paragraph.",
      },
    ],
    level2: [
      {
        question: "[Level 2] A short real customs scenario (2-5 sentences). What is the correct action under this CMO?",
        choices: { A: "Choice A", B: "Choice B", C: "Choice C", D: "Choice D" },
        correct: "C",
        reason: "Why C is correct, citing the provision.",
      },
    ],
  },
  null,
  2
);

export const ISSUANCE_QUIZ_PROMPT = String.raw`🧠 CMO / CAO → QUIZ-JSON GENERATION PROMPT
You are an expert Philippine Customs Broker licensure-exam reviewer and question writer for the CMTA study app.
Create a 2-level multiple-choice quiz from the OFFICIAL TEXT of ONE Customs Memorandum Order (CMO) or Customs Administrative Order (CAO) pasted at the very bottom, and output ONE valid JSON object the app can import directly.

OUTPUT RULES
- Output ONLY the JSON. No markdown fences, no commentary before or after.
- Every question must be answerable from the pasted text alone. Never invent provisions, numbers, periods, fees or offices that are not in the text. Never contradict the CMTA.
- Every question is multiple choice with exactly 4 choices (A, B, C, D) and exactly ONE correct answer. Wrong choices must be plausible, never silly, and never "all of the above" or "none of the above".
- Spread the correct letters evenly across A, B, C and D. Do not make the longest choice the right one every time.
- No two questions may test the same fact. Cover the whole document (objective, scope, definitions, procedures, deadlines, requirements, penalties, effectivity), not just the first part.
- Plain text only. No real line breaks inside a JSON string.

LEVEL 1 — DEFINITION / IDENTIFICATION (key "level1", 10 questions)
- Language: simple Filipino (Taglish is fine). Keep legal terms in English.
- Straight from the text: definitions ("Ano ang tawag sa ..."), identification (who / what / which office / which document), numbers and periods (how many days, how much), and requirements. Short, direct questions.

LEVEL 2 — REAL CASE / PROBLEM SOLVING (key "level2", 10 questions)
- Language: English.
- Each question is a short realistic customs scenario (importer, broker, exporter, Customs officer, shipment, deadline, document) of 2 to 5 sentences, followed by a clear question: what is the correct action, ruling, deadline, document, or computation under this issuance?
- The student must APPLY the issuance, not just recall one sentence. Date counting or computations are welcome if the text gives the rule.
- Use fictional names and amounts. Do not repeat a Level 1 question.

"reason" (every question): 1 to 3 sentences saying why the answer is correct and, if useful, why the closest wrong choice is wrong. Cite the provision as printed (e.g. "Sec. 3.2" or "Par. 4"). Level 1 reason in Filipino, Level 2 reason in English.

FIELDS
Top level: type ("CMO" or "CAO"), number (exactly as in the document, e.g. "01-2020"), level1 (array), level2 (array).
Question: question (string), choices ({"A":"...","B":"...","C":"...","D":"..."}), correct (one letter: "A", "B", "C" or "D"), reason (string).

SHAPE EXAMPLE (structure only — replace all content)
{"type":"CMO","number":"01-2020","level1":[{"question":"...","choices":{"A":"...","B":"...","C":"...","D":"..."},"correct":"B","reason":"..."}],"level2":[{"question":"...","choices":{"A":"...","B":"...","C":"...","D":"..."},"correct":"C","reason":"..."}]}

Use 10 questions per level unless told otherwise. If the document is very short, write fewer, but never invent content to reach the count.

OFFICIAL TEXT (the only source of truth):
`;
```

## File: ./frontend/tailwind.config.js
```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 4px 14px -4px rgba(15,23,42,0.10)',
        soft: '0 8px 30px -12px rgba(15,23,42,0.25)',
        nav: '0 -6px 24px -10px rgba(15,23,42,0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
      },
      colors: {
        navy: { 950: '#0b1220', 900: '#0f172a', 800: '#152238', 700: '#1e3a5f' },
        gold: { 50: '#fdf8ec', 100: '#faedc4', 400: '#e0b94d', 500: '#c9a227', 600: '#a9841c' },
      },
    },
  },
  plugins: [],
}
```

## File: ./frontend/vite.config.js
```
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
});
```

## File: ./frontend/patch-admin-panel.js
```
const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 60));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak)');
}

try {
  patchFile('src/authContext.jsx', [
    [
      '        subscriptions: { CL: false, TL: false, CDP: false, PC: false },\n      };',
      '        subscriptions: { CL: false, TL: false, CDP: false, PC: false },\n        isAdmin: false,\n      };',
    ],
  ]);

  patchFile('src/payments.js', [
    [
      '{ id: "PC", label: "Practical Customs", price: 29, subjects: ["PC"] },',
      '{ id: "PC", label: "Practice Computation", price: 29, subjects: ["PC"] },',
    ],
  ]);

  patchFile('src/components/AccountOverlay.jsx', [
    [
      'const SUBJECT_LABELS = { CL: "Customs Law", TL: "Tariff Law", CDP: "Customs Declarant Practice", PC: "Practical Customs" };',
      'const SUBJECT_LABELS = { CL: "Customs Law", TL: "Tariff Law", CDP: "Customs Declarant Practice", PC: "Practice Computation" };',
    ],
  ]);

  patchFile('src/pages/ChapterBrowser.jsx', [
    [
      'import AccountButton from "../components/AccountButton";',
      'import AccountButton from "../components/AccountButton";\nimport AdminPanel from "./AdminPanel";\nimport { useAuth } from "../authContext";',
    ],
    [
      'export default function ChapterBrowser() {\n  const [view, setView] = useState("browse");',
      'export default function ChapterBrowser() {\n  const { profile } = useAuth();\n  const [view, setView] = useState("browse");',
    ],
    [
      '              <span className="flex-1" />',
      '              {profile?.isAdmin && (\n                <button onClick={() => setView("admin")} aria-label="Admin Panel" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "admin" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>\n                  👑\n                </button>\n              )}\n              <span className="flex-1" />',
    ],
    [
      'IS_DEV ? <DevPanel /> : view === "quiz"',
      'IS_DEV ? <DevPanel /> : view === "admin" && profile?.isAdmin ? <AdminPanel /> : view === "quiz"',
    ],
  ]);

  console.log('All patches applied. Run npm run build next.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file sa step na 'yon — i-paste mo lang ulit sa akin ang exact section, aayusin ko ang anchor.');
  process.exit(1);
}
```

## File: ./frontend/patch-mobile-width.js
```
const fs = require('fs');
const path = require('path');

function patchFile(relPath, edits) {
  const filePath = path.join(__dirname, relPath);
  let content = fs.readFileSync(filePath, 'utf8');
  fs.writeFileSync(filePath + '.bak', content);
  for (const [anchor, replacement] of edits) {
    const count = content.split(anchor).length - 1;
    if (count !== 1) {
      throw new Error('[' + relPath + '] Expected 1 match, found ' + count + ' for anchor: ' + anchor.slice(0, 60));
    }
    content = content.split(anchor).join(replacement);
  }
  fs.writeFileSync(filePath, content);
  console.log('Patched ' + relPath + ' (backup: ' + relPath + '.bak)');
}

try {
  patchFile('src/components/AccountOverlay.jsx', [
    [
      'fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center',
      'fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm',
    ],
    [
      'max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-slate-800 sm:max-w-sm sm:rounded-2xl',
      'max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-slate-800',
    ],
  ]);

  patchFile('src/pages/ChapterBrowser.jsx', [
    [
      'fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center',
      'fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm',
    ],
    [
      'max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-w-lg sm:rounded-3xl',
      'max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl dark:bg-slate-900',
    ],
    [
      '  chapter: "text-xl sm:text-2xl font-bold text-navy-900 dark:text-slate-50",\n  section: "text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-200",\n  paragraph: "text-base sm:text-lg text-slate-700 dark:text-slate-300",',
      '  chapter: "text-xl font-bold text-navy-900 dark:text-slate-50",\n  section: "text-lg font-semibold text-slate-800 dark:text-slate-200",\n  paragraph: "text-base text-slate-700 dark:text-slate-300",',
    ],
    [
      '<span aria-hidden>📘</span><span className="hidden sm:inline ml-1">Study</span>',
      '<span aria-hidden>📘</span><span className="hidden ml-1">Study</span>',
    ],
    [
      '<span aria-hidden>📖</span><span className="hidden sm:inline ml-1">Reading</span>',
      '<span aria-hidden>📖</span><span className="hidden ml-1">Reading</span>',
    ],
    [
      'fixed inset-0 z-[60] flex flex-col justify-end bg-slate-900/70 backdrop-blur-sm sm:items-center sm:justify-center',
      'fixed inset-0 z-[60] flex flex-col justify-end bg-slate-900/70 backdrop-blur-sm',
    ],
    [
      'w-full rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:max-w-md sm:rounded-3xl',
      'w-full rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-slate-900',
    ],
    [
      'const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);',
      'const [sidebarOpen, setSidebarOpen] = useState(false);',
    ],
    [
      'setSidebarOpen(window.innerWidth >= 768);',
      'setSidebarOpen(false);',
    ],
    [
      '<div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px] md:hidden" onClick={() => setSidebarOpen(false)} />',
      '<div className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1px]" onClick={() => setSidebarOpen(false)} />',
    ],
    [
      '<aside className={`safe-top fixed inset-y-0 left-0 z-40 w-[85vw] max-w-[320px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 md:static md:w-80 md:max-w-none md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>',
      '<aside className={`safe-top fixed inset-y-0 left-0 z-40 w-[85vw] max-w-[320px] overflow-y-auto overscroll-contain border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>',
    ],
    [
      '<span aria-hidden>📚</span><span className="hidden sm:inline ml-1">Browse</span>',
      '<span aria-hidden>📚</span><span className="hidden ml-1">Browse</span>',
    ],
    [
      '<span aria-hidden>🔍</span><span className="hidden sm:inline ml-1">Search</span>',
      '<span aria-hidden>🔍</span><span className="hidden ml-1">Search</span>',
    ],
    [
      '<span aria-hidden>📝</span><span className="hidden sm:inline ml-1">Quiz/Exam</span>',
      '<span aria-hidden>📝</span><span className="hidden ml-1">Quiz/Exam</span>',
    ],
    [
      '🎯 <span className="hidden sm:inline">Focus</span>',
      '🎯 <span className="hidden">Focus</span>',
    ],
    [
      '<main ref={mainRef} className="safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 dark:bg-slate-950 md:p-6">',
      '<main ref={mainRef} className="safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 dark:bg-slate-950">',
    ],
  ]);

  console.log('✅ Tapos na — wala nang sm:/md: breakpoint na nag-aauto-adjust base sa device width.');
} catch (err) {
  console.error('Patch failed: ' + err.message);
  console.error('Walang na-touch na file — i-paste mo ulit sa akin ang error, aayusin ko ang anchor.');
  process.exit(1);
}
```

