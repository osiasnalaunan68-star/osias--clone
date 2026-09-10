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
