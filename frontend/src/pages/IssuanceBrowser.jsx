import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { AI_APPS, copyPromptAndOpen } from "../aiContext";
import { HighlightableContent, HighlightHint, NotePanel, useNodeHighlights, useNodeNotes } from "../components/ReaderParts";
import { IS_DEV } from "../env";
import { ISSUANCE_KINDS, STATUS_META, listIssuances, getIssuance, resolveIssuanceRef } from "../issuancesStore";
import { getIssuanceQuiz } from "../issuanceQuizStore";
import IssuanceQuizModal from "../components/IssuanceQuiz";

const INDENT_CLASS = ["ml-0", "ml-4", "ml-8", "ml-12", "ml-16"];

const IconSearch = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
  </svg>
);
const IconWrench = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 4.9L4 16.5V20h3.5l5.3-5.3a4 4 0 0 0 4.9-5.4l-2.6 2.6-2-2z" />
  </svg>
);
const IconSpark = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 3c.8 4 2.2 5.4 6.2 6.2-4 .8-5.4 2.2-6.2 6.2-.8-4-2.2-5.4-6.2-6.2 4-.8 5.4-2.2 6.2-6.2Z" />
  </svg>
);
const IconNote = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);
const IconQuiz = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 12l2.5 2.5L16 9" />
  </svg>
);
const IconHighlighter = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 21v-3.5L14.5 6a2.1 2.1 0 0 1 3 3L6 21H3Z" /><path d="M13 7l4 4" />
  </svg>
);
const IconCalendar = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3.5" y="4.5" width="17" height="16" rx="2" /><path d="M3.5 9.5h17M8 3v3M16 3v3" />
  </svg>
);

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
      <div className="mb-3 flex items-center gap-2 rounded-xl border border-parchment-200 bg-parchment px-3 dark:border-navy-700 dark:bg-navy-800">
        <span className="text-slate-400 dark:text-slate-500" aria-hidden><IconSearch className="h-4 w-4" /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${meta?.label || ""} (number, title, topic)`}
          style={{ fontSize: "16px" }}
          className="min-w-0 flex-1 border-none bg-transparent py-2 text-navy-900 placeholder:text-slate-400 focus:outline-none dark:text-parchment-50"
        />
        {q && <button onClick={() => setQ("")} className="text-slate-400" aria-label="Clear">✕</button>}
      </div>

      {items.length === 0 && (
        <div className="rounded-xl bg-parchment p-4 text-center text-sm text-slate-500 dark:bg-navy-800/60 dark:text-slate-400">
          <p className="mb-1 text-2xl" aria-hidden>{meta?.icon}</p>
          <p className="font-medium">No {meta?.label}s yet.</p>
          {IS_DEV && <p className="mt-1 flex items-center justify-center gap-1 text-xs"><IconWrench className="h-3 w-3" /> Import one in the Dev Panel → CMO / CAO tab.</p>}
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
              className="flex min-h-[40px] w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left active:bg-parchment dark:active:bg-navy-800"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-navy-800 dark:text-slate-300">
                {year} <span className="font-normal text-slate-400">· {list.length}</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">{collapsed ? "▸" : "▾"}</span>
            </button>
            {!collapsed && (
              <ul className="ml-1 space-y-0.5 border-l border-parchment-200 pl-2 dark:border-navy-800">
                {list.map((it) => {
                  const active = selectedId === it.id;
                  return (
                    <li key={it.id}>
                      <button
                        onClick={() => onSelect(it.id)}
                        className={`block min-h-[44px] w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? "bg-navy-900 font-medium text-white dark:bg-navy-700"
                            : "text-slate-600 active:bg-parchment dark:text-slate-400 dark:active:bg-navy-800"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="font-semibold">{it.label}</span>
                          {it.status !== "in_force" && (
                            <span className="text-[10px] uppercase tracking-wide opacity-70">{STATUS_META[it.status]?.label}</span>
                          )}
                          {it.hasAi && <span className="text-seal dark:text-gold-400" title="AI explanation available"><IconSpark className="h-3 w-3" /></span>}
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
  // lock the page behind the modal so only the modal itself scrolls
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const ask = async (app) => {
    const base =
      entry?.prompt?.trim() ||
      `Explain this provision of ${ref} (Philippine Bureau of Customs) in simple terms, with a practical customs example, why it exists, related provisions, and common board-exam traps.`;
    const prompt = `${base}\n\nOfficial text — ${ref}:\n"""\n${text}\n"""`;
    await copyPromptAndOpen(prompt, app.url);
    setCopiedApp(app.id);
    setTimeout(() => setCopiedApp(null), 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 p-3 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <div onClick={(e) => e.stopPropagation()} className="max-h-full w-full max-w-lg overflow-y-auto overscroll-contain rounded-xl bg-parchment-50 p-5 dark:bg-navy-900">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-seal text-seal dark:border-gold-400 dark:text-gold-400"><IconSpark className="h-5 w-5" /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Osias 6.7</p>
              <p className="text-xl font-extrabold leading-tight text-navy-900 dark:text-parchment-50">{entry?.title || title}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-slate-400 active:bg-parchment dark:text-slate-500 dark:active:bg-navy-800">✕</button>
        </div>

        {entry?.content ? (
          <p className="whitespace-pre-wrap rounded-lg bg-parchment p-3 text-base leading-relaxed text-slate-700 dark:bg-navy-800/60 dark:text-slate-200">{entry.content}</p>
        ) : (
          <p className="rounded-lg bg-parchment p-3 text-sm italic text-slate-400 dark:bg-navy-800/60 dark:text-slate-500">Osias 6.7 hasn't explained this part yet.</p>
        )}

        <div className="mt-4 border-t border-parchment-200 pt-3 dark:border-navy-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Still confused? Ask another AI</p>
          <div className="flex flex-wrap gap-2">
            {AI_APPS.map((app) => (
              <button key={app.id} onClick={() => ask(app)} className="flex min-h-[42px] items-center gap-1.5 rounded-full border border-parchment-200 bg-parchment-50 px-3.5 text-sm font-medium text-slate-700 active:bg-parchment dark:border-navy-700 dark:bg-navy-800 dark:text-slate-200 dark:active:bg-navy-700">
                <span aria-hidden>{app.icon}</span> {app.label}
              </button>
            ))}
          </div>
          {copiedApp && (
            <p className="mt-2 text-xs font-medium text-verdigris dark:text-verdigris-300">
              ✓ Prompt + official text copied — paste it in {AI_APPS.find((a) => a.id === copiedApp)?.label} and send.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
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
      className={`flex min-h-[36px] items-center gap-1.5 rounded-lg border px-3 py-1 text-sm font-medium transition-colors ${
        notesOpen
          ? "border-sky-400 bg-sky-100 text-sky-800 dark:border-sky-600 dark:bg-sky-900/40 dark:text-sky-300"
          : "border-sky-200 bg-sky-50 text-sky-700 active:bg-sky-100 dark:border-sky-700 dark:bg-sky-950/30 dark:text-sky-400 dark:active:bg-sky-950/50"
      }`}
    >
      <IconNote className="h-4 w-4" /> {notes.length > 0 ? `Notes (${notes.length})` : "Add Note"}
    </button>
  );
  const aiBtn = (
    <button
      onClick={askAi}
      className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400 dark:active:bg-purple-950/50"
    >
      <IconSpark className="h-4 w-4" /> Ask AI
    </button>
  );

  return (
    <div className={`${INDENT_CLASS[para.indent] || "ml-0"} ${reading ? "my-4" : "rounded-lg bg-parchment/70 p-3 dark:bg-navy-800/40"}`}>
      <div className="flex flex-col gap-1" style={{ fontSize: `${fontScale}rem` }}>
        {para.label && (
          <span className={`flex-shrink-0 select-none font-semibold tabular-nums text-slate-500 dark:text-slate-400 ${reading ? "font-serif leading-snug" : "leading-relaxed"}`}>
            {para.label}
          </span>
        )}
        <div className="w-full min-w-0">
          <HighlightableContent
            nodeId={nodeId}
            content={para.text}
            highlights={highlights}
            addHighlight={addHighlight}
            removeHighlight={removeHighlight}
            armed={armed}
            className={
              reading
                ? "select-text whitespace-pre-wrap font-serif leading-loose text-navy-900 dark:text-slate-300"
                : "select-text whitespace-pre-wrap rounded-lg leading-relaxed text-slate-700 dark:text-slate-300"
            }
          />
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-2 font-sans">
        {noteBtn}
        {aiBtn}
        {para.ai && <span className="text-[11px] font-medium text-verdigris dark:text-verdigris-300" title="AI explanation available">✓ explained</span>}
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
          <button key={i} onClick={() => onOpen(hit)} className="rounded-full border border-navy-200 bg-parchment-50 px-2.5 py-1 font-medium text-navy-800 active:bg-parchment dark:border-navy-700 dark:bg-navy-800 dark:text-gold-400">
            {r} →
          </button>
        ) : (
          <span key={i} className="rounded-full bg-parchment-200 px-2.5 py-1 text-slate-600 dark:bg-navy-700 dark:text-slate-300">{r}</span>
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
      <div className="mb-4 rounded-lg border border-parchment-200 bg-parchment-50 p-4 dark:border-navy-700 dark:bg-navy-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-navy-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white dark:bg-navy-700">{issuance.type}</span>
          <StatusBadge status={issuance.status} />
          {issuance.source === "preview" && <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-[11px] font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">DEV PREVIEW</span>}
        </div>
        <h1 className="mt-2 text-xl font-bold text-navy-900 dark:text-parchment-50">{issuance.label}</h1>
        {issuance.title && <p className="mt-1 text-base font-semibold text-slate-700 dark:text-slate-200">{issuance.title}</p>}
        {issuance.subject && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{issuance.subject}</p>}
        {(issuance.date_issued || issuance.effectivity) && (
          <p className="mt-2 flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            {issuance.date_issued && <span className="flex items-center gap-1"><IconCalendar className="h-3.5 w-3.5" /> Issued: {issuance.date_issued}</span>}
            {issuance.date_issued && issuance.effectivity && <span> · </span>}
            {issuance.effectivity && <span>Effectivity: {issuance.effectivity}</span>}
          </p>
        )}
        <RefChips title="Amends / revokes" refs={issuance.amends} onOpen={onOpenIssuance} />
        <RefChips title="Amended by" refs={issuance.amended_by} onOpen={onOpenIssuance} />
        <RefChips title="Related" refs={issuance.related} onOpen={onOpenIssuance} />
        {issuance.keywords.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {issuance.keywords.map((k) => <span key={k} className="rounded-full bg-parchment-200 px-2 py-0.5 text-xs text-slate-500 dark:bg-navy-700 dark:text-slate-400">{k}</span>)}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => openAi(`About ${issuance.label}`, fullText(issuance), issuance.ai)}
            className="flex min-h-[38px] items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 active:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
          >
            <IconSpark className="h-4 w-4" /> Ask AI — overview
          </button>
          {getIssuanceQuiz(issuance.id) && (
            <button
              onClick={() => setQuizOpen(true)}
              className="flex min-h-[38px] items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 active:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
            >
              <IconQuiz className="h-4 w-4" /> Quiz
            </button>
          )}
          {!reading && (
            <>
              <button onClick={() => setCollapsed({})} className="h-[38px] rounded-full border border-parchment-200 bg-parchment-50 px-3 text-sm font-medium text-slate-600 active:bg-parchment dark:border-navy-700 dark:bg-navy-800 dark:text-slate-300">⤢ Expand All</button>
              <button
                onClick={() => setCollapsed(Object.fromEntries(issuance.sections.map((s) => [s.id, true])))}
                disabled={allCollapsed}
                className="h-[38px] rounded-full border border-parchment-200 bg-parchment-50 px-3 text-sm font-medium text-slate-600 active:bg-parchment disabled:opacity-40 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-300"
              >
                ⤡ Collapse All
              </button>
            </>
          )}
        </div>
      </div>

      <HighlightHint className="mb-3" />

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
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-seal active:bg-parchment dark:text-gold-400 dark:active:bg-navy-800"
            aria-label="Ask AI about this section"
          >
            <IconSpark className="h-4 w-4" />
          </button>
        );

        if (reading) {
          return (
            <section key={sec.id} className="mb-6">
              {sec.heading && (
                <div className="flex items-start gap-2">
                  <h2 className="flex-1 font-serif font-bold text-navy-900 dark:text-parchment-50" style={{ fontSize: `${1.3 * fontScale}rem` }}>{sec.heading}</h2>
                  {secAi}
                </div>
              )}
              {paras}
            </section>
          );
        }
        return (
          <section key={sec.id} className="mb-3 rounded-lg border border-parchment-200 bg-parchment-50 p-3 dark:border-navy-700 dark:bg-navy-900">
            {sec.heading && (
              <div className="flex items-start gap-1">
                <button onClick={() => setCollapsed((p) => ({ ...p, [sec.id]: !p[sec.id] }))} aria-expanded={open} className="flex min-h-[40px] flex-1 items-start gap-2 text-left">
                  <span className={`mt-1 select-none text-slate-400 transition-transform duration-200 dark:text-slate-600 ${open ? "rotate-90" : ""}`}>▸</span>
                  <span className="text-base font-bold text-navy-900 dark:text-parchment-50 sm:text-lg">{sec.heading}</span>
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
