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
