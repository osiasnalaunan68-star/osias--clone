## File: ./codemagic.yaml
```
workflows:
  ra10863-android:
    name: RA10863 Android APK
    max_build_duration: 30
    environment:
      node: 22
      java: 21
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
      - name: Sync Capacitor Android
        script: |
          cd frontend
          npx cap sync android
      - name: Install capacitor-assets and generate app icon
        script: |
          cd frontend
          npm install @capacitor/assets --save-dev
          npx capacitor-assets generate --android
      - name: Build debug APK
        script: |
          cd frontend/android
          chmod +x gradlew
          ./gradlew assembleDebug
          echo "--- Searching for build output ---"
          find app/build/outputs -type f 2>/dev/null || echo "outputs dir missing"
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
const CACHE_NAME = "cmta-app-cache-v2";

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

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") {
          const shell = await caches.match(self.registration.scope);
          if (shell) return shell;
        }
        return Response.error();
      })
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

export function answersMatch(a, b) {
  return String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();
}

export const LEVELS = [
  { id: "level1", label: "🟢 Level 1 — Easy", tagalog: "Madali", color: "green" },
  { id: "level2", label: "🔵 Level 2 — Normal", tagalog: "Katamtaman", color: "blue" },
  { id: "level3", label: "🟠 Level 3 — Medium", tagalog: "Gitna", color: "orange" },
  { id: "level4", label: "🟣 Level 4 — Medium Pro", tagalog: "Gitnang Pro", color: "purple" },
  { id: "level5", label: "🔴 Level 5 — Will Done", tagalog: "Dalubhasa", color: "red" },
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

export function QuizLevelButton({ level, progress, onClick }) {
  const colorClass = LEVEL_BORDER[level.color] || LEVEL_BORDER.green;
  return (
    <button onClick={onClick} className={`flex items-center gap-4 rounded-xl border-2 p-4 w-full transition-all ${colorClass}`}>
      <ProgressCircle progress={progress} color={LEVEL_STROKE[level.color] || LEVEL_STROKE.green} />
      <div className="flex-1 text-left">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{level.label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{level.tagalog} · {progress > 0 ? `${Math.round(progress)}% completed` : "Not started"}</p>
      </div>
    </button>
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

// progressKey identifies WHERE to save/read progress (localStorage key
// `quiz_progress_${progressKey}`). Pass a stable id — a batch id while
// testing in Dev Panel, or the title string once baked into quizData.json.
export function QuizPlayView({ title, entries, level, onBack, progressKey, backLabel = "← Back" }) {
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
    if (progressKey) saveLastQuizPosition(progressKey, level);
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
import { PLANS, PAYMENT_METHODS, generateReferenceCode, submitPendingPurchase } from "../payments";

const SUBJECT_LABELS = { CL: "Customs Law", TL: "Tariff Law", CDP: "Customs Documentation & Procedures", PC: "Practical Computations" };

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
      alert("May error sa pag-submit. Subukan ulit:\n" + (err?.message || err));
    } finally {
      setSubmitting(false);
    }
  };

  const allSubscribed = Object.keys(SUBJECT_LABELS).every((code) => profile?.subscriptions?.[code]);
  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || null;

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
              Sign in para ma-unlock ang buong practice exam
            </p>
            <button
              onClick={signInWithGoogle}
              disabled={signingIn}
              className="w-full rounded-xl bg-navy-900 px-4 py-3 font-medium text-white disabled:opacity-50 dark:bg-navy-700"
            >
              {signingIn ? "Naghihintay sa Google..." : "Sign in with Google"}
            </button>
            {authError && <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>}
            <button onClick={() => setOverlayOpen(false)} className="text-sm text-slate-400">Cancel</button>
          </div>
        )}

        {!loading && user && deviceLimitReached && (
          <div className="space-y-3 py-2">
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">
              Naka-login na ang Google account mong ito sa 2 device
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mag-remove muna ng isang device sa baba para magamit dito.
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
            <p className="text-lg font-semibold text-navy-900 dark:text-slate-100">Ano ang buong pangalan mo?</p>
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
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Subscription</p>
              <div className="space-y-1.5">
                {Object.keys(SUBJECT_LABELS).map((code) => {
                  const unlocked = !!profile?.subscriptions?.[code];
                  const plan = PLANS.find((p) => p.id === code);
                  return (
                    <div key={code} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900/40">
                      <span className="text-slate-600 dark:text-slate-300">{SUBJECT_LABELS[code]}</span>
                      {unlocked ? (
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Unlocked</span>
                      ) : (
                        <button
                          onClick={() => startPurchase(plan)}
                          className="rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white active:bg-navy-800 dark:bg-navy-700"
                        >
                          Mag-subscribe ₱{plan.price}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {!allSubscribed && (
                <button
                  onClick={() => startPurchase(PLANS.find((p) => p.id === "BUNDLE"))}
                  className="mt-2 w-full rounded-lg border-2 border-gold-500 bg-gold-50 px-3 py-2 text-xs font-semibold text-navy-900 active:bg-gold-100 dark:border-gold-400 dark:bg-slate-900/40 dark:text-gold-400"
                >
                  🎁 Bundle — Lahat ng 4 Subjects ₱99
                </button>
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
                        {d.label} {d.id === currentDeviceId && <span className="text-emerald-600 dark:text-emerald-400">(ito)</span>}
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
            <button onClick={backToProfile} className="text-sm text-slate-400">← Bumalik</button>
            <div className="rounded-xl bg-slate-50 p-4 text-center dark:bg-slate-900/40">
              <p className="text-sm text-slate-500 dark:text-slate-400">{selectedPlan.label}</p>
              <p className="text-2xl font-bold text-navy-900 dark:text-slate-100">₱{selectedPlan.price}</p>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Piliin ang paraan ng pagbabayad:</p>
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
                <button onClick={backToMethods} className="text-sm text-slate-400">← Bumalik</button>
                <img
                  src={activeMethod.qr}
                  alt={`${activeMethod.label} QR code`}
                  className="mx-auto w-full max-w-[280px] rounded-xl border border-slate-100 dark:border-slate-700"
                />
                <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-950/30">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Reference Code — isulat sa payment note</p>
                  <p className="text-xl font-bold tracking-widest text-navy-900 dark:text-amber-400">{referenceCode}</p>
                </div>
                <p className="text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  1. I-scan ang QR gamit ang {activeMethod.label} app mo.<br />
                  2. Bayaran ang ₱{selectedPlan.price}, ilagay ang reference code sa note/message.<br />
                  3. Pindutin ang "Nabayaran ko na" sa baba.
                </p>
                <button
                  onClick={confirmPaid}
                  disabled={submitting}
                  className="w-full rounded-xl bg-navy-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 dark:bg-navy-700"
                >
                  {submitting ? "Sinusubmit..." : "✅ Nabayaran ko na"}
                </button>
              </>
            ) : (
              <div className="space-y-3 py-4 text-center">
                <span className="text-4xl" aria-hidden>⏳</span>
                <p className="font-semibold text-navy-900 dark:text-slate-100">Naka-pending na ang purchase mo</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ico-confirm ito manually sa loob ng ilang oras. Reference code: <span className="font-semibold">{referenceCode}</span>
                </p>
                <button
                  onClick={backToProfile}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 dark:border-slate-600 dark:text-slate-300"
                >
                  Bumalik sa Profile
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
import { useAuth } from "../authContext";

export default function AccountButton() {
  const { user, profile, setOverlayOpen } = useAuth();
  return (
    <button
      onClick={() => setOverlayOpen(true)}
      aria-label="Account"
      className="flex h-9 w-9 flex-shrink-0 touch-manipulation items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-base active:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:active:bg-slate-700"
    >
      {profile?.photoURL ? (
        <img src={profile.photoURL} alt="" className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden>👤</span>
      )}
    </button>
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
```

## File: ./frontend/src/main.jsx
```
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import ChapterBrowser from "./pages/ChapterBrowser";
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
        <ChapterBrowser />
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

export default function ChapterBrowser() {
  const { profile } = useAuth();
  const [view, setView] = useState("browse");
  const [titles, setTitles] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTitleNumber, setSelectedTitleNumber] = useState(null);
  const [chapterTree, setChapterTree] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [mode, setMode] = useState(() => localStorage.getItem(MODE_KEY) || "study");
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
  const mainRef = useRef(null);
  const pendingScrollRestore = useRef(null);
  const scrollSaveTimeout = useRef(null);

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
    if (!hasTutorialBeenSeen()) {
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
      alert(`✅ Na-download ang quiz-generation prompt para sa Title ${titleNumber} bilang .txt file.

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
            </div>
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
          </aside>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="safe-top sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className={`flex items-center gap-1.5 px-2 transition-all duration-300 ${focusMode && mode === "reading" ? "max-h-0 overflow-hidden opacity-0 py-0" : "max-h-16 py-2 opacity-100"}`}>
              {view === "browse" && (
                <button onClick={() => setSidebarOpen((v) => !v)} className="flex h-9 w-9 flex-shrink-0 touch-manipulation items-center justify-center rounded-full text-lg text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800" aria-label="Toggle chapter list">
                  {sidebarOpen ? "✕" : "☰"}
                </button>
              )}
              <div className="flex flex-shrink-0 rounded-full bg-slate-100 p-1 text-sm dark:bg-slate-800">
                <button onClick={() => setView("browse")} aria-label="Browse" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "browse" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                  <span aria-hidden>📚</span><span className="hidden sm:inline ml-1">Browse</span>
                </button>
                <button onClick={() => setView("search")} aria-label="Search" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "search" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                  <span aria-hidden>🔍</span><span className="hidden sm:inline ml-1">Search</span>
                </button>
                <button onClick={() => setView("quiz")} aria-label="Quiz/Exam" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "quiz" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                  <span aria-hidden>📝</span><span className="hidden sm:inline ml-1">Quiz/Exam</span>
                </button>
                <button onClick={() => setView("settings")} aria-label="Settings" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "settings" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                  ⚙️
                </button>
                {IS_DEV && (
                  <button onClick={() => setView("dev")} aria-label="Dev Panel" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "dev" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                    🛠
                  </button>
                )}
              </div>
              {profile?.isAdmin && (
                <button onClick={() => setView("admin")} aria-label="Admin Panel" className={`min-h-[34px] rounded-full px-2.5 py-1 font-medium transition-colors ${view === "admin" ? "bg-white text-navy-900 shadow-sm dark:bg-slate-700 dark:text-slate-50" : "text-slate-500 dark:text-slate-400"}`}>
                  👑
                </button>
              )}
              <span className="flex-1" />
              <AccountButton />
              {view === "browse" && <ModeToggle mode={mode} setMode={setMode} />}
            </div>
            {view === "browse" && !(focusMode && mode === "reading") && (
              <div className="px-3 pb-2">
                <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {chapterTree ? chapterTree.title || `Chapter ${chapterTree.node_number}` : "Select a chapter"}
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
            {view === "browse" && mode === "reading" && chapterTree && <ReadingProgressBar containerRef={mainRef} />}
          </div>
          <main ref={mainRef} className="safe-bottom flex-1 overflow-y-auto overscroll-contain bg-slate-50 p-4 dark:bg-slate-950 md:p-6">
            {error && (
              <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
                <p className="font-bold">⚠️ Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            {view === "search" ? <SearchView onNavigateChapter={loadChapter} /> : view === "dev" && IS_DEV ? <DevPanel /> : view === "admin" && profile?.isAdmin ? <AdminPanel /> : view === "quiz" ? null : view === "settings" ? <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} onReplayTutorial={replayTutorial} /> : (
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
        {focusMode && mode === "reading" && chapterTree && (
          <button
            onClick={() => setFocusMode(false)}
            className="fixed bottom-6 right-4 z-30 flex items-center gap-1.5 rounded-full bg-navy-900/90 px-4 py-2.5 text-sm font-medium text-white shadow-lg backdrop-blur active:bg-navy-800 dark:bg-slate-100/90 dark:text-navy-900"
          >
            <span aria-hidden>✕</span> Exit Focus
          </button>
        )}
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
import SubjectQuizPanel from "./SubjectQuizPanel";
import { FLAT_SUBJECTS } from "../data/subjects";

const TABS = [{ id: "ra10863", label: "RA10863" }, ...FLAT_SUBJECTS.map((s) => ({ id: s.id, label: s.label }))];

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

      {tab === "ra10863" ? (
        <QuizPanel />
      ) : (
        <SubjectQuizPanel subjectId={tab} subjectLabel={TABS.find((t) => t.id === tab)?.label || tab} />
      )}
    </div>
  );
}
```

## File: ./frontend/src/pages/QuizPage.jsx
```
import { useState, useEffect } from "react";
import staticQuizData from "../data/quizData.json";
import { getFlattenedEntries } from "../quizStore";
import { LEVELS, QuizLevelButton, QuizPlayView } from "../components/QuizShared";

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
    const ids = Object.keys(data).filter((id) => data[id] && data[id][levelId]);
    if (ids.length === 0) {
      alert(`No questions available for ${LEVELS.find((l) => l.id === levelId)?.label}.`);
      return;
    }
    onSelectLevel(title, data, levelId);
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
              <QuizLevelButton key={level.id} level={level} progress={progress[level.id] || 0} onClick={() => handleLevelSelect(level.id)} />
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
          Kapag tapos ka na sa isang batch, gamitin ang <strong>Export All</strong> tapos i-merge yung JSON sa
          <code className="mx-1 rounded bg-slate-100 px-1 dark:bg-slate-700">frontend/src/data/quizData.json</code>
          para ma-bundle na siya sa app at gumana offline para sa lahat ng users — kagaya ng ginawa mo na sa AI explanations.
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

// First N items (by sorted order) na libre bawat subject — lahat ng lagpas dito
// ay naka-lock hanggang mag-subscribe. Tugma sa pricing table sa handoff doc.
const FREE_LIMITS = { cl: 100, cdp: 100, tl: 100, pc: 150 };

function isItemUnlocked(idx, subjectId, profile) {
  const freeLimit = FREE_LIMITS[subjectId] ?? Infinity;
  if (idx < freeLimit) return true;
  return !!profile?.subscriptions?.[subjectId.toUpperCase()];
}

function LockedPrompt({ subjectLabel, onUnlock }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <span className="text-4xl" aria-hidden>🔒</span>
      <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Naka-lock ang item na ito</p>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
        Mag-subscribe para ma-unlock ang natitirang {subjectLabel} items.
      </p>
      <button
        onClick={onUnlock}
        className="mt-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm active:bg-navy-800 dark:bg-navy-700 dark:active:bg-navy-600"
      >
        Tingnan ang Subscription
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
    if (confirm(`Reset progress mo para sa ${subjectLabel}? Hindi mabubura ang mga imported questions, mga sagot mo lang.`)) {
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
          {stats.total > 0 ? `${stats.total} question${stats.total !== 1 ? "s" : ""} available` : "Wala pang naiimport na tanong"}
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
          <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-400 dark:bg-slate-900/40 dark:text-slate-500">Mag-import muna ng {subjectLabel} questions sa Dev Panel.</p>
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
          </div>
        )}
        {activeView?.type === "subject-play" && (
          <div className="mx-auto max-w-2xl p-4">
            <SubjectQuizPlay subjectId={activeView.subjectId} subjectLabel={activeView.label} onBack={backToHub} />
          </div>
        )}
        {activeView?.type === "ra10863-titles" && <QuizPage />}
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
      setSuccess(`✓ Imported. "${label}" batch saved — ${count} total items ngayon para sa ${subjectLabel}.`);
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
        Flat format, walang levels — isang entry per item number. Optional "_batch" label para
        ma-group ang import na ito (same "_batch" name = mag-me-merge, hindi mag-duduplicate).
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
        🔧 {open ? "Hide" : "Edit"} Raw Quiz JSON (advanced, lahat ng imported items)
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
    if (confirm(`Delete ALL ${getImportedCount(subjectId)} imported ${subjectLabel} items? Hindi na mababawi ito.`)) {
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
        {batches.length === 0 && <p className="text-sm italic text-slate-400 dark:text-slate-600">Wala pang imported na batch para sa {subjectLabel}.</p>}
        {batches.map((b) => <BatchCard key={b.id} subjectId={subjectId} batch={b} onChanged={refresh} />)}
      </div>
    </div>
  );
}
```

## File: ./frontend/src/pages/AdminPanel.jsx
```
import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { PLANS, PAYMENT_METHODS } from "../payments";

const SUBJECT_CODES = ["CL", "CDP", "TL", "PC"];
const SUBJECT_LABELS = Object.fromEntries(
  PLANS.filter((p) => p.id !== "BUNDLE").map((p) => [p.id, p.label])
);
const METHOD_LABELS = Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, m.label]));

const TRIAGE = {
  pending: { label: "Pending", dot: "bg-amber-500", chip: "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400" },
  none: { label: "None", dot: "bg-slate-400", chip: "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400" },
  subscribed: { label: "Subscribed", dot: "bg-emerald-500", chip: "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400" },
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

export default function AdminPanel() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [busyKey, setBusyKey] = useState(null);

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

  const toggleSubject = async (u, code) => {
    const key = u.uid + ":" + code;
    const nextValue = !u.subscriptions?.[code];
    setBusyKey(key);
    try {
      const ref = doc(db, "users", u.uid);
      const writePayload = { ["subscriptions." + code]: nextValue };
      let remainingPending = u.pendingPurchases || [];
      if (nextValue) {
        remainingPending = remainingPending.filter((p) => !(p.subjects || []).includes(code));
        writePayload.pendingPurchases = remainingPending;
      }
      await updateDoc(ref, writePayload);
      patchUser(u.uid, {
        subscriptions: { ...u.subscriptions, [code]: nextValue },
        pendingPurchases: remainingPending,
      });
    } catch (err) {
      console.warn("toggleSubject failed:", err);
      alert("May error sa pag-toggle. Subukan ulit:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  const setTriage = async (u, status) => {
    const key = u.uid + ":triage";
    setBusyKey(key);
    try {
      const ref = doc(db, "users", u.uid);
      await updateDoc(ref, { triageStatus: status });
      patchUser(u.uid, { triageStatus: status });
    } catch (err) {
      console.warn("setTriage failed:", err);
      alert("May error sa pag-set ng status. Subukan ulit:\n" + (err?.message || err));
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-slate-50">👑 Admin Panel</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          I-manage ang subscriptions at payment status ng users dito na, hindi na kailangan pumunta sa Firebase Console.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Maghanap ng pangalan o email..."
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          <p className="font-bold">⚠️ Hindi ma-load ang users</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {users !== null && !error && filtered.length === 0 && (
        <p className="py-8 text-center text-slate-400">Walang nahanap na user.</p>
      )}

      <div className="space-y-3">
        {filtered.map((u) => {
          const triage = defaultTriage(u);
          const t = TRIAGE[triage] || TRIAGE.none;
          return (
            <div key={u.uid} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-navy-900 dark:text-slate-100">{u.fullName || "(walang pangalan)"}</p>
                  <p className="truncate text-xs text-slate-400">{u.email}</p>
                </div>
                <span className={"flex flex-shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold " + t.chip}>
                  <span className={"h-2 w-2 rounded-full " + t.dot} aria-hidden />
                  {t.label}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {SUBJECT_CODES.map((code) => {
                  const unlocked = !!u.subscriptions?.[code];
                  const busy = busyKey === u.uid + ":" + code;
                  return (
                    <button
                      key={code}
                      onClick={() => toggleSubject(u, code)}
                      disabled={busy}
                      title={SUBJECT_LABELS[code]}
                      className={"min-h-[34px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 " + (unlocked ? "bg-emerald-600 text-white active:bg-emerald-700" : "bg-slate-100 text-slate-600 active:bg-slate-200 dark:bg-slate-900/40 dark:text-slate-300")}
                    >
                      {code} {unlocked ? "✓" : "✕"}
                    </button>
                  );
                })}
              </div>

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

              {(u.pendingPurchases || []).length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Pending Purchases</p>
                  {u.pendingPurchases.map((p, i) => {
                    const planLabel = PLANS.find((pl) => pl.id === p.plan)?.label || p.plan;
                    return (
                      <div key={i} className="rounded-lg bg-amber-50 px-3 py-2 text-xs dark:bg-amber-950/20">
                        <p className="font-semibold text-navy-900 dark:text-amber-300">
                          {planLabel} · ₱{p.price} · {METHOD_LABELS[p.method] || p.method}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">
                          Ref: {p.referenceCode} · {formatDateTime(p.requestedAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
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
        ? `Walang na-import: lahat ng ${skipped.length} item ay may kulang na "question" o "correct" answer (IDs: ${skipped.slice(0, 10).join(", ")}${skipped.length > 10 ? "…" : ""}).`
        : "Walang laman ang pinaste mong JSON."
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

const defaultDataMap = {
  cl: defaultCL,
  cdp: defaultCDP,
  tl: defaultTL,
  pc: defaultPC,
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
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut,
  setPersistence, indexedDBLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

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
  const [signingIn, setSigningIn] = useState(() => localStorage.getItem(PENDING_SIGNIN_KEY) === "1");
  const currentDeviceId = getOrCreateDeviceId();

  const syncProfile = useCallback(async (fbUser) => {
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
        subscriptions: { CL: false, TL: false, CDP: false, PC: false },
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
      console.warn("syncProfile failed (offline?):", err);
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY + fbUser.uid);
        if (cached) setProfile(JSON.parse(cached));
      } catch (_) {}
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
        setAuthError(`[${code}] ${msg || "Hindi na-process ang sign-in. Subukan ulit."}`);
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
    try {
      await signInWithRedirect(auth, googleProvider);
      // Page navigates away here — code after this line generally won't run.
    } catch (err) {
      console.warn("Google sign-in error:", err);
      const code = err?.code || "unknown-error";
      const msg = err?.message || "";
      setAuthError(`[${code}] ${msg || "Hindi na-process ang sign-in. Subukan ulit."}`);
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
    user, profile, loading, needsFullName, deviceLimitReached, currentDeviceId,
    overlayOpen, setOverlayOpen, authError, signingIn,
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
// Payment plans, method list, reference-code generator, at ang Firestore
// write para sa manual GCash/Maya/MariBank subscription flow (Phase 3).
// Walang automated payment gateway — dev mismo ang nagko-confirm ng bayad
// sa Firebase Console base sa reference code na tugma sa app amount niya.

import gcashQr from "./assets/payment/gcash-qr.png";
import mayaQr from "./assets/payment/maya-qr.png";
import maribankQr from "./assets/payment/maribank-qr.png";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

export const PLANS = [
  { id: "CL", label: "Customs Law", price: 39, subjects: ["CL"] },
  { id: "TL", label: "Tariff Law", price: 39, subjects: ["TL"] },
  { id: "CDP", label: "Customs Documentation & Procedures", price: 39, subjects: ["CDP"] },
  { id: "PC", label: "Practical Computations", price: 29, subjects: ["PC"] },
  { id: "BUNDLE", label: "Bundle — Lahat ng 4 Subjects", price: 99, subjects: ["CL", "TL", "CDP", "PC"] },
];

export const PAYMENT_METHODS = [
  { id: "gcash", label: "GCash", qr: gcashQr },
  { id: "maya", label: "Maya", qr: mayaQr },
  { id: "maribank", label: "MariBank", qr: maribankQr },
];

// Walang 0/O/1/I para di malito kapag isinusulat sa payment note.
const REF_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateReferenceCode(planId) {
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `${planId}-${suffix}`;
}

// Note: Firestore's serverTimestamp() is NOT allowed inside array elements
// (arrayUnion), kaya client Date.now() na lang ang ginamit dito.
export async function submitPendingPurchase(uid, { planId, subjects, price, method, referenceCode }) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    pendingPurchases: arrayUnion({
      plan: planId,
      subjects,
      price,
      method,
      referenceCode,
      requestedAt: Date.now(),
    }),
  });
}
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

