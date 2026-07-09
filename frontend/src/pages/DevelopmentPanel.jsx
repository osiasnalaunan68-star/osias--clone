import { useState, useEffect, useCallback, useMemo } from "react";
import {
  previewChapter, importChapter, deleteChapter, exportChapter,
  fetchHistory, fetchDatabaseStatus, fetchSearchIndexStatus,
  rebuildSearchIndex, createBackup, fetchSettings, updateSettings, fetchChapters,
} from "../api/customsLawApi";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const EXAMPLE_JSON = `{
  "title_number": "I",
  "title_title": "TITLE I – PRELIMINARY PROVISIONS",
  "chapter_number": "1",
  "chapter_title": "SHORT TITLE",
  "sections": [
    {
      "section_number": "101",
      "section_title": "Short Title",
      "body": "This Act shall be known as the Customs Modernization and Tariff Act.",
      "keywords": ["short title"],
      "cross_references": [],
      "paragraphs": []
    }
  ]
}`;

const TABS = ["import", "links", "history", "backup", "search", "status", "settings"];

function romanToInt(s) {
  const values = { I:1, V:5, X:10, L:50, C:100 };
  let total = 0, prev = 0;
  for (let i = s.length-1; i >=0; i--) {
    const cur = values[s[i].toUpperCase()] || 0;
    if (cur < prev) total -= cur;
    else total += cur;
    prev = cur;
  }
  return total;
}

export default function DevelopmentPanel() {
  const [activeTab, setActiveTab] = useState("import");
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem" }}>
      <h1>RA 10863 Development Panel</h1>
      <nav style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontWeight: activeTab === tab ? "bold" : "normal" }}>
            {tab}
          </button>
        ))}
      </nav>
      {activeTab === "import" && <ImportTab />}
      {activeTab === "links" && <LinksTab />}
      {activeTab === "history" && <HistoryTab />}
      {activeTab === "backup" && <BackupTab />}
      {activeTab === "search" && <SearchIndexTab />}
      {activeTab === "status" && <StatusTab />}
      {activeTab === "settings" && <SettingsTab />}
    </div>
  );
}

function ImportTab() {
  const [jsonText, setJsonText] = useState(EXAMPLE_JSON);
  const [mode, setMode] = useState("create");
  const [previewResult, setPreviewResult] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [collapsedTitles, setCollapsedTitles] = useState({});

  const loadChapters = useCallback(async () => {
    try {
      setChapters(await fetchChapters());
    } catch (err) {
      setErrorMessage(err.message);
    }
  }, []);

  useEffect(() => { loadChapters(); }, [loadChapters]);

  async function handlePreview() {
    setErrorMessage(null);
    setImportResult(null);
    setIsBusy(true);
    try {
      const payload = JSON.parse(jsonText);
      setPreviewResult(await previewChapter(mode, payload));
    } catch (err) {
      setErrorMessage(err.message);
      setPreviewResult(null);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleImport() {
    setErrorMessage(null);
    setIsBusy(true);
    try {
      const payload = JSON.parse(jsonText);
      setImportResult(await importChapter(mode, payload, "admin", "manual-paste.json"));
      setPreviewResult(null);
      await loadChapters();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDelete(titleNumber, chapterNumber) {
    const label = titleNumber ? `${titleNumber}-${chapterNumber}` : chapterNumber;
    if (!confirm(`Delete chapter ${label}? A JSON backup will be created first.`)) return;
    setIsBusy(true);
    try {
      await deleteChapter(titleNumber, chapterNumber);
      await loadChapters();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleExport(titleNumber, chapterNumber) {
    try {
      const data = await exportChapter(titleNumber, chapterNumber);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chapter_${titleNumber ? titleNumber + "_" : ""}${chapterNumber}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  async function handleExportTitle(titleNumber) {
    try {
      const res = await fetch(`${API_BASE}/api/dev/export-title/${encodeURIComponent(titleNumber)}`);
      if (!res.ok) throw new Error("Export title failed");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `title_${titleNumber}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  const toggleTitleCollapse = (titleKey) => {
    setCollapsedTitles(prev => ({ ...prev, [titleKey]: !prev[titleKey] }));
  };

  const titleGroups = useMemo(() => {
    const map = {};
    chapters.forEach(ch => {
      const key = ch.title_number || "__root__";
      if (!map[key]) map[key] = [];
      map[key].push(ch);
    });
    const sortedKeys = Object.keys(map).sort((a, b) => {
      if (a === "__root__") return 1;
      if (b === "__root__") return -1;
      const aNum = romanToInt(a) || parseInt(a) || 0;
      const bNum = romanToInt(b) || parseInt(b) || 0;
      return aNum - bNum;
    });
    return sortedKeys.map(key => {
      const chaptersInTitle = map[key];
      const numericChapters = chaptersInTitle.map(ch => parseInt(ch.node_number)).filter(n => !isNaN(n));
      const maxChapter = numericChapters.length ? Math.max(...numericChapters) : 0;
      const missing = [];
      for (let i = 1; i <= maxChapter; i++) {
        if (!numericChapters.includes(i)) missing.push(i);
      }
      return {
        titleKey: key,
        titleNumber: key === "__root__" ? null : key,
        titleName: key === "__root__" ? "Chapters (no title)" : `TITLE ${key}`,
        chapters: chaptersInTitle,
        missingChapters: missing,
        chapterCount: chaptersInTitle.length,
        totalSections: chaptersInTitle.reduce((sum, ch) => sum + (ch.section_count || 0), 0),
      };
    });
  }, [chapters]);

  return (
    <div>
      <h2>Import Chapter</h2>
      <textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} rows={18}
        style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem" }} />
      <div style={{ margin: "0.75rem 0" }}>
        <label>
          Mode:{" "}
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="create">Create</option>
            <option value="replace">Replace</option>
            <option value="merge">Merge</option>
          </select>
        </label>
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button onClick={handlePreview} disabled={isBusy}>Validate / Preview</button>
        <button onClick={handleImport} disabled={isBusy}>{isBusy ? "Working..." : "Import"}</button>
      </div>
      {errorMessage && <p style={{ color: "crimson", whiteSpace: "pre-wrap" }}>{errorMessage}</p>}
      {previewResult && (
        <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "0.75rem" }}>
          <strong>{previewResult.valid ? "Valid" : "Invalid"}</strong>
          {previewResult.valid && <p>Would create ~{previewResult.diff.nodes_to_create} nodes.</p>}
          {previewResult.diff.warnings?.map((w, i) => <p key={i} style={{ color: "darkorange" }}>⚠ {w}</p>)}
          {previewResult.errors?.map((e, i) => <p key={i} style={{ color: "crimson" }}>{e}</p>)}
        </div>
      )}
      {importResult && (
        <p style={{ color: "green" }}>
          {importResult.message} — {importResult.nodes_created} created, {importResult.nodes_updated} updated, {importResult.duration_ms}ms.
        </p>
      )}

      <h2 style={{ marginTop: "2rem" }}>Chapters</h2>
      {titleGroups.map(group => (
        <div key={group.titleKey} style={{ marginBottom: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
          <div
            onClick={() => toggleTitleCollapse(group.titleKey)}
            style={{
              padding: "0.6rem 0.8rem",
              backgroundColor: "#f8f9fa",
              borderBottom: collapsedTitles[group.titleKey] ? "none" : "1px solid #ddd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            <span>
              {collapsedTitles[group.titleKey] ? "▶" : "▼"} {group.titleName}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "normal" }}>
                {group.chapterCount} chapter{group.chapterCount !== 1 ? "s" : ""}
                {group.totalSections > 0 && ` · ${group.totalSections} section${group.totalSections !== 1 ? "s" : ""}`}
              </span>
              {group.titleNumber && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleExportTitle(group.titleNumber); }}
                  style={{ fontSize: "0.8rem", padding: "0.15rem 0.5rem" }}
                >
                  Export Title
                </button>
              )}
            </span>
          </div>
          {!collapsedTitles[group.titleKey] && (
            <div style={{ padding: "0.4rem" }}>
              {group.chapters.map(ch => (
                <div key={ch.id} style={{ display: "flex", alignItems: "center", padding: "0.3rem 0.5rem", borderBottom: "1px solid #eee" }}>
                  <span style={{ flex: 1, fontSize: "0.9rem" }}>
                    <strong>{ch.node_number}.</strong> {ch.title}
                    <span style={{ marginLeft: "0.5rem", color: "#888", fontSize: "0.8rem" }}>
                      ({ch.section_count} section{ch.section_count !== 1 ? "s" : ""})
                    </span>
                  </span>
                  <span style={{ display: "flex", gap: "0.3rem" }}>
                    <button onClick={() => handleExport(ch.title_number, ch.node_number)} style={{ fontSize: "0.8rem", padding: "0.15rem 0.5rem" }}>Export</button>
                    <button onClick={() => handleDelete(ch.title_number, ch.node_number)} style={{ fontSize: "0.8rem", padding: "0.15rem 0.5rem" }}>Delete</button>
                  </span>
                </div>
              ))}
              {group.missingChapters.map(num => (
                <div key={`missing-${num}`} style={{ display: "flex", alignItems: "center", padding: "0.3rem 0.5rem", borderBottom: "1px solid #eee", backgroundColor: "#fff3cd", color: "#856404", fontSize: "0.85rem" }}>
                  <span style={{ flex: 1 }}>Chapter {num} — <em>not imported</em></span>
                  <span></span>
                </div>
              ))}
              {group.chapters.length === 0 && group.missingChapters.length === 0 && (
                <div style={{ padding: "0.5rem", color: "#888", fontStyle: "italic" }}>No chapters imported.</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LinksTab() {
  const [jsonText, setJsonText] = useState(`{
  "updates": [
    {
      "section_number": "100",
      "links": [
        { "text": "Bureau of Customs CMTA Full Text", "url": "https://customs.gov.ph" }
      ]
    }
  ]
}`);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleUpdateLinks() {
    setError(null);
    setResult(null);
    setIsBusy(true);
    try {
      const payload = JSON.parse(jsonText);
      const res = await fetch(`${API_BASE}/api/dev/bulk-links`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Request failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div>
      <h2>Update Links</h2>
      <p>Paste a JSON array of sections with their links. Each section is identified by its unique section number.</p>
      <textarea value={jsonText} onChange={(e) => setJsonText(e.target.value)} rows={18}
        style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem" }} />
      <div style={{ marginTop: "0.75rem" }}>
        <button onClick={handleUpdateLinks} disabled={isBusy}>
          {isBusy ? "Updating..." : "Update Links"}
        </button>
      </div>
      {error && <p style={{ color: "crimson", marginTop: "0.5rem" }}>{error}</p>}
      {result && <p style={{ color: "green", marginTop: "0.5rem" }}>{result.message}</p>}
    </div>
  );
}

function HistoryTab() {
  const [logs, setLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => { fetchHistory().then(setLogs).catch(err => setErrorMessage(err.message)); }, []);
  return (
    <div>
      <h2>Import History</h2>
      {errorMessage && <p style={{ color: "crimson" }}>{errorMessage}</p>}
      <table style={{ width: "100%", fontSize: "0.85rem" }}>
        <thead><tr><th>Started</th><th>Mode</th><th>Chapter</th><th>Status</th><th>Duration</th><th>Error</th></tr></thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.started_at}</td><td>{log.import_mode}</td><td>{log.chapter_number}</td>
              <td>{log.status}</td><td>{log.duration_ms ?? "-"}ms</td><td>{log.error_message ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BackupTab() {
  const [message, setMessage] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  async function handleBackup() {
    setIsBusy(true);
    try {
      const result = await createBackup();
      setMessage(`Backup created: ${result.file_path}`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsBusy(false);
    }
  }
  return (
    <div>
      <h2>Backup</h2>
      <p>Creates a full copy of the SQLite database file in the backups directory.</p>
      <button onClick={handleBackup} disabled={isBusy}>{isBusy ? "Backing up..." : "Create Backup Now"}</button>
      {message && <p>{message}</p>}
    </div>
  );
}

function SearchIndexTab() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const load = useCallback(() => {
    fetchSearchIndexStatus().then(setStatus).catch(err => setMessage(err.message));
  }, []);
  useEffect(() => { load(); }, [load]);
  async function handleRebuild() {
    setIsBusy(true);
    try {
      const result = await rebuildSearchIndex();
      setMessage(`Reindexed ${result.indexed_entries} entries.`);
      load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsBusy(false);
    }
  }
  return (
    <div>
      <h2>Search Index</h2>
      {status && <p>Indexed entries: {status.indexed_entries}</p>}
      <button onClick={handleRebuild} disabled={isBusy}>{isBusy ? "Rebuilding..." : "Full Reindex"}</button>
      {message && <p>{message}</p>}
    </div>
  );
}

function StatusTab() {
  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    fetchDatabaseStatus().then(setStatus).catch(err => setErrorMessage(err.message));
  }, []);
  return (
    <div>
      <h2>Database Status</h2>
      {errorMessage && <p style={{ color: "crimson" }}>{errorMessage}</p>}
      {status && (
        <div>
          <p>Total nodes: {status.total_nodes}</p>
          <p>Database size: {(status.database_size_bytes / 1024).toFixed(1)} KB</p>
          <p>Last successful import: {status.last_import_at ?? "none yet"}</p>
          <ul>
            {Object.entries(status.counts_by_type).map(([type, count]) => <li key={type}>{type}: {count}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const load = useCallback(() => {
    fetchSettings().then(setSettings).catch(err => setErrorMessage(err.message));
  }, []);
  useEffect(() => { load(); }, [load]);
  async function toggleBoolean(key, currentValue) {
    setIsBusy(true);
    try {
      const newValue = currentValue === "true" ? "false" : "true";
      setSettings(await updateSettings({ [key]: newValue }));
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsBusy(false);
    }
  }
  return (
    <div>
      <h2>Settings</h2>
      {errorMessage && <p style={{ color: "crimson" }}>{errorMessage}</p>}
      <ul>
        {settings.map(s => (
          <li key={s.key} style={{ marginBottom: "0.5rem" }}>
            <strong>{s.key}</strong>: {s.value}{" "}
            {(s.value === "true" || s.value === "false") && (
              <button disabled={isBusy} onClick={() => toggleBoolean(s.key, s.value)}>Toggle</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
