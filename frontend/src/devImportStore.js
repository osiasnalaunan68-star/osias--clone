// Dev Panel storage: lets Osias paste AI-generated JSON (per chapter) and
// have it saved permanently in localStorage — independent of IS_DEV, and
// independent of whether the Dev Panel UI itself still exists in the code.
// getAiContext() in aiContext.js reads from here so imported entries keep
// working even after the Dev Panel tab is deleted from the app later.
//
// Chapter label: optional. Add a top-level "_chapter" key in the pasted
// JSON (e.g. { "_chapter": "Chapter 1", "393": {...} }) to name the batch
// in one paste. Skip it and a timestamp label is auto-assigned instead —
// rename anytime from the batch list.

const STORE_KEY = "customsLaw_aiContextImports";

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
      entries: parsed.entries || {},
    };
  } catch {
    return emptyStore();
  }
}

function saveStore(store) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function getImportedEntry(nodeId) {
  const store = loadStore();
  return store.entries[String(nodeId)] || null;
}

export function getAllBatches() {
  const store = loadStore();
  return Object.values(store.batches).sort((a, b) =>
    b.importedAt.localeCompare(a.importedAt)
  );
}

export function getBatchEntries(batchId) {
  const store = loadStore();
  const batch = store.batches[batchId];
  if (!batch) return [];
  return batch.nodeIds.map((id) => ({ id, ...(store.entries[id] || {}) }));
}

export function importChapterJson(jsonText) {
  const parsed = JSON.parse(jsonText);
  const rawLabel = parsed._chapter;
  if (parsed._chapter !== undefined) delete parsed._chapter;
  const ids = Object.keys(parsed);
  if (!ids.length) throw new Error("Walang laman ang JSON na na-paste.");
  const store = loadStore();
  for (const bId in store.batches) {
    store.batches[bId].nodeIds = store.batches[bId].nodeIds.filter(
      (id) => !ids.includes(id)
    );
  }
  for (const bId in store.batches) {
    if (store.batches[bId].nodeIds.length === 0) delete store.batches[bId];
  }
  const batchId = `b_${Date.now()}`;
  const fallback = `Import – ${new Date().toLocaleString("en-PH", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  })}`;
  const label = (rawLabel && String(rawLabel).trim()) || fallback;
  store.batches[batchId] = {
    id: batchId,
    label,
    importedAt: new Date().toISOString(),
    nodeIds: ids,
  };
  for (const id of ids) store.entries[id] = parsed[id];
  saveStore(store);
  return { batchId, count: ids.length, label };
}

export function renameBatch(batchId, newLabel) {
  const store = loadStore();
  if (!store.batches[batchId]) return;
  const trimmed = newLabel.trim();
  if (trimmed) store.batches[batchId].label = trimmed;
  saveStore(store);
}

export function updateEntry(nodeId, fields) {
  const store = loadStore();
  if (!store.entries[nodeId]) return;
  store.entries[nodeId] = { ...store.entries[nodeId], ...fields };
  saveStore(store);
}

export function deleteEntry(nodeId) {
  const store = loadStore();
  delete store.entries[nodeId];
  for (const bId in store.batches) {
    store.batches[bId].nodeIds = store.batches[bId].nodeIds.filter(
      (id) => id !== nodeId
    );
    if (store.batches[bId].nodeIds.length === 0) delete store.batches[bId];
  }
  saveStore(store);
}

export function deleteBatch(batchId) {
  const store = loadStore();
  const batch = store.batches[batchId];
  if (!batch) return;
  for (const id of batch.nodeIds) delete store.entries[id];
  delete store.batches[batchId];
  saveStore(store);
}

export function getExportAllJson() {
  const store = loadStore();
  return JSON.stringify(store.entries, null, 2);
}

export function saveRawEntries(jsonText) {
  const parsed = JSON.parse(jsonText);
  const store = loadStore();
  const newIds = Object.keys(parsed);
  for (const bId in store.batches) {
    store.batches[bId].nodeIds = store.batches[bId].nodeIds.filter((id) =>
      newIds.includes(id)
    );
    if (store.batches[bId].nodeIds.length === 0) delete store.batches[bId];
  }
  store.entries = parsed;
  saveStore(store);
}

export function clearAllImports() {
  saveStore(emptyStore());
}

export function getImportedCount() {
  return Object.keys(loadStore().entries).length;
}
