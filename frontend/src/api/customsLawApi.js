const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper to extract a human-readable message from FastAPI responses
async function handle(response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    // FastAPI sends 422 with detail: array of error objects
    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        // Build a string like: "body -> sections.0.section_number: field required"
        const messages = data.detail.map(
          (err) => `${err.loc?.join('.') || 'unknown'}: ${err.msg}`
        );
        throw new Error(messages.join('\n'));
      }
      throw new Error(data.detail);
    }
    throw new Error(`Request failed with status ${response.status}`);
  }
  return data;
}

// Dev Panel – preview & import
export async function previewChapter(mode, payload) {
  const res = await fetch(`${API_BASE}/api/dev/preview-chapter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, payload }),
  });
  return handle(res);
}

export async function importChapter(mode, payload, createdBy, fileName) {
  const res = await fetch(`${API_BASE}/api/dev/import-chapter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, payload, created_by: createdBy, file_name: fileName }),
  });
  return handle(res);
}

// Delete & export – use title_number + chapter_number
export async function deleteChapter(titleNumber, chapterNumber) {
  const url = titleNumber
    ? `${API_BASE}/api/dev/chapter/${chapterNumber}?title_number=${encodeURIComponent(titleNumber)}`
    : `${API_BASE}/api/dev/chapter/${chapterNumber}`;
  const res = await fetch(url, { method: "DELETE" });
  return handle(res);
}

export async function exportChapter(titleNumber, chapterNumber) {
  const url = titleNumber
    ? `${API_BASE}/api/dev/export-chapter/${chapterNumber}?title_number=${encodeURIComponent(titleNumber)}`
    : `${API_BASE}/api/dev/export-chapter/${chapterNumber}`;
  const res = await fetch(url);
  return handle(res);
}

// Dev history & status
export async function fetchHistory(limit = 50) {
  const res = await fetch(`${API_BASE}/api/dev/history?limit=${limit}`);
  return handle(res);
}

export async function fetchDatabaseStatus() {
  const res = await fetch(`${API_BASE}/api/dev/status/database`);
  return handle(res);
}

export async function fetchSearchIndexStatus() {
  const res = await fetch(`${API_BASE}/api/dev/status/search-index`);
  return handle(res);
}

export async function rebuildSearchIndex() {
  const res = await fetch(`${API_BASE}/api/dev/search-index/rebuild`, { method: "POST" });
  return handle(res);
}

export async function createBackup() {
  const res = await fetch(`${API_BASE}/api/dev/backup`, { method: "POST" });
  return handle(res);
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/api/dev/settings`);
  return handle(res);
}

export async function updateSettings(values) {
  const res = await fetch(`${API_BASE}/api/dev/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });
  return handle(res);
}

// Flat chapter list for Dev Panel
export async function fetchChapters() {
  const res = await fetch(`${API_BASE}/api/chapters/all`);
  return handle(res);
}
