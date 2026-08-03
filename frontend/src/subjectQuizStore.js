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

// Mag-import ng isang flat batch para sa isang subject. Returns { count, label }.
export function importSubjectQuizJson(subjectId, jsonText) {
  const parsed = JSON.parse(jsonText);
  const rawLabel = parsed._batch;
  if (parsed._batch !== undefined) delete parsed._batch;
  if (parsed._title !== undefined) delete parsed._title; // fallback kung "_title" ang nagamit mo dati
  const ids = Object.keys(parsed);
  if (!ids.length) throw new Error("Walang laman ang pinaste mong JSON.");

  for (const id of ids) {
    const item = parsed[id];
    if (!item || typeof item !== "object") throw new Error(`Item "${id}" ay hindi valid na object.`);
    if (!item.question || typeof item.question !== "string") throw new Error(`Item "${id}" ay walang "question".`);
    if (!item.correct || typeof item.correct !== "string") throw new Error(`Item "${id}" ay walang "correct" answer.`);
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
  return { count: Object.keys(store.entries).length, label: label || "New batch" };
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
        importSubjectQuizJson(subjectId, jsonString);
        console.log(`✅ Seeded default quiz for ${subjectId}`);
      } catch (e) {
        console.warn(`Failed to seed ${subjectId}:`, e);
      }
    }
  }
}