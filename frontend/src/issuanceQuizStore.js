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
